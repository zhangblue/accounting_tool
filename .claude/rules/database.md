# 数据库定义

- 数据库使用PostgreSQL 12+
- 本地测试使用的库名称为`db_accounting`
- 链接本地的数据库为`DATABASE_URL=postgres://root:123456@localhost:5432/db_accounting`

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
- description: TEXT - 描述,
- classification_id: INT8 - 外键指向classification