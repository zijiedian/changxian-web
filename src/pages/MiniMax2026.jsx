import { useEffect, useMemo, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import logoInline from '../assets/logo.png?inline';
import SiteFooter from '../components/SiteFooter.jsx';
import SiteHeader from '../components/SiteHeader.jsx';

const cards = [
  {
    id: '01',
    type: 'cover',
    meta: 'MiniMax · 2026 / 02',
    title: 'MiniMax',
    subtitle: '多模态矩阵与生产力模型',
  },
  {
    id: '02',
    type: 'profile',
    meta: '公司定位',
    title: '谁是 MiniMax',
    subtitle: '基础模型公司',
  },
  {
    id: '03',
    type: 'lineup',
    meta: '模型谱系',
    title: '最新模型矩阵',
    subtitle: 'M2.5 / M2.1 / M1',
  },
  {
    id: '04',
    type: 'm25',
    meta: '旗舰模型',
    title: 'M2.5 核心指标',
    subtitle: '编程 · 搜索 · 工具',
    dark: true,
  },
  {
    id: '05',
    type: 'm25_plus',
    meta: '生产力解读',
    title: '为什么说它可落地',
    subtitle: '脚手架 + 效率',
  },
  {
    id: '06',
    type: 'm1',
    meta: '开源推理',
    title: 'M1 的关键优势',
    subtitle: '长上下文',
  },
  {
    id: '07',
    type: 'multimodal',
    meta: '多模态家族',
    title: '音频 / 视频 / 音乐',
    subtitle: 'Hailuo · Speech · Music',
  },
  {
    id: '08',
    type: 'tier',
    meta: '梯队判断',
    title: '当前所处位置',
    subtitle: '旗舰 / 开源 / 通用',
  },
  {
    id: '09',
    type: 'timeline',
    meta: '迭代节奏',
    title: '2025-2026 发布节奏',
    subtitle: '高频迭代',
  },
  {
    id: '10',
    type: 'summary',
    meta: '关键结论',
    title: '一句话看懂 MiniMax',
    subtitle: '核心收敛',
  },
  {
    id: '11',
    type: 'cta',
    meta: '关于我们',
    title: '尝鲜AI',
    subtitle: '',
  },
];

function StatBlock({ label, value, hint, dark }) {
  return (
    <div
      className={`border p-3 ${
        dark ? 'border-white/20 bg-white/5 text-[#f2efe9]/80' : 'border-black/10 bg-white/70 text-black/70'
      }`}
    >
      <div className={`text-[10px] uppercase tracking-[0.2em] ${dark ? 'text-[#f2efe9]/60' : 'text-black/50'}`}>
        {label}
      </div>
      <div className="font-display text-2xl">{value}</div>
      {hint ? <div className="text-xs">{hint}</div> : null}
    </div>
  );
}

function LineItem({ num, title, text }) {
  return (
    <div className="grid grid-cols-[48px_1fr] gap-3">
      <div className="font-display text-2xl text-brand">{num}</div>
      <div>
        <h3 className="text-base font-semibold text-[#1a1a1a]">{title}</h3>
        <p className="text-sm text-black/60">{text}</p>
      </div>
    </div>
  );
}

function MetricBars({ metric, rows, panel }) {
  const values = rows.map((row) => row.value).filter((value) => typeof value === 'number');
  const max = values.length ? Math.max(...values) : 1;
  return (
    <div className={`border ${panel} p-3`}>
      <div className="text-[10px] uppercase tracking-[0.2em]">{metric}</div>
      <div className="mt-3 space-y-2 text-xs">
        {rows.map((row) => {
          const hasValue = typeof row.value === 'number';
          const width = hasValue ? `${(row.value / max) * 100}%` : '0%';
          return (
            <div key={row.name} className="grid grid-cols-[120px_1fr_44px] items-center gap-2">
              <span className="truncate text-black/70">{row.name}</span>
              <div className="h-2 rounded-full bg-black/10">
                <div
                  className={`h-2 rounded-full ${row.highlight ? 'bg-brand' : 'bg-black/30'}`}
                  style={{ width }}
                />
              </div>
              <span className="text-right text-black/60">{hasValue ? row.value : '—'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MiniMax2026() {
  const trackRef = useRef(null);
  const dotRefs = useRef([]);
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0 });
  const [scale, setScale] = useState(1);
  const [copyStatus, setCopyStatus] = useState('');
  const [exportStatus, setExportStatus] = useState('');
  const [exporting, setExporting] = useState(false);
  const [logoUrl, setLogoUrl] = useState(logoInline);

  const cardWidth = useMemo(() => 600 * scale, [scale]);
  const cardHeight = useMemo(() => 800 * scale, [scale]);

  useEffect(() => {
    if (typeof logoInline === 'string' && logoInline.startsWith('data:')) return;
    let mounted = true;
    fetch('/logo.png')
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (mounted && typeof reader.result === 'string') {
            setLogoUrl(reader.result);
          }
        };
        reader.readAsDataURL(blob);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const ensureLogoDataUrl = async () => {
    if (typeof logoUrl === 'string' && logoUrl.startsWith('data:')) {
      return logoUrl;
    }
    try {
      const res = await fetch('/logo.png');
      const blob = await res.blob();
      const dataUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(typeof reader.result === 'string' ? reader.result : '');
        reader.readAsDataURL(blob);
      });
      if (typeof dataUrl === 'string' && dataUrl.startsWith('data:')) {
        setLogoUrl(dataUrl);
        return dataUrl;
      }
    } catch (error) {
      console.warn('MiniMax export: logo base64 failed', error);
    }
    return logoUrl;
  };

  useEffect(() => {
    const updateScale = () => {
      const maxWidth = window.innerWidth - 48;
      const widthScale = maxWidth / 600;
      const heightScale = (window.innerHeight * 0.6) / 800;
      const nextScale = Math.min(1, widthScale, heightScale);
      setScale(Math.max(0.55, nextScale));
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  useEffect(() => {
    const updateDots = () => {
      const track = trackRef.current;
      if (!track) return;
      const gap = 24;
      const step = cardWidth + gap;
      const index = Math.round(track.scrollLeft / step);
      dotRefs.current.forEach((dot, i) => {
        if (!dot) return;
        dot.classList.toggle('bg-brand', i === Math.min(index, cards.length - 1));
        dot.classList.toggle('bg-black/20', i !== Math.min(index, cards.length - 1));
      });
    };

    updateDots();
    const track = trackRef.current;
    if (!track) return undefined;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      window.requestAnimationFrame(() => {
        updateDots();
        ticking = false;
      });
      ticking = true;
    };
    track.addEventListener('scroll', onScroll);
    window.addEventListener('resize', updateDots);
    return () => {
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateDots);
    };
  }, [cardWidth]);

  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const track = trackRef.current;
    if (!track) return;
    track.setPointerCapture?.(event.pointerId);
    dragState.current.isDown = true;
    dragState.current.startX = event.clientX;
    dragState.current.scrollLeft = track.scrollLeft;
  };

  const handlePointerMove = (event) => {
    if (!dragState.current.isDown) return;
    const track = trackRef.current;
    if (!track) return;
    const walk = event.clientX - dragState.current.startX;
    track.scrollLeft = dragState.current.scrollLeft - walk;
  };

  const handlePointerUp = (event) => {
    if (!dragState.current.isDown) return;
    dragState.current.isDown = false;
    const track = trackRef.current;
    track?.releasePointerCapture?.(event.pointerId);
  };

  const articleText = useMemo(
    () =>
      [
        'MiniMax：2026年2月模型谱系与梯队位置',
        'M2.5旗舰、M1开源推理与多模态矩阵',
        '',
        '公司信息：全称上海稀宇科技有限公司，又名稀宇科技。',
        '上市信息：1月9号在香港联合交易所主板挂牌上市，股票简称 MINIMAX-WP，股票代码 00100。',
        '公司定位：全球 AI 基础模型公司，使命 Intelligence with Everyone。',
        '规模数据：累计服务 2.12 亿用户，覆盖 200+ 国家/地区，13 万+ 企业与开发者。',
        '产品矩阵：Agent / Hailuo AI / MiniMax Audio / Talkie / 开放平台。',
        '',
        '2026-02：M2.5 与 M2.5-highspeed 发布，主攻编程、工具调用、搜索、办公场景。',
        'M2.5 指标：SWE-Bench Verified 80.2%，Multi-SWE 51.3%，BrowseComp 76.3%。',
        'M2.5 重点：强调脚手架泛化（Droid/OpenCode）与效率提升（速度 +37%）。',
        '',
        '2025-12：M2.1 为多语言编程与复杂任务主力。',
        '2025-06：M1 开源混合架构推理模型，1M 上下文输入 + 80K 推理输出。',
        '多模态更新：Hailuo 2.3（视频）、Speech 2.6（语音）、Music 2.5（音乐）。',
        '',
        '梯队判断：M2.5 进入生产力旗舰第一梯队；M1 处于开源推理领先梯队。',
        '结论：多模态矩阵 + 生产力导向成为 MiniMax 主要护城河。',
        '阅读建议：对比同一基准与脚手架，关注效率与稳定性。',
      ].join('\n'),
    []
  );

  const handleCopy = async () => {
    setCopyStatus('');
    try {
      await navigator.clipboard.writeText(articleText);
      setCopyStatus('已复制');
    } catch (error) {
      const textarea = document.createElement('textarea');
      textarea.value = articleText;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopyStatus('已复制');
    }
  };

  const handleExport = async () => {
    if (exporting) return;
    setExportStatus('');
    setExporting(true);
    let logoNodes = [];
    let logoSrcs = [];
    try {
      const resolvedLogoUrl = await ensureLogoDataUrl();
      if (resolvedLogoUrl) {
        logoNodes = Array.from(document.querySelectorAll('img[data-logo]'));
        logoSrcs = logoNodes.map((node) => node.getAttribute('src'));
        logoNodes.forEach((node) => {
          node.setAttribute('src', resolvedLogoUrl);
        });
      }
      if (document.fonts?.ready) {
        try {
          await document.fonts.ready;
        } catch (error) {
          console.warn('MiniMax export: font ready failed', error);
        }
      }
      if (resolvedLogoUrl) {
        await new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve;
          img.src = resolvedLogoUrl;
        });
      }
      await new Promise((resolve) => requestAnimationFrame(() => resolve()));
      const nodes = Array.from(document.querySelectorAll('[data-card]'));
      for (let i = 0; i < nodes.length; i += 1) {
        const backgroundColor = window.getComputedStyle(nodes[i]).backgroundColor || '#ffffff';
        const placeholder =
          typeof resolvedLogoUrl === 'string' && resolvedLogoUrl.startsWith('data:') ? resolvedLogoUrl : undefined;
        const exportOptions = {
          cacheBust: true,
          pixelRatio: 2,
          width: 600,
          height: 800,
          backgroundColor,
          imagePlaceholder: placeholder,
          style: {
            transform: 'scale(1)',
            transformOrigin: 'top left',
            width: '600px',
            height: '800px',
          },
        };
        let dataUrl;
        try {
          dataUrl = await toPng(nodes[i], exportOptions);
        } catch (error) {
          console.warn('MiniMax export fallback to skipFonts', error);
          dataUrl = await toPng(nodes[i], { ...exportOptions, skipFonts: true });
        }
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `minimax-2026-card-${String(i + 1).padStart(2, '0')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
      setExportStatus('已导出');
    } catch (error) {
      console.error('MiniMax export failed', error);
      const message = error?.message ? String(error.message).split('\n')[0] : '';
      setExportStatus(message ? `导出失败：${message}` : '导出失败');
    } finally {
      if (logoNodes.length) {
        logoNodes.forEach((node, index) => {
          const value = logoSrcs[index];
          if (value) {
            node.setAttribute('src', value);
          } else {
            node.removeAttribute('src');
          }
        });
      }
      setExporting(false);
    }
  };

  const renderBody = (card) => {
    const dark = !!card.dark;
    const muted = dark ? 'text-[#f2efe9]/70' : 'text-black/60';
    const panel = dark ? 'border-white/20 bg-white/5 text-[#f2efe9]/80' : 'border-black/10 bg-white/70 text-black/70';

    switch (card.type) {
      case 'cover':
        return (
          <>
            <p className={`text-sm ${muted}`}>
              多模态基础模型公司，使命是让智能惠及每一个人，并形成模型 + 产品 + 平台闭环。
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <StatBlock label="成立" value="2022" hint="公司时间线" dark={dark} />
              <StatBlock label="用户" value="2.12 亿" hint="累计服务" dark={dark} />
              <StatBlock label="覆盖" value="200+" hint="国家与地区" dark={dark} />
              <StatBlock label="企业" value="13 万+" hint="开发者/企业" dark={dark} />
            </div>
          </>
        );
      case 'profile':
        return (
          <div className="grid gap-4">
            <LineItem num="01" title="公司全称" text="上海稀宇科技有限公司（MiniMax）。" />
            <LineItem num="02" title="又名" text="稀宇科技。" />
            <LineItem num="03" title="上市信息" text="1月9号在香港联合交易所主板挂牌上市。" />
            <LineItem num="04" title="股票信息" text="股票简称 MINIMAX-WP，股票代码 00100。" />
            <div className={`border ${panel} p-3 text-xs`}>
              <div className="uppercase tracking-[0.2em]">定位</div>
              <div className="mt-1 text-sm">以生产力与多模态为中心的全球基础模型公司。</div>
            </div>
            <div className={`border ${panel} p-3 text-xs`}>
              <div className="uppercase tracking-[0.2em]">核心产品</div>
              <div className="mt-1 text-sm">Agent / Hailuo AI / MiniMax Audio / Talkie / 开放平台。</div>
            </div>
          </div>
        );
      case 'lineup':
        return (
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className={`border ${panel} p-3 text-xs`}>
                <div className="uppercase tracking-[0.2em]">M2.5</div>
                <div className="mt-1 text-base font-semibold text-[#1a1a1a]">旗舰文本模型</div>
                <div className="mt-1 text-sm">编程 · 工具 · 搜索 · 办公</div>
              </div>
              <div className={`border ${panel} p-3 text-xs`}>
                <div className="uppercase tracking-[0.2em]">M2.1</div>
                <div className="mt-1 text-base font-semibold text-[#1a1a1a]">主力通用</div>
                <div className="mt-1 text-sm">多语言编程与复杂任务</div>
              </div>
              <div className={`border ${panel} p-3 text-xs`}>
                <div className="uppercase tracking-[0.2em]">M1</div>
                <div className="mt-1 text-base font-semibold text-[#1a1a1a]">开源推理</div>
                <div className="mt-1 text-sm">混合架构 + 长上下文</div>
              </div>
              <div className={`border ${panel} p-3 text-xs`}>
                <div className="uppercase tracking-[0.2em]">Hailuo</div>
                <div className="mt-1 text-base font-semibold text-[#1a1a1a]">视频模型</div>
                <div className="mt-1 text-sm">Hailuo 2.3</div>
              </div>
              <div className={`border ${panel} p-3 text-xs`}>
                <div className="uppercase tracking-[0.2em]">Speech</div>
                <div className="mt-1 text-base font-semibold text-[#1a1a1a]">语音模型</div>
                <div className="mt-1 text-sm">Speech 2.6</div>
              </div>
              <div className={`border ${panel} p-3 text-xs`}>
                <div className="uppercase tracking-[0.2em]">Music</div>
                <div className="mt-1 text-base font-semibold text-[#1a1a1a]">音乐模型</div>
                <div className="mt-1 text-sm">Music 2.5</div>
              </div>
            </div>
            <div className={`border ${panel} p-3 text-xs`}>
              <div className="uppercase tracking-[0.2em]">矩阵</div>
              <div className="mt-1 text-sm">文本、推理、语音、视频、音乐全面覆盖。</div>
            </div>
          </div>
        );
      case 'm25':
        return (
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-3">
              <StatBlock label="SWE-Bench" value="80.2%" hint="Verified" dark={dark} />
              <StatBlock label="Multi-SWE" value="51.3%" hint="多任务" dark={dark} />
              <StatBlock label="BrowseComp" value="76.3%" hint="搜索" dark={dark} />
              <StatBlock label="效率" value="+37%" hint="vs M2.1" dark={dark} />
            </div>
            <div className={`border ${panel} p-3 text-xs`}>
              <div className="uppercase tracking-[0.2em]">官方结论</div>
              <div className="mt-1 text-sm">在编程、工具调用与搜索任务中进入旗舰梯队。</div>
            </div>
          </div>
        );
      case 'm25_plus':
        return (
          <div className="grid gap-4">
            <LineItem num="01" title="脚手架泛化" text="官方强调 Droid / OpenCode 等脚手架下稳定表现。" />
            <LineItem num="02" title="生产力优先" text="主攻编程、搜索、办公等高频任务场景。" />
            <LineItem num="03" title="效率提升" text="强调速度与 token 效率，支撑真实工作流。" />
            <div className={`border ${panel} p-3 text-xs`}>
              <div className="uppercase tracking-[0.2em]">解读</div>
              <div className="mt-1 text-sm">M2.5 不是单点推理，而是可执行任务的综合能力。</div>
            </div>
          </div>
        );
      case 'm1':
        return (
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-3">
              <StatBlock label="开源" value="M1" hint="混合架构" dark={dark} />
              <StatBlock label="上下文" value="1M" hint="输入" dark={dark} />
              <StatBlock label="推理输出" value="80K" hint="token" dark={dark} />
              <StatBlock label="定位" value="推理" hint="生产力场景" dark={dark} />
            </div>
            <div className={`border ${panel} p-3 text-xs`}>
              <div className="uppercase tracking-[0.2em]">亮点</div>
              <div className="mt-1 text-sm">开源推理模型中强调长上下文与工具使用优势。</div>
            </div>
          </div>
        );
      case 'multimodal':
        return (
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-3">
              <StatBlock label="Hailuo 2.3" value="视频" hint="视觉生成" dark={dark} />
              <StatBlock label="Speech 2.6" value="语音" hint="TTS" dark={dark} />
              <StatBlock label="Music 2.5" value="音乐" hint="生成" dark={dark} />
              <StatBlock label="多模态" value="矩阵" hint="覆盖场景" dark={dark} />
            </div>
            <div className={`border ${panel} p-3 text-xs`}>
              <div className="uppercase tracking-[0.2em]">组合</div>
              <div className="mt-1 text-sm">形成文本 + 视频 + 语音 + 音乐的多模态闭环。</div>
            </div>
          </div>
        );
      case 'tier':
        return (
          <div className="grid gap-4">
            <div className={`border ${panel} p-3 text-xs`}>
              <div className="uppercase tracking-[0.2em]">旗舰生产力</div>
              <div className="mt-1 text-sm">M2.5 进入全球生产力旗舰第一梯队。</div>
            </div>
            <div className={`border ${panel} p-3 text-xs`}>
              <div className="uppercase tracking-[0.2em]">开源推理</div>
              <div className="mt-1 text-sm">M1 以长上下文与推理能力占据领先位置。</div>
            </div>
            <div className={`border ${panel} p-3 text-xs`}>
              <div className="uppercase tracking-[0.2em]">通用主力</div>
              <div className="mt-1 text-sm">M2.1 作为多语言与复杂任务的主力基座。</div>
            </div>
            <div className={`border ${panel} p-3 text-xs`}>
              <div className="uppercase tracking-[0.2em]">多模态</div>
              <div className="mt-1 text-sm">Hailuo / Speech / Music 形成垂类领先组合。</div>
            </div>
          </div>
        );
      case 'timeline':
        return (
          <div className="grid gap-4">
            <LineItem num="01" title="2026-02" text="M2.5 / M2.5-highspeed" />
            <LineItem num="02" title="2026-01" text="Music 2.5" />
            <LineItem num="03" title="2025-12" text="M2.1 / M2.1-highspeed" />
            <LineItem num="04" title="2025-10" text="Speech 2.6 · Hailuo 2.3" />
            <LineItem num="05" title="2025-06" text="M1 开源混合架构推理模型" />
            <div className={`border ${panel} p-3 text-xs`}>
              <div className="uppercase tracking-[0.2em]">节奏</div>
              <div className="mt-1 text-sm">保持高频迭代与多模态联动发布。</div>
            </div>
          </div>
        );
      case 'summary':
        return (
          <div className="grid gap-4">
            <div className={`border ${panel} p-4`}>
              <div className="text-xs uppercase tracking-[0.2em]">结论 01</div>
              <div className="mt-2 text-base font-semibold text-[#1a1a1a]">M2.5 进入生产力旗舰梯队</div>
              <p className="mt-2 text-sm text-black/60">编程、搜索与工具调用能力成熟，面向真实任务。</p>
            </div>
            <div className={`border ${panel} p-4`}>
              <div className="text-xs uppercase tracking-[0.2em]">结论 02</div>
              <div className="mt-2 text-base font-semibold text-[#1a1a1a]">M1 夯实开源推理优势</div>
              <p className="mt-2 text-sm text-black/60">长上下文与推理输出能力让开源阵营上探上限。</p>
            </div>
            <div className={`border ${panel} p-4`}>
              <div className="text-xs uppercase tracking-[0.2em]">结论 03</div>
              <div className="mt-2 text-base font-semibold text-[#1a1a1a]">多模态矩阵提升护城河</div>
              <p className="mt-2 text-sm text-black/60">视频、语音与音乐模型同步推进，形成产品闭环。</p>
            </div>
          </div>
        );
      case 'cta':
        return (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <div className={`relative flex h-28 w-28 items-center justify-center rounded-full border ${panel} bg-white/80 shadow-soft`}>
              <div className="pointer-events-none absolute inset-2 rounded-full border border-brand/40" />
              <img
                src={logoUrl}
                data-logo
                alt="尝鲜AI Logo"
                className="relative h-16 w-16 rounded-full border border-black/10"
              />
            </div>
            <div className="text-xs uppercase tracking-[0.4em] text-black/50">尝鲜AI · 科技日报</div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-brand/60" />
              <span className="text-[11px] uppercase tracking-[0.4em] text-black/40">AIGC</span>
              <span className="h-px w-10 bg-brand/60" />
            </div>
            <p className="max-w-[280px] text-sm text-black/60">专注于对 AIGC 行业的观察和分享。</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-ink">
      <div className="relative flex-1 overflow-hidden">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-brand/20 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-10 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
        <div className="mx-auto max-w-5xl px-4 pb-16 pt-6">
          <SiteHeader active="articles" />

          <section className="mt-8">
          <div
            ref={trackRef}
            className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 select-none cursor-grab active:cursor-grabbing"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            {cards.map((card) => {
              const dark = !!card.dark;
              const isCta = card.type === 'cta';
              return (
                <div
                  key={card.id}
                  className="snap-start"
                  style={{ width: `${cardWidth}px`, height: `${cardHeight}px`, flex: `0 0 ${cardWidth}px` }}
                >
                  <article
                    data-card
                    className={`relative h-[800px] w-[600px] overflow-hidden border shadow-poster ${
                      dark ? 'bg-[#121212] text-[#f2efe9] border-white/20' : 'bg-[#f2efe9] text-[#1a1a1a] border-black/10'
                    }`}
                    style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
                  >
                    <div
                      className={`pointer-events-none absolute inset-0 opacity-70 ${
                        dark
                          ? 'bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)]'
                          : 'bg-[linear-gradient(rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.06)_1px,transparent_1px)]'
                      }`}
                      style={{ backgroundSize: '26px 26px' }}
                    />
                    <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-brand/20 blur-3xl" />
                    <div className="pointer-events-none absolute bottom-6 left-8 h-1.5 w-24 bg-brand" />
                    {card.type === 'cover' && (
                      <>
                        <img
                          src={logoUrl}
                          data-logo
                          alt="尝鲜AI Logo"
                          className="pointer-events-none absolute right-10 top-36 h-40 w-40 rounded-full border border-black/10 opacity-20"
                        />
                        <div className="pointer-events-none absolute right-4 top-24 font-display text-[120px] leading-none text-black/10">
                          M2.5
                        </div>
                        <div className="pointer-events-none absolute left-8 bottom-28 font-serif text-[64px] text-black/10">
                          MINIMAX
                        </div>
                      </>
                    )}
                    <div
                      className={`pointer-events-none absolute inset-6 border ${
                        dark ? 'border-white/20' : 'border-black/10'
                      }`}
                    />

                    <div className="relative z-10 grid h-full grid-rows-[auto_1fr_auto] gap-4 px-10 py-10">
                      <div>
                        {card.type === 'cover' && (
                          <div className="mb-4 flex items-center gap-3">
                            <img
                              src={logoUrl}
                              data-logo
                              alt="尝鲜AI Logo"
                              className="h-10 w-10 rounded-full border border-black/10"
                            />
                            <div>
                              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark">尝鲜AI</div>
                              <div className="text-[10px] uppercase tracking-[0.2em] text-black/60">科技日报</div>
                            </div>
                          </div>
                        )}
                        <p
                          className={`font-display text-xs uppercase tracking-widest ${
                            dark ? 'text-[#f2efe9]/70' : 'text-black/60'
                          } ${isCta ? 'text-center' : ''}`}
                        >
                          {card.meta}
                        </p>
                        {card.type === 'cover' ? (
                          <>
                            <h1 className="mt-2 font-serif text-[60px] leading-[1.02] tracking-wide">{card.title}</h1>
                            <p className={`mt-3 text-lg font-medium ${dark ? 'text-[#f2efe9]/80' : 'text-black/80'}`}>
                              {card.subtitle}
                            </p>
                            <span className="mt-4 inline-flex items-center border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-dark">
                              旗舰特辑
                            </span>
                          </>
                        ) : (
                          <>
                            <h2 className={`mt-2 font-serif text-[30px] ${isCta ? 'text-center' : ''}`}>{card.title}</h2>
                            {card.subtitle ? (
                              <span
                                className={`mt-2 inline-flex items-center px-3 py-1 text-xs font-semibold uppercase tracking-widest ${
                                  isCta
                                    ? dark
                                      ? 'border border-white/20 bg-white/10 text-[#f2efe9]/70'
                                      : 'border border-black/10 bg-white/70 text-black/60'
                                    : dark
                                      ? 'bg-[#f2efe9] text-[#121212]'
                                      : 'bg-brand text-white'
                                } ${isCta ? 'mx-auto' : ''}`}
                              >
                                {card.subtitle}
                              </span>
                            ) : null}
                          </>
                        )}
                      </div>

                      <div>{renderBody(card)}</div>

                      <div className={`flex justify-end text-xs ${dark ? 'text-[#f2efe9]/70' : 'text-black/60'}`}>
                        <span className="flex items-center gap-2">
                          <img
                            src={logoUrl}
                            data-logo
                            alt="尝鲜AI Logo"
                            className="h-4 w-4 rounded-full border border-black/10"
                          />
                          <span>尝鲜AI · 科技日报</span>
                        </span>
                      </div>
                    </div>

                    <div
                      className={`absolute right-8 top-8 font-display text-xs tracking-[0.4em] ${
                        dark ? 'text-[#f2efe9]/70' : 'text-black/60'
                      }`}
                    >
                      NO.{card.id}
                    </div>
                  </article>
                </div>
              );
            })}
          </div>

          <div className="mt-2 flex justify-center">
            <div className="glass-card flex items-center gap-2 rounded-full px-3 py-2">
              {cards.map((card, index) => (
                <span
                  key={card.id}
                  ref={(el) => {
                    dotRefs.current[index] = el;
                  }}
                  className={`h-2 w-2 rounded-full ${index === 0 ? 'bg-brand' : 'bg-black/20'}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="soft-button soft-button-primary"
            >
              一键复制文章内容
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="soft-button soft-button-secondary"
            >
              {exporting ? '正在导出…' : '一键导出卡片图片'}
            </button>
            {(copyStatus || exportStatus) && (
              <span className="text-xs text-muted">{copyStatus || exportStatus}</span>
            )}
          </div>
        </section>

        <article className="mt-10 glass-card rounded-3xl p-6">
          <header className="border-b border-black/10 pb-6">
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-brand-dark">
              <span className="rounded-full border border-brand/30 bg-brand/10 px-3 py-1 font-semibold">深度解读</span>
              <span>MiniMax</span>
              <span className="text-black/40">·</span>
              <span>2026-02</span>
            </div>
            <h1 className="mt-3 font-serif text-3xl text-ink">公司介绍、<span className="theme-gradient-text">模型谱系</span>与梯队位置</h1>
            <p className="mt-3 text-sm text-muted">
              基于 2026 年 2 月公开信息整理，聚焦 MiniMax 的公司定位、最新模型谱系、旗舰指标与梯队判断，
              便于快速理解与转述。
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted">
              <span>更新：2026-02</span>
              <span>阅读：深度长文</span>
              <span>主题：模型矩阵 / 基准 / 梯队</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {['模型谱系', '生产力模型', '多模态', '开源推理'].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs text-black/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
            <section className="space-y-6 text-sm text-muted">
              <div className="glass-card rounded-2xl p-4">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-black/60">导读</h2>
                <p className="mt-2 text-sm text-black/70">
                  本文从公司背景、模型谱系、旗舰指标、开源推理与多模态矩阵五个维度梳理 MiniMax 的关键进展，
                  帮助快速理解其在国内外模型梯队中的位置。
                </p>
              </div>

              <div id="mm-1">
                <h2 className="text-base font-semibold text-ink">1. 公司定位</h2>
                <ul className="mt-2 space-y-2">
                  <li>• 公司全称：上海稀宇科技有限公司（MiniMax）。</li>
                  <li>• 又名：稀宇科技。</li>
                  <li>• 上市信息：1 月 9 号在香港联合交易所主板挂牌上市，股票简称 MINIMAX-WP，股票代码 00100。</li>
                  <li>• 定位：全球 AI 基础模型公司，使命是让智能惠及每一个人。</li>
                </ul>
              </div>

              <div id="mm-2">
                <h2 className="text-base font-semibold text-ink">2. 产品与生态</h2>
                <ul className="mt-2 space-y-2">
                  <li>• 主要产品：Agent、Hailuo AI、MiniMax Audio、Talkie。</li>
                  <li>• 生态路径：模型 → 产品 → 开放平台，面向 C 端与企业。</li>
                </ul>
              </div>

              <div id="mm-3">
                <h2 className="text-base font-semibold text-ink">3. 最新模型谱系（2025-2026）</h2>
                <ul className="mt-2 space-y-2">
                  <li>• 2026-02：M2.5 / M2.5-highspeed（编程、工具、搜索、办公）。</li>
                  <li>• 2025-12：M2.1 / M2.1-highspeed（多语言编程与复杂任务）。</li>
                  <li>• 2025-06：M1（开源混合架构推理模型）。</li>
                </ul>
              </div>

              <div id="mm-4">
                <h2 className="text-base font-semibold text-ink">4. M2.5 指标与解读</h2>
                <ul className="mt-2 space-y-2">
                  <li>• SWE-Bench Verified：80.2%。</li>
                  <li>• Multi-SWE-Bench：51.3%。</li>
                  <li>• BrowseComp：76.3%。</li>
                  <li>• 官方强调脚手架泛化与效率（速度 +37%）。</li>
                </ul>
                <p className="mt-2">结论：生产力场景表现稳定，主打可落地任务执行能力。</p>
              </div>

              <div id="mm-5">
                <h2 className="text-base font-semibold text-ink">5. M2.1 / M1 核心价值</h2>
                <ul className="mt-2 space-y-2">
                  <li>• M2.1：多语言编程与复杂任务主力模型。</li>
                  <li>• M1：开源推理，强调长上下文（1M 输入 / 80K 输出）。</li>
                </ul>
              </div>

              <div id="mm-6">
                <h2 className="text-base font-semibold text-ink">6. 多模态矩阵</h2>
                <ul className="mt-2 space-y-2">
                  <li>• Hailuo 2.3：视频模型。</li>
                  <li>• Speech 2.6：语音生成模型。</li>
                  <li>• Music 2.5：音乐生成模型。</li>
                </ul>
              </div>

              <div id="mm-7">
                <h2 className="text-base font-semibold text-ink">7. 梯队判断</h2>
                <ul className="mt-2 space-y-2">
                  <li>• M2.5：生产力旗舰第一梯队。</li>
                  <li>• M1：开源推理领先梯队。</li>
                  <li>• M2.1：通用主力梯队，覆盖多语言与复杂任务。</li>
                </ul>
              </div>

              <div id="mm-8">
                <h2 className="text-base font-semibold text-ink">8. 迭代节奏</h2>
                <p>2025-2026 保持高频迭代，文本与多模态模型交替发布。</p>
              </div>

              <div id="mm-9">
                <h2 className="text-base font-semibold text-ink">9. 结论</h2>
                <p>MiniMax 的核心护城河来自生产力导向 + 多模态矩阵 + 生态闭环。</p>
              </div>
            </section>

            <aside className="space-y-4">
              <div className="sticky top-6 space-y-4">
                <div className="glass-card rounded-2xl p-4">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-black/60">目录</h3>
                  <ul className="mt-3 space-y-2 text-xs text-black/60">
                    <li><a className="transition hover:text-brand" href="#mm-1">01 公司定位</a></li>
                    <li><a className="transition hover:text-brand" href="#mm-2">02 产品与生态</a></li>
                    <li><a className="transition hover:text-brand" href="#mm-3">03 模型谱系</a></li>
                    <li><a className="transition hover:text-brand" href="#mm-4">04 M2.5 指标</a></li>
                    <li><a className="transition hover:text-brand" href="#mm-5">05 M2.1 / M1</a></li>
                    <li><a className="transition hover:text-brand" href="#mm-6">06 多模态矩阵</a></li>
                    <li><a className="transition hover:text-brand" href="#mm-7">07 梯队判断</a></li>
                    <li><a className="transition hover:text-brand" href="#mm-8">08 迭代节奏</a></li>
                    <li><a className="transition hover:text-brand" href="#mm-9">09 结论</a></li>
                  </ul>
                </div>

                <div className="glass-card rounded-2xl p-4">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-black/60">关键结论</h3>
                  <ul className="mt-3 space-y-2 text-xs text-black/70">
                    <li>• 旗舰 M2.5 进入生产力第一梯队。</li>
                    <li>• M1 以长上下文巩固开源推理优势。</li>
                    <li>• 多模态矩阵提升产品化闭环能力。</li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>

          <footer className="mt-6 border-t border-black/10 pt-4 text-xs text-muted">
            资料来源：MiniMax 官方发布与平台更新（2025-06~2026-02）。
          </footer>
        </article>
        </div>
      </div>

      <svg className="pointer-events-none fixed inset-0 z-[1] opacity-[0.06] mix-blend-multiply">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>

      <SiteFooter maxWidthClass="max-w-5xl" />
    </div>
  );
}
