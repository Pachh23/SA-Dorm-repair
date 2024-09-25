package en_exitingform

import (
	"net/http"

	"dormitory.com/dormitory/config"
	"dormitory.com/dormitory/entity"
	"github.com/gin-gonic/gin"
)

func CreateEn_ExitingForm(c *gin.Context) {
	var en_exitingform entity.En_ExitingForm
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


	db.Where("student_id = ?", sid.StudentID).First(&reservation)
	if reservation.StudentID == "" {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่มีการจองห้อง"})
		return
	}
	if err := c.ShouldBindJSON(&en_exitingform); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ee := entity.En_ExitingForm{
		Title:           "ฟอร์มขออนุญาติเข้า-ออกหอพัก",
		Type:            "ฟอร์มเอกสาร",
		Date_Submission: en_exitingform.Date_Submission,
		Request:         en_exitingform.Request,
		Because_Of:      en_exitingform.Because_Of,
		Date_Request:    en_exitingform.Date_Request,
		Status:          "รอดำเนินการ",
		ReservationID:   reservation.ID,
		Reservation:     reservation,
	}
	if err := db.Create(&ee).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": ee})
}
// GET /En_ExitingForm/:id
func GetEn_ExitingForm(c *gin.Context) {
	ID := c.Param("id")
	var En_ExitingForm entity.En_ExitingForm

	db := config.DB()
	if err := db.Preload("Reservation").Preload("Reservation.Room").Preload("Reservation.Student").Preload("Reservation.Dorm").First(&En_ExitingForm, ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, En_ExitingForm)
}

// GET /En_ExitingForm
func ListEn_ExitingForm(c *gin.Context) {
	var En_ExitingForm []entity.En_ExitingForm

	db := config.DB()
	if err := db.Preload("Reservation").Preload("Reservation.Dorm").Preload("Reservation.Room").Preload("Reservation.Student").Find(&En_ExitingForm).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, En_ExitingForm)
}

// PATCH /En_ExitingForm
func UpdateEn_ExitingForm(c *gin.Context) {
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

	// Find the existing En_ExitingForm record
	var existingexistingEn_ExitingForm entity.En_ExitingForm
	result := db.First(&existingexistingEn_ExitingForm, id)
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
	if err := db.Model(&existingexistingEn_ExitingForm).Updates(map[string]interface{}{
		"Status":  payload.Status,
		"AdminID": adminID, // บันทึก adminID ที่อัปเดตสถานะ
	}).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to update status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Status updated successfully"})
}