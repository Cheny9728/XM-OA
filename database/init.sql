-- 创建数据库
CREATE DATABASE IF NOT EXISTS wind_power_system;
USE wind_power_system;

-- 创建用户表
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(50) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入测试用户数据（密码：admin123）
INSERT INTO users (username, password, name, role) VALUES 
('admin', '$2a$10$mj1J6HUAxD1DNzqxwkMdPeYq.YW3S5Z3hKH1thDBhgw0tH1Tz.wEi', '管理员', 'admin'); 