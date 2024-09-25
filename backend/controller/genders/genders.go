package genders

import (
	"net/http"

	"dormitory.com/dormitory/config"
	"dormitory.com/dormitory/entity"
	"github.com/gin-gonic/gin"
)

func GetAll(c *gin.Context) {
	db := config.DB() // เชื่อมต่อฐานข้อมูล
	var genders []entity.Genders // สร้าง slice สำหรับเก็บข้อมูลเพศ
	if err := db.Find(&genders).Error; err != nil { // ตรวจสอบการดึงข้อมูล
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, genders) // ส่งข้อมูลเพศไปยัง client
}

func GetGenderByStudentID(c *gin.Context) {
    // รับ ID ของนักศึกษา
    studentID := c.Param("id")

    // เชื่อมต่อกับฐานข้อมูล
    db := config.DB()
    var student entity.Students // สมมุติว่ามีโครงสร้างข้อมูล Student

    // ค้นหาข้อมูลนักศึกษาตาม ID
    if err := db.First(&student, studentID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Student not found"})
        return
    }

    // ส่งข้อมูลเพศกลับไป
    c.JSON(http.StatusOK, gin.H{"gender": student.Gender}) // สมมุติว่า field Gender เก็บข้อมูลเพศ
}