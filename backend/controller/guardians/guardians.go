package guardians

import (
	"net/http"

	"dormitory.com/dormitory/config"
	"dormitory.com/dormitory/entity"
	"github.com/gin-gonic/gin"
)

func GetAll(c *gin.Context) {
	db := config.DB()
	var guardians []entity.Guardians
	db.Find(&guardians)
	c.JSON(http.StatusOK, &guardians)
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