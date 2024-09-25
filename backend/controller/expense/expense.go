package expense

import (
	"net/http"

	"dormitory.com/dormitory/config"
	//"dormitory.com/dormitory/controller/dorm"
	"dormitory.com/dormitory/entity"
	"github.com/gin-gonic/gin"
)

func CreateExpense(c *gin.Context) {
	var expense entity.Expense
	var dorm entity.Dorm
	var reservation entity.Reservation
	var waterfee entity.WaterFee
	var electricityfee entity.ElectricityFee

	db := config.DB()
	studentID := c.MustGet("student_id").(string)
	if studentID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "student_id cannot be empty"})
		return
	}

	// ค้นหาการจองห้อง
	db.Where("student_id = ?", studentID).First(&reservation)
	if reservation.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Reservation not found"})
		return
	}

	// ค้นหา Dorm ที่เชื่อมโยงกับ Reservation
	db.Where("id = ?", reservation.DormID).First(&dorm)
	if dorm.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Dorm not found"})
		return
	}

	// ตรวจสอบประเภทของ Dorm ผ่าน Reservation
	switch dorm.DormName {
	case "หอพักชาย 1", "หอพักหญิง 3":
		dorm.Amount = 6500.00 // ราคา 6500 สำหรับหอพักชาย 1 และหอพักหญิง 3
	case "หอพักชาย 2", "หอพักหญิง 4":
		dorm.Amount = 2900.00 // ราคา 2900 สำหรับหอพักชาย 2 และหอพักหญิง 4
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid dorm type"})
		return
	}

	// ค้นหาค่าน้ำ
	db.Where("reservation_id = ?", 1).First(&waterfee)
	if waterfee.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Water fee not found"})
		return
	}

	// ค้นหาค่าไฟฟ้า
	db.Where("reservation_id = ?", 1).First(&electricityfee)
	if electricityfee.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Electricity fee not found"})
		return
	}

	// ตรวจสอบข้อมูลที่ส่งมา
	if err := c.ShouldBindJSON(&expense); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// คำนวณยอดรวมทั้งหมด (ใช้ dormRate สำหรับค่าหอพัก)
	totalAmount := dorm.Amount + waterfee.Amount + electricityfee.Amount

	rp := entity.Expense{
		Date:             expense.Date,
		Status:          "กำลังดำเนินการ",
		DormID:           dorm.ID,
		Dorm:             &dorm,
		WaterFeeID:       waterfee.ID,
		WaterFee:         &waterfee,
		ElectricityFeeID: electricityfee.ID,
		ElectricityFee:   &electricityfee,
		TotalAmount:      totalAmount,
		ReservationID:    reservation.ID,
		Reservation:      reservation,
	}

	if err := db.Create(&rp).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// ส่งข้อมูลออกไป
	c.JSON(http.StatusCreated, gin.H{
		"message":     "Created success",
		"data":        rp,
		"totalAmount": totalAmount, // ส่งยอดรวมทั้งหมดกลับไปด้วย
	})
}

// GetExpense - ดึงข้อมูลค่าใช้จ่ายตาม ID
func GetExpense(c *gin.Context) {
	var expense entity.Expense
	expenseID := c.Param("id")

	db := config.DB()
	if err := db.First(&expense, expenseID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Expense not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": expense})
}

func ListExpense(c *gin.Context) {
	// ตรวจสอบโทเค็นการเข้าถึง
	token := c.GetHeader("Authorization")
	if token == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// ประมวลผลโทเค็นการเข้าถึงและตรวจสอบ
	// (โค้ดสำหรับการตรวจสอบโทเค็น)

	// ดึงรายการค่าใช้จ่าย
	var reservation entity.Reservation
	var expenses []entity.Expense

	db := config.DB()
	studentID := c.MustGet("student_id").(string)
	if studentID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "student_id cannot be empty"})
		return
	}
	// ค้นหาการจองห้อง
	db.Where("student_id = ?", studentID).First(&reservation)
	if reservation.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Reservation not found"})
		return
	}
	if err := db.Where("reservation_id = ?", reservation.ID).Preload("Dorm").Preload("ElectricityFee").Preload("WaterFee").Find(&expenses).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No expenses found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": expenses})

}

/*
// ListExpense - ดึงรายการค่าใช้จ่ายทั้งหมด
func ListExpense(c *gin.Context) {
	var expenses []entity.Expense

	db := config.DB()
	if err := db.Find(&expenses).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No expenses found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": expenses})
}*/

func UpDateExpense(c *gin.Context) {
	reservationID := c.Param("reservationId") // รับค่า reservationId จากพารามิเตอร์ URL
	var payload struct {
		Status string `json:"status"` // รับเฉพาะ status จาก JSON payload
	}

	db := config.DB()

	// ค้นหา Expense record ที่มี reservation_id ตรงกัน
	var existingExpense entity.Expense
	result := db.Where("reservation_id = ?", reservationID).First(&existingExpense)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Reservation ID not found"})
		return
	}

	// Bind JSON payload เข้าสู่ object `payload`
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	// ตรวจสอบว่า status ไม่ว่างเปล่า
	if payload.Status == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Status cannot be empty"})
		return
	}

	// อัปเดตเฉพาะฟิลด์ 'Status'
	if err := db.Model(&existingExpense).Updates(map[string]interface{}{
		"Status": payload.Status,
	}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update status", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Status updated successfully"})
}
