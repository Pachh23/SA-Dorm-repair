package entity

import (
	"time"

	"gorm.io/gorm"
)

type Expense struct {
	gorm.Model
	ID          uint      `gorm:"primaryKey;autoIncrement"`
	Date        time.Time `json:"date"`
	Status      string    `json:"status"`
	TotalAmount float64   `json:"totalamount"`

	DormID uint  `json:"dorm_id"`
	Dorm   *Dorm `gorm:"foreignKey: DormID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"Dorm"`

	ElectricityFeeID uint            `json:"elec_id"`
	ElectricityFee   *ElectricityFee `gorm:"foreignKey: ElectricityFeeID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"electricityfee"`

	WaterFeeID uint      `json:"water_id"`
	WaterFee   *WaterFee `gorm:"foreignKey: WaterFeeID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"waterfee"`

	// One-to-one relationship
	ReservationID uint        `json:"reservation_id"`
	Reservation   Reservation `gorm:"foreignKey: ReservationID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"reservation"`

	AdminID uint    `json:"admin_id"`
	Admin   *Admins `gorm:"foreignKey:AdminID"`
}
