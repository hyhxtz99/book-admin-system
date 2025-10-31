// import * as Sentry from '@sentry/nextjs';

// export async function register() {
//   if (process.env.NEXT_RUNTIME === 'nodejs') {
//     await import('../sentry.server.config');
//   }

//   if (process.env.NEXT_RUNTIME === 'edge') {
//     await import('../sentry.edge.config');
//   }
// }

// export const onRequestError = Sentry.captureRequestError;

// 添加空的导出语句，使其成为一个模块而不是全局脚本
export {};
