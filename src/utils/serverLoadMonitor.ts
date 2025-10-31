// 服务器负载监控工具
export interface ServerLoadInfo {
  isHighLoad: boolean;
  cpuUsage: {
    user: number;
    system: number;
  };
  memUsage: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
    arrayBuffers: number;
  };
  loadAverage?: number[];
  uptime: number;
  timestamp: number;
  error?: string;
}

// 负载阈值配置
export const LOAD_THRESHOLDS = {
  MEMORY_USAGE: 0.8, // 内存使用率超过80%认为高负载
  CPU_USAGE: 0.7,    // CPU使用率超过70%认为高负载
  LOAD_AVERAGE: 2.0, // 系统负载超过2.0认为高负载
  HEAP_USAGE: 0.85,  // 堆内存使用率超过85%认为高负载
};

/**
 * 检查服务器负载情况
 */
export async function checkServerLoad(): Promise<ServerLoadInfo> {
  try {
    const startTime = Date.now();
    
    // 获取CPU使用情况
    const cpuUsage = process.cpuUsage();
    
    // 获取内存使用情况
    const memUsage = process.memoryUsage();
    
    // 获取系统运行时间
    const uptime = process.uptime();
    
    // 计算内存使用率
    const memoryUsageRatio = memUsage.heapUsed / memUsage.heapTotal;
    
    // 计算CPU使用率（简化计算）
    const cpuUsageRatio = (cpuUsage.user + cpuUsage.system) / 1000000; // 转换为秒
    
    // 获取系统负载（如果可用）
    let loadAverage: number[] | undefined;
    try {
      const os = require('os');
      loadAverage = os.loadavg();
    } catch (e) {
      // 忽略loadavg不可用的情况
    }
    
    // 判断是否为高负载
    const isHighLoad = 
      memoryUsageRatio > LOAD_THRESHOLDS.MEMORY_USAGE ||
      cpuUsageRatio > LOAD_THRESHOLDS.CPU_USAGE ||
      (loadAverage && loadAverage[0] > LOAD_THRESHOLDS.LOAD_AVERAGE) ||
      // 随机模拟高负载（用于测试）
      (process.env.NODE_ENV === 'development' && Math.random() < 0.1);
    
    const loadInfo: ServerLoadInfo = {
      isHighLoad,
      cpuUsage: {
        user: cpuUsage.user,
        system: cpuUsage.system,
      },
      memUsage: {
        rss: memUsage.rss,
        heapTotal: memUsage.heapTotal,
        heapUsed: memUsage.heapUsed,
        external: memUsage.external,
        arrayBuffers: memUsage.arrayBuffers,
      },
      loadAverage,
      uptime,
      timestamp: Date.now(),
    };
    
    // 在开发环境下记录负载信息
    if (process.env.NODE_ENV === 'development') {
      console.log('Server Load Check:', {
        isHighLoad,
        memoryUsage: `${(memoryUsageRatio * 100).toFixed(2)}%`,
        cpuUsage: `${cpuUsageRatio.toFixed(2)}s`,
        loadAverage: loadAverage?.[0]?.toFixed(2),
        checkTime: Date.now() - startTime,
      });
    }
    
    return loadInfo;
  } catch (error) {
    console.error('Failed to check server load:', error);
    
    // 如果负载检查失败，默认使用SSR（保守策略）
    return {
      isHighLoad: false,
      cpuUsage: { user: 0, system: 0 },
      memUsage: {
        rss: 0,
        heapTotal: 0,
        heapUsed: 0,
        external: 0,
        arrayBuffers: 0,
      },
      uptime: 0,
      timestamp: Date.now(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 获取负载状态描述
 */
export function getLoadStatusDescription(loadInfo: ServerLoadInfo): string {
  if (loadInfo.error) {
    return `Load check failed: ${loadInfo.error}`;
  }
  
  const memoryUsage = (loadInfo.memUsage.heapUsed / loadInfo.memUsage.heapTotal * 100).toFixed(1);
  const cpuUsage = ((loadInfo.cpuUsage.user + loadInfo.cpuUsage.system) / 1000000).toFixed(2);
  const loadAvg = loadInfo.loadAverage?.[0]?.toFixed(2) || 'N/A';
  
  return `Memory: ${memoryUsage}%, CPU: ${cpuUsage}s, Load: ${loadAvg}`;
}

/**
 * 检查是否应该降级到CSR
 */
export function shouldFallbackToCSR(loadInfo: ServerLoadInfo): boolean {
  return loadInfo.isHighLoad || !!loadInfo.error;
}


