// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
const { nodeProfilingIntegration } = require("@sentry/profiling-node");

Sentry.init({
  dsn: "https://ba8cbb665b3d82c8b8cf764b791d3e57@o4510219708530688.ingest.de.sentry.io/4510219715149904",

  // 集成配置
  integrations: [
    nodeProfilingIntegration(),
  ],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // 性能监控配置 - 必须启用tracing才能使用profiling
  profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // 设置profiling采样率
  profileSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // 自动启用profiling在活跃的traces期间
  profileLifecycle: 'trace',
  
  // 调试模式（仅在开发环境中启用）
  debug: false, // 在生产环境中禁用debug模式
  
  // 环境设置
  environment: process.env.NODE_ENV,
  
  // 发布版本
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
  
  // 错误过滤
  beforeSend(event, hint) {
    // 过滤掉一些不需要的错误
    if (event.exception) {
      const error = hint.originalException;
      if (error && (error as any).message && (error as any).message.includes('ResizeObserver loop limit exceeded')) {
        return null;
      }
    }
    return event;
  },
});
