package slip

import (
	"net/http"

	"dormitory.com/dormitory/config"
	"dormitory.com/dormitory/entity"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)
type ExpenseWithSlip struct {
    Expense entity.Expense `gorm:"embedded"` // ใช้ `embedded` ถ้าคุณต้องการให้ GORM สร้างฟิลด์ทั้งหมดจาก Expense
    Slip    entity.Slip    `gorm:"embedded"` // ใช้ `embedded` ถ้าคุณต้องการให้ GORM สร้างฟิลด์ทั้งหมดจาก Slip
}

// POST /users
func CreateSlip(c *gin.Context) {
	var slip entity.Slip
	var sid entity.Students
	var reservation entity.Reservation

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

	db.Where("student_id = ?", sid.StudentID).First(&reservation)
	if reservation.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Reservation not found"})
		return
	}

	if err := c.ShouldBindJSON(&slip); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	rp := entity.Slip{
		Path:          slip.Path,
		ReservationID: reservation.ID,
		Reservation:   &reservation,
	}

	if err := db.Create(&rp).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Created successfully", "data": rp})
}

// GET /Slip/:id
func GetSlip(c *gin.Context) {
	ID := c.Param("id")
	var slip entity.Slip

	db := config.DB()
	if err := db.Preload("Expense").First(&slip, ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, slip)
}

// GET /Slip
func GetListSlips(c *gin.Context) {
	var slips []entity.Slip

	db := config.DB()
	if err := db.Preload("Expense").Find(&slips).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, slips)
}

// PATCH /slip
func UpdateSlip(c *gin.Context) {
	var slip entity.Slip
	id := c.Param("id")

	db := config.DB()
	result := db.First(&slip, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ID not found"})
		return
	}

	if err := c.ShouldBindJSON(&slip); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	if err := db.Save(&slip).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successfully"})
}

func GetSlipsWithUncompletedStatus(c *gin.Context) {
    db := config.DB()

    // เรียกใช้งานฟังก์ชันที่ดึงข้อมูล slip ที่สถานะไม่เป็น 'complet'
    slips, err := getSlipsWithUncompletedStatusFromDB(db)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch slips"})
        return
    }

    c.JSON(http.StatusOK, slips)
}

// ฟังก์ชันดึงข้อมูลจากฐานข้อมูล
func getSlipsWithUncompletedStatusFromDB(db *gorm.DB) ([]ExpenseWithSlip, error) {
    var results []ExpenseWithSlip

    err := db.Table("expenses").
        Joins("JOIN slips ON slips.reservation_id = expenses.reservation_id").
        Where("expenses.status != ?", "ชำระแล้ว").
        Select("expenses.*, slips.*").
        Scan(&results).Error // ใช้ Scan แทน Find เพื่อแคสข้อมูลที่ไม่ตรงกัน

    if err != nil {
        return nil, err
    }

    return results, nil
}
