import React, { useEffect } from 'react';
import { Button, Card, Space, message } from 'antd';
import * as Sentry from '@sentry/nextjs';

const SentryTestPage: React.FC = () => {
  useEffect(() => {
    // 设置用户信息
    Sentry.setUser({
      id: 'test-user-123',
      username: 'test-user',
      email: 'test@example.com',
    });
    
    // 设置标签
    Sentry.setTag('page', 'sentry-test');
    Sentry.setTag('feature', 'error-testing');
    
    // 设置上下文
    Sentry.setContext('test-info', {
      testType: 'manual',
      timestamp: new Date().toISOString(),
    });
  }, []);

  const testError = () => {
    try {
      // 故意抛出一个错误来测试Sentry
      throw new Error('这是一个测试错误 - Sentry错误监控测试');
    } catch (error) {
      Sentry.captureException(error);
      message.error('已发送测试错误到Sentry');
    }
  };

  const testPerformance = () => {
    // 测试性能监控
    const startTime = Date.now();
    
    // 模拟一些工作
    setTimeout(() => {
      const duration = Date.now() - startTime;
      Sentry.addBreadcrumb({
        message: 'Performance Test',
        category: 'performance',
        data: {
          duration,
          testType: 'manual',
        },
        level: 'info',
      });
      message.success(`性能测试完成，耗时: ${duration}ms`);
    }, 1000);
  };

  const testUserAction = () => {
    Sentry.addBreadcrumb({
      message: 'User clicked test button',
      category: 'user',
      data: {
        action: 'button-click',
        buttonId: 'test-user-action',
        timestamp: new Date().toISOString(),
      },
      level: 'info',
    });
    message.info('用户操作已记录到Sentry');
  };

  const testApiCall = async () => {
    try {
      // 测试API调用监控
      const response = await fetch('/api/sentry-example-api');
      if (!response.ok) {
        throw new Error(`API调用失败: ${response.status}`);
      }
      message.success('API调用成功');
    } catch (error) {
      Sentry.captureException(error as Error);
      message.error('API调用失败，错误已发送到Sentry');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Card title="Sentry 测试页面" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <h3>功能测试</h3>
            <p>点击下面的按钮来测试Sentry的各种功能：</p>
          </div>
          
          <Space wrap>
            <Button type="primary" danger onClick={testError}>
              测试错误监控
            </Button>
            
            <Button type="primary" onClick={testPerformance}>
              测试性能监控
            </Button>
            
            <Button onClick={testUserAction}>
              测试用户操作记录
            </Button>
            
            <Button onClick={testApiCall}>
              测试API调用监控
            </Button>
          </Space>
          
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '6px' }}>
            <h4>说明：</h4>
            <ul>
              <li><strong>错误监控</strong>：会故意抛出一个错误并发送到Sentry</li>
              <li><strong>性能监控</strong>：会记录性能数据到Sentry</li>
              <li><strong>用户操作</strong>：会记录用户行为到Sentry</li>
              <li><strong>API调用</strong>：会测试API错误监控</li>
            </ul>
            <p style={{ marginTop: '10px', color: '#666' }}>
              请访问 <a href="https://sentry.io" target="_blank" rel="noopener noreferrer">Sentry控制台</a> 查看监控数据
            </p>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default SentryTestPage;
