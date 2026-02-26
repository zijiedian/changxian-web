import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toPng } from 'html-to-image';
import { getProject, updateProject } from '../utils/projects.js';

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

const extractPlainText = (html) => {
  if (!html) return '';
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const text = doc.body?.textContent || '';
    return text.replace(/\s+/g, ' ').trim();
  } catch (error) {
    return '';
  }
};

const extractPlainTextWithBreaks = (html) => {
  if (!html) return '';
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const text = doc.body?.innerText || doc.body?.textContent || '';
    return text.replace(/\n{3,}/g, '\n\n').trim();
  } catch (error) {
    return '';
  }
};

const applyIframeFallbacks = (doc) => {
  if (!doc) return;
  const container = doc.querySelector('.wx-cards');
  if (!container) return;
  const style = doc.defaultView?.getComputedStyle(container);
  if (!style) return;
  if (style.display === 'block' || style.display === 'inline') {
    container.style.display = 'flex';
  }
  if (style.flexWrap === 'wrap') {
    container.style.flexWrap = 'nowrap';
  }
  if (style.overflowX === 'visible') {
    container.style.overflowX = 'auto';
  }
  if (style.overflowY !== 'hidden') {
    container.style.overflowY = 'hidden';
  }
  if (style.scrollSnapType === 'none') {
    container.style.scrollSnapType = 'x mandatory';
  }
};

const ensureIframeExporter = (doc) =>
  new Promise((resolve, reject) => {
    const win = doc?.defaultView;
    if (win?.htmlToImage?.toPng) {
      resolve(win.htmlToImage);
      return;
    }
    const script = doc?.createElement('script');
    if (!script) {
      reject(new Error('无法初始化导出脚本'));
      return;
    }
    script.src = 'https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.min.js';
    script.async = true;
    script.onload = () => resolve(win.htmlToImage);
    script.onerror = () => reject(new Error('导出脚本加载失败'));
    doc.head.appendChild(script);
  });

const ensureCardsStructure = (doc) => {
  if (!doc?.body) return { reason: '', changed: false };
  let reason = '';
  let changed = false;
  let container = doc.body.querySelector('.wx-cards');

  if (!container) {
    container = doc.createElement('div');
    container.className = 'wx-cards';
    const nodes = Array.from(doc.body.childNodes);
    nodes.forEach((node) => {
      if (node.nodeType === 1) {
        container.appendChild(node);
        return;
      }
      if (node.nodeType === 3 && node.textContent && node.textContent.trim()) {
        const wrapper = doc.createElement('div');
        wrapper.textContent = node.textContent.trim();
        container.appendChild(wrapper);
      }
    });
    doc.body.innerHTML = '';
    doc.body.appendChild(container);
    reason = '未检测到 .wx-cards，已自动包裹。';
    changed = true;
  }

  if (container) {
    const children = Array.from(container.children);
    let addedCards = false;
    children.forEach((child) => {
      if (!child.classList.contains('wx-card')) {
        child.classList.add('wx-card');
        addedCards = true;
      }
    });
    if (addedCards) {
      reason = reason ? `${reason} 已补充 .wx-card。` : '未检测到 .wx-card，已自动补充。';
      changed = true;
    }
  }

  return { reason, changed };
};

export default function ProjectPreview() {
  const isLoggedIn = Boolean(localStorage.getItem('token'));
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [iframeHtml, setIframeHtml] = useState('');
  const scale = 1;
  const [showHtml, setShowHtml] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatStatus, setChatStatus] = useState('');
  const [optimizing, setOptimizing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState('');
  const [exportImages, setExportImages] = useState([]);
  const [structureHint, setStructureHint] = useState('');
  const [previewHeight, setPreviewHeight] = useState(800);
  const [scrollMode, setScrollMode] = useState('x');
  const [brandName, setBrandName] = useState('尝鲜AI');
  const [brandDesc, setBrandDesc] = useState('品牌调节助手');
  const [brandAvatar, setBrandAvatar] = useState('/logo.png');
  const iframeRef = useRef(null);
  const avatarInputRef = useRef(null);
  const lastViewportRef = useRef({ width: 0 });
  const resizeObserverRef = useRef(null);

  const htmlOutput = useMemo(() => stripCodeFence(project?.html || ''), [project]);
  const promptText = useMemo(() => project?.promptText || '', [project]);

  useEffect(() => {
    setProject(id ? getProject(id) : null);
  }, [id]);

  useEffect(() => {
    if (!project) return;
    setChatMessages(Array.isArray(project.chatMessages) ? project.chatMessages : []);
    setBrandName(project.brandName || '尝鲜AI');
    setBrandDesc(project.brandDesc || '品牌调节助手');
    setBrandAvatar(project.brandAvatar || '/logo.png');
  }, [project]);

  const handleBrandChange = (updates) => {
    if (!id) return;
    const next = {
      brandName,
      brandDesc,
      brandAvatar,
      ...updates,
    };
    setBrandName(next.brandName);
    setBrandDesc(next.brandDesc);
    setBrandAvatar(next.brandAvatar);
    updateProject(id, next);
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        handleBrandChange({ brandAvatar: reader.result });
      }
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  useEffect(() => {
    if (!htmlOutput) {
      setIframeHtml('');
      return;
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlOutput, 'text/html');
    const { reason } = ensureCardsStructure(doc);
    setStructureHint(reason);
    const bodyNodes = Array.from(doc.body?.childNodes || []);
    const wrapper = doc.createElement('div');
    wrapper.id = 'wx-preview-root';
    bodyNodes.forEach((node) => wrapper.appendChild(node));
    doc.body.innerHTML = '';
    doc.body.appendChild(wrapper);
    const shim = doc.createElement('style');
    shim.textContent = `
      html,body{
        margin:0;
        padding:0;
        height:auto;
        min-height:0;
        width:100%;
        overflow:hidden !important;
      }
      #wx-preview-root{
        display:inline-block;
        width:100%;
      }
      .wx-cards{
        overflow-y:hidden !important;
      }
    `;
    doc.head.appendChild(shim);
    const serialized = `<!doctype html>${doc.documentElement.outerHTML}`;
    setIframeHtml(serialized);
  }, [htmlOutput]);

  useEffect(() => {
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const computeScrollMode = () => {
      const viewportWidth = window.innerWidth || 360;
      const prevWidth = lastViewportRef.current.width || 0;
      if (Math.abs(viewportWidth - prevWidth) < 2) return;
      lastViewportRef.current.width = viewportWidth;
      setScrollMode(viewportWidth < 640 ? 'y' : 'x');
    };
    computeScrollMode();
    window.addEventListener('resize', computeScrollMode);
    return () => {
      window.removeEventListener('resize', computeScrollMode);
    };
  }, []);

  const handleExportImages = async () => {
    if (optimizing || !htmlOutput || exporting) return;
    setExportStatus('');
    setExporting(true);
    setExportImages([]);
    let cleanupStyle = null;
    try {
      const doc = iframeRef.current?.contentDocument;
      const win = iframeRef.current?.contentWindow;
      const nodes = doc ? Array.from(doc.querySelectorAll('.wx-card')) : [];
      if (!nodes.length) {
        throw new Error('未找到卡片，请确认 HTML 结构');
      }
      if (doc.fonts?.ready) {
        await doc.fonts.ready;
      }
      const exporter = await ensureIframeExporter(doc);
      cleanupStyle = doc.createElement('style');
      cleanupStyle.setAttribute('data-export-fix', 'true');
      cleanupStyle.textContent = '*{animation:none!important;transition:none!important;}';
      doc.head.appendChild(cleanupStyle);
      await new Promise((resolve) => requestAnimationFrame(() => resolve()));
      const imageUrls = [];
      for (let i = 0; i < nodes.length; i += 1) {
        const rect = nodes[i].getBoundingClientRect();
        const width = Math.round(rect.width || 600);
        const height = Math.round(rect.height || 800);
        const computed = win?.getComputedStyle(nodes[i]);
        const backgroundColor = computed?.backgroundColor || '#ffffff';
        const dataUrl = await (exporter?.toPng
          ? exporter.toPng(nodes[i], {
              cacheBust: true,
              pixelRatio: 2,
              width,
              height,
              backgroundColor,
              style: {
                width: `${width}px`,
                height: `${height}px`,
              },
            })
          : toPng(nodes[i], {
              cacheBust: true,
              pixelRatio: 2,
              width,
              height,
              backgroundColor,
              style: {
                width: `${width}px`,
                height: `${height}px`,
              },
            }));
        imageUrls.push({ url: dataUrl, name: `project-card-${String(i + 1).padStart(2, '0')}.png` });
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `project-card-${String(i + 1).padStart(2, '0')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
      setExportStatus('已导出');
      setExportImages(imageUrls);
    } catch (error) {
      setExportStatus('导出失败');
    } finally {
      const doc = iframeRef.current?.contentDocument;
      if (doc) {
        if (cleanupStyle?.parentNode) {
          cleanupStyle.parentNode.removeChild(cleanupStyle);
        } else {
          doc.querySelector('style[data-export-fix]')?.remove();
        }
      }
      setExporting(false);
    }
  };

  const handleCopyHtml = async () => {
    if (!htmlOutput) return;
    try {
      await navigator.clipboard.writeText(htmlOutput);
      setExportStatus('已复制 HTML');
    } catch (error) {
      const textarea = document.createElement('textarea');
      textarea.value = htmlOutput;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setExportStatus('已复制 HTML');
    }
  };

  const handleCopyText = async () => {
    const plainText = extractPlainText(htmlOutput);
    if (!plainText) return;
    try {
      await navigator.clipboard.writeText(plainText);
      setExportStatus('已复制文本');
    } catch (error) {
      const textarea = document.createElement('textarea');
      textarea.value = plainText;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setExportStatus('已复制文本');
    }
  };

  const buildOptimizationPrompt = (instruction) => {
    const basePrompt = promptText || '请保持微信图文卡片风格输出。';
    const brandInfo = `品牌信息：\n- 名称：${brandName || '（无）'}\n- 描述：${brandDesc || '（无）'}\n- 头像：${brandAvatar || '（无）'}\n若提供头像，请在封面或封底合理展示品牌头像/标识，品牌名与描述需体现在视觉或文案中。`;
    return `你是微信公众号图文卡片视觉设计师。\n\n现有提示词：\n${basePrompt}\n\n${brandInfo}\n\n现有 HTML：\n${htmlOutput}\n\n用户的调整需求：\n${instruction}\n\n请根据调整需求优化卡片的布局与视觉效果，并输出完整 HTML。\n要求：\n1. 输出单个 HTML 文件，包含所有 CSS/JS。\n2. 必须使用 Tailwind CSS + FontAwesome (CDN)。\n3. Layout: 采用横向滑动卡片布局（不换行）。\n4. 外层容器 class=\"wx-cards\"，CSS 必须设置 display:flex; flex-wrap:nowrap; gap:24px; overflow-x:auto; scroll-snap-type:x mandatory。\n5. 每张卡片 class=\"wx-card\"，CSS 必须设置 flex-shrink:0; scroll-snap-align:start。\n6. 卡片尺寸固定 width: 600px, height: 800px (3:4 比例)。\n7. Mobile: 必须包含 @media (max-width: 640px) 的移动端样式，降低内边距与字号，.wx-card 宽高用 width: min(90vw, 600px); height: min(120vw, 800px)，并缩小 .wx-cards 的 gap/padding。\n8. 禁止在 body 或 .wx-cards 上使用 overflow: hidden。\n9. No Explanations: 不要在代码外输出任何解释性文字。`;
  };

  const handleOptimize = async () => {
    const instruction = chatInput.trim();
    if (!instruction || optimizing) return;
    setOptimizing(true);
    setChatStatus('');
    const nextMessages = [...chatMessages, { role: 'user', text: instruction }];
    setChatMessages(nextMessages);
    updateProject(id, { chatMessages: nextMessages });
    setChatInput('');
    try {
      const response = await fetch('/api/generate-cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: buildOptimizationPrompt(instruction),
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || '优化失败');
      }
      const html = stripCodeFence(payload?.result);
      if (!html) {
        throw new Error('AI 未返回 HTML，请重试');
      }
      const updated = updateProject(id, { html, updatedAt: new Date().toLocaleString('zh-CN') });
      if (updated) {
        setProject(updated);
      }
      const assistantReply = { role: 'assistant', text: '已根据你的指令更新预览效果。' };
      const merged = [...nextMessages, assistantReply];
      setChatMessages(merged);
      updateProject(id, { chatMessages: merged });
    } catch (error) {
      setChatStatus(error?.message || '优化失败');
      const assistantReply = { role: 'assistant', text: '生成失败，请重试。' };
      const merged = [...nextMessages, assistantReply];
      setChatMessages(merged);
      updateProject(id, { chatMessages: merged });
    } finally {
      setOptimizing(false);
    }
  };

  const handleIframeLoad = () => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    applyIframeFallbacks(doc);
    const root = doc.getElementById('wx-preview-root') || doc.body;
    const updateHeight = () => {
      const height = Math.ceil(root.scrollHeight || root.getBoundingClientRect().height || 0);
      if (height) setPreviewHeight(height);
    };
    updateHeight();
    if (doc.fonts?.ready) {
      doc.fonts.ready.then(updateHeight).catch(() => {});
    }
    if (typeof ResizeObserver !== 'undefined') {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      resizeObserverRef.current = new ResizeObserver(updateHeight);
      resizeObserverRef.current.observe(root);
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-paper text-ink">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h1 className="text-2xl font-semibold">未找到该项目</h1>
          <p className="mt-3 text-sm text-muted">请从图文生成创建项目。</p>
          <Link to="/generator" className="mt-6 inline-flex rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white shadow-soft">
            返回工坊
          </Link>
        </div>
      </div>
    );
  }

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

          <section className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h1 className="text-2xl font-semibold">{project.title || '未命名项目'}</h1>
              <p className="mt-2 text-sm text-muted">
                生成时间：{project.createdAt}
                {project.updatedAt ? ` · 最近更新：${project.updatedAt}` : ''}
              </p>
              <div className="mt-4">
                <style>{`
                  .wx-preview {
                    width: 100%;
                    max-width: 100%;
                    background: transparent;
                    overflow: hidden;
                    overscroll-behavior: contain;
                    padding: 0;
                  }
                  .wx-preview iframe {
                    width: 100%;
                    height: 100%;
                    border: 0;
                    background: transparent;
                    display: block;
                  }
                `}</style>
                <div
                  className={`wx-preview ${scrollMode === 'y' ? 'is-vertical' : 'is-horizontal'}`}
                  style={{ backgroundColor: '#ffffff', height: `${previewHeight}px` }}
                >
                  <iframe
                    ref={iframeRef}
                    title="项目预览"
                    srcDoc={iframeHtml}
                    onLoad={handleIframeLoad}
                    scrolling="no"
                  />
                </div>
                {structureHint && (
                  <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-700">
                    {structureHint} 建议提示词里明确 .wx-cards/.wx-card 结构。
                  </div>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-semibold text-muted">
                  <button
                    type="button"
                    onClick={handleCopyText}
                    className="rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-semibold text-ink transition hover:border-brand/40 hover:bg-brand/5 active:scale-95"
                  >
                    一键导出文本
                  </button>
                  <button
                    type="button"
                    onClick={handleExportImages}
                    disabled={exporting}
                    className={`rounded-full border px-3 py-1 text-[11px] font-semibold transition active:scale-95 ${
                      exporting
                        ? 'border-gray-100 bg-gray-50 text-muted'
                        : 'border-gray-200 bg-white text-ink hover:border-brand/40 hover:bg-brand/5'
                    }`}
                  >
                    {exporting ? '正在导出…' : '一键导出卡片图片'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyHtml}
                    className="rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-semibold text-ink transition hover:border-brand/40 hover:bg-brand/5 active:scale-95"
                  >
                    复制 HTML
                  </button>
                  {exportStatus && (
                    <span className="rounded-full border border-brand/20 bg-brand/10 px-2 py-0.5 text-[11px] text-brand-dark">
                      {exportStatus}
                    </span>
                  )}
                </div>
                {exportImages.length > 0 && (
                  <div className="mt-4 rounded-2xl border border-gray-100 bg-white/80 p-4 text-xs text-muted">
                    <div className="font-semibold text-ink">导出结果（{exportImages.length} 张）</div>
                    <div className="mt-2 text-[11px] text-muted">点击打开原图，或在手机上长按保存。</div>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {exportImages.map((item) => (
                        <a
                          key={item.name}
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-2xl border border-gray-200 bg-white p-2 shadow-soft transition hover:border-brand/40"
                        >
                          <img src={item.url} alt={item.name} className="h-auto w-full rounded-xl" />
                          <div className="mt-2 text-[11px] text-muted">{item.name}</div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-soft">
              <div className="text-xs font-semibold text-muted">预览调节</div>
              <div className="mt-4">
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-xs text-muted">
                  提示：这里的调节仅影响预览显示，不会修改原始 HTML。
                </div>
              </div>
              <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-xs text-muted">
                <div className="font-semibold text-ink">提示词</div>
                <textarea
                  readOnly
                  value={promptText || '（该项目未记录提示词）'}
                  className="mt-3 h-36 w-full resize-none rounded-2xl border border-gray-200 bg-white/80 p-3 text-[11px] text-muted"
                />
              </div>
              <div className="mt-6 rounded-2xl border border-gray-100 bg-white/90 p-4 text-xs text-muted">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-ink">文本内容</span>
                  <button
                    type="button"
                    onClick={handleCopyText}
                    className="rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-semibold text-ink"
                  >
                    复制文本
                  </button>
                </div>
                <div className="mt-3 h-36 w-full overflow-auto rounded-2xl border border-gray-200 bg-white/80 p-3 text-[11px] text-ink whitespace-pre-line leading-relaxed">
                  {extractPlainTextWithBreaks(htmlOutput) || '（暂无可展示的文本内容）'}
                </div>
              </div>
              <div className="mt-6 rounded-2xl border border-gray-100 bg-white/90 p-4 text-xs text-muted">
                <div className="font-semibold text-ink">品牌信息</div>
                <div className="mt-3 space-y-3">
                  <label className="block text-[11px] font-semibold text-muted">
                    品牌名称
                    <input
                      value={brandName}
                      onChange={(event) => handleBrandChange({ brandName: event.target.value })}
                      placeholder="例如：尝鲜AI"
                      className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 text-[11px] text-ink"
                    />
                  </label>
                  <label className="block text-[11px] font-semibold text-muted">
                    品牌描述
                    <input
                      value={brandDesc}
                      onChange={(event) => handleBrandChange({ brandDesc: event.target.value })}
                      placeholder="例如：品牌调节助手"
                      className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 text-[11px] text-ink"
                    />
                  </label>
                  <label className="block text-[11px] font-semibold text-muted">
                    头像 URL
                    <input
                      value={brandAvatar}
                      onChange={(event) => handleBrandChange({ brandAvatar: event.target.value })}
                      placeholder="例如：https://... 或 /logo.png"
                      className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 text-[11px] text-ink"
                    />
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full border border-gray-200 bg-white">
                      <img src={brandAvatar} alt={brandName} className="h-full w-full object-contain" />
                    </div>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-semibold text-ink"
                    >
                      上传头像
                    </button>
                    <span className="text-[11px] text-muted">支持 PNG/JPG</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 rounded-2xl border border-gray-100 bg-white/90 p-4 text-xs text-muted">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-brand/10 p-[2px] ring-1 ring-brand/30 shadow-sm">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-brand/15">
                      <img src={brandAvatar} alt={brandName} className="h-5 w-5 rounded-full object-contain drop-shadow-sm" />
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-ink">{brandName}</div>
                    <div className="text-[10px] text-muted">{brandDesc}</div>
                  </div>
                </div>
                <div className="mt-3 font-semibold text-ink">AI 对话优化</div>
                <div className="mt-3 space-y-2">
                  {chatMessages.length ? (
                    <div className="max-h-40 space-y-2 overflow-auto rounded-2xl border border-gray-100 bg-gray-50 p-3">
                      {chatMessages.map((message, index) => (
                        <div key={`${message.role}-${index}`} className="text-[11px] text-muted">
                          <span className="font-semibold text-ink">
                            {message.role === 'user' ? '你' : 'AI'}：
                          </span>{' '}
                          {message.text}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-3 text-[11px] text-muted">
                      输入你的调整需求，例如“减少留白、增强对比度、增加大标题占比”。
                    </div>
                  )}
                </div>
                <textarea
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  placeholder="描述你希望调整的预览效果..."
                  className="mt-3 h-20 w-full resize-none rounded-2xl border border-gray-200 bg-white p-3 text-[11px] text-muted"
                />
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleOptimize}
                    disabled={optimizing}
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold text-white ${
                      optimizing ? 'bg-brand/60' : 'bg-brand'
                    }`}
                  >
                    {optimizing ? '优化中…' : '发送并优化'}
                  </button>
                  <Link
                    to="/articles"
                    className="rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-semibold text-ink"
                  >
                    发布到文章
                  </Link>
                  {chatStatus && <span className="text-[11px] text-muted">{chatStatus}</span>}
                </div>
              </div>
              <div className="mt-6 border-t border-gray-100 pt-5 text-xs text-muted">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-ink">HTML 源码</span>
                  <button
                    type="button"
                    onClick={() => setShowHtml((prev) => !prev)}
                    className="rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-semibold text-muted"
                  >
                    {showHtml ? '收起' : '查看'}
                  </button>
                </div>
                {showHtml && (
                  <div className="mt-3">
                    <textarea
                      readOnly
                      value={htmlOutput}
                      className="h-40 w-full resize-none rounded-2xl border border-gray-200 bg-white/80 p-3 text-[11px] text-muted"
                    />
                    <button
                      type="button"
                      onClick={handleCopyHtml}
                      className="mt-3 rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-semibold text-ink"
                    >
                      复制 HTML
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
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
