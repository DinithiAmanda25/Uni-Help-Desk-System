import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Typography, Button, Tag, Row, Col, Input, Select, Pagination, Drawer, Avatar, Divider, message, Space, Empty, Spin } from 'antd';
import { PushpinOutlined, EyeOutlined, CalendarOutlined, AimOutlined, EditOutlined, UserOutlined, NotificationOutlined, FilterOutlined, SearchOutlined, CheckCircleOutlined, RocketOutlined, ClockCircleOutlined, StarOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const API_BASE_URL = 'http://localhost:3000/api/notices';

const CATEGORIES = [
  { value: 'all', label: 'All Categories', color: 'default' },
  { value: 'academic', label: 'Academic', color: 'blue' },
  { value: 'exams', label: 'Exams', color: 'orange' },
  { value: 'events', label: 'Events', color: 'green' },
  { value: 'library', label: 'Library', color: 'purple' },
  { value: 'holiday', label: 'Holiday', color: 'magenta' }
];

const STUDENT_YEARS = [
  { value: '1st_year', label: '1st Year' },
  { value: '2nd_year', label: '2nd Year' },
  { value: '3rd_year', label: '3rd Year' },
  { value: '4th_year', label: '4th Year' }
];

const STUDENT_FACULTIES = [
  { value: 'it', label: 'IT' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'business', label: 'Business' }
];

const StudentDashboard = ({ refreshKey, currentRole }) => {
  const [studentProfile, setStudentProfile] = useState({
    year: '4th_year',
    faculty: 'it',
    name: 'Amila Silva'
  });
  const [profileDrawerVisible, setProfileDrawerVisible] = useState(false);

  const [loadingPinned, setLoadingPinned] = useState(false);
  const [loadingNotices, setLoadingNotices] = useState(false);
  const [pinnedNotices, setPinnedNotices] = useState([]);
  const [regularNotices, setRegularNotices] = useState([]);
  const [totalRegularNotices, setTotalRegularNotices] = useState(0);

  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const getCategoryColor = (category) => {
    const cat = CATEGORIES.find((c) => c.value === category);
    return cat ? cat.color : 'default';
  };

  const getCategoryLabel = (category) => {
    const cat = CATEGORIES.find((c) => c.value === category);
    return cat ? cat.label : category;
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'emergency':
        return 'red';
      case 'important':
        return 'orange';
      default:
        return 'blue';
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'emergency':
        return 'EMERGENCY';
      case 'important':
        return 'IMPORTANT';
      default:
        return 'GENERAL';
    }
  };

  const fetchPinnedNotices = useCallback(async () => {
    try {
      setLoadingPinned(true);
      const response = await axios.get(API_BASE_URL, {
        headers: { 'x-user-role': currentRole },
        params: {
          page: 1,
          limit: 10,
          pinned: true,
          activeOnly: true,
          year: studentProfile.year,
          faculty: studentProfile.faculty,
          search: searchText || undefined,
          category: selectedCategory,
          type: selectedType
        }
      });
      setPinnedNotices(response.data.data);
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to load pinned notices');
    } finally {
      setLoadingPinned(false);
    }
  }, [studentProfile.year, studentProfile.faculty, searchText, selectedCategory, selectedType, currentRole]);

  const fetchRegularNotices = useCallback(async (page = 1) => {
    try {
      setLoadingNotices(true);
      const response = await axios.get(API_BASE_URL, {
        headers: { 'x-user-role': currentRole },
        params: {
          page,
          limit: pageSize,
          pinned: false,
          activeOnly: true,
          year: studentProfile.year,
          faculty: studentProfile.faculty,
          search: searchText || undefined,
          category: selectedCategory,
          type: selectedType
        }
      });

      setRegularNotices(response.data.data);
      setTotalRegularNotices(response.data.pagination.total);
      setCurrentPage(response.data.pagination.page);
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to load notices');
    } finally {
      setLoadingNotices(false);
    }
  }, [pageSize, studentProfile.year, studentProfile.faculty, searchText, selectedCategory, selectedType, currentRole]);

  useEffect(() => {
    fetchPinnedNotices();
    fetchRegularNotices(1);
  }, [fetchPinnedNotices, fetchRegularNotices, refreshKey]);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const handleTypeChange = (value) => {
    setSelectedType(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    fetchRegularNotices(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateProfile = (field, value) => {
    setStudentProfile({ ...studentProfile, [field]: value });
    setCurrentPage(1);
  };

  const handleReadMore = async (noticeId) => {
    try {
      await axios.patch(`${API_BASE_URL}/${noticeId}/view`, {}, {
        headers: { 'x-user-role': currentRole }
      });
      fetchPinnedNotices();
      fetchRegularNotices(currentPage);
    } catch (error) {
      message.error('Failed to update view count');
    }
  };

  return (
    <div style={{ width: '100%', backgroundColor: '#f0f2f5', padding: '32px 0', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Header Card - Enhanced */}
        <Card
          style={{
            marginBottom: '32px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            boxShadow: '0 20px 35px -10px rgba(102, 126, 234, 0.3)',
            overflow: 'hidden'
          }}
        >
          <Row gutter={[32, 24]} align="middle" justify="space-between">
            <Col flex="auto">
              <div style={{ display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap' }}>
                <Avatar
                  size={80}
                  icon={<UserOutlined />}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: '#fff',
                    border: '3px solid rgba(255,255,255,0.4)',
                    fontSize: '40px',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                  }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <Title level={2} style={{ color: 'white', margin: 0, fontWeight: '700' }}>
                      {studentProfile.name}
                    </Title>
                    <Tag 
                      color="gold" 
                      style={{ borderRadius: '40px', padding: '4px 16px', fontWeight: '600' }}
                      icon={<StarOutlined />}
                    >
                      Student
                    </Tag>
                  </div>
                  <Paragraph style={{ color: 'rgba(255,255,255,0.85)', margin: 0, fontSize: '15px' }}>
                    Welcome to the Student Notice Dashboard
                  </Paragraph>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
                    <Tag 
                      color="geekblue" 
                      style={{ padding: '6px 20px', borderRadius: '40px', fontSize: '13px', fontWeight: '600' }}
                      icon={<CheckCircleOutlined />}
                    >
                      🎓 {STUDENT_YEARS.find((y) => y.value === studentProfile.year)?.label}
                    </Tag>
                    <Tag 
                      color="cyan" 
                      style={{ padding: '6px 20px', borderRadius: '40px', fontSize: '13px', fontWeight: '600' }}
                      icon={<CheckCircleOutlined />}
                    >
                      🏛️ {STUDENT_FACULTIES.find((f) => f.value === studentProfile.faculty)?.label}
                    </Tag>
                  </div>
                </div>
              </div>
            </Col>
            <Col>
              <Button
                
                onClick={() => setProfileDrawerVisible(true)}
                size="large"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '40px',
                  fontWeight: '500',
                  padding: '8px 28px',
                  height: 'auto',
                  fontSize: '14px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                ✏️ Edit Profile
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Filter & Search Controls - Enhanced */}
        <Card style={{ 
          marginBottom: '32px', 
          borderRadius: '20px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
          border: 'none',
          background: '#fff'
        }}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: '#667eea10',
                borderRadius: '12px',
                padding: '6px 14px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FilterOutlined style={{ color: '#667eea' }} />
                <Text strong style={{ color: '#1f2937', fontSize: '14px' }}>Search & Filter Notices</Text>
              </div>
            </div>
          </div>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={9}>
              <Input
                placeholder="🔍 Search by title or content..."
                allowClear
                onChange={handleSearchChange}
                size="large"
                
                style={{ borderRadius: '40px' }}
                value={searchText}
              />
            </Col>
            <Col xs={24} md={6}>
              <Select
                value={selectedCategory}
                size="large"
                style={{ width: '100%', borderRadius: '40px' }}
                onChange={handleCategoryChange}
                suffixIcon={<FilterOutlined />}
              >
                {CATEGORIES.map((cat) => (
                  <Option key={cat.value} value={cat.value}>{cat.label}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} md={9}>
              <Select
                value={selectedType}
                size="large"
                style={{ width: '100%', borderRadius: '40px' }}
                onChange={handleTypeChange}
                suffixIcon={<FilterOutlined />}
              >
                <Option value="all">📋 All Priorities</Option>
                <Option value="general">📄 General</Option>
                <Option value="important">⚠️ Important</Option>
                <Option value="emergency">🚨 Emergency</Option>
              </Select>
            </Col>
          </Row>

          <Divider style={{ margin: '20px 0 16px 0' }} />

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', flex: 1 }}>
              <Tag 
                color="purple" 
                style={{ padding: '6px 20px', fontSize: '13px', borderRadius: '40px', fontWeight: '500' }}
                
              >
                🎯 {STUDENT_YEARS.find((y) => y.value === studentProfile.year)?.label} • {STUDENT_FACULTIES.find((f) => f.value === studentProfile.faculty)?.label}
              </Tag>
              {searchText && (
                <Tag 
                  color="blue" 
                  style={{ padding: '6px 20px', borderRadius: '40px', fontSize: '12px' }}
                  closable 
                  onClose={() => setSearchText('')}
                >
                  🔍 "{searchText}" → {pinnedNotices.length + totalRegularNotices} result{pinnedNotices.length + totalRegularNotices !== 1 ? 's' : ''}
                </Tag>
              )}
            </div>
            <div>
              <Tag color="green" style={{ borderRadius: '40px', padding: '4px 16px' }}>
                <RocketOutlined /> Real-time Updates
              </Tag>
            </div>
          </div>
        </Card>

        {/* Pinned Notices Section - Enhanced */}
        {pinnedNotices.length > 0 && (
          <div style={{ marginBottom: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', gap: '14px', flexWrap: 'wrap' }}>
              <div style={{ 
                width: '5px', 
                height: '32px', 
                background: 'linear-gradient(135deg, #667eea, #764ba2)', 
                borderRadius: '3px' 
              }} />
             
              <Title level={4} style={{ margin: 0, color: '#1f2937', fontWeight: '600' }}>📌 Pinned Notices</Title>
              <Tag color="gold" style={{ borderRadius: '40px', marginLeft: 'auto' }}>{pinnedNotices.length} pinned items</Tag>
            </div>
            <Row gutter={[24, 24]}>
              {pinnedNotices.map((notice) => (
                <Col xs={24} md={12} key={notice._id}>
                  <Card
                    hoverable
                    loading={loadingPinned}
                    style={{
                      borderRadius: '20px',
                      borderLeft: `5px solid ${notice.type === 'emergency' ? '#ff4d4f' : notice.type === 'important' ? '#fa8c16' : '#4ba5c8'}`,
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                      overflow: 'hidden',
                      height: '100%'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.12)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
                      e.currentTarget.style.transform = 'translateY(0px)';
                    }}
                  >
                    <div style={{ marginBottom: '14px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <Tag color={getCategoryColor(notice.category)} style={{ borderRadius: '20px', padding: '2px 12px' }}>
                        {getCategoryLabel(notice.category)}
                      </Tag>
                      <Tag color={getTypeColor(notice.type)} style={{ borderRadius: '20px', padding: '2px 12px' }}>
                        {getTypeText(notice.type)}
                      </Tag>
                      <Tag color="gold" icon={<PushpinOutlined />} style={{ borderRadius: '20px' }}>PINNED</Tag>
                      {notice.target && (notice.target.years !== 'all_years' || notice.target.faculties !== 'all_faculties') && (
                        <Tag color="purple" icon={<AimOutlined />} style={{ borderRadius: '20px' }}>Targeted</Tag>
                      )}
                    </div>
                    <Title level={5} style={{ marginBottom: '10px', color: '#1f2937', fontWeight: '600' }}>{notice.title}</Title>
                    <Paragraph style={{ color: '#6b7280', marginBottom: '16px', fontSize: '14px', lineHeight: '1.6' }}>
                      {notice.content.length > 120 ? notice.content.substring(0, 120) + '...' : notice.content}
                    </Paragraph>
                    <Divider style={{ margin: '12px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#9ca3af' }}>
                      <div style={{ display: 'flex', gap: '20px' }}>
                        <span><CalendarOutlined style={{ marginRight: '5px' }} /> {moment(notice.startDate).format('MMM DD, YYYY')}</span>
                        <span><EyeOutlined style={{ marginRight: '5px' }} /> {notice.views} views</span>
                        <span><ClockCircleOutlined style={{ marginRight: '5px' }} /> {moment(notice.startDate).fromNow()}</span>
                      </div>
                      <Button 
                        type="primary" 
                        size="small" 
                        onClick={() => handleReadMore(notice._id)} 
                        style={{ borderRadius: '40px', background: '#667eea', border: 'none' }}
                      >
                        Read More →
                      </Button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}

        {/* All Notices Section - Enhanced */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', gap: '14px', flexWrap: 'wrap' }}>
            <div style={{ 
              width: '5px', 
              height: '32px', 
              background: 'linear-gradient(135deg, #667eea, #764ba2)', 
              borderRadius: '3px' 
            }} />
            
            <Title level={4} style={{ margin: 0, color: '#1f2937', fontWeight: '600' }}>📢 All Notices</Title>
            <Tag color="blue" style={{ borderRadius: '40px', marginLeft: 'auto' }}>{totalRegularNotices} notices available</Tag>
          </div>

          {regularNotices.length > 0 ? (
            <Spin spinning={loadingNotices}>
              <Row gutter={[24, 24]}>
                {regularNotices.map((notice) => (
                  <Col xs={24} md={12} lg={8} key={notice._id}>
                    <Card 
                      hoverable 
                      style={{ 
                        borderRadius: '20px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        overflow: 'hidden',
                        height: '100%'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.12)';
                        e.currentTarget.style.transform = 'translateY(-4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                        e.currentTarget.style.transform = 'translateY(0px)';
                      }}
                    >
                      <div style={{ 
                        marginBottom: '12px', 
                        display: 'flex', 
                        gap: '8px', 
                        flexWrap: 'wrap' 
                      }}>
                        <Tag color={getCategoryColor(notice.category)} style={{ borderRadius: '20px', padding: '2px 12px' }}>
                          {getCategoryLabel(notice.category)}
                        </Tag>
                        <Tag color={getTypeColor(notice.type)} style={{ borderRadius: '20px', padding: '2px 12px' }}>
                          {getTypeText(notice.type)}
                        </Tag>
                        {notice.target && (notice.target.years !== 'all_years' || notice.target.faculties !== 'all_faculties') && (
                          <Tag color="purple" icon={<AimOutlined />} style={{ borderRadius: '20px' }}>Targeted</Tag>
                        )}
                      </div>
                      <Title level={5} style={{ marginBottom: '10px', color: '#1f2937', fontWeight: '600' }}>{notice.title}</Title>
                      <Paragraph style={{ color: '#6b7280', marginBottom: '16px', fontSize: '14px', lineHeight: '1.6' }}>
                        {notice.content.length > 100 ? notice.content.substring(0, 100) + '...' : notice.content}
                      </Paragraph>
                      <Divider style={{ margin: '12px 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#9ca3af' }}>
                        <div style={{ display: 'flex', gap: '16px' }}>
                          <span><CalendarOutlined style={{ marginRight: '4px' }} /> {moment(notice.startDate).format('MMM DD')}</span>
                          <span><EyeOutlined style={{ marginRight: '4px' }} /> {notice.views}</span>
                        </div>
                        <Button 
                          type="link" 
                          size="small" 
                          onClick={() => handleReadMore(notice._id)} 
                          style={{ color: '#667eea', fontWeight: '500', borderRadius: '20px' }}
                        >
                          Read More →
                        </Button>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>

              {totalRegularNotices > pageSize && (
                <div style={{ textAlign: 'center', marginTop: '48px' }}>
                  <Pagination
                    current={currentPage}
                    total={totalRegularNotices}
                    pageSize={pageSize}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showTotal={(total) => `📄 Total ${total} notices`}
                    style={{ display: 'inline-block' }}
                  />
                </div>
              )}
            </Spin>
          ) : (
            <Card style={{ textAlign: 'center', padding: '80px 20px', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <Empty
                description={
                  <div>
                    <Text type="secondary" style={{ fontSize: '16px', display: 'block', marginBottom: '16px' }}>
                      {loadingNotices ? '⏳ Loading notices...' : '📭 No notices found for your profile'}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '14px' }}>
                      Try changing your profile filters or check back later
                    </Text>
                  </div>
                }
                style={{ margin: '20px 0' }}
              >
                <Button type="primary" onClick={() => setProfileDrawerVisible(true)} size="large" style={{ borderRadius: '40px', background: '#667eea', border: 'none' }}>
                  ✏️ Update Profile
                </Button>
              </Empty>
            </Card>
          )}
        </div>
      </div>

      {/* Profile Drawer - Enhanced */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserOutlined style={{ color: '#667eea' }} />
            <span style={{ fontSize: '16px', fontWeight: '600' }}>Update Student Profile</span>
          </div>
        }
        placement="right"
        onClose={() => setProfileDrawerVisible(false)}
        open={profileDrawerVisible}
        size="large"
        styles={{ body: { paddingBottom: '80px', paddingTop: '20px' } }}
      >
        <Space orientation="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Text strong style={{ fontSize: '14px', color: '#1f2937', display: 'block', marginBottom: '8px' }}>
              🎓 Year of Study
            </Text>
            <Select
              value={studentProfile.year}
              onChange={(value) => updateProfile('year', value)}
              style={{ width: '100%', borderRadius: '12px' }}
              size="large"
            >
              {STUDENT_YEARS.map((y) => (
                <Option key={y.value} value={y.value}>{y.label}</Option>
              ))}
            </Select>
          </div>
          <div>
            <Text strong style={{ fontSize: '14px', color: '#1f2937', display: 'block', marginBottom: '8px' }}>
              🏛️ Faculty
            </Text>
            <Select
              value={studentProfile.faculty}
              onChange={(value) => updateProfile('faculty', value)}
              style={{ width: '100%', borderRadius: '12px' }}
              size="large"
            >
              {STUDENT_FACULTIES.map((f) => (
                <Option key={f.value} value={f.value}>{f.label}</Option>
              ))}
            </Select>
          </div>
          <Divider />
          <Button
            type="primary"
            block
            onClick={() => setProfileDrawerVisible(false)}
            size="large"
            style={{ borderRadius: '40px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', height: '48px', fontSize: '16px' }}
          >
            ✅ Save & Close
          </Button>
        </Space>
      </Drawer>
    </div>
  );
};

export default StudentDashboard;