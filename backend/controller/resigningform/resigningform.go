package resigningform

import (
	"net/http"

	"dormitory.com/dormitory/config"
	"dormitory.com/dormitory/entity"
	"github.com/gin-gonic/gin"
)

func CreateResigningForm(c *gin.Context) {
	var resigningform entity.ResigningForm
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

	// ดึงข้อมูล reservation โดยใช้ StudentsID
	db.Where("student_id = ?", sid.StudentID).First(&reservation)
	if reservation.StudentID == "" {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่มีการจองห้อง"})
		return
	}
	if err := c.ShouldBindJSON(&resigningform); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	rs := entity.ResigningForm{
		Title:           "ฟอร์มลาออกหอพัก",
		Type:            "ฟอร์มเอกสาร",
		Date_Submission: resigningform.Date_Submission,
		Because_Of:      resigningform.Because_Of,
		Accommodation:   resigningform.Accommodation,
		Status:          "รอดำเนินการ",
		ReservationID:   reservation.ID,
		Reservation:     reservation,
	}

	if err := db.Create(&rs).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": rs})
}

// GET /Repairing/:id
func GetResigningForm(c *gin.Context) {
	ID := c.Param("id")
	var ResigningForm entity.ResigningForm

	db := config.DB()
	if err := db.Preload("Reservation").Preload("Reservation.Room").Preload("Reservation.Student").Preload("Reservation.Dorm").First(&ResigningForm, ID).Error; err != nil{
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, ResigningForm)
}

// GET /Repairings
func ListResigningForm(c *gin.Context) {
	var ResigningForm []entity.ResigningForm

	db := config.DB()
	if err := db.Preload("Reservation").Preload("Reservation.Dorm").Preload("Reservation.Room").Preload("Reservation.Student").Find(&ResigningForm).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, ResigningForm)
}

// PATCH /repairings
func UpdateResigningForm(c *gin.Context) {
	id := c.Param("id")
	var payload struct {
		Status string `json:"status"` // รับเฉพาะ status จาก JSON payload
	}

	db := config.DB()
	adminID, exists := c.Get("admin_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Admin ID not found in context"})
		return
	}

	// Find the existing repair record
	var existingResigningForm entity.ResigningForm
	result := db.First(&existingResigningForm, id)
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
	if err := db.Model(&existingResigningForm).Updates(map[string]interface{}{
		"Status":  payload.Status,
		"AdminID": adminID, // บันทึก adminID ที่อัปเดตสถานะ
	}).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to update status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Status updated successfully"})
}