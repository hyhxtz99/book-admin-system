// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://ba8cbb665b3d82c8b8cf764b791d3e57@o4510219708530688.ingest.de.sentry.io/4510219715149904",

  // Add optional integrations for additional features
  integrations: [
    Sentry.replayIntegration(),
    Sentry.browserTracingIntegration(),
    Sentry.browserProfilingIntegration(), // 启用浏览器profiling
  ],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // 性能监控配置 - 设置profiling采样率
  profilesSampleRate: 1.0, // 100%的transactions会被profiling
  
  // 调试模式（仅在开发环境中启用）
  debug: false, // 在生产环境中禁用debug模式
  
  // 环境设置
  environment: process.env.NODE_ENV,
  
  // 发布版本
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
  
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

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
  
  // 性能数据过滤
  beforeSendTransaction(event) {
    // 过滤掉一些不需要的性能数据
    if (event.transaction === 'GET /_next/static/') {
      return null;
    }
    return event;
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;