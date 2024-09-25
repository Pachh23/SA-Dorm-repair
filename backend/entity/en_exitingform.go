package entity

import (
	"gorm.io/gorm"
	"time"
)

type En_ExitingForm struct {
	gorm.Model
	ID              uint      `gorm:"primaryKey;autoIncrement"`
	Title           string    `json:"title"`
	Type            string    `json:"type"`
	Date_Submission time.Time `json:"date_submission"`
	Request         string    `json:"request"`
	Because_Of      string    `json:"because_of"`
	Date_Request    time.Time `json:"date_request"`
	Status          string    `json:"status"`

	// One-to-one relationship
	ReservationID uint        `json:"reservation_id"`
	Reservation   Reservation `gorm:"foreignKey: ReservationID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"reservation"`

	// AdminID ทำหน้าที่เป็น FK
	AdminID uint    `json:"admin_id"`
	Admin   *Admins `gorm:"foreignKey:AdminID"`
}
