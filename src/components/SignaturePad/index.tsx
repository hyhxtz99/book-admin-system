import React, { useRef, useEffect, useState } from 'react';
import { Button, Modal, message } from 'antd';
import styles from './index.module.css';

interface SignaturePadProps {
  onSave: (signatureData: string) => void;
  visible: boolean;
  onCancel: () => void;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ onSave, visible, onCancel }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    if (visible && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [visible]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasSignature(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasSignature(false);
      }
    }
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (canvas && hasSignature) {
      const signatureData = canvas.toDataURL('image/png');
      onSave(signatureData);
      message.success('签名保存成功');
    } else {
      message.warning('请先进行签名');
    }
  };

  const handleCancel = () => {
    clearSignature();
    onCancel();
  };

  return (
    <Modal
      title="手写签名"
      open={visible}
      onCancel={handleCancel}
      width={600}
      footer={[
        <Button key="clear" onClick={clearSignature}>
          清除
        </Button>,
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button key="save" type="primary" onClick={saveSignature}>
          保存签名
        </Button>,
      ]}
    >
      <div className={styles.signatureContainer}>
        <div className={styles.instructions}>
          <p>请在下方画布中进行手写签名：</p>
        </div>
        <canvas
          ref={canvasRef}
          width={500}
          height={200}
          className={styles.canvas}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
    </Modal>
  );
};

export default SignaturePad;



