import SiteFooter from '../components/SiteFooter.jsx';
import SiteHeader from '../components/SiteHeader.jsx';

const INSIGHTS = [
  {
    label: '产业规模（2023）',
    value: '823 亿元',
    hint: '中国网络安全产业联盟发布的 2024 报告摘要，2023 年同比 +1.56%。',
  },
  {
    label: '人才缺口（2025）',
    value: '300 万+',
    hint: '行业公开人才报告普遍给出“300 余万”级别缺口。',
  },
  {
    label: '法规新节点',
    value: '2025-01 / 2026-01',
    hint: '《网络数据安全管理条例》已生效；《网络安全法》修订自 2026-01-01 起施行。',
  },
  {
    label: '岗位结构趋势',
    value: '攻防 + 合规 + 工程化',
    hint: '传统攻防之外，云原生、数据安全、AI 安全与合规岗位持续增多。',
  },
];

const POLICY_TIMELINE = [
  {
    date: '2024-09-24',
    title: '《网络数据安全管理条例》公布',
    impact: '2025-01-01 起施行，推动数据分类分级、跨境流动和安全管理岗位常态化。',
  },
  {
    date: '2025-09',
    title: '人才报告显示缺口仍在 300 万级别',
    impact: '企业在“实操能力、项目经验、复合技能”上筛选更严格。',
  },
  {
    date: '2025-10-28',
    title: '《网络安全法》修订通过',
    impact: '根据国家主席令第六十一号，修订决定自 2026-01-01 起施行。',
  },
  {
    date: '2026-01-01',
    title: '新法规框架进入执行阶段',
    impact: '组织侧对安全治理、数据合规、事件响应、审计留痕的岗位需求同步提升。',
  },
];

const TRACKS = [
  {
    name: '安全运营（SOC）与检测响应',
    who: '政府、金融、运营商、互联网、制造龙头',
    positions: 'SOC 分析师、威胁检测工程师、应急响应工程师',
    tech: 'SIEM、EDR、NDR、告警关联、ATT&CK、日志工程、SOAR 编排',
  },
  {
    name: '攻防对抗与渗透测试',
    who: '安全服务公司、甲方安全团队、攻防演练机构',
    positions: '渗透测试工程师、红队工程师、漏洞研究员',
    tech: 'Web/API/内网渗透、漏洞利用链、免杀对抗、横向移动、复现与报告',
  },
  {
    name: '数据安全与隐私保护',
    who: '持有大量业务数据的平台、政企、跨境业务企业',
    positions: '数据安全工程师、隐私合规专员、数据治理架构师',
    tech: '分类分级、脱敏/加密、DLP、访问控制、审计追踪、跨境评估材料',
  },
  {
    name: '云安全与 DevSecOps',
    who: '上云企业、云厂商、SaaS 与互联网公司',
    positions: '云安全工程师、DevSecOps 工程师、云原生安全架构师',
    tech: 'K8s 安全、镜像供应链、IaC 扫描、CI/CD 安全门禁、CSPM/CNAPP',
  },
  {
    name: '应用安全与软件供应链安全',
    who: '软件研发型企业、金融科技、车联网与工业软件团队',
    positions: '应用安全工程师、代码审计工程师、供应链安全工程师',
    tech: 'SAST/DAST/SCA、SBOM、依赖风险治理、SDL、威胁建模',
  },
  {
    name: '身份安全与零信任',
    who: '大型集团、金融与多分支机构组织',
    positions: 'IAM 工程师、零信任架构师、PAM 工程师',
    tech: 'IAM/SSO/MFA、PAM、策略引擎、终端准入、细粒度授权',
  },
  {
    name: '工控、车联网与物联网安全',
    who: '能源、制造、交通、汽车电子与车联网平台',
    positions: '工控安全工程师、车联网安全工程师、物联网安全工程师',
    tech: 'OT 协议、资产测绘、工业白名单、车端安全测试、固件安全',
  },
  {
    name: '治理、合规与审计（GRC）',
    who: '所有受监管行业（金融、医疗、政务、运营商等）',
    positions: '安全合规经理、等保测评工程师、安全咨询顾问',
    tech: '等保 2.0、关保、数据合规、制度建设、风险评估与整改闭环',
  },
  {
    name: 'AI 安全与模型治理（新）',
    who: 'AIGC 平台、模型应用企业、内容平台',
    positions: 'AI 安全工程师、模型安全研究员、安全评测工程师',
    tech: '提示注入防护、越狱检测、模型评测、内容安全、模型供应链',
  },
  {
    name: '安全产品与平台研发',
    who: '安全厂商、云厂商安全线、甲方平台团队',
    positions: '安全研发工程师、安全产品经理、安全平台架构师',
    tech: '规则引擎、流处理、可观测性、平台工程、性能与高可用设计',
  },
];

const JOBS = [
  {
    role: 'SOC 分析师',
    stage: '0-3 年需求大',
    tech: '日志分析、告警分诊、ATT&CK、溯源基础、工单闭环',
    tool: 'Splunk/ELK、EDR、NDR、SOAR',
    output: '告警降噪报告、初步研判、处置建议',
  },
  {
    role: '应急响应工程师',
    stage: '2-6 年核心岗位',
    tech: '攻击链还原、主机取证、流量分析、勒索处置与恢复',
    tool: 'Volatility、Wireshark、YARA、沙箱',
    output: '事件报告、修复方案、复盘清单',
  },
  {
    role: '渗透测试工程师',
    stage: '校招到中高级',
    tech: 'Web/API/内网渗透、漏洞复现、权限提升、横向移动',
    tool: 'Burp、Nmap、Metasploit、Cobalt Strike（授权场景）',
    output: '渗透报告、漏洞验证、修复建议',
  },
  {
    role: '红队工程师',
    stage: '3 年以上为主',
    tech: '对抗思维、武器化链路、规避检测、攻防协同',
    tool: 'C2 框架、流量伪装、内网代理、对抗脚本',
    output: '实战演练路径、检测盲点清单',
  },
  {
    role: '应用安全工程师',
    stage: '研发型企业刚需',
    tech: 'SDL、威胁建模、代码审计、依赖治理、安全测试前移',
    tool: 'SAST/DAST/SCA、API 安全网关、RASP',
    output: '安全评审意见、基线模板、缺陷闭环',
  },
  {
    role: 'DevSecOps 工程师',
    stage: '云原生岗位增长快',
    tech: 'CI/CD 安全门禁、镜像签名、K8s 策略、IaC 安全',
    tool: 'GitLab CI、Trivy、OPA、Kubernetes 安全组件',
    output: '发布门禁策略、安全流水线',
  },
  {
    role: '云安全工程师',
    stage: '2-8 年都缺人',
    tech: '云配置审计、身份治理、工作负载防护、云入侵检测',
    tool: '云厂商安全中心、CSPM/CWPP、容器运行时安全',
    output: '云风险评估、持续监测方案',
  },
  {
    role: '数据安全工程师',
    stage: '法规驱动型上升',
    tech: '分级分类、脱敏加密、数据流转管控、访问审计',
    tool: 'DLP、KMS、数据库审计、数据网关',
    output: '数据地图、分类分级台账、整改报告',
  },
  {
    role: '隐私合规/数据合规专员',
    stage: '1-5 年岗位增量明显',
    tech: '法律映射、合规评估、流程设计、第三方管理',
    tool: '合规流程系统、审计台账、评估模板',
    output: 'PIA/合规评估、制度体系、跨境材料',
  },
  {
    role: '等保测评工程师',
    stage: '长期稳定需求',
    tech: '等保流程、技术测评、风险整改、文档规范',
    tool: '扫描器、核查脚本、测评模板',
    output: '测评报告、整改跟踪单',
  },
  {
    role: '威胁情报分析师',
    stage: '中高级为主',
    tech: 'IOC 管理、样本关联、攻击组织画像、战术趋势判断',
    tool: 'TIP 平台、情报订阅、图谱分析',
    output: '情报通报、规则更新建议',
  },
  {
    role: '工控安全工程师',
    stage: '制造与能源稳步增长',
    tech: 'OT 协议、工业资产识别、隔离策略、工控应急',
    tool: '工业流量监测、工控白名单、漏洞核验工具',
    output: '工控风险评估、分区分域方案',
  },
  {
    role: '车联网安全工程师',
    stage: '智能汽车链路拉动',
    tech: '车载通信安全、固件安全、车云协同防护',
    tool: 'CAN 分析、模糊测试、固件逆向工具',
    output: '车载安全测试报告、整改建议',
  },
  {
    role: 'AI 安全工程师',
    stage: '新兴高增长岗位',
    tech: '提示注入防护、越狱攻击评估、内容安全策略、模型评测',
    tool: 'LLM Guardrail、评测基准、内容安全平台',
    output: '模型安全评测报告、防护规则',
  },
  {
    role: '安全架构师',
    stage: '5 年+关键岗位',
    tech: '体系设计、零信任、跨域协同、成本与风险平衡',
    tool: '架构建模工具、平台化安全组件',
    output: '安全蓝图、建设路线图、年度规划',
  },
  {
    role: '安全产品经理/售前顾问',
    stage: '懂技术 + 懂业务最吃香',
    tech: '需求抽象、方案设计、行业合规映射、ROI 论证',
    tool: '竞品分析、方案模板、PoC 设计',
    output: '产品 PRD、行业方案、PoC 报告',
  },
];

const GROWTH_PATH = [
  {
    stage: '0-1 年（入门）',
    focus: '打牢基础：网络协议、操作系统、脚本能力、常见攻击面与日志分析。',
    action: '优先做 2 类项目：漏洞复现 + 检测规则落地（不是只刷题）。',
  },
  {
    stage: '1-3 年（成型）',
    focus: '选定方向：SOC/渗透/云安全/数据安全，不建议“全都懂一点”。',
    action: '沉淀可展示成果：演练报告、自动化脚本、规则库、整改闭环案例。',
  },
  {
    stage: '3-5 年（进阶）',
    focus: '从“执行者”走向“方案 owner”：架构思维、跨团队协同、成本意识。',
    action: '承担专项：比如勒索演练、云上基线治理、数据合规专项。',
  },
  {
    stage: '5 年以上（专家/管理）',
    focus: '建立体系化安全能力：治理框架、人才梯队、指标运营。',
    action: '向架构师/安全负责人/CISO 路径发展，补齐经营与组织能力。',
  },
];

const CERTS = [
  '国内：CISP、CISAW、等保测评相关资质（按岗位选择）',
  '国际：CISSP、CISA、OSCP、CCSP（按方向组合）',
  '云厂商：阿里云/华为云/腾讯云安全方向认证',
  '关键提醒：证书是加分项，不是“替代项目经验”的门票。',
];

const SOURCES = [
  {
    title: '中国政府网：中华人民共和国主席令（第六十一号）',
    url: 'https://www.gov.cn/yaowen/liebiao/202510/content_7046104.htm',
    note: '《网络安全法》修订决定通过并明确自 2026-01-01 起施行。',
  },
  {
    title: '中央网信办：国务院总理签署国务院令 公布《网络数据安全管理条例》',
    url: 'https://www.cac.gov.cn/2024-09/30/c_1729356255246164.htm',
    note: '条例公布并明确自 2025-01-01 起施行。',
  },
  {
    title: '中央网信办：中华人民共和国个人信息保护法（专题页）',
    url: 'https://www.cac.gov.cn/2021-08/20/c_1631045573523484.htm',
    note: '包含第 52 条等内容：达到处理规模门槛需指定个人信息保护负责人。',
  },
  {
    title: '人社部中国就业网：国家职业技能标准《网络与信息安全管理员（2020）》',
    url: 'https://chinajob.mohrss.gov.cn/AnnualPersonnelAgencyInfoView.aspx?type=4&id=1740',
    note: '明确工种（网络安全管理员/信息安全管理员/互联网信息审核员）与技能等级。',
  },
  {
    title: '海关总署转载：中国网络安全产业联盟发布《中国网络安全产业分析报告（2024）》',
    url: 'http://www.customs.gov.cn/customs/xwfb34/302425/6084637/index.html',
    note: '披露 2023 年产业规模 823 亿元、同比增长 1.56% 等关键数据。',
  },
  {
    title: '世纪互联（2025 人才报告解读）',
    url: 'https://www.vnet.com/news/3827.html',
    note: '披露“人才缺口 300 余万”、岗位需求结构与地域分布（行业报告转述）。',
  },
  {
    title: '商务部转载工信部《网络安全产业高质量发展三年行动计划（2021-2023）》',
    url: 'https://www.mofcom.gov.cn/syxwfb/art/2021/art_7272110308.html',
    note: '提出产业规模、骨干企业、创新示范园区等阶段性目标。',
  },
];

export default function ChinaCybersecurityIndustry2026() {
  return (
    <div className="min-h-screen text-ink">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-brand/20 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-10 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 xl:px-10">
          <SiteHeader active="articles" />

          <article className="mt-12 space-y-6">
            <header className="theme-gradient-border rounded-3xl shadow-soft">
              <div className="glass-card rounded-3xl p-6 sm:p-8 lg:p-10">
                <div className="text-xs text-muted">行业研究 · 更新时间 2026-02-28</div>
                <h1 className="mt-3 text-2xl font-semibold leading-tight text-ink sm:text-3xl lg:text-4xl">
                  中国网络安全行业全景：领域、就业岗位与技术能力地图（2026 版）
                </h1>
                <p className="mt-4 text-sm text-muted sm:text-base">
                  这是一份面向求职者、转岗者和团队负责人的深度梳理：先讲清中国网络安全行业到底有哪些赛道，
                  再把岗位与技术能力逐层拆解，最后给出可执行的成长路径。文末附
                  <span className="font-semibold text-ink"> SVG 思维导图</span>。
                </p>
                <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-semibold text-muted">
                  {['网络安全', '就业岗位', '技能地图', '数据安全', '云安全', 'AI安全'].map((tag) => (
                    <span key={tag} className="rounded-full border border-gray-200 bg-white px-3 py-1">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
                  <a
                    href="/assets/posts/china-cybersecurity-industry-mindmap.svg"
                    target="_blank"
                    rel="noreferrer"
                    className="soft-button soft-button-primary px-4"
                  >
                    打开 SVG 思维导图
                  </a>
                  <a
                    href="/assets/posts/china-cybersecurity-industry-mindmap.svg"
                    download="china-cybersecurity-industry-mindmap.svg"
                    className="soft-button soft-button-secondary px-4"
                  >
                    下载 SVG
                  </a>
                  <a
                    href="/assets/posts/china-cybersecurity-industry-cards.html"
                    target="_blank"
                    rel="noreferrer"
                    className="soft-button soft-button-secondary px-4"
                  >
                    打开图文卡片
                  </a>
                </div>
              </div>
            </header>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {INSIGHTS.map((item) => (
                <div key={item.label} className="glass-card rounded-3xl p-5">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted">{item.label}</div>
                  <div className="mt-2 text-xl font-semibold text-ink">{item.value}</div>
                  <p className="mt-2 text-xs leading-relaxed text-muted">{item.hint}</p>
                </div>
              ))}
            </section>

            <section className="glass-card rounded-3xl p-6 sm:p-7">
              <h2 className="text-xl font-semibold text-ink">一、研究方法与口径</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
                <p>
                  <span className="font-semibold text-ink">时间口径：</span>
                  本文以 2026 年 2 月 28 日可公开获取的信息为准，政策与法规采用官方来源。
                </p>
                <p>
                  <span className="font-semibold text-ink">数据口径：</span>
                  行业规模、人才缺口、岗位结构以公开报告与权威转载为主；不同机构统计方法不同，
                  文中统一用“区间/趋势”表达，避免伪精确。
                </p>
                <p>
                  <span className="font-semibold text-ink">推断说明：</span>
                  下文“岗位所需技术栈”和“成长路线”是基于国家职业技能标准与公开岗位 JD 的共性
                  归纳，属于研究性推断，不等同于任何单一企业的招聘标准。
                </p>
              </div>
            </section>

            <section className="glass-card rounded-3xl p-6 sm:p-7">
              <h2 className="text-xl font-semibold text-ink">二、行业正在发生什么：政策、规模与需求</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {POLICY_TIMELINE.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-gray-200 bg-white p-4">
                    <div className="text-xs font-semibold text-brand-dark">{item.date}</div>
                    <h3 className="mt-2 text-base font-semibold text-ink">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted">{item.impact}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm leading-relaxed text-muted">
                结合政策节奏与行业报告可看到：网络安全已经从“单点技术采购”进入“持续运营 + 合规治理 +
                工程化落地”阶段，岗位结构也从“纯攻防”扩展为“攻防、工程、合规、业务融合”四条主轴并行。
              </p>
            </section>

            <section className="glass-card rounded-3xl p-6 sm:p-7">
              <h2 className="text-xl font-semibold text-ink">三、中国网络安全行业 10 大赛道（对应岗位与技术）</h2>
              <div className="mt-5 space-y-3">
                {TRACKS.map((track) => (
                  <div key={track.name} className="rounded-2xl border border-gray-200 bg-white p-4">
                    <h3 className="text-base font-semibold text-ink">{track.name}</h3>
                    <div className="mt-3 grid gap-2 text-sm text-muted md:grid-cols-2">
                      <p>
                        <span className="font-semibold text-ink">典型用人方：</span>
                        {track.who}
                      </p>
                      <p>
                        <span className="font-semibold text-ink">常见岗位：</span>
                        {track.positions}
                      </p>
                      <p className="md:col-span-2">
                        <span className="font-semibold text-ink">核心技术：</span>
                        {track.tech}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="glass-card rounded-3xl p-6 sm:p-7">
              <h2 className="text-xl font-semibold text-ink">四、岗位地图：招聘最常见 16 类职位与技术要求</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-muted">
                      <th className="border border-gray-200 px-3 py-2">岗位</th>
                      <th className="border border-gray-200 px-3 py-2">需求阶段</th>
                      <th className="border border-gray-200 px-3 py-2">核心能力</th>
                      <th className="border border-gray-200 px-3 py-2">常见工具</th>
                      <th className="border border-gray-200 px-3 py-2">交付产出</th>
                    </tr>
                  </thead>
                  <tbody>
                    {JOBS.map((job) => (
                      <tr key={job.role} className="bg-white align-top text-muted">
                        <td className="border border-gray-200 px-3 py-3 font-semibold text-ink">{job.role}</td>
                        <td className="border border-gray-200 px-3 py-3">{job.stage}</td>
                        <td className="border border-gray-200 px-3 py-3">{job.tech}</td>
                        <td className="border border-gray-200 px-3 py-3">{job.tool}</td>
                        <td className="border border-gray-200 px-3 py-3">{job.output}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="glass-card rounded-3xl p-6 sm:p-7">
                <h2 className="text-xl font-semibold text-ink">五、不同年限的成长路线（可直接执行）</h2>
                <div className="mt-4 space-y-3">
                  {GROWTH_PATH.map((item) => (
                    <div key={item.stage} className="rounded-2xl border border-gray-200 bg-white p-4">
                      <h3 className="text-sm font-semibold text-ink sm:text-base">{item.stage}</h3>
                      <p className="mt-2 text-sm text-muted">{item.focus}</p>
                      <p className="mt-1 text-sm text-muted">{item.action}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="glass-card rounded-3xl p-6 sm:p-7">
                  <h2 className="text-xl font-semibold text-ink">六、证书与学习建议</h2>
                  <ul className="mt-4 space-y-2 text-sm text-muted">
                    {CERTS.map((item) => (
                      <li key={item} className="rounded-xl border border-gray-200 bg-white px-3 py-2">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="glass-card rounded-3xl p-6 sm:p-7">
                  <h2 className="text-xl font-semibold text-ink">七、SVG 思维导图与图文卡片</h2>
                  <p className="mt-3 text-sm text-muted">
                    导图覆盖“行业驱动、赛道领域、岗位族群、技术栈、职业路径、求职策略”六大层次，
                    可直接用于宣讲、培训或求职复盘。
                  </p>
                  <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white">
                    <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 text-xs font-semibold text-muted">
                      图文卡片预览（横向滑动）
                    </div>
                    <iframe
                      title="中国网络安全行业图文卡片"
                      src="/assets/posts/china-cybersecurity-industry-cards.html"
                      loading="lazy"
                      className="h-[680px] w-full bg-white"
                    />
                  </div>
                  <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white p-3">
                    <img
                      src="/assets/posts/china-cybersecurity-industry-mindmap.svg"
                      alt="中国网络安全行业岗位与技术思维导图"
                      className="h-auto w-full"
                    />
                  </div>
                  <a
                    href="/assets/posts/china-cybersecurity-industry-mindmap.svg"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center rounded-full border border-brand/30 bg-brand/10 px-4 py-2 text-xs font-semibold text-brand-dark"
                  >
                    查看高清 SVG
                  </a>
                  <a
                    href="/assets/posts/china-cybersecurity-industry-cards.html"
                    target="_blank"
                    rel="noreferrer"
                    className="ml-2 mt-4 inline-flex items-center rounded-full border border-brand/30 bg-white px-4 py-2 text-xs font-semibold text-brand-dark"
                  >
                    查看图文卡片（HTML）
                  </a>
                </div>
              </div>
            </section>

            <section className="glass-card rounded-3xl p-6 sm:p-7">
              <h2 className="text-xl font-semibold text-ink">八、参考来源（公开可访问）</h2>
              <div className="mt-4 space-y-3 text-sm">
                {SOURCES.map((source) => (
                  <div key={source.url} className="rounded-2xl border border-gray-200 bg-white p-4 text-muted">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-brand hover:underline"
                    >
                      {source.title}
                    </a>
                    <p className="mt-1 leading-relaxed">{source.note}</p>
                  </div>
                ))}
              </div>
            </section>
          </article>
        </div>
      </div>

      <SiteFooter maxWidthClass="max-w-7xl" />
    </div>
  );
}
