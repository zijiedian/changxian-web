import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { addProject, deleteProject, loadProjects } from '../utils/projects.js';

const PROMPT_LIBRARY = [
  {
    id: 'editorial_modern',
    title: '现代社论',
    desc: '现代社论 + 瑞士风',
    scene: '深度解读 / 评论',
    mode: 'raw',
    prompt: `Role
你是「高级社论视觉设计师」。将用户提供的【文本内容】转化为多张高审美杂志风 HTML5 信息海报。

Design System
1. 核心风格
风格: Modern Editorial + Swiss Style
视觉: 高对比、秩序感、大字号排版、纸媒质感。
尺寸: width: 600px, height: 800px (3:4)。

2. 配色
Bg: #f2efe9 纸张米白
Text: #1a1a1a 深灰
Accent: #d95e00 爱马仕橙（可微调）
节奏: 亮-亮-暗-亮 或 亮-暗-亮，避免单调。

3. 字体 (CDN)
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@700;900&family=Noto+Sans+SC:wght@400;500;700&family=Oswald:wght@500;700&display=swap" rel="stylesheet">

4. 质感
Noise: feTurbulence 0.05~0.08, multiply
Shadow: 统一深邃阴影

Pagination Logic
Card 1: 封面（主标题 + 极短副标）
Card 2~N-1: 内容页（单一观点一张；列表 01/02/03；图文混排）
必须包含 1 张 Dark Mode
Card N: 封底（总结/CTA）

Output Requirements
Output: 单个 HTML 文件，包含 CSS/JS。
Library: Tailwind CSS + FontAwesome (CDN)。
Layout: 横向滑动；.wx-cards 需 display:flex; flex-wrap:nowrap; gap:24px; overflow-x:auto; overflow-y:hidden; scroll-snap-type:x mandatory；padding 只保留左右（如 padding: 0 28px）。
.wx-card 需 flex-shrink:0; scroll-snap-align:start。
Size: 600x800。
Mobile: @media (max-width: 640px) 缩小字号与内边距，.wx-card 使用 width: min(90vw, 600px); height: min(120vw, 800px)。
No overflow: 禁止在 body 上使用 overflow: hidden。
No Explanations.

Input Content
[在此处粘贴你的内容]`,
  },
  {
    id: 'editorial_mono',
    title: '黑白极简',
    desc: '黑白高对比、极简留白',
    scene: '观点 / 纪要',
    mode: 'raw',
    prompt: `Role
你是「高级社论视觉设计师」。将【文本内容】转化为黑白极简社论海报。

Design System
1. 核心风格
风格: Monochrome Editorial + Swiss Minimal
视觉: 极简留白、强层级、黑白对比、理性秩序。
尺寸: width: 600px, height: 800px (3:4)。

2. 配色
Bg: #f7f7f5
Text: #111111
Accent: #111111（仅用作强调）
节奏: 白-白-黑-白（必须有一张深色卡）。

3. 字体 (CDN)
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@700;900&family=Noto+Sans+SC:wght@400;500;700&family=Oswald:wght@500;700&display=swap" rel="stylesheet">

4. 质感
细颗粒噪点 + 细线分割（hairline）

Pagination Logic
Card 1: 封面（超大标题 + 极短副标）
Card 2~N-1: 观点拆分（列表 + 引用）
Card N: 封底（总结/CTA）

Output Requirements
Output: 单个 HTML 文件，包含 CSS/JS。
Library: Tailwind CSS + FontAwesome (CDN)。
Layout: 横向滑动；.wx-cards 需 display:flex; flex-wrap:nowrap; gap:24px; overflow-x:auto; overflow-y:hidden; scroll-snap-type:x mandatory；padding 只保留左右（如 padding: 0 28px）。
.wx-card 需 flex-shrink:0; scroll-snap-align:start。
Size: 600x800。
Mobile: @media (max-width: 640px) 缩小字号与内边距，.wx-card 使用 width: min(90vw, 600px); height: min(120vw, 800px)。
No overflow: 禁止在 body 上使用 overflow: hidden。
No Explanations.

Input Content
[在此处粘贴你的内容]`,
  },
  {
    id: 'editorial_data',
    title: '数据报道',
    desc: '数据感 + 图表块',
    scene: '评测 / 榜单',
    mode: 'raw',
    prompt: `Role
你是「高级社论视觉设计师」。将【文本内容】转化为数据报道风社论海报。

Design System
1. 核心风格
风格: Data Journalism + Editorial Grid
视觉: 数据块、网格、数值主导、强对齐。
尺寸: width: 600px, height: 800px (3:4)。

2. 配色
Bg: #f4f1ea
Text: #1a1a1a
Accent: #1e3a8a（深蓝，可微调）
节奏: 亮-暗-亮（至少一张深色数据卡）。

3. 字体 (CDN)
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@700;900&family=Noto+Sans+SC:wght@400;500;700&family=Oswald:wght@500;700&display=swap" rel="stylesheet">

4. 质感
细网格背景 + 轻噪点

Pagination Logic
Card 1: 封面（标题 + 数据关键字）
Card 2~N-1: 数据页（数值块 + 对比条形/表格块）
Card N: 封底（总结 + 关键指标）

Output Requirements
Output: 单个 HTML 文件，包含 CSS/JS。
Library: Tailwind CSS + FontAwesome (CDN)。
Layout: 横向滑动；.wx-cards 需 display:flex; flex-wrap:nowrap; gap:24px; overflow-x:auto; overflow-y:hidden; scroll-snap-type:x mandatory；padding 只保留左右（如 padding: 0 28px）。
.wx-card 需 flex-shrink:0; scroll-snap-align:start。
Size: 600x800。
Mobile: @media (max-width: 640px) 缩小字号与内边距，.wx-card 使用 width: min(90vw, 600px); height: min(120vw, 800px)。
No overflow: 禁止在 body 上使用 overflow: hidden。
No Explanations.

Input Content
[在此处粘贴你的内容]`,
  },
  {
    id: 'editorial_tech',
    title: '科技蓝图',
    desc: '科技蓝 + 网格线',
    scene: '科技 / 产品',
    mode: 'raw',
    prompt: `Role
你是「高级社论视觉设计师」。将【文本内容】转化为科技蓝图社论海报。

Design System
1. 核心风格
风格: Tech Blueprint + Editorial
视觉: 网格线、工程感、模块化信息块。
尺寸: width: 600px, height: 800px (3:4)。

2. 配色
Bg: #eef2ff
Text: #111827
Accent: #2563eb（科技蓝）
节奏: 亮-暗-亮（包含一张深蓝卡）。

3. 字体 (CDN)
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@700;900&family=Noto+Sans+SC:wght@400;500;700&family=Oswald:wght@500;700&display=swap" rel="stylesheet">

4. 质感
蓝图网格 + 轻噪点

Pagination Logic
Card 1: 封面（标题 + 模型/产品关键词）
Card 2~N-1: 模块页（能力/参数/场景）
Card N: 封底（总结/CTA）

Output Requirements
Output: 单个 HTML 文件，包含 CSS/JS。
Library: Tailwind CSS + FontAwesome (CDN)。
Layout: 横向滑动；.wx-cards 需 display:flex; flex-wrap:nowrap; gap:24px; overflow-x:auto; overflow-y:hidden; scroll-snap-type:x mandatory；padding 只保留左右（如 padding: 0 28px）。
.wx-card 需 flex-shrink:0; scroll-snap-align:start。
Size: 600x800。
Mobile: @media (max-width: 640px) 缩小字号与内边距，.wx-card 使用 width: min(90vw, 600px); height: min(120vw, 800px)。
No overflow: 禁止在 body 上使用 overflow: hidden。
No Explanations.

Input Content
[在此处粘贴你的内容]`,
  },
  {
    id: 'editorial_collage',
    title: '先锋拼贴',
    desc: '实验排版 + 拼贴感',
    scene: '品牌 / 故事',
    mode: 'raw',
    prompt: `Role
你是「高级社论视觉设计师」。将【文本内容】转化为先锋拼贴风社论海报。

Design System
1. 核心风格
风格: Avant-garde Collage + Editorial
视觉: 层叠排版、错位块、手工拼贴质感。
尺寸: width: 600px, height: 800px (3:4)。

2. 配色
Bg: #f4efe6
Text: #1a1a1a
Accent: #d9480f（暖橙）或 #0f766e（青绿）
节奏: 亮-暗-亮（含一张深色卡）。

3. 字体 (CDN)
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@700;900&family=Noto+Sans+SC:wght@400;500;700&family=Oswald:wght@500;700&display=swap" rel="stylesheet">

4. 质感
纸张噪点 + 撕边/遮挡效果（用块状装饰模拟）

Pagination Logic
Card 1: 封面（巨型标题 + 夸张副标）
Card 2~N-1: 内容页（分块错位、局部高亮）
Card N: 封底（简短总结）

Output Requirements
Output: 单个 HTML 文件，包含 CSS/JS。
Library: Tailwind CSS + FontAwesome (CDN)。
Layout: 横向滑动；.wx-cards 需 display:flex; flex-wrap:nowrap; gap:24px; overflow-x:auto; overflow-y:hidden; scroll-snap-type:x mandatory；padding 只保留左右（如 padding: 0 28px）。
.wx-card 需 flex-shrink:0; scroll-snap-align:start。
Size: 600x800。
Mobile: @media (max-width: 640px) 缩小字号与内边距，.wx-card 使用 width: min(90vw, 600px); height: min(120vw, 800px)。
No overflow: 禁止在 body 上使用 overflow: hidden。
No Explanations.

Input Content
[在此处粘贴你的内容]`,
  },
  {
    id: 'editorial_soft',
    title: '柔和杂志',
    desc: '柔和纸感 + 温润色',
    scene: '访谈 / 洞察',
    mode: 'raw',
    prompt: `Role
你是「高级社论视觉设计师」。将【文本内容】转化为柔和杂志风社论海报。

Design System
1. 核心风格
风格: Soft Editorial + Paper Texture
视觉: 温润色调、细线分区、轻对比、留白舒展。
尺寸: width: 600px, height: 800px (3:4)。

2. 配色
Bg: #f6f1ea
Text: #1f1f1f
Accent: #b45309（暖棕）
节奏: 亮-亮-暗-亮（含一张暗色卡）。

3. 字体 (CDN)
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@700;900&family=Noto+Sans+SC:wght@400;500;700&family=Oswald:wght@500;700&display=swap" rel="stylesheet">

4. 质感
纸感纹理 + 柔和阴影

Pagination Logic
Card 1: 封面（主标题 + 轻量副标）
Card 2~N-1: 观点页（分区块 + 引用框）
Card N: 封底（总结 + 轻 CTA）

Output Requirements
Output: 单个 HTML 文件，包含 CSS/JS。
Library: Tailwind CSS + FontAwesome (CDN)。
Layout: 横向滑动；.wx-cards 需 display:flex; flex-wrap:nowrap; gap:24px; overflow-x:auto; overflow-y:hidden; scroll-snap-type:x mandatory；padding 只保留左右（如 padding: 0 28px）。
.wx-card 需 flex-shrink:0; scroll-snap-align:start。
Size: 600x800。
Mobile: @media (max-width: 640px) 缩小字号与内边距，.wx-card 使用 width: min(90vw, 600px); height: min(120vw, 800px)。
No overflow: 禁止在 body 上使用 overflow: hidden。
No Explanations.

Input Content
[在此处粘贴你的内容]`,
  },
];

const AI_PROMPT_TEMPLATE = `你是微信公众号图文卡片编辑，请根据“风格指令 + 文章内容”直接生成可发布的图文卡片。

风格指令：
{{stylePrompt}}

要求：
1. 生成封面卡片的标题与副标题，标题简洁有力，副标题不超过 40 字。
2. 将内容组织为多张卡片，每张卡片有 1 个小标题与 3~4 条要点。
3. 输出单个 HTML 文件，包含所有 CSS/JS。
4. 必须使用 Tailwind CSS + FontAwesome (CDN)。
5. Layout: 采用横向滑动卡片布局（不换行）。
6. 外层容器 class=\"wx-cards\"，CSS 必须设置 display:flex; flex-wrap:nowrap; gap:24px; overflow-x:auto; overflow-y:hidden; scroll-snap-type:x mandatory；padding 只保留左右（如 padding: 0 28px）。
7. 每张卡片 class=\"wx-card\"，CSS 必须设置 flex-shrink:0; scroll-snap-align:start。
8. 卡片尺寸固定 width: 600px, height: 800px (3:4 比例)。
9. No Explanations: 不要在代码外输出任何解释性文字。
10. Mobile: 必须提供 @media (max-width: 640px) 的移动端样式，降低内边距与字号，.wx-card 宽高用 width: min(90vw, 600px); height: min(120vw, 800px); 并将 .wx-cards 的 gap / padding 缩小。
11. 禁止在 body 或 .wx-cards 上使用 overflow: hidden，确保横向滑动不被截断。

文章内容：
{{article}}
`;

const buildPrompt = (article, promptSpec) => {
  const content = article && article.trim() ? article.trim() : '（暂无内容）';
  if (promptSpec?.mode === 'raw') {
    const rawPrompt = promptSpec.prompt || '';
    if (!rawPrompt) return content;
    if (rawPrompt.includes('[在此处粘贴你的内容]')) {
      return rawPrompt.replace('[在此处粘贴你的内容]', content);
    }
    return `${rawPrompt}\n\nInput Content\n${content}`;
  }
  const style = promptSpec?.prompt || '用清晰专业的表达生成卡片内容。';
  return AI_PROMPT_TEMPLATE.replace('{{article}}', content).replace('{{stylePrompt}}', style);
};

const PRESET_ARTICLES = {
  default: `AI 产品上新如何快速判断是否值得尝试？\n抓住三个重点：性能、成本、场景适配。\n第一，性能要看推理速度与质量稳定性。\n第二，成本要看单位请求价格与上下文上限。\n第三，场景适配要看是否支持工具调用与长任务。\n最后，用小规模试点验证，优先选择能带来效率提升的能力。`,
  'gemini-3-1-pro': `Gemini 3.1 Pro 新模型：功能、对比与应用场景\n我们从推理能力、上下文长度、工具调用与安全评估四个维度进行评测。\n结论：在多轮推理与工具链路上表现稳定，但成本需要结合场景评估。\n对比竞品：在长上下文与多模态上优势明显。\n适用场景：复杂任务自动化、长文档分析、企业级知识检索。`,
  'minimax-2026': `MiniMax：2026年2月模型谱系与梯队位置\nM2.5旗舰、M1开源推理与多模态矩阵\n\n公司信息：全称上海稀宇科技有限公司，又名稀宇科技。\n上市信息：1月9号在香港联合交易所主板挂牌上市，股票简称 MINIMAX-WP，股票代码 00100。\n公司定位：全球 AI 基础模型公司，使命 Intelligence with Everyone。\n规模数据：累计服务 2.12 亿用户，覆盖 200+ 国家/地区，13 万+ 企业与开发者。\n产品矩阵：Agent / Hailuo AI / MiniMax Audio / Talkie / 开放平台。\n\n2026-02：M2.5 与 M2.5-highspeed 发布，主攻编程、工具调用、搜索、办公场景。\nM2.5 指标：SWE-Bench Verified 80.2%，Multi-SWE 51.3%，BrowseComp 76.3%。\nM2.5 重点：强调脚手架泛化（Droid/OpenCode）与效率提升（速度 +37%）。\n\n2025-12：M2.1 为多语言编程与复杂任务主力。\n2025-06：M1 开源混合架构推理模型，1M 上下文输入 + 80K 推理输出。\n多模态更新：Hailuo 2.3（视频）、Speech 2.6（语音）、Music 2.5（音乐）。\n\n梯队判断：M2.5 进入生产力旗舰第一梯队；M1 处于开源推理领先梯队。\n结论：多模态矩阵 + 生产力导向成为 MiniMax 主要护城河。\n阅读建议：对比同一基准与脚手架，关注效率与稳定性。`,
};

const stripCodeFence = (value) => {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed.startsWith('```')) return trimmed;
  const lines = trimmed.split(/\r?\n/);
  if (lines[0].startsWith('```')) {
    lines.shift();
  }
  if (lines.length && lines[lines.length - 1].startsWith('```')) {
    lines.pop();
  }
  return lines.join('\n').trim();
};

const buildProjectId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `project-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const formatDateTime = (value) => {
  try {
    return new Date(value).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    return String(value);
  }
};

const normalizeText = (value) => (typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '');

const extractTitleFromHtml = (html) => {
  if (!html) return '';
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const candidate = doc.body?.querySelector('h1, h2, h3, .title, .cover-title, .headline');
    return normalizeText(candidate?.textContent || '');
  } catch (error) {
    return '';
  }
};

const buildProject = ({ html, article, promptSpec, promptText }) => {
  const articleText = normalizeText(article);
  const titleFromHtml = extractTitleFromHtml(html);
  const titleFromArticle = articleText ? articleText.split('。')[0]?.slice(0, 30) : '';
  const fallbackTitle = promptSpec?.title ? `${promptSpec.title} · 图文项目` : '图文卡片项目';
  const title = titleFromHtml || titleFromArticle || fallbackTitle;
  const summary = articleText ? articleText.slice(0, 120) : '';
  return {
    id: buildProjectId(),
    title,
    summary,
    html,
    promptText: promptText || '',
    promptId: promptSpec?.id || '',
    promptTitle: promptSpec?.title || '',
    chatMessages: [],
    brandName: '尝鲜AI',
    brandDesc: '品牌调节助手',
    brandAvatar: '/logo.png',
    createdAt: formatDateTime(Date.now()),
  };
};

export default function Generator() {
  const isLoggedIn = Boolean(localStorage.getItem('token'));
  const [searchParams] = useSearchParams();
  const [articleText, setArticleText] = useState('');
  const [generateStatus, setGenerateStatus] = useState('');
  const [generating, setGenerating] = useState(false);
  const [contentGenerating, setContentGenerating] = useState(false);
  const [contentStatus, setContentStatus] = useState('');
  const [promptId, setPromptId] = useState(PROMPT_LIBRARY[0].id);
  const [promptStatus, setPromptStatus] = useState('');
  const [projects, setProjects] = useState([]);
  const [articleTopic, setArticleTopic] = useState('');
  const navigate = useNavigate();

  const selectedPrompt = useMemo(
    () => PROMPT_LIBRARY.find((item) => item.id === promptId),
    [promptId],
  );
  const promptText = useMemo(() => buildPrompt(articleText, selectedPrompt), [articleText, selectedPrompt]);
  const statusText = [generateStatus].filter(Boolean).join(' · ');
  const presetId = useMemo(() => searchParams.get('preset') || '', [searchParams]);
  const sampleText = useMemo(() => PRESET_ARTICLES[presetId] || PRESET_ARTICLES.default, [presetId]);
  const errorHint = generateStatus && (generateStatus.includes('失败') || generateStatus.includes('请先'));

  useEffect(() => {
    setProjects(loadProjects());
  }, []);

  useEffect(() => {
    if (presetId && PRESET_ARTICLES[presetId]) {
      setArticleText(PRESET_ARTICLES[presetId]);
      setGenerateStatus('已填充示例');
    }
  }, [presetId]);

  const handleGenerate = async () => {
    if (!articleText.trim()) {
      setGenerateStatus('请先输入文章内容');
      return;
    }
    if (generating) return;
    setGenerating(true);
    setGenerateStatus('');
    setPromptStatus('');
    try {
      const response = await fetch('/api/generate-cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: promptText,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || '生成失败');
      }
      const html = stripCodeFence(payload?.result);
      if (!html) {
        throw new Error('AI 未返回 HTML，请重试');
      }
      const project = buildProject({ html, article: articleText, promptSpec: selectedPrompt, promptText });
      const nextProjects = addProject(project);
      setProjects(nextProjects);
      setGenerateStatus('已生成并保存，正在打开预览...');
      navigate(`/projects/${project.id}`);
    } catch (error) {
      setGenerateStatus(error?.message || '生成失败');
    } finally {
      setGenerating(false);
    }
  };

  const buildArticlePrompt = (topic) => `你是中文内容编辑，请基于主题生成适合图文卡片的文章内容。
输出要求：
1. 只输出纯文本，不要 Markdown 或编号。
2. 第 1 行：主标题（不超过 18 字）。
3. 第 2 行：副标题（不超过 24 字）。
4. 第 3 行起：每行一个要点/句子，共 12-16 行，表达清晰、适合图文卡片拆分。
主题：${topic}`;

  const handleGenerateArticle = async () => {
    const topic = articleTopic.trim();
    if (!topic) {
      setContentStatus('请先输入主题/关键词');
      return;
    }
    if (contentGenerating) return;
    setContentGenerating(true);
    setContentStatus('');
    try {
      const response = await fetch('/api/generate-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: buildArticlePrompt(topic) }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || '生成失败');
      }
      const text = stripCodeFence(payload?.result);
      if (!text) {
        throw new Error('AI 未返回内容');
      }
      setArticleText(text);
      setGenerateStatus('');
      setContentStatus('已生成内容');
    } catch (error) {
      setContentStatus(error?.message || '生成失败');
    } finally {
      setContentGenerating(false);
    }
  };

  const handleDeleteProject = (projectId) => {
    if (!projectId) return;
    const confirmed = window.confirm('确定删除该项目吗？此操作不可撤销。');
    if (!confirmed) return;
    const next = deleteProject(projectId);
    setProjects(next);
  };

  const handleUseSample = () => {
    setArticleText(sampleText);
    setGenerateStatus('已填充示例');
  };


  const handleCopyPrompt = async () => {
    setPromptStatus('');
    try {
      await navigator.clipboard.writeText(promptText);
      setPromptStatus('已复制提示词');
    } catch (error) {
      const textarea = document.createElement('textarea');
      textarea.value = promptText;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setPromptStatus('已复制提示词');
    }
  };


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
                  <button type="button" className="rounded-full bg-brand px-4 py-2 text-white shadow-soft">
                    工具库
                  </button>
                  <div className="absolute left-0 top-full z-20 hidden min-w-[160px] rounded-2xl border border-gray-200 bg-white p-2 shadow-soft group-hover:block">
                    <Link
                      to="/generator"
                      className="block rounded-xl bg-brand/10 px-3 py-2 text-[11px] font-semibold text-brand-dark"
                    >
                      图文生成
                    </Link>
                    <div className="px-3 py-2 text-[11px] text-muted">更多工具敬请期待</div>
                  </div>
                </div>
                <Link to="/articles" className="px-3 py-2 text-muted transition hover:text-ink">
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

          <section className="mt-10 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-3 py-1 text-xs text-muted shadow-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                图文生成 · 提示词驱动
              </div>
              <h1 className="mt-4 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
                用提示词驱动 AI，
                <span className="text-brand">生成高质量微信图文卡片</span>
              </h1>
              <p className="mt-4 text-sm text-muted sm:text-base">
                选择提示词风格，AI 直接输出卡片标题、要点与结构化内容。
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="#tool"
                  className="rounded-full bg-brand px-5 py-2 text-xs font-semibold text-white shadow-soft"
                >
                  开始生成图文
                </a>
                <Link
                  to="/articles"
                  className="rounded-full border border-gray-200 bg-white px-5 py-2 text-xs font-semibold text-ink"
                >
                  查看已发布文章
                </Link>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { title: '提示词风格选择', desc: '点击即可切换提示词' },
                  { title: 'AI 直出内容', desc: '标题 + 要点一次生成' },
                  { title: '双输出', desc: '复制文本 + 导出图片' },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-gray-200 bg-white/90 p-3 text-xs text-muted shadow-soft">
                    <p className="text-sm font-semibold text-ink">{item.title}</p>
                    <p className="mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <section id="tool" className="mt-12">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-ink">图文生成</h2>
              <p className="mt-1 text-sm text-muted">提示词驱动生成不同卡片风格。</p>
            </div>
            <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-muted">
              提示词驱动
            </span>
          </div>
          <div className="mt-6">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <h3 className="text-base font-semibold text-ink">1. 选择提示词风格</h3>
                <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {PROMPT_LIBRARY.map((item) => {
                    const selected = promptId === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setPromptId(item.id)}
                        aria-pressed={selected}
                        className={`group rounded-3xl border p-3 text-left text-xs transition ${
                          selected
                            ? 'border-brand bg-brand/5 shadow-soft'
                            : 'border-gray-200 bg-white hover:border-brand/40'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-sm font-semibold text-ink">{item.title}</div>
                          <span
                            className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-widest ${
                              selected ? 'bg-brand text-white' : 'bg-black/5 text-muted'
                            }`}
                          >
                            {selected ? '已选' : '可选'}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-muted">{item.desc}</div>
                        {item.scene && <div className="mt-1 text-[11px] text-muted">适用：{item.scene}</div>}
                      </button>
                    );
                  })}
                </div>

                <h3 className="mt-6 text-base font-semibold text-ink">2. 输入文章内容</h3>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <input
                    value={articleTopic}
                    onChange={(event) => setArticleTopic(event.target.value)}
                    placeholder="输入主题/关键词，例如：Gemini 3.1 Pro 更新"
                    className="w-full flex-1 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs text-ink outline-none focus:border-brand/40 sm:w-auto"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateArticle}
                    disabled={contentGenerating}
                    className={`rounded-full px-4 py-2 text-xs font-semibold text-white shadow-soft ${
                      contentGenerating ? 'bg-brand/60' : 'bg-brand'
                    }`}
                  >
                    {contentGenerating ? '生成中…' : 'AI 生成内容'}
                  </button>
                  {contentStatus && <span className="text-xs text-muted">{contentStatus}</span>}
                </div>
                <textarea
                  value={articleText}
                  onChange={(event) => setArticleText(event.target.value)}
                  placeholder="请输入你的文章内容..."
                  className="mt-3 h-52 w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-ink outline-none focus:border-brand/40"
                />
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={generating}
                    className={`rounded-full px-4 py-2 text-xs font-semibold text-white shadow-soft ${
                      generating ? 'bg-brand/60' : 'bg-brand'
                    }`}
                  >
                    {generating ? '正在生成…' : 'AI 生成卡片'}
                  </button>
                  <button
                    type="button"
                    onClick={handleUseSample}
                    className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-ink"
                  >
                    示例输入
                  </button>
                  {statusText && <span className="text-xs text-muted">{statusText}</span>}
                </div>
                <div className="mt-2 text-xs text-muted">生成完成后会自动跳转到项目预览页。</div>
                {errorHint && (
                  <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                    建议：检查文章内容长度，或更换提示词风格后重试。
                  </div>
                )}
              </div>
              <div className="rounded-2xl border border-gray-100 bg-brand/5 p-4 text-sm text-muted">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-ink">3. AI 提示词（内嵌）</h4>
                  <button
                    type="button"
                    onClick={handleCopyPrompt}
                    className="rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-semibold text-ink"
                  >
                    复制提示词
                  </button>
                </div>
                <p className="mt-2 text-xs text-muted">提示词已内嵌，可直接用于接入 AI 生成能力。</p>
                <div className="mt-2 text-xs text-muted">当前风格：{selectedPrompt?.title}</div>
                <textarea
                  readOnly
                  value={promptText}
                  className="mt-3 h-48 w-full resize-none rounded-2xl border border-white/60 bg-white/80 p-3 text-xs text-muted"
                />
                {promptStatus && <div className="mt-2 text-xs text-muted">{promptStatus}</div>}
              </div>
            </div>

            <div className="mt-12">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-ink">历史项目</h3>
                  <p className="mt-1 text-xs text-muted">每次生成都会保存为项目，可随时查看。</p>
                </div>
                <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-semibold text-muted">
                  {projects.length ? `${projects.length} 个项目` : '暂无项目'}
                </span>
              </div>
              {projects.length ? (
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="flex flex-col justify-between rounded-3xl border border-gray-200 bg-white p-5 shadow-soft"
                    >
                      <div>
                        <div className="text-xs text-muted">
                          {project.createdAt || '—'}
                          {project.promptTitle ? ` · ${project.promptTitle}` : ''}
                        </div>
                        <div className="mt-2 text-base font-semibold text-ink">{project.title || '未命名项目'}</div>
                        {project.summary && <div className="mt-2 text-xs text-muted">{project.summary}</div>}
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold">
                        <Link to={`/projects/${project.id}`} className="text-brand">
                          查看预览 →
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(project.id)}
                          className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[11px] font-semibold text-red-600 transition hover:border-red-300"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-3xl border border-dashed border-gray-200 bg-white/60 p-6 text-center text-xs text-muted">
                  暂无历史记录，先生成一次图文卡片吧。
                </div>
              )}
            </div>
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
