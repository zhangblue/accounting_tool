# 项目总指令：UI + Backend 双 Subagent 分工

## 项目接哦顾

- 前端UI：`ui/`
- 后端Backend：`backend/`、`database/`

## 核心规则：自动委派 Subagent

### 1. 生成/修改 UI、组件、页面、样式、路由

→ **必须委派给 subagent: ui-builder**
→ 禁止主会话直接写 UI 代码

### 2. 生成/修改 API、接口、数据库、服务端逻辑

→ **必须委派给 subagent: backend-builder**
→ 禁止主会话直接写 Backend 代码

## 加载各自规则

`@import .claude/rules/ui.md`
`@import .claude/rules/backend.md`

## 禁止混写

- UI Agent 只看 UI 规则、只改 UI 文件
- Backend Agent 只看 Backend 规则、只改 Backend 文件
- 主会话只做协调、不写具体业务代码

## 集成测试

如果用户提出要进行集成测试，你需要做如下操作, 如果用户没有提集成测试，则默认不执行集成测试

1. 你需要启动启动后端程序
2. 你需要启动UI代码，并且自动打开浏览器并访问页面
3. 根据用户的问题，自动测试相应的模块，如果出现错误需要进行修改。