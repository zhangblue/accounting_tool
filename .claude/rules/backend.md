# 后端CLAUDE.md

## 开发框架

- Rust + Axum + SeaORM + PostgreSQL
- 提供RESTful接口与UI进行通信

## 必须遵循的规则

- 必须使用`sea-orm` crate来对数据库进行CRUD操作
- 后端程序启动时，必须使用`sea-orm-migration 1.1.19` 自动创建数据库表
- 服务端框架必须使用`axum`、`tokio`

### 技术细节

- 使用 sea-orm-cli 自动生成 entities
- CORS 配置：CorsLayer::permissive() 允许跨域请求
- 数据库迁移自动执行：应用启动时自动运行所有待执行的迁移
- 监听地址：0.0.0.0:3000（允许所有来源连接

## 数据库配置

- 数据库：PostgreSQL
- 连接字符串：DATABASE_URL=postgres://root:123456@localhost:5432/db_accounting
- 迁移：应用启动时自动运行所有待执行的迁移
- 数据库的规则参见`@import .claude/rules/database.md`

## API端点

- GET /health - 健康检查
- POST /api/accounts - 创建账户（待完善）
- POST /api/classifications - 创建分类（用于向classification表添加数据）

### 技术细节

- 使用 sea-orm-cli 自动生成 entities
- CORS 配置：CorsLayer::permissive() 允许跨域请求
- 数据库迁移自动执行：应用启动时自动运行所有待执行的迁移
- 监听地址：0.0.0.0:3000（允许所有来源连接）

## 后端如何测试

- 使用`cargo check`命令必须没有报错。
- 使用`cargo clippy`命令必须没有警告。

## 后续功能

- 首页数据接口（收入、支出、剩余统计）
- 账户管理接口（CRUD）
- 交易记录查询接口
- 用户认证系统