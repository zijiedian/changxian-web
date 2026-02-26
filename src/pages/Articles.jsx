import { Link } from 'react-router-dom';

const ARTICLES = [
  {
    id: 'minimax-2026',
    title: 'MiniMax 公司介绍：最新模型与梯队判断',
    desc: '2026 年 2 月最新版：M2.5、M2.1、M1 与多模态矩阵解析。',
    date: '2026-02-25',
    category: '公司研究',
    tags: ['MiniMax', 'M2.5', '多模态'],
    read: '7 分钟',
    preset: 'minimax-2026',
    url: '/posts/minimax-2026',
  },
  {
    id: 'gemini-3-1-pro',
    title: 'Gemini 3.1 Pro 新模型：功能、对比与应用场景',
    desc: '科技杂志风信息卡片：核心能力、评测对比、Agentic、长上下文与安全评估。',
    date: '2026-02-19',
    category: '模型评测',
    tags: ['Gemini 3.1', '多模态', '长上下文'],
    read: '8 分钟',
    preset: 'gemini-3-1-pro',
    url: '/posts/gemini-3-1-pro',
  },
];

export default function Articles() {
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
                <Link to="/articles" className="rounded-full bg-brand px-4 py-2 text-white shadow-soft">
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

          <section className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-3 py-1 text-xs text-muted shadow-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                全部文章
              </div>
              <h1 className="mt-4 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
                查看你发布的所有图文与深度内容
              </h1>
              <p className="mt-4 text-sm text-muted sm:text-base">
                每篇文章都可以一键生成图文卡片，快速复用到公众号或社媒渠道。
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link to="/generator" className="rounded-full bg-brand px-5 py-2 text-xs font-semibold text-white shadow-soft">
                  去生成图文卡片
                </Link>
                <Link to="/about" className="rounded-full border border-gray-200 bg-white px-5 py-2 text-xs font-semibold text-ink">
                  了解我们
                </Link>
              </div>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-soft">
              <div className="text-xs font-semibold text-muted">内容统计</div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  { label: '已发布文章', value: `${ARTICLES.length} 篇` },
                  { label: '可生成卡片', value: `${ARTICLES.length} 篇` },
                  { label: '最新更新', value: ARTICLES[0]?.date || '—' },
                  { label: '内容类型', value: '评测 · 产品' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <div className="text-xs text-muted">{item.label}</div>
                    <div className="mt-2 text-sm font-semibold text-ink">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <section className="mt-12">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-ink">文章列表</h2>
              <p className="mt-1 text-sm text-muted">支持生成卡片与阅读全文。</p>
            </div>
            <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-muted">
              更新日期：2026-02-25
            </span>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {ARTICLES.map((article) => (
              <article key={article.id} className="flex min-h-[220px] flex-col justify-between rounded-3xl border border-gray-200 bg-white p-6 shadow-soft">
                <div>
                  <div className="text-xs text-muted">{article.date}</div>
                  <h3 className="mt-3 text-xl font-semibold text-ink">{article.title}</h3>
                  <p className="mt-3 text-sm text-muted">{article.desc}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-muted">
                    {article.category && (
                      <span className="rounded-full border border-brand/20 bg-brand/10 px-2 py-1 text-brand-dark">
                        {article.category}
                      </span>
                    )}
                    {(article.tags || []).map((tag) => (
                      <span key={tag} className="rounded-full border border-gray-200 bg-white px-2 py-1">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between text-xs text-muted">
                  <span>阅读时长：{article.read}</span>
                  <div className="flex items-center gap-3">
                    <Link to={`/generator?preset=${article.preset}`} className="font-semibold text-brand">
                      生成卡片 →
                    </Link>
                    <Link to={article.url} className="font-semibold text-muted">
                      阅读文章 →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
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
