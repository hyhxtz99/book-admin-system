import React from 'react';

export default function Test() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>测试页面</h1>
      <p>如果你能看到这个页面，说明服务器运行正常！</p>
      <p>时间: {new Date().toLocaleString()}</p>
    </div>
  );
}




