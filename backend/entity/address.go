package entity

import "gorm.io/gorm"

type Address struct {
	gorm.Model
	HouseNo     string `json:"house_no"`
	VillageNo   string `json:"village_no"`
	Village     string `json:"village"`
	Alley       string `json:"alley"`
	Road        string `json:"road"`
	SubDistrict string `json:"sub_district"`
	District    string `json:"district"`
	Province    string `json:"province"`
	ZipCode     string `json:"zip_code"`

	// One-to-one relationship with Student
	//StudentID string
	StudentID uint      `json:"student_id"`
	Student   *Students `gorm:"foreignKey: StudentID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"student"`
}
