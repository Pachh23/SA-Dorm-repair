package electricityfee

import (
	"net/http"

	"dormitory.com/dormitory/entity"
	"dormitory.com/dormitory/config"
	"github.com/gin-gonic/gin"
)

// POST /create-electricity-fee
func CreateElectricityFee(c *gin.Context) {
	var electricityfee entity.ElectricityFee
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

	if err := c.ShouldBindJSON(&electricityfee); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db.First(&room, reservation.RoomID)
	if room.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Dorm not found"})
		return
	}

	rp := entity.ElectricityFee{
		Amount:          electricityfee.Amount,
		ReservationID:    reservation.ID,
		Reservation:      &reservation,
	}

	if err := db.Create(&rp).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": rp})
}

// GET /get-electricity-fee/:id
func GetElectricityFee(c *gin.Context) {
	ID := c.Param("id")
	var electricityFee entity.ElectricityFee

	db := config.DB()
	if err := db.First(&electricityFee, ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ElectricityFee not found"})
		return
	}

	c.JSON(http.StatusOK, electricityFee)
}

// GET /list-electricity-fees
func ListElectricityFees(c *gin.Context) {
	var electricityFees []entity.ElectricityFee

	db := config.DB()
	if err := db.Find(&electricityFees).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, electricityFees)
}

// PATCH /update-electricityfee/:id
func UpdateElectricityFee(c *gin.Context) {
	var electricityFee entity.ElectricityFee
	ID := c.Param("id")

	// Get the database connection
	db := config.DB()

	// Check if the electricity fee exists
	result := db.First(&electricityFee, "id = ?", ID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ElectricityFee ID not found"})
		return
	}

	// Bind the incoming JSON payload to the electricityFee object
	if err := c.ShouldBindJSON(&electricityFee); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	// Save the updated electricity fee
	result = db.Save(&electricityFee)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "ElectricityFee updated successfully", "data": electricityFee})
}
// GET /get-latest-electricity-fee
func GetLatestElectricityFee(c *gin.Context) {
	var electricityFee entity.ElectricityFee

	db := config.DB()
	if err := db.Last(&electricityFee).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ElectricityFee not found"})
		return
	}

	c.JSON(http.StatusOK, electricityFee)
}
// PATCH /update-expense/:id
func UpdateExpense(c *gin.Context) {
	var expense entity.Expense
	ID := c.Param("id")

	db := config.DB()

	if err := db.First(&expense, ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Expense not found"})
		return
	}

	// Bind the incoming JSON payload to the expense object
	if err := c.ShouldBindJSON(&expense); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	// Save the updated expense
	if err := db.Save(&expense).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Expense updated successfully", "data": expense})
}
