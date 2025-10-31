import dynamic from "next/dynamic";

// 动态导入表单组件
const BookForm = dynamic(() => import("@/components/BookForm"), {
  ssr: false,
  loading: () => <div>Loading form...</div>
});

export default function Book() {
  return <BookForm title="图书添加" />;
}
