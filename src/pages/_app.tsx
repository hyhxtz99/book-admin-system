import "@/styles/globals.css";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState, Suspense } from "react";
// import * as Sentry from "@sentry/nextjs";
import { registerServiceWorker } from "@/utils/registerSW";
import { ConfigProvider } from "antd";
import "antd/dist/reset.css";
import locale from "antd/locale/zh_CN";
import "dayjs/locale/zh-cn";

// SSR 渲染时也需要包含布局，使用常规导入
import Layout from "@/components/Layout";

const Spin = dynamic(() => import("antd/es/spin"), {
  ssr: false,
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const [load, setLoad] = useState(false);

  useEffect(() => {
    setLoad(true);
    
    // 注册 Service Worker
    registerServiceWorker();
    
    // 设置Sentry用户上下文 - 已注释
    // Sentry.setUser({
    //   id: 'anonymous',
    //   username: 'anonymous',
    // });
    
    // 设置Sentry标签 - 已注释
    // Sentry.setTag('app', 'book-admin-react');
    // Sentry.setTag('version', process.env.NEXT_PUBLIC_SENTRY_RELEASE || '1.0.0');
  }, []);

  return (
    <>
      {load ? (
        <Suspense fallback={<Spin className="loading" tip="Loading..." size="large" />}>
          <ConfigProvider locale={locale}>
            {router.pathname === "/login" ? (
              <Component {...pageProps} />
            ) : (
              <Layout>
                <Component {...pageProps} />
              </Layout>
            )}
          </ConfigProvider>
        </Suspense>
      ) : (
        <Spin className="loading" tip="Loading..." size="large" />
      )}
    </>
  );
}
