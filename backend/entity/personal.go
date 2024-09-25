package entity

import "gorm.io/gorm"

type Personal struct {
	gorm.Model
	Nickname    string  `json:"nickname"`
	CitizenID   string  `json:"citizen_id"`
	Phone       string  `json:"phone"`
	Nationality string  `json:"nationality"`
	Race        string  `json:"race"`
	Religion    string  `json:"religion"`
	BloodGroup  string  `json:"blood_group"`
	UD          *string `json:"ud"`

	// One-to-one relationship with Student
	//StudentID string
	StudentID uint      `json:"student_id"`
	Student   *Students `gorm:"foreignKey: StudentID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"student"`
}