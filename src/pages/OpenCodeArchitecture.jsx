import SiteFooter from '../components/SiteFooter.jsx';
import SiteHeader from '../components/SiteHeader.jsx';

const STACK_SECTIONS = [
  {
    title: '前端与交互层',
    items: ['SolidJS + Vite（Web App）', 'Tauri（Desktop）', 'Bun CLI（终端入口）', 'SSE / WebSocket 实时事件'],
  },
  {
    title: '服务与编排层',
    items: ['Bun Runtime', 'Hono API Server', 'Session Loop / Stream Processor', 'Tool Registry + Permission Gate'],
  },
  {
    title: '模型与扩展层',
    items: ['Vercel AI SDK', '多 Provider 适配（OpenAI/Anthropic/Google 等）', 'MCP 与 Plugin 扩展', 'OpenAPI + JS SDK 生成'],
  },
  {
    title: '状态与数据层',
    items: ['SQLite（Drizzle）', 'Session/Message/Snapshot', 'Config/Agent/Permission 持久化', 'Bus Event 事件总线'],
  },
];

const DIRECTORY_ITEMS = [
  {
    path: 'packages/opencode/src/index.ts',
    desc: 'CLI 总入口：命令注册、日志初始化、一次性数据迁移触发。',
  },
  {
    path: 'packages/opencode/src/server/server.ts',
    desc: '服务端核心：挂载路由、CORS/Auth、中间件与 OpenAPI 描述。',
  },
  {
    path: 'packages/opencode/src/server/routes/session.ts',
    desc: '会话 API：创建、消息流、状态查询、回滚与权限交互。',
  },
  {
    path: 'packages/opencode/src/session/prompt.ts',
    desc: 'Agent 主循环：组装上下文、调用 LLM、驱动工具调用与迭代。',
  },
  {
    path: 'packages/opencode/src/session/processor.ts',
    desc: '流处理器：消费模型流式事件并落库，维护 tool state 与状态机。',
  },
  {
    path: 'packages/opencode/src/tool/registry.ts',
    desc: '工具注册中心：内置工具 + 插件工具统一装配与过滤。',
  },
  {
    path: 'packages/opencode/src/permission/next.ts',
    desc: '权限引擎：ask / allow / deny 决策、规则匹配与审批状态管理。',
  },
  {
    path: 'packages/opencode/src/provider/provider.ts',
    desc: '模型供应商抽象层：多平台模型加载、鉴权与参数适配。',
  },
  {
    path: 'packages/app/src',
    desc: 'Web 前端：会话、输入、流式渲染、配置与状态管理 UI。',
  },
  {
    path: 'packages/sdk/js/script/build.ts',
    desc: 'SDK 生成：从 OpenAPI 构建 JS 客户端，给二次集成使用。',
  },
];

const FRONTEND_COMPONENTS = [
  {
    name: 'CLI Shell',
    path: 'packages/opencode/src/index.ts',
    desc: '统一接收用户命令并启动本地 Agent 会话或服务模式。',
  },
  {
    name: 'Web App',
    path: 'packages/app/src/pages/session',
    desc: '提供会话主界面，承载消息流、工具状态与交互控制。',
  },
  {
    name: 'Prompt Input',
    path: 'packages/app/src/components/prompt-input',
    desc: '把文本、文件、指令装配成标准化 Prompt 结构。',
  },
  {
    name: 'Session Timeline',
    path: 'packages/app/src/components/session',
    desc: '按事件序列渲染 reasoning、tool-call、tool-result 等过程。',
  },
  {
    name: 'Desktop Container',
    path: 'packages/desktop',
    desc: '通过 Tauri 封装跨平台桌面壳，复用同一会话接口。',
  },
];

const BACKEND_COMPONENTS = [
  {
    name: 'Hono API Server',
    path: 'packages/opencode/src/server/server.ts',
    desc: '暴露 REST + SSE + WS 接口并托管会话生命周期。',
  },
  {
    name: 'Session Orchestrator',
    path: 'packages/opencode/src/session/prompt.ts',
    desc: '负责上下文聚合、循环控制、模型调用节奏与终止条件。',
  },
  {
    name: 'Stream Processor',
    path: 'packages/opencode/src/session/processor.ts',
    desc: '消费模型流事件并持续写入 message parts 与运行状态。',
  },
  {
    name: 'Tool Registry',
    path: 'packages/opencode/src/tool/registry.ts',
    desc: '统一注册内置/插件工具并按模型与开关动态裁剪。',
  },
  {
    name: 'PermissionNext',
    path: 'packages/opencode/src/permission/next.ts',
    desc: '在高风险动作前执行规则匹配并触发“询问/拒绝/放行”。',
  },
  {
    name: 'Provider Adapter',
    path: 'packages/opencode/src/provider/provider.ts',
    desc: '屏蔽多模型平台差异，提供一致的 streamText 能力。',
  },
  {
    name: 'State & Storage',
    path: 'packages/opencode/src/storage',
    desc: '持久化 session/message/permission，支撑恢复与回溯。',
  },
];

const CORE_COMPONENTS = [
  {
    name: 'Agent',
    text: '定义不同模式（primary/subagent）与默认权限策略，决定“谁来干活”。',
  },
  {
    name: 'SessionPrompt.loop',
    text: '核心执行循环，负责把“用户意图”变成“模型决策 + 工具动作”。',
  },
  {
    name: 'LLM.stream',
    text: '把系统提示词、会话历史、工具定义合并后进行流式推理。',
  },
  {
    name: 'SessionProcessor',
    text: '将 stream 事件映射为可追踪的状态片段，保证过程可观测。',
  },
  {
    name: 'ToolRegistry',
    text: '统一管理工具生命周期，支持插件与自定义工具扩展。',
  },
  {
    name: 'PermissionNext.ask',
    text: '针对敏感操作做运行时授权，降低 agent 自动执行风险。',
  },
  {
    name: 'Bus Event',
    text: '向 UI/外部订阅者广播实时事件，形成“控制面 + 数据面”解耦。',
  },
  {
    name: 'SDK Build',
    text: '把服务端 OpenAPI 能力导出为客户端 SDK，便于系统对接。',
  },
];

function ArchitectureDiagram() {
  return (
    <svg viewBox="0 0 1160 560" className="h-auto w-full" role="img" aria-label="OpenCode 架构图">
      <defs>
        <linearGradient id="ocBox" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ecfdf3" />
          <stop offset="100%" stopColor="#d8f7e7" />
        </linearGradient>
        <linearGradient id="ocCore" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#07c160" />
          <stop offset="100%" stopColor="#18b27b" />
        </linearGradient>
        <marker id="ocArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#4a6a5f" />
        </marker>
      </defs>

      <rect x="20" y="22" width="1118" height="516" rx="26" fill="#ffffff" opacity="0.74" />

      <rect x="70" y="80" width="260" height="160" rx="22" fill="url(#ocBox)" stroke="#9eeac2" />
      <text x="94" y="112" fontSize="20" fill="#1f3b2f" fontWeight="700">前端入口</text>
      <text x="94" y="140" fontSize="15" fill="#355c4e">CLI / Web / Desktop</text>
      <text x="94" y="164" fontSize="15" fill="#355c4e">Prompt 输入与状态渲染</text>
      <text x="94" y="188" fontSize="15" fill="#355c4e">SSE / WebSocket 订阅</text>

      <rect x="70" y="312" width="260" height="160" rx="22" fill="url(#ocBox)" stroke="#9eeac2" />
      <text x="94" y="344" fontSize="20" fill="#1f3b2f" fontWeight="700">控制与扩展</text>
      <text x="94" y="372" fontSize="15" fill="#355c4e">MCP / Plugin / Skill</text>
      <text x="94" y="396" fontSize="15" fill="#355c4e">自定义 Tool & Workflow</text>
      <text x="94" y="420" fontSize="15" fill="#355c4e">SDK 对外集成</text>

      <rect x="430" y="80" width="320" height="392" rx="26" fill="url(#ocCore)" />
      <text x="454" y="120" fontSize="24" fill="#ffffff" fontWeight="700">Agent Runtime Core</text>
      <text x="454" y="158" fontSize="16" fill="#ecffef">SessionPrompt.loop</text>
      <text x="454" y="186" fontSize="16" fill="#ecffef">LLM.stream / ProviderTransform</text>
      <text x="454" y="214" fontSize="16" fill="#ecffef">SessionProcessor</text>
      <text x="454" y="242" fontSize="16" fill="#ecffef">ToolRegistry</text>
      <text x="454" y="270" fontSize="16" fill="#ecffef">PermissionNext</text>
      <text x="454" y="298" fontSize="16" fill="#ecffef">SessionSummary / Compaction</text>
      <text x="454" y="326" fontSize="16" fill="#ecffef">Bus Event</text>
      <text x="454" y="354" fontSize="16" fill="#ecffef">Config / Agent / Instance</text>

      <rect x="850" y="80" width="250" height="160" rx="22" fill="url(#ocBox)" stroke="#9eeac2" />
      <text x="874" y="112" fontSize="20" fill="#1f3b2f" fontWeight="700">模型层</text>
      <text x="874" y="140" fontSize="15" fill="#355c4e">OpenAI / Anthropic</text>
      <text x="874" y="164" fontSize="15" fill="#355c4e">Google / Bedrock / xAI</text>
      <text x="874" y="188" fontSize="15" fill="#355c4e">统一 streamText 抽象</text>

      <rect x="850" y="312" width="250" height="160" rx="22" fill="url(#ocBox)" stroke="#9eeac2" />
      <text x="874" y="344" fontSize="20" fill="#1f3b2f" fontWeight="700">数据层</text>
      <text x="874" y="372" fontSize="15" fill="#355c4e">SQLite + Drizzle</text>
      <text x="874" y="396" fontSize="15" fill="#355c4e">Session / Message / Snapshot</text>
      <text x="874" y="420" fontSize="15" fill="#355c4e">Permission / Config</text>

      <path d="M 332 160 L 426 160" stroke="#4a6a5f" strokeWidth="3" markerEnd="url(#ocArrow)" />
      <path d="M 332 392 L 426 330" stroke="#4a6a5f" strokeWidth="3" markerEnd="url(#ocArrow)" />
      <path d="M 752 160 L 846 160" stroke="#4a6a5f" strokeWidth="3" markerEnd="url(#ocArrow)" />
      <path d="M 752 356 L 846 392" stroke="#4a6a5f" strokeWidth="3" markerEnd="url(#ocArrow)" />
      <path d="M 846 430 L 754 430" stroke="#4a6a5f" strokeWidth="2.5" markerEnd="url(#ocArrow)" />
    </svg>
  );
}

function SessionFlowDiagram() {
  return (
    <svg viewBox="0 0 1320 320" className="h-auto w-full" role="img" aria-label="OpenCode 会话主循环流程图">
      <defs>
        <linearGradient id="ocFlow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f3fef7" />
          <stop offset="100%" stopColor="#e6f9ee" />
        </linearGradient>
        <marker id="ocFlowArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#3d5c51" />
        </marker>
      </defs>

      {[
        { x: 30, title: '1. 输入归一', text: '用户消息 / 文件 / Agent 指令' },
        { x: 250, title: '2. 上下文装配', text: 'SystemPrompt + 历史 + 工具定义' },
        { x: 470, title: '3. LLM Stream', text: 'streamText 推理 + tool call' },
        { x: 690, title: '4. 工具执行', text: 'ToolRegistry + PermissionNext' },
        { x: 910, title: '5. 事件落库', text: 'SessionProcessor 写入 parts' },
        { x: 1130, title: '6. 返回 UI', text: 'SSE/WS 增量更新 + 完成' },
      ].map((item) => (
        <g key={item.title}>
          <rect x={item.x} y="70" width="180" height="138" rx="20" fill="url(#ocFlow)" stroke="#a6e9c8" />
          <text x={item.x + 16} y="114" fontSize="18" fill="#1f3b2f" fontWeight="700">{item.title}</text>
          <text x={item.x + 16} y="146" fontSize="13" fill="#3d5c51">{item.text}</text>
        </g>
      ))}

      {[190, 410, 630, 850, 1070].map((x) => (
        <path key={x} d={`M ${x} 138 L ${x + 54} 138`} stroke="#3d5c51" strokeWidth="2.5" markerEnd="url(#ocFlowArrow)" />
      ))}

      <path d="M 1218 228 Q 1218 280 650 280 Q 80 280 80 228" fill="none" stroke="#78b798" strokeWidth="2.5" strokeDasharray="8 8" markerEnd="url(#ocFlowArrow)" />
      <text x="530" y="302" fontSize="13" fill="#44665a">若仍有待处理 Tool / Step，循环回到步骤 2 继续执行</text>
    </svg>
  );
}

function BoundaryDiagram() {
  return (
    <svg viewBox="0 0 1080 420" className="h-auto w-full" role="img" aria-label="前后端边界图">
      <defs>
        <linearGradient id="ocFe" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f5fff8" />
          <stop offset="100%" stopColor="#e8fdf1" />
        </linearGradient>
        <linearGradient id="ocBe" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e9fdf2" />
          <stop offset="100%" stopColor="#d8f8e7" />
        </linearGradient>
        <marker id="ocBoundaryArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#47685c" />
        </marker>
      </defs>

      <rect x="24" y="20" width="1032" height="380" rx="26" fill="#ffffff" opacity="0.74" />
      <rect x="64" y="66" width="438" height="286" rx="24" fill="url(#ocFe)" stroke="#a4e6c4" />
      <rect x="578" y="66" width="438" height="286" rx="24" fill="url(#ocBe)" stroke="#8de2b6" />

      <text x="88" y="108" fontSize="22" fontWeight="700" fill="#1d3a2e">Frontend Responsibility</text>
      <text x="88" y="138" fontSize="15" fill="#355c4e">输入采集 · 状态呈现 · 交互确认 · 会话可视化</text>
      <text x="88" y="172" fontSize="14" fill="#355c4e">- Prompt 编辑器与附件选择</text>
      <text x="88" y="198" fontSize="14" fill="#355c4e">- 逐 token/逐事件渲染</text>
      <text x="88" y="224" fontSize="14" fill="#355c4e">- 工具执行态与审批弹窗</text>
      <text x="88" y="250" fontSize="14" fill="#355c4e">- 会话历史与摘要视图</text>

      <text x="602" y="108" fontSize="22" fontWeight="700" fill="#1d3a2e">Backend Responsibility</text>
      <text x="602" y="138" fontSize="15" fill="#355c4e">推理编排 · 安全网关 · 工具执行 · 数据持久化</text>
      <text x="602" y="172" fontSize="14" fill="#355c4e">- Session loop 与上下文管理</text>
      <text x="602" y="198" fontSize="14" fill="#355c4e">- Provider 适配与 token/cost 统计</text>
      <text x="602" y="224" fontSize="14" fill="#355c4e">- Permission 决策与审批状态</text>
      <text x="602" y="250" fontSize="14" fill="#355c4e">- Message/Snapshot 持久化</text>

      <path d="M 504 208 L 574 208" stroke="#47685c" strokeWidth="3" markerEnd="url(#ocBoundaryArrow)" />
      <path d="M 574 238 L 504 238" stroke="#47685c" strokeWidth="3" markerEnd="url(#ocBoundaryArrow)" />
      <text x="502" y="196" fontSize="12" fill="#355c4e">HTTP/SSE/WS</text>
      <text x="502" y="274" fontSize="12" fill="#355c4e">指令下发 / 状态回传</text>
    </svg>
  );
}

function Chip({ children }) {
  return (
    <span className="rounded-full border border-brand/20 bg-brand/10 px-2.5 py-1 text-[11px] font-semibold text-brand-dark">
      {children}
    </span>
  );
}

export default function OpenCodeArchitecture() {
  return (
    <div className="min-h-screen flex flex-col text-ink">
      <div className="relative flex-1 overflow-hidden">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-brand/20 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-10 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />

        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <SiteHeader active="articles" />

          <article className="mt-8 space-y-6">
            <section className="theme-gradient-border rounded-3xl shadow-soft">
              <div className="glass-card rounded-3xl p-6 sm:p-8">
                <div className="flex flex-wrap gap-2 text-xs">
                  <Chip>Agent Code</Chip>
                  <Chip>架构拆解</Chip>
                  <Chip>OpenCode</Chip>
                </div>
                <h1 className="mt-4 text-2xl font-semibold leading-tight text-ink sm:text-4xl">
                  OpenCode 项目全景拆解：
                  <span className="theme-gradient-text">从技术栈到 Agent 执行内核</span>
                </h1>
                <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
                  这篇文章基于 OpenCode 仓库 dev 分支源码做静态分析，重点回答三个问题：
                  1）工程技术栈怎么拼出来；2）目录与模块怎么协作；3）Agent Code 在运行时如何做“推理-工具-权限-回写”的闭环。
                </p>
                <div className="mt-5 grid gap-3 text-xs text-muted sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/70 bg-white/75 p-3">
                    <div className="text-[10px] uppercase tracking-[0.2em]">分析日期</div>
                    <div className="mt-1 font-semibold text-ink">2026-02-28</div>
                  </div>
                  <div className="rounded-2xl border border-white/70 bg-white/75 p-3">
                    <div className="text-[10px] uppercase tracking-[0.2em]">源码基线</div>
                    <div className="mt-1 font-semibold text-ink">dev@2a208223</div>
                  </div>
                  <div className="rounded-2xl border border-white/70 bg-white/75 p-3">
                    <div className="text-[10px] uppercase tracking-[0.2em]">仓库地址</div>
                    <a
                      href="https://github.com/anomalyco/opencode/tree/dev"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-flex font-semibold text-brand hover:underline"
                    >
                      github.com/anomalyco/opencode
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <section className="glass-card rounded-3xl p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-ink sm:text-xl">1) 技术栈速览</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {STACK_SECTIONS.map((section) => (
                  <div key={section.title} className="rounded-2xl border border-white/70 bg-white/70 p-4">
                    <h3 className="text-sm font-semibold text-ink">{section.title}</h3>
                    <ul className="mt-2 space-y-1.5 text-xs text-muted sm:text-sm">
                      {section.items.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section className="glass-card rounded-3xl p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-ink sm:text-xl">2) 项目目录与模块职责</h2>
              <p className="mt-2 text-sm text-muted">把核心路径抽出来看，会更容易理解 OpenCode 的边界与扩展点。</p>
              <div className="mt-4 grid gap-3">
                {DIRECTORY_ITEMS.map((item) => (
                  <div key={item.path} className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3">
                    <div className="font-mono text-[11px] text-brand-dark">{item.path}</div>
                    <p className="mt-1 text-sm text-muted">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="glass-card rounded-3xl p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-ink sm:text-xl">3) 整体架构图（SVG）</h2>
              <p className="mt-2 text-sm text-muted">前端入口、运行内核、模型层和数据层四块形成闭环，核心是中间的 Agent Runtime Core。</p>
              <div className="mt-4 overflow-hidden rounded-2xl border border-white/70 bg-white p-2 sm:p-4">
                <ArchitectureDiagram />
              </div>
            </section>

            <section className="glass-card rounded-3xl p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-ink sm:text-xl">4) Agent 主循环流程图（SVG）</h2>
              <p className="mt-2 text-sm text-muted">你可以把它理解成一个“可中断、可审批、可持续回写状态”的迭代状态机。</p>
              <div className="mt-4 overflow-x-auto rounded-2xl border border-white/70 bg-white p-2 sm:p-4">
                <div className="min-w-[920px]">
                  <SessionFlowDiagram />
                </div>
              </div>
            </section>

            <section className="glass-card rounded-3xl p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-ink sm:text-xl">5) 前后端边界划分（SVG）</h2>
              <p className="mt-2 text-sm text-muted">前端做体验与控制，后端做编排与执行；通过 HTTP / SSE / WS 建立双向信息回路。</p>
              <div className="mt-4 overflow-hidden rounded-2xl border border-white/70 bg-white p-2 sm:p-4">
                <BoundaryDiagram />
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <div className="glass-card rounded-3xl p-5 sm:p-6">
                <h2 className="text-lg font-semibold text-ink">6) 前端组件一句话说明</h2>
                <div className="mt-4 space-y-3">
                  {FRONTEND_COMPONENTS.map((item) => (
                    <div key={item.name} className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-ink">{item.name}</h3>
                        <span className="font-mono text-[10px] text-muted">{item.path}</span>
                      </div>
                      <p className="mt-1 text-sm text-muted">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-3xl p-5 sm:p-6">
                <h2 className="text-lg font-semibold text-ink">7) 后端组件一句话说明</h2>
                <div className="mt-4 space-y-3">
                  {BACKEND_COMPONENTS.map((item) => (
                    <div key={item.name} className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-ink">{item.name}</h3>
                        <span className="font-mono text-[10px] text-muted">{item.path}</span>
                      </div>
                      <p className="mt-1 text-sm text-muted">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="glass-card rounded-3xl p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-ink sm:text-xl">8) Agent Code 设计要点拆解</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {CORE_COMPONENTS.map((item) => (
                  <div key={item.name} className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3">
                    <h3 className="text-sm font-semibold text-ink">{item.name}</h3>
                    <p className="mt-1 text-sm text-muted">{item.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-brand/20 bg-brand/10 p-4 text-sm text-brand-dark">
                关键理解：OpenCode 并不是“单次问答调用”，而是把模型推理、工具执行、权限审批、状态持久化和前端回显做成了统一运行时。
              </div>
            </section>
          </article>
        </div>
      </div>

      <SiteFooter maxWidthClass="max-w-6xl" followText="关注公众号：尝鲜AI / 甜甜圈攻防" />
    </div>
  );
}
