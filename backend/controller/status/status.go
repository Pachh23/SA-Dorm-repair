package status

import (
	"fmt"
	"net/http"

	"dormitory.com/dormitory/config"
	"dormitory.com/dormitory/entity"
	"github.com/gin-gonic/gin"
)

// GET /list-status
func GetListStatus(c *gin.Context) {

	var sid entity.Students
	var reservation entity.Reservation
	studentID := c.MustGet("student_id").(string)
	if studentID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "student_id cannot be empty"})
		return
	}

	// เชื่อมต่อกับฐานข้อมูล
	db := config.DB()

	results := db.Where("student_id = ?", studentID).First(&sid)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Student not found"})
		return
	}

	db.Where("student_id = ?", sid.StudentID).First(&reservation)
	fmt.Println("Reservation ID:", reservation.ID)
	if reservation.StudentID == "" {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่มีการจองห้อง"})
		return
	}

	// สร้างตัวแปรสำหรับเก็บผลลัพธ์ของแต่ละฟอร์ม
	var delayedPaymentForms []entity.DelayedPaymentForm
	var enExitingForms []entity.En_ExitingForm
	var repairingForms []entity.Repairing
	var resigningForms []entity.ResigningForm

	// ดึงข้อมูลจากตาราง DelayedPaymentForm โดยใช้ student_id
	if err := db.Preload("Reservation.Dorm").Preload("Reservation.Room").Where("reservation_id = ?", reservation.ID).Find(&delayedPaymentForms).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get DelayedPaymentForm data"})
		return
	}

	// ดึงข้อมูลจากตาราง En_ExitingForm โดยใช้ student_id
	if err := db.Preload("Reservation.Dorm").Preload("Reservation.Room").Where("reservation_id = ?", reservation.ID).Find(&enExitingForms).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get EnExitingForm data"})
		return
	}

	// ดึงข้อมูลจากตาราง Repairing โดยใช้ student_id
	if err := db.Preload("Reservation.Dorm").Preload("Reservation.Room").Where("reservation_id = ?", reservation.ID).Find(&repairingForms).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get Repairing data"})
		return
	}

	// ดึงข้อมูลจากตาราง ResigningForm โดยใช้ student_id
	if err := db.Preload("Reservation.Student").Preload("Reservation.Dorm").Preload("Reservation.Room").Where("reservation_id = ?", reservation.ID).Find(&resigningForms).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get ResigningForm data"})
		return
	}

	// รวมข้อมูลทั้งหมดใน response
	response := gin.H{
		"delayed_payment_forms": delayedPaymentForms,
		"en_exiting_forms":      enExitingForms,
		"repairing_forms":       repairingForms,
		"resigning_forms":       resigningForms,
	}

	// ส่งข้อมูล response กลับในรูปแบบ JSON
	c.JSON(http.StatusOK, response)
}
