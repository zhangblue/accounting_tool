# 记账应用 (Accounting Tool)

个人财务管理应用，帮助用户追踪和管理财务记录。用户可通过Web界面登录，记录收入和支出，查看财务统计信息。

## 技术栈

### 前端
- **框架**: React 18 + Vite
- **语言**: TypeScript
- **UI组件库**: Ant Design
- **图表库**: Recharts
- **状态管理**: React Hooks
- **HTTP客户端**: Axios

### 后端
- **语言**: Rust
- **Web框架**: Axum 0.7
- **ORM**: SeaORM 1.0
- **数据库迁移**: sea-orm-migration 1.1.19
- **异步运行时**: Tokio 1
- **数据库**: PostgreSQL

## 项目结构

```
accounting_tool/
├── ui/                          # 前端项目
│   ├── src/
│   │   ├── components/          # React组件
│   │   ├── pages/               # 页面
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── CLAUDE.md
├── backend/                     # 后端项目
│   ├── src/
│   │   └── main.rs              # 主程序入口
│   ├── migration/               # 数据库迁移
│   │   ├── src/
│   │   │   ├── lib.rs
│   │   │   └── m20260528_000001_create_finance_type.rs
│   │   └── Cargo.toml
│   ├── Cargo.toml
│   ├── .env                     # 环境配置
│   └── CLAUDE.md
├── CLAUDE.md                    # 项目总体指导
└── README.md                    # 本文件
```

## 快速开始

### 前置要求
- Node.js 16+（前端开发）
- Rust 1.70+（后端开发）
- PostgreSQL 12+（数据库）

### 环境配置

1. **数据库配置**
   ```bash
   # 创建数据库
   createdb db_accounting
   
   # 配置后端环境变量
   cd backend
   echo "DATABASE_URL=postgres://root:123456@localhost:5432/db_accounting" > .env
   ```

2. **前端启动**
   ```bash
   cd ui
   npm install
   npm run dev
   # 访问 http://localhost:5173
   ```

3. **后端启动**
   ```bash
   cd backend
   cargo run
   # 服务运行在 http://localhost:3000
   ```

## 已实现功能

### 后端
- ✅ 数据库连接和自动迁移
- ✅ classification 表（分类管理）
- ✅ accounts 表（账目记录）
- ✅ 健康检查端点 (`GET /health`)
- ✅ 创建分类端点 (`POST /api/classifications`)
- ✅ CORS 跨域支持
- ✅ SeaORM entities 自动生成

### 前端
- ✅ 基础项目结构（React 19 + Vite + TypeScript）
- ✅ 菜单导航结构
- ✅ "我的设置" > "添加类型" 子菜单
- ✅ 添加分类表单页面

## 开发中的功能

- 🔄 首页菜单和财务统计（收入、支出、剩余）
- 🔄 账本交易记录表格显示
- 🔄 用户认证系统
- 🔄 数据统计和分析功能

## API文档

### 健康检查
```
GET /health
Response: { "status": "ok" }
```

### 创建账户
```
POST /api/accounts
Response: { "message": "Account created" }
```

## 数据库表结构

### finance_type 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键，自增 |
| name | VARCHAR | 财务类型名称 |
| type | INTEGER | 0=支出，1=收入 |

## 开发工作流

1. **创建功能分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **提交更改**
   ```bash
   git add .
   git commit -m "描述你的更改"
   ```

3. **推送并创建PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## 常用命令

### 前端
```bash
cd ui
npm run dev      # 开发模式
npm run build    # 生产构建
npm run preview  # 预览构建结果
```

### 后端
```bash
cd backend
cargo run        # 运行应用
cargo build      # 构建
cargo test       # 运行测试
```

## 项目指导

- 前端开发指导：见 `ui/CLAUDE.md`
- 后端开发指导：见 `backend/CLAUDE.md`
- 项目总体指导：见 `CLAUDE.md`

## 许可证

MIT
