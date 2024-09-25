export interface ExpenseInterface {
    ID?:            number;
    date:           Date;
    status?:         string;
    totalamount:    number;
    rent_id?:       number;
    elec_id?:     number;
    water_id?:     number;
    reservation_id?:    string;
}