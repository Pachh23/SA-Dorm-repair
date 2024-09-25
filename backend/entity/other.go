package entity

import (
	"time"

	"gorm.io/gorm"
)

type Other struct {
	gorm.Model
	LatestGraduationFrom string     `json:"latest_graduation_from"`
	GraduationYear       *uint      `json:"graduation_year"`
	Gpax                 *float64   `json:"GPAX"`
	PersonalVehicles     *string    `json:"personal_vehicles"`
	Color                *string    `json:"color"`
	PlateNo              *string    `json:"plate_no"`
	VehicleTaxDueDate    *time.Time `json:"vehicle_tax_due_date"`
	ProvinceVehicle      *string    `json:"province_vehicle"`
	Type                 *string    `json:"type"`
	Expiry               *time.Time `json:"expiry"`

	LicensesID *uint     `json:"licenses_id"`
	License    *Licenses `gorm:"foreignKey: licenses_id" json:"license"`

	// One-to-one relationship with Student

	StudentID uint      `json:"student_id"`
	Student   *Students `gorm:"foreignKey: StudentID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"student"`
}