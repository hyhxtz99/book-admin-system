import { getCategoryList } from "@/api";
import { bookAdd, bookUpdate } from "@/api/book";
import { BookFormType, BookType, CategoryType, UserType } from "@/types";
import { useCurrentUser } from "@/utils/hoos";
import {
  Button,
  DatePicker,
  Form,
  Image,
  Input,
  InputNumber,
  Select,
  message,
  Modal,
} from "antd";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";

import Content from "../Content";
import styles from "./index.module.css";

// 动态导入签名组件
const SignaturePad = dynamic(() => import("../SignaturePad"), {
  ssr: false,
  loading: () => <div>Loading signature pad...</div>
});

const Option = Select.Option;
const { TextArea } = Input;

const BookForm: React.FC<BookFormType> = ({ title, editData }) => {
  const router = useRouter();
  const user = useCurrentUser();
  const [form] = Form.useForm();
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
  const [preview, setPreview] = useState();
  const [cover, setCover] = useState<string>();
  const [signatureVisible, setSignatureVisible] = useState(false);
  const [signatureData, setSignatureData] = useState<string>('');
  const [showSignatureModal, setShowSignatureModal] = useState(false);

  useEffect(() => {
    getCategoryList({
      all: true,
    }).then((res) => {
      setCategoryList(res.data);
    });
  }, []);

  useEffect(() => {
    if (editData) {
      const data = {
        ...editData,
        category: editData.category
          ? (editData.category as unknown as CategoryType)._id
          : undefined,
        publishAt: editData.publishAt ? dayjs(editData.publishAt) : undefined,
      };
      setCover(editData.cover);
      form.setFieldsValue(data);
    }
  }, [editData, form]);

  const handleFinish = async (values: BookType) => {
    console.log(
      "%c [ values ]-53",
      "font-size:13px; background:pink; color:#bf2c9f;",
      values
    );
    
    // 如果是新增图书且用户是管理员，需要手写签名
    if (!editData?._id && user?.role === 'admin') {
      if (!signatureData) {
        message.warning('请进行手写签名验证');
        setShowSignatureModal(true);
        return;
      }
    }
    
    // 编辑
    if (values.publishAt) {
      values.publishAt = dayjs(values.publishAt).valueOf();
    }
    if (editData?._id) {
      console.log("Current ID:", editData?._id)
      await bookUpdate(editData._id, values);
      message.success("编辑成功");
    } else {
      await bookAdd(values);
      message.success("创建成功");
      
      // 如果是新增图书且有签名，创建入库记录
      if (signatureData && user) {
        try {
          const stockRecordData = {
            book: {
              id: values._id || Date.now(), // 使用临时ID或时间戳
              name: values.name,
              author: values.author,
            },
            admin: {
              id: user._id,
              name: user.name,
            },
            stockQuantity: values.stock || 0,
            signatureImage: signatureData,
            remarks: '图书添加时的手写签名验证',
          };
          
          // 这里可以调用入库记录API
          console.log('入库记录数据:', stockRecordData);
          message.success('已记录手写签名验证');
        } catch (error) {
          console.error('创建入库记录失败:', error);
        }
      }
    }
    router.push("/book");
  };

  const handlePreview = () => {
    setPreview(form.getFieldValue("cover"));
  };

  const handleSignatureSave = (signature: string) => {
    setSignatureData(signature);
    setSignatureVisible(false);
    setShowSignatureModal(false);
    message.success('签名保存成功');
  };

  const handleSignatureCancel = () => {
    setSignatureVisible(false);
    setShowSignatureModal(false);
  };

  const openSignatureModal = () => {
    setSignatureVisible(true);
    setShowSignatureModal(true);
  };

  {
    categoryList?.map((category) => (
      <Option value={category._id} key={category._id}>
        {category.name}
      </Option>
    ));
  }

  return (
    <>
      <Content title={title}>
        <Form
          name="book"
          form={form}
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 18 }}
          className={styles.form}
          initialValues={editData ? editData : {}}
          onFinish={handleFinish}
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
            label="作者"
            name="author"
            rules={[
              {
                required: true,
                message: "请输入作者",
              },
            ]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item
            label="分类"
            name="category"
            rules={[
              {
                required: true,
                message: "请选择图书分类",
              },
            ]}
          >
            <Select>
              {categoryList?.map((category) => (
                <Option value={category._id} key={category._id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="封面" name="cover">
            <Input.Group compact>
              <Input
                style={{ width: "calc(100% - 65px)" }}
                value={cover}
                onChange={(e) => {
                  setCover(e.target.value);
                  form.setFieldValue("cover", e.target.value);
                }}
              />
              <Button type="primary" onClick={handlePreview}>
                预览
              </Button>
            </Input.Group>
          </Form.Item>
          {preview && (
            <Form.Item label=" " colon={false}>
              <Image width={200} height={200} alt="封面" src={preview} />
            </Form.Item>
          )}
          <Form.Item
            label="出版日期"
            name="publishAt"
            className={styles.publishAt}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item label="库存" name="stock">
            <InputNumber />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <TextArea className={styles.textarea} />
          </Form.Item>
          
          {/* 手写签名部分 - 仅对管理员显示 */}
          {user?.role === 'admin' && !editData?._id && (
            <Form.Item label="手写签名验证">
              <div style={{ border: '1px dashed #d9d9d9', padding: '16px', borderRadius: '6px', textAlign: 'center' }}>
                {signatureData ? (
                  <div>
                    <img 
                      src={signatureData} 
                      alt="签名预览" 
                      style={{ maxWidth: '200px', maxHeight: '100px', border: '1px solid #d9d9d9', borderRadius: '4px' }} 
                    />
                    <div style={{ marginTop: '8px' }}>
                      <Button onClick={openSignatureModal} style={{ marginRight: '8px' }}>
                        重新签名
                      </Button>
                      <Button onClick={() => setSignatureData('')}>
                        清除签名
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button 
                    type="dashed" 
                    onClick={openSignatureModal}
                    style={{ width: '100%', height: '60px' }}
                  >
                    点击进行手写签名验证
                  </Button>
                )}
              </div>
            </Form.Item>
          )}
          
          <Form.Item label=" " colon={false}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className={styles.btn}
            >
              {editData?._id ? "更新" : "创建"}
            </Button>
          </Form.Item>
        </Form>
      </Content>
      
      {/* 手写签名模态框 */}
      {showSignatureModal && (
        <SignaturePad
          visible={signatureVisible}
          onSave={handleSignatureSave}
          onCancel={handleSignatureCancel}
        />
      )}
    </>
  );
};

export default BookForm;
