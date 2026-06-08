-- 金融分类表，用于记录各种收入/支出的类型
create table classification
(
    id    INT8 GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- 自动递增
    name  varchar,                                       -- 名称，收入或支出的类型
    types bool default false-- 类型。默认false(0)表示支出类型，true(1)表示收入类型
);

-- 账目表
create table accounts
(
    id                INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- 自动递增
    amount            numeric(16, 2),                               -- 金额。整数 + 小数一共16位。保留2两位小数
    self_account      varchar(19) not null,                         -- 自身的银行卡账户
    trading_time      timestamp   not null,                         -- 交易时间戳
    description       text default null,                            -- 描述信息
    classification_id int8        NOT NULL,                         -- 支付类型。
    CONSTRAINT fk_classification_accounts FOREIGN KEY (classification_id) REFERENCES "classification" (id)
        ON DELETE CASCADE                                           -- 可选：主表删除，从表也删除
        ON UPDATE CASCADE                                           -- 可选：主表ID更新，从表同步
);
-- 创建索引
CREATE INDEX idx_classification_id ON accounts (classification_id);

