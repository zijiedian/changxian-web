export default function BlogPosterCard({
  card,
  scale,
  logoUrl,
  children,
  coverDecoration = null,
  coverBadgeText = '旗舰特辑',
  footerText = '尝鲜AI · 科技日报',
}) {
  const dark = !!card.dark;
  const isCover = card.type === 'cover';
  const isCta = card.type === 'cta' || card.kind === 'cta';

  return (
    <article
      data-card
      className={`poster-card relative h-[800px] w-[600px] overflow-hidden border shadow-poster ${
        dark ? 'border-white/20 bg-[#121212] text-[#f2efe9]' : 'border-black/10 bg-[#f2efe9] text-[#1a1a1a]'
      }`}
      style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
    >
      <div
        className={`pointer-events-none absolute inset-0 ${
          dark
            ? 'opacity-70 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)]'
            : 'opacity-70 bg-[linear-gradient(rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.06)_1px,transparent_1px)]'
        }`}
        style={{ backgroundSize: '26px 26px' }}
      />
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-brand/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-6 left-8 h-1.5 w-24 bg-brand" />
      {isCover && logoUrl ? (
        <img
          src={logoUrl}
          data-logo
          alt="尝鲜AI Logo"
          className="pointer-events-none absolute right-10 top-36 h-40 w-40 rounded-full border border-black/10 opacity-20"
        />
      ) : null}
      {isCover ? coverDecoration : null}
      <div
        className={`pointer-events-none absolute inset-6 border ${
          dark ? 'border-white/20' : 'border-black/10'
        }`}
      />

      <div className="relative z-10 grid h-full grid-rows-[auto_1fr_auto] gap-5 px-10 py-10">
        <div>
          {isCover && logoUrl ? (
            <div className="mb-4 flex items-center gap-3">
              <img src={logoUrl} data-logo alt="尝鲜AI Logo" className="h-10 w-10 rounded-full border border-black/10" />
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark">尝鲜AI</div>
                <div className={`text-[10px] uppercase tracking-[0.2em] ${dark ? 'text-[#f2efe9]/70' : 'text-black/60'}`}>
                  科技日报
                </div>
              </div>
            </div>
          ) : null}
          <p
            className={`font-display text-[11px] uppercase tracking-[0.2em] leading-5 ${
              dark ? 'text-[#f2efe9]/70' : 'text-black/60'
            } ${isCta ? 'text-center' : ''}`}
          >
            {card.meta}
          </p>
          {isCover ? (
            <>
              <h1 className="mt-2 overflow-hidden text-balance font-serif text-[clamp(36px,7vw,58px)] leading-[1.06] tracking-[0.01em] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
                {card.title}
              </h1>
              <p
                className={`mt-3 overflow-hidden text-[clamp(16px,2.5vw,20px)] font-medium leading-[1.5] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] ${
                  dark ? 'text-[#f2efe9]/80' : 'text-black/80'
                }`}
              >
                {card.subtitle}
              </p>
              <span className="mt-4 inline-flex items-center border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-dark">
                {coverBadgeText}
              </span>
            </>
          ) : (
            <>
              <h2
                className={`mt-2 overflow-hidden text-balance font-serif text-[clamp(24px,4.5vw,34px)] leading-[1.22] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] ${
                  isCta ? 'text-center' : ''
                }`}
              >
                {card.title}
              </h2>
              {card.subtitle ? (
                <span
                  className={`mt-2 inline-flex items-center px-3 py-1 text-xs font-semibold uppercase tracking-widest ${
                    isCta
                      ? dark
                        ? 'mx-auto border border-white/20 bg-white/10 text-[#f2efe9]/70'
                        : 'mx-auto border border-black/10 bg-white/70 text-black/60'
                      : dark
                        ? 'bg-[#f2efe9] text-[#121212]'
                        : 'bg-brand text-white'
                  }`}
                >
                  {card.subtitle}
                </span>
              ) : null}
            </>
          )}
        </div>

        <div className="poster-content">{children}</div>

        <div className={`flex justify-end text-xs leading-5 ${dark ? 'text-[#f2efe9]/70' : 'text-black/60'}`}>
          {logoUrl ? (
            <span className="flex items-center gap-2">
              <img src={logoUrl} data-logo alt="尝鲜AI Logo" className="h-4 w-4 rounded-full border border-black/10" />
              <span>{footerText}</span>
            </span>
          ) : (
            <span>{footerText}</span>
          )}
        </div>
      </div>

      {isCover ? (
        <div
          className={`absolute right-8 top-8 font-display text-[11px] tracking-[0.32em] ${
            dark ? 'text-[#f2efe9]/70' : 'text-black/60'
          }`}
        >
          NO.{card.id}
        </div>
      ) : null}
    </article>
  );
}
