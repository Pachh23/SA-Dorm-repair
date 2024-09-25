export interface FamilyInterface{
  ID?: number;
  fathers_name?: string;
  mathers_name?: string;
  occupation_father?: string;
  occupation_mather?: string;
  phone_father?: string;
  phone_mather?: string;
  or_guardians_name?: string;
  relationship?: string;
  occupation_guardian?: string;
  phone_guardian?: string;
  guardians_id?: number;
  family_status_id?: number;
  StudentID?: string; // เชื่อมโยงกับ Student
}