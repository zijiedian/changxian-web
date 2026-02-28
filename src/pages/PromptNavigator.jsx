import { useMemo, useState } from 'react';
import SiteFooter from '../components/SiteFooter.jsx';
import SiteHeader from '../components/SiteHeader.jsx';

const SOURCE_URL = 'https://x.com/joshesye/status/2000794803135811758';
const SOURCE_IMAGE = 'https://pbs.twimg.com/media/G8Q_j7ka4AUHloV.jpg';

const PROMPT_RESOURCES = [
  { name: '松果先森（Nana + Seedance 提示词库）', category: '常用', url: 'https://opennana.com/awesome-prompt-gallery', note: '1215 个 Nano Banana + 110 个 Seedance 2.0 提示词与效果图。', tags: ['Nano Banana', 'Seedance 2.0', '图库'] },
  { name: 'YouMind Nano Banana Pro', category: '常用', url: 'https://youmind.com/zh-CN/nano-banana-pro-prompts', note: '收录 10017+ 提示词与 400+ Seedance 2.0 资源。', tags: ['Nano Banana', 'Seedance 2.0', '实战'] },
  { name: 'Promptfill 提示词填空器', category: '常用', url: 'http://promptfill.tanshilong.com', note: '提示词填空辅助工具，适合和图库搭配使用。', tags: ['填空器', '效率'] },
  { name: 'Local Banana', category: '提示词网站', url: 'https://www.localbanana.io/', note: '围绕 Nano Banana 的提示词站点。', tags: ['社区', '风格'] },
  { name: 'Tihubb AI Prompt', category: '提示词网站', url: 'https://tihubb.com/ai-prompt/', note: '多模型场景的提示词导航。', tags: ['导航'] },
  { name: 'ChatGPT Image Art', category: '提示词网站', url: 'https://www.chatgptimage.art/', note: '图像生成提示词方向。', tags: ['图片'] },
  { name: 'Nano Banana Showcase', category: '提示词网站', url: 'https://nanobanana-showcase.com/', note: '案例和提示词展示。', tags: ['案例'] },
  { name: 'NanoBananaPrompt', category: '提示词网站', url: 'https://nanobananaprompt.org/', note: '海量风格的社区型库。', tags: ['社区', '风格'] },
  { name: 'NanoBananaArt Prompts', category: '提示词网站', url: 'https://nanobananaart.net/prompts', note: '适合做画风模板。', tags: ['画风模板'] },
  { name: 'Fotor Nano Banana Prompts', category: '提示词网站', url: 'https://www.fotor.com/blog/nano-banana-model-prompts/', note: '热门风格合集。', tags: ['热门合集'] },
  { name: '苍何 Nano Banana 案例合集', category: '提示词网站', url: 'https://my.feishu.cn/wiki/S5nowuX3uiHXq4kNPb3c7cPpngh', note: '飞书文档形式的案例与提示词整理。', tags: ['飞书', '案例'] },
  { name: 'Best Nano Banana Prompt', category: '提示词网站', url: 'http://bestnanobananaprompt.com', note: '每日更新热门提示词，支持收藏与插件扩展。', tags: ['热门', '收藏'] },
  { name: 'PixShop Prompt Library', category: '提示词网站', url: 'https://pixshop.app/zh', note: 'Seedance 2.0 / Nano Banana Pro 提示词库。', tags: ['Seedance 2.0', 'Nano Banana'] },
  { name: 'MyPrompt', category: '提示词网站', url: 'https://myprompt.cc/en', note: '多主题提示词与案例展示。', tags: ['社区'] },
  { name: 'BananaPrompts Hub', category: '提示词网站', url: 'https://bananaprompts-hub.com', note: '聚合类 Nano Banana 提示词站点。', tags: ['聚合'] },
  { name: 'PromptUp', category: '提示词网站', url: 'https://promptup.net', note: '提示词发现与灵感扩展。', tags: ['探索'] },
  { name: 'Awesome Nano Banana', category: 'GitHub', url: 'https://github.com/JimmyLv/awesome-nano-banana', note: '精选仓库聚合。', tags: ['Awesome'] },
  { name: 'ZHO Nano Banana Creation', category: 'GitHub', url: 'https://github.com/ZHO-ZHO-ZHO/ZHO-nano-banana-Creation', note: '创作导向示例仓库。', tags: ['示例'] },
  { name: 'Awesome Nano Banana Images', category: 'GitHub', url: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images', note: '图片类素材与提示词。', tags: ['图像'] },
  { name: '松果先森 GPT4o Image Prompts', category: 'GitHub', url: 'https://github.com/songguoxs/gpt4o-image-prompts', note: 'GPT-4o 图像提示词合集。', tags: ['GPT-4o'] },
  { name: 'Awesome AI Art Pics Prompts', category: 'GitHub', url: 'https://github.com/Jermic/awesome-aiart-pics-prompts', note: '近 1000 位创作者、3000+ AI 艺术案例与完整提示词。', tags: ['AI Art', '大合集'] },
  { name: '宝玉', category: '宝藏博主', url: 'https://x.com/dotey', note: '持续分享 AI 内容与方法。', tags: ['X 博主'] },
  { name: '归藏', category: '宝藏博主', url: 'https://x.com/op7418', note: '高质量 AI 资源分享。', tags: ['X 博主'] },
  { name: '神佬', category: '宝藏博主', url: 'https://x.com/berryxia', note: '偏实操与案例拆解。', tags: ['X 博主'] },
  { name: 'ZHO', category: '宝藏博主', url: 'https://x.com/ZHO_ZHO_ZHO', note: '创作流与视觉方向内容。', tags: ['X 博主'] },
  { name: '尝鲜AI（你的账号）', category: '宝藏博主', url: 'https://x.com/changxianai', note: '站点主理人账号，持续同步 AIGC 观察与更新。', tags: ['X 博主', '主理人'] },
  { name: 'ttmouse（豆爸）', category: '宝藏博主', url: 'https://twitterhot.vercel.app/', note: '趋势聚合与资源导航，更新节奏快。', tags: ['趋势', '导航'] },
  { name: 'AI奶爸', category: '宝藏博主', url: 'https://x.com/zstmfhy', note: '近期有较多 Seedance 作品分享。', tags: ['X 博主', 'Seedance 2.0'] },
  { name: '行者（joshesye）', category: '宝藏博主', url: 'https://x.com/joshesye', note: 'AI 绘画 / AI 视频方向持续分享。', tags: ['X 博主', '创作'] },
  { name: 'Best Prompt Club', category: '补充资源', url: 'https://bestpromptclub.com/', note: '提示词分享站。', tags: ['分享站'] },
  { name: 'BananaPrompts', category: '补充资源', url: 'https://bananaprompts.fun/', note: 'Nano Banana 相关提示词。', tags: ['Nano Banana'] },
  { name: 'StudentDiscount Nano Banana Prompts', category: '补充资源', url: 'https://studentdiscount.io/ai-study-tools/nano-banana-prompts', note: '学习向提示词页。', tags: ['学习'] },
  { name: 'GenImg', category: '补充资源', url: 'https://genimg.xyz/', note: '生成向工具与提示词。', tags: ['生成'] },
  { name: 'AI Prompt Nav', category: '导航站', url: 'https://www.aipromptnav.com/', note: '提示词导航入口。', tags: ['导航'] },
];

const CATEGORIES = ['全部', ...new Set(PROMPT_RESOURCES.map((item) => item.category))];

const getDomain = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch (error) {
    return url;
  }
};

const getPreviewCandidates = (url) => [
  `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=1200`,
  `https://image.thum.io/get/width/1200/noanimate/${url}`,
];

function SitePreview({ url, name }) {
  const candidates = useMemo(() => getPreviewCandidates(url), [url]);
  const [index, setIndex] = useState(0);
  const [broken, setBroken] = useState(false);
  const domain = getDomain(url);
  const current = candidates[index];

  return (
    <div className="mt-3 overflow-hidden rounded-2xl border border-black/10 bg-white/70">
      {broken ? (
        <div className="flex h-36 items-center justify-center bg-gradient-to-br from-brand/5 to-white text-xs text-muted sm:h-40">
          {domain}
        </div>
      ) : (
        <>
          <img
            src={current}
            alt={`${name} 站点预览`}
            loading="lazy"
            className="h-36 w-full object-cover sm:h-40"
            onError={() => {
              if (index < candidates.length - 1) {
                setIndex((value) => value + 1);
                return;
              }
              setBroken(true);
            }}
          />
          {index > 0 && (
            <div className="border-t border-black/10 px-2 py-1 text-[10px] text-muted">
              预览已切换备用源
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function PromptNavigator() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return PROMPT_RESOURCES.filter((item) => {
      const categoryMatch = activeCategory === '全部' || item.category === activeCategory;
      if (!categoryMatch) return false;
      if (!keyword) return true;
      const haystack = `${item.name} ${item.note} ${item.tags.join(' ')} ${item.url}`.toLowerCase();
      return haystack.includes(keyword);
    });
  }, [activeCategory, query]);

  return (
    <div className="min-h-screen flex flex-col text-ink">
      <div className="relative flex-1 overflow-hidden">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-brand/20 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-10 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />

        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <SiteHeader active="tools" />

          <section className="mt-8 glass-card rounded-3xl p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
              <span className="rounded-full border border-brand/25 bg-brand/10 px-3 py-1 font-semibold text-brand-dark">提示词导航</span>
              <span>来源：X 线索整理</span>
            </div>
            <h1 className="mt-3 text-2xl font-semibold text-ink sm:text-3xl">
              Nano Banana / Seedance 2.0
              <span className="theme-gradient-text"> 提示词导航</span>
            </h1>
            <p className="mt-3 text-sm text-muted">
              已从你提供的链接提取并结构化整理，支持分类筛选与关键词搜索，方便后续持续补充。
            </p>
            <a
              href={SOURCE_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex text-xs font-semibold text-brand hover:underline"
            >
              查看原始来源
            </a>
            <a href={SOURCE_IMAGE} target="_blank" rel="noreferrer" className="mt-3 ml-3 inline-flex text-xs font-semibold text-brand hover:underline">
              查看来源配图
            </a>

            <div className="mt-5">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索关键词，例如：风格、GitHub、导航..."
                className="w-full rounded-[14px] border border-white/70 bg-white/80 px-4 py-3 text-sm text-ink outline-none transition focus:border-brand/40 focus:ring-2 focus:ring-brand/20"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {CATEGORIES.map((category) => {
                const active = category === activeCategory;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={
                      active
                        ? 'soft-button soft-button-primary px-3 py-1.5 text-xs'
                        : 'rounded-full border border-white/70 bg-white/75 px-3 py-1.5 text-xs font-semibold text-muted transition hover:text-ink'
                    }
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="mt-6">
            <div className="mb-3 text-xs text-muted">共 {filtered.length} 条结果</div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((item) => (
                <article key={`${item.category}-${item.name}`} className="glass-card rounded-2xl p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full border border-brand/20 bg-brand/10 px-2.5 py-1 text-[11px] font-semibold text-brand-dark">
                      {item.category}
                    </span>
                    <span className="text-[11px] text-muted">{getDomain(item.url)}</span>
                  </div>
                  <SitePreview url={item.url} name={item.name} />
                  <h3 className="mt-3 text-sm font-semibold text-ink">{item.name}</h3>
                  <p className="mt-2 text-xs text-muted">{item.note}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-white/80 bg-white/80 px-2 py-0.5 text-[10px] text-muted">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex text-xs font-semibold text-brand hover:underline"
                  >
                    打开链接
                  </a>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>

      <SiteFooter maxWidthClass="max-w-6xl" followText="持续更新：提示词导航 / 图文生成 / 安全专题" />
    </div>
  );
}
