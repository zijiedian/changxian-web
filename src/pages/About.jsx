import { Link } from 'react-router-dom';

export default function About() {
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="relative overflow-hidden">
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
                      博客
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
                <Link to="/" className="px-3 py-2 text-muted transition hover:text-ink">
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
                  博客
                </Link>
              <Link to="/about" className="rounded-full bg-brand px-4 py-2 text-white shadow-soft">
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

          <section className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-3 py-1 text-xs text-muted shadow-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                关于尝鲜AI
              </div>
              <h1 className="mt-4 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
                把文章变成可直接发布的图文卡片
              </h1>
              <p className="mt-4 text-sm text-muted sm:text-base">
                尝鲜AI 专注于对 AIGC 行业的观察和分享。
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  { title: '一键生成', desc: '提示词 + 正文内容即可生成多张卡片。' },
                  { title: '直观预览', desc: '项目预览中快速检查并调优效果。' },
                  { title: '发布友好', desc: '复制文案、导出图片，覆盖公众号发布流程。' },
                  { title: '持续更新', desc: '围绕真实内容场景优化体验与样式。' },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-gray-200 bg-white/90 p-4 text-xs text-muted shadow-soft">
                    <p className="text-sm font-semibold text-ink">{item.title}</p>
                    <p className="mt-2">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-soft">
              <div className="text-xs font-semibold text-muted">关注公众号</div>
              <h2 className="mt-3 text-xl font-semibold text-ink">关注「尝鲜AI」获取最新动态</h2>
              <p className="mt-3 text-sm text-muted">
                搜索公众号「尝鲜AI」，获取新功能发布、设计灵感与实战案例。
              </p>
              <div className="mt-6 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-xs text-muted">
                <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-2xl bg-white p-2 shadow-soft">
                  <img src="/wechat-qrcode.jpg" alt="尝鲜AI 公众号二维码" className="h-full w-full object-contain" />
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
                <span className="rounded-full border border-brand/20 bg-brand/10 px-3 py-2 font-semibold text-brand-dark">
                  公众号：尝鲜AI
                </span>
                <span className="text-muted">打开微信搜索即可关注</span>
              </div>
            </div>
          </section>
        </div>
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
