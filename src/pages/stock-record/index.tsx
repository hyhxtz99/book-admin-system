import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, Form, Image, Input, Modal, Row, Space, Table, TablePaginationConfig, Tag, message } from 'antd';
import { useCurrentUser } from '@/utils/hoos';
import { USER_ROLE } from '@/constants';
import dynamic from 'next/dynamic';
import styles from './index.module.css';

// 动态导入组件
const AuthHoc = dynamic(() => import('@/components/AuthHoc'), {
  ssr: false,
  loading: () => <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
});

const Content = dynamic(() => import('@/components/Content'), {
  ssr: false,
  loading: () => <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '200px' 
  }}>Loading content...</div>
});

interface StockRecordType {
  id: number;
  book: {
    id: number;
    name: string;
    author: string;
  };
  admin: {
    id: number;
    name: string;
  };
  stockQuantity: number;
  signatureImage: string;
  remarks: string;
  createdAt: string;
}

const COLUMNS = [
  {
    title: "图书名称",
    dataIndex: ["book", "name"],
    key: "bookName",
  },
  {
    title: "作者",
    dataIndex: ["book", "author"],
    key: "author",
  },
  {
    title: "入库数量",
    dataIndex: "stockQuantity",
    key: "stockQuantity",
    render: (quantity: number) => (
      <Tag color="green">+{quantity}</Tag>
    ),
  },
  {
    title: "操作管理员",
    dataIndex: ["admin", "name"],
    key: "adminName",
  },
  {
    title: "手写签名",
    dataIndex: "signatureImage",
    key: "signature",
    render: (signature: string) => (
      signature ? (
        <Image
          width={60}
          height={30}
          src={signature}
          alt="签名"
          style={{ objectFit: 'contain', border: '1px solid #d9d9d9' }}
        />
      ) : (
        <span style={{ color: '#999' }}>无签名</span>
      )
    ),
  },
  {
    title: "备注",
    dataIndex: "remarks",
    key: "remarks",
    ellipsis: true,
  },
  {
    title: "入库时间",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (date: string) => new Date(date).toLocaleString(),
  },
];

export default function StockRecord() {
  const [form] = Form.useForm();
  const user = useCurrentUser();
  const [list, setList] = useState<StockRecordType[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
    showSizeChanger: true,
  });

  const fetchData = useCallback(
    (search?: { bookName?: string; adminName?: string }) => {
      const { bookName, adminName } = search || {};
      setLoading(true);
      
      const params = new URLSearchParams({
        current: pagination.current?.toString() || '1',
        pageSize: pagination.pageSize?.toString() || '20',
        ...(bookName && { bookName }),
        ...(adminName && { adminName }),
      });

      fetch(`/api/stock-records?${params}`)
        .then(res => res.json())
        .then(res => {
          setList(res.data || []);
          setTotal(res.total || 0);
        })
        .catch(err => {
          console.error('Error fetching stock records:', err);
          message.error('获取入库记录失败');
        })
        .finally(() => setLoading(false));
    },
    [pagination]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData, pagination]);

  const handleSearch = (values: any) => {
    setPagination({ ...pagination, current: 1 });
    fetchData(values);
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条入库记录吗？删除后库存将相应减少。',
      onOk: async () => {
        try {
          const response = await fetch(`/api/stock-records/${id}`, {
            method: 'DELETE',
          });
          
          if (response.ok) {
            message.success('删除成功');
            fetchData();
          } else {
            throw new Error('删除失败');
          }
        } catch (error) {
          message.error('删除失败');
          console.error('Error:', error);
        }
      },
    });
  };

  const columns = [
    ...COLUMNS,
    ...(user?.role === USER_ROLE.ADMIN ? [{
      title: "操作",
      dataIndex: "",
      key: "action",
      render: (_: any, row: StockRecordType) => (
        <Space>
          <Button
            type="link"
            danger
            onClick={() => handleDelete(row.id)}
          >
            删除
          </Button>
        </Space>
      ),
    }] : []),
  ];

  return (
    <AuthHoc>
      <Content title="入库记录管理">
        <div className={styles.container}>
          <Form
            form={form}
            layout="inline"
            onFinish={handleSearch}
            className={styles.searchForm}
          >
            <Form.Item name="bookName">
              <Input placeholder="图书名称" />
            </Form.Item>
            <Form.Item name="adminName">
              <Input placeholder="管理员名称" />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  搜索
                </Button>
                <Button onClick={() => {
                  form.resetFields();
                  fetchData();
                }}>
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Form>

          <Table
            columns={columns}
            dataSource={list}
            rowKey="id"
            loading={loading}
            pagination={{
              ...pagination,
              total,
              showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`,
            }}
            onChange={handleTableChange}
            scroll={{ x: 1200 }}
          />
        </div>
      </Content>
    </AuthHoc>
  );
}
