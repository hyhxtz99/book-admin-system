import { categoryAdd, categoryDelete, categoryUpdate } from "@/api/category";
import { DynamicIcons } from "@/components/DynamicIcons";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  TablePaginationConfig,
  Tag,
  message,
} from "antd";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import qs from "qs";
import { useCallback, useEffect, useState } from "react";
import { useDebounceCallback, useModal } from "@/utils/hoos";

import { CategoryQueryType, CategoryType } from "../../types";
import request from "../../utils/request";
import styles from "./index.module.css";

// 动态导入组件
const Content = dynamic(() => import("@/components/Content"), {
  ssr: false,
  loading: () => <div>Loading content...</div>
});

const Option = Select.Option;

const LEVEL = {
  ONE: 1,
  TWO: 2,
};

const LEVEL_OPTION = [
  { label: "级别1", value: LEVEL.ONE },
  { label: "级别2", value: LEVEL.TWO },
];

const COLUMNS = [
  {
    title: "名称",
    dataIndex: "name",
    key: "name",
    ellipsis: true,
    width: 300,
  },
  {
    title: "级别",
    dataIndex: "level",
    key: "level",
    ellipsis: true,
    width: 200,
    render: (text: number) => (
      <Tag color={text === 1 ? "green" : "cyan"}>{`级别${text}`}</Tag>
    ),
  },
  {
    title: "所属分类",
    dataIndex: "parent",
    key: "parent",
    ellipsis: true,
    width: 200,
    render: (text: { name: string }) => {
      return text?.name ?? "-";
    },
  },
  {
    title: "创建时间",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 200,
    render: (text: string) => dayjs(text).format("YYYY-MM-DD"),
  },
];

export default function Book(props: any) {
  const [form] = Form.useForm();
  const [isModalOpen, setModalOpen] = useState(false);
  const [list, setList] = useState<CategoryType[]>([]);
  const [total, setTotal] = useState(0);
  const [formLevel, setFormLevel] = useState<number>();
  const [levelOneList, setLevelOneList] = useState<CategoryType[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
    showSizeChanger: true,
  });
  const [editData, setEditData] = useState<Partial<CategoryType>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const columns = [
    ...COLUMNS,
    {
      title: "操作",
      dataIndex: "",
      key: "action",
      render: (_: any, row: CategoryType) => (
        <Space>
          <Button
            type="link"
            block
            onClick={() => {
              fetchLevelOneData();
              setModalOpen(true);
              setEditData(row);
            }}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            block
            onClick={() => {
              handleDeleteModal(row._id as string);
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const fetchData = useCallback(
    (search?: CategoryQueryType) => {
      const { name, level } = search || {};

      request
        .get(
          `/api/categories?${qs.stringify({
            current: pagination.current,
            pageSize: pagination.pageSize,
            name,
            level,
          })}`
        )
        .then((res) => {
          setList(res.data);
          setTotal(res.total);
        });
    },
    [pagination]
  );

  // 获取所有level=1的分类
  const fetchLevelOneData = useCallback(() => {
    request
      .get(
        `/api/categories?${qs.stringify({
          level: 1,
          all: true,
        })}`
      )
      .then((res) => {
        setLevelOneList(res.data);
      });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, fetchLevelOneData, pagination]);

  // 使用防抖hook处理表单提交
  const handleEditCategoryFinish = useDebounceCallback(async (values: CategoryType) => {
    // 编辑
    if (editData._id) {
      await categoryUpdate(editData._id, values);
      message.success("编辑成功");
    } else {
      await categoryAdd(values);
      message.success("创建成功");
    }
    fetchData();
    handleCancel();
  }, 500);

  // 使用防抖hook处理确认按钮
  const handleOk = useDebounceCallback(async () => {
    form.submit();
  }, 300);

  const handleCancel = () => {
    setEditData({});
    setModalOpen(false);
  };

  // 使用模态框hook管理删除确认
  const deleteModal = useModal();

  const handleDeleteModal = useDebounceCallback((id: string) => {
    deleteModal.show();
    setDeleteId(id);
  }, 300);

  const handleDeleteConfirm = useDebounceCallback(async () => {
    if (!deleteId) return;
    
    try {
      await categoryDelete(deleteId);
      message.success("删除成功");
      fetchData(form.getFieldsValue());
      deleteModal.hide();
      setDeleteId(null);
    } catch (error) {
      console.error(error);
      deleteModal.hide();
    }
  }, 500);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination);
  };

  const handleSearchFinish = (values: CategoryQueryType) => {
    fetchData(values);
  };

  const handleCategoryAdd = () => {
    fetchLevelOneData();
    setModalOpen(true);
    setTimeout(() => {
      form.resetFields();
    });
  };

  const handleFormLevelChange = (value: number) => {
    setFormLevel(value);
  };

  return (
    <>
      <Content
        title="分类列表"
        operation={
          <Button type="primary" onClick={handleCategoryAdd}>
            添加
          </Button>
        }
      >
        <Form
          form={form}
          name="search"
          className={styles.form}
          onFinish={handleSearchFinish}
        >
          <Row gutter={24}>
            <Col span={5}>
              <Form.Item name="name" label="名称">
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="level" label="级别">
                <Select
                  allowClear
                  placeholder="请选择"
                  options={LEVEL_OPTION}
                ></Select>
              </Form.Item>
            </Col>
            <Col span={9} style={{ textAlign: "left" }}>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
              <Button
                style={{ margin: "0 8px" }}
                onClick={() => {
                  form.resetFields();
                }}
              >
                清空
              </Button>
            </Col>
          </Row>
        </Form>
        <div className={styles.tableWrap}>
          <Table
            rowKey="_id"
            dataSource={list}
            columns={columns}
            onChange={handleTableChange}
            pagination={{
              ...pagination,
              total: total,
              showTotal: () => `共 ${total} 条`,
            }}
          />
        </div>
        {isModalOpen && (
          <Modal
            title={editData._id ? "编辑分类" : "创建分类"}
            open={isModalOpen}
            onOk={handleOk}
            okText="确认"
            cancelText="取消"
            onCancel={handleCancel}
          >
            <Form
              name="category"
              form={form}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              style={{ maxWidth: 600 }}
              initialValues={editData ? editData : {}}
              onFinish={handleEditCategoryFinish}
              autoComplete="off"
            >
              <Form.Item
                label="名称"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "请输入名称",
                  },
                ]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
              <Form.Item
                label="级别"
                name="level"
                rules={[
                  {
                    required: true,
                    message: "请选择级别",
                  },
                ]}
              >
                <Select
                  placeholder="请选择"
                  options={LEVEL_OPTION}
                  onChange={handleFormLevelChange}
                />
              </Form.Item>
              {formLevel === LEVEL.TWO && (
                <Form.Item
                  label="所属分类"
                  name="parent"
                  rules={[
                    {
                      required: true,
                      message: "请选择图书分类",
                    },
                  ]}
                >
                  <Select placeholder="请选择">
                    {levelOneList.map((item) => (
                      <Option key={item._id} value={item._id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
            </Form>
          </Modal>
        )}

        {/* 删除确认模态框 */}
        <Modal
          title="确认删除"
          open={deleteModal.visible}
          onOk={handleDeleteConfirm}
          onCancel={deleteModal.hide}
          confirmLoading={deleteModal.loading}
          okText="确定"
          cancelText="取消"
        >
          <p>确定要删除这个分类吗？此操作不可撤销。</p>
        </Modal>
      </Content>
    </>
  );
}

// 分类页使用 SSG，定期再验证
export async function getStaticProps() {
  return {
    props: {},
    revalidate: 60, // 60秒再验证
  };
}
