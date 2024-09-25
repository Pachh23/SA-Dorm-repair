package family

import (
	"net/http"

	"dormitory.com/dormitory/config"
	"dormitory.com/dormitory/entity"
	"github.com/gin-gonic/gin"
)

// GET /get-family/:id
func GetFamily(c *gin.Context) {
	ID := c.Param("id")
	var family entity.Family
	//results := db.Preload("Gender").First(&student, ID)
	db := config.DB()
	results := db.Preload("FamilyStatus").Preload("Guardian").First(&family, ID)
	/*
		// ถ้าไม่มีข้อมูล จะไม่แสดง error แต่จะแสดงวัตถุว่างเปล่า
		if results.Error != nil || family.ID == 0 {
			c.JSON(http.StatusOK, family)
			return
		}
	*/

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	if family.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, family)
}

// PATCH /update-family
func UpdateFamily(c *gin.Context) {
	var family entity.Family
	FamilyID := c.Param("id")
	// Get the database connection
	db := config.DB()

	// Check if the personal information exists
	result := db.First(&family, "id = ?", FamilyID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Family ID not found"})
		return
	}

	// Bind the incoming JSON payload to the personal object
	if err := c.ShouldBindJSON(&family); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&family)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}
