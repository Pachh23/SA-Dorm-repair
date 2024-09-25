package entity

import "gorm.io/gorm"

type Licenses struct {
	gorm.Model
	License string `json:"license"`
}