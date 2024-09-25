package entity

import "gorm.io/gorm"

type Dorm struct {
	gorm.Model
	DormName string  `json:"dorm_name"`
	Type     string  `json:"type"`
	Amount   float64 `json:"amount"`

	GenderID uint    `json:"gender_id"`
	Gender   Genders `gorm:"foreignKey:GenderID"`

	Rooms        []Room        `gorm:"foreignKey:DormID"`
	Reservations []Reservation `gorm:"foreignKey:DormID"`
}
