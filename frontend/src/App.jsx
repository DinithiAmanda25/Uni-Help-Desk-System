import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Card, Typography, Button, Tag, Tabs } from 'antd';
import axios from 'axios';
import { NotificationOutlined, BellOutlined, UserOutlined, AimOutlined, SettingOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import StudentDashboard from './features/notice-management/components/StudentDashboard';
import AdminPanel from './features/notice-management/components/AdminPanel';
import './App.css';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const API_BASE_URL = 'http://localhost:3000/api/notices';
const ROLE_STORAGE_KEY = 'uhd_current_role';

const getInitialRole = () => {
  if (typeof window === 'undefined') {
    return 'student';
  }

  const savedRole = window.localStorage.getItem(ROLE_STORAGE_KEY);
  return savedRole === 'admin' || savedRole === 'student' ? savedRole : 'student';
};

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentRole, setCurrentRole] = useState(getInitialRole);
  const [activeTab, setActiveTab] = useState(currentRole === 'admin' ? 'admin' : 'student');
  const [refreshKey, setRefreshKey] = useState(0);
  const [stats, setStats] = useState({ total: 0, pinned: 0, emergency: 0, targeted: 0 });

  const loadStats = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stats`, {
        headers: { 'x-user-role': currentRole },
        params: { activeOnly: false }
      });
      setStats(response.data);
    } catch (error) {
      setStats({ total: 0, pinned: 0, emergency: 0, targeted: 0 });
    }
  }, [currentRole]);

  useEffect(() => {
    loadStats();
  }, [refreshKey, loadStats]);

  useEffect(() => {
    if (currentRole === 'student') {
      setActiveTab('student');
    } else if (currentRole === 'admin') {
      setActiveTab('admin');
    }

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(ROLE_STORAGE_KEY, currentRole);
    }
  }, [currentRole]);

  useEffect(() => {
    const isAdminPath = location.pathname === '/admin';

    if (isAdminPath && currentRole !== 'admin') {
      navigate('/', { replace: true });
      setActiveTab('student');
      return;
    }

    setActiveTab(isAdminPath ? 'admin' : 'student');
  }, [location.pathname, currentRole, navigate]);

  const triggerRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
    loadStats();
  }, [loadStats]);

  const handleTabChange = (tabKey) => {
    if (tabKey === 'admin') {
      if (currentRole !== 'admin') {
        return;
      }

      navigate('/admin');
      return;
    }

    navigate('/');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Header */}
      <Header style={{ 
        background: '#001529', 
        padding: '0 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <NotificationOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
          <Title level={4} style={{ color: 'white', margin: 0 }}>Uni HelpDesk</Title>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              type={currentRole === 'student' ? 'primary' : 'default'}
              onClick={() => {
                setCurrentRole('student');
                navigate('/');
              }}
            >
              Student Role
            </Button>
            <Button
              type={currentRole === 'admin' ? 'primary' : 'default'}
              onClick={() => {
                setCurrentRole('admin');
                navigate('/admin');
              }}
            >
              Admin Role
            </Button>
          </div>
          <Button type="text" icon={<BellOutlined />} style={{ color: 'white' }} />
          <Button type="primary" icon={<UserOutlined />}>
            {currentRole === 'admin' ? 'Admin' : 'Student'}
          </Button>
        </div>
      </Header>

      {/* Main Content */}
      <Content style={{ padding: '0', background: '#f5f7fa', minHeight: 'calc(100vh - 64px)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
          {/* Hero Section */}
          <Card style={{ 
            marginBottom: '32px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '16px'
          }}>
            <div style={{ textAlign: 'center', padding: '48px 24px' }}>
              <Title level={1} style={{ color: 'white', marginBottom: '16px', fontSize: '32px' }}>
                Notice Board
              </Title>
              <Text style={{ color: 'white', fontSize: '18px', opacity: 0.95 }}>
                University Official Notices and Announcements
              </Text>
              <div style={{ marginTop: '24px' }}>
                <Tag color="gold" style={{ margin: '4px', padding: '4px 12px', borderRadius: '20px' }}>
                  📌 Pinned: {stats.pinned}
                </Tag>
                <Tag color="blue" style={{ margin: '4px', padding: '4px 12px', borderRadius: '20px' }}>
                  📄 Total: {stats.total}
                </Tag>
                <Tag color="red" style={{ margin: '4px', padding: '4px 12px', borderRadius: '20px' }}>
                  🚨 Emergency: {stats.emergency}
                </Tag>
                <Tag color="purple" style={{ margin: '4px', padding: '4px 12px', borderRadius: '20px' }}>
                  <AimOutlined /> Smart Targeting: {stats.targeted}
                </Tag>
              </div>
            </div>
          </Card>

          {/* Tabs */}
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            size="large"
            centered
            style={{ marginBottom: '24px', background: 'transparent' }}
            items={[
              {
                key: 'student',
                label: <span><NotificationOutlined /> Student Dashboard</span>,
                children: <StudentDashboard refreshKey={refreshKey} currentRole={currentRole} />
              },
              {
                key: 'admin',
                label: <span><SettingOutlined /> Admin Panel</span>,
                disabled: currentRole !== 'admin',
                children: <AdminPanel onDataChanged={triggerRefresh} currentRole={currentRole} />
              }
            ]}
          />
        </div>
      </Content>
    </Layout>
  );
}

export default App;