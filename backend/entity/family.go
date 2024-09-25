package entity

import "gorm.io/gorm"

type Family struct {
	gorm.Model
	FathersName        string  `json:"fathers_name"`
	MathersName        string  `json:"mathers_name"`
	OccupationFather   string  `json:"occupation_father"`
	OccupationMather   string  `json:"occupation_mather"`
	PhoneFather        string  `json:"phone_father"`
	PhoneMather        string  `json:"phone_mather"`
	OrGuardiansName    *string `json:"or_guardians_name"`
	Relationship       *string `json:"relationship"`
	OccupationGuardian *string `json:"occupation_guardian"`
	PhoneGuardian      *string `json:"phone_guardian"`

	GuardiansID uint       `json:"guardians_id"`
	Guardian    *Guardians `gorm:"foreignKey: guardians_id" json:"guardian"`

	FamilyStatusID uint            `json:"family_status_id"`
	FamilyStatus   *FamilyStatuses `gorm:"foreignKey: family_status_id" json:"family_status"`

	// One-to-one relationship with Student
	//StudentID string
	StudentID uint      `json:"student_id"`
	Student   *Students `gorm:"foreignKey: StudentID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"student"`
}