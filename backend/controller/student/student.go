package student

import (
	"errors"
	"net/http"

	"dormitory.com/dormitory/config"
	"dormitory.com/dormitory/entity"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)


// POST /student-create
func CreateStudent(c *gin.Context) {
	var student entity.Students

	// bind เข้าตัวแปร student
	if err := c.ShouldBindJSON(&student); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	var studentCheck entity.Students
	// Check if the student with the provided StudentID already exists
	result := db.Where("student_id = ?", student.StudentID).First(&studentCheck)
	if result.Error != nil && !errors.Is(result.Error, gorm.ErrRecordNotFound) {
		// If there's a database error other than "record not found"
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	if studentCheck.ID != 0 {
		// If the student with the provided StudentID already exists
		c.JSON(http.StatusConflict, gin.H{"error": "StudentID is already "})
		return
	}

	// เข้ารหัสลับรหัสผ่านที่ผู้ใช้กรอกก่อนบันทึกลงฐานข้อมูล
	hashedPassword, _ := config.HashPassword(student.Password)

	// สร้าง students
	students := entity.Students{
		StudentID: student.StudentID,
		FirstName: student.FirstName, // ตั้งค่าฟิลด์ FirstName
		LastName:  student.LastName,  // ตั้งค่าฟิลด์ LastName
		Password:  hashedPassword,
		Birthday:  student.Birthday,
		Year:      student.Year,
		Major:     student.Major,
		GenderID:  student.GenderID,
	}

	// บันทึก
	if err := db.Create(&students).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": students})
}

// function Get โดยในตัวอย่างเป็นการตั้งใจใช้คำสั่ง SELECT … WHERE id =... เพื่อดึงข้อมูล student ออกมาตาม primary key ที่กำหนด ผ่าน func DB.Raw(...)
// GET /get-student/:id
func GetStudent(c *gin.Context) {
	ID := c.Param("id")
	var student entity.Students

	db := config.DB()
	results := db.Preload("Gender").First(&student, ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	if student.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, student)
}

// GET /list-student
func ListStudent(c *gin.Context) {

	var students []entity.Students

	db := config.DB()
	results := db.Preload("Gender").Find(&students)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, students)
}

// DELETE /delete-student/:id
func DeleteStudent(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	// Begin a transaction to ensure atomicity
	tx := db.Begin()

	// Delete records from related tables first

	if err := tx.Exec("DELETE FROM personals WHERE student_id = ?", id).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete personal information"})
		return
	}

	if err := tx.Exec("DELETE FROM families WHERE student_id = ?", id).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete personal information"})
		return
	}

	if err := tx.Exec("DELETE FROM addresses WHERE student_id = ?", id).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete address"})
		return
	}

	if err := tx.Exec("DELETE FROM others WHERE student_id = ?", id).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete other information"})
		return
	}

	// Delete the student record
	if tx := tx.Exec("DELETE FROM students WHERE id = ?", id); tx.RowsAffected == 0 {
		tx.Rollback()
		c.JSON(http.StatusBadRequest, gin.H{"error": "student ID not found"})
		return
	}

	// Commit the transaction if all operations succeed
	tx.Commit()

	c.JSON(http.StatusOK, gin.H{"message": "ลบข้อมูลสำเร็จ"})
}

// PATCH /update-student
func UpdateStudent(c *gin.Context) {
	var student entity.Students
	StudentID := c.Param("id")
	db := config.DB()
	result := db.First(&student, StudentID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}
	if err := c.ShouldBindJSON(&student); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}
	result = db.Save(&student)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

func GetListFormStudent(c *gin.Context) {
	var sid entity.Students

	studentID := c.MustGet("student_id").(string)
	if studentID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "student_id cannot be empty"})
		return
	}

	db := config.DB()
	results := db.Where("student_id = ?", studentID).First(&sid)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Student not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"student": sid,
	})
}

func GetListFormDorm(c *gin.Context) {
	var reservation entity.Reservation

	studentID := c.MustGet("student_id").(string)
	if studentID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "student_id cannot be empty"})
		return
	}

	db := config.DB()

	// ค้นหา Reservation และ Preload ความสัมพันธ์
	db.Where("student_id = ?", studentID).
		Preload("Dorm").
		Preload("Room").
		First(&reservation)
	if reservation.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Reservation not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"reservation": reservation,
	})
}

// GetStudentsByRoomID ดึงข้อมูลนักศึกษาจากห้อง
func GetStudentsByRoomID(c *gin.Context) {
	roomID := c.Param("room_id")

	var reservations []entity.Reservation
	var students []entity.Students

	db := config.DB()
	// ดึงข้อมูลการจองจากฐานข้อมูล
	if err := db.Where("room_id = ?", roomID).Preload("Student").Find(&reservations).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "ไม่พบข้อมูลนักศึกษา"})
		return
	}

	// สร้าง slice ของนักศึกษาจากการจอง
	for _, reservation := range reservations {
		var student entity.Students
		// ดึงข้อมูลนักศึกษาโดยใช้ StudentID
		db.Where("student_id = ?", reservation.StudentID).First(&student)
		students = append(students, student)
	}

	c.JSON(http.StatusOK, students)
}