import { Link } from 'react-router-dom';
import SiteFooter from '../components/SiteFooter.jsx';
import SiteHeader from '../components/SiteHeader.jsx';

export default function Profile() {
  return (
    <div className="min-h-screen text-ink">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-brand/20 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-10 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <SiteHeader active="profile" />

          <section className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="glass-card rounded-3xl p-6">
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
                <button className="soft-button soft-button-primary">
                  充值
                </button>
                <button className="soft-button soft-button-secondary">
                  查看账单
                </button>
                <button className="soft-button soft-button-secondary">
                  管理绑定
                </button>
              </div>
            </div>

            <div className="glass-card rounded-3xl p-6">
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
            <div className="glass-card rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted">使用记录</div>
                  <div className="mt-1 text-lg font-semibold text-ink">最近操作</div>
                </div>
                <button className="soft-button soft-button-secondary px-3 py-1">
                  导出记录
                </button>
              </div>
              <div className="mt-4 grid gap-3">
                {[
                  { title: '图文生成', time: '—', detail: '暂无记录' },
                  { title: '导出图片', time: '—', detail: '暂无记录' },
                  { title: 'AI 调整', time: '—', detail: '暂无记录' },
                ].map((item) => (
                  <div key={item.title} className="glass-card flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4">
                    <div>
                      <div className="text-sm font-semibold text-ink">{item.title}</div>
                      <div className="mt-1 text-xs text-muted">{item.detail}</div>
                    </div>
                    <div className="text-xs text-muted">{item.time}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-3xl p-6">
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
              <button className="mt-6 w-full soft-button soft-button-primary">
                选择并充值
              </button>
            </div>
          </section>
        </div>
      </div>

      <SiteFooter maxWidthClass="max-w-6xl" />
    </div>
  );
}
