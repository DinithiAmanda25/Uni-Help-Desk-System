import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Form, Input, Button, Select, DatePicker, Switch, Table, Modal, message, Popconfirm, Space, Tag, Row, Col, Typography, Tooltip, Empty } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, PushpinOutlined, AimOutlined, SearchOutlined, FilterOutlined, BgColorsOutlined, EyeOutlined, CalendarOutlined, ClockCircleOutlined, RocketOutlined } from '@ant-design/icons';
import moment from 'moment';

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;
const API_BASE_URL = 'http://localhost:3000/api/notices';

// Category options
const CATEGORIES = [
  { value: 'academic', label: 'Academic', color: 'blue' },
  { value: 'exams', label: 'Exams', color: 'orange' },
  { value: 'events', label: 'Events', color: 'green' },
  { value: 'library', label: 'Library', color: 'purple' },
  { value: 'holiday', label: 'Holiday', color: 'magenta' }
];

// Target Year Options
const TARGET_YEARS = [
  { value: 'all_years', label: 'All Years' },
  { value: '1st_year', label: '1st Year' },
  { value: '2nd_year', label: '2nd Year' },
  { value: '3rd_year', label: '3rd Year' },
  { value: '4th_year', label: '4th Year' }
];

// Target Faculty Options
const TARGET_FACULTIES = [
  { value: 'all_faculties', label: 'All Faculties' },
  { value: 'it', label: 'IT' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'business', label: 'Business' }
];

const AdminPanel = ({ onDataChanged, currentRole }) => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, limit: 5, total: 0 });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [form] = Form.useForm();

  const fetchNotices = useCallback(async (options = {}) => {
    const page = options.page ?? 1;
    const search = options.search ?? searchText;
    const category = options.category ?? filterCategory;

    try {
      setLoading(true);
      const response = await axios.get(API_BASE_URL, {
        headers: { 'x-user-role': currentRole },
        params: {
          page,
          limit: pagination.limit,
          activeOnly: false,
          search: search || undefined,
          category
        }
      });

      setNotices(response.data.data);
      setPagination((prev) => ({
        ...prev,
        page: response.data.pagination.page,
        total: response.data.pagination.total
      }));
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to load notices');
    } finally {
      setLoading(false);
    }
  }, [pagination.limit, searchText, filterCategory, currentRole]);

  useEffect(() => {
    fetchNotices({ page: 1 });
  }, [currentRole, fetchNotices]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchNotices({ page: 1, search: searchText, category: filterCategory });
    }, 250);

    return () => clearTimeout(timeout);
  }, [searchText, filterCategory, fetchNotices]);

  const getCategoryColor = (category) => {
    const cat = CATEGORIES.find(c => c.value === category);
    return cat ? cat.color : 'default';
  };

  const getCategoryLabel = (category) => {
    const cat = CATEGORIES.find(c => c.value === category);
    return cat ? cat.label : category;
  };

  const getTargetLabel = (target) => {
    if (!target) return 'All Students';
    const parts = [];
    if (target.years && target.years !== 'all_years') {
      const year = TARGET_YEARS.find(y => y.value === target.years);
      if (year) parts.push(year.label);
    }
    if (target.faculties && target.faculties !== 'all_faculties') {
      const faculty = TARGET_FACULTIES.find(f => f.value === target.faculties);
      if (faculty) parts.push(faculty.label);
    }
    return parts.length > 0 ? parts.join(' - ') : 'All Students';
  };

  const handleSubmit = async (values) => {
    const noticeData = {
      title: values.title,
      content: values.content,
      type: values.type,
      category: values.category,
      isPinned: values.isPinned || false,
      target: {
        years: values.targetYears || 'all_years',
        faculties: values.targetFaculties || 'all_faculties'
      },
      startDate: values.dateRange[0].toISOString(),
      endDate: values.dateRange[1].toISOString()
    };

    try {
      if (editingNotice) {
        await axios.put(`${API_BASE_URL}/${editingNotice._id}`, noticeData, {
          headers: { 'x-user-role': currentRole }
        });
        message.success('Notice updated successfully');
        onDataChanged?.();
      } else {
        await axios.post(API_BASE_URL, noticeData, {
          headers: { 'x-user-role': currentRole }
        });
        message.success('Notice created successfully');
        onDataChanged?.();
      }

      setModalVisible(false);
      setEditingNotice(null);
      form.resetFields();
      await fetchNotices({ page: 1 });
    } catch (error) {
      const backendError = error?.response?.data?.error || error?.response?.data?.message;
      if (backendError) {
        message.error(backendError);
      } else {
        message.error('Failed to save notice. Check backend server is running on http://localhost:3000');
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`, {
        headers: { 'x-user-role': currentRole }
      });
      message.success('Notice deleted successfully');
      onDataChanged?.();
      await fetchNotices({ page: 1 });
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to delete notice');
    }
  };

  const handleTogglePin = async (notice) => {
    try {
      await axios.put(`${API_BASE_URL}/${notice._id}`, {
        title: notice.title,
        content: notice.content,
        type: notice.type,
        category: notice.category,
        isPinned: !notice.isPinned,
        target: notice.target,
        startDate: notice.startDate,
        endDate: notice.endDate
      }, {
        headers: { 'x-user-role': currentRole }
      });
      message.success(!notice.isPinned ? 'Notice pinned' : 'Notice unpinned');
      onDataChanged?.();
      await fetchNotices({ page: 1 });
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to update pin');
    }
  };

  const handleEdit = (notice) => {
    setEditingNotice(notice);
    form.setFieldsValue({
      title: notice.title,
      content: notice.content,
      type: notice.type,
      category: notice.category,
      targetYears: notice.target?.years || 'all_years',
      targetFaculties: notice.target?.faculties || 'all_faculties',
      isPinned: notice.isPinned,
      dateRange: [moment(notice.startDate), moment(notice.endDate)]
    });
    setModalVisible(true);
  };

  const handleCreate = () => {
    setEditingNotice(null);
    form.resetFields();
    setModalVisible(true);
  };

  const columns = [
    { 
      title: <span><RocketOutlined style={{ marginRight: '6px' }} />Title</span>, 
      dataIndex: 'title', 
      key: 'title', 
      width: 220,
      render: (text, record) => (
        <div>
          <Text strong style={{ fontSize: '14px' }}>{text}</Text>
          {record.isPinned && (
            <Tag color="gold" style={{ marginLeft: '8px', fontSize: '10px' }}>PINNED</Tag>
          )}
        </div>
      )
    },
    {
      title: <span><AimOutlined style={{ marginRight: '6px' }} />Target</span>,
      dataIndex: 'target', 
      key: 'target', 
      width: 120,
      render: (target) => <Tag color="purple" icon={<AimOutlined />} style={{ borderRadius: '20px' }}>{getTargetLabel(target)}</Tag>
    },
    {
      title: <span><FilterOutlined style={{ marginRight: '6px' }} />Category</span>,
      dataIndex: 'category', 
      key: 'category', 
      width: 100,
      render: (category) => <Tag color={getCategoryColor(category)} style={{ borderRadius: '20px' }}>{getCategoryLabel(category)}</Tag>
    },
    {
      title: <span><PushpinOutlined style={{ marginRight: '6px' }} />Priority</span>,
      dataIndex: 'type', 
      key: 'type', 
      width: 100,
      render: (type) => {
        const colors = { emergency: 'red', important: 'orange', general: '#4ba5c8' };
        const texts = { emergency: 'EMERGENCY', important: 'IMPORTANT', general: 'GENERAL' };
        return <Tag color={colors[type]} style={{ borderRadius: '20px' }}>{texts[type]}</Tag>;
      }
    },
    {
      title: <span><CalendarOutlined style={{ marginRight: '6px' }} />Date Range</span>,
      key: 'dateRange', 
      width: 180,
      render: (_, record) => (
        <Tooltip title={`Valid from ${moment(record.startDate).format('YYYY-MM-DD')} to ${moment(record.endDate).format('YYYY-MM-DD')}`}>
          <Tag color="blue" style={{ borderRadius: '20px' }}>
            <CalendarOutlined /> {moment(record.startDate).format('MMM DD')} - {moment(record.endDate).format('MMM DD')}
          </Tag>
        </Tooltip>
      )
    },
    { 
      title: <span><EyeOutlined style={{ marginRight: '6px' }} />Pinned</span>,
      dataIndex: 'isPinned', 
      key: 'isPinned', 
      width: 70, 
      render: (isPinned) => isPinned ? <Tag color="gold" style={{ borderRadius: '20px' }}>Yes</Tag> : <Tag style={{ borderRadius: '20px' }}>No</Tag> 
    },
    {
      title: <span>Actions</span>,
      key: 'actions', 
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title={record.isPinned ? "Unpin Notice" : "Pin Notice"}>
            <Button 
              icon={<PushpinOutlined />} 
              size="small" 
              onClick={() => handleTogglePin(record)} 
              style={{ 
                color: record.isPinned ? '#fa8c16' : '#8c8c8c',
                borderRadius: '8px'
              }} 
            />
          </Tooltip>
          <Tooltip title="Edit Notice">
            <Button 
              icon={<EditOutlined />} 
              size="small" 
              onClick={() => handleEdit(record)}
              style={{ borderRadius: '8px' }}
            />
          </Tooltip>
          <Tooltip title="Delete Notice">
            <Popconfirm title="Delete this notice?" onConfirm={() => handleDelete(record._id)} okText="Yes" cancelText="No">
              <Button icon={<DeleteOutlined />} size="small" danger style={{ borderRadius: '8px' }} />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div style={{ width: '100%', backgroundColor: '#f0f2f5', padding: '32px 0', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Header Section - Enhanced */}
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
          <Row gutter={[24, 24]} align="middle" justify="space-between">
            <Col flex="auto">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    width: '48px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <BgColorsOutlined style={{ fontSize: '24px', color: 'white' }} />
                  </div>
                  <Title level={2} style={{ color: 'white', margin: 0, fontWeight: '700' }}>
                    Notice Management
                  </Title>
                </div>
                <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', marginLeft: '60px' }}>
                  Create, manage, and distribute notices to students with smart targeting
                </Text>
              </div>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => handleCreate()}
                size="large"
                style={{
                  backgroundColor: '#fff',
                  color: '#667eea',
                  border: 'none',
                  borderRadius: '40px',
                  fontWeight: '600',
                  padding: '8px 32px',
                  height: 'auto',
                  fontSize: '15px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }}
              >
                
                Create New Notice
              </Button>
            </Col>
          </Row>
          
          {/* Stats Row */}
          <Row gutter={[24, 24]} style={{ marginTop: '32px' }}>
            <Col>
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '16px', padding: '12px 24px', textAlign: 'center' }}>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>Total Notices</Text>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>{pagination.total}</div>
              </div>
            </Col>
            <Col>
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '16px', padding: '12px 24px', textAlign: 'center' }}>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>Pinned</Text>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#faad14' }}>{notices.filter(n => n.isPinned).length}</div>
              </div>
            </Col>
            <Col>
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '16px', padding: '12px 24px', textAlign: 'center' }}>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>Categories</Text>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>{CATEGORIES.length}</div>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Filter & Search Controls - Enhanced */}
        <Card 
          style={{ 
            marginBottom: '32px', 
            borderRadius: '20px', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
            border: 'none',
            background: '#fff'
          }}
        >
          <Row gutter={[16, 16]} align="middle" justify="space-between">
            <Col>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  background: '#667eea10',
                  borderRadius: '12px',
                  padding: '8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <FilterOutlined style={{ color: '#667eea' }} />
                  <Text strong style={{ color: '#1f2937' }}>Filter Notices</Text>
                </div>
              </div>
            </Col>
            <Col xs={24} md={14}>
              <Row gutter={[12, 12]} justify="end">
                <Col xs={24} md={10}>
                  <Input
                    allowClear
                    placeholder="🔍 Search by title, content..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    size="large"
                    style={{ borderRadius: '40px' }}
                  />
                </Col>
                <Col xs={24} md={8}>
                  <Select 
                    value={filterCategory} 
                    onChange={setFilterCategory} 
                    style={{ width: '100%', borderRadius: '40px' }} 
                    size="large"
                    suffixIcon={<FilterOutlined />}
                  >
                    <Option value="all">📋 All Categories</Option>
                    {CATEGORIES.map(c => <Option key={c.value} value={c.value}>{c.label}</Option>)}
                  </Select>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>

        {/* Notices Table Card - Enhanced */}
        <Card 
          style={{ 
            borderRadius: '20px', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: 'none',
            overflow: 'hidden'
          }}
        >
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
            <div>
              <Title level={4} style={{ margin: 0, color: '#1f2937', fontWeight: '600' }}>
                📋 All Notices
              </Title>
              <Text type="secondary" style={{ fontSize: '13px' }}>
                Total {pagination.total} notices in the system
              </Text>
            </div>
            <div>
              <Tag color="gold" style={{ borderRadius: '20px' }}>📌 Pinned: {notices.filter(n => n.isPinned).length}</Tag>
              <Tag color="blue" style={{ borderRadius: '20px', marginLeft: '8px' }}>📄 Active: {notices.length}</Tag>
            </div>
          </div>

          {notices.length > 0 ? (
            <Table
              columns={columns}
              dataSource={notices}
              loading={loading}
              rowKey="_id"
              pagination={{
                current: pagination.page,
                pageSize: pagination.limit,
                total: pagination.total,
                onChange: (page) => fetchNotices({ page }),
                showSizeChanger: false,
                showTotal: (total) => `📊 Total ${total} notices`,
                style: { borderRadius: '12px' }
              }}
              scroll={{ x: 1200 }}
              style={{ borderRadius: '16px' }}
              rowClassName={(record) => record.isPinned ? 'pinned-row' : ''}
              onRow={(record) => ({
                style: {
                  backgroundColor: record.isPinned ? 'rgba(255, 215, 0, 0.06)' : 'inherit',
                }
              })}
            />
          ) : (
            <Empty
              description={loading ? 'Loading notices...' : 'No notices found'}
              style={{ margin: '60px 0' }}
            >
              <Button type="primary" onClick={() => handleCreate()} size="large" style={{ borderRadius: '40px' }}>
                ✨ Create First Notice
              </Button>
            </Empty>
          )}
        </Card>
      </div>

      {/* Create/Edit Modal - Enhanced */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0' }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: '12px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {editingNotice ? <EditOutlined style={{ color: 'white' }} /> : <PlusOutlined style={{ color: 'white' }} />}
            </div>
            <span style={{ fontSize: '18px', fontWeight: '600' }}>{editingNotice ? "Edit Notice" : "Create New Notice"}</span>
            <Tag color="purple" style={{ marginLeft: 'auto', borderRadius: '20px' }}>
              <AimOutlined /> Smart Targeting
            </Tag>
          </div>
        }
        open={modalVisible}
        onCancel={() => { 
          setModalVisible(false); 
          setEditingNotice(null); 
          form.resetFields(); 
        }}
        footer={null}
        width={720}
        styles={{ body: { padding: '28px', maxHeight: '70vh', overflow: 'auto' } }}
        destroyOnClose
      >
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleSubmit}
          initialValues={{ 
            type: 'general', 
            category: 'academic', 
            targetYears: 'all_years', 
            targetFaculties: 'all_faculties', 
            isPinned: false 
          }}
        >
          <Form.Item 
            name="title" 
            label={<Text strong><RocketOutlined style={{ marginRight: '6px' }} />Notice Title</Text>}
            rules={[
              { required: true, message: 'Title is required' }, 
              { min: 4, message: 'Title must be at least 4 characters' }
            ]}
          >
            <Input 
              placeholder="Enter notice title" 
              maxLength={140}
              size="large"
              style={{ borderRadius: '12px' }}
            />
          </Form.Item>

          <Form.Item 
            name="content" 
            label={<Text strong><EditOutlined style={{ marginRight: '6px' }} />Content</Text>}
            rules={[
              { required: true, message: 'Content is required' }, 
              { min: 8, message: 'Content must be at least 8 characters' }
            ]}
          >
            <TextArea 
              rows={5} 
              placeholder="Enter notice content" 
              maxLength={4000} 
              showCount
              style={{ borderRadius: '12px' }}
            />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="category" 
                label={<Text strong><FilterOutlined style={{ marginRight: '6px' }} />Category</Text>}
              >
                <Select size="large" style={{ borderRadius: '12px' }}>
                  {CATEGORIES.map(c => <Option key={c.value} value={c.value}>{c.label}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="type" 
                label={<Text strong><PushpinOutlined style={{ marginRight: '6px' }} />Priority Type</Text>}
              >
                <Select size="large" style={{ borderRadius: '12px' }}>
                  <Option value="general">
                    <Tag color="#4ba5c8" style={{ borderRadius: '20px' }}>📄 General</Tag>
                  </Option>
                  <Option value="important">
                    <Tag color="orange" style={{ borderRadius: '20px' }}>⚠️ Important</Tag>
                  </Option>
                  <Option value="emergency">
                    <Tag color="red" style={{ borderRadius: '20px' }}>🚨 Emergency</Tag>
                  </Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Smart Targeting Section - Enhanced */}
          <Card 
            size="small" 
            style={{ 
              marginBottom: '20px', 
              background: 'linear-gradient(135deg, #f9f0ff 0%, #f5f0ff 100%)',
              borderColor: '#d3adf7',
              borderRadius: '16px'
            }}
          >
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                background: '#667eea',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AimOutlined style={{ color: 'white', fontSize: '14px' }} />
              </div>
              <Text strong style={{ color: '#667eea', fontSize: '15px' }}>Smart Targeted Announcement</Text>
              <Tag color="purple" style={{ borderRadius: '20px', fontSize: '10px' }}>NEW</Tag>
            </div>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item 
                  name="targetYears" 
                  label={<Text style={{ fontSize: '13px' }}>🎓 Target Year</Text>}
                  style={{ marginBottom: '12px' }}
                >
                  <Select size="large" style={{ borderRadius: '12px' }}>
                    {TARGET_YEARS.map(y => <Option key={y.value} value={y.value}>{y.label}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                  name="targetFaculties" 
                  label={<Text style={{ fontSize: '13px' }}>🏛️ Target Faculty</Text>}
                  style={{ marginBottom: '12px' }}
                >
                  <Select size="large" style={{ borderRadius: '12px' }}>
                    {TARGET_FACULTIES.map(f => <Option key={f.value} value={f.value}>{f.label}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Form.Item
            name="dateRange"
            label={<Text strong><CalendarOutlined style={{ marginRight: '6px' }} />Effective Date Range</Text>}
            rules={[{ required: true, message: 'Start and end dates are required' }]}
          >
            <RangePicker 
              format="YYYY-MM-DD" 
              style={{ width: '100%', borderRadius: '12px' }}
              size="large"
            />
          </Form.Item>

          <Form.Item 
            name="isPinned" 
            valuePropName="checked"
            style={{ marginBottom: '0' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0' }}>
              <Switch />
              <Text style={{ color: '#1f2937' }}>📌 Pin this notice to top for all students</Text>
            </div>
          </Form.Item>

          {/* Action Buttons */}
          <Form.Item style={{ marginTop: '28px', marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <Button 
                onClick={() => { 
                  setModalVisible(false);
                  setEditingNotice(null); 
                  form.resetFields(); 
                }}
                size="large"
                style={{ borderRadius: '40px', minWidth: '100px' }}
              >
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                size="large"
                style={{ borderRadius: '40px', minWidth: '120px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none' }}
              >
                {editingNotice ? "✏️ Update Notice" : "✅ Create Notice"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      <style>{`
        .pinned-row {
          background-color: rgba(255, 215, 0, 0.06) !important;
        }
        .pinned-row:hover {
          background-color: rgba(255, 215, 0, 0.12) !important;
        }
        .ant-table-thead > tr > th {
          background-color: #f8f9fc !important;
          font-weight: 600 !important;
          font-size: 14px !important;
        }
        .ant-table-tbody > tr:hover > td {
          background-color: #f5f5f5 !important;
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;