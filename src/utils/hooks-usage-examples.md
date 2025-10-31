# 自定义Hooks使用示例

## 1. useDebounceCallback - 防抖函数Hook

### 用途
用于防止用户短时间内重复点击按钮，如编辑、创建、删除等操作。

### 使用示例

```typescript
import { useDebounceCallback } from '@/utils/hoos';

// 在组件中使用
const MyComponent = () => {
  // 防抖处理按钮点击，300ms内只执行一次
  const handleEdit = useDebounceCallback((id: string) => {
    console.log('编辑图书:', id);
    // 执行编辑逻辑
  }, 300);

  // 防抖处理表单提交，500ms内只执行一次
  const handleSubmit = useDebounceCallback(async (data: any) => {
    await submitData(data);
  }, 500);

  return (
    <div>
      <Button onClick={() => handleEdit('123')}>编辑</Button>
      <Button onClick={() => handleSubmit(formData)}>提交</Button>
    </div>
  );
};
```

### 参数说明
- `callback`: 要防抖的函数
- `delay`: 防抖延迟时间，默认500ms

## 2. useDebounce - 防抖值Hook

### 用途
用于搜索输入框等场景，避免频繁触发搜索请求。

### 使用示例

```typescript
import { useDebounce } from '@/utils/hoos';

const SearchComponent = () => {
  const [searchValue, setSearchValue] = useState('');
  
  // 防抖搜索值，500ms后更新
  const debouncedSearchValue = useDebounce(searchValue, 500);

  useEffect(() => {
    if (debouncedSearchValue) {
      // 执行搜索
      performSearch(debouncedSearchValue);
    }
  }, [debouncedSearchValue]);

  return (
    <Input
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      placeholder="搜索图书..."
    />
  );
};
```

## 3. useModal - 模态框管理Hook

### 用途
统一管理模态框的显示/隐藏状态和加载状态。

### 使用示例

```typescript
import { useModal } from '@/utils/hoos';

const MyComponent = () => {
  // 创建模态框实例
  const modal = useModal();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 显示模态框
  const handleShowModal = (id: string) => {
    setSelectedId(id);
    modal.show();
  };

  // 确认操作
  const handleConfirm = async () => {
    modal.showWithLoading(); // 显示加载状态
    try {
      await deleteItem(selectedId);
      message.success('删除成功');
      modal.hideWithLoading();
    } catch (error) {
      modal.hideWithLoading();
    }
  };

  return (
    <div>
      <Button onClick={() => handleShowModal('123')}>删除</Button>
      
      <Modal
        title="确认删除"
        open={modal.visible}
        onOk={handleConfirm}
        onCancel={modal.hide}
        confirmLoading={modal.loading}
      >
        <p>确定要删除吗？</p>
      </Modal>
    </div>
  );
};
```

### API说明
- `visible`: 模态框是否可见
- `loading`: 是否显示加载状态
- `show()`: 显示模态框
- `hide()`: 隐藏模态框
- `toggle()`: 切换模态框状态
- `showWithLoading()`: 显示模态框并设置加载状态
- `hideWithLoading()`: 隐藏模态框并清除加载状态

## 4. 在项目中的应用

### 图书管理页面
- 编辑按钮：使用 `useDebounceCallback` 防止重复点击
- 删除按钮：使用 `useModal` 管理删除确认模态框
- 创建按钮：使用 `useDebounceCallback` 防止重复跳转

### 分类管理页面
- 表单提交：使用 `useDebounceCallback` 防止重复提交
- 删除操作：使用 `useModal` 管理删除确认模态框
- 确认按钮：使用 `useDebounceCallback` 防止重复点击

### 搜索功能
- 搜索输入：使用 `useDebounce` 防抖搜索值
- 实时验证：使用 `useDebounce` 防抖验证请求

## 5. 最佳实践

1. **防抖时间选择**：
   - 按钮点击：300-500ms
   - 表单提交：500-1000ms
   - 搜索输入：300-500ms

2. **错误处理**：
   - 在防抖函数中添加 try-catch
   - 在模态框操作中添加错误处理

3. **性能优化**：
   - 合理使用 useCallback 避免不必要的重新渲染
   - 及时清理定时器避免内存泄漏

4. **用户体验**：
   - 提供加载状态反馈
   - 显示操作结果消息
   - 防止重复操作


