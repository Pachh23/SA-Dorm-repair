package other

import (
	"net/http"

	"dormitory.com/dormitory/config"
	"dormitory.com/dormitory/entity"
	"github.com/gin-gonic/gin"
)

// GET /get-other/:id
func GetOther(c *gin.Context) {
	ID := c.Param("id")
	var other entity.Other
	//results := db.Preload("Gender").First(&student, ID)
	db := config.DB()
	// ค้นหาข้อมูลที่มี id ตรงกับที่ได้รับมา
	results := db.Preload("License").First(&other, ID)
	/*
		// ถ้าไม่มีข้อมูล จะไม่แสดง error แต่จะแสดงวัตถุว่างเปล่า
		if results.Error != nil || other.ID == 0 {
			c.JSON(http.StatusOK, other)
			return
		}
	*/
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	if other.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, other)
}

// PATCH /update-other
func UpdateOther(c *gin.Context) {
	var other entity.Other
	OtherID := c.Param("id")
	// Get the database connection
	db := config.DB()

	// Check if the personal information exists
	result := db.First(&other, "id = ?", OtherID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Other ID not found"})
		return
	}

	// Bind the incoming JSON payload to the personal object
	if err := c.ShouldBindJSON(&other); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&other)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}
