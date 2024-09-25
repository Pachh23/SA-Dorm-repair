package entity

import "gorm.io/gorm"

type Room struct {
	gorm.Model
	RoomNumber	uint	`json:"room_number"`
	Available 	uint	`json:"available"` // 0,1,2,3
	DormStatus 	string	`json:"dorm_status"` //"ว่าง" || "เต็ม" || "อยู่ระหว่างการซ่อมบำรุง"
	Floor		uint	`json:"floor"`

	// DormID ทำหน้าที่เป็น FK
	DormID 	uint	`json:"dorm_id"`
	Dorm	Dorm 	`gorm:"foreignKey:DormID"`

	Reservations []Reservation	`gorm:"foreignKey:RoomID"`
}