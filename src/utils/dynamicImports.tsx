import dynamic from "next/dynamic";
import React from "react";

// 统一的加载组件
const LoadingComponent = ({ tip = "Loading..." }: { tip?: string }) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '200px',
    width: '100%'
  }}>
    <div>{tip}</div>
  </div>
);

// 动态导入配置
export const dynamicImports = {
  // 布局组件
  Layout: dynamic(() => import("@/components/Layout"), {
    ssr: false,
    loading: () => <LoadingComponent tip="Loading layout..." />
  }),

  // 内容组件
  Content: dynamic(() => import("@/components/Content"), {
    ssr: false,
    loading: () => <LoadingComponent tip="Loading content..." />
  }),

  // 权限组件
  AuthHoc: dynamic(() => import("@/components/AuthHoc"), {
    ssr: false,
    loading: () => <LoadingComponent tip="Loading..." />
  }),

  // 表单组件
  BookForm: dynamic(() => import("@/components/BookForm"), {
    ssr: false,
    loading: () => <LoadingComponent tip="Loading form..." />
  }),

  UserForm: dynamic(() => import("@/components/UserForm"), {
    ssr: false,
    loading: () => <LoadingComponent tip="Loading form..." />
  }),

  BorrowForm: dynamic(() => import("@/components/BorrowForm"), {
    ssr: false,
    loading: () => <LoadingComponent tip="Loading form..." />
  }),

  // 功能组件
  SentryExample: dynamic(() => import("@/components/SentryExample"), {
    ssr: false,
    loading: () => <LoadingComponent tip="Loading Sentry example..." />
  }),

  // 工具组件
  ErrorBoundary: dynamic(() => import("@/components/ErrorBoundary"), {
    ssr: false,
    loading: () => <LoadingComponent tip="Loading error boundary..." />
  }),

  LoadingSpinner: dynamic(() => import("@/components/LoadingSpinner"), {
    ssr: false,
    loading: () => <LoadingComponent tip="Loading spinner..." />
  }),
};

// 页面级动态导入
export const pageImports = {
  // 图书页面
  BookList: dynamic(() => import("@/pages/book"), {
    ssr: false,
    loading: () => <LoadingComponent tip="Loading book list..." />
  }),

  // 用户页面
  UserList: dynamic(() => import("@/pages/user"), {
    ssr: false,
    loading: () => <LoadingComponent tip="Loading user list..." />
  }),

  // 借阅页面
  BorrowList: dynamic(() => import("@/pages/borrow"), {
    ssr: false,
    loading: () => <LoadingComponent tip="Loading borrow list..." />
  }),

  // 分类页面
  CategoryList: dynamic(() => import("@/pages/category"), {
    ssr: false,
    loading: () => <LoadingComponent tip="Loading category list..." />
  }),
};

export default dynamicImports;
