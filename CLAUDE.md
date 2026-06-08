# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

**accounting_tool** - 个人记账应用，用于追踪和管理财务记录。使用前后端分离架构，前端提供Web界面，后端提供RESTful API。

## 架构总览

### 前端 (ui/)
- **框架**: React 19 + Vite 8
- **语言**: TypeScript
- **UI**: Ant Design 6 + Recharts 3
- **特性**: 左侧菜单栏 + 右侧主内容区 + 顶部Header
- **页面**: 首页（财务统计）、账本、统计分析、账户分析、设置

### 后端 (backend/)
- **框架**: Rust + Axum 0.7
- **ORM**: SeaORM 1.0 + sea-orm-migration 1.1.19
- **数据库**: PostgreSQL
- **运行时**: Tokio 1
- **端口**: 3000

### 数据库 (database/)
- PostgreSQL 12+
- 表结构: classification（分类）、accounts（账目）、finance_type（财务类型）
- 迁移: 通过sea-orm-migration管理

## 常用命令

### 前端开发
```bash
cd ui
npm install           # 安装依赖
npm run dev          # 启动开发服务器 (http://localhost:5173)
npm run build        # 生产构建
npm run lint         # 代码检查
npm run preview      # 预览生产构建
```

### 后端开发
```bash
cd backend
cargo run            # 启动后端服务 (http://localhost:3000)
cargo check          # 检查编译错误
cargo build          # 构建项目
cargo build --release # 生产构建
```

### 数据库
```bash
# 初始化PostgreSQL数据库
createdb db_accounting

# 配置后端环境变量
cd backend
echo "DATABASE_URL=postgres://root:123456@localhost:5432/db_accounting" > .env
```

## 项目结构

```
accounting_tool/
├── ui/                    # 前端项目
│   ├── src/
│   │   ├── pages/        # 页面组件
│   │   ├── components/   # 可复用组件
│   │   ├── types/        # TypeScript类型
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── CLAUDE.md
├── backend/              # 后端项目
│   ├── src/
│   │   └── main.rs       # 应用入口
│   ├── migration/        # 数据库迁移
│   │   ├── src/
│   │   │   ├── lib.rs
│   │   │   ├── m20260528_000001_create_finance_type.rs
│   │   │   ├── m20260608_000002_create_classification.rs
│   │   │   └── m20260608_000003_create_accounts.rs
│   │   └── Cargo.toml
│   ├── .env
│   ├── Cargo.toml
│   └── CLAUDE.md
├── database/             # 数据库脚本
│   └── create_table.sql            # 完整数据库schema
├── README.md
└── CLAUDE.md
```

## 开发工作流

### 前后端分工
- 前端开发: 见 `ui/CLAUDE.md`，使用独立的subagent执行
- 后端开发: 见 `backend/CLAUDE.md`，使用独立的subagent执行

### Git工作流
1. 基于main分支创建功能分支
2. 提交代码: `git commit -m "type: description"`
3. 推送并创建PR: `git push && gh pr create`

## 数据库表结构

### classification (分类表)
- id: BIGSERIAL PRIMARY KEY
- name: VARCHAR - 分类名称
- types: BOOLEAN DEFAULT false - 0=支出，1=收入

### accounts (账目表)
- id: SERIAL PRIMARY KEY
- amount: NUMERIC(16,2) - 金额
- self_account: VARCHAR(19) - 账户
- trading_time: TIMESTAMP - 交易时间
- classification_id: INT8 - 外键指向classification

### finance_type (财务类型表)
- id: SERIAL PRIMARY KEY
- name: VARCHAR - 类型名称
- type: INTEGER - 0=支出，1=收入

## API端点

- `GET /health` - 健康检查
- `POST /api/accounts` - 创建账户（待完善）

## 技术决策

- **多语言**: 前后端分离，前端用TypeScript，后端用Rust，保证类型安全
- **数据库迁移**: 使用sea-orm-migration管理schema版本
- **ORM**: SeaORM提供类型安全的数据库操作
- **实时性**: 暂无WebSocket，使用RESTful API轮询

## 后续工作

- [ ] 首页财务统计API集成
- [ ] 用户认证系统
- [ ] 交易记录CRUD接口
- [ ] 统计分析功能
- [ ] 账户管理功能

