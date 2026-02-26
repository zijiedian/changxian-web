import { Link } from 'react-router-dom';

export default function Profile() {
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
                      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
                  <Link to="/profile" className="rounded-full bg-brand px-4 py-2 text-white shadow-soft">
                    个人中心
                  </Link>
                )}
              </nav>
            </div>
          </header>

          <section className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-3xl border border-gray-200 bg-white/95 p-6 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-brand/10 p-[2px] ring-1 ring-brand/30 shadow-sm">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-brand/15">
                      <img src="/logo.png" alt="尝鲜AI" className="h-7 w-7 rounded-full object-contain drop-shadow-sm" />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted">当前账户</div>
                    <div className="mt-1 text-lg font-semibold text-ink">尝鲜AI 用户</div>
                  </div>
                </div>
                <span className="rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand-dark">
                  微信已登录
                </span>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { label: '余额', value: '¥ 0.00' },
                  { label: '本月使用', value: '0 次' },
                  { label: '累计生成', value: '0 项' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <div className="text-xs text-muted">{item.label}</div>
                    <div className="mt-2 text-sm font-semibold text-ink">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button className="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white shadow-soft">
                  充值
                </button>
                <button className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-ink">
                  查看账单
                </button>
                <button className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-ink">
                  管理绑定
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white/95 p-6 shadow-soft">
              <div className="text-xs font-semibold text-muted">使用统计</div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  { label: '生成卡片', value: '0' },
                  { label: '导出图片', value: '0' },
                  { label: '复制文本', value: '0' },
                  { label: '项目数量', value: '0' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <div className="text-xs text-muted">{item.label}</div>
                    <div className="mt-2 text-sm font-semibold text-ink">{item.value}</div>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="text-xs text-muted">本月活跃度</div>
                <div className="mt-3 flex items-center gap-2">
                  {Array.from({ length: 12 }).map((_, idx) => (
                    <div
                      key={`bar-${idx}`}
                      className="h-10 w-2 rounded-full bg-brand/20"
                      style={{ height: `${12 + idx * 2}px` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-3xl border border-gray-200 bg-white/95 p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted">使用记录</div>
                  <div className="mt-1 text-lg font-semibold text-ink">最近操作</div>
                </div>
                <button className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-ink">
                  导出记录
                </button>
              </div>
              <div className="mt-4 grid gap-3">
                {[
                  { title: '图文生成', time: '—', detail: '暂无记录' },
                  { title: '导出图片', time: '—', detail: '暂无记录' },
                  { title: 'AI 调整', time: '—', detail: '暂无记录' },
                ].map((item) => (
                  <div key={item.title} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4">
                    <div>
                      <div className="text-sm font-semibold text-ink">{item.title}</div>
                      <div className="mt-1 text-xs text-muted">{item.detail}</div>
                    </div>
                    <div className="text-xs text-muted">{item.time}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white/95 p-6 shadow-soft">
              <div className="text-xs font-semibold text-muted">充值套餐</div>
              <div className="mt-4 grid gap-3">
                {[
                  { title: '入门包', price: '¥ 29', desc: '适合轻量体验' },
                  { title: '标准包', price: '¥ 99', desc: '适合常规创作' },
                  { title: '团队包', price: '¥ 299', desc: '适合小团队协作' },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-ink">{item.title}</div>
                      <div className="text-sm font-semibold text-brand">{item.price}</div>
                    </div>
                    <div className="mt-2 text-xs text-muted">{item.desc}</div>
                  </div>
                ))}
              </div>
              <button className="mt-6 w-full rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white shadow-soft">
                选择并充值
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
