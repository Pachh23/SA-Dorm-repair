package entity

import (
	"gorm.io/gorm"
	"time"
)

type DelayedPaymentForm struct {
	gorm.Model
	ID              uint      `gorm:"primaryKey;autoIncrement"`
	Title           string    `json:"title"`
	Type            string    `json:"type"`
	Date_Submission time.Time `json:"date_submission"`
	Dorm_Payment    *float64  `json:"dorm_payment"`
	Electricly_Bill *float64  `json:"electricly_bill"`
	Water_Bill      *float64  `json:"water_bill"`
	Because_Of      string    `json:"because_of"`
	Due_Date        time.Time `json:"due_date"`
	Status          string    `json:"status"`

	// One-to-one relationship
	ReservationID uint        `json:"reservation_id"`
	Reservation   Reservation `gorm:"foreignKey: ReservationID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"reservation"`

	// AdminID ทำหน้าที่เป็น FK
	AdminID uint    `json:"admin_id"`
	Admin   *Admins `gorm:"foreignKey:AdminID"`
}
