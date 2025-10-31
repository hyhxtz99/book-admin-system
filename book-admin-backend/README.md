# Book Admin Backend

图书管理系统后端服务，基于Spring Boot框架开发，使用MySQL数据库存储数据。

## 项目结构

```
book-admin-backend/
├── src/
│   └── main/
│       ├── java/com/bookadmin/
│       │   ├── BookAdminBackendApplication.java    # 主启动类
│       │   ├── config/
│       │   │   └── DataInitializer.java            # 数据初始化
│       │   ├── controller/                          # 控制器层
│       │   │   ├── BookController.java
│       │   │   ├── UserController.java
│       │   │   ├── CategoryController.java
│       │   │   └── BorrowController.java
│       │   ├── dto/                                # 数据传输对象
│       │   │   ├── BookDTO.java
│       │   │   ├── UserDTO.java
│       │   │   ├── CategoryDTO.java
│       │   │   ├── BorrowDTO.java
│       │   │   └── PageResult.java
│       │   ├── entity/                             # 实体类
│       │   │   ├── Book.java
│       │   │   ├── User.java
│       │   │   ├── Category.java
│       │   │   └── Borrow.java
│       │   ├── enums/                             # 枚举类
│       │   │   ├── UserRole.java
│       │   │   ├── UserStatus.java
│       │   │   ├── UserSex.java
│       │   │   └── BorrowStatus.java
│       │   ├── repository/                        # 数据访问层
│       │   │   ├── BookRepository.java
│       │   │   ├── UserRepository.java
│       │   │   ├── CategoryRepository.java
│       │   │   └── BorrowRepository.java
│       │   └── service/                           # 业务逻辑层
│       │       ├── BookService.java
│       │       ├── UserService.java
│       │       ├── CategoryService.java
│       │       └── BorrowService.java
│       └── resources/
│           └── application.yml                    # 配置文件
├── pom.xml                                        # Maven配置
└── README.md                                      # 项目说明
```

## 技术栈

- **框架**: Spring Boot 3.2.0
- **数据库**: MySQL 8.0
- **ORM**: Spring Data JPA
- **构建工具**: Maven
- **Java版本**: 17

## 功能特性

### 1. 图书管理
- 图书的增删改查
- 图书分类管理
- 图书库存管理
- 图书搜索和分页

### 2. 用户管理
- 用户信息管理
- 用户角色管理（管理员/普通用户）
- 用户状态管理

### 3. 借阅管理
- 图书借阅记录
- 借阅状态管理
- 图书归还功能
- 库存自动更新

### 4. 分类管理
- 多级分类支持
- 分类层级管理
- 分类树形结构

## 数据库设计

### 表结构

1. **categories** - 分类表
   - id: 主键
   - name: 分类名称
   - level: 分类级别
   - parent_level: 父级分类级别
   - parent_id: 父分类ID

2. **users** - 用户表
   - id: 主键
   - name: 用户名
   - nick_name: 昵称
   - role: 角色（admin/user）
   - status: 状态（on/off）
   - sex: 性别（male/female）
   - created_at: 创建时间

3. **books** - 图书表
   - id: 主键
   - name: 图书名称
   - author: 作者
   - description: 描述
   - publish_at: 出版年份
   - book_no: 图书编号
   - cover: 封面URL
   - stock: 库存
   - category_id: 分类ID
   - created_at: 创建时间

4. **borrows** - 借阅表
   - id: 主键
   - book_id: 图书ID
   - user_id: 用户ID
   - status: 借阅状态（on/off）
   - borrow_date: 借阅日期
   - return_date: 归还日期

## API接口

### 图书管理
- `GET /api/books` - 获取图书列表
- `GET /api/books/{id}` - 获取图书详情
- `POST /api/books` - 创建图书
- `PUT /api/books/{id}` - 更新图书
- `DELETE /api/books/{id}` - 删除图书

### 用户管理
- `GET /api/users` - 获取用户列表
- `GET /api/users/{id}` - 获取用户详情
- `POST /api/users` - 创建用户
- `PUT /api/users/{id}` - 更新用户
- `DELETE /api/users/{id}` - 删除用户

### 分类管理
- `GET /api/categories` - 获取分类列表
- `GET /api/categories/{id}` - 获取分类详情
- `POST /api/categories` - 创建分类
- `PUT /api/categories/{id}` - 更新分类
- `DELETE /api/categories/{id}` - 删除分类

### 借阅管理
- `GET /api/borrows` - 获取借阅列表
- `GET /api/borrows/{id}` - 获取借阅详情
- `POST /api/borrows` - 创建借阅记录
- `PUT /api/borrows/back/{id}` - 归还图书
- `DELETE /api/borrows/{id}` - 删除借阅记录

## 快速开始

### 1. 环境要求
- Java 17+
- Maven 3.6+
- MySQL 8.0+

### 2. 数据库配置
1. 创建数据库：
```sql
CREATE DATABASE book_admin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. 修改 `application.yml` 中的数据库连接信息：
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/book_admin?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai
    username: your_username
    password: your_password
```

### 3. 运行项目
```bash
# 编译项目
mvn clean compile

# 运行项目
mvn spring-boot:run
```

### 4. 访问接口
项目启动后，可以通过以下地址访问：
- 服务地址: http://localhost:8080
- API文档: http://localhost:8080/api/books

## 初始数据

项目启动时会自动创建以下初始数据：
- 6个分类（包含多级分类）
- 30个用户（包含管理员和普通用户）
- 30本图书（包含不同分类的图书）
- 20条借阅记录

## 开发说明

### 项目特点
1. **RESTful API设计**: 遵循REST规范，接口清晰易用
2. **分层架构**: Controller-Service-Repository分层，职责清晰
3. **数据验证**: 使用JPA注解进行数据验证
4. **异常处理**: 统一的异常处理机制
5. **跨域支持**: 支持前端跨域访问
6. **自动初始化**: 启动时自动创建初始数据

### 扩展建议
1. 添加用户认证和授权
2. 实现文件上传功能（图书封面）
3. 添加数据缓存机制
4. 实现日志记录
5. 添加单元测试
6. 集成Swagger API文档

## 许可证

MIT License






