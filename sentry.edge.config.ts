// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://ba8cbb665b3d82c8b8cf764b791d3e57@o4510219708530688.ingest.de.sentry.io/4510219715149904",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
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
});
