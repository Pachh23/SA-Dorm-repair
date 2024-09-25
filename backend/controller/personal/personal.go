package personal

import (
	"net/http"

	"dormitory.com/dormitory/config"
	"dormitory.com/dormitory/entity"
	"github.com/gin-gonic/gin"
)

// GET /get-personal/:id
func GetPersonal(c *gin.Context) {
	ID := c.Param("id")
	var personal entity.Personal

	db := config.DB()
	results := db.First(&personal, ID)
	/*
		// ถ้าไม่มีข้อมูล จะไม่แสดง error แต่จะแสดงวัตถุว่างเปล่า
		if results.Error != nil || personal.ID == 0 {
			c.JSON(http.StatusOK, personal)
			return
		}
	*/

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	if personal.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, personal)
}

// PATCH /update-personal
func UpdatePersonal(c *gin.Context) {
	var personal entity.Personal
	PersonalID := c.Param("id")
	// Get the database connection
	db := config.DB()

	// Check if the personal information exists
	result := db.First(&personal, "id = ?", PersonalID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Personal ID not found"})
		return
	}

	// Bind the incoming JSON payload to the personal object
	if err := c.ShouldBindJSON(&personal); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&personal)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}