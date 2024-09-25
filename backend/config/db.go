// ใช้สำหรับการสร้างฐานข้อมูล (Database)
package config

import (
	"fmt"
	"log"
	"time"

	"dormitory.com/dormitory/entity"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}
func ConnectionDB() {
	database, err := gorm.Open(sqlite.Open("sa1.db?cache=shared"), &gorm.Config{})

	if err != nil {
		panic("failed to connect database")
	}
	fmt.Println("connected database")
	db = database
}
func SetupDatabase() {
	db.AutoMigrate(
		&entity.Students{},
		&entity.Admins{},
		&entity.Announcement{},
		&entity.Genders{},
		&entity.FamilyStatuses{},
		&entity.Guardians{},
		&entity.Licenses{},
		&entity.Address{},
		&entity.Family{},
		&entity.Other{},
		&entity.Personal{},

		&entity.Dorm{},
		&entity.Room{},
		&entity.Reservation{},

		&entity.Repairing{},
		&entity.DelayedPaymentForm{},
		&entity.En_ExitingForm{},
		&entity.ResigningForm{},

		&entity.RentFee{},
		&entity.WaterFee{},
		&entity.ElectricityFee{},
		&entity.Expense{},
		&entity.Slip{},
	)

	// Seed ข้อมูลประเภท

	seedFamilyStatuses()
	seedGuardians()
	seedLicenses()
	seedPersonals()
	seedAddresses()
	seedFamilies()
	seedOthers()

	GenderMale := entity.Genders{Gender: "Male"}
	GenderFemale := entity.Genders{Gender: "Female"}
	db.FirstOrCreate(&GenderMale, &entity.Genders{Gender: "Male"})
	db.FirstOrCreate(&GenderFemale, &entity.Genders{Gender: "Female"})

	DormMale1 := entity.Dorm{DormName: "หอพักชาย 1", Type: "มีเครื่องปรับอากาศ", GenderID: GenderMale.ID, Amount: 6500}
	DormMale2 := entity.Dorm{DormName: "หอพักชาย 2", Type: "ไม่มีเครื่องปรับอากาศ", GenderID: GenderMale.ID, Amount: 2900}
	DormFemale3 := entity.Dorm{DormName: "หอพักหญิง 3", Type: "มีเครื่องปรับอากาศ", GenderID: GenderFemale.ID, Amount: 6500}
	DormFemale4 := entity.Dorm{DormName: "หอพักหญิง 4", Type: "ไม่มีเครื่องปรับอากาศ", GenderID: GenderFemale.ID, Amount: 2900}
	db.FirstOrCreate(&DormMale1, &entity.Dorm{DormName: "หอพักชาย 1"})
	db.FirstOrCreate(&DormMale2, &entity.Dorm{DormName: "หอพักชาย 2"})
	db.FirstOrCreate(&DormFemale3, &entity.Dorm{DormName: "หอพักหญิง 3"})
	db.FirstOrCreate(&DormFemale4, &entity.Dorm{DormName: "หอพักหญิง 4"})

	for roomNumber := 1100; roomNumber <= 4309; roomNumber++ {
		// คำนวณ DormID จากหลักพันของ RoomNumber
		if (roomNumber >= 1100 && roomNumber <= 1109) ||
			(roomNumber >= 1200 && roomNumber <= 1209) ||
			(roomNumber >= 1300 && roomNumber <= 1309) ||
			(roomNumber >= 2100 && roomNumber <= 2109) ||
			(roomNumber >= 2200 && roomNumber <= 2209) ||
			(roomNumber >= 2300 && roomNumber <= 2309) ||
			(roomNumber >= 3100 && roomNumber <= 3109) ||
			(roomNumber >= 3200 && roomNumber <= 3209) ||
			(roomNumber >= 3300 && roomNumber <= 3309) ||
			(roomNumber >= 4100 && roomNumber <= 4109) ||
			(roomNumber >= 4200 && roomNumber <= 4209) ||
			(roomNumber >= 4300 && roomNumber <= 4309) {

			dormID := uint(roomNumber / 1000)

			floor := uint((roomNumber / 100) % 10)

			// สร้าง Room และกำหนดค่า DormID
			room := entity.Room{
				RoomNumber: uint(roomNumber),
				DormID:     dormID, // DormID จะเป็น 1, 2, 3 หรือ 4 ตาม RoomNumber
				Available:  3,
				DormStatus: "ห้องว่าง",
				Floor:      floor,
			}

			db.FirstOrCreate(&room, &entity.Room{RoomNumber: uint(roomNumber)})
		}
	}
	// Seed ข้อมูล student คนแรก
	studentHashedPassword1, _ := HashPassword("B6510001")
	Birthday1, _ := time.Parse("2006-01-02", "1988-11-12")
	User1 := &entity.Students{
		FirstName: "Nicha",
		LastName:  "Wandee",
		StudentID: "B6510001",
		Password:  studentHashedPassword1,
		Birthday:  Birthday1,
		Year:      3,
		Major:     "วิศวกรรมศาสตร์",
		GenderID:  2,
	}
	db.FirstOrCreate(User1, &entity.Students{StudentID: "B6510001"})

	// Seed ข้อมูล student คนที่สอง
	studentHashedPassword2, _ := HashPassword("B6510002")
	Birthday2, _ := time.Parse("2006-01-02", "1990-05-25")
	User2 := &entity.Students{
		FirstName: "Anucha",
		LastName:  "Phanphet",
		StudentID: "B6510002",
		Password:  studentHashedPassword2,
		Birthday:  Birthday2,
		Year:      4,
		Major:     "คอมพิวเตอร์",
		GenderID:  1,
	}
	db.FirstOrCreate(User2, &entity.Students{StudentID: "B6510002"})

	ReservationDate, _ := time.Parse("02-01-2006", "21-05-1997")
	reservation := &entity.Reservation{
		ReservationDate: ReservationDate,
		StudentID:       User1.StudentID,
		DormID:          4,
		RoomID:          100,
	}
	db.FirstOrCreate(reservation, &entity.Reservation{StudentID: User1.StudentID, DormID: 4, RoomID: 100})

	ReservationDate2, _ := time.Parse("02-01-2006", "21-05-1997")
	reservation2 := &entity.Reservation{
		ReservationDate: ReservationDate2,
		StudentID:       "B6510002",
		DormID:          4,
		RoomID:          100,
	}
	db.FirstOrCreate(reservation2, &entity.Reservation{StudentID: "B6510002", DormID: 4, RoomID: 100})

	// Seed ข้อมูล admin
	adminHashedPassword1, err := HashPassword("Ad01")
	if err != nil {
		log.Fatalf("Error hashing password: %v", err)
	}
	AdminUser1 := &entity.Admins{
		Username:  "jetnipat",
		FirstName: "Jetnipat",
		LastName:  "Kunjai",
		Phone:     "061xxxxxxx",
		Password:  adminHashedPassword1,
	}

	db.FirstOrCreate(&AdminUser1, entity.Admins{Username: "jetnipat"})

	adminHashedPassword2, err := HashPassword("147")
	if err != nil {
		log.Fatalf("Error hashing password: %v", err)
	}
	AdminUser2 := &entity.Admins{
		Username:  "Jetsadaphon",
		FirstName: "Jetsadaphon",
		LastName:  "Pinjai",
		Phone:     "061xxxxxxx",
		Password:  adminHashedPassword2,
	}

	db.FirstOrCreate(&AdminUser2, entity.Admins{Username: "Jetsadaphon"})

	date_repairing, _ := time.Parse("2006-03-02", "2024-05-06")
	repairing := &entity.Repairing{
		ID:               1,
		Title:            "อ่างล้างมือตัน",
		Type:             "แจ้งซ่อม",
		Date_Submission:  date_repairing,
		Detail:           "ทำเศษอาหารตก",
		Image:            "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
		Location_Details: "ห้องน้ำชั้น 1 หอ 4",
		Contact:          "097-153-1219",
		Time_Slot:        "09:00-16:00 น.",
		Status:           "รอดำเนินการ",
		ReservationID:    reservation.ID,
		AdminID:          1,
	}
	db.FirstOrCreate(repairing, &entity.Repairing{ID: 1})

	dormPayment := 2900.00
	elecBill := 100.00
	waterBill := 50.00
	dueDate, _ := time.Parse("2006-01-02", "2024-06-01")
	date_delayedpaymentform, _ := time.Parse("2006-02-02", "2024-05-08")
	delayedpaymentform := &entity.DelayedPaymentForm{
		ID:              1,
		Title:           "ฟอร์มขอผ่อนผันการชำระค่าหอพัก",
		Type:            "ฟอร์มเอกสาร",
		Date_Submission: date_delayedpaymentform,
		Dorm_Payment:    &dormPayment,
		Electricly_Bill: &elecBill,
		Water_Bill:      &waterBill,
		Because_Of:      "รายได้ไม่พอ",
		Due_Date:        dueDate,
		Status:          "รอดำเนินการ",
		ReservationID:   reservation.ID,
		AdminID:         1,
	}
	db.FirstOrCreate(delayedpaymentform, &entity.DelayedPaymentForm{ID: 1})

	dateSubmission, _ := time.Parse("2006-01-02", "2024-05-10")
	dateRequest, _ := time.Parse("2006-01-02", "2024-05-24")
	en_exitingform := &entity.En_ExitingForm{
		ID:              1,
		Title:           "ฟอร์มขออนุญาติเข้า-ออกหอพัก",
		Type:            "ฟอร์มเอกสาร",
		Date_Submission: dateSubmission,
		Request:         "ขอกลับหอพักหลังเวลาปิดหอพัก",
		Because_Of:      "ทำงานโปรเจคจบ",
		Date_Request:    dateRequest,
		Status:          "รอดำเนินการ",
		ReservationID:   reservation.ID,
		AdminID:         1,
	}
	db.FirstOrCreate(en_exitingform, &entity.En_ExitingForm{ID: 1})

	date_resigningform, _ := time.Parse("2006-01-02", "2024-05-12")
	resigningform := &entity.ResigningForm{
		ID:              1,
		Title:           "ฟอร์มลาออกหอพัก",
		Type:            "ฟอร์มเอกสาร",
		Date_Submission: date_resigningform,
		Because_Of:      "ไม่สะดวกอยู่หอพักหลายคน",
		Accommodation:   "หอพักภายนอกมหาวิทยาลัย",
		Status:          "รอดำเนินการ",
		ReservationID:   reservation.ID,
		AdminID:         1,
	}
	db.FirstOrCreate(resigningform, &entity.ResigningForm{ID: 1})

	// ข้อมูล ค่าน้ำ ค่าไฟ
	electricityFee := entity.ElectricityFee{
		ID:            1,
		Amount:        150,
		ReservationID: reservation.ID,
	}
	db.FirstOrCreate(&electricityFee, entity.ElectricityFee{ID: 1})

	waterFee := entity.WaterFee{
		ID:            1,
		Amount:        100,
		ReservationID: reservation.ID,
	}
	db.FirstOrCreate(&waterFee, entity.WaterFee{ID: 1})

	// ดึงข้อมูล Reservation พร้อมกับ Dorm ที่เกี่ยวข้อง
	var reservations []entity.Reservation
	db.Preload("Dorm").Find(&reservations) // ใช้ Preload เพื่อดึงข้อมูล Dorm ด้วย
	if reservation.Dorm.Type == "" {
		fmt.Println("Dorm type is empty or invalid.")
	} else {
		fmt.Println("Dorm type:", reservation.Dorm.Type)
	}

	// ดึงข้อมูล Dorm โดยใช้ ID
	var dorm entity.Dorm
	result := db.First(&dorm, reservation.DormID) // ค้นหาจาก ID ของ Dorm
	if result.Error != nil {
		fmt.Println("Error retrieving dorm:", result.Error)
	} else {
		fmt.Println("Dorm retrieved:", dorm)
	}

	// Seed ข้อมูล Expense (รวม Dorm, WaterFee, ElectricityFee)
	totalAmount := float64(dorm.Amount) + float64(waterFee.Amount) + float64(electricityFee.Amount)

	expense := entity.Expense{
		ID:               1,
		Date:             time.Now(),
		Status:           "กำลังดำเนินการ",
		DormID:           dorm.ID,
		WaterFeeID:       waterFee.ID,       // เชื่อมโยง WaterFee
		ElectricityFeeID: electricityFee.ID, // เชื่อมโยง ElectricityFee
		TotalAmount:      totalAmount,
		ReservationID:    reservation.ID,
		AdminID:          1,
	}

	result1 := db.FirstOrCreate(&expense, entity.Expense{ID: 1})
	if result1.Error != nil {
		fmt.Println("Error creating expense:", result1.Error)
	} else {
		fmt.Println("Expense created successfully:", expense)
	}

	expense2 := entity.Expense{
		ID:               2,
		Date:             time.Now(),
		Status:           "กำลังดำเนินการ",
		DormID:           dorm.ID,
		WaterFeeID:       waterFee.ID,       // เชื่อมโยง WaterFee
		ElectricityFeeID: electricityFee.ID, // เชื่อมโยง ElectricityFee
		TotalAmount:      totalAmount,
		ReservationID:    2,
		AdminID:          1,
	}

	result2 := db.FirstOrCreate(&expense2, entity.Expense{ID: 2})
	if result2.Error != nil {
		fmt.Println("Error creating expense:", result2.Error)
	} else {
		fmt.Println("Expense created successfully:", expense2)
	}

	// ดึงข้อมูล Expense พร้อมข้อมูลที่เกี่ยวข้อง
	var expense1 entity.Expense
	db.Preload("Dorm").Preload("WaterFee").Preload("ElectricityFee").First(&expense1, expense.ID)

	seedStudents()
}
func seedFamilyStatuses() {
	familyStatusTogether := entity.FamilyStatuses{FamilyStatus: "อยู่ด้วยกัน"}
	familyStatusSeparated := entity.FamilyStatuses{FamilyStatus: "แยกกันอยู่"}
	familyStatusOther := entity.FamilyStatuses{FamilyStatus: "อื่นๆ (พ่อหรือแม่เสียชีวิต)"}
	db.FirstOrCreate(&familyStatusTogether, entity.FamilyStatuses{FamilyStatus: "อยู่ด้วยกัน"})
	db.FirstOrCreate(&familyStatusSeparated, entity.FamilyStatuses{FamilyStatus: "แยกกันอยู่"})
	db.FirstOrCreate(&familyStatusOther, entity.FamilyStatuses{FamilyStatus: "อื่นๆ (พ่อหรือแม่เสียชีวิต)"})
}

func seedGuardians() {
	guardianMother := entity.Guardians{Guardian: "มารดา"}
	guardianFather := entity.Guardians{Guardian: "บิดา"}
	guardianOther := entity.Guardians{Guardian: "อื่นๆ (ระบุ)"}
	db.FirstOrCreate(&guardianMother, entity.Guardians{Guardian: "มารดา"})
	db.FirstOrCreate(&guardianFather, entity.Guardians{Guardian: "บิดา"})
	db.FirstOrCreate(&guardianOther, entity.Guardians{Guardian: "อื่นๆ (ระบุ)"})
}

func seedLicenses() {
	hasLicense := entity.Licenses{License: "มี"}
	noLicense := entity.Licenses{License: "ไม่มี"}
	db.FirstOrCreate(&hasLicense, entity.Licenses{License: "มี"})
	db.FirstOrCreate(&noLicense, entity.Licenses{License: "ไม่มี"})
}

// ฟังก์ชันสำหรับการแปลงวันที่จากสตริง
func parseDate(dateStr string) time.Time {
	date, _ := time.Parse("2006-01-02", dateStr)
	return date
}

func seedStudents() {
	//studentHashedPassword, _ := HashPassword("1234567890123")
	//birthday, _ := time.Parse("2006-01-02", "2003-11-12")
	// สร้างข้อมูลนักศึกษา
	user := []entity.Students{
		{FirstName: "Anan", LastName: "Yutthapong", StudentID: "B6510003", Password: HashPasswordOrPanic("B6510003"), Birthday: parseDate("2005-01-15"), Year: 1, Major: "แพทยศาสตร์", GenderID: 1},
		{FirstName: "Siriwan", LastName: "Petchsri", StudentID: "B6510004", Password: HashPasswordOrPanic("B6510004"), Birthday: parseDate("2001-07-18"), Year: 4, Major: "สาธารณสุขศาสตร์", GenderID: 2},
		{FirstName: "Patchara", LastName: "Tantawan", StudentID: "B6510005", Password: HashPasswordOrPanic("B6510005"), Birthday: parseDate("2005-09-20"), Year: 1, Major: "ทันตแพทยศาสตร์", GenderID: 1},
		{FirstName: "Kanya", LastName: "Wongthong", StudentID: "B6510006", Password: HashPasswordOrPanic("B6510006"), Birthday: parseDate("2002-02-28"), Year: 3, Major: "เภสัชศาสตร์", GenderID: 2},
		{FirstName: "Nattapong", LastName: "Pongprapaporn", StudentID: "B6510007", Password: HashPasswordOrPanic("B6510007"), Birthday: parseDate("2000-05-15"), Year: 4, Major: "วิศวกรรมศาสตร์", GenderID: 1},
		{FirstName: "Rattana", LastName: "Srikham", StudentID: "B6510008", Password: HashPasswordOrPanic("B6510008"), Birthday: parseDate("2003-08-10"), Year: 2, Major: "การบัญชี", GenderID: 2},
		{FirstName: "Phawinee", LastName: "Khaokham", StudentID: "B6510009", Password: HashPasswordOrPanic("B6510009"), Birthday: parseDate("2004-12-01"), Year: 1, Major: "การท่องเที่ยว", GenderID: 2},
		{FirstName: "Kacha", LastName: "Sangthong", StudentID: "B6510010", Password: HashPasswordOrPanic("B6510010"), Birthday: parseDate("2005-03-25"), Year: 1, Major: "นิติศาสตร์", GenderID: 1},
	}
	// บันทึก Students ก่อน
	for _, student := range user {
		db.FirstOrCreate(&student, entity.Students{StudentID: student.StudentID})
	}
}

func seedPersonals() {
	for i := 1; i <= 10; i++ {
		personal := entity.Personal{
			StudentID:   uint(i),
			Nickname:    "",
			CitizenID:   "",
			Phone:       "",
			Nationality: "",
			Race:        "",
			Religion:    "",
			BloodGroup:  "",
		}
		db.FirstOrCreate(&personal, entity.Personal{StudentID: personal.StudentID})
	}
}

func seedAddresses() {
	for i := 1; i <= 10; i++ {
		address := entity.Address{
			StudentID:   uint(i),
			HouseNo:     "",
			VillageNo:   "",
			Village:     "",
			Alley:       "",
			Road:        "",
			SubDistrict: "",
			District:    "",
			Province:    "",
			ZipCode:     "",
		}
		db.FirstOrCreate(&address, entity.Address{StudentID: address.StudentID})
	}
}

func seedFamilies() {
	for i := 1; i <= 10; i++ {
		family := entity.Family{
			StudentID:        uint(i),
			FathersName:      "",
			MathersName:      "",
			OccupationFather: "",
			OccupationMather: "",
			PhoneFather:      "",
			PhoneMather:      "",
		}
		db.FirstOrCreate(&family, entity.Family{StudentID: family.StudentID})
	}
}

func seedOthers() {
	for i := 1; i <= 10; i++ {
		other := entity.Other{
			StudentID:            uint(i),
			LatestGraduationFrom: "",
		}
		db.FirstOrCreate(&other, entity.Other{StudentID: other.StudentID})
	}
}

func HashPasswordOrPanic(password string) string {
	hashedPassword, err := HashPassword(password)
	if err != nil {
		panic("Failed to hash password")
	}
	return hashedPassword
}
