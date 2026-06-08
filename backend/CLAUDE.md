# 后端CLAUDE.md

## 开发框架

- Rust + Axum + SeaORM + PostgreSQL
- 提供RESTful接口与UI进行通信

## 依赖项

- sea-orm 1.0（ORM框架）
- sea-orm-migration 1.1.19（数据库迁移）
- axum 0.7（Web框架）
- tokio 1（异步运行时）

## 数据库配置

- 数据库：PostgreSQL
- 连接字符串：DATABASE_URL=postgres://root:123456@localhost:5432/db_accounting
- 迁移：应用启动时自动运行所有待执行的迁移

## 已实现功能

### 数据库表

#### finance_type 表
- id: INTEGER PRIMARY KEY AUTO_INCREMENT（自增主键）
- name: VARCHAR NOT NULL（财务类型名称）
- type: INTEGER NOT NULL（0=支出，1=收入）

#### classification 表
- id: BIGSERIAL PRIMARY KEY（自增主键）
- name: VARCHAR（分类名称）
- types: BOOLEAN（分类类型：false=支出，true=收入）

#### accounts 表
- id: SERIAL PRIMARY KEY（自增主键）
- amount: NUMERIC(16,2)（金额）
- self_account: VARCHAR(19)（账户）
- trading_time: TIMESTAMP（交易时间）
- description: VARCHAR（描述）
- classification_id: INT8 FOREIGN KEY（关联到classification表）

### API端点

- GET /health - 健康检查
- POST /api/accounts - 创建账户（待完善）
- POST /api/classifications - 创建分类（用于向classification表添加数据）

### 技术细节

- 使用 sea-orm-cli 自动生成 entities
- CORS 配置：CorsLayer::permissive() 允许跨域请求
- 数据库迁移自动执行：应用启动时自动运行所有待执行的迁移
- 监听地址：0.0.0.0:3000（允许所有来源连接）

## 后续功能

- 首页数据接口（收入、支出、剩余统计）
- 账户管理接口（CRUD）
- 交易记录查询接口
- 用户认证系统