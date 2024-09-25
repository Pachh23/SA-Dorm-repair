export interface DelayedPaymentFormInterface {
    reservation: any;
    ID?:                number;
    title?:             string;
    type?:              string;
    date_submission?:   Date;
    dorm_payment?:      number;
    electricly_bill?:   number;
    water_bill?:        number;
    because_of?:        string;
    due_date?:          Date;
    status?:            string;
    AdminID?:           string;
    ReservationID?:     string;
}