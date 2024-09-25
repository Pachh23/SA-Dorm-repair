export interface RoomInterface {
    ID:                 number;
    room_number:       number;
    available:         number;
    dorm_status:       string;
    floor:             number;
    Dorm: {
        dorm_id:    number;
        dorm_name:  string;
        amount:     number;
        Gender: {
            Gender: string;
        };
    };
}

// (?) หมายความว่าสมาชิกนี้อาจจะมีอยู่หรือไม่ก็ได้ 
//และถ้าไม่มีค่า, มันจะมีค่าเป็น undefined โดยอัตโนมัติ