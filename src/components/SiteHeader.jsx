import { Link } from 'react-router-dom';

function linkClass(active) {
  return active ? 'soft-button soft-button-primary' : 'px-3 py-2 text-muted transition hover:text-ink';
}

function mobileLinkClass(active) {
  return active
    ? 'block rounded-xl bg-brand/10 px-3 py-2 font-semibold text-brand-dark'
    : 'block rounded-xl px-3 py-2 font-semibold text-ink hover:bg-gray-50';
}

export default function SiteHeader({ active = 'home' }) {
  const isLoggedIn = Boolean(localStorage.getItem('token'));
  const isToolsActive = active === 'tools';
  const isHomeActive = active === 'home';
  const isArticlesActive = active === 'articles';
  const isAboutActive = active === 'about';
  const isProfileActive = active === 'profile';

  return (
    <header className="glass-card relative z-[80] rounded-2xl px-4 py-3">
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
          <details className="relative z-[90]">
            <summary className="glass-card list-none rounded-[14px] p-2 text-ink">
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="sr-only">菜单</span>
            </summary>
            <div className="glass-card absolute right-0 z-[100] mt-2 w-44 rounded-2xl p-2 text-xs shadow-soft">
              <Link to="/" className={mobileLinkClass(isHomeActive)}>
                首页
              </Link>
              <div className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">工具库</div>
              <Link to="/generator" className={mobileLinkClass(isToolsActive)}>
                图文生成
              </Link>
              <Link to="/prompts" className={mobileLinkClass(isToolsActive)}>
                提示词导航
              </Link>
              <div className="px-3 py-1 text-[11px] text-muted">更多工具敬请期待</div>
              <Link to="/articles" className={mobileLinkClass(isArticlesActive)}>
                博客
              </Link>
              <Link to="/about" className={mobileLinkClass(isAboutActive)}>
                关于我们
              </Link>
              {!isLoggedIn && (
                <Link to="/login" className={mobileLinkClass(active === 'login')}>
                  登录
                </Link>
              )}
              {isLoggedIn && (
                <Link to="/profile" className={mobileLinkClass(isProfileActive)}>
                  个人中心
                </Link>
              )}
            </div>
          </details>
        </div>

        <nav className="hidden flex-wrap items-center gap-3 text-xs font-semibold sm:flex">
          <Link to="/" className={linkClass(isHomeActive)}>
            首页
          </Link>
          <div className="relative group">
            <button type="button" className={isToolsActive ? 'soft-button soft-button-primary' : linkClass(false)}>
              工具库
            </button>
            <div className="glass-card absolute left-0 top-full z-[100] hidden min-w-[160px] rounded-2xl p-2 shadow-soft group-hover:block">
              <Link
                to="/generator"
                className={`block rounded-xl px-3 py-2 text-[11px] font-semibold transition ${
                  isToolsActive ? 'bg-brand/10 text-brand-dark' : 'text-ink hover:bg-gray-50'
                }`}
              >
                图文生成
              </Link>
              <Link
                to="/prompts"
                className={`block rounded-xl px-3 py-2 text-[11px] font-semibold transition ${
                  isToolsActive ? 'bg-brand/10 text-brand-dark' : 'text-ink hover:bg-gray-50'
                }`}
              >
                提示词导航
              </Link>
              <div className="px-3 py-2 text-[11px] text-muted">更多工具敬请期待</div>
            </div>
          </div>
          <Link to="/articles" className={linkClass(isArticlesActive)}>
            博客
          </Link>
          <Link to="/about" className={linkClass(isAboutActive)}>
            关于我们
          </Link>
          {!isLoggedIn && (
            <Link to="/login" className={linkClass(active === 'login')}>
              登录
            </Link>
          )}
          {isLoggedIn && (
            <Link to="/profile" className={linkClass(isProfileActive)}>
              个人中心
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
