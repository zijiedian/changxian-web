import { Link } from 'react-router-dom';

export default function Home() {
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  return (
    <div className="min-h-screen bg-paper text-ink">
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 14s linear infinite; }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float-slow { animation: float-slow 9s ease-in-out infinite; }
      `}</style>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.12]">
          <svg
            viewBox="0 0 320 320"
            className="h-[520px] w-[520px] text-brand"
            role="img"
            aria-label="工具生态背景"
          >
            <defs>
              <linearGradient id="orbit-bg" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.08" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.35" />
              </linearGradient>
            </defs>
            <circle cx="160" cy="160" r="120" fill="none" stroke="url(#orbit-bg)" strokeWidth="2" />
            <circle cx="160" cy="160" r="80" fill="none" stroke="url(#orbit-bg)" strokeWidth="2" opacity="0.6" />
            <circle cx="160" cy="160" r="36" fill="currentColor" opacity="0.12" />
            <circle cx="160" cy="160" r="20" fill="currentColor" opacity="0.2" />
            <g className="origin-center animate-spin-slow">
              <circle cx="160" cy="40" r="10" fill="currentColor" />
              <circle cx="275" cy="160" r="8" fill="currentColor" opacity="0.8" />
              <circle cx="160" cy="280" r="7" fill="currentColor" opacity="0.6" />
              <circle cx="45" cy="160" r="9" fill="currentColor" opacity="0.7" />
            </g>
          </svg>
        </div>
        <div className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-brand/20 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-10 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <header className="rounded-2xl border border-gray-200 bg-white/90 px-4 py-3 shadow-soft backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-brand/10 p-[2px] ring-1 ring-brand/30 shadow-sm">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-brand/15">
                    <img src="/logo.png" alt="尝鲜AI" className="h-6 w-6 rounded-full object-contain drop-shadow-sm" />
                  </div>
                </div>
                <div className="text-base font-semibold text-ink">尝鲜AI</div>
              </div>
              <div className="sm:hidden">
                <details className="relative">
                  <summary className="list-none rounded-full border border-gray-200 bg-white p-2 text-ink shadow-soft">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span className="sr-only">菜单</span>
                  </summary>
                  <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-gray-200 bg-white p-2 text-xs shadow-soft">
                    <Link to="/" className="block rounded-xl px-3 py-2 font-semibold text-ink hover:bg-gray-50">
                      首页
                    </Link>
                    <div className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                      工具库
                    </div>
                    <Link to="/generator" className="block rounded-xl px-3 py-2 text-[11px] font-semibold text-ink hover:bg-gray-50">
                      图文生成
                    </Link>
                    <div className="px-3 py-1 text-[11px] text-muted">更多工具敬请期待</div>
                    <Link to="/articles" className="block rounded-xl px-3 py-2 text-[11px] font-semibold text-ink hover:bg-gray-50">
                      文章
                    </Link>
                    <Link to="/about" className="block rounded-xl px-3 py-2 text-[11px] font-semibold text-ink hover:bg-gray-50">
                      关于我们
                    </Link>
                    {!isLoggedIn && (
                      <Link to="/login" className="block rounded-xl px-3 py-2 text-[11px] font-semibold text-ink hover:bg-gray-50">
                        登录
                      </Link>
                    )}
                    {isLoggedIn && (
                      <Link to="/profile" className="block rounded-xl px-3 py-2 text-[11px] font-semibold text-ink hover:bg-gray-50">
                        个人中心
                      </Link>
                    )}
                  </div>
                </details>
              </div>
              <nav className="hidden flex-wrap items-center gap-3 text-xs font-semibold sm:flex">
                <Link to="/" className="rounded-full bg-brand px-4 py-2 text-white shadow-soft">
                  首页
                </Link>
                <div className="relative group">
                  <button type="button" className="px-3 py-2 text-muted transition hover:text-ink">
                    工具库
                  </button>
                  <div className="absolute left-0 top-full z-20 hidden min-w-[160px] rounded-2xl border border-gray-200 bg-white p-2 shadow-soft group-hover:block">
                    <Link
                      to="/generator"
                      className="block rounded-xl px-3 py-2 text-[11px] font-semibold text-ink transition hover:bg-gray-50"
                    >
                      图文生成
                    </Link>
                    <div className="px-3 py-2 text-[11px] text-muted">更多工具敬请期待</div>
                  </div>
                </div>
                <Link to="/articles" className="px-3 py-2 text-muted transition hover:text-ink">
                  文章
                </Link>
                <Link to="/about" className="px-3 py-2 text-muted transition hover:text-ink">
                  关于我们
                </Link>
                {!isLoggedIn && (
                  <Link to="/login" className="px-3 py-2 text-muted transition hover:text-ink">
                    登录
                  </Link>
                )}
                {isLoggedIn && (
                  <Link to="/profile" className="px-3 py-2 text-muted transition hover:text-ink">
                    个人中心
                  </Link>
                )}
              </nav>
            </div>
          </header>

          <section className="mt-10 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-3 py-1 text-xs text-muted shadow-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                多工具平台 · AIGC 行业观察
              </div>
              <h1 className="mt-4 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
                尝鲜AI：围绕内容生产的
                <span className="text-brand">多工具创作平台</span>
              </h1>
              <p className="mt-4 text-sm text-muted sm:text-base">
                聚焦 AIGC 行业观察与内容发布。支持图文生成、项目预览、文章管理，并将持续扩展更多工具。
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  to="/generator"
                  className="rounded-full bg-brand px-5 py-2 text-xs font-semibold text-white shadow-soft"
                >
                  进入工具库
                </Link>
                <Link
                  to="/articles"
                  className="rounded-full border border-gray-200 bg-white px-5 py-2 text-xs font-semibold text-ink"
                >
                  查看文章
                </Link>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  { title: '图文生成', desc: '提示词驱动，一键生成卡片' },
                  { title: '文章管理', desc: '统一管理发布内容' },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-gray-200 bg-white/90 p-3 text-xs text-muted shadow-soft"
                  >
                    <p className="text-sm font-semibold text-ink">{item.title}</p>
                    <p className="mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:block" />
          </section>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <section id="tools" className="mt-12">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-ink">工具矩阵</h2>
              <p className="mt-1 text-sm text-muted">覆盖内容生产与发布的关键流程。</p>
            </div>
            <Link to="/generator" className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-muted">
              进入工具库 →
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: '图文生成', desc: '多风格提示词驱动输出', status: '已上线', link: '/generator' },
              { title: '文章管理', desc: '统一查看与发布内容', status: '已上线', link: '/articles' },
              { title: '更多工具', desc: '持续扩展中', status: '规划中', link: '/about' },
            ].map((item) => (
              <div
                key={item.title}
                className="flex h-full flex-col justify-between rounded-3xl border border-gray-200 bg-white p-5 shadow-soft"
              >
                <div>
                  <div className="text-xs text-muted">{item.status}</div>
                  <div className="mt-2 text-base font-semibold text-ink">{item.title}</div>
                  <p className="mt-2 text-sm text-muted">{item.desc}</p>
                </div>
                <Link to={item.link} className="mt-6 text-xs font-semibold text-brand">
                  了解更多 →
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section id="articles" className="mt-12">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-ink">最新文章</h2>
              <p className="mt-1 text-sm text-muted">精选内容与最新发布动态。</p>
            </div>
            <Link to="/articles" className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-muted">
              查看全部文章 →
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-[1.3fr_0.7fr]">
            <article className="flex min-h-[220px] flex-col justify-between rounded-3xl border border-gray-200 bg-white p-6 shadow-soft">
              <div>
                <div className="text-xs text-muted">2026-02-19 · 深度评测</div>
                <h3 className="mt-3 text-xl font-semibold text-ink">
                  Gemini 3.1 Pro 新模型：功能、对比与应用场景
                </h3>
                <p className="mt-3 text-sm text-muted">
                  科技杂志风信息卡片：核心能力、评测对比、Agentic、长上下文与安全评估。
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between text-xs text-muted">
                <span>阅读时长：8 分钟</span>
                <div className="flex items-center gap-3">
                  <Link to="/generator?preset=gemini-3-1-pro" className="font-semibold text-brand">
                    生成卡片 →
                  </Link>
                  <Link to="/posts/gemini-3-1-pro" className="font-semibold text-muted">
                    阅读文章 →
                  </Link>
                </div>
              </div>
            </article>
            <article className="flex min-h-[220px] flex-col justify-between rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-soft">
              <div>
                <div className="text-xs text-muted">2026-02-25 · 公司研究</div>
                <h3 className="mt-3 text-lg font-semibold text-ink">MiniMax 公司介绍：最新模型与梯队判断</h3>
                <p className="mt-3 text-sm text-muted">M2.5、M2.1、M1 与多模态矩阵解析。</p>
              </div>
              <div className="mt-6 flex items-center justify-between text-xs text-muted">
                <span>阅读时长：7 分钟</span>
                <div className="flex items-center gap-3">
                  <Link to="/generator?preset=minimax-2026" className="font-semibold text-brand">
                    生成卡片 →
                  </Link>
                  <Link to="/posts/minimax-2026" className="font-semibold text-muted">
                    阅读文章 →
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>

      <footer className="border-t border-gray-200 bg-white/80">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-brand/10 p-[2px] ring-1 ring-brand/30 shadow-sm">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-brand/15">
                  <img src="/logo.png" alt="尝鲜AI" className="h-5 w-5 rounded-full object-contain drop-shadow-sm" />
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-ink">尝鲜AI</div>
                <div className="text-xs text-muted">专注于对 AIGC 行业的观察和分享。</div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
            <span>© 2026 子节点科技</span>
            <span>关注公众号：尝鲜AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
