# 图书后台管理系统（基于Next.js）

## 项目概述
本项目是一个基于Next.js框架开发的图书后台管理系统的前端页面。系统主要用于管理图书信息，包括图书的增删改查、分类管理、用户权限控制等功能。通过使用Next.js，项目实现了服务端渲染（SSR）、静态生成（SSG）等特性，提升了页面加载速度和SEO优化。

## 项目特点
- **Next.js框架**：利用Next.js的服务端渲染和静态生成功能，提升页面性能和SEO效果。
- **响应式设计**：适配多种设备，确保在桌面、平板和手机上都能良好显示。
- **模块化开发**：采用组件化开发模式，便于维护和扩展。
- **用户权限管理**：实现不同用户角色的权限控制，确保数据安全性。
- **数据交互**：通过RESTful API与后端进行数据交互，实现图书信息的增删改查，并通过apifox生成模拟数据，提升开发效率。

## 技术栈
- **Next.js**：React框架，支持服务端渲染和静态生成。
- **React**：用于构建用户界面的JavaScript库。
- **Tailwind CSS**：用于快速构建现代UI的CSS框架。
- **Axios**：用于发送HTTP请求，与后端API进行数据交互。
- **React Hook Form**：用于表单管理和验证。



## 功能流程图

![](https://raw.githubusercontent.com/calmound/book-admin-react/master/screenshot/1.png)

### 系统演示

![](https://raw.githubusercontent.com/calmound/book-admin-react/master/screenshot/3.gif)

# 启动

1. 下载代码，终端进入该项目目录下
2. 下载依赖包，执行

   ```shell
   npm install
   ```

3. 若连接启动 mock 服务，打开根目录下的 next.config.js 文件，确认以下代码不在注释中

   ```
   destination: `https://mock.apifox.cn/m1/2398938-0-default/api/:path*`,
   ```

4. 若期望连接 nodejs 的本地服务，打开根目录下的 next.config.js 文件，确认以下代码不在注释中

   ```javascript
   destination: `http://localhost:3001/api/:path*`,
   ```

5. 运行项目

   ```shell
   npm run dev
   ```

6. 访问 localhost:3000/login
7. 看到如下页面，表明启动成功
   ![](https://raw.githubusercontent.com/calmound/book-admin-react/master/screenshot/2.png)
   
   
