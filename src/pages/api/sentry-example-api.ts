import * as Sentry from '@sentry/nextjs';

// Custom error class for Sentry testing
class SentryExampleAPIError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = "SentryExampleAPIError";
  }
}

// A faulty API route to test Sentry's error monitoring
export default function handler(_req: any, res: any) {
  // 使用 Sentry.startSpan 来包装这个操作，这样会被 profiling
  return Sentry.startSpan({
    name: "API Error Test",
    op: "api.handler",
  }, (span) => {
    // 设置 span 属性
    span.setAttributes({
      'api.route': '/api/sentry-example-api',
      'api.method': _req.method,
    });
    try {
      // 故意抛出一个错误来测试 Sentry
      throw new SentryExampleAPIError("This error is raised on the backend called by the example page.");
    } catch (error) {
      // 设置 span 状态为错误
      span.setStatus({ code: 2, message: 'internal_error' });
      span.setAttributes({
        'error.name': (error as Error).name,
        'error.message': (error as Error).message,
      });
      
      // 捕获错误到 Sentry
      Sentry.captureException(error);
      
      // 返回错误响应
      res.status(500).json({ 
        error: 'Internal Server Error',
        message: (error as Error).message,
        timestamp: new Date().toISOString()
      });
    }
  });
}
