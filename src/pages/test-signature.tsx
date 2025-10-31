import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import SignaturePad from '@/components/SignaturePad';

export default function TestSignature() {
  const [visible, setVisible] = useState(false);
  const [signature, setSignature] = useState<string>('');

  const handleSave = (signatureData: string) => {
    setSignature(signatureData);
    console.log('Signature saved:', signatureData);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>手写签名测试页面</h1>
      
      <Button type="primary" onClick={() => setVisible(true)}>
        打开签名板
      </Button>
      
      {signature && (
        <div style={{ marginTop: '20px' }}>
          <h3>签名预览：</h3>
          <img src={signature} alt="签名" style={{ border: '1px solid #ccc', maxWidth: '300px' }} />
        </div>
      )}

      <SignaturePad
        visible={visible}
        onSave={handleSave}
        onCancel={() => setVisible(false)}
      />
    </div>
  );
}




