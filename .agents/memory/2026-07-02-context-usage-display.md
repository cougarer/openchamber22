# ContextUsageDisplay: showTokenCount + 移动端适配

**Date:** 2026-07-02
**Scope:** `packages/ui/src/components/ui/ContextUsageDisplay.tsx`, `Header.tsx`, `VSCodeLayout.tsx`, `MiniChatLayout.tsx`

## 改动

- 新增 `showTokenCount` prop，优先级高于 `showPercentIcon`，显示 `formatTokens(totalTokens)`（如 `45.2K`），按百分比着色
- 移动端 Header 右侧新增 `ContextUsageDisplay` 调用（`isMobile` + `showTokenCount`）
- 所有端（Web Desktop、Mobile、VSCode、MiniChat）统一从 `showPercentIcon` 改为 `showTokenCount`

## 踩坑记录

### 1. 生产构建 vs Dev Server

**问题：** 改了源码但页面没变化。

**原因：** 项目有两个服务入口：
- `bun run dev`（`scripts/dev-web-hmr.mjs`）→ Vite dev server at **port 5180**，支持 HMR
- 生产服务器 → `bun server/index.js --port 3000`，从 `dist/` 目录服务**构建产物**

用户访问的是 `localhost:3000`（构建产物），不是 `localhost:5180`（Vite dev server）。源码改动必须 `bun run build` 才能生效。

**教训：** 问清用户访问的端口。如果访问的是 `localhost:3000`（或任何非 5180 端口），改完代码后必须 build。

### 2. Edit 工具静默失败

**问题：** 多次 edit 调用返回 "Edit applied successfully" 但实际没生效（文件内容未变）。

**原因：** 可能是 `oldString` 匹配到了预期位置但实际编辑未持久化，或者多轮编辑中后续 edit 覆盖了前面的。

**教训：** 每次关键 edit 后必须用 `grep` 验证改动确实写入了文件。不要信任 "Edit applied successfully" 的返回值。

### 3. Vite HMR 对 workspace 包的局限

**问题：** 即使用 Vite dev server（port 5180），`packages/ui/src/` 的改动有时也不会热更新。

**原因：** Vite 的 HMR 对 workspace 内部包的文件监听不够可靠，尤其是新增 prop / 修改接口时。

**教训：** 如果 HMR 没反应，试硬刷新（Ctrl+Shift+R）。不行就重启 dev server（`dev-web-hmr.mjs` 会自动清 Vite 缓存）。最可靠的方式是 build。

### 4. `dev-web-hmr.mjs` 端口分配

**要点：**
- UI port 默认 `5180`（`OPENCHAMBER_HMR_UI_PORT`）
- API port 默认 `3902`（`OPENCHAMBER_HMR_API_PORT`）
- 脚本启动时会自动 `clearViteCache()` 删除 `node_modules/.vite`
- `electron:dev` 的端口是动态分配的（`findAvailablePort`），不固定

## 端口速查

| 端口 | 服务 | 用途 |
|------|------|------|
| 3000 | `bun server/index.js` | 生产构建，从 `dist/` 服务 |
| 5180 | Vite dev server | 开发用 HMR，从源码服务 |
| 3902 | API server (dev) | `dev-web-hmr.mjs` 启动的后端 |
