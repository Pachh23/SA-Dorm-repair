package waterfee

import (
	"net/http"

	"dormitory.com/dormitory/entity"
	"dormitory.com/dormitory/config"
	"github.com/gin-gonic/gin"
)

// POST /create-waterfee
func CreateWaterFee(c *gin.Context) {
	var waterfee entity.WaterFee
	var sid entity.Students
	var reservation entity.Reservation
	var room entity.Room


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

	if err := c.ShouldBindJSON(&waterfee); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db.First(&room, reservation.RoomID)
	if room.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Dorm not found"})
		return
	}

	rp := entity.WaterFee{
		Amount:          waterfee.Amount,
		ReservationID:    reservation.ID,
		Reservation:      &reservation,
	}

	if err := db.Create(&rp).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": rp})
}

// GET /get-waterfee/:id
func GetWaterFee(c *gin.Context) {
	ID := c.Param("id")
	var waterFee entity.WaterFee

	db := config.DB()
	if err := db.First(&waterFee, ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "WaterFee not found"})
		return
	}

	c.JSON(http.StatusOK, waterFee)
}

// GET /list-water-fees
func ListWaterFees(c *gin.Context) {
	var waterFees []entity.WaterFee

	db := config.DB()
	if err := db.Find(&waterFees).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, waterFees)
}