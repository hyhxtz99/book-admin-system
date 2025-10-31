import * as Sentry from "@sentry/nextjs";

/**
 * 性能监控工具类
 */
export class SentryPerformance {
  /**
   * 记录API请求性能
   * @param url API地址
   * @param method 请求方法
   * @param duration 请求时长
   * @param status 响应状态
   */
  static recordApiRequest(
    url: string,
    method: string,
    duration: number,
    status: number
  ) {
    Sentry.addBreadcrumb({
      message: `API Request: ${method} ${url}`,
      category: 'http',
      data: {
        url,
        method,
        duration,
        status,
      },
      level: status >= 400 ? 'error' : 'info',
    });
  }

  /**
   * 记录页面加载性能
   * @param pageName 页面名称
   * @param loadTime 加载时间
   */
  static recordPageLoad(pageName: string, loadTime: number) {
    Sentry.addBreadcrumb({
      message: `Page Load: ${pageName}`,
      category: 'navigation',
      data: {
        pageName,
        loadTime,
      },
      level: 'info',
    });
  }

  /**
   * 记录用户操作
   * @param action 操作名称
   * @param data 操作数据
   */
  static recordUserAction(action: string, data?: Record<string, any>) {
    Sentry.addBreadcrumb({
      message: `User Action: ${action}`,
      category: 'user',
      data,
      level: 'info',
    });
  }

  /**
   * 记录错误
   * @param error 错误对象
   * @param context 错误上下文
   */
  static recordError(error: Error, context?: Record<string, any>) {
    Sentry.captureException(error, {
      tags: {
        component: 'performance-monitor',
      },
      extra: context,
    });
  }

  /**
   * 设置用户信息
   * @param user 用户信息
   */
  static setUser(user: { id: string; username?: string; email?: string }) {
    Sentry.setUser(user);
  }

  /**
   * 设置标签
   * @param key 标签键
   * @param value 标签值
   */
  static setTag(key: string, value: string) {
    Sentry.setTag(key, value);
  }

  /**
   * 设置上下文
   * @param key 上下文键
   * @param value 上下文值
   */
  static setContext(key: string, value: any) {
    Sentry.setContext(key, value);
  }
}

/**
 * 性能监控Hook
 * @param name 监控名称
 * @param data 额外数据
 */
export function usePerformanceMonitoring(name: string, data?: Record<string, any>) {
  const startTime = Date.now();
  
  return {
    finish: (additionalData?: Record<string, any>) => {
      const duration = Date.now() - startTime;
      SentryPerformance.recordUserAction(name, {
        ...data,
        ...additionalData,
        duration,
      });
    },
  };
}