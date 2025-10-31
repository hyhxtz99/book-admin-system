// Antd 按需导入配置
export const antdComponents = {
  // 布局组件
  Layout: () => import('antd/es/layout'),
  Menu: () => import('antd/es/menu'),
  Dropdown: () => import('antd/es/dropdown'),
  Space: () => import('antd/es/space'),
  
  // 表单组件
  Form: () => import('antd/es/form'),
  Input: () => import('antd/es/input'),
  Button: () => import('antd/es/button'),
  Select: () => import('antd/es/select'),
  DatePicker: () => import('antd/es/date-picker'),
  InputNumber: () => import('antd/es/input-number'),
  Radio: () => import('antd/es/radio'),
  
  // 数据展示组件
  Table: () => import('antd/es/table'),
  Tag: () => import('antd/es/tag'),
  Image: () => import('antd/es/image'),
  Tooltip: () => import('antd/es/tooltip'),
  Popover: () => import('antd/es/popover'),
  
  // 反馈组件
  Modal: () => import('antd/es/modal'),
  message: () => import('antd/es/message'),
  Spin: () => import('antd/es/spin'),
  
  // 其他组件
  ConfigProvider: () => import('antd/es/config-provider'),
};

export default antdComponents;
