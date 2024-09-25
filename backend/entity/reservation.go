package entity

import (
	"time"

	"gorm.io/gorm"
)

type Reservation struct {
	gorm.Model

	ReservationDate time.Time

	StudentID string   `json:"student_id"`
	Student   Students `gorm:"foreignKey: student_id;references:StudentID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"student"`


	DormID 		uint	`json:"dorm_id"`
	Dorm		Dorm  	`gorm:"foreignKey:DormID"`
	RoomID 		uint	`json:"room_id"`
	Room		Room  	`gorm:"foreignKey:RoomID"`

	/*
		RentFeeID uint      `json:"rent_id"`
		RentFee   Students `gorm:"foreignKey: rent_id;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"rentfee"`

		WaterFeeID uint      `json:"water_id"`
		WaterFee   Students `gorm:"foreignKey: water_id;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"waterfee"`

		ElectricityFeeID uint      `json:"elec_id"`
		ElectricityFee   Students `gorm:"foreignKey: elec_id;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"electricityfee"`
	*/
	Repairings          []Repairing          `gorm:"foreignKey:ReservationID"`
	DelayedPaymentForms []DelayedPaymentForm `gorm:"foreignKey:ReservationID"`
	En_ExitingForms     []En_ExitingForm     `gorm:"foreignKey:ReservationID"`
	ResigningForms      []ResigningForm      `gorm:"foreignKey:ReservationID"`
}
