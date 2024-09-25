package rentfee

import (
	"net/http"

	"dormitory.com/dormitory/entity"
	"dormitory.com/dormitory/config"
	"github.com/gin-gonic/gin"
)

// POST /create-rent-fee
func CreateRentFee(c *gin.Context) {
	var rentfee entity.RentFee
	var sid entity.Students
	var reservation entity.Reservation
	var dorm entity.Dorm


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

	db.Where("student_id = ?", sid.ID).First(&reservation)
	if reservation.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Reservation not found"})
		return
	}

	if err := c.ShouldBindJSON(&rentfee); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db.First(&dorm, reservation.DormID)
	if dorm.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Dorm not found"})
		return
	}

	rp := entity.RentFee{
		Amount:          rentfee.Amount,
		ReservationID:    reservation.ID,
		Reservation:      &reservation,
	}

	if err := db.Create(&rp).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": rp})
}

// GET /get-rentfee/:id
func GetRentFee(c *gin.Context) {
	ID := c.Param("id")
	var rentFee entity.RentFee

	db := config.DB()
	if err := db.First(&rentFee, ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "RentFee not found"})
		return
	}

	c.JSON(http.StatusOK, rentFee)
}

// GET /list-rentfees
func ListRentFees(c *gin.Context) {
	var rentFees []entity.RentFee

	db := config.DB()
	if err := db.Find(&rentFees).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, rentFees)
}
