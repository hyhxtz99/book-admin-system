// const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  
  
  // 启用实验性功能
  experimental: {
    // 启用ESM
    esmExternals: true,
  },
  
  // 编译器优化
  compiler: {
    // 移除console.log (生产环境)
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // 图片优化
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // 压缩配置
  compress: true,
  
  // 禁用trace文件生成
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  
  // 禁用静态优化以避免trace文件问题
  trailingSlash: false,
  
  // 代码分割优化
  webpack: (config, { dev, isServer }) => {
    // 生产环境优化
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // 第三方库单独打包
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
            // Antd单独打包
            antd: {
              test: /[\\/]node_modules[\\/]antd[\\/]/,
              name: 'antd',
              chunks: 'all',
              priority: 20,
            },
            // Sentry单独打包
            sentry: {
              test: /[\\/]node_modules[\\/]@sentry[\\/]/,
              name: 'sentry',
              chunks: 'all',
              priority: 20,
            },
            // 公共代码
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    
    return config;
  },
  
  async rewrites() {
    return [
      {
        source: `/api/:path*`,
        // 启动mock服务，执行这个代码
        // destination: `http://localhost:8080/api/:path*`,
        // 连接本地的nodejs服务，执行这个代码
        destination: `https://mock.apifox.cn/m1/2398938-0-default/api/:path*`,
      },
    ]
  },
  
  // 添加Document-Policy header以启用浏览器profiling
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Document-Policy",
            value: "js-profiling", // 启用JavaScript profiling
          },
          // 性能优化headers
          {
            key: "X-DNS-Prefetch-Control",
            value: "on"
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN"
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
        ],
      },
    ];
  },
}

// Sentry配置选项 - 已注释
// const sentryWebpackPluginOptions = {
//   // 静默模式，减少构建输出
//   silent: !process.env.CI,
//   // 组织名称
//   org: "grammarmate",
//   // 项目名称
//   project: "book-admin",
//   // 上传源码映射
//   widenClientFileUpload: true,
//   // 隐藏源码映射
//   hideSourceMaps: true,
//   // 禁用客户端源码映射
//   disableClientWebpackPlugin: false,
//   // 禁用服务端源码映射
//   disableServerWebpackPlugin: false,
//   // 自动上传源码映射
//   automaticVercelReleases: false,
//   // 路由浏览器请求到Sentry通过Next.js重写来绕过广告拦截器
//   tunnelRoute: "/monitoring",
//   // 自动树摇Sentry日志语句以减少包大小
//   disableLogger: true,
//   // 启用Vercel Cron监视器的自动检测
//   automaticVercelMonitors: true,
// };

// module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
module.exports = nextConfig;