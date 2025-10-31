import dynamic from "next/dynamic";
import React from "react";

// 动态导入图标组件
export const DynamicIcons = {
  // 布局图标
  ProfileOutlined: dynamic(() => import("@ant-design/icons").then(mod => ({ default: mod.ProfileOutlined })), {
    ssr: false,
    loading: () => <span style={{ width: '16px', height: '16px', display: 'inline-block' }} />
  }),
  
  SnippetsOutlined: dynamic(() => import("@ant-design/icons").then(mod => ({ default: mod.SnippetsOutlined })), {
    ssr: false,
    loading: () => <span style={{ width: '16px', height: '16px', display: 'inline-block' }} />
  }),
  
  SolutionOutlined: dynamic(() => import("@ant-design/icons").then(mod => ({ default: mod.SolutionOutlined })), {
    ssr: false,
    loading: () => <span style={{ width: '16px', height: '16px', display: 'inline-block' }} />
  }),
  
  UserOutlined: dynamic(() => import("@ant-design/icons").then(mod => ({ default: mod.UserOutlined })), {
    ssr: false,
    loading: () => <span style={{ width: '16px', height: '16px', display: 'inline-block' }} />
  }),
  
  DownOutlined: dynamic(() => import("@ant-design/icons").then(mod => ({ default: mod.DownOutlined })), {
    ssr: false,
    loading: () => <span style={{ width: '16px', height: '16px', display: 'inline-block' }} />
  }),

  // 功能图标
  ExclamationCircleFilled: dynamic(() => import("@ant-design/icons").then(mod => ({ default: mod.ExclamationCircleFilled })), {
    ssr: false,
    loading: () => <span style={{ width: '16px', height: '16px', display: 'inline-block' }} />
  }),
};

export default DynamicIcons;
