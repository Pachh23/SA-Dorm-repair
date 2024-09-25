import { Space, Button, Col, Row, Divider, Form, Input, Card, message, DatePicker, InputNumber, Select } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { PersonalDetailInterface } from "../../../interfaces/PersonalDetails";
import { CreatePersonalDetail } from "../../../services/https";
import { useNavigate, Link } from "react-router-dom";

function PersonalCreate() {
	const navigate = useNavigate();
	const [messageApi, contextHolder] = message.useMessage();
	const onFinish = async (values: any) => {
		try {
			const personalDetailData: PersonalDetailInterface = {
				personal: {
					nickname: values.nickname,
					citizen_id: values.citizen_id,
					phone: values.phone,
					nationality: values.nationality,
					race: values.race,
					religion: values.religion,
					blood_group: values.blood_group,
					ud: values.ud,
			},
			address: {
				house_no: values.house_no,
				village_no: values.village_no,
				village: values.village,
				alley: values.alley,
				road: values.road,
				sub_district: values.sub_district,
				district: values.district,
				province: values.province,
				zip_code: values.zip_code,
			},
			family: {
				fathers_name: values.fathers_name,
				mathers_name: values.mathers_name,
				occupation_father: values.occupation_father,
				occupation_mather: values.occupation_mather,
				phone_father: values.phone_father,
				phone_mather: values.phone_mather,
				family_status_id: values.family_status_id,
				guardians_id: values.guardians_id,
				or_guardians_name: values.or_guardians_name,
				relationship: values.relationship,
				occupation_guardian: values.occupation_guardian,
				phone_guardian: values.phone_guardian,
			},
			other:{
				latest_graduation_from: values.latest_graduation_from,
				graduation_year: values.graduation_year,
				GPAX: values.GPAX,
				personal_vehicles: values.personal_vehicles,
				color: values.color,
				plate_no: values.plate_no,
				vehicle_tax_due_date: values.vehicle_tax_due_date,
				province_vehicle: values.province_vehicle,
				licenses_id: values.licenses_id,
				type: values.type,
				expiry: values.expiry,
			}
	};
			const res = await CreatePersonalDetail(personalDetailData);
			if (res.status === 201) {
					messageApi.open({
						type: "success",
						content: "บันทึกข้อมูลสำเร็จ",
						//content: res.data.message,
					});
					setTimeout(() => navigate("/personal"), 2000);
			} else {
					messageApi.open({
						type: "error",
						content: "เกิดข้อผิดพลาด",
						//content: res.data.error,
					});
			}
		} catch (error) {
				messageApi.open({
					type: "error",
					content: "An unexpected error occurred.",
				});
		}
	};
	return (
	<div>
		{contextHolder}
			<h2 style={{color: '#1f1f1f'}}>เปลี่ยนแปลงข้อมูลส่วนตัว</h2>
			<Card>
				<Form 
					labelCol={{ span: 10 }}
					name="basic"
					layout="horizontal"
					onFinish={onFinish}
					autoComplete="off"
					style={{ maxWidth: 1000 }}
				>
					<h4 style={{ marginTop: -10, marginBottom: -10,color: '#061178' }}>1. ข้อมูลส่วนตัวนักศึกษา</h4>
					<Divider/>
						<Row gutter={[16, 0]}>
							<Col xs={24} sm={24} md={24} lg={24} xl={12}>
								<Form.Item
									label="ชื่อเล่น"
									name="nickname"
									rules={[{ required: true, message: "กรุณากรอกชื่อเล่น" }]}
								> 
								<Input />
								</Form.Item>
							</Col>
							<Col xs={24} sm={24} md={24} lg={24} xl={12}>
								<Form.Item
									label="รหัสบัตรประชาชน"
									name="citizen_id"
									rules={[{ required: true, message: "กรุณากรอกรหัสบัตรประชาชน" },
													{pattern: /^[0-9]{13}$/, message: "กรุณากรอกรหัสบัตรประชาชนที่ถูกต้อง (13 หลัก)" }]}
									>
									<Input />
								</Form.Item>
							</Col>
							<Col xs={24} sm={24} md={24} lg={24} xl={12}>
								<Form.Item
									label="หมายเลขโทรศัพท์มือถือ"
									name="phone"
									rules={[{ required: true, message: "กรุณากรอกหมายเลขโทรศัพท์มือถือ" },
												{pattern: /^[0-9]{10}$/, message: "กรุณากรอกหมายเลขโทรศัพท์มือถือ (10 หลัก)" }]}
								>
									<Input />
								</Form.Item>
							</Col>
							<Col xs={24} sm={24} md={24} lg={24} xl={12}>
								<Form.Item
									label="สัญชาติ"
									name="nationality"
									rules={[{ required: true, message: "กรุณากรอกสัญชาติ" }]}
								>
									<Input />
								</Form.Item>
							</Col>
							<Col xs={24} sm={24} md={24} lg={24} xl={12}>
								<Form.Item
									label="เชื้อชาติ"
									name="race"
									rules={[{ required: true, message: "กรุณากรอกเชื้อชาติ" }]}
								>
									<Input />
								</Form.Item>
							</Col>
							<Col xs={24} sm={24} md={24} lg={24} xl={12}>
								<Form.Item
									label="ศาสนา"
									name="religion"
									rules={[{ required: true, message: "กรุณากรอกศาสนา" }]}
								>
									<Input />
								</Form.Item>
							</Col>
							<Col xs={24} sm={24} md={24} lg={24} xl={12}>
								<Form.Item
									label="กลุ่มเลือด"
									name="blood_group"
									rules={[{ required: true, message: "กรุณากรอกกลุ่มเลือด" }]}
								>
									<Input />
								</Form.Item>
							</Col>
							<Col xs={24} sm={24} md={24} lg={24} xl={12}>
								<Form.Item
										label="โรคประจำตัว(ถ้ามี)"
										name="ud"
								>
									<Input />
								</Form.Item>
							</Col>
					<Divider />
					<h4 style={{ marginTop: -10, marginBottom: -10,color: '#061178' }}>2. ที่อยู่ปัจจุบัน(ตามทะเบียนบ้าน)</h4>
					<Divider />
							<Col xs={24} sm={24} md={24} lg={24} xl={12}>
								<Form.Item
									label="บ้านเลขที่"
									name="house_no"
									rules={[{ required: true, message: "กรุณากรอกบ้านเลขที่" }]}
								>
									<Input />
								</Form.Item>
							</Col>
							<Col xs={24} sm={24} md={24} lg={24} xl={12}>
								<Form.Item
									label="หมู่ที่"
									name="village_no"
									rules={[{ required: true, message: "กรุณากรอกบ้านหมู่ที่" }]}
								>
									<Input />
								</Form.Item>
							</Col>
							<Col xs={24} sm={24} md={24} lg={24} xl={12}>
								<Form.Item
									label="ชื่อหมู่บ้าน"
									name="village"
									rules={[{ required: true, message: "กรุณากรอกชื่อหมู่บ้าน" }]}
								>
									<Input />
								</Form.Item>
							</Col>
							<Col xs={24} sm={24} md={24} lg={24} xl={12}>
								<Form.Item
									label="ซอย"
									name="alley"
									rules={[{ required: true, message: "กรุณากรอกซอย" }]}
								>
									<Input />
								</Form.Item>
							</Col>
							<Col xs={24} sm={24} md={24} lg={24} xl={12}>
								<Form.Item
									label="ถนน"
									name="road"
									rules={[{ required: true, message: "กรุณากรอกถนน !" }]}
								>
									<Input />
								</Form.Item>
							</Col>
							<Col xs={24} sm={24} md={24} lg={24} xl={12}>
								<Form.Item
									label="ตำบล/แขวง"
									name="sub_district"
									rules={[{ required: true, message: "กรุณากรอกตำบล/แขวง" }]}
								>
									<Input />
								</Form.Item>
							</Col>
							<Col xs={24} sm={24} md={24} lg={24} xl={12}>
								<Form.Item
									label="อำเภอ/เขต"
									name="district"
									rules={[{ required: true, message: "กรุณากรอกอำเภอ/เขต" }]}
									>
									<Input />
								</Form.Item>
							</Col>
							<Col xs={24} sm={24} md={24} lg={24} xl={12}>
								<Form.Item
									label="จังหวัด"
									name="province"
									rules={[{ required: true, 
														message: "กรุณากรอกชื่อจังหวัดที่ถูกต้อง",}]}
								>
									<Input />
								</Form.Item>
							</Col>
							<Col xs={24} sm={24} md={24} lg={24} xl={12}>
								<Form.Item
									label="รหัสไปรษณีย์"
									name="zip_code"
									rules={[{ required: true, message: "กรุณากรอกรหัสไปรษณีย์" }]}
									>
									<Input />
								</Form.Item>
							</Col>
					<Divider />
					<h4 style={{ marginTop: -10, marginBottom: -10,color: '#061178' }}>3. เกี่ยวกับครอบครัว</h4>
					<Divider />
							<Col xs={24} sm={24} md={24} lg={24} xl={12}>
								<Form.Item
									label="ชื่อ - สกุลบิดา"
									name="fathers_name"
									rules={[{ required: true, message: "กรุณากรอกชื่อ-สกุลบิดา" }]}
								>
									<Input />
								</Form.Item>
							</Col>
							<Col xs={24} sm={24} md={24} lg={24} xl={12}>
								<Form.Item
									label="ชื่อ - สกุลมารดา"
									name="mathers_name"
									rules={[{ required: true, message: "กรุณากรอกชื่อ-สกุลมารดา" }]}
								>
									<Input />
								</Form.Item>
							</Col>
							<Col xs={24} sm={24} md={24} lg={24} xl={12}>
								<Form.Item
									label="อาชีพบิดา"
									name="occupation_father"
									rules={[{ required: true, message: "กรุณากรอกอาชีพบิดา" }]}
								>
									<Input />
								</Form.Item>
							</Col>
								<Col xs={24} sm={24} md={24} lg={24} xl={12}>
									<Form.Item
										label="อาชีพมารดา"
										name="occupation_mather"
										rules={[{ required: true, message: "กรุณากรอกอาชีพมารดา" }]}
									>
										<Input />
									</Form.Item>
								</Col>
								<Col xs={24} sm={24} md={24} lg={24} xl={12}>
									<Form.Item
										label="หมายเลขโทรศัพท์มือถือบิดา"
										name="phone_father"
										rules={[{ required: true, message: "กรุณากรอกหมายเลขโทรศัพท์มือถือ" },
														{ pattern: /^[0-9]{10}$/, message: "กรุณากรอกหมายเลขโทรศัพท์มือถือ (10 หลัก)" }]}
									>
										<Input />
									</Form.Item>
								</Col>
								<Col xs={24} sm={24} md={24} lg={24} xl={12}>
									<Form.Item
										label="หมายเลขโทรศัพท์มือถือมารดา"
										name="phone_mather"
										rules={[{ required: true, message: "กรุณากรอกหมายเลขโทรศัพท์มือถือ" },
														{ pattern: /^[0-9]{10}$/, message: "กรุณากรอกหมายเลขโทรศัพท์มือถือ (10 หลัก)" }]}
									>
										<Input />
									</Form.Item>
								</Col>
								<Col xs={24} sm={24} md={24} lg={24} xl={12}>
									<Form.Item
										label="สถานภาพครอบครัว"
										name="family_status_id"
										rules={[
												{
												required: true,
												message: "กรุณาเลือกสถานภาพครอบครัว",
												},]}
									>
									<Select
										defaultValue=""
										style={{ width: "100%" }}
										options={[
										{ value: "", lable: "กรุณาเลือกสถานภาพครอบครัว", disabled: true },
										{ value: 1, label: "อยู่ด้วยกัน" },
										{ value: 2, label: "แยกกันอยู่" },
										{ value: 3, label: "อื่นๆ (พ่อหรือแม่เสียชีวิต)" },
										]}
									/>
									</Form.Item>
								</Col>
								<Col xs={24} sm={24} md={24} lg={24} xl={12}>
									<Form.Item
										label="ผู้ปกครอง"
										name="guardians_id"
										rules={[{ required: true, message: "กรุณาเลือกผู้ปกครอง",}]}
									>
									<Select
										defaultValue=""
										style={{ width: "100%" }}
										options={[
										{ value: "", label: "กรุณาเลือกผู้ปกครอง", disabled: true },
										{ value: 1, label: "มารดา" },
										{ value: 2, label: "บิดา" },
										{ value: 3, label: "อื่นๆ (ระบุ)" },
										]}
									/>
									</Form.Item>
								</Col>
								<Col xs={24} sm={24} md={24} lg={24} xl={12}>
									<Form.Item
										label="หรือผู้ปกครอง ชื่อ/สกุล"
										name="or_guardians_name"
									>
										<Input />
									</Form.Item>
								</Col>
								<Col xs={24} sm={24} md={24} lg={24} xl={12}>
									<Form.Item
										label="เกี่ยวข้องเป็น"
										name="relationship"
									>
										<Input />
									</Form.Item>
								</Col>
								<Col xs={24} sm={24} md={24} lg={24} xl={12}>
									<Form.Item
										label="อาชีพ"
										name="occupation_guardian"
									>
										<Input />
									</Form.Item>
								</Col>
								<Col xs={24} sm={24} md={24} lg={24} xl={12}>
									<Form.Item
										label="หมายเลขโทรศัพท์มือถือ"
										name="phone_guardian"
										rules={[{ message: "กรุณากรอกหมายเลขโทรศัพท์มือถือ" },
														{ pattern: /^[0-9]{10}$/, message: "กรุณากรอกหมายเลขโทรศัพท์มือถือ (10 หลัก)" }]}
									>
										<Input />
									</Form.Item>
								</Col>
					<Divider />
					<h4 style={{ marginTop: -10, marginBottom: -10,color: '#061178' }}>4. ข้อมูลอื่นๆ</h4>
					<Divider />
							<Col xs={24} sm={24} md={24} lg={24} xl={12}>
								<Form.Item
									label="สำเร็จการศึกษาขั้นสุดท้ายจาก"
									name="latest_graduation_from"
									rules={[{ required: true, message: "กรุณากรอกชื่อโรงเรียน" }]}
								>
									<Input placeholder="กรอกชื่อโรงเรียน" />
								</Form.Item>
							</Col>
							<Col></Col>
							<Col xs={24} sm={24} md={24} lg={24} xl={12}>
								<Form.Item
									label="เมื่อปี พ.ศ."
									name="graduation_year"
									rules={[{ required: true, message: "กรุณากรอก พ.ศ.",}]}
								>
								<InputNumber
									min={2500}
									max={2600}
									style={{ width: "100%" }}
								/>
								</Form.Item>
							</Col>
							<Col xs={24} sm={24} md={24} lg={24} xl={12}>
								<Form.Item
									label="GPAX"
									name="GPAX"
									rules={[{ required: true, message: "กรุณากรอก gpax",}]}
								>
								<InputNumber
									min={0.00}
									max={4.00}
									step={0.01} // เพิ่มทีละ 0.1
									style={{ width: "100%" }}
									precision={2} // ระบุให้แสดงเป็นทศนิยม 2 ตำแหน่ง
								/>
								</Form.Item>
							</Col>
							<Col xs={24} sm={24} md={24} lg={24} xl={12}>
								<Form.Item
									label="พาหนะส่วนตัวที่ใช้"
									name="personal_vehicles"
								>
									<Input />
								</Form.Item>
							</Col>
							<Col xs={24} sm={24} md={24} lg={24} xl={12}>
								<Form.Item
									label="สี"
									name="color"
								>
									<Input />
								</Form.Item>
							</Col>
							<Col xs={24} sm={24} md={24} lg={24} xl={12}>
								<Form.Item
									label="หมายเลขทะเบียน"
									name="plate_no"
								>
									<Input />
								</Form.Item>
							</Col>
							<Col xs={24} sm={24} md={24} lg={24} xl={12}>
								<Form.Item
									label="วันครบกำหนดเสียภาษี"
									name="vehicle_tax_due_date"
								>
									<DatePicker style={{ width: "100%" }} />
								</Form.Item>
							</Col>
							<Col xs={24} sm={24} md={24} lg={24} xl={12}>
								<Form.Item
									label="จังหวัด"
									name="province_vehicle"
									rules={[{
											message: "กรุณากรอกชื่อจังหวัดที่ถูกต้อง",
									},]}
								>
									<Input />
								</Form.Item>
							</Col>
							<Col xs={24} sm={24} md={24} lg={24} xl={12}>
								<Form.Item
									label="ใบขับขี่"
									name="licenses_id"
									rules={[{ required: false, message: "กรุณาเลือกใบขับขี่",}]}
								>
								<Select
										defaultValue=""
										style={{ width: "100%" }}
										options={[
										{ value: "", label: "กรุณาเลือกใบขับขี่", disabled: false },
										{ value: 1, label: "มี" },
										{ value: 2, label: "ไม่มี" },
										]}
								/>
								</Form.Item>
							</Col>
							<Col xs={24} sm={24} md={24} lg={24} xl={12}>
								<Form.Item
									label="ประเภท (ถ้ามี)"
									name="type"
								>
									<Input />
								</Form.Item>
							</Col>
							<Col xs={24} sm={24} md={24} lg={24} xl={12}>
								<Form.Item
									label="วันบัตรหมดอายุ"
									name="expiry"
								>
									<DatePicker style={{ width: "100%" }} />
								</Form.Item>
							</Col>
							
						</Row>
							<Row justify="end">
								<Col style={{ marginTop: "40px" }}>
									<Form.Item>
										<Space>
											<Button
												type="primary"
												htmlType="submit"
												icon={<EditOutlined />}
												style={{ backgroundColor: '#007bff', borderColor: '#007bff' }}
												>
												อัปเดตข้อมูล
											</Button>
												<Link to="/personal">
													<Button htmlType="button" style={{ marginRight: "0px" }}>
														ปิด
													</Button>
												</Link>
										</Space>
									</Form.Item>
								</Col>
							</Row>
						</Form>
				</Card>
  	</div>
  );
}

export default PersonalCreate;