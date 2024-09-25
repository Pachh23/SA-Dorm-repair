package main

import (
	"net/http"

	"dormitory.com/dormitory/config"
	"dormitory.com/dormitory/controller/address"
	"dormitory.com/dormitory/controller/admin"
	announcement "dormitory.com/dormitory/controller/announcement"
	"dormitory.com/dormitory/controller/delayedpaymentform"
	"dormitory.com/dormitory/controller/dorm"
	"dormitory.com/dormitory/controller/electricityfee"
	"dormitory.com/dormitory/controller/en_exitingform"
	"dormitory.com/dormitory/controller/expense"
	"dormitory.com/dormitory/controller/family"
	familystatuses "dormitory.com/dormitory/controller/familyStatuses"
	"dormitory.com/dormitory/controller/genders"
	"dormitory.com/dormitory/controller/guardians"
	licenses "dormitory.com/dormitory/controller/license"
	"dormitory.com/dormitory/controller/other"
	"dormitory.com/dormitory/controller/personal"
	personaldetails "dormitory.com/dormitory/controller/personalDetails"
	"dormitory.com/dormitory/controller/rentfee"
	"dormitory.com/dormitory/controller/repairing"
	"dormitory.com/dormitory/controller/reservation"
	"dormitory.com/dormitory/controller/resigningform"
	"dormitory.com/dormitory/controller/room"
	"dormitory.com/dormitory/controller/slip"
	"dormitory.com/dormitory/controller/status"
	"dormitory.com/dormitory/controller/student"
	"dormitory.com/dormitory/controller/waterfee"
	"dormitory.com/dormitory/middlewares"
	"github.com/gin-gonic/gin"
)

const PORT = "8000"

func main() {
	// open connection database
	config.ConnectionDB()
	// Generate databases
	config.SetupDatabase()
	r := gin.Default()
	r.Use(CORSMiddleware())
	// Auth Route
	r.POST("/signin", student.SignInStudent)
	r.POST("/signin-admin", admin.SignInAdmin)
	router := r.Group("/")
	{
		router.Use(middlewares.Authorizes())
		// Student Route
		router.POST("/create-student", student.CreateStudent)
		router.PUT("/update-student/:id", student.UpdateStudent)
		router.GET("/list-student", student.ListStudent)
		router.GET("/get-student/:id", student.GetStudent)
		router.DELETE("/delete-student/:id", student.DeleteStudent)
		// CreatePersonalDetails Route
		router.POST("/create-personal-detail", personaldetails.CreatePersonalDetails)
		// Personal Route
		//router.POST("/create-personal", personal.CreatePersonal)
		router.GET("/get-personal/:id", personal.GetPersonal)
		router.PUT("/update-personal/:id", personal.UpdatePersonal)
		// Address Route
		router.GET("/get-address/:id", address.GetAddress)
		router.PUT("/update-address/:id", address.UpdateAddress)

		// Family Route
		router.GET("/get-family/:id", family.GetFamily)
		router.PUT("/update-family/:id", family.UpdateFamily)

		// Other Route
		router.GET("/get-other/:id", other.GetOther)
		router.PUT("/update-other/:id", other.UpdateOther)

		// RentFee Route
		router.POST("/create-rent-fee", rentfee.CreateRentFee)
		router.GET("/get-rent-fee/:id", rentfee.GetRentFee)
		router.GET("/list-rent-fees", rentfee.ListRentFees)

		// Repair Route
		router.GET("/get-list-formstudent", student.GetListFormStudent)
		router.GET("/get-list-formdorm", student.GetListFormDorm)

		router.POST("/create-repair", repairing.CreateRepair)
		router.GET("/get-repair/:id", repairing.GetRepair)
		router.GET("/repair-getlist", repairing.GetListRepairs)
		router.PUT("/repair-update/:id", repairing.UpdateRepair)

		// DelayedPaymentForm Route
		router.POST("/create-delayedpaymentform", delayedpaymentform.CreateDelayedPaymentForm)
		router.GET("/list-delayedpaymentform", delayedpaymentform.ListDelayedPaymentForms)
		router.GET("/get-delayedpaymentform/:id", delayedpaymentform.GetDelayedPaymentForm)
		router.PUT("/update-delayedpaymentform/:id", delayedpaymentform.UpdateDelayedPaymentForm)

		// En_ExitingForm Route
		router.POST("/create-en_exitingform", en_exitingform.CreateEn_ExitingForm)
		router.GET("/get-En_ExitingForm/:id", en_exitingform.GetEn_ExitingForm)
		router.GET("/En_ExitingForm-getlist", en_exitingform.ListEn_ExitingForm)
		router.PUT("/En_ExitingForm-update/:id", en_exitingform.UpdateEn_ExitingForm)

		// ResigningForm Route
		router.POST("/create-resigningform", resigningform.CreateResigningForm)
		router.GET("/get-ResigningForm/:id", resigningform.GetResigningForm)
		router.GET("/Resigningform-getlist", resigningform.ListResigningForm)
		router.PUT("/Resigningform-update/:id", resigningform.UpdateResigningForm)

		// ResigningForm Route
		//router.POST("/get-status", status.GetStatusById)
		//router.GET("/list-status", status.GetListStatus)
		//router.GET("/get-status/:id", middlewares.Authorizes(), status.GetStatusById)
		router.GET("/list-status", middlewares.Authorizes(), status.GetListStatus)

		// Announcement Routes
		router.POST("/create-announcement", announcement.CreateAnnouncement)
		router.GET("/announcements", announcement.GetAnnouncements)
		router.GET("/announcement/:id", announcement.GetAnnouncementByID)
		router.PUT("/update-announcement/:id", announcement.UpdateAnnouncement)
		router.DELETE("/delete-announcement/:id", announcement.DeleteAnnouncement)
		router.GET("/latest-announcement", announcement.GetLatestAnnouncement)

		// Admin Routes
		router.GET("/GetAllAdmins", admin.GetAllAdmins)
		router.POST("/create-admin", admin.CreateAdmin)
		router.DELETE("/admin/:id", admin.DeleteAdmin)
		router.GET("/admin/:id", admin.GetAdminByID)

		//Slip Routes
		router.POST("/create-slip", slip.CreateSlip)
		router.PATCH("/slip/:id", slip.UpdateSlip)
		router.GET("/list-slip", slip.GetListSlips)
		router.GET("/get-slipcomplete", slip.GetSlipsWithUncompletedStatus)

		//Slip expense
		router.POST("/create-expense", expense.CreateExpense)
		router.GET("/get-expense/:id", expense.GetExpense)
		router.GET("/list-expense", expense.ListExpense)
		router.PUT("/update-expense/:reservationId", expense.UpDateExpense)

		// RentFee Route
		router.POST("/create-rentfee", rentfee.CreateRentFee)
		router.GET("/get-rentfee/:id", rentfee.GetRentFee)
		router.GET("/list-rentfees", rentfee.ListRentFees)

		//waterFee Route
		router.POST("/create-waterfee", waterfee.CreateWaterFee)
		router.GET("/get-waterfee/:id", waterfee.GetWaterFee)
		router.GET("/list-waterfees", waterfee.ListWaterFees)

		//elecFee Route
		router.POST("/create-electricityfee", electricityfee.CreateElectricityFee)
		router.GET("/get-electricityfee/:id", electricityfee.GetElectricityFee)
		router.GET("/list-electricityfees", electricityfee.ListElectricityFees)
		router.PATCH("update-electricityfee/:id", electricityfee.UpdateElectricityFee)

		// Dorm
		router.GET("/GetDorm/:id", dorm.GetDorm)
		router.GET("/ListDorms", dorm.ListDorms)
		router.PUT("/UpdateDorm/:id", dorm.UpdateDorm)
		// Room
		router.GET("/GetRoom/:id", room.GetRoom)
		router.GET("/ListRoom", room.ListRoom)
		router.DELETE("/DeleteRoom/:id", room.DeleteRoom)
		router.PUT("/UpdateRoom/:id", room.UpdateRoom)
		router.GET("/rooms/floor/:floor_id/dorm/:dorm_id", room.GetByIdFloor)
		// Reservation
		router.POST("/CreateReservation", reservation.CreateReservation)
		router.DELETE("/DeleteReservation/:id", reservation.DeleteReservation)
		router.PUT("/UpdateReservation/:id", reservation.UpdateReservation)
		router.GET("/reservations/room/:roomID", reservation.GetReservationsByRoomID)
		router.GET("/reservations/:room_id/students", student.GetStudentsByRoomID)
		router.GET("/reservations/:room_id/dorm", dorm.GetDormByRoomID)
		router.GET("/check-user-room/:userID", reservation.GetUserRoom)
		router.GET("/reservations/student/:studentID", reservation.GetReservationsByStudentID)

	}

	r.GET("/genders", genders.GetAll)
	r.GET("/familyStatuses", familystatuses.GetAll)
	r.GET("/guardians", guardians.GetAll)
	r.GET("/license", licenses.GetAll)

	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)
	})
	// Run the server
	r.Run("localhost:" + PORT)
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}
