package address

import (
	"net/http"

	"dormitory.com/dormitory/config"
	"dormitory.com/dormitory/entity"
	"github.com/gin-gonic/gin"
)

// GET /get-address/:id
func GetAddress(c *gin.Context) {
	ID := c.Param("id")
	var address entity.Address

	db := config.DB()
	results := db.First(&address, ID)
	/*
		if results.Error != nil || address.ID == 0 {
			c.JSON(http.StatusOK, address)
			return
		}
	*/

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	if address.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, address)
}

// PATCH /update-other
func UpdateAddress(c *gin.Context) {
	var address entity.Address
	AddressID := c.Param("id")
	// Get the database connection
	db := config.DB()

	// Check if the personal information exists
	result := db.First(&address, "id = ?", AddressID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Address ID not found"})
		return
	}

	// Bind the incoming JSON payload to the personal object
	if err := c.ShouldBindJSON(&address); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&address)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}
