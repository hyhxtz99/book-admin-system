import { getBorrowDetail } from "@/api";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// 动态导入表单组件
const BorrowForm = dynamic(() => import("@/components/BorrowForm"), {
  ssr: false,
  loading: () => <div>Loading form...</div>
});

const BorrowBook: React.FC<any> = () => {
  const router = useRouter();
  const [data, setData] = useState();

  useEffect(() => {
    getBorrowDetail(router.query.id as string).then((res) => {
      setData(res.data);
    });
  }, [router.query.id]);

  return <BorrowForm title="借阅编辑" editData={data} />;
};

export default BorrowBook;
