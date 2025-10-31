import { UserLoginType } from "@/types";
import request from "@/utils/request";
import { checkServerLoad, ServerLoadInfo, getLoadStatusDescription } from "@/utils/serverLoadMonitor";
import { Button, Form, Input, message } from "antd";
import classnames from "classnames";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import styles from "./index.module.css";

// 定义页面props类型
interface LoginPageProps {
  useCSR?: boolean;
  serverInfo?: {
    timestamp: number;
    userAgent?: string;
    ip?: string;
  };
  serverLoad?: ServerLoadInfo;
  error?: string;
  timestamp?: number;
}

export default function Login({ 
  useCSR = false, 
  serverInfo, 
  serverLoad, 
  error,
  timestamp 
}: LoginPageProps) {
  const router = useRouter();
  const [isClientRendered, setIsClientRendered] = useState(false);
  const [renderMode, setRenderMode] = useState<'ssr' | 'csr'>('ssr');
  
  // 客户端渲染逻辑
  useEffect(() => {
    setIsClientRendered(true);
    
    // 如果服务端指示使用CSR，或者检测到高负载
    if (useCSR || serverLoad?.isHighLoad) {
      setRenderMode('csr');
      console.log('Using CSR due to high server load or explicit CSR flag');
    } else {
      setRenderMode('ssr');
      console.log('Using SSR with server info:', serverInfo);
    }
    
    // 在开发环境下显示渲染模式
    if (process.env.NODE_ENV === 'development') {
      console.log('Login page render mode:', renderMode);
      if (serverLoad) {
        console.log('Server load info:', getLoadStatusDescription(serverLoad));
        console.log('Detailed load info:', serverLoad);
      }
    }
  }, [useCSR, serverLoad, serverInfo, renderMode]);
  
  const onFinish = async (values: UserLoginType) => {
    try {
      const res = await request.post("/api/login", values);
      console.log(
        "%c [ res ]-17",
        "font-size:13px; background:pink; color:#bf2c9f;",
        res
      );
      localStorage.setItem("user", JSON.stringify(res.data));
      message.success("登陆成功");

      router.push("/book");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Head>
        <title>登陆</title>
        <meta name="description" content="图书馆里系统" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* 渲染模式信息 */}
        <meta name="render-mode" content={renderMode} />
        <meta name="server-load" content={serverLoad?.isHighLoad ? 'high' : 'normal'} />
        {serverInfo && (
          <meta name="server-timestamp" content={serverInfo.timestamp.toString()} />
        )}
        
        {/* 预加载关键资源 */}
        <link rel="preload" href="/logo.svg" as="image" />
        <link rel="preload" href="/_next/static/css/app.css" as="style" />
        
        {/* 预连接到API */}
        <link rel="preconnect" href="https://mock.apifox.cn" />
      </Head>
      <main className={styles.main}>
        <header className={styles.header}>
          <Image
            className={styles.img}
            width={100}
            height={100}
            src="/logo.svg"
            alt="logo"
          />
          读意图书管理系统
        </header>
        {/* 开发环境下的调试信息 */}
        {process.env.NODE_ENV === 'development' && isClientRendered && (
          <div style={{ 
            position: 'fixed', 
            top: '10px', 
            right: '10px', 
            background: renderMode === 'csr' ? '#ff4d4f' : '#52c41a', 
            color: 'white', 
            padding: '8px 12px', 
            borderRadius: '6px', 
            fontSize: '11px',
            zIndex: 1000,
            maxWidth: '200px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
              {renderMode.toUpperCase()} 
              {serverLoad?.isHighLoad && ' (High Load)'}
            </div>
            {serverLoad && (
              <div style={{ fontSize: '10px', opacity: 0.9 }}>
                {getLoadStatusDescription(serverLoad)}
              </div>
            )}
            {error && (
              <div style={{ fontSize: '10px', opacity: 0.9, color: '#ffccc7' }}>
                Error: {error}
              </div>
            )}
          </div>
        )}
        
        <div className={styles.form}>
          <Form
            name="basic"
            initialValues={{ name: "", password: "" }}
            onFinish={onFinish}
            layout="vertical"
            autoComplete="off"
            size="large"
          >
            <Form.Item
              name="name"
              label={<span className={styles.label}>账号</span>}
              rules={[{ required: true, message: "请输入用户名" }]}
            >
              <Input placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item
              name="password"
              label={<span className={styles.label}>密码</span>}
              rules={[{ required: true, message: "请输入密码" }]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                className={classnames(styles.btn, styles.loginBtn)}
                size="large"
              >
                登陆
              </Button>
            </Form.Item>
          </Form>
        </div>
      </main>
    </>
  );
}

// 登录页面使用 SSR，支持服务端渲染和负载均衡
export async function getServerSideProps(context: any) {
  const { req, res } = context;
  
  try {
    // 检查服务器负载情况
    const serverLoad = await checkServerLoad();
    
    // 如果负载过高，返回特殊标记让客户端处理
    if (serverLoad.isHighLoad) {
      console.log('High server load detected, using CSR fallback:', getLoadStatusDescription(serverLoad));
      
      return {
        props: {
          useCSR: true, // 标记使用客户端渲染
          serverLoad: serverLoad,
          timestamp: Date.now(),
        },
      };
    }
    
    // 正常SSR渲染
    const serverInfo = {
      timestamp: Date.now(),
      userAgent: req.headers['user-agent'],
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    };
    
    console.log('Using SSR for login page:', getLoadStatusDescription(serverLoad));
    
    return {
      props: {
        useCSR: false,
        serverInfo,
        serverLoad,
      },
    };
  } catch (error) {
    // 如果服务端渲染失败，降级为CSR
    console.error('SSR failed, falling back to CSR:', error);
    return {
      props: {
        useCSR: true,
        error: 'SSR failed, using CSR fallback',
        timestamp: Date.now(),
      },
    };
  }
}