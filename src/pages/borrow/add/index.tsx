import dynamic from "next/dynamic";

// 动态导入表单组件
const BorrowForm = dynamic(() => import("@/components/BorrowForm"), {
  ssr: false,
  loading: () => <div>Loading form...</div>
});

const BorrowBook: React.FC<any> = () => {
  return <BorrowForm title="借阅添加" />;
};

export default BorrowBook;
