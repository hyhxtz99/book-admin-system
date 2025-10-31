import React, { useState } from 'react';
import { Form, Input, InputNumber, Button, message, Modal } from 'antd';
import { BookType, UserType } from '@/types';
import SignaturePad from '../SignaturePad';
import styles from './index.module.css';

interface StockRecordFormProps {
  book: BookType;
  admin: UserType;
  onSuccess: () => void;
  onCancel: () => void;
}

const StockRecordForm: React.FC<StockRecordFormProps> = ({ book, admin, onSuccess, onCancel }) => {
  const [form] = Form.useForm();
  const [signatureVisible, setSignatureVisible] = useState(false);
  const [signatureData, setSignatureData] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    if (!signatureData) {
      message.warning('请进行手写签名');
      return;
    }

    setLoading(true);
    try {
      const stockRecordData = {
        book: {
          id: book._id,
          name: book.name,
          author: book.author,
        },
        admin: {
          id: admin._id,
          name: admin.name,
        },
        stockQuantity: values.stockQuantity,
        signatureImage: signatureData,
        remarks: values.remarks || '',
      };

      // 调用入库API
      const response = await fetch(`/api/books/${book._id}/stock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stockRecordData),
      });

      if (response.ok) {
        message.success('入库记录创建成功');
        onSuccess();
      } else {
        throw new Error('入库记录创建失败');
      }
    } catch (error) {
      message.error('入库记录创建失败');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignatureSave = (signature: string) => {
    setSignatureData(signature);
    setSignatureVisible(false);
  };

  return (
    <Modal
      title={`为《${book.name}》添加入库记录`}
      open={true}
      onCancel={onCancel}
      width={600}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className={styles.form}
      >
        <div className={styles.bookInfo}>
          <h4>图书信息</h4>
          <p><strong>书名：</strong>{book.name}</p>
          <p><strong>作者：</strong>{book.author}</p>
          <p><strong>当前库存：</strong>{book.stock}</p>
        </div>

        <Form.Item
          label="入库数量"
          name="stockQuantity"
          rules={[
            { required: true, message: '请输入入库数量' },
            { type: 'number', min: 1, message: '入库数量必须大于0' }
          ]}
        >
          <InputNumber
            min={1}
            style={{ width: '100%' }}
            placeholder="请输入入库数量"
          />
        </Form.Item>

        <Form.Item
          label="备注"
          name="remarks"
        >
          <Input.TextArea
            rows={3}
            placeholder="请输入备注信息（可选）"
          />
        </Form.Item>

        <Form.Item label="手写签名">
          <div className={styles.signatureSection}>
            {signatureData ? (
              <div className={styles.signaturePreview}>
                <img src={signatureData} alt="签名预览" className={styles.signatureImage} />
                <Button onClick={() => setSignatureVisible(true)}>
                  重新签名
                </Button>
              </div>
            ) : (
              <Button
                type="dashed"
                onClick={() => setSignatureVisible(true)}
                className={styles.signatureButton}
              >
                点击进行手写签名
              </Button>
            )}
          </div>
        </Form.Item>

        <Form.Item className={styles.buttonGroup}>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={!signatureData}
          >
            确认入库
          </Button>
        </Form.Item>
      </Form>

      <SignaturePad
        visible={signatureVisible}
        onSave={handleSignatureSave}
        onCancel={() => setSignatureVisible(false)}
      />
    </Modal>
  );
};

export default StockRecordForm;




