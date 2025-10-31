import { getUserDetail } from "@/api";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// 动态导入表单组件
const UserForm = dynamic(() => import("@/components/UserForm"), {
  ssr: false,
  loading: () => <div>Loading form...</div>
});

const UserAdd: React.FC<null> = () => {
  const router = useRouter();
  const [data, setData] = useState();

  useEffect(() => {
    (async () => {
      const res = await getUserDetail(router.query.id as string);
      setData(res.data);
    })();
  }, [router.query.id]);

  return <UserForm title="用户编辑" editData={data} />;
};

export default UserAdd;
