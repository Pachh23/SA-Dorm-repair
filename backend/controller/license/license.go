package licenses

import (
	"net/http"

	"dormitory.com/dormitory/config"
	"dormitory.com/dormitory/entity"
	"github.com/gin-gonic/gin"
)

func GetAll(c *gin.Context) {
	db := config.DB()
	var licenses []entity.Licenses
	db.Find(&licenses)
	c.JSON(http.StatusOK, &licenses)
}