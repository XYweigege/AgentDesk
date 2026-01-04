## Vue3.5+Electron+大模型 跨平台 AI 桌面聊天应用实战

# VChat / 桌面 AI 聊天客户端

轻量且工程化的跨平台桌面聊天客户端，基于 Electron + Vue + Vite，支持多模型/多提供者插件式接入、会话管理与安全 IPC 通信。

**项目亮点**

- **跨平台桌面**：基于 Electron 与 Vite 构建，支持 Windows / macOS / Linux。
- **插件化模型接入**：抽象 `BaseProvider`，已实现 `OpenAIProvider` 与 `QianfanProvider`，方便接入更多模型。
- **安全通信**：通过 `preload.ts` 与 `ipc.ts` 最小化主进程与渲染进程的数据暴露，保护 API keys 与敏感信息。
- **工程化构建**：多套 Vite 配置与 `forge.config.ts` 支持开发、打包与分发流程。
- **国际化与配置化**：内置中英文支持（`locales/`），provider 可配置，利于本地化部署。

**技术栈**

- 渲染进程：Vue 3、Vite、TypeScript、Pinia、Tailwind CSS、Vue I18n
- 主进程：Electron、Electron Forge
- 模型接入：基于 Provider 抽象的插件化适配层（`src/providers/`）
- 本地持久化：Dexie（IndexedDB 封装，用于消息与会话离线存储）

**目录结构（简要）**

- `src/`：应用源码
  - `providers/`：模型提供者与适配器（如 `OpenAIProvider.ts`）
  - `stores/`：Pinia 状态管理（会话、消息、provider）
  - `components/`：可复用 UI 组件（`MessageList.vue`、`MessageInput.vue`）
  - `preload.ts`、`ipc.ts`：安全的主/渲染进程通信层
  - `main.ts`：Electron 主进程入口

**主要功能**

- 多模型/多提供者接入（插件式）
- 会话管理与本地消息持久化（基于 Dexie + IndexedDB）
- 安全的 IPC 层，隐藏敏感凭证
- 多语言支持（中/英）
- 可配置的 provider 列表与快速切换

**快速开始（开发）**

1. 安装依赖：

```bash
npm install
```

2. 本地开发（渲染进程热重载 + 主进程）：

```bash
npm run dev
```

3. 打包（示例）：

```bash
npm run make
```

（具体命令请检查 `package.json` 脚本以适配你的环境）

**关键文件**

- `src/providers/BaseProvider.ts`：Provider 抽象基类
- `src/providers/OpenAIProvider.ts`：OpenAI Provider 实现
- `src/preload.ts`：预加载脚本，暴露安全的 IPC 接口
- `src/ipc.ts`：IPC 通信封装
- `vite.*.config.ts` / `forge.config.ts`：构建与打包配置

**安全与隐私**

- 推荐将 API Key 存放在主进程或环境变量中，避免在渲染进程中明文存储。项目已通过 `preload.ts` 限制渲染进程可访问的接口。

**贡献与扩展**

- 接入新模型：实现 `BaseProvider` 并在 `config/providerConfig.ts` 中注册
- UI/主题：基于 Tailwind 可快速定制

**授权许可**

MIT
