import { useState } from 'react';
import { Link } from 'react-router-dom';

const ARTICLES = [
  {
    id: 'ai-security-c2',
    title: 'AI安全：开源与闭源 C2 框架全景',
    desc: '聚焦生态、能力与治理的安全视角分析，并附公开截图与 GitHub 链接。',
    date: '2026-02-27',
    category: '安全研究',
    channel: 'AI安全',
    tags: ['C2', 'AI安全', '红队', '治理'],
    read: '9 分钟',
    preset: 'ai-security-c2',
    url: '/posts/ai-security-c2',
  },
  {
    id: 'minimax-2026',
    title: 'MiniMax 公司介绍：最新模型与梯队判断',
    desc: '2026 年 2 月最新版：M2.5、M2.1、M1 与多模态矩阵解析。',
    date: '2026-02-25',
    category: '公司研究',
    channel: 'AI编程',
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
    channel: 'AI编程',
    tags: ['Gemini 3.1', '多模态', '长上下文'],
    read: '8 分钟',
    preset: 'gemini-3-1-pro',
    url: '/posts/gemini-3-1-pro',
  },
];

export default function Articles() {
  const isLoggedIn = Boolean(localStorage.getItem('token'));
  const [activeCategory, setActiveCategory] = useState('全部');
  const categories = ['全部', 'AI绘画', 'AI编程', 'AI安全'];
  const filteredArticles =
    activeCategory === '全部'
      ? ARTICLES
      : ARTICLES.filter((article) => article.channel === activeCategory);
  const featured = filteredArticles[0];
  const rest = filteredArticles.slice(1);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-brand/20 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-10 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 xl:px-10">
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
                <Link to="/articles" className="rounded-full bg-brand px-4 py-2 text-white shadow-soft">
                  博客
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

          <section className="mt-12 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 xl:gap-16">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-3 py-1 text-xs text-muted shadow-soft">
                尝鲜AI 博客
              </div>
              <h1 className="mt-4 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
                AIGC 博客与模型观察
              </h1>
              <p className="mt-4 text-sm text-muted sm:text-base">
                这里收录所有深度文章与行业观察，每篇内容都可一键生成图文卡片，便于发布到公众号或社媒渠道。
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link to="/generator" className="rounded-full bg-brand px-5 py-2 text-xs font-semibold text-white shadow-soft">
                  去生成图文卡片
                </Link>
                <Link
                  to={featured?.url || '/articles'}
                  className="rounded-full border border-gray-200 bg-white px-5 py-2 text-xs font-semibold text-ink"
                >
                  阅读最新博客
                </Link>
              </div>
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-brand/25 via-white to-transparent p-[1px] shadow-soft">
              <div className="rounded-3xl border border-gray-200 bg-white/90 p-6 lg:p-8">
                <div className="text-xs font-semibold uppercase tracking-widest text-muted">博客栏目</div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {['AI安全', 'AI编程', 'AI绘画', '行业观察'].map((item) => (
                    <div key={item} className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs text-muted">
                      <div className="font-semibold text-ink">{item}</div>
                      <div className="mt-1 text-[11px] text-muted">持续更新</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    { label: '已发布博客', value: `${ARTICLES.length} 篇` },
                    { label: '可生成卡片', value: `${ARTICLES.length} 篇` },
                    { label: '最新更新', value: ARTICLES[0]?.date || '—' },
                    { label: '内容类型', value: '安全 · 编程 · 绘画' },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-gray-100 bg-white p-4">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-muted">{item.label}</div>
                      <div className="mt-2 text-sm font-semibold text-ink">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 xl:px-10">
        <section className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-ink">分类浏览</h2>
              <p className="mt-1 text-xs text-muted">快速切换 AI 安全、编程与绘画内容。</p>
            </div>
            <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-muted">
              当前：{activeCategory}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((item) => {
              const active = activeCategory === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setActiveCategory(item)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                    active ? 'bg-brand text-white shadow-soft' : 'border border-gray-200 bg-white text-muted hover:text-ink'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-12">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-ink">精选博客</h2>
              <p className="mt-1 text-sm text-muted">支持生成卡片与阅读全文。</p>
            </div>
            <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-muted">
              更新日期：2026-02-25
            </span>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.6fr] xl:grid-cols-[1.5fr_0.5fr]">
            <div className="space-y-4">
              {filteredArticles.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-muted">
                  当前分类暂无内容，欢迎切换其它分类查看。
                </div>
              ) : (
                <>
                  {featured && (
                    <article className="rounded-3xl bg-gradient-to-br from-brand/20 via-white to-transparent p-[1px] shadow-soft">
                      <div className="flex min-h-[240px] flex-col justify-between rounded-3xl border border-gray-200 bg-white p-6">
                        <div>
                          <div className="text-xs text-muted">
                            {featured.date} · {featured.category}
                          </div>
                          <h3 className="mt-3 text-2xl font-semibold text-ink">{featured.title}</h3>
                          <p className="mt-3 text-sm text-muted">{featured.desc}</p>
                          <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-muted">
                            {featured.category && (
                              <span className="rounded-full border border-brand/20 bg-brand/10 px-2 py-1 text-brand-dark">
                                {featured.category}
                              </span>
                            )}
                            {(featured.tags || []).map((tag) => (
                              <span key={tag} className="rounded-full border border-gray-200 bg-white px-2 py-1">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="mt-6 flex items-center justify-between text-xs text-muted">
                          <span>阅读时长：{featured.read}</span>
                          <div className="flex items-center gap-3">
                            <Link to={`/generator?preset=${featured.preset}`} className="font-semibold text-brand">
                              生成卡片 →
                            </Link>
                            <Link to={featured.url} className="font-semibold text-muted">
                              阅读博客 →
                            </Link>
                          </div>
                        </div>
                      </div>
                    </article>
                  )}
                  <div className="grid gap-3 md:grid-cols-2">
                    {rest.map((article) => (
                      <article
                        key={article.id}
                        className="flex flex-col justify-between rounded-3xl border border-gray-200 bg-white p-5 shadow-soft"
                      >
                        <div>
                          <div className="text-xs text-muted">
                            {article.date} · {article.category}
                          </div>
                          <h3 className="mt-3 text-lg font-semibold text-ink">{article.title}</h3>
                          <p className="mt-3 text-sm text-muted">{article.desc}</p>
                        </div>
                        <div className="mt-5 flex items-center justify-between text-xs text-muted">
                          <span>阅读时长：{article.read}</span>
                          <div className="flex items-center gap-3">
                            <Link to={`/generator?preset=${article.preset}`} className="font-semibold text-brand">
                              生成卡片 →
                            </Link>
                            <Link to={article.url} className="font-semibold text-muted">
                              阅读博客 →
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              )}
            </div>
            <aside className="space-y-4">
              <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-soft">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">快捷入口</h3>
                <div className="mt-4 grid gap-3 text-xs">
                  <Link to="/generator" className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 font-semibold text-ink">
                    图文生成
                  </Link>
                  <Link to="/about" className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 font-semibold text-ink">
                    关于我们
                  </Link>
                </div>
              </div>
              <div className="rounded-3xl border border-gray-200 bg-[#f2efe9] p-5 shadow-soft">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">热门标签</h3>
                <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold text-muted">
                  {Array.from(new Set(ARTICLES.flatMap((article) => article.tags || []))).map((tag) => (
                    <span key={tag} className="rounded-full border border-black/10 bg-white px-3 py-1 text-black/60">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>

      <footer className="border-t border-gray-200 bg-white/80">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 xl:px-10">
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
