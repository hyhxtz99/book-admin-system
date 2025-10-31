// pages/posts.js
import React from 'react';

// 接收 props 渲染页面
export default function Posts({ posts }) {
  return (
    <div>
      <h1>文章列表（SSR 渲染）</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}

// Next.js 提供的 SSR 方法
export async function getServerSideProps(context) {
  // 在服务端获取数据
  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
  const posts = await res.json();

  // 返回 props 给页面组件
  return {
    props: {
      posts,
    },
  };
}
