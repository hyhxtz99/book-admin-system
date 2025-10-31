import { useCurrentUser } from "@/utils/hoos";
import { SentryPerformance } from "@/utils/sentry";
import { message as AntdMessage } from "antd";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import Router from "next/router";

// export const baseUrl = location.protocol + '//localhost';

interface AxiosInstanceType extends AxiosInstance {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  options<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T>;
  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T>;
  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T>;
}

export const CreateAxiosInstance = (
  config?: AxiosRequestConfig
): AxiosInstanceType => {
  const instance = axios.create({
    timeout: 5000,
    withCredentials: true,
    ...config,
  });

  instance.interceptors.request.use(
    function (config: any) {
      // 合并请求头
      try {
        if (typeof window !== 'undefined') {
          const user = JSON.parse(localStorage.getItem("user") || "{}");
          config.headers = {
            ...(config.headers || {}),
            userToken: user?._id,
          };
        }
      } catch {}
      
      // 记录请求开始时间
      (config as any).metadata = { startTime: Date.now() };
      
      return config;
    },
    function (error) {
      // 处理错误请求
      SentryPerformance.recordError(error, { type: 'request-interceptor' });
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    function (response) {
      // 计算请求耗时
      const duration = Date.now() - ((response.config as any).metadata?.startTime || Date.now());
      const url = response.config.url || '';
      const method = response.config.method?.toUpperCase() || 'GET';
      
      const { status, data, message } = response as any;
      if (status === 200) {
        // 记录成功的API请求
        SentryPerformance.recordApiRequest(url, method, duration, status);
        return data;
      } else if (status === 401) {
        // 记录认证失败
        SentryPerformance.recordApiRequest(url, method, duration, status);
        if (typeof window !== 'undefined') {
          return Router.push("/login");
        }
        return Promise.reject(response.data);
      } else {
        // 记录业务错误
        SentryPerformance.recordApiRequest(url, method, duration, status);
        if (typeof window !== 'undefined') AntdMessage.error(message);
        return Promise.reject(response.data);
      }
    },
    function (error) {
      // 计算请求耗时
      const duration = Date.now() - ((error.config as any)?.metadata?.startTime || Date.now());
      const url = error.config?.url || '';
      const method = error.config?.method?.toUpperCase() || 'GET';
      const status = error.response?.status || 0;
      
      // 记录API请求错误
      SentryPerformance.recordApiRequest(url, method, duration, status);
      
      if (error.response) {
        if (error.response.status === 401) {
          if (typeof window !== 'undefined') {
            return Router.push("/login");
          }
        }
      }
      
      // 记录网络错误
      SentryPerformance.recordError(error, { 
        type: 'network-error',
        url,
        method,
        status,
        duration 
      });
      
      if (typeof window !== 'undefined') AntdMessage.error(error?.response?.data?.message || "服务端异常");
      return Promise.reject(error);
    }
  );

  return instance;
};

const request = CreateAxiosInstance({});
export default request;
