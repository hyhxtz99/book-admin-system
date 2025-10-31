import React, { useEffect } from 'react';
import { SentryPerformance, usePerformanceMonitoring } from '@/utils/sentry';
import { Button, Card, Space } from 'antd';

/**
 * Sentry性能监控示例组件
 * 展示如何在组件中使用Sentry进行性能监控
 */
const SentryExample: React.FC = () => {
  // 使用性能监控Hook
  const monitor = usePerformanceMonitoring('SentryExample-component');

  useEffect(() => {
    // 组件挂载完成
    monitor.finish({ componentName: 'SentryExample' });
  }, [monitor]);

  // 模拟API请求
  const handleApiRequest = async () => {
    const startTime = Date.now();
    
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 记录成功的API请求
      SentryPerformance.recordApiRequest(
        '/api/example',
        'GET',
        Date.now() - startTime,
        200
      );
      
      console.log('API请求成功');
    } catch (error) {
      // 记录API请求错误
      SentryPerformance.recordError(error as Error, {
        type: 'api-request',
        url: '/api/example',
        method: 'GET',
        duration: Date.now() - startTime,
      });
    }
  };

  // 模拟用户操作
  const handleUserAction = () => {
    SentryPerformance.recordUserAction('button-click', {
      buttonId: 'example-button',
      timestamp: Date.now(),
    });
    
    console.log('用户操作已记录');
  };

  // 模拟页面加载
  const handlePageLoad = () => {
    SentryPerformance.recordPageLoad('example-page', 1200);
    console.log('页面加载性能已记录');
  };

  // 设置用户信息
  const handleSetUser = () => {
    SentryPerformance.setUser({
      id: '123',
      username: 'test-user',
      email: 'test@example.com',
    });
    
    // 设置标签
    SentryPerformance.setTag('feature', 'sentry-example');
    
    // 设置上下文
    SentryPerformance.setContext('user-preferences', {
      theme: 'dark',
      language: 'zh-CN',
    });
    
    console.log('用户信息已设置');
  };

  return (
    <Card title="Sentry性能监控示例" style={{ margin: '20px' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button type="primary" onClick={handleApiRequest}>
          模拟API请求
        </Button>
        
        <Button onClick={handleUserAction}>
          记录用户操作
        </Button>
        
        <Button onClick={handlePageLoad}>
          记录页面加载性能
        </Button>
        
        <Button onClick={handleSetUser}>
          设置用户信息
        </Button>
        
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f5f5f5' }}>
          <h4>说明：</h4>
          <ul>
            <li>点击按钮会触发相应的Sentry监控事件</li>
            <li>可以在Sentry控制台中查看这些事件</li>
            <li>所有操作都会记录到Sentry的性能监控中</li>
          </ul>
        </div>
      </Space>
    </Card>
  );
};

export default SentryExample;
