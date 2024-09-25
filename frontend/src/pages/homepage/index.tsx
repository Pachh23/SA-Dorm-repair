import React, { useState, useEffect } from 'react';
import './index.css';
import { Layout, List, Card, Typography, message } from 'antd';
import { AnnouncementInterface } from "../../interfaces/Announcement";
import { GetLatestAnnouncements } from '../../services/https';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const { Content } = Layout;
const { Title, Text } = Typography;

const App: React.FC = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementInterface[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetLatestAnnouncements();
        console.log("Response:", response);
        if (response && Array.isArray(response)) {
          setAnnouncements(response);
        } else {
          message.error('ยังไม่มีประกาศ');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setError('Unexpected error occurred.');
      }
    };
    fetchData();
  }, []);

  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <Layout>
      <Content
        style={{
          margin: '24px 16px',
          padding: 24,
          minHeight: 550,
          background: '#fff',
          borderRadius: 8,
        }}
      >
        <Title level={3} style={{ textAlign: 'center', marginBottom: '24px' }}>
          ข่าวสารประชาสัมพันธ์
        </Title>
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={announcements}
          renderItem={(item: AnnouncementInterface) => (
            <List.Item>
              <Card
                title={item.Title}
                bordered={true}
                style={{ borderRadius: 9 }}
                headStyle={{ backgroundColor: '#f5f5f5', color: '#000000' }}
              >
                <Text strong>
                  วันที่: {item.Date ? dayjs(item.Date).locale('th').format('D MMMM YYYY') : 'ไม่ระบุ'}
                </Text>
                <br />
                <div style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
                  {formatContent(item.Content || 'ไม่มีเนื้อหา')}
                </div>
              </Card>
            </List.Item>
          )}
        />
      </Content>
    </Layout>
  );
};

export default App;