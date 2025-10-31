import dynamic from "next/dynamic";

// 动态导入表单组件
const UserForm = dynamic(() => import("@/components/UserForm"), {
  ssr: false,
  loading: () => <div>Loading form...</div>
});

const UserAdd: React.FC<null> = () => {
  return <UserForm title="用户添加" />;
};

export default UserAdd;
