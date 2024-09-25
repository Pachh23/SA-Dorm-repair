package repairing

import (
	"net/http"

	"dormitory.com/dormitory/config"
	"dormitory.com/dormitory/entity"
	"github.com/gin-gonic/gin"
)

func CreateRepair(c *gin.Context) {
	var repairing entity.Repairing
	var sid entity.Students
	var reservation entity.Reservation

	studentID := c.MustGet("student_id").(string)
	if studentID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่มีรหัสนักศึกษา"})
		return
	}

	db := config.DB()
	results := db.Where("student_id = ?", studentID).First(&sid)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "หารหัสนักศึกษาไม่เจอ"})
		return
	}

	db.Where("student_id ?", sid.StudentID).First(&reservation)
	if reservation.StudentID == "" {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่มีการจองห้อง"})
		return
	}

	if err := c.ShouldBindJSON(&repairing); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	rp := entity.Repairing{
		Title:            repairing.Title,
		Type:             "แจ้งซ่อม",
		Date_Submission:  repairing.Date_Submission,
		Detail:           repairing.Detail,
		Image:            repairing.Image,
		Location_Details: repairing.Location_Details,
		Contact:          repairing.Contact,
		Time_Slot:        repairing.Time_Slot,
		Remarks:          repairing.Remarks,
		Status:           "รอดำเนินการ",
		ReservationID:    reservation.ID,
		Reservation:      reservation,
	}

	if err := db.Create(&rp).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": rp})
}

// GET /Repairing/:id
func GetRepair(c *gin.Context) {
    ID := c.Param("id")
    var repairing entity.Repairing

    db := config.DB()
    if err := db.Preload("Reservation").Preload("Reservation.Room").Preload("Reservation.Student").Preload("Reservation.Dorm").First(&repairing, ID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Repairing not found or related data error"})
        return
    }

    c.JSON(http.StatusOK, repairing)
}
func GetListRepairs(c *gin.Context) {
	var repairings []entity.Repairing

	db := config.DB()
	if err := db.Preload("Reservation").Preload("Reservation.Dorm").Preload("Reservation.Room").Preload("Reservation.Student").Find(&repairings).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No repairings found or related data error"})
		return
	}

	c.JSON(http.StatusOK, repairings)
}

func UpdateRepair(c *gin.Context) {
	id := c.Param("id")
	var payload struct {
		Status string `json:"status"` // รับเฉพาะ status จาก JSON payload
	}

	db := config.DB()

	// ดึง adminID จาก context
	adminID, exists := c.Get("admin_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Admin ID not found in context"})
		return
	}

	// Find the existing repair record
	var existingRepair entity.Repairing
	result := db.First(&existingRepair, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ID not found"})
		return
	}

	// Bind the JSON payload to the `payload` object
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	// Update only the 'Status' field
	if err := db.Model(&existingRepair).Updates(map[string]interface{}{
		"Status":  payload.Status,
		"AdminID": adminID, // บันทึก adminID ที่อัปเดตสถานะ
	}).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to update status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Status updated successfully"})
}