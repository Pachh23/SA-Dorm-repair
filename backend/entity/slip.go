package entity

import (
	"gorm.io/gorm"
)

type Slip struct {
	gorm.Model
	ID   uint   `gorm:"primaryKey;autoIncrement"`
	Path string `gorm:"type:longtext" json:"path"`

	// One-to-one relationship
	ReservationID uint         `json:"reservation_id"`
	Reservation   *Reservation `gorm:"foreignKey: ReservationID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"reservation"`
}
