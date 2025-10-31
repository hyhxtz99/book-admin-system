-- 图书管理系统数据库表结构
-- 创建数据库
CREATE DATABASE IF NOT EXISTS book_admin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE book_admin;

-- 分类表
CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT '分类名称',
    level INT NOT NULL COMMENT '分类级别',
    parent_level VARCHAR(50) COMMENT '父级分类级别',
    parent_id BIGINT COMMENT '父分类ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_level (level),
    INDEX idx_parent (parent_id),
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='分类表';

-- 用户表
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    nick_name VARCHAR(50) COMMENT '昵称',
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user' COMMENT '角色',
    status ENUM('on', 'off') NOT NULL DEFAULT 'on' COMMENT '状态',
    sex ENUM('male', 'female') NOT NULL COMMENT '性别',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_role (role),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 图书表
CREATE TABLE books (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL COMMENT '图书名称',
    author VARCHAR(100) NOT NULL COMMENT '作者',
    description TEXT COMMENT '描述',
    publish_at INT COMMENT '出版年份',
    book_no VARCHAR(50) UNIQUE COMMENT '图书编号',
    cover VARCHAR(500) COMMENT '封面URL',
    stock INT NOT NULL DEFAULT 0 COMMENT '库存',
    category_id BIGINT COMMENT '分类ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_author (author),
    INDEX idx_book_no (book_no),
    INDEX idx_category (category_id),
    INDEX idx_stock (stock),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='图书表';

-- 借阅表
CREATE TABLE borrows (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    book_id BIGINT NOT NULL COMMENT '图书ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    status ENUM('on', 'off') NOT NULL DEFAULT 'on' COMMENT '借阅状态',
    borrow_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '借阅日期',
    return_date TIMESTAMP NULL COMMENT '归还日期',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_book (book_id),
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_borrow_date (borrow_date),
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='借阅表';

-- 入库记录表
CREATE TABLE stock_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    book_id BIGINT NOT NULL COMMENT '图书ID',
    admin_id BIGINT NOT NULL COMMENT '管理员ID',
    stock_quantity INT NOT NULL COMMENT '入库数量',
    signature_image TEXT COMMENT '手写签名图片',
    remarks TEXT COMMENT '备注',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_book (book_id),
    INDEX idx_admin (admin_id),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='入库记录表';

-- 插入初始分类数据
INSERT INTO categories (name, level, parent_level) VALUES
('文学小说', 1, '0'),
('科技技术', 1, '0'),
('历史传记', 1, '0');

-- 获取刚插入的分类ID
SET @fiction_id = (SELECT id FROM categories WHERE name = '文学小说' AND level = 1);
SET @tech_id = (SELECT id FROM categories WHERE name = '科技技术' AND level = 1);
SET @history_id = (SELECT id FROM categories WHERE name = '历史传记' AND level = 1);

-- 插入二级分类
INSERT INTO categories (name, level, parent_level, parent_id) VALUES
('中国文学', 2, '1', @fiction_id),
('外国文学', 2, '1', @fiction_id),
('编程开发', 2, '2', @tech_id),
('人工智能', 2, '2', @tech_id);

-- 插入初始用户数据
INSERT INTO users (name, nick_name, role, status, sex) VALUES
('admin', '管理员', 'admin', 'on', 'male'),
('user1', '用户1', 'user', 'on', 'female'),
('user2', '用户2', 'user', 'on', 'male'),
('user3', '用户3', 'user', 'on', 'female'),
('user4', '用户4', 'user', 'on', 'male');

-- 插入初始图书数据
INSERT INTO books (name, author, description, publish_at, book_no, cover, stock, category_id) VALUES
('红楼梦', '曹雪芹', '中国古典文学四大名著之一', 1791, 'BK000001', 'https://example.com/cover1.jpg', 5, @fiction_id),
('西游记', '吴承恩', '中国古典文学四大名著之一', 1592, 'BK000002', 'https://example.com/cover2.jpg', 3, @fiction_id),
('Java核心技术', 'Cay S. Horstmann', 'Java编程经典教程', 2018, 'BK000003', 'https://example.com/cover3.jpg', 8, @tech_id),
('Spring Boot实战', 'Craig Walls', 'Spring Boot开发指南', 2020, 'BK000004', 'https://example.com/cover4.jpg', 6, @tech_id),
('史记', '司马迁', '中国第一部纪传体通史', -91, 'BK000005', 'https://example.com/cover5.jpg', 2, @history_id);






