import { useEffect, useMemo, useState } from 'react';
import { toPng } from 'html-to-image';
import logoInline from '../assets/logo.png?inline';
import BlogPosterCard from '../components/BlogPosterCard.jsx';
import BlogPosterDeck from '../components/BlogPosterDeck.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import SiteHeader from '../components/SiteHeader.jsx';

const cards = [
  {
    id: '01',
    type: 'cover',
    meta: 'Gemini 3 系列 · 2026 / 02 / 19',
    title: 'Gemini 3.1 Pro',
    subtitle: '旗舰复杂任务模型 · 原生多模态 · 超长上下文',
  },
  {
    id: '02',
    type: 'spec',
    meta: '模型概览',
    title: '关键能力与规格',
    subtitle: '多模态 + 长上下文',
  },
  {
    id: '03',
    type: 'distribution',
    meta: '发布入口',
    title: '渠道与生态',
    subtitle: 'App / API / 云',
  },
  {
    id: '04',
    type: 'benchmarks',
    meta: '评测对比',
    title: '3.1 Pro 领先点',
    subtitle: '官方评测 · 高推理模式',
    dark: true,
  },
  {
    id: '05',
    type: 'comparison_reasoning',
    meta: '全球对比',
    title: '推理 / 科学基准',
    subtitle: 'HLE · ARC-AGI-2 · GPQA',
  },
  {
    id: '06',
    type: 'comparison_coding',
    meta: '全球对比',
    title: '编码与工程能力',
    subtitle: 'SWE · Terminal · LCB',
  },
  {
    id: '07',
    type: 'comparison_tools',
    meta: '全球对比',
    title: '工具与检索能力',
    subtitle: 'BrowseComp · MCP · Tau2',
  },
  {
    id: '08',
    type: 'multimodal',
    meta: '全球对比',
    title: '多模态与长上下文',
    subtitle: 'MMMU · MMMLU · MRCR',
  },
  {
    id: '09',
    type: 'comparison_cn',
    meta: '国内开源对比',
    title: 'MiniMax M2.5 & GLM-5',
    subtitle: 'SWE · Terminal · BrowseComp',
  },
  {
    id: '10',
    type: 'dimensions',
    meta: '基准维度',
    title: '这些评测在测什么',
    subtitle: '解读指标',
  },
  {
    id: '11',
    type: 'summary',
    meta: '关键结论',
    title: '一句话看懂 3.1 Pro',
    subtitle: '核心收敛',
  },
  {
    id: '12',
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
      <div className={`text-[10px] uppercase tracking-[0.16em] leading-4 ${dark ? 'text-[#f2efe9]/60' : 'text-black/50'}`}>
        {label}
      </div>
      <div className="mt-1 font-display text-2xl leading-none">{value}</div>
      {hint ? <div className="mt-1 text-[11px] leading-5">{hint}</div> : null}
    </div>
  );
}

function LineItem({ num, title, text }) {
  return (
    <div className="grid grid-cols-[48px_1fr] gap-2.5">
      <div className="font-display text-[26px] leading-none text-brand">{num}</div>
      <div>
        <h3 className="text-base font-semibold leading-tight text-[#1a1a1a]">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-black/60">{text}</p>
      </div>
    </div>
  );
}

function MetricBars({ metric, rows, panel }) {
  const values = rows.map((row) => row.value).filter((value) => typeof value === 'number');
  const max = values.length ? Math.max(...values) : 1;
  return (
    <div className={`border ${panel} p-3`}>
      <div className="text-[10px] uppercase tracking-[0.16em] leading-4">{metric}</div>
      <div className="mt-3 space-y-2.5 text-xs">
        {rows.map((row) => {
          const hasValue = typeof row.value === 'number';
          const width = hasValue ? `${(row.value / max) * 100}%` : '0%';
          return (
            <div key={row.name} className="grid grid-cols-[112px_1fr_48px] items-center gap-2">
              <span className="truncate text-[11px] leading-4 text-black/70">{row.name}</span>
              <div className="h-2 rounded-full bg-black/10">
                <div
                  className={`h-2 rounded-full ${row.highlight ? 'bg-brand' : 'bg-black/30'}`}
                  style={{ width }}
                />
              </div>
              <span className="text-right text-[11px] tabular-nums text-black/60">{hasValue ? row.value : '—'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Gemini31Pro() {
  const [copyStatus, setCopyStatus] = useState('');
  const [exportStatus, setExportStatus] = useState('');
  const [exporting, setExporting] = useState(false);
  const [logoUrl, setLogoUrl] = useState(logoInline);

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
      console.warn('Gemini export: logo base64 failed', error);
    }
    return logoUrl;
  };

  const articleText = useMemo(
    () =>
      [
        'Gemini 3.1 Pro · 深度解读',
        '功能、评测与应用场景全梳理',
        '',
        '1. 模型定位',
        'Gemini 3.1 Pro 是 Gemini 3 系列的最新迭代，官方将其描述为“最先进的复杂任务模型”，重点提升多模态理解、长上下文与多步推理能力。',
        '',
        '2. 核心能力与上下文',
        '• 原生多模态：文本、图像、音频、视频与代码库。',
        '• 超长上下文：最高 1M 输入 / 64K 输出。',
        '• 复杂推理与规划：多步推理、策略规划与任务拆解。',
        '• 代理工作流：强调工具编排与自动化任务处理。',
        '• 高级编码能力：适合算法设计与代码库理解。',
        '',
        '3. 官方评测快照（对比 3 Pro）',
        '• ARC-AGI-2：77.1%（3.1 Pro）vs 31.1%（3 Pro）。',
        '• Humanity’s Last Exam：44.4%（3.1 Pro）vs 37.5%（3 Pro）。',
        '• GPQA Diamond：94.3%（3.1 Pro）vs 91.9%（3 Pro）。',
        '评测模式为“高推理模式”，复杂任务能力提升明显。',
        '',
        '4. 全球对比：推理 / 科学',
        '• HLE（无工具）：Gemini 44.4 · Opus 40.0 · Sonnet 33.2 · GPT-5.2 34.5。',
        '• ARC-AGI-2：Gemini 77.1 · Opus 68.8 · Sonnet 58.3 · GPT-5.2 52.9。',
        '• GPQA Diamond：Gemini 94.3 · Opus 91.3 · Sonnet 89.9 · GPT-5.2 92.4。',
        '',
        '5. 全球对比：编码 / 工程',
        '• SWE-Bench Verified：Gemini 80.6 · Opus 80.8 · Sonnet 79.6 · GPT-5.2 80.0。',
        '• Terminal-Bench 2.0：Gemini 68.5 · Opus 65.4 · Sonnet 59.1 · GPT-5.2 54.0。',
        '• SWE-Bench Pro：Gemini 54.2 · GPT-5.2 55.6 · GPT-5.3-Codex 56.8。',
        '• LiveCodeBench Pro（Elo）：Gemini 2887 · Gemini 3 Pro 2439 · GPT-5.2 2393。',
        '',
        '6. 全球对比：工具 / 检索 / 代理',
        '• BrowseComp：Gemini 85.9 · Opus 84.0 · Sonnet 74.7 · GPT-5.2 65.8。',
        '• MCP Atlas：Gemini 69.2 · Opus 59.5 · Sonnet 61.3 · GPT-5.2 60.6。',
        '• Tau2-bench（Retail）：Gemini 90.8 · Opus 91.9 · Sonnet 91.7 · GPT-5.2 82.0。',
        '• APEX-Agents：Gemini 33.5 · Opus 29.8 · GPT-5.2 23.0。',
        '',
        '7. 全球对比：多模态 / 多语言 / 长上下文',
        '• MMMU Pro：Gemini 80.5 · Opus 73.9 · Sonnet 74.5 · GPT-5.2 79.5。',
        '• MMMLU：Gemini 92.6 · Opus 91.1 · Sonnet 89.3 · GPT-5.2 89.6。',
        '• MRCR v2 (128k)：Gemini 84.9 · Opus 84.0 · Sonnet 84.9 · GPT-5.2 83.8。',
        '• MRCR v2 (1M)：Gemini 26.3（其他未支持）。',
        '',
        '8. 国内开源模型对比',
        '• SWE-Bench Verified：Gemini 80.6 · MiniMax M2.5 80.2 · GLM-5 77.8。',
        '• Terminal-Bench 2.0：Gemini 68.5 · GLM-5 56.2（M2.5 未公布）。',
        '• BrowseComp：Gemini 85.9 · MiniMax M2.5 76.3（GLM-5 未公布）。',
        '• Multi-SWE-Bench：MiniMax M2.5 51.3（GLM-5 未公布）。',
        '',
        '9. 基准维度说明',
        '• HLE / ARC-AGI-2 / GPQA：高阶推理与科学问题。',
        '• SWE / Terminal / LCB：代码修复与工程任务能力。',
        '• BrowseComp / MCP / Tau2：工具调用与检索能力。',
        '• MMMU / MMMLU：多模态与多语言广度。',
        '• MRCR v2：长上下文检索。',
        '',
        '10. 总结',
        '• 推理与科学基准保持第一梯队。',
        '• 工程/代理/工具能力适合真实工作流。',
        '• 多模态 + 1M 上下文形成整体优势。',
        '',
        '11. 渠道与阅读建议',
        '• 消费端：Gemini App、NotebookLM。',
        '• 开发者：Gemini API、Google AI Studio。',
        '• 命令行：Gemini CLI（Cloud Shell 可直接使用，其他环境可安装）。',
        '• 企业端：Google Cloud / Vertex AI。',
        '• 阅读榜单建议优先比较同一基准与同一设置。',
        '',
        '资料来源：Google DeepMind 模型卡与评测表（2026-02）、MiniMax M2.5 官方发布、GLM-5 官方文档。',
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
          console.warn('Gemini export: font ready failed', error);
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
        const dataUrl = await toPng(nodes[i], {
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
        });
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `gemini-3-1-pro-card-${String(i + 1).padStart(2, '0')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
      setExportStatus('已导出');
    } catch (error) {
      setExportStatus('导出失败');
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
              官方定位为“最先进的复杂任务模型”，核心优势是原生多模态 + 超长上下文 + 深度推理。
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <StatBlock label="输入上限" value="1M" hint="Tokens" dark={dark} />
              <StatBlock label="输出上限" value="64K" hint="Tokens" dark={dark} />
              <StatBlock
                label="输入形态"
                value="Text / Image / Audio / Video"
                hint="Codebase supported"
                dark={dark}
              />
              <StatBlock label="基础模型" value="Gemini 3 Pro" hint="能力继承 + 强化" dark={dark} />
            </div>
          </>
        );
      case 'spec':
        return (
          <div className="grid gap-4">
            <LineItem num="01" title="原生多模态" text="文本、图像、音频、视频、代码库可直接理解。" />
            <LineItem num="02" title="复杂推理" text="多步推理、策略规划与复杂问题拆解。" />
            <LineItem num="03" title="超长上下文" text="1M 输入 + 64K 输出，适合长文档与大资料库。" />
            <div className="grid grid-cols-2 gap-3">
              <div className={`border ${panel} p-3 text-xs`}>
                <div className="uppercase tracking-[0.2em]">输出形态</div>
                <div className="mt-1 text-base font-semibold text-[#1a1a1a]">文本为主</div>
              </div>
              <div className={`border ${panel} p-3 text-xs`}>
                <div className="uppercase tracking-[0.2em]">架构参考</div>
                <div className="mt-1 text-base font-semibold text-[#1a1a1a]">见 Gemini 3 Pro</div>
              </div>
            </div>
          </div>
        );
      case 'distribution':
        return (
          <div className="grid gap-4">
            <LineItem num="01" title="消费端" text="Gemini App、NotebookLM 提供体验入口。" />
            <LineItem num="02" title="开发者" text="Gemini API、Google AI Studio、Gemini CLI（Cloud Shell 即开即用）。" />
            <LineItem num="03" title="企业端" text="Google Cloud / Vertex AI 企业级接入。" />
            <div className={`border ${panel} p-3 text-xs`}>
              <div className="uppercase tracking-[0.2em]">生态入口</div>
              <div className="mt-1 text-base font-semibold text-[#1a1a1a]">Google Antigravity</div>
            </div>
          </div>
        );
      case 'benchmarks':
        return (
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-3">
              <StatBlock label="ARC-AGI-2" value="77.1%" hint="vs 31.1%" dark={dark} />
              <StatBlock label="HLE" value="44.4%" hint="vs 37.5%" dark={dark} />
              <StatBlock label="GPQA Diamond" value="94.3%" hint="vs 91.9%" dark={dark} />
              <StatBlock label="评测模式" value="高推理" hint="官方高推理设置" dark={dark} />
            </div>
            <div className={`border ${panel} p-3 text-xs`}>
              <div className="uppercase tracking-[0.2em]">对比 3 Pro</div>
              <div className="mt-1 text-sm">ARC-AGI-2、HLE、GPQA 三项基准均明显领先。</div>
            </div>
          </div>
        );
      case 'comparison_reasoning':
        return (
          <div className="grid gap-4">
            <MetricBars
              metric="HLE（无工具）"
              rows={[
                { name: 'Gemini 3.1 Pro', value: 44.4, highlight: true },
                { name: 'Opus 4.6', value: 40.0 },
                { name: 'Sonnet 4.6', value: 33.2 },
                { name: 'GPT-5.2', value: 34.5 },
              ]}
              panel={panel}
            />
            <MetricBars
              metric="ARC-AGI-2（抽象推理）"
              rows={[
                { name: 'Gemini 3.1 Pro', value: 77.1, highlight: true },
                { name: 'Opus 4.6', value: 68.8 },
                { name: 'Sonnet 4.6', value: 58.3 },
                { name: 'GPT-5.2', value: 52.9 },
              ]}
              panel={panel}
            />
            <MetricBars
              metric="GPQA Diamond（科学推理）"
              rows={[
                { name: 'Gemini 3.1 Pro', value: 94.3, highlight: true },
                { name: 'Opus 4.6', value: 91.3 },
                { name: 'Sonnet 4.6', value: 89.9 },
                { name: 'GPT-5.2', value: 92.4 },
              ]}
              panel={panel}
            />
            <div className={`border ${panel} p-3 text-xs`}>
              <div className="uppercase tracking-[0.2em]">说明</div>
              <div className="mt-1 text-sm">数据来自官方统一评测表，均为高推理设置。</div>
            </div>
          </div>
        );
      case 'comparison_coding':
        return (
          <div className="grid gap-4">
            <MetricBars
              metric="SWE-Bench Verified"
              rows={[
                { name: 'Gemini 3.1 Pro', value: 80.6, highlight: true },
                { name: 'Opus 4.6', value: 80.8 },
                { name: 'Sonnet 4.6', value: 79.6 },
                { name: 'GPT-5.2', value: 80.0 },
              ]}
              panel={panel}
            />
            <MetricBars
              metric="Terminal-Bench 2.0（Terminus-2）"
              rows={[
                { name: 'Gemini 3.1 Pro', value: 68.5, highlight: true },
                { name: 'Opus 4.6', value: 65.4 },
                { name: 'Sonnet 4.6', value: 59.1 },
                { name: 'GPT-5.2', value: 54.0 },
              ]}
              panel={panel}
            />
            <MetricBars
              metric="SWE-Bench Pro（Public）"
              rows={[
                { name: 'Gemini 3.1 Pro', value: 54.2, highlight: true },
                { name: 'GPT-5.2', value: 55.6 },
                { name: 'GPT-5.3-Codex', value: 56.8 },
              ]}
              panel={panel}
            />
            <MetricBars
              metric="LiveCodeBench Pro（Elo）"
              rows={[
                { name: 'Gemini 3.1 Pro', value: 2887, highlight: true },
                { name: 'Gemini 3 Pro', value: 2439 },
                { name: 'GPT-5.2', value: 2393 },
              ]}
              panel={panel}
            />
          </div>
        );
      case 'comparison_tools':
        return (
          <div className="grid gap-4">
            <MetricBars
              metric="BrowseComp（Search + Python）"
              rows={[
                { name: 'Gemini 3.1 Pro', value: 85.9, highlight: true },
                { name: 'Opus 4.6', value: 84.0 },
                { name: 'Sonnet 4.6', value: 74.7 },
                { name: 'GPT-5.2', value: 65.8 },
              ]}
              panel={panel}
            />
            <MetricBars
              metric="MCP Atlas"
              rows={[
                { name: 'Gemini 3.1 Pro', value: 69.2, highlight: true },
                { name: 'Opus 4.6', value: 59.5 },
                { name: 'Sonnet 4.6', value: 61.3 },
                { name: 'GPT-5.2', value: 60.6 },
              ]}
              panel={panel}
            />
            <MetricBars
              metric="Tau2-bench（Retail）"
              rows={[
                { name: 'Gemini 3.1 Pro', value: 90.8, highlight: true },
                { name: 'Opus 4.6', value: 91.9 },
                { name: 'Sonnet 4.6', value: 91.7 },
                { name: 'GPT-5.2', value: 82.0 },
              ]}
              panel={panel}
            />
            <MetricBars
              metric="APEX-Agents"
              rows={[
                { name: 'Gemini 3.1 Pro', value: 33.5, highlight: true },
                { name: 'Opus 4.6', value: 29.8 },
                { name: 'GPT-5.2', value: 23.0 },
              ]}
              panel={panel}
            />
          </div>
        );
      case 'multimodal':
        return (
          <div className="grid gap-4">
            <MetricBars
              metric="MMMU Pro（多模态推理）"
              rows={[
                { name: 'Gemini 3.1 Pro', value: 80.5, highlight: true },
                { name: 'Opus 4.6', value: 73.9 },
                { name: 'Sonnet 4.6', value: 74.5 },
                { name: 'GPT-5.2', value: 79.5 },
              ]}
              panel={panel}
            />
            <MetricBars
              metric="MMMLU（多语言）"
              rows={[
                { name: 'Gemini 3.1 Pro', value: 92.6, highlight: true },
                { name: 'Opus 4.6', value: 91.1 },
                { name: 'Sonnet 4.6', value: 89.3 },
                { name: 'GPT-5.2', value: 89.6 },
              ]}
              panel={panel}
            />
            <MetricBars
              metric="MRCR v2 128k（8 针检索）"
              rows={[
                { name: 'Gemini 3.1 Pro', value: 84.9, highlight: true },
                { name: 'Opus 4.6', value: 84.0 },
                { name: 'Sonnet 4.6', value: 84.9 },
                { name: 'GPT-5.2', value: 83.8 },
              ]}
              panel={panel}
            />
            <div className={`border ${panel} p-3 text-xs`}>
              <div className="uppercase tracking-[0.2em]">MRCR v2 1M</div>
              <div className="mt-1 text-sm">Gemini 3.1 Pro 为 26.3；其他模型未支持 1M 测试。</div>
            </div>
          </div>
        );
      case 'comparison_cn':
        return (
          <div className="grid gap-4">
            <MetricBars
              metric="SWE-Bench Verified"
              rows={[
                { name: 'Gemini 3.1 Pro', value: 80.6, highlight: true },
                { name: 'MiniMax M2.5', value: 80.2 },
                { name: 'GLM-5', value: 77.8 },
              ]}
              panel={panel}
            />
            <MetricBars
              metric="Terminal-Bench 2.0"
              rows={[
                { name: 'Gemini 3.1 Pro', value: 68.5, highlight: true },
                { name: 'GLM-5', value: 56.2 },
                { name: 'MiniMax M2.5', value: null },
              ]}
              panel={panel}
            />
            <MetricBars
              metric="BrowseComp"
              rows={[
                { name: 'Gemini 3.1 Pro', value: 85.9, highlight: true },
                { name: 'MiniMax M2.5', value: 76.3 },
                { name: 'GLM-5', value: null },
              ]}
              panel={panel}
            />
            <div className={`border ${panel} p-3 text-xs`}>
              <div className="uppercase tracking-[0.2em]">补充</div>
              <div className="mt-1 text-sm">MiniMax 公布 Multi-SWE-Bench 51.3；GLM-5 未公开 Multi-SWE-Bench/BrowseComp 数值。</div>
            </div>
          </div>
        );
      case 'dimensions':
        return (
          <div className="grid gap-4">
            <div className={`border ${panel} p-3 text-xs`}>
              <div className="uppercase tracking-[0.2em]">HLE / ARC-AGI-2 / GPQA</div>
              <div className="mt-1 text-sm">高阶推理与科学问题的综合能力。</div>
            </div>
            <div className={`border ${panel} p-3 text-xs`}>
              <div className="uppercase tracking-[0.2em]">SWE / Terminal / LCB</div>
              <div className="mt-1 text-sm">代码修复、工程任务与代理执行能力。</div>
            </div>
            <div className={`border ${panel} p-3 text-xs`}>
              <div className="uppercase tracking-[0.2em]">BrowseComp / MCP / Tau2</div>
              <div className="mt-1 text-sm">工具调用、检索与任务流程表现。</div>
            </div>
            <div className={`border ${panel} p-3 text-xs`}>
              <div className="uppercase tracking-[0.2em]">MMMU / MMMLU</div>
              <div className="mt-1 text-sm">多模态理解与多语言广度。</div>
            </div>
            <div className={`border ${panel} p-3 text-xs`}>
              <div className="uppercase tracking-[0.2em]">MRCR v2</div>
              <div className="mt-1 text-sm">长上下文检索与多针定位能力。</div>
            </div>
            <div className={`border ${panel} p-3 text-xs`}>
              <div className="uppercase tracking-[0.2em]">阅读建议</div>
              <div className="mt-1 text-sm">优先比较同一基准、同一设置与同一脚手架。</div>
            </div>
          </div>
        );
      case 'summary':
        return (
          <div className="grid gap-4">
            <div className={`border ${panel} p-4`}>
              <div className="text-xs uppercase tracking-[0.2em]">结论 01</div>
              <div className="mt-2 text-base font-semibold text-[#1a1a1a]">推理与科学基准保持领先</div>
              <p className="mt-2 text-sm text-black/60">HLE、ARC-AGI-2、GPQA 三项高阶推理维度位居第一梯队。</p>
            </div>
            <div className={`border ${panel} p-4`}>
              <div className="text-xs uppercase tracking-[0.2em]">结论 02</div>
              <div className="mt-2 text-base font-semibold text-[#1a1a1a]">工程与代理能力可落地</div>
              <p className="mt-2 text-sm text-black/60">SWE、Terminal、LCB 与工具型基准表现稳定，适合真实工作流。</p>
            </div>
            <div className={`border ${panel} p-4`}>
              <div className="text-xs uppercase tracking-[0.2em]">结论 03</div>
              <div className="mt-2 text-base font-semibold text-[#1a1a1a]">多模态 + 1M 上下文形成优势</div>
              <p className="mt-2 text-sm text-black/60">长上下文与多模态叠加，覆盖复杂资料理解与跨模态应用。</p>
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
            <BlogPosterDeck
              cards={cards}
              showMobileHint
              renderCard={(card, { scale }) => (
                <BlogPosterCard
                  card={card}
                  scale={scale}
                  logoUrl={logoUrl}
                  coverBadgeText="旗舰特辑"
                  coverDecoration={
                    <div className="pointer-events-none absolute left-8 bottom-28 font-serif text-[64px] text-black/10">
                      CYBER
                    </div>
                  }
                >
                  {renderBody(card)}
                </BlogPosterCard>
              )}
              controls={
                <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
                  <button type="button" onClick={handleCopy} className="soft-button soft-button-primary">
                    一键复制文章内容
                  </button>
                  <button type="button" onClick={handleExport} className="soft-button soft-button-secondary">
                    {exporting ? '正在导出…' : '一键导出卡片图片'}
                  </button>
                  {(copyStatus || exportStatus) && (
                    <span className="text-xs text-muted">{copyStatus || exportStatus}</span>
                  )}
                </div>
              }
            />
          </section>

        <article className="mt-10 glass-card rounded-3xl p-6">
          <header className="border-b border-black/10 pb-6">
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-brand-dark">
              <span className="rounded-full border border-brand/30 bg-brand/10 px-3 py-1 font-semibold">深度解读</span>
              <span>Gemini 3.1 Pro</span>
              <span className="text-black/40">·</span>
              <span>2026-02</span>
            </div>
            <h1 className="mt-3 font-serif text-3xl text-ink">功能、评测与<span className="theme-gradient-text">应用场景</span>全梳理</h1>
            <p className="mt-3 text-sm text-muted">
              本文基于官方模型卡整理，聚焦 Gemini 3.1 Pro 的核心能力、关键指标、评测对比与适用场景，
              方便阅读与转述。
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted">
              <span>更新：2026-02</span>
              <span>阅读：深度长文</span>
              <span>主题：推理 / 基准 / 生态</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {['旗舰模型', '多模态', '长上下文', '基准评测'].map((tag) => (
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
                  以“推理能力 + 工程执行”为主线梳理 Gemini 3.1 Pro 的核心能力，并结合官方基准与竞品对比，
                  帮助快速判断适配的应用场景与落地价值。
                </p>
              </div>

              <div id="g31-1">
                <h2 className="text-base font-semibold text-ink">1. 模型定位</h2>
                <p>
                  Gemini 3.1 Pro 是 Gemini 3 系列的最新迭代，官方定位为“最先进的复杂任务模型”，重点提升多模态理解、
                  长上下文与多步推理能力。
                </p>
              </div>

              <div id="g31-2">
                <h2 className="text-base font-semibold text-ink">2. 核心能力与上下文</h2>
                <ul className="mt-2 space-y-2">
                  <li>• 原生多模态：文本、图像、音频、视频与代码库。</li>
                  <li>• 超长上下文：最大输入 1M token，最大输出 64K token。</li>
                  <li>• 复杂推理与规划：多步推理、策略规划与任务拆解。</li>
                  <li>• 代理工作流与编码：强调工具编排与工程化能力。</li>
                </ul>
              </div>

              <div id="g31-3">
                <h2 className="text-base font-semibold text-ink">3. 官方评测对比（对比 3 Pro）</h2>
                <ul className="mt-2 space-y-2">
                  <li>• ARC-AGI-2：77.1% vs 31.1%。</li>
                  <li>• Humanity’s Last Exam：44.4% vs 37.5%。</li>
                  <li>• GPQA Diamond：94.3% vs 91.9%。</li>
                </ul>
                <p className="mt-2">评测模式为“高推理模式”，复杂任务能力提升明显。</p>
              </div>

              <div id="g31-4">
                <h2 className="text-base font-semibold text-ink">4. 全球对比：推理 / 科学</h2>
                <ul className="mt-2 space-y-2">
                  <li>• HLE（无工具）：Gemini 44.4 · Opus 40.0 · Sonnet 33.2 · GPT-5.2 34.5</li>
                  <li>• ARC-AGI-2：Gemini 77.1 · Opus 68.8 · Sonnet 58.3 · GPT-5.2 52.9</li>
                  <li>• GPQA Diamond：Gemini 94.3 · Opus 91.3 · Sonnet 89.9 · GPT-5.2 92.4</li>
                </ul>
              </div>

              <div id="g31-5">
                <h2 className="text-base font-semibold text-ink">5. 全球对比：编码 / 工程</h2>
                <ul className="mt-2 space-y-2">
                  <li>• SWE-Bench Verified：Gemini 80.6 · Opus 80.8 · Sonnet 79.6 · GPT-5.2 80.0</li>
                  <li>• Terminal-Bench 2.0：Gemini 68.5 · Opus 65.4 · Sonnet 59.1 · GPT-5.2 54.0</li>
                  <li>• SWE-Bench Pro：Gemini 54.2 · GPT-5.2 55.6 · GPT-5.3-Codex 56.8</li>
                  <li>• LiveCodeBench Pro（Elo）：Gemini 2887 · Gemini 3 Pro 2439 · GPT-5.2 2393</li>
                </ul>
              </div>

              <div id="g31-6">
                <h2 className="text-base font-semibold text-ink">6. 全球对比：工具 / 检索 / 代理</h2>
                <ul className="mt-2 space-y-2">
                  <li>• BrowseComp：Gemini 85.9 · Opus 84.0 · Sonnet 74.7 · GPT-5.2 65.8</li>
                  <li>• MCP Atlas：Gemini 69.2 · Opus 59.5 · Sonnet 61.3 · GPT-5.2 60.6</li>
                  <li>• Tau2-bench（Retail）：Gemini 90.8 · Opus 91.9 · Sonnet 91.7 · GPT-5.2 82.0</li>
                  <li>• APEX-Agents：Gemini 33.5 · Opus 29.8 · GPT-5.2 23.0</li>
                </ul>
              </div>

              <div id="g31-7">
                <h2 className="text-base font-semibold text-ink">7. 全球对比：多模态 / 多语言 / 长上下文</h2>
                <ul className="mt-2 space-y-2">
                  <li>• MMMU Pro：Gemini 80.5 · Opus 73.9 · Sonnet 74.5 · GPT-5.2 79.5</li>
                  <li>• MMMLU：Gemini 92.6 · Opus 91.1 · Sonnet 89.3 · GPT-5.2 89.6</li>
                  <li>• MRCR v2 (128k)：Gemini 84.9 · Opus 84.0 · Sonnet 84.9 · GPT-5.2 83.8</li>
                  <li>• MRCR v2 (1M)：Gemini 26.3（其他未支持）</li>
                </ul>
              </div>

              <div id="g31-8">
                <h2 className="text-base font-semibold text-ink">8. 国内开源模型对比</h2>
                <ul className="mt-2 space-y-2">
                  <li>• SWE-Bench Verified：Gemini 80.6 · MiniMax M2.5 80.2 · GLM-5 77.8</li>
                  <li>• Terminal-Bench 2.0：Gemini 68.5 · GLM-5 56.2（M2.5 未公布）</li>
                  <li>• BrowseComp：Gemini 85.9 · MiniMax M2.5 76.3（GLM-5 未公布）</li>
                  <li>• Multi-SWE-Bench：MiniMax M2.5 51.3（GLM-5 未公布）</li>
                </ul>
              </div>

              <div id="g31-9">
                <h2 className="text-base font-semibold text-ink">9. 基准维度说明</h2>
                <ul className="mt-2 space-y-2">
                  <li>• HLE / ARC-AGI-2 / GPQA：高阶推理与科学问题。</li>
                  <li>• SWE / Terminal / LCB：代码修复与工程任务能力。</li>
                  <li>• BrowseComp / MCP / Tau2：工具调用与检索能力。</li>
                  <li>• MMMU / MMMLU：多模态与多语言广度。</li>
                  <li>• MRCR v2：长上下文检索。</li>
                </ul>
              </div>

              <div id="g31-10">
                <h2 className="text-base font-semibold text-ink">10. 总结</h2>
                <ul className="mt-2 space-y-2">
                  <li>• 推理与科学基准保持第一梯队。</li>
                  <li>• 工程/代理/工具能力适合真实工作流。</li>
                  <li>• 多模态 + 1M 上下文形成整体优势。</li>
                </ul>
              </div>

              <div id="g31-11">
                <h2 className="text-base font-semibold text-ink">11. 渠道与阅读建议</h2>
                <ul className="mt-2 space-y-2">
                  <li>• 消费端：Gemini App、NotebookLM。</li>
                  <li>• 开发者：Gemini API、Google AI Studio。</li>
                  <li>• 命令行：Gemini CLI（Cloud Shell 可直接使用，其他环境可安装）。</li>
                  <li>• 企业端：Google Cloud / Vertex AI。</li>
                  <li>• 阅读榜单建议优先比较同一基准与同一设置。</li>
                </ul>
              </div>
            </section>

            <aside className="space-y-4">
              <div className="sticky top-6 space-y-4">
                <div className="glass-card rounded-2xl p-4">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-black/60">目录</h3>
                  <ul className="mt-3 space-y-2 text-xs text-black/60">
                    <li><a className="transition hover:text-brand" href="#g31-1">01 模型定位</a></li>
                    <li><a className="transition hover:text-brand" href="#g31-2">02 核心能力</a></li>
                    <li><a className="transition hover:text-brand" href="#g31-3">03 官方评测</a></li>
                    <li><a className="transition hover:text-brand" href="#g31-4">04 推理 / 科学</a></li>
                    <li><a className="transition hover:text-brand" href="#g31-5">05 编码 / 工程</a></li>
                    <li><a className="transition hover:text-brand" href="#g31-6">06 工具 / 代理</a></li>
                    <li><a className="transition hover:text-brand" href="#g31-7">07 多模态</a></li>
                    <li><a className="transition hover:text-brand" href="#g31-8">08 国内对比</a></li>
                    <li><a className="transition hover:text-brand" href="#g31-9">09 基准说明</a></li>
                    <li><a className="transition hover:text-brand" href="#g31-10">10 总结</a></li>
                    <li><a className="transition hover:text-brand" href="#g31-11">11 渠道建议</a></li>
                  </ul>
                </div>

                <div className="glass-card rounded-2xl p-4">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-black/60">关键结论</h3>
                  <ul className="mt-3 space-y-2 text-xs text-black/70">
                    <li>• 推理与科学基准领先。</li>
                    <li>• 工具与工程能力面向真实工作流。</li>
                    <li>• 多模态 + 1M 上下文保持优势。</li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>

          <footer className="mt-6 border-t border-black/10 pt-4 text-xs text-muted">
            资料来源：Google DeepMind 模型卡与评测表（2026-02）、MiniMax M2.5 官方发布、GLM-5 官方文档。
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
