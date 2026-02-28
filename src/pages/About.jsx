import { Link } from 'react-router-dom';
import SiteFooter from '../components/SiteFooter.jsx';
import SiteHeader from '../components/SiteHeader.jsx';

const WECHAT_ACCOUNTS = [
  {
    id: 'aigc',
    platform: 'wechat',
    name: '尝鲜AI',
    title: '专注 AIGC 行业观察和分享',
    intro: '聚焦模型演进、产品趋势与内容工作流，持续分享可落地的 AIGC 方法和实测结论。',
    qrcode: '/wechat-qrcode.jpg',
    searchKeyword: '尝鲜AI',
    update: '每周更新',
    topics: ['模型与产品趋势', 'AIGC 工具实测', '内容生产方法'],
    to: '/articles',
    action: '查看 AIGC 内容',
  },
  {
    id: 'security',
    platform: 'wechat',
    name: '甜甜圈攻防',
    title: '专注安全行业攻防研究',
    intro: '围绕红蓝对抗、威胁情报与检测响应，持续输出面向实战团队的攻防研究内容。',
    qrcode: '/tiantianquan-gongfang.jpg',
    searchKeyword: '甜甜圈攻防',
    update: '持续更新',
    topics: ['攻防案例拆解', '红蓝对抗研究', '检测与响应策略'],
    to: '/posts/ai-security-c2',
    action: '查看安全研究',
  },
];

const SOCIAL_ACCOUNTS = [
  {
    id: 'x',
    platform: 'x',
    name: 'X（Twitter）',
    handle: '@changxianai',
    url: 'https://x.com/changxianai',
    note: '第一时间同步 AIGC 动态、产品观察和关键更新。',
    avatar: '/social/x-avatar.jpg',
    screenshot: '/social/x-user.png',
  },
  {
    id: 'xiaohongshu',
    platform: 'xiaohongshu',
    name: '小红书',
    handle: '尝鲜AI',
    url: 'https://www.xiaohongshu.com/user/profile/5c126baa00000000050231a8',
    note: '以图文形式分享提示词案例、工具实测和上手经验。',
    avatar: '/social/xiaohongshu-avatar.webp',
    screenshot: '/social/xiaohongshu-user.png',
  },
  {
    id: 'github',
    platform: 'github',
    name: 'GitHub',
    handle: 'zijiedian',
    url: 'https://github.com/zijiedian',
    note: '集中沉淀开源项目、代码仓库与技术资料。',
    avatar: '/social/github-avatar.png',
    screenshot: '/social/github-user.png',
  },
];

const FOLLOW_CHANNELS = [
  ...WECHAT_ACCOUNTS.map((item) => ({ ...item, kind: 'wechat', update: item.update || '持续更新' })),
  ...SOCIAL_ACCOUNTS.map((item) => ({ ...item, kind: 'social', update: '持续更新' })),
];

const platformMarkClass = {
  wechat: 'bg-[#07C160] text-white',
  x: 'bg-black text-white',
  xiaohongshu: 'bg-[#FE2C55] text-white',
  github: 'bg-[#24292F] text-white',
};

function PlatformMark({ platform }) {
  if (platform === 'x') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          fill="currentColor"
          d="M18.9 1.15h3.68l-8.04 9.19 9.46 12.5H16.6l-5.8-7.58-6.64 7.58H.48l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93Zm-1.29 19.8h2.04L6.48 3.1H4.3l13.3 17.85Z"
        />
      </svg>
    );
  }

  if (platform === 'github') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 .5A11.5 11.5 0 0 0 .5 12c0 5.1 3.3 9.41 7.87 10.94.58.1.79-.25.79-.56v-2.1c-3.2.7-3.87-1.36-3.87-1.36-.52-1.3-1.27-1.65-1.27-1.65-1.04-.7.08-.69.08-.69 1.15.08 1.75 1.18 1.75 1.18 1.02 1.74 2.68 1.24 3.33.95.1-.73.4-1.24.73-1.52-2.55-.29-5.24-1.27-5.24-5.68 0-1.26.45-2.3 1.18-3.11-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.16 1.19a11.1 11.1 0 0 1 5.76 0c2.19-1.5 3.16-1.2 3.16-1.2.62 1.6.23 2.77.11 3.06.74.8 1.18 1.85 1.18 3.1 0 4.42-2.7 5.4-5.27 5.68.41.35.78 1.05.78 2.12v3.14c0 .31.21.67.8.56A11.52 11.52 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z"
        />
      </svg>
    );
  }

  if (platform === 'xiaohongshu') {
    return <span className="text-[10px] font-bold leading-none">RED</span>;
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <circle cx="9" cy="9" r="5" fill="currentColor" />
      <circle cx="15.2" cy="14.2" r="4.3" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

export default function About() {
  return (
    <div className="min-h-screen flex flex-col text-ink">
      <div className="relative flex-1 overflow-hidden">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-brand/20 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-10 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <SiteHeader active="about" />

          <section className="mt-12">
            <div className="glass-card inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              关注我们
            </div>
            <h1 className="mt-4 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
              一个关注 AIGC，
              <span className="theme-gradient-text">一个深耕攻防研究</span>
            </h1>
            <p className="mt-4 max-w-3xl text-sm text-muted sm:text-base">
              我们是一支同时关注 AI 创新与安全实战的内容团队，在公众号、X、小红书和 GitHub 多平台同步更新。
              尝鲜AI侧重 AIGC 行业观察与方法分享，甜甜圈攻防聚焦安全攻防研究与实战复盘；你可以按兴趣选择，也可以一键全关注。
            </p>
          </section>

          <section className="mt-8 grid gap-5 lg:grid-cols-2">
            {FOLLOW_CHANNELS.map((account) => (
              <article key={account.id} className="theme-gradient-border rounded-3xl shadow-soft">
                <div className="glass-card h-full rounded-3xl p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${
                            platformMarkClass[account.platform] || 'bg-brand text-white'
                          }`}
                        >
                          <PlatformMark platform={account.platform} />
                        </span>
                        <h2 className="text-xl font-semibold text-ink">{account.name}</h2>
                      </div>
                      <p className="mt-2 text-sm font-medium text-brand-dark">
                        {account.kind === 'wechat' ? account.title : `关注 ${account.name} 官方账号`}
                      </p>
                    </div>
                    <span className="rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand-dark">
                      {account.update}
                    </span>
                  </div>

                  <p className="mt-4 text-sm text-muted">{account.kind === 'wechat' ? account.intro : account.note}</p>

                  {account.kind === 'wechat' ? (
                    <>
                      <div className="mt-5 grid gap-4 sm:grid-cols-[140px_1fr]">
                        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-3">
                          <img
                            src={account.qrcode}
                            alt={`${account.name} 公众号二维码`}
                            className="mx-auto h-28 w-28 rounded-xl bg-white p-1 shadow-soft object-contain"
                          />
                          <p className="mt-2 text-center text-[11px] text-muted">微信扫码关注</p>
                        </div>
                        <div className="rounded-2xl border border-white/60 bg-white/70 p-4">
                          <div className="text-xs font-semibold text-muted">内容方向</div>
                          <ul className="mt-2 space-y-1.5 text-sm text-muted">
                            {account.topics.map((topic) => (
                              <li key={topic}>• {topic}</li>
                            ))}
                          </ul>
                          <div className="mt-3 text-xs text-muted">
                            微信搜索：<span className="font-semibold text-ink">{account.searchKeyword}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        <span className="rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand-dark">
                          公众号：{account.name}
                        </span>
                        <Link to={account.to} className="soft-button soft-button-secondary px-3 py-1 text-xs">
                          {account.action}
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mt-4 overflow-hidden rounded-2xl border border-white/70 bg-white/70">
                        <img src={account.screenshot} alt={`${account.name} 主页截图`} loading="lazy" className="h-auto w-full object-contain" />
                      </div>
                      <div className="mt-4 rounded-2xl border border-white/60 bg-white/70 p-4">
                        <div className="text-xs text-muted">
                          账号标识：<span className="font-semibold text-ink">{account.handle}</span>
                        </div>
                        <p className="mt-2 text-xs text-muted">{account.note}</p>
                      </div>
                      <div className="mt-4">
                        <a href={account.url} target="_blank" rel="noreferrer" className="soft-button soft-button-secondary px-3 py-1 text-xs">
                          前往 {account.name}
                        </a>
                      </div>
                    </>
                  )}
                </div>
              </article>
            ))}
          </section>

          <section className="mt-10 grid gap-5 pb-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="glass-card rounded-3xl p-6">
              <h3 className="text-base font-semibold text-ink">怎么选更适合你？</h3>
              <div className="mt-4 grid gap-3 text-sm">
                <div className="rounded-2xl border border-white/60 bg-white/70 p-4">
                  <div className="font-semibold text-ink">尝鲜AI</div>
                  <p className="mt-1 text-muted">适合关注模型趋势、AIGC 产品演进与内容效率提升的读者。</p>
                </div>
                <div className="rounded-2xl border border-white/60 bg-white/70 p-4">
                  <div className="font-semibold text-ink">甜甜圈攻防</div>
                  <p className="mt-1 text-muted">适合关注安全研究、红蓝对抗、防守建设与实战复盘的读者。</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-3xl p-6">
              <h3 className="text-base font-semibold text-ink">关注方式</h3>
              <ol className="mt-4 space-y-3 text-sm text-muted">
                <li>1. 微信打开扫一扫，扫描上方二维码关注公众号。</li>
                <li>2. 也可直接微信搜索：尝鲜AI / 甜甜圈攻防。</li>
                <li>3. 社媒同步关注：X（@changxianai）/ 小红书（尝鲜AI）/ GitHub（zijiedian）。</li>
              </ol>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link to="/articles" className="soft-button soft-button-primary px-4">
                  去看最新内容
                </Link>
                <Link to="/posts/ai-security-c2" className="soft-button soft-button-secondary px-4">
                  查看安全专题
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>

      <SiteFooter maxWidthClass="max-w-6xl" />
    </div>
  );
}
