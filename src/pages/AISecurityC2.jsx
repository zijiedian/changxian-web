import { useEffect, useMemo, useRef, useState } from 'react';
import { toPng } from 'html-to-image';

const cards = [
  {
    id: '01',
    type: 'cover',
    meta: 'AI安全 · 2026 / 02',
    title: 'C2框架全景',
    subtitle: '开源 vs 闭源',
  },
  {
    id: '02',
    type: 'market',
    meta: '市场结构',
    title: '两条主线',
    subtitle: '开源 / 商业',
  },
  {
    id: '03',
    type: 'open_core',
    meta: '开源主力',
    title: '主流框架',
    subtitle: 'Sliver / Mythic / Havoc / Covenant / DeimosC2',
  },
  {
    id: '04',
    type: 'open_extended',
    meta: '开源补充',
    title: '生态延展',
    subtitle: 'Merlin / Empire / PoshC2 / CALDERA / AdaptixC2 / IoM',
  },
  {
    id: '05',
    type: 'closed_source',
    meta: '闭源产品',
    title: '商业 C2',
    subtitle: 'Cobalt Strike / Brute Ratel / Nighthawk / Outflank / Core Impact / Metasploit Pro',
    dark: true,
  },
  {
    id: '06',
    type: 'comparison',
    meta: '对比维度',
    title: '如何评估',
    subtitle: '架构 / 生态 / 合规',
  },
  {
    id: '07',
    type: 'defense',
    meta: '安全视角',
    title: '防守要点',
    subtitle: '治理 / 检测 / 演练',
  },
  {
    id: '08',
    type: 'summary',
    meta: '结论',
    title: '一句话总结',
    subtitle: '生态与治理并重',
  },
  {
    id: '09',
    type: 'cta',
    meta: '关于我们',
    title: '尝鲜AI',
    subtitle: '',
  },
];

const normalizeGithubRepoUrl = (url) => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== 'github.com' && parsed.hostname !== 'www.github.com') {
      return null;
    }
    const parts = parsed.pathname.split('/').filter(Boolean);
    if (parts.length < 2) {
      return null;
    }
    const owner = parts[0];
    const repo = parts[1].replace(/\.git$/i, '');
    return `https://github.com/${owner}/${repo}`;
  } catch (error) {
    return null;
  }
};

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

export default function AISecurityC2() {
  const trackRef = useRef(null);
  const dotRefs = useRef([]);
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0 });
  const [scale, setScale] = useState(1);
  const [copyStatus, setCopyStatus] = useState('');
  const [exportStatus, setExportStatus] = useState('');
  const [exporting, setExporting] = useState(false);
  const [logoUrl, setLogoUrl] = useState('/logo.png');
  const [lolc2Data, setLolc2Data] = useState(null);
  const [lolc2Error, setLolc2Error] = useState('');

  const cardWidth = useMemo(() => 600 * scale, [scale]);
  const cardHeight = useMemo(() => 800 * scale, [scale]);

  useEffect(() => {
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

  useEffect(() => {
    let active = true;
    fetch('/data/lolc2.json')
      .then((res) => {
        if (!res.ok) {
          throw new Error('无法获取 LoLC2 数据');
        }
        return res.json();
      })
      .then((data) => {
        if (active) setLolc2Data(data);
      })
      .catch(() => {
        if (active) setLolc2Error('LoLC2 数据加载失败，请稍后重试。');
      });
    return () => {
      active = false;
    };
  }, []);

  const lolc2Rows = useMemo(() => {
    if (!lolc2Data) return [];
    const rows = [];
    const seen = new Set();

    Object.entries(lolc2Data).forEach(([category, info]) => {
      const projects = info?.c2Projects || [];
      projects.forEach((url) => {
        const githubUrl = normalizeGithubRepoUrl(url);
        if (!githubUrl) return;
        const key = `${category}-${githubUrl}`;
        if (seen.has(key)) return;
        seen.add(key);
        rows.push({
          id: key,
          category,
          githubUrl,
        });
      });
    });

    return rows;
  }, [lolc2Data]);

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
        'AI安全：开源与闭源 C2 框架全景（更新于 2026-02-27）',
        '',
        '核心问题：C2 框架既是红队基础设施，也是防守侧需要重点监控的工具链。',
        '',
        '开源代表（含 GitHub，最近更新时间=GitHub pushed_at）：',
        'Sliver（Go/跨平台/CLI 协作，最近更新：2026-02-25）— https://github.com/BishopFox/sliver',
        'Mythic（容器化微服务/插件化 Agent，最近更新：2026-02-19）— https://github.com/its-a-feature/Mythic',
        'Havoc（Teamserver+Client 架构，最近更新：2025-12-18，Archived）— https://github.com/HavocFramework/Havoc',
        'Covenant（.NET 协作式 C2，最近更新：2024-07-18）— https://github.com/cobbr/Covenant',
        'Merlin（Go/HTTP2-QUIC 等多协议，最近更新：2025-04-17）— https://github.com/Ne0nd0g/merlin',
        'Empire（PowerShell/.NET 生态，最近更新：2026-02-25）— https://github.com/BC-SECURITY/Empire',
        'PoshC2（协作与任务编排，最近更新：2025-11-20）— https://github.com/nettitude/PoshC2',
        'CALDERA（对抗模拟+自动化编排，最近更新：2026-02-26）— https://github.com/mitre/caldera',
        'Metasploit Framework（模块生态大、通用性强，最近更新：2026-02-26）— https://github.com/rapid7/metasploit-framework',
        'AdaptixC2（高度模块化红队工具链，最近更新：2026-02-26）— https://github.com/Adaptix-Framework/AdaptixC2',
        'IoM / Malefic（IoM Implant + C2 框架，最近更新：2026-01-15）— https://github.com/chainreactors/malefic',
        'BYOB（大型开源后渗透框架，最近更新：2026-02-20）— https://github.com/malwaredllc/byob',
        'Koadic（社区延续仓库，最近更新：2022-01-03）— https://github.com/offsecginger/koadic',
        'Viper（可视化协同，最近更新：2026-01-18）— https://github.com/FunnyWolf/Viper',
        'Supershell（反向 SSH C2，最近更新：2023-09-26）— https://github.com/tdragon6/Supershell',
        'XiebroC2（部分开源，最近更新：2025-02-28）— https://github.com/INotGreen/XiebroC2',
        'DeimosC2（多平台 Teamserver，最近更新：2025-04-17）— https://github.com/DeimosC2/DeimosC2',
        'SHAD0W（后渗透导向，最近更新：2021-09-29）— https://github.com/bats3c/shad0w',
        'SILENTTRINITY（模块化+脚本扩展，最近更新：2023-12-06）— https://github.com/byt3bl33d3r/SILENTTRINITY',
        'C3（多通道通信实验框架，最近更新：2026-01-16）— https://github.com/ReversecLabs/C3',
        'Ninja（轻量化，最近更新：2022-09-26）— https://github.com/ahmedkhlief/Ninja',
        'Manjusaka（多语言实现，最近更新：2026-01-14）— https://github.com/YDHCUI/manjusaka',
        'Pupy（历史大型项目，最近更新：2024-03-22，Archived）— https://github.com/n1nj4sec/pupy',
        'NimPlant（Nim 生态 C2，最近更新：2025-03-28）— https://github.com/chvancooten/NimPlant',
        'Villain（多会话中继与整合，最近更新：2025-05-21）— https://github.com/t3l3machus/Villain',
        'Pyramid（Python C2 组合框架，最近更新：2024-12-02）— https://github.com/naksyn/Pyramid',
        'Nimbo-C2（轻量但活跃，最近更新：2026-01-29）— https://github.com/itaymigdal/Nimbo-C2',
        'Quasar（历史大型 RAT/C2 项目，最近更新：2024-02-29，Archived）— https://github.com/quasar/Quasar',
        'AsyncRAT-C-Sharp（开源 RAT/C2，最近更新：2023-10-16）— https://github.com/NYAN-x-CAT/AsyncRAT-C-Sharp',
        '',
        '开源项目可访问性更新（2026-02-27）：',
        'VShell：原仓库 https://github.com/veo/vshell 当前 404；最近公开情报日期为 2025-05-15（NVISO Labs）。',
        'Koadic：原仓库 https://github.com/zerosum0x0/koadic 当前 404，但社区仍有开源延续仓库。',
        '',
        '闭源代表（最近公开状态核验：2026-02-27）：Cobalt Strike、Brute Ratel C4、Nighthawk、Outflank C2、Core Impact、Metasploit Pro。',
        '',
        '对比维度：架构与协作、可扩展生态、通信与配置灵活度、可审计性与合规、成本与支持。',
        '趋势判断：开源更灵活、扩展快；闭源在稳定性、合规与企业支持上占优。',
        '',
        '安全视角：防守要关注可观测性、策略基线、演练治理与内部使用规范。',
        '',
        '补充清单：更多 C2 项目与通道分类见 LoLC2 汇总（https://lolc2.github.io/）。',
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
    try {
      const nodes = Array.from(document.querySelectorAll('[data-card]'));
      for (let i = 0; i < nodes.length; i += 1) {
        const dataUrl = await toPng(nodes[i], {
          cacheBust: true,
          pixelRatio: 2,
          width: 600,
          height: 800,
          style: {
            transform: 'scale(1)',
            transformOrigin: 'top left',
            width: '600px',
            height: '800px',
          },
        });
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `ai-security-c2-card-${String(i + 1).padStart(2, '0')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
      setExportStatus('已导出');
    } catch (error) {
      setExportStatus('导出失败');
    } finally {
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
              从安全视角理解 C2 生态：既看工具能力，也看治理与防守。
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <StatBlock label="开源" value="26+" hint="主流框架" dark={dark} />
              <StatBlock label="闭源" value="6+" hint="商业代表" dark={dark} />
              <StatBlock label="维度" value="6" hint="评估视角" dark={dark} />
              <StatBlock label="目标" value="安全" hint="治理与演练" dark={dark} />
            </div>
          </>
        );
      case 'market':
        return (
          <div className="grid gap-4">
            <LineItem num="01" title="开源路线" text="强调灵活扩展、可审计与社区生态。" />
            <LineItem num="02" title="闭源路线" text="强调企业支持、成熟稳定与合规流程。" />
            <div className={`border ${panel} p-3 text-xs`}>
              <div className="uppercase tracking-[0.2em]">观察</div>
              <div className="mt-1 text-sm">两条路线并行：红队选型与防守研究都需要覆盖。</div>
            </div>
          </div>
        );
      case 'open_core':
        return (
          <div className="grid gap-4">
            <LineItem num="01" title="Sliver" text="跨平台开源 C2，强调多协议与灵活扩展。" />
            <LineItem num="02" title="Mythic" text="微服务架构，插件化生态与团队协作。" />
            <LineItem num="03" title="Havoc" text="Teamserver + Client 双端，面向红蓝对抗。"/>
            <LineItem num="04" title="Covenant" text=".NET 生态，协作式 C2 与易扩展特性。"/>
          </div>
        );
      case 'open_extended':
        return (
          <div className="grid gap-4">
            <LineItem num="01" title="Merlin" text="Go 实现，强调多协议通信与可移植性。" />
            <LineItem num="02" title="Empire" text="经典开源框架，生态成熟、模块丰富。" />
            <LineItem num="03" title="PoshC2" text="强调协作与 PowerShell 生态支持。" />
            <LineItem num="04" title="CALDERA" text="对抗模拟平台，插件化与自动化编排。" />
            <div className={`border ${panel} p-3 text-xs`}>
              <div className="uppercase tracking-[0.2em]">补充</div>
              <div className="mt-1 text-sm">Metasploit / AdaptixC2 / IoM / NimPlant / Villain：通用框架与轻量化研究场景。</div>
            </div>
          </div>
        );
      case 'closed_source':
        return (
          <div className="grid gap-4">
            <LineItem num="01" title="Cobalt Strike" text="成熟商业 C2，企业红队常用，生态完善。" />
            <LineItem num="02" title="Brute Ratel C4" text="新锐商业产品，强调对抗模拟与稳定支持。" />
            <LineItem num="03" title="Nighthawk" text="商业平台，强调企业支持与协作流程。" />
            <LineItem num="04" title="Outflank C2" text="商业解决方案，面向红队/对抗演练。"/>
            <div className={`border ${panel} p-3 text-xs`}>
              <div className="uppercase tracking-[0.2em]">提示</div>
              <div className="mt-1 text-sm">Core Impact / Metasploit Pro 等商业平台更偏企业流程，适合成熟红队与合规场景。</div>
            </div>
          </div>
        );
      case 'comparison':
        return (
          <div className="grid gap-4">
            <LineItem num="01" title="架构与协作" text="多用户、权限、审计与扩展能力。" />
            <LineItem num="02" title="生态与插件" text="Agent/C2 Profile 生态与社区更新。"/>
            <LineItem num="03" title="合规与支持" text="企业支持、风险控制与培训。"/>
            <div className={`border ${panel} p-3 text-xs`}>
              <div className="uppercase tracking-[0.2em]">结论</div>
              <div className="mt-1 text-sm">开源胜在灵活，闭源胜在稳定与治理。</div>
            </div>
          </div>
        );
      case 'defense':
        return (
          <div className="grid gap-4">
            <LineItem num="01" title="治理" text="明确授权范围、演练流程与审计机制。" />
            <LineItem num="02" title="可观测性" text="日志、资产与行为基线持续对齐。"/>
            <LineItem num="03" title="演练" text="以真实对抗场景检验响应能力。"/>
            <div className={`border ${panel} p-3 text-xs`}>
              <div className="uppercase tracking-[0.2em]">安全提示</div>
              <div className="mt-1 text-sm">本文仅用于防守理解与合规演练参考。</div>
            </div>
          </div>
        );
      case 'summary':
        return (
          <div className="grid gap-4">
            <div className={`border ${panel} p-4`}>
              <div className="text-xs uppercase tracking-[0.2em]">结论 01</div>
              <div className="mt-2 text-base font-semibold text-[#1a1a1a]">开源与闭源并行演进</div>
              <p className="mt-2 text-sm text-black/60">开源强调扩展生态，闭源强调企业级治理。</p>
            </div>
            <div className={`border ${panel} p-4`}>
              <div className="text-xs uppercase tracking-[0.2em]">结论 02</div>
              <div className="mt-2 text-base font-semibold text-[#1a1a1a]">安全视角比选型更重要</div>
              <p className="mt-2 text-sm text-black/60">治理、可观测与合规决定使用边界。</p>
            </div>
          </div>
        );
      case 'cta':
        return (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <div className={`relative flex h-28 w-28 items-center justify-center rounded-full border ${panel} bg-white/80 shadow-soft`}>
              <div className="pointer-events-none absolute inset-2 rounded-full border border-brand/40" />
              <img src={logoUrl} alt="尝鲜AI Logo" className="relative h-16 w-16 rounded-full border border-black/10" />
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
    <div className="min-h-screen bg-[#f2efe9] text-[#1a1a1a]">
      <div className="mx-auto max-w-5xl px-4 pb-16 pt-6">
        <section>
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
                          alt="尝鲜AI Logo"
                          className="pointer-events-none absolute right-10 top-36 h-40 w-40 rounded-full border border-black/10 opacity-20"
                        />
                        <div className="pointer-events-none absolute right-4 top-24 font-display text-[120px] leading-none text-black/10">
                          C2
                        </div>
                        <div className="pointer-events-none absolute left-8 bottom-28 font-serif text-[64px] text-black/10">
                          SECURITY
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
                            <img src={logoUrl} alt="尝鲜AI Logo" className="h-10 w-10 rounded-full border border-black/10" />
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
                            <h1 className="mt-2 font-serif text-[56px] leading-[1.02] tracking-wide">{card.title}</h1>
                            <p className={`mt-3 text-lg font-medium ${dark ? 'text-[#f2efe9]/80' : 'text-black/80'}`}>
                              {card.subtitle}
                            </p>
                            <span className="mt-4 inline-flex items-center border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-dark">
                              AI 安全专题
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

                      <div className={`flex justify-between text-xs ${dark ? 'text-[#f2efe9]/70' : 'text-black/60'}`}>
                        <span>Card {card.id}</span>
                        <span className="flex items-center gap-2">
                          <img src={logoUrl} alt="尝鲜AI Logo" className="h-4 w-4 rounded-full border border-black/10" />
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
            <div className="flex items-center gap-2 rounded-full border border-black/10 bg-[#f2efe9]/90 px-3 py-2 shadow-soft">
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
              className="rounded-full border border-brand/30 bg-brand/10 px-4 py-2 text-xs font-semibold text-brand-dark"
            >
              一键复制文章内容
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-ink"
            >
              {exporting ? '正在导出…' : '一键导出卡片图片'}
            </button>
            {(copyStatus || exportStatus) && (
              <span className="text-xs text-muted">{copyStatus || exportStatus}</span>
            )}
          </div>
        </section>

        <article className="mt-10 rounded-3xl border border-black/10 bg-white p-6 shadow-soft">
          <header className="border-b border-black/10 pb-6">
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-brand-dark">
              <span className="rounded-full border border-brand/30 bg-brand/10 px-3 py-1 font-semibold">AI安全</span>
              <span>C2 框架观察</span>
              <span className="text-black/40">·</span>
              <span>2026-02-27</span>
            </div>
            <h1 className="mt-3 font-serif text-3xl text-ink">开源与闭源 C2 框架全景：生态、能力与安全治理</h1>
            <p className="mt-3 text-sm text-muted">
              本文从安全视角梳理市场上主流 C2 框架，覆盖开源与闭源阵营，并提供可理解的对比维度与治理建议。
              内容仅用于防守研究与合规演练。
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted">
              <span>更新：2026-02-27</span>
              <span>阅读：深度分析</span>
              <span>主题：C2 / 红蓝对抗 / 安全治理</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {['AI安全', 'C2框架', '红队工具', '防守治理'].map((tag) => (
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
              <div className="rounded-2xl border border-black/10 bg-[#f2efe9] p-4">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-black/60">导读</h2>
                <p className="mt-2 text-sm text-black/70">
                  C2 框架是红队对抗的核心组件，同时也是防守侧要重点监控的能力链。本文从生态与治理视角解读开源与闭源阵营的差异，
                  供安全团队进行风险评估与演练规划。
                </p>
              </div>

              <div id="c2-1">
                <h2 className="text-base font-semibold text-ink">1. 市场结构：开源与闭源并行</h2>
                <p>
                  开源框架强调可扩展与可审计，社区更新快；闭源产品更偏企业支持、稳定性与合规流程。两条路线在红队与安全研究中长期并行。
                </p>
              </div>

              <div id="c2-2">
                <h2 className="text-base font-semibold text-ink">2. 开源代表与最新状态（含 GitHub）</h2>
                <ul className="mt-2 space-y-3">
                  <li>
                    • Sliver：Go 生态、跨平台、以 CLI 协作和多协议通信见长（最近更新：2026-02-25）。
                    <a href="https://github.com/BishopFox/sliver" target="_blank" rel="noreferrer" className="ml-2 text-brand">
                      github.com/BishopFox/sliver
                    </a>
                  </li>
                  <li>
                    • Mythic：容器化微服务架构，Agent 与 C2 Profile 插件化能力强（最近更新：2026-02-19）。
                    <a href="https://github.com/its-a-feature/Mythic" target="_blank" rel="noreferrer" className="ml-2 text-brand">
                      github.com/its-a-feature/Mythic
                    </a>
                  </li>
                  <li>
                    • Havoc：Teamserver + Client 双端形态，适合图形化协作（最近更新：2025-12-18，仓库已 Archived）。
                    <a href="https://github.com/HavocFramework/Havoc" target="_blank" rel="noreferrer" className="ml-2 text-brand">
                      github.com/HavocFramework/Havoc
                    </a>
                  </li>
                  <li>
                    • Covenant：.NET 生态协作式 C2，任务管理和操作流较完整（最近更新：2024-07-18）。
                    <a href="https://github.com/cobbr/Covenant" target="_blank" rel="noreferrer" className="ml-2 text-brand">
                      github.com/cobbr/Covenant
                    </a>
                  </li>
                  <li>
                    • Merlin：Go 实现，强调 HTTP/2、QUIC 等多协议与可移植性（最近更新：2025-04-17）。
                    <a href="https://github.com/Ne0nd0g/merlin" target="_blank" rel="noreferrer" className="ml-2 text-brand">
                      github.com/Ne0nd0g/merlin
                    </a>
                  </li>
                  <li>
                    • Empire：经典开源框架，PowerShell/.NET 模块生态成熟（最近更新：2026-02-25）。
                    <a href="https://github.com/BC-SECURITY/Empire" target="_blank" rel="noreferrer" className="ml-2 text-brand">
                      github.com/BC-SECURITY/Empire
                    </a>
                  </li>
                  <li>
                    • PoshC2：强调团队流程与任务协作的 PowerShell C2（最近更新：2025-11-20）。
                    <a href="https://github.com/nettitude/PoshC2" target="_blank" rel="noreferrer" className="ml-2 text-brand">
                      github.com/nettitude/PoshC2
                    </a>
                  </li>
                  <li>
                    • CALDERA：偏“演练平台”定位，强于 TTP 编排与自动化（最近更新：2026-02-26）。
                    <a href="https://github.com/mitre/caldera" target="_blank" rel="noreferrer" className="ml-2 text-brand">
                      github.com/mitre/caldera
                    </a>
                  </li>
                  <li>
                    • Metasploit：模块生态最广的通用框架，Meterpreter 提供稳定 C2 能力（最近更新：2026-02-26）。
                    <a href="https://github.com/rapid7/metasploit-framework" target="_blank" rel="noreferrer" className="ml-2 text-brand">
                      github.com/rapid7/metasploit-framework
                    </a>
                  </li>
                  <li>
                    • AdaptixC2：高度模块化红队工具链，强调可扩展 Listener/Agent 生态（最近更新：2026-02-26）。
                    <a href="https://github.com/Adaptix-Framework/AdaptixC2" target="_blank" rel="noreferrer" className="ml-2 text-brand">
                      github.com/Adaptix-Framework/AdaptixC2
                    </a>
                  </li>
                  <li>
                    • IoM / Malefic：围绕 IoM Implant 体系构建的 C2 框架，偏向现代化基础设施设计（最近更新：2026-01-15）。
                    <a href="https://github.com/chainreactors/malefic" target="_blank" rel="noreferrer" className="ml-2 text-brand">
                      github.com/chainreactors/malefic
                    </a>
                  </li>
                  <li>
                    • BYOB：大型开源后渗透框架，支持模块化 Botnet/C2 管理（最近更新：2026-02-20）。
                    <a href="https://github.com/malwaredllc/byob" target="_blank" rel="noreferrer" className="ml-2 text-brand">
                      github.com/malwaredllc/byob
                    </a>
                  </li>
                  <li>
                    • Koadic：COM C2 思路，偏轻量研究与实验场景（社区仓库最近更新：2022-01-03）。
                    <a href="https://github.com/offsecginger/koadic" target="_blank" rel="noreferrer" className="ml-2 text-brand">
                      github.com/offsecginger/koadic
                    </a>
                  </li>
                  <li>
                    • VShell：原公开仓库（github.com/veo/vshell）当前 404，最新公开情报日期为 2025-05-15，需按闭源/不可审计风险评估。
                  </li>
                  <li>
                    • Viper：可视化协同平台，偏向多人团队任务分工（最近更新：2026-01-18）。
                    <a href="https://github.com/FunnyWolf/Viper" target="_blank" rel="noreferrer" className="ml-2 text-brand">
                      github.com/FunnyWolf/Viper
                    </a>
                  </li>
                  <li>
                    • XiebroC2：Implant 开源，但 Teamserver/Controller 未开源（最近更新：2025-02-28，部分开源）。
                    <a href="https://github.com/INotGreen/XiebroC2" target="_blank" rel="noreferrer" className="ml-2 text-brand">
                      github.com/INotGreen/XiebroC2
                    </a>
                  </li>
                  <li>
                    • Supershell：基于反向 SSH 的 C2 平台，部署简洁（最近更新：2023-09-26）。
                    <a href="https://github.com/tdragon6/Supershell" target="_blank" rel="noreferrer" className="ml-2 text-brand">
                      github.com/tdragon6/Supershell
                    </a>
                  </li>
                  <li>
                    • DeimosC2：多平台开源 C2，面向团队协同与扩展（最近更新：2025-04-17）。
                    <a href="https://github.com/DeimosC2/DeimosC2" target="_blank" rel="noreferrer" className="ml-2 text-brand">
                      github.com/DeimosC2/DeimosC2
                    </a>
                  </li>
                  <li>
                    • SHAD0W：后渗透导向框架，偏研究与定制化实验（最近更新：2021-09-29）。
                    <a href="https://github.com/bats3c/shad0w" target="_blank" rel="noreferrer" className="ml-2 text-brand">
                      github.com/bats3c/shad0w
                    </a>
                  </li>
                  <li>
                    • SILENTTRINITY：模块化 C2，适合脚本化二次开发（最近更新：2023-12-06）。
                    <a href="https://github.com/byt3bl33d3r/SILENTTRINITY" target="_blank" rel="noreferrer" className="ml-2 text-brand">
                      github.com/byt3bl33d3r/SILENTTRINITY
                    </a>
                  </li>
                  <li>
                    • C3：多通道实验型 C2 框架，适合研究型自定义通道开发（最近更新：2026-01-16）。
                    <a href="https://github.com/ReversecLabs/C3" target="_blank" rel="noreferrer" className="ml-2 text-brand">
                      github.com/ReversecLabs/C3
                    </a>
                  </li>
                  <li>
                    • Ninja：轻量化 C2，常见于实验与教学场景（最近更新：2022-09-26）。
                    <a href="https://github.com/ahmedkhlief/Ninja" target="_blank" rel="noreferrer" className="ml-2 text-brand">
                      github.com/ahmedkhlief/Ninja
                    </a>
                  </li>
                  <li>
                    • Manjusaka：多语言开源 C2，提供 Teamserver 与图形管理端（最近更新：2026-01-14）。
                    <a href="https://github.com/YDHCUI/manjusaka" target="_blank" rel="noreferrer" className="ml-2 text-brand">
                      github.com/YDHCUI/manjusaka
                    </a>
                  </li>
                  <li>
                    • Pupy（历史大型项目）：跨平台开源 C2（最近更新：2024-03-22，仓库为 Archived 状态）。
                    <a href="https://github.com/n1nj4sec/pupy" target="_blank" rel="noreferrer" className="ml-2 text-brand">
                      github.com/n1nj4sec/pupy
                    </a>
                  </li>
                  <li>
                    • NimPlant：基于 Nim 的现代化开源 C2（最近更新：2025-03-28）。
                    <a href="https://github.com/chvancooten/NimPlant" target="_blank" rel="noreferrer" className="ml-2 text-brand">
                      github.com/chvancooten/NimPlant
                    </a>
                  </li>
                  <li>
                    • Villain：会话统一与中继导向框架，适合横向阶段会话编排（最近更新：2025-05-21）。
                    <a href="https://github.com/t3l3machus/Villain" target="_blank" rel="noreferrer" className="ml-2 text-brand">
                      github.com/t3l3machus/Villain
                    </a>
                  </li>
                  <li>
                    • Pyramid：Python C2 组合框架，强调可组合性与脚本化（最近更新：2024-12-02）。
                    <a href="https://github.com/naksyn/Pyramid" target="_blank" rel="noreferrer" className="ml-2 text-brand">
                      github.com/naksyn/Pyramid
                    </a>
                  </li>
                  <li>
                    • Nimbo-C2：轻量但活跃的开源 C2，适合快速验证场景（最近更新：2026-01-29）。
                    <a href="https://github.com/itaymigdal/Nimbo-C2" target="_blank" rel="noreferrer" className="ml-2 text-brand">
                      github.com/itaymigdal/Nimbo-C2
                    </a>
                  </li>
                  <li>
                    • Quasar（历史大型项目）：经典开源 RAT/C2（最近更新：2024-02-29，仓库为 Archived 状态）。
                    <a href="https://github.com/quasar/Quasar" target="_blank" rel="noreferrer" className="ml-2 text-brand">
                      github.com/quasar/Quasar
                    </a>
                  </li>
                  <li>
                    • AsyncRAT-C-Sharp：开源 RAT/C2 项目，常用于样本分析与检测研究（最近更新：2023-10-16）。
                    <a href="https://github.com/NYAN-x-CAT/AsyncRAT-C-Sharp" target="_blank" rel="noreferrer" className="ml-2 text-brand">
                      github.com/NYAN-x-CAT/AsyncRAT-C-Sharp
                    </a>
                  </li>
                </ul>
                <div className="mt-4 rounded-2xl border border-black/10 bg-[#f2efe9] p-4 text-xs text-black/70">
                  <p className="font-semibold text-black/80">更新时间说明（核验日期：2026-02-27）</p>
                  <p className="mt-2">
                    开源项目“最近更新”统一取 GitHub API `pushed_at` 字段，反映仓库最后推送时间，不等同于正式版本发布日期。
                  </p>
                  <p className="mt-2">
                    VShell：GitHub 仓库 404，结合 2025 年公开威胁研究中“转向闭源开发”的描述，当前更适合归入闭源/半闭源观察项。
                  </p>
                  <p className="mt-2">
                    Koadic：原仓库 404 但仍有社区开源仓库延续，暂无充分证据表明其整体转为闭源。
                  </p>
                  <p className="mt-2">
                    Pupy：GitHub 仓库已标记 Archived，更适合历史研究参考。
                  </p>
                  <p className="mt-2">
                    Quasar：GitHub 仓库同样为 Archived 状态，建议用于历史样本研究而非新建体系。
                  </p>
                </div>
              </div>

              <div id="c2-3">
                <h2 className="text-base font-semibold text-ink">3. 闭源代表与优势特征</h2>
                <ul className="mt-2 space-y-2">
                  <li>
                    • Cobalt Strike：成熟商业产品，生态完善、企业红队常用（最近公开状态核验：2026-02-27）。
                    <a href="https://www.cobaltstrike.com/" target="_blank" rel="noreferrer" className="ml-2 text-brand">
                      cobaltstrike.com
                    </a>
                  </li>
                  <li>
                    • Brute Ratel C4：新锐商业产品，强调对抗模拟与稳定支持（最近公开状态核验：2026-02-27）。
                    <a href="https://bruteratel.com/" target="_blank" rel="noreferrer" className="ml-2 text-brand">
                      bruteratel.com
                    </a>
                  </li>
                  <li>
                    • Nighthawk：商业红队平台，强调协作与企业支持（最近公开状态核验：2026-02-27）。
                    <a href="https://www.mdsec.co.uk/nighthawk/" target="_blank" rel="noreferrer" className="ml-2 text-brand">
                      mdsec.co.uk/nighthawk
                    </a>
                  </li>
                  <li>
                    • Outflank C2：商业对抗平台，面向红队与防守演练（最近公开状态核验：2026-02-27）。
                    <a href="https://outflank.nl/outflank-c2/" target="_blank" rel="noreferrer" className="ml-2 text-brand">
                      outflank.nl/outflank-c2
                    </a>
                  </li>
                  <li>
                    • Core Impact：商业渗透测试平台，具备代理、横向与攻击链编排能力（最近公开状态核验：2026-02-27）。
                    <a href="https://www.coresecurity.com/products/core-impact" target="_blank" rel="noreferrer" className="ml-2 text-brand">
                      coresecurity.com/products/core-impact
                    </a>
                  </li>
                  <li>
                    • Metasploit Pro：Rapid7 商业化平台版本（最近公开状态核验：2026-02-27）。
                    <a href="https://www.rapid7.com/products/metasploit/" target="_blank" rel="noreferrer" className="ml-2 text-brand">
                      rapid7.com/products/metasploit
                    </a>
                  </li>
                  <li>
                    • VShell（状态变化项）：原 GitHub 开源地址 404，公开情报显示其开发路线已转向闭源。
                  </li>
                </ul>
                <p className="mt-3 text-xs text-black/50">
                  注：闭源产品通常不公开仓库更新时间，因此统一标注“最近公开状态核验日期”。
                </p>
              </div>

              <div id="c2-4">
                <h2 className="text-base font-semibold text-ink">4. 对比维度与特点</h2>
                <ul className="mt-2 space-y-2">
                  <li>• 架构与协作：是单体 Teamserver，还是微服务拆分；是否支持多用户并发、权限分级与审计留痕。</li>
                  <li>• 控制端形态：CLI / Web UI / 桌面客户端的组合会直接影响团队操作效率和审计可读性。</li>
                  <li>• 生态与扩展：Agent、Listener、C2 Profile、任务模块是否插件化，决定后续扩展成本。</li>
                  <li>• 协议与隐蔽性：支持的通信协议、流量伪装能力、重连机制和代理链能力决定实战上限。</li>
                  <li>• 维护活跃度：看 GitHub 最近更新时间、Issue/PR 活跃度、是否 Archived，以评估持续可用性。</li>
                  <li>• 治理与合规：闭源产品通常支持商业服务与合规流程；开源更灵活，但需自建治理体系。</li>
                </ul>
                <div className="mt-4 rounded-2xl border border-black/10 bg-white p-3">
                  <div className="overflow-x-auto">
                    <table className="min-w-[920px] w-full border-separate border-spacing-0 text-xs">
                      <thead>
                        <tr className="bg-[#f2efe9] text-left text-[11px] uppercase tracking-widest text-black/60">
                          <th className="rounded-l-xl border-b border-black/10 px-3 py-2">框架</th>
                          <th className="border-b border-black/10 px-3 py-2">定位/架构</th>
                          <th className="border-b border-black/10 px-3 py-2">控制端形态</th>
                          <th className="border-b border-black/10 px-3 py-2">典型优势</th>
                          <th className="rounded-r-xl border-b border-black/10 px-3 py-2">最近更新</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-black/5">
                          <td className="px-3 py-2 font-semibold text-ink">Sliver</td>
                          <td className="px-3 py-2 text-black/60">Go 实现，偏现代 Teamserver + Implant</td>
                          <td className="px-3 py-2 text-black/60">CLI 为主（可自动化）</td>
                          <td className="px-3 py-2 text-black/60">跨平台、协议灵活、社区活跃</td>
                          <td className="px-3 py-2 text-black/50">2026-02-25</td>
                        </tr>
                        <tr className="border-b border-black/5">
                          <td className="px-3 py-2 font-semibold text-ink">Mythic</td>
                          <td className="px-3 py-2 text-black/60">容器化微服务，插件化 Agent/Profile</td>
                          <td className="px-3 py-2 text-black/60">Web UI + API</td>
                          <td className="px-3 py-2 text-black/60">扩展性最强，适合多人协同</td>
                          <td className="px-3 py-2 text-black/50">2026-02-19</td>
                        </tr>
                        <tr className="border-b border-black/5">
                          <td className="px-3 py-2 font-semibold text-ink">Empire</td>
                          <td className="px-3 py-2 text-black/60">PowerShell/.NET 生态，后渗透导向</td>
                          <td className="px-3 py-2 text-black/60">CLI/API</td>
                          <td className="px-3 py-2 text-black/60">Windows/AD 场景经验沉淀深</td>
                          <td className="px-3 py-2 text-black/50">2026-02-25</td>
                        </tr>
                        <tr className="border-b border-black/5">
                          <td className="px-3 py-2 font-semibold text-ink">Metasploit</td>
                          <td className="px-3 py-2 text-black/60">通用渗透框架，C2 是其一部分</td>
                          <td className="px-3 py-2 text-black/60">Console/脚本化</td>
                          <td className="px-3 py-2 text-black/60">模块数量和通用性非常高</td>
                          <td className="px-3 py-2 text-black/50">2026-02-26</td>
                        </tr>
                        <tr className="border-b border-black/5">
                          <td className="px-3 py-2 font-semibold text-ink">AdaptixC2</td>
                          <td className="px-3 py-2 text-black/60">高度模块化红队框架，强调扩展生态</td>
                          <td className="px-3 py-2 text-black/60">Web UI + CLI</td>
                          <td className="px-3 py-2 text-black/60">监听器/Agent 扩展能力强</td>
                          <td className="px-3 py-2 text-black/50">2026-02-26</td>
                        </tr>
                        <tr className="border-b border-black/5">
                          <td className="px-3 py-2 font-semibold text-ink">IoM (Malefic)</td>
                          <td className="px-3 py-2 text-black/60">IoM Implant + C2 基础设施模型</td>
                          <td className="px-3 py-2 text-black/60">CLI/API</td>
                          <td className="px-3 py-2 text-black/60">现代化设计，适合研究型团队</td>
                          <td className="px-3 py-2 text-black/50">2026-01-15</td>
                        </tr>
                        <tr className="border-b border-black/5">
                          <td className="px-3 py-2 font-semibold text-ink">CALDERA</td>
                          <td className="px-3 py-2 text-black/60">对抗模拟平台，偏 TTP 编排</td>
                          <td className="px-3 py-2 text-black/60">Web UI</td>
                          <td className="px-3 py-2 text-black/60">自动化演练与复盘能力强</td>
                          <td className="px-3 py-2 text-black/50">2026-02-26</td>
                        </tr>
                        <tr className="border-b border-black/5">
                          <td className="px-3 py-2 font-semibold text-ink">BYOB</td>
                          <td className="px-3 py-2 text-black/60">后渗透导向，Botnet/C2 管理模型</td>
                          <td className="px-3 py-2 text-black/60">Web + CLI</td>
                          <td className="px-3 py-2 text-black/60">学习与研究资料多，扩展快</td>
                          <td className="px-3 py-2 text-black/50">2026-02-20</td>
                        </tr>
                        <tr className="border-b border-black/5">
                          <td className="px-3 py-2 font-semibold text-ink">NimPlant</td>
                          <td className="px-3 py-2 text-black/60">Nim 生态现代化 C2</td>
                          <td className="px-3 py-2 text-black/60">CLI</td>
                          <td className="px-3 py-2 text-black/60">实现现代、便于实验和二开</td>
                          <td className="px-3 py-2 text-black/50">2025-03-28</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 font-semibold text-ink">Villain</td>
                          <td className="px-3 py-2 text-black/60">会话中继与统一管理导向</td>
                          <td className="px-3 py-2 text-black/60">CLI</td>
                          <td className="px-3 py-2 text-black/60">横向阶段会话编排效率高</td>
                          <td className="px-3 py-2 text-black/50">2025-05-21</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div id="c2-5">
                <h2 className="text-base font-semibold text-ink">5. 安全与防守视角</h2>
                <p>
                  防守侧应关注合规授权、演练范围、日志与可观测性基线，并在红蓝对抗中验证响应能力。工具本身不是目标，
                  治理与流程才是安全落地的关键。
                </p>
              </div>

              <div id="c2-6">
                <h2 className="text-base font-semibold text-ink">6. 截图参考（开源 / 闭源）</h2>
                <p className="mt-2 text-sm text-muted">
                  以下截图来自公开资料，用于展示不同阵营的典型界面形态。新增了 AdaptixC2、IoM（Malefic）等开源项目，以及 Outflank/Core Impact/Metasploit 等闭源产品页面快照。
                </p>
                <div className="mt-4 grid gap-6">
                  <div className="rounded-2xl border border-black/10 bg-white p-4">
                    <h3 className="text-sm font-semibold text-ink">开源代表</h3>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <figure className="rounded-2xl border border-black/10 bg-white p-3">
                        <img src="/assets/c2/covenant-ui.png" alt="Covenant UI 截图" className="w-full rounded-xl" />
                        <figcaption className="mt-2 text-xs text-muted">Covenant UI</figcaption>
                      </figure>
                      <figure className="rounded-2xl border border-black/10 bg-white p-3">
                        <img src="/assets/c2/havoc-ui.png" alt="Havoc UI 截图" className="w-full rounded-xl" />
                        <figcaption className="mt-2 text-xs text-muted">Havoc UI</figcaption>
                      </figure>
                      <figure className="rounded-2xl border border-black/10 bg-white p-3">
                        <img src="/assets/c2/havoc-session-graph.jpg" alt="Havoc Session Graph 截图" className="w-full rounded-xl" />
                        <figcaption className="mt-2 text-xs text-muted">Havoc Session Graph</figcaption>
                      </figure>
                      <figure className="rounded-2xl border border-black/10 bg-white p-3">
                        <img src="/assets/c2/havoc-multi-agent.png" alt="Havoc Multi User Agent Control 截图" className="w-full rounded-xl" />
                        <figcaption className="mt-2 text-xs text-muted">Havoc Multi-User Control</figcaption>
                      </figure>
                      <figure className="rounded-2xl border border-black/10 bg-white p-3">
                        <img src="/assets/c2/havoc-console-help.png" alt="Havoc Session Console Help 截图" className="w-full rounded-xl" />
                        <figcaption className="mt-2 text-xs text-muted">Havoc Console Help</figcaption>
                      </figure>
                      <figure className="rounded-2xl border border-black/10 bg-white p-3">
                        <img src="/assets/c2/havoc-agent-select.png" alt="Havoc Agent Select 截图" className="w-full rounded-xl" />
                        <figcaption className="mt-2 text-xs text-muted">Havoc Agent Select</figcaption>
                      </figure>
                      <figure className="rounded-2xl border border-black/10 bg-white p-3">
                        <img src="/assets/c2/havoc-default.png" alt="Havoc Default 界面截图" className="w-full rounded-xl" />
                        <figcaption className="mt-2 text-xs text-muted">Havoc Default</figcaption>
                      </figure>
                      <figure className="rounded-2xl border border-black/10 bg-white p-3">
                        <img src="/assets/c2/empire-ui.jpg" alt="Empire UI 截图" className="w-full rounded-xl" />
                        <figcaption className="mt-2 text-xs text-muted">Empire UI</figcaption>
                      </figure>
                      <figure className="rounded-2xl border border-black/10 bg-white p-3">
                        <img src="/assets/c2/empire-ui-alt.jpg" alt="Empire UI 视觉截图" className="w-full rounded-xl" />
                        <figcaption className="mt-2 text-xs text-muted">Empire UI（补充）</figcaption>
                      </figure>
                      <figure className="rounded-2xl border border-black/10 bg-white p-3">
                        <img src="/assets/c2/adaptixc2-ogp.png" alt="AdaptixC2 仓库卡片图" className="w-full rounded-xl" />
                        <figcaption className="mt-2 text-xs text-muted">AdaptixC2（GitHub 卡片）</figcaption>
                      </figure>
                      <figure className="rounded-2xl border border-black/10 bg-white p-3">
                        <img src="/assets/c2/malefic-ogp.png" alt="Malefic IoM 仓库卡片图" className="w-full rounded-xl" />
                        <figcaption className="mt-2 text-xs text-muted">IoM / Malefic（GitHub 卡片）</figcaption>
                      </figure>
                      <figure className="rounded-2xl border border-black/10 bg-white p-3">
                        <img src="/assets/c2/byob-ogp.png" alt="BYOB 仓库卡片图" className="w-full rounded-xl" />
                        <figcaption className="mt-2 text-xs text-muted">BYOB（GitHub 卡片）</figcaption>
                      </figure>
                      <figure className="rounded-2xl border border-black/10 bg-white p-3">
                        <img src="/assets/c2/nimboc2-ogp.png" alt="Nimbo-C2 仓库卡片图" className="w-full rounded-xl" />
                        <figcaption className="mt-2 text-xs text-muted">Nimbo-C2（GitHub 卡片）</figcaption>
                      </figure>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-black/10 bg-white p-4">
                    <h3 className="text-sm font-semibold text-ink">闭源代表</h3>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <figure className="rounded-2xl border border-black/10 bg-white p-3">
                        <img src="/assets/c2/cobalt-strike.png" alt="Cobalt Strike UI 截图" className="w-full rounded-xl" />
                        <figcaption className="mt-2 text-xs text-muted">Cobalt Strike UI</figcaption>
                      </figure>
                      <figure className="rounded-2xl border border-black/10 bg-white p-3">
                        <img src="/assets/c2/brute-ratel.png" alt="Brute Ratel UI 截图" className="w-full rounded-xl" />
                        <figcaption className="mt-2 text-xs text-muted">Brute Ratel UI</figcaption>
                      </figure>
                      <figure className="rounded-2xl border border-black/10 bg-white p-3">
                        <img src="/assets/c2/nighthawk-ogp.png" alt="Nighthawk C2 视觉图" className="w-full rounded-xl" />
                        <figcaption className="mt-2 text-xs text-muted">Nighthawk C2 视觉图</figcaption>
                      </figure>
                      <figure className="rounded-2xl border border-black/10 bg-white p-3">
                        <img src="/assets/c2/metasploit-page.gif" alt="Metasploit 官方页面快照" className="w-full rounded-xl" />
                        <figcaption className="mt-2 text-xs text-muted">Metasploit（官网页面快照）</figcaption>
                      </figure>
                      <figure className="rounded-2xl border border-black/10 bg-white p-3">
                        <img src="/assets/c2/outflank-c2-page.gif" alt="Outflank C2 官方页面快照" className="w-full rounded-xl" />
                        <figcaption className="mt-2 text-xs text-muted">Outflank C2（官网页面快照）</figcaption>
                      </figure>
                      <figure className="rounded-2xl border border-black/10 bg-white p-3">
                        <img src="/assets/c2/core-impact-page.gif" alt="Core Impact 官方页面快照" className="w-full rounded-xl" />
                        <figcaption className="mt-2 text-xs text-muted">Core Impact（官网页面快照）</figcaption>
                      </figure>
                      <figure className="rounded-2xl border border-black/10 bg-white p-3">
                        <img src="/assets/c2/cobaltstrike-page.gif" alt="Cobalt Strike 官方页面快照" className="w-full rounded-xl" />
                        <figcaption className="mt-2 text-xs text-muted">Cobalt Strike（官网页面快照）</figcaption>
                      </figure>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-[11px] text-black/50">
                  注：部分新增截图为 GitHub 仓库卡片图或官网页面快照，用于补足闭源/新项目可视化材料。
                </p>
              </div>

              <div id="c2-7">
                <h2 className="text-base font-semibold text-ink">7. LoLC2 框架清单（按通道分类）</h2>
                <p className="text-sm text-muted">
                  LoLC2 收集了大量基于不同通道/平台的 C2 项目。此处使用本地缓存数据（public/data/lolc2.json），
                  表格仅保留 GitHub 仓库地址（自动过滤非 GitHub 条目）。
                </p>
                {lolc2Error && (
                  <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                    {lolc2Error}
                  </div>
                )}
                {!lolc2Error && !lolc2Data && (
                  <div className="mt-3 rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs text-muted">
                    正在加载 LoLC2 清单...
                  </div>
                )}
                {lolc2Data && (
                  <div className="mt-4 rounded-2xl border border-black/10 bg-white p-3">
                    <div className="overflow-x-auto">
                      <table className="min-w-[620px] w-full border-separate border-spacing-0 text-xs">
                        <thead>
                          <tr className="bg-[#f2efe9] text-left text-[11px] uppercase tracking-widest text-black/60">
                            <th className="rounded-l-xl border-b border-black/10 px-3 py-2">通道/分类</th>
                            <th className="rounded-r-xl border-b border-black/10 px-3 py-2">GitHub 地址</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lolc2Rows.map((row, index) => (
                            <tr key={row.id || index} className="border-b border-black/5">
                              <td className="whitespace-nowrap px-3 py-2 text-black/60">{row.category}</td>
                              <td className="px-3 py-2 font-semibold text-ink">
                                <a href={row.githubUrl} target="_blank" rel="noreferrer" className="break-all text-brand">
                                  {row.githubUrl}
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="mt-3 text-[11px] text-black/50">
                      备注：LoLC2 原始数据中的文章/快照链接不会出现在该表中，仅展示可解析的 GitHub 仓库地址。
                    </p>
                  </div>
                )}
              </div>

              <div id="c2-8">
                <h2 className="text-base font-semibold text-ink">8. 结论</h2>
                <p>
                  2026 年的 C2 生态呈现“开源灵活 + 闭源稳态”的并行格局。安全团队应以治理与演练为中心，
                  在合规框架内理解与评估这些工具，提升整体对抗能力。
                </p>
              </div>
            </section>

            <aside className="space-y-4">
              <div className="sticky top-6 space-y-4">
                <div className="rounded-2xl border border-black/10 bg-white/80 p-4">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-black/60">目录</h3>
                  <ul className="mt-3 space-y-2 text-xs text-black/60">
                    <li><a className="transition hover:text-brand" href="#c2-1">01 市场结构</a></li>
                    <li><a className="transition hover:text-brand" href="#c2-2">02 开源框架</a></li>
                    <li><a className="transition hover:text-brand" href="#c2-3">03 闭源产品</a></li>
                    <li><a className="transition hover:text-brand" href="#c2-4">04 对比维度</a></li>
                    <li><a className="transition hover:text-brand" href="#c2-5">05 安全视角</a></li>
                    <li><a className="transition hover:text-brand" href="#c2-6">06 截图参考</a></li>
                    <li><a className="transition hover:text-brand" href="#c2-7">07 LoLC2 清单</a></li>
                    <li><a className="transition hover:text-brand" href="#c2-8">08 结论</a></li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-black/10 bg-[#f2efe9] p-4">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-black/60">快速结论</h3>
                  <ul className="mt-3 space-y-2 text-xs text-black/70">
                    <li>• 开源生态决定灵活度。</li>
                    <li>• 闭源产品更强调企业支持。</li>
                    <li>• 治理与合规是核心边界。</li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>

          <footer className="mt-6 border-t border-black/10 pt-4 text-xs text-muted">
            资料来源：各项目官方 GitHub、Cobalt Strike/Brute Ratel/Nighthawk/Outflank/Core Impact/Metasploit Pro 官方页面、LoLC2 项目清单（本地缓存）；
            开源项目“最近更新时间”来自 GitHub API（采集日期：2026-02-27）；截图补充使用 GitHub OpenGraph 卡片与公开官网页面快照；
            VShell 状态补充参考 NVISO Labs《Inside VShell: Evasive C2 Framework and New Delivery Techniques》（2025）。
          </footer>
        </article>
      </div>

      <svg className="pointer-events-none fixed inset-0 z-[1] opacity-[0.06] mix-blend-multiply">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
}
