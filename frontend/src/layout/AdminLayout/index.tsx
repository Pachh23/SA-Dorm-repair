import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import { Layout, Menu, Button, Typography, message, Breadcrumb} from 'antd';
import {
  BellOutlined,
  ToolOutlined,
  FormOutlined,
  CheckCircleOutlined,
  UsergroupAddOutlined,
  UserOutlined
} from '@ant-design/icons'; // นำเข้าไอคอนจาก Ant Design
import './index.css';
import Logo from '../../assets/logo.png';
import AdminRoutes from '../../routes/AdminRoutes';
import { GetAdminByID } from '../../services/https'; // นำเข้าฟังก์ชัน GetAdminByID

const { Content,Sider } = Layout;
const { Title } = Typography;

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['1']);
  const [messageApi, contextHolder] = message.useMessage();
  const [adminName, setAdminName] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const adminID = localStorage.getItem('id');
    if (adminID) {
      GetAdminByID(Number(adminID))
        .then(data => {
          const { first_name, last_name } = data;
          setAdminName(`${first_name} ${last_name}`);
        })
        .catch(() => {
          setAdminName('Admin');
        });
    }

    const path = location.pathname;
    switch (path) {
      case '/Announcement':
        setSelectedKeys(['1']);
        break;
      case '/Repairing':
        setSelectedKeys(['2']);
        break;
      case '/RequestDelayingPayment':
        setSelectedKeys(['form1']);
        break;
      case '/Enteringandexitingdorm':
        setSelectedKeys(['form2']);
        break;
      case '/ResigningForm':
        setSelectedKeys(['form3']);
        break;
      case '/PaymentConfirmation':
        setSelectedKeys(['paymentConfirmation']);
        break;
      case '/AdminManagement':
        setSelectedKeys(['adminManagement']);
        break;
      case '/ManageStudents':
        setSelectedKeys(['manageStudents']);
        break;
      default:
        setSelectedKeys([]);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('adminID');
    localStorage.removeItem('isLoginAdmin');
    localStorage.removeItem('isLoginStudent');
    localStorage.removeItem('adminName'); // ลบชื่อแอดมินออกจาก localStorage
    messageApi.success('ออกจากระบบสำเร็จ');
    navigate('/login');
  };

  const dropdownMenu = (
    <Menu className="custom-menu-submenu" mode="inline">
      <Menu.Item key="form1">
        <Link to="/RequestDelayingPayment">ฟอร์มผ่อนผัน</Link>
      </Menu.Item>
      <Menu.Item key="form2">
        <Link to="/Enteringandexitingdorm">ฟอร์มขออนุญาตเข้า-ออกหอพัก</Link>
      </Menu.Item>
      <Menu.Item key="form3">
        <Link to="/ResigningForm">ฟอร์มลาออกหอพัก</Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
       {contextHolder}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        className="custom-sider"
      >
        <div style={{ textAlign: 'center', padding: '16px' }}>
          <img src={Logo} alt="Logo" style={{ width: collapsed ? '40%' : '60%' }} />
          {!collapsed && (
            <div style={{ marginTop: '16px' }}>
              <Title level={4} className="admin-name" style={{ color: 'white', margin: 0 }}>
                {adminName || 'Admin'}
              </Title>
            </div>
          )}
        </div>
        <Menu className="custom-menu" mode="inline" selectedKeys={selectedKeys}>
          <Menu.Item key="1" icon={<BellOutlined />}>
            <Link to="/Announcement">แจ้งข่าวสาร</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<ToolOutlined />}>
            <Link to="/Repairing">แจ้งซ่อม</Link>
          </Menu.Item>
          <Menu.SubMenu key="dropdown" title="แบบฟอร์ม" icon={<FormOutlined />}>
            {dropdownMenu}
          </Menu.SubMenu>
          <Menu.Item key="paymentConfirmation" icon={<CheckCircleOutlined />}>
            <Link to="/PaymentConfirmation">ยืนยันการชำระ</Link>
          </Menu.Item>
          <Menu.Item key="adminManagement" icon={<UserOutlined />}>
            <Link to="/AdminManagement">จัดการแอดมิน</Link>
          </Menu.Item>
          <Menu.Item key="manageStudents" icon={<UsergroupAddOutlined />}>
            <Link to="/ManageStudents">จัดการนักศึกษา</Link>
          </Menu.Item>
        </Menu>
        <div className="logout-container">
          <Button className="logout-button" type="primary" onClick={handleLogout}>
            ออกจากระบบ
          </Button>
        </div>
      </Sider>
      <Layout>
      <Content className="custom-content" style={{ padding: 24 }}>
          <Breadcrumb style={{ margin: '5px 0',backgroundColor: '#feffff' }} />
          <Routes>
            {AdminRoutes(true)[0].children?.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
