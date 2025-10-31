# 登录页面 SSR/CSR 混合渲染配置

## 🎯 功能概述

登录页面现在支持**智能渲染模式切换**：
- **SSR (服务端渲染)**: 正常负载时使用，提供更好的SEO和首屏性能
- **CSR (客户端渲染)**: 高负载时自动切换，减轻服务器压力

## 🔧 技术实现

### 1. 负载监控系统

#### 监控指标
- **内存使用率**: 堆内存使用超过85%触发高负载
- **CPU使用率**: CPU使用超过70%触发高负载  
- **系统负载**: 系统负载超过2.0触发高负载
- **错误检测**: 任何监控错误都会触发CSR降级

#### 配置阈值
```typescript
export const LOAD_THRESHOLDS = {
  MEMORY_USAGE: 0.8,     // 80%
  CPU_USAGE: 0.7,        // 70%
  LOAD_AVERAGE: 2.0,     // 2.0
  HEAP_USAGE: 0.85,      // 85%
};
```

### 2. 渲染模式切换逻辑

#### 服务端决策 (getServerSideProps)
```typescript
// 检查负载
const serverLoad = await checkServerLoad();

// 高负载时使用CSR
if (serverLoad.isHighLoad) {
  return { props: { useCSR: true, serverLoad } };
}

// 正常负载使用SSR
return { props: { useCSR: false, serverInfo, serverLoad } };
```

#### 客户端处理
```typescript
// 根据服务端指示选择渲染模式
useEffect(() => {
  if (useCSR || serverLoad?.isHighLoad) {
    setRenderMode('csr');
  } else {
    setRenderMode('ssr');
  }
}, [useCSR, serverLoad]);
```

## 📊 监控和调试

### 开发环境调试
- **右上角指示器**: 显示当前渲染模式 (SSR/CSR)
- **负载信息**: 显示内存、CPU、系统负载状态
- **控制台日志**: 详细的负载监控和决策过程

### 生产环境监控
- **Meta标签**: 页面包含渲染模式和负载状态信息
- **服务端日志**: 记录负载检查和渲染决策过程

## 🚀 性能优势

### SSR模式优势
- ✅ **SEO友好**: 搜索引擎可完整抓取页面内容
- ✅ **首屏快速**: 服务端预渲染，减少客户端渲染时间
- ✅ **用户体验**: 更快的页面加载和交互响应

### CSR模式优势  
- ✅ **服务器减压**: 高负载时减少服务端渲染压力
- ✅ **弹性扩展**: 自动适应服务器负载变化
- ✅ **故障容错**: 服务端错误时自动降级

## 🔄 自动切换场景

### 触发CSR的情况
1. **内存使用率** > 80%
2. **CPU使用率** > 70%  
3. **系统负载** > 2.0
4. **监控错误**: 任何负载检查失败
5. **服务端错误**: SSR渲染过程出错

### 使用SSR的情况
1. **正常负载**: 所有指标在阈值以下
2. **首次访问**: 默认使用SSR
3. **负载恢复**: 负载降低后自动切换回SSR

## 🛠️ 配置和调优

### 调整负载阈值
```typescript
// 在 src/utils/serverLoadMonitor.ts 中修改
export const LOAD_THRESHOLDS = {
  MEMORY_USAGE: 0.7,  // 降低到70%
  CPU_USAGE: 0.5,     // 降低到50%
  // ... 其他配置
};
```

### 添加自定义监控
```typescript
// 在 checkServerLoad 函数中添加
const customMetric = await getCustomMetric();
const isHighLoad = customMetric > CUSTOM_THRESHOLD || /* 其他条件 */;
```

### 禁用自动切换
```typescript
// 在 getServerSideProps 中强制使用SSR
return {
  props: {
    useCSR: false, // 强制SSR
    serverLoad: await checkServerLoad(),
  },
};
```

## 📈 监控指标

### 服务端指标
- 内存使用率 (heapUsed/heapTotal)
- CPU使用时间 (user + system)
- 系统负载平均值
- 服务器运行时间
- 监控检查耗时

### 客户端指标
- 渲染模式切换次数
- 页面加载时间
- 用户交互响应时间
- 错误率统计

## 🔍 故障排查

### 常见问题

1. **总是使用CSR**
   - 检查负载阈值设置是否过低
   - 查看服务端日志中的负载信息
   - 确认服务器资源是否充足

2. **负载监控失败**
   - 检查 `serverLoadMonitor.ts` 中的错误处理
   - 确认系统API可用性
   - 查看控制台错误信息

3. **渲染模式不切换**
   - 检查客户端 `useEffect` 依赖
   - 确认服务端props传递正确
   - 查看浏览器控制台日志

### 调试命令
```bash
# 查看服务端日志
npm run dev | grep "Server Load"

# 检查内存使用
node -e "console.log(process.memoryUsage())"

# 检查CPU使用
node -e "console.log(process.cpuUsage())"
```

## 🎉 总结

这个混合渲染系统提供了：
- **智能负载感知**: 自动检测服务器负载状态
- **无缝模式切换**: 用户无感知的渲染模式切换
- **完整监控体系**: 开发和生产环境的全面监控
- **高度可配置**: 灵活的阈值和策略配置

通过这种方式，登录页面既能享受SSR的性能优势，又能在高负载时自动降级，确保系统的稳定性和可用性。


