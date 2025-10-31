import { bookDelete, getBookList, getCategoryList } from "@/api";
import { USER_ROLE } from "@/constants";
import { BookQueryType, BookType, CategoryType } from "@/types";
import { useCurrentUser } from "@/utils/hoos";
import { DynamicIcons } from "@/components/DynamicIcons";
import ExcelTable from "@/components/ExcelTable";
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  Modal,
  Popover,
  Row,
  Select,
  Space,
  Table,
  TablePaginationConfig,
  Tag,
  Tooltip,
  Upload,
  message,
} from "antd";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { exportToExcel, importFromExcel } from "@/utils/excel";

import styles from "./index.module.css";

// 动态导入组件
const AuthHoc = dynamic(() => import("@/components/AuthHoc"), {
  ssr: false,
  loading: () => <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
});

const Content = dynamic(() => import("@/components/Content"), {
  ssr: false,
  loading: () => <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '200px' 
  }}>Loading content...</div>
});

const Option = Select.Option;

const COLUMNS = [
  {
    title: "名称",
    dataIndex: "name",
    key: "name",
    ellipsis: true,
    width: 150,
  },
  {
    title: "封面",
    dataIndex: "cover",
    key: "cover",
    ellipsis: true,
    width: 100,
    render: (text: string) => (
      <Image
        alt=""
        width={50}
        height={50}
        src={
           `https://th.bing.com/th/id/OIP.BJLU5O5fk8kQix3yf-uZIAHaFl?w=1536&h=1157&rs=1&pid=ImgDetMain`
        }
      />
    ),
  },
  {
    title: "作者",
    dataIndex: "author",
    key: "author",
    ellipsis: true,
    width: 80,
  },
  {
    title: "分类",
    dataIndex: "category",
    key: "category",
    ellipsis: true,
    width: 80,
    render: (text: CategoryType) =>
      text ? <Tag color="blue">{text.name}</Tag> : "-",
  },
  {
    title: "描述",
    dataIndex: "description",
    key: "description",
    ellipsis: true,
    render: (text: string) => (
      <Tooltip placement="topLeft" title={text}>
        {text}
      </Tooltip>
    ),
  },
  {
    title: "库存",
    dataIndex: "stock",
    width: 80,
    key: "stock",
  },
  {
    title: "创建时间",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 100,
    render: (text: string) => dayjs(text).format("YYYY-MM-DD"),
  },
];


export default function Book(props: any) {
  const [form] = Form.useForm();
  const user = useCurrentUser();
  const [list, setList] = useState<BookType[]>([]);
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
    showSizeChanger: true,
  });
  const router = useRouter();

  const columns =
    user?.role === USER_ROLE.ADMIN
      ? [
        ...COLUMNS,
        {
          title: "操作",
          dataIndex: "",
          key: "action",
          render: (_: any, row: BookType) => (
            <Space>
              <Button
                type="link"
                block
                onClick={() => {
                  router.push(`/book/edit/${row._id}`);
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
      ]
      : COLUMNS;

  const fetchData = useCallback(
    (search?: BookQueryType) => {
      const { name, category, author } = search || {};
      setLoading(true);
      getBookList({
        current: pagination.current as number,
        pageSize: pagination.pageSize as number,
        name,
        category,
        author,
      }).then((res) => {
        setList(res.data);
        setTotal(res.total);
      }).finally(() => setLoading(false));
    },
    [pagination]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData, pagination]);

  useEffect(() => {
    (async function () {
      getCategoryList({ all: true }).then((res) => {
        setCategoryList(res.data);
      });
    })();
  }, []);

  const handleBookAdd = () => {
    router.push("/book/add");
  };

  const handleDeleteModal = (id: string) => {
    Modal.confirm({
      title: "确认删除？",
      icon: <DynamicIcons.ExclamationCircleFilled />,
      okText: "确定",
      cancelText: "取消",
      async onOk() {
        try {
          await bookDelete(id);
          message.success("删除成功");
          fetchData(form.getFieldsValue());
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination);
  };

  const handleSearchFinish = (values: BookQueryType) => {
    fetchData(values);
  };

  const handleExport = async () => {
    const rows = list.map((item) => ({
      名称: item.name,
      作者: item.author,
      分类: typeof (item as any).category === 'string' ? (item as any).category : ((item as any).category?.name),
      描述: item.description,
      库存: item.stock,
      创建时间: item.createdAt,
    }));
    await exportToExcel(rows, { filename: `图书列表_${dayjs().format("YYYYMMDD_HHmmss")}`, sheetName: "图书" });
    message.success("导出成功");
  };

  const beforeUpload = async (file: File) => {
    try {
      const rows = await importFromExcel(file);
      const mapped = (rows || []).map((r: any) => ({
        name: r["名称"] || r["name"],
        author: r["作者"] || r["author"],
        category: r["分类"] ? { name: r["分类"] } : undefined,
        description: r["描述"] || r["description"],
        stock: Number(r["库存"] ?? r["stock"] ?? 0),
        createdAt: r["创建时间"] || r["createdAt"],
        _id: String(Math.random()).slice(2),
      })) as any as BookType[];
      setList(mapped);
      setTotal(mapped.length);
      message.success("导入成功（仅本地预览，未提交服务器）");
    } catch (e) {
      message.error("导入失败，请检查文件格式");
    }
    return false;
  };

  return (
    <Content
      title="图书列表"
      operation={
        <Space>
          <Upload beforeUpload={beforeUpload} showUploadList={false} accept=".xlsx,.xls">
            <Button>导入Excel</Button>
          </Upload>
          <Button onClick={handleExport}>导出Excel</Button>
          <AuthHoc>
            <Button type="primary" onClick={handleBookAdd}>
              添加
            </Button>
          </AuthHoc>
        </Space>
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
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="author" label="作者">
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="category" label="分类">
              <Select placeholder="请选择" allowClear>
                {categoryList?.map((category) => (
                  <Option key={category._id} value={category._id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
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
          size="large"
          rowKey="_id"
          dataSource={list}
          columns={columns}
          loading={loading}
          onChange={handleTableChange}
          pagination={{
            ...pagination,
            total: total,
            showTotal: () => `共 ${total} 条`,
          }}
        />
      </div>
    </Content>
  );
}

// 在列表页启用 SSR，提升首屏渲染（仅作为示例，可根据需要调整）
export async function getServerSideProps() {
  // 这里只做最小示例：服务端不直接请求数据，保持现有客户端逻辑
  // 如果你的 API 可在服务端访问，建议在这里预取初始数据并通过 props 传入
  return { props: {} };
}
