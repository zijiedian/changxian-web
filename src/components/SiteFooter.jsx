export default function SiteFooter({
  maxWidthClass = 'max-w-7xl',
  followText = '关注公众号：尝鲜AI / 甜甜圈攻防',
}) {
  return (
    <footer className="border-t border-white/70 bg-white/55 backdrop-blur-md">
      <div className={`mx-auto ${maxWidthClass} px-4 py-10 sm:px-6 xl:px-10`}>
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
          <span>{followText}</span>
        </div>
      </div>
    </footer>
  );
}
