import { getBookDetail } from "@/api";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// 动态导入表单组件
const BookForm = dynamic(() => import("@/components/BookForm"), {
  ssr: false,
  loading: () => <div>Loading form...</div>
});

export default function Book() {
  const [data, setData] = useState();
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const res = await getBookDetail(router.query.id as string);
      setData(res.data);
    })();
  }, [router]);
  return <BookForm title="图书编辑" editData={data} />;
}
