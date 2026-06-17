const workTiles = document.querySelectorAll(".tile");
const detailYear = document.querySelector("#detail-year");
const detailType = document.querySelector("#detail-type");
const caseDetailTitle = document.querySelector("#detail-title");
const detailSummary = document.querySelector("#detail-summary");
const detailProblem = document.querySelector("#detail-problem");
const detailRole = document.querySelector("#detail-role");
const detailProof = document.querySelector("#detail-proof");
const heroStage = document.querySelector(".hero-stage");
const personLayer = document.querySelector(".hero-person-layer");
const frontLayer = document.querySelector(".hero-front-layer");
const heroCluster = document.querySelector("#hero-cluster");
const caseLibrary = document.querySelector("#case-library");
const caseTable = document.querySelector("#case-table");
const screenshotArchive = document.querySelector("#screenshot-archive");
const journeyRunner = document.querySelector(".journey-runner");
const journeyStations = document.querySelectorAll(".journey-station");
const journeyKicker = document.querySelector("#journey-kicker");
const journeyMeta = document.querySelector("#journey-meta");
const journeyTitle = document.querySelector("#journey-title");
const journeyCopy = document.querySelector("#journey-copy");
const journeyTags = document.querySelector("#journey-tags");
const journeyMeter = document.querySelector(".skill-meter span");
const supportsFinePointer = window.matchMedia?.("(pointer: fine)").matches;

// Skill system variables - initialized later
let skillNodes, orbitCenter, skillDetailPanel, skillDetailBadge, skillDetailTitle, skillDetailSubtitle, skillDetailPowerValue, skillDetailDescription, skillDetailTags;
const escAttr = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

if (heroCluster && window.projectScreenshotArchive) {
  const priorityTitles = [
    "ROG",
    "联想NETAPP",
    "抖音电商生态大会",
    "极氪",
    "岚图",
    "BYD第二轮",
    "小米CJ",
    "航天信息发布会",
    "京东工业",
    "美团春归",
    "传祺广州车展",
    "中国化学工程集团产业链融通发展推进会",
    "BOE技术品牌赋能计划发布会",
    "小米MIPC",
    "巨量星图嘉年华",
    "度小满金融聚合支付大会",
    "传祺",
    "北京现代",
    "COLMO",
    "箭牌",
    "美的年框",
    "火山",
    "第一届“游戏+”论坛暨网易游戏社会责任促进中心成立发布会",
    "百度联盟峰会",
    "现代巡展",
    "汽车之家成都车展",
    "H3C Workspace 2.0",
    "Wave Summit"
  ];
  const archiveWithShots = window.projectScreenshotArchive.filter((item) => item.shots?.length);
  const featuredArchive = [
    ...priorityTitles
      .map((title) => archiveWithShots.find((item) => item.title.replace(/\s+/g, "") === title.replace(/\s+/g, "")))
      .filter(Boolean),
    ...archiveWithShots
  ]
    .filter((item, index, array) => array.findIndex((caseItem) => caseItem.title === item.title) === index)
    .slice(0, 28);

  heroCluster.innerHTML = featuredArchive
    .map((item, index) => {
      const shot = item.shots[0];
      return `
        <article
          class="hero-shot"
          data-folder-index="${index}"
          data-detail-url="./case.html?archive=${encodeURIComponent(item.title)}"
          data-case-title="${escAttr(item.title)}"
          data-case-meta="${escAttr(`${item.month} · 方案截图`)}"
          data-case-keywords="${escAttr("桌面项目资料 / 截图证据 / 可展开案例")}"
          data-case-level="${escAttr("Project Archive")}"
          data-case-hero="${escAttr(shot)}"
        >
          <img src="${shot}" alt="${escAttr(item.title)}项目截图" loading="${index < 6 ? "eager" : "lazy"}" />
          <span>${item.month} / ${item.title}</span>
        </article>
      `;
    })
    .join("");

  heroCluster.insertAdjacentHTML(
    "beforeend",
    `
      <div class="hero-folder-controls" aria-label="案例封面切换">
        <button type="button" class="hero-folder-button" data-folder-action="prev" aria-label="上一个项目">Prev</button>
        <strong><span id="hero-folder-current">01</span> / ∞</strong>
        <button type="button" class="hero-folder-button" data-folder-action="next" aria-label="下一个项目">Next</button>
      </div>
    `
  );

  const folderCards = [...heroCluster.querySelectorAll(".hero-shot")];
  const folderCounter = heroCluster.querySelector("#hero-folder-current");
  const heroSection = heroCluster.closest(".hero");
  let targetProgress = 0;
  let renderedProgress = 0;
  let pointerTiltX = 0;
  let pointerTiltY = 0;
  let renderedTiltX = 0;
  let renderedTiltY = 0;
  const hasGsapScroll = Boolean(window.gsap && window.ScrollTrigger);
  let gsapScrollActive = false;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const wrapIndex = (index) => (index + folderCards.length) % folderCards.length;
  const wrapProgress = (progress) => ((progress % folderCards.length) + folderCards.length) % folderCards.length;
  const shortestOffset = (index) => {
    const loopProgress = wrapProgress(renderedProgress);
    let offset = index - loopProgress;
    const half = folderCards.length / 2;
    if (offset > half) offset -= folderCards.length;
    if (offset < -half) offset += folderCards.length;
    return offset;
  };

  const renderFolderStack = () => {
    const activeFolder = wrapIndex(Math.round(wrapProgress(renderedProgress)));
    folderCounter.textContent = String(activeFolder + 1).padStart(2, "0");

    folderCards.forEach((card, index) => {
      const offset = shortestOffset(index);
      const abs = Math.abs(offset);
      const isActive = abs < 0.5;
      const front = Math.min(Math.max(-offset, 0), 4.5);
      const back = Math.min(Math.max(offset, 0), 9);
      const lane = index % 2 === 0 ? -1 : 1;
      const x = offset < 0
        ? -116 - front * 240 - front * front * 16
        : 28 + back * 108 + back * back * 5;
      const y = offset < 0
        ? 38 + front * 86 + lane * 12
        : -18 - back * 42 + lane * 8;
      const z = offset < 0
        ? 520 + front * 62
        : 430 - back * 118;
      const rotateY = offset < 0
        ? -31 + front * 4 + renderedTiltX * 0.72
        : -20 - back * 3.2 + renderedTiltX;
      const rotateX = offset < 0
        ? -5 + renderedTiltY * 0.72
        : -8 + renderedTiltY - back * 0.35;
      const rotateZ = offset < 0
        ? -7 + front * 1.8
        : 1 + back * 0.55;
      const scale = offset < 0
        ? Math.min(1.42, 1.04 + front * 0.09)
        : Math.max(0.46, 1 - back * 0.06);
      const opacity = abs > 9 ? 0 : Math.max(0.16, 1 - abs * 0.092);

      card.classList.toggle("is-active", isActive);
      card.style.zIndex = String(Math.round(120 - offset * 8));
      card.style.opacity = String(opacity);
      card.style.filter = `brightness(${offset < 0 ? 1.02 : Math.max(0.42, 1 - back * 0.08)}) saturate(${offset < 0 ? 1.04 : Math.max(0.5, 1 - back * 0.045)})`;
      card.style.pointerEvents = abs <= 2.2 ? "auto" : "none";
      card.style.transform = `
        translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), ${z}px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        rotateZ(${rotateZ}deg)
        scale(${scale})
      `;
    });
  };

  const syncFolderTargetFromScroll = () => {
    if (!heroSection) return;
      const rect = heroSection.getBoundingClientRect();
      const scrollRange = Math.max(1, rect.height - window.innerHeight);
      const rawProgress = clamp(-rect.top / scrollRange, 0, 1);
      targetProgress = rawProgress * folderCards.length;
  };

  const tickFolderMotion = () => {
    if (!hasGsapScroll || !gsapScrollActive) syncFolderTargetFromScroll();
    const progressDelta = targetProgress - renderedProgress;
    renderedProgress += progressDelta * 0.18;
    renderedTiltX += (pointerTiltX - renderedTiltX) * 0.07;
    renderedTiltY += (pointerTiltY - renderedTiltY) * 0.07;
    renderFolderStack();
    if (!hasGsapScroll) requestAnimationFrame(tickFolderMotion);
  };

  const moveFolder = (step) => {
    const nextIndex = wrapIndex(Math.round(wrapProgress(renderedProgress)) + step);
    if (!heroSection) {
      targetProgress = renderedProgress + shortestOffset(nextIndex);
      return;
    }
    const scrollRange = Math.max(1, heroSection.offsetHeight - window.innerHeight);
    const nextProgress = nextIndex / folderCards.length;
    const targetY = heroSection.offsetTop + scrollRange * nextProgress;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  heroCluster.querySelectorAll("[data-folder-action]").forEach((button) => {
    button.addEventListener("click", () => {
      moveFolder(button.dataset.folderAction === "next" ? 1 : -1);
    });
  });

  folderCards.forEach((card) => {
    card.addEventListener("click", () => {
      const index = Number(card.dataset.folderIndex);
      const offset = shortestOffset(index);
      if (Math.abs(offset) < 0.5 && card.dataset.detailUrl) {
        window.location.href = card.dataset.detailUrl;
        return;
      }
      targetProgress = renderedProgress + offset;
    });
  });

  heroCluster.addEventListener("pointermove", (event) => {
    const rect = heroCluster.getBoundingClientRect();
    const px = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    const py = clamp((event.clientY - rect.top) / rect.height, 0, 1);
    pointerTiltX = (px - 0.5) * 18;
    pointerTiltY = (py - 0.5) * -10;
  });

  heroCluster.addEventListener("pointerleave", () => {
    pointerTiltX = 0;
    pointerTiltY = 0;
  });

  renderFolderStack();

  if (hasGsapScroll) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: "power3.out", duration: 0.8 });

    const mm = gsap.matchMedia();
    mm.add(
      {
        reduceMotion: "(prefers-reduced-motion: reduce)",
        desktop: "(min-width: 769px)"
      },
      (context) => {
        const { reduceMotion, desktop } = context.conditions;

        if (reduceMotion) {
          renderedProgress = 0;
          targetProgress = 0;
          renderFolderStack();
          return;
        }

        gsap.from(".hero-orbit-copy > *", {
          autoAlpha: 0,
          y: 36,
          filter: "blur(10px)",
          stagger: 0.12,
          duration: 1,
          ease: "power3.out"
        });

        if (desktop && heroSection) {
          gsapScrollActive = true;
          ScrollTrigger.create({
            trigger: heroSection,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.65,
            refreshPriority: 1,
            onUpdate: (self) => {
              targetProgress = self.progress * folderCards.length;
            }
          });
        } else {
          gsapScrollActive = false;
          syncFolderTargetFromScroll();
        }

        gsap.ticker.add(tickFolderMotion);
        window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });

        return () => {
          gsapScrollActive = false;
          gsap.ticker.remove(tickFolderMotion);
        };
      }
    );
  } else {
    tickFolderMotion();
  }
}

const workDetails = {
  小鹏发布会: {
    year: "2024 / 07",
    type: "智能驾驶发布会 / 展区互动体验",
    summary:
      "围绕 AI 天玑系统与 XNGP 智驾能力，把技术发布从“信息展示”转成可进入、可体验、可打卡的现场路径。",
    problem: "把智能驾驶参数转成现场可体验的路线、任务和打卡内容。",
    role: "梳理发布会主题、展区互动机制、体验动线与任务打卡路径，将技术卖点转译成现场动作。",
    proof: "技术信息转译、发布会体验设计、互动机制、现场动线组织。"
  },
  "iCAR 品牌年度": {
    year: "2024 / 11",
    type: "年度公关传播竞标 / 汽车品牌策略",
    summary:
      "为 iCAR 品牌与产品矩阵建立年度传播框架，连接车型节奏、品牌事件、内容种草与媒介资源。",
    problem: "一个年轻汽车品牌如何在高密度竞争中建立更稳定的品牌识别和产品传播节奏。",
    role: "参与市场与传播环境梳理、年度目标拆解、产品矩阵传播、整合营销事件与内容长运营规划。",
    proof: "年度传播规划、产品矩阵梳理、品牌判断、内容策略。"
  },
  比亚迪智能化战略发布会: {
    year: "2024 / 12",
    type: "集团级技术发布 / 科技事件",
    summary:
      "围绕“天神之眼”“全民智驾时代”“D-SPACE 超级社区”，把智能化战略包装成有叙事、有任务、有体验的发布场景。",
    problem: "如何让宏大的智能化战略不止停留在概念层，而能被观众感知为具体的技术价值和未来生活方式。",
    role: "提炼技术价值、组织发布叙事、设计沉浸式任务指引与互动模块，协助形成发布期体验逻辑。",
    proof: "战略叙事、科技概念转译、沉浸体验、发布期传播理解。"
  },
  "腾讯游戏 CJ": {
    year: "2025 / 05",
    type: "ChinaJoy 集合展区 / C 端互动",
    summary:
      "以“燃鹅运动会”包装腾讯游戏展区，把游戏、运动、健康、潮玩和 UGC 参与机制放进同一个现场。",
    problem: "大型游戏展区如何同时承载产品展示、玩家参与、社交传播和品牌整体感。",
    role: "建立主题概念、设计沉浸式潮玩运动会体验、梳理互动打卡与玩家动线。",
    proof: "年轻人洞察、IP 场景包装、展区流线、互动机制。"
  },
  "TikTok ShopNow 峰会": {
    year: "2025 / 07",
    type: "品牌电商出海营销峰会 / B 端会议",
    summary:
      "围绕 TikTok for Business 与 ShopNow 的出海增长议题，搭建峰会主题、品牌力量表达与现场活动结构。",
    problem: "如何把跨境电商和广告增长这样的 B 端议题，转化成足够清晰、有吸引力的峰会表达。",
    role: "参与峰会主题理解、品牌增长逻辑梳理、内容结构与现场活动模块组织。",
    proof: "B 端议题包装、跨境电商语境、峰会结构、品牌叙事。"
  },
  中国多智能体应用大会: {
    year: "2025 / 10",
    type: "AI 行业大会 / 生态会议",
    summary:
      "围绕“群智进化”“共生共创”，把多智能体技术议题组织成论坛、成果展、案例墙、合作展位和互动装置。",
    problem: "复杂技术议题如何从学术/产业材料中走出来，成为能被参会者理解、交流和沉淀关系的现场。",
    role: "梳理大会策略、主论坛内容、展区结构、互动装置、合作展示与打卡传播路径。",
    proof: "复杂技术议题转译、论坛结构、生态关系沉淀、展陈内容规划。"
  },
  "Wave Summit": {
    year: "2021-2024",
    type: "AI 开发者峰会 / 技术品牌活动",
    summary:
      "从早期策划基本功到后续工作室项目，Wave Summit 是技术大会经验中一条连续的方法线。",
    problem: "开发者大会如何在技术严肃性、品牌表达和现场参与之间找到平衡。",
    role: "参与技术品牌表达、峰会议题结构、主题包装和内容层级梳理。",
    proof: "技术品牌表达、开发者议题、峰会叙事、内容结构。"
  },
  埃安泰国车展: {
    year: "2023 / 10 · 2024 / 10",
    type: "海外车展 / 品牌展陈",
    summary:
      "面向海外车展语境，组织汽车品牌出海、产品展示、展台体验和视觉传播之间的关系。",
    problem: "汽车品牌进入海外展会时，如何把产品信息、品牌识别和现场体验压缩成可识别的展陈语言。",
    role: "参与车展项目资料整理、展台体验方向、品牌展示结构和传播关键词提炼。",
    proof: "国际化展示语境、展台体验、品牌视觉化表达。"
  }
};

const renderWorkDetail = (name) => {
  const detail = workDetails[name];
  if (!detail) return;

  detailYear.textContent = detail.year;
  detailType.textContent = detail.type;
  detailTitle.textContent = name;
  detailSummary.textContent = detail.summary;
  detailProblem.textContent = detail.problem;
  detailRole.textContent = detail.role;
  detailProof.textContent = detail.proof;
};

workTiles.forEach((tile) => {
  tile.addEventListener("click", () => {
    workTiles.forEach((item) => item.classList.remove("is-active"));
    tile.classList.add("is-active");
    renderWorkDetail(tile.dataset.work);
  });
});

workTiles[0]?.classList.add("is-active");

if ((caseLibrary || caseTable || screenshotArchive) && window.portfolioCases) {
  const groupOrder = [
    "展陈与空间叙事",
    "汽车与产品体验",
    "品牌活动与互动机制",
    "科技展台与AI交互",
    "科技大会与议题转译",
    "平台活动与公共参与",
    "公关传播与品牌策略"
  ];
  const scaleOrder = { 旗舰: 0, 重点: 1, 补充: 2 };
  const scaleLabel = {
    旗舰: "核心案例",
    重点: "展开案例",
    补充: "档案案例",
    档案: "历史档案"
  };
  const groupMeta = {
    展陈与空间叙事: {
      label: "Spatial Narratives",
      zh: "空间叙事与展陈系统",
      en: "Archive 01",
      icon: "space",
      note: "把复杂信息组织成可进入、可行走、可感知的空间秩序。"
    },
    汽车与产品体验: {
      label: "Product Experience",
      zh: "产品发布与场景体验",
      en: "Archive 02",
      icon: "vehicle",
      note: "将产品价值从参数语言转译为场景、路线与生活方式验证。"
    },
    品牌活动与互动机制: {
      label: "Participation System",
      zh: "品牌事件与参与机制",
      en: "Archive 03",
      icon: "ritual",
      note: "通过任务、社交和现场行动组织品牌参与。"
    },
    科技展台与AI交互: {
      label: "Tech Interface",
      zh: "科技展台与交互转译",
      en: "Archive 04",
      icon: "interface",
      note: "把技术议题压缩成可理解、可操作、可停留的交互界面。"
    },
    科技大会与议题转译: {
      label: "Conference Narrative",
      zh: "技术议题与大会叙事",
      en: "Archive 05",
      icon: "signal",
      note: "将抽象技术语言转化为会议主题、传播句法与公共理解。"
    },
    平台活动与公共参与: {
      label: "Public Activation",
      zh: "平台活动与公共动员",
      en: "Archive 06",
      icon: "crowd",
      note: "围绕平台语境设计参与节奏、社交动机与现场热度。"
    },
    公关传播与品牌策略: {
      label: "Brand Strategy",
      zh: "公关策略与品牌心智",
      en: "Archive 07",
      icon: "prism",
      note: "在品牌处境、传播目标与公众心智之间建立判断框架。"
    }
  };
  const archiveProjects = [
    { year: "2022.03", title: "厨房小家电健康趋势发布会", group: "品牌活动与互动机制", category: "趋势发布 / 活动方案", keywords: ["健康趋势", "发布会", "产品内容"], role: "方案截图资料" },
    { year: "2022.03", title: "Wave Summit", group: "科技大会与议题转译", category: "AI峰会 / 技术大会", keywords: ["AI峰会", "技术议题", "大会主题"], role: "方案截图资料" },
    { year: "2022.03", title: "度小满年框", group: "公关传播与品牌策略", category: "年度框架 / 金融品牌", keywords: ["年度传播", "金融", "品牌活动"], role: "方案截图资料" },
    { year: "2022.03", title: "55购物节", group: "平台活动与公共参与", category: "节日营销 / 平台活动", keywords: ["购物节", "城市消费", "活动传播"], role: "方案截图资料" },
    { year: "2022.04", title: "美好目的地", group: "品牌活动与互动机制", category: "目的地营销 / 体验活动", keywords: ["目的地", "场景体验", "活动策划"], role: "方案截图资料" },
    { year: "2022.04", title: "realme 火影手机发布会", group: "汽车与产品体验", category: "产品发布 / IP联名", keywords: ["手机发布", "IP联名", "发布会"], role: "方案截图资料" },
    { year: "2022.04", title: "比亚迪跨界粉丝", group: "汽车与产品体验", category: "汽车品牌 / 粉丝活动", keywords: ["比亚迪", "跨界", "粉丝运营"], role: "方案截图资料" },
    { year: "2022.04", title: "哈弗 5-6 月营销", group: "汽车与产品体验", category: "汽车品牌 / 阶段营销", keywords: ["哈弗", "阶段营销", "产品传播"], role: "方案截图资料" },
    { year: "2022.04", title: "李宁极限飞盘", group: "品牌活动与互动机制", category: "运动品牌 / 互动活动", keywords: ["李宁", "飞盘", "运动社交"], role: "方案截图资料" },
    { year: "2022.05", title: "小米暑促", group: "品牌活动与互动机制", category: "消费电子 / 促销活动", keywords: ["小米", "暑促", "用户互动"], role: "方案截图资料" },
    { year: "2022.05", title: "巨量星图嘉年华", group: "平台活动与公共参与", category: "平台活动 / 嘉年华", keywords: ["巨量星图", "嘉年华", "达人生态"], role: "方案截图资料" },
    { year: "2022.05", title: "BOE 技术品牌赋能计划发布会", group: "科技大会与议题转译", category: "技术品牌 / 发布会", keywords: ["BOE", "技术品牌", "赋能计划"], role: "方案截图资料" },
    { year: "2022.05", title: "小红书渠道营销会", group: "平台活动与公共参与", category: "平台营销 / 渠道会", keywords: ["小红书", "渠道营销", "平台生态"], role: "方案截图资料" },
    { year: "2022.06", title: "H3C Workspace 2.0", group: "科技展台与AI交互", category: "科技发布 / 企业服务", keywords: ["H3C", "Workspace", "企业服务"], role: "方案截图资料" },
    { year: "2022.06", title: "启牛日", group: "品牌活动与互动机制", category: "品牌日 / 活动策划", keywords: ["启牛", "品牌日", "活动机制"], role: "方案截图资料" },
    { year: "2022.07", title: "极狐露营", group: "汽车与产品体验", category: "汽车生活方式 / 露营活动", keywords: ["极狐", "露营", "生活方式"], role: "方案截图资料" },
    { year: "2022.07", title: "友邦 MDRT", group: "品牌活动与互动机制", category: "保险行业 / 会议活动", keywords: ["友邦", "MDRT", "会议活动"], role: "方案截图资料" },
    { year: "2022.07", title: "哈弗巡展", group: "汽车与产品体验", category: "汽车巡展 / 线下活动", keywords: ["哈弗", "巡展", "用户体验"], role: "方案截图资料" },
    { year: "2022.07", title: "汽车之家成都车展", group: "汽车与产品体验", category: "车展活动 / 平台展区", keywords: ["汽车之家", "成都车展", "展区互动"], role: "方案截图资料" },
    { year: "2022.08", title: "居然之家音乐节", group: "品牌活动与互动机制", category: "商业空间 / 音乐节", keywords: ["居然之家", "音乐节", "商业活动"], role: "方案截图资料" },
    { year: "2022.08", title: "快手年框", group: "平台活动与公共参与", category: "平台年度框架", keywords: ["快手", "年度框架", "平台活动"], role: "方案截图资料" },
    { year: "2022.08", title: "度小满金融聚合支付大会", group: "科技大会与议题转译", category: "金融科技 / 行业大会", keywords: ["度小满", "聚合支付", "大会"], role: "方案截图资料" },
    { year: "2022.08", title: "天全县美食节", group: "平台活动与公共参与", category: "城市文旅 / 美食节", keywords: ["天全县", "美食节", "地方文旅"], role: "方案截图资料" },
    { year: "2022.09", title: "小米双十一", group: "品牌活动与互动机制", category: "消费电子 / 电商营销", keywords: ["小米", "双十一", "营销活动"], role: "方案截图资料" },
    { year: "2022.09", title: "卡游巡展", group: "品牌活动与互动机制", category: "IP产品 / 巡展活动", keywords: ["卡游", "巡展", "IP产品"], role: "方案截图资料" },
    { year: "2022.09", title: "潜江旅游", group: "平台活动与公共参与", category: "城市文旅 / 目的地传播", keywords: ["潜江", "旅游", "目的地"], role: "方案截图资料" },
    { year: "2022.10", title: "传祺北京车展", group: "汽车与产品体验", category: "车展 / 展台运营", keywords: ["传祺", "北京车展", "展台"], role: "方案截图资料" },
    { year: "2022.10", title: "现代巡展", group: "汽车与产品体验", category: "汽车巡展 / 体验活动", keywords: ["现代", "巡展", "车展"], role: "方案截图资料" },
    { year: "2022.10", title: "第一届“游戏+”论坛暨网易游戏社会责任促进中心成立发布会", group: "科技大会与议题转译", category: "论坛 / 发布会", keywords: ["网易游戏", "社会责任", "论坛"], role: "方案截图资料" },
    { year: "2022.10", title: "百度联盟峰会", group: "科技大会与议题转译", category: "互联网峰会", keywords: ["百度", "联盟峰会", "行业会议"], role: "方案截图资料" },
    { year: "2022.11", title: "李宁成都开业", group: "品牌活动与互动机制", category: "开业活动 / 运动品牌", keywords: ["李宁", "成都", "开业活动"], role: "方案截图资料" },
    { year: "2022.11", title: "大悦城15周年", group: "品牌活动与互动机制", category: "商业周年 / 活动策划", keywords: ["大悦城", "周年", "商业活动"], role: "方案截图资料" },
    { year: "2022.11", title: "字节装修", group: "展陈与空间叙事", category: "办公空间 / 节点装置", keywords: ["字节", "空间装置", "办公场景"], role: "方案截图资料" },
    { year: "2022.12", title: "卫龙辣条", group: "品牌活动与互动机制", category: "消费品牌 / 活动传播", keywords: ["卫龙", "消费品牌", "传播活动"], role: "方案截图资料" },
    { year: "2023.01", title: "卫龙第二轮", group: "品牌活动与互动机制", category: "消费品牌 / 方案迭代", keywords: ["卫龙", "方案迭代", "品牌活动"], role: "方案截图资料" },
    { year: "2023.01", title: "BYD 第一轮", group: "汽车与产品体验", category: "汽车品牌 / 前期方案", keywords: ["BYD", "前期方案", "汽车传播"], role: "方案截图资料" },
    { year: "2023.02", title: "抖音电商生态大会", group: "平台活动与公共参与", category: "平台大会 / 电商生态", keywords: ["抖音电商", "生态大会", "平台活动"], role: "方案截图资料" },
    { year: "2023.02", title: "BYD 第二轮", group: "汽车与产品体验", category: "汽车品牌 / 方案迭代", keywords: ["BYD", "方案迭代", "汽车传播"], role: "方案截图资料" },
    { year: "2023.02", title: "卫龙第三轮", group: "品牌活动与互动机制", category: "消费品牌 / 方案迭代", keywords: ["卫龙", "辣条", "方案迭代"], role: "方案截图资料" },
    { year: "2023.02", title: "易点云", group: "科技大会与议题转译", category: "企业服务 / 品牌活动", keywords: ["易点云", "企业服务", "活动方案"], role: "方案截图资料" },
    { year: "2023.03", title: "极氪", group: "汽车与产品体验", category: "汽车品牌 / 活动方案", keywords: ["极氪", "汽车活动", "用户体验"], role: "方案截图资料" },
    { year: "2023.03", title: "北京现代", group: "汽车与产品体验", category: "车展 / 年度规划", keywords: ["北京现代", "车展", "运营规划"], role: "方案截图资料" },
    { year: "2023.03", title: "岚图", group: "汽车与产品体验", category: "汽车品牌 / 活动方案", keywords: ["岚图", "新能源", "活动方案"], role: "方案截图资料" },
    { year: "2023.03", title: "传祺", group: "汽车与产品体验", category: "汽车品牌 / 活动方案", keywords: ["传祺", "汽车活动", "传播方案"], role: "方案截图资料" },
    { year: "2023.03", title: "麻辣麻辣", group: "品牌活动与互动机制", category: "餐饮消费 / 品牌活动", keywords: ["餐饮", "消费品牌", "活动方案"], role: "方案截图资料" },
    { year: "2023.04", title: "ROG", group: "品牌活动与互动机制", category: "游戏品牌 / 展区活动", keywords: ["ROG", "游戏品牌", "互动机制"], role: "方案截图资料" },
    { year: "2023.04", title: "联想 NETAPP", group: "科技展台与AI交互", category: "科技品牌 / 联合展台", keywords: ["联想", "NetApp", "科技展台"], role: "方案截图资料" },
    { year: "2023.04", title: "COLMO", group: "品牌活动与互动机制", category: "高端家电 / 品牌活动", keywords: ["COLMO", "高端家电", "场景体验"], role: "方案截图资料" },
    { year: "2023.04", title: "箭牌", group: "品牌活动与互动机制", category: "家居品牌 / 活动方案", keywords: ["箭牌", "家居", "品牌活动"], role: "方案截图资料" },
    { year: "2023.05", title: "火山", group: "平台活动与公共参与", category: "平台活动 / 内容生态", keywords: ["火山", "平台活动", "内容生态"], role: "方案截图资料" },
    { year: "2023.05", title: "丛台酒", group: "品牌活动与互动机制", category: "酒类品牌 / 活动方案", keywords: ["丛台酒", "酒类", "品牌活动"], role: "方案截图资料" },
    { year: "2023.05", title: "六桂福", group: "品牌活动与互动机制", category: "珠宝品牌 / 活动方案", keywords: ["六桂福", "珠宝", "品牌活动"], role: "方案截图资料" },
    { year: "2023.06", title: "航天信息发布会", group: "科技大会与议题转译", category: "科技发布 / 企业会议", keywords: ["航天信息", "发布会", "科技议题"], role: "方案截图资料" },
    { year: "2023.06", title: "Coffee Break", group: "品牌活动与互动机制", category: "社交活动 / 现场机制", keywords: ["Coffee Break", "社交场景", "现场机制"], role: "方案截图资料" },
    { year: "2023.06", title: "小米 CJ", group: "品牌活动与互动机制", category: "消费电子 / 展会活动", keywords: ["小米", "ChinaJoy", "展会"], role: "方案截图资料" },
    { year: "2023.08", title: "美的年框", group: "公关传播与品牌策略", category: "年度框架 / 消费品牌", keywords: ["美的", "年度框架", "品牌传播"], role: "方案截图资料" },
    { year: "2023.08", title: "美团春归", group: "平台活动与公共参与", category: "平台活动 / 春季项目", keywords: ["美团", "春归", "平台活动"], role: "方案截图资料" },
    { year: "2023.08", title: "京东工业", group: "科技大会与议题转译", category: "工业品平台 / 行业活动", keywords: ["京东工业", "B2B", "行业活动"], role: "方案截图资料" },
    { year: "2023.09", title: "传祺广州车展", group: "汽车与产品体验", category: "车展 / 展台活动", keywords: ["传祺", "广州车展", "展台"], role: "方案截图资料" },
    { year: "2023.09", title: "传祺东莞车站", group: "汽车与产品体验", category: "汽车品牌 / 区域活动", keywords: ["传祺", "东莞", "区域活动"], role: "方案截图资料" },
    { year: "2023.09", title: "小米 MIPC", group: "品牌活动与互动机制", category: "消费电子 / 发布活动", keywords: ["小米", "MIPC", "产品活动"], role: "方案截图资料" },
    { year: "2023.09", title: "中国化学工程集团产业链融通发展推进会", group: "科技大会与议题转译", category: "央企会议 / 产业链议题", keywords: ["中国化学", "产业链", "推进会"], role: "方案截图资料" }
  ].map((item) => ({
    id: "",
    level: "档案",
    scale: "历史资料",
    images: [],
    hero: "",
    why: "桌面项目资料索引",
    ...item
  }));
  const generatedProjects = Array.isArray(window.fullProjectIndex) ? window.fullProjectIndex : [];
  const tableCases = generatedProjects.length ? generatedProjects : [...window.portfolioCases, ...archiveProjects];

  if (caseLibrary) {
    caseLibrary.innerHTML = groupOrder
      .map((group) => {
        const groupCases = window.portfolioCases
          .filter((item) => item.group === group)
          .sort((a, b) => scaleOrder[a.level] - scaleOrder[b.level] || b.year.localeCompare(a.year));

        if (!groupCases.length) return "";

        return `
          <section class="case-group" aria-label="${group}">
            <div class="case-group-title">
              <i class="case-group-icon icon-${groupMeta[group].icon}" aria-hidden="true"></i>
              <small>${groupMeta[group].en} / ${groupCases.length} cases · and more</small>
              <span>${groupMeta[group].label}</span>
              <strong>${groupMeta[group].zh}</strong>
              <p>${groupMeta[group].note}</p>
            </div>
            <div class="case-group-grid">
              ${groupCases
                .map(
                  (item) => `
                    <a
                      class="case-card scale-${item.level}"
                      href="./case.html?id=${item.id}"
                      data-case-title="${escAttr(item.title)}"
                      data-case-meta="${escAttr(`${item.year} · ${item.category}`)}"
                      data-case-keywords="${escAttr(item.keywords.slice(0, 4).join(" / "))}"
                      data-case-level="${escAttr(scaleLabel[item.level])}"
                      data-case-hero="${escAttr(item.hero)}"
                    >
                      <span class="case-card-symbol" aria-hidden="true"></span>
                      <img src="${item.hero}" alt="${item.title}" />
                      <div class="case-card-body">
                        <div class="case-card-level">
                          <span>${scaleLabel[item.level]}</span>
                          <span>${item.scale}</span>
                        </div>
                        <h3>${item.title}</h3>
                        <p>${item.keywords.slice(0, 4).join(" / ")}</p>
                        <em>${item.why}</em>
                      </div>
                    </a>
                  `
                )
                .join("")}
            </div>
          </section>
        `;
      })
      .join("");
  }

  if (caseTable) {
    const caseTools = document.querySelector("#case-tools");
    const caseSearch = document.querySelector("#case-search");
    let activeCaseFilter = "all";
    let caseSearchQuery = "";

    const sourceLabel = (item) => {
      if (item.sourceType === "work-summary" || item.source?.includes("项目精华沉淀")) return "精华沉淀";
      if (item.sourceType === "company-project-index") return "公司索引";
      if (item.sourceType === "absen-senior-planner-project") return "早期项目";
      return scaleLabel[item.level] || item.level;
    };

    const matchesSearch = (item) => {
      if (!caseSearchQuery) return true;
      const haystack = [
        item.title,
        item.year,
        item.group,
        item.category,
        item.scale,
        item.role,
        item.why,
        item.thinking,
        item.value,
        ...(item.keywords || [])
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(caseSearchQuery);
    };

    const renderCaseTable = () => {
      const visibleCases = tableCases.filter((item) => {
        const isEssence = item.sourceType === "work-summary" || item.source?.includes("项目精华沉淀");
        if (activeCaseFilter === "essence" && !isEssence) return false;
        return matchesSearch(item);
      });

      caseTable.innerHTML = groupOrder
        .map((group) => {
          const groupCases = visibleCases
            .filter((item) => item.group === group)
            .sort(
              (a, b) =>
                (scaleOrder[a.level] ?? 9) - (scaleOrder[b.level] ?? 9) ||
                String(b.year).localeCompare(String(a.year))
            );

          if (!groupCases.length) return "";

          return `
            <section class="case-table-group">
              <h3>${groupMeta[group].zh}<span>${groupCases.length} cases · and more</span></h3>
              <div class="case-table">
                <div class="case-row case-row-head">
                  <span>Year</span>
                  <span>Project</span>
                  <span>Archive</span>
                  <span>Type</span>
                  <span>Keywords / Role</span>
                </div>
                ${groupCases
                  .map((item) => {
                    const rowInner = `
                      <span>${item.year}</span>
                      <strong>${item.title}</strong>
                      <span>${sourceLabel(item)}</span>
                      <span>${item.category}</span>
                      <em>${item.keywords.slice(0, 5).join(" / ")}｜${item.role}</em>
                    `;

                    if (item.id) {
                      return `
                        <a
                          class="case-row"
                          href="./case.html?id=${item.id}"
                          data-case-title="${escAttr(item.title)}"
                          data-case-meta="${escAttr(`${item.year} · ${item.category}`)}"
                          data-case-keywords="${escAttr(item.keywords.slice(0, 5).join(" / "))}"
                          data-case-level="${escAttr(scaleLabel[item.level])}"
                          data-case-hero="${escAttr(item.hero)}"
                        >${rowInner}</a>
                      `;
                    }

                    if (item.slug) {
                      return `
                        <a
                          class="case-row is-archive"
                          href="./case.html?project=${encodeURIComponent(item.slug)}"
                          data-case-title="${escAttr(item.title)}"
                          data-case-meta="${escAttr(`${item.year} · ${item.category}`)}"
                          data-case-keywords="${escAttr(item.keywords.slice(0, 5).join(" / "))}"
                          data-case-level="${escAttr(scaleLabel[item.level] || item.level)}"
                          data-case-hero="${escAttr(item.hero || "")}"
                        >${rowInner}</a>
                      `;
                    }

                    return `
                      <a
                        class="case-row is-archive"
                        href="./case.html?archive=${encodeURIComponent(item.title)}"
                        data-case-title="${escAttr(item.title)}"
                        data-case-meta="${escAttr(`${item.year} · ${item.category}`)}"
                        data-case-keywords="${escAttr(item.keywords.slice(0, 5).join(" / "))}"
                        data-case-level="${escAttr(scaleLabel[item.level])}"
                      >${rowInner}</a>
                    `;
                  })
                  .join("")}
              </div>
            </section>
          `;
        })
        .join("");

      if (!caseTable.innerHTML.trim()) {
        caseTable.innerHTML = `<p class="case-empty">没有匹配到项目。</p>`;
      }
    };

    caseSearch?.addEventListener("input", (event) => {
      caseSearchQuery = event.target.value.trim().toLowerCase();
      renderCaseTable();
    });

    caseTools?.querySelectorAll("[data-case-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        activeCaseFilter = button.dataset.caseFilter;
        caseTools.querySelectorAll("[data-case-filter]").forEach((item) => item.classList.toggle("is-active", item === button));
        renderCaseTable();
      });
    });

    renderCaseTable();
  }

  if (screenshotArchive && window.projectScreenshotArchive) {
    screenshotArchive.innerHTML = window.projectScreenshotArchive
      .map((item, index) => {
        const shots = item.shots.slice(0, 3);
        return `
          <a
            class="screenshot-card"
            href="./case.html?archive=${encodeURIComponent(item.title)}"
            data-case-title="${escAttr(item.title)}"
            data-case-meta="${escAttr(`${item.month} · 方案截图档案`)}"
            data-case-keywords="${escAttr(`${shots.length} 张截图 / 桌面项目资料 / 可继续展开详情`)}"
            data-case-level="${escAttr("Screenshot Archive")}"
            data-case-hero="${escAttr(shots[0])}"
            style="--delay:${index % 9}"
          >
            <div class="screenshot-stack" aria-hidden="true">
              ${shots
                .map(
                  (shot, shotIndex) => `
                    <img
                      src="${shot}"
                      alt=""
                      loading="lazy"
                      style="--shot:${shotIndex}"
                    />
                  `
                )
                .join("")}
            </div>
            <div class="screenshot-card-copy">
              <span>${item.month}</span>
              <strong>${item.title}</strong>
              <em>${shots.length} screenshots</em>
            </div>
          </a>
        `;
      })
      .join("");
  }

  if (supportsFinePointer) {
    const caseCursor = document.createElement("aside");
    caseCursor.className = "case-cursor";
    caseCursor.setAttribute("aria-hidden", "true");
    caseCursor.innerHTML = `
      <div class="case-cursor-media"><span>CASE INDEX</span></div>
      <div class="case-cursor-copy">
        <small></small>
        <strong></strong>
        <p></p>
      </div>
    `;
    document.body.appendChild(caseCursor);

    const cursorMedia = caseCursor.querySelector(".case-cursor-media");
    const cursorLevel = caseCursor.querySelector("small");
    const cursorTitle = caseCursor.querySelector("strong");
    const cursorKeywords = caseCursor.querySelector("p");
    const caseTargets = document.querySelectorAll("[data-case-title]");

    const moveCursor = (event) => {
      caseCursor.style.setProperty("--cursor-x", `${event.clientX}px`);
      caseCursor.style.setProperty("--cursor-y", `${event.clientY}px`);
    };

    const updateCaseCursor = (target) => {
      const { caseTitle, caseMeta, caseKeywords, caseLevel, caseHero } = target.dataset;
      cursorLevel.textContent = `${caseLevel} / ${caseMeta}`;
      cursorTitle.textContent = caseTitle;
      cursorKeywords.textContent = caseKeywords;

      if (caseHero) {
        cursorMedia.style.backgroundImage = `linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.34)), url("${caseHero}")`;
        cursorMedia.classList.add("has-image");
      } else {
        cursorMedia.style.backgroundImage = "";
        cursorMedia.classList.remove("has-image");
      }
    };

    caseTargets.forEach((target) => {
      target.addEventListener("pointerenter", (event) => {
        updateCaseCursor(target);
        caseCursor.classList.add("is-visible");
        moveCursor(event);
      });

      target.addEventListener("pointermove", (event) => {
        const rect = target.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        updateCaseCursor(target);
        caseCursor.classList.add("is-visible");
        target.style.setProperty("--mx", `${x * 100}%`);
        target.style.setProperty("--my", `${y * 100}%`);
        target.style.setProperty("--tilt-x", `${(y - 0.5) * -5}deg`);
        target.style.setProperty("--tilt-y", `${(x - 0.5) * 7}deg`);
        target.style.setProperty("--corner", `${10 + x * 34}px ${10 + y * 34}px ${34 - x * 20}px ${34 - y * 20}px`);
        moveCursor(event);
      });

      target.addEventListener("pointerleave", () => {
        target.style.removeProperty("--tilt-x");
        target.style.removeProperty("--tilt-y");
        target.style.removeProperty("--corner");
        caseCursor.classList.remove("is-visible");
      });
    });
  }
}

const journeyDetails = {
  brief: {
    category: "CORE SKILLS",
    title: "洞察力",
    subtitle: "Insight",
    description: "极具穿透力的判断能力，能够在复杂信息中迅速抓住关键变量，对项目本质有清晰直觉式判断。",
    level: "90",
    meter: "90%",
    tags: ["高度成熟", "关键识别", "直觉判断"],
    status: "HIGHLY SHARP"
  },
  narrative: {
    category: "CORE SKILLS",
    title: "共情力",
    subtitle: "Empathy",
    description: "敏锐而稳定的情绪理解能力，能够准确捕捉用户行为背后的动机与情绪，并转化为设计语言。",
    level: "90",
    meter: "90%",
    tags: ["高度敏感", "情绪捕捉", "用户导向"],
    status: "VERY SENSITIVE"
  },
  structure: {
    category: "CORE SKILLS",
    title: "分析力",
    subtitle: "Analysis",
    description: "结构化思维驱动的分析能力，善于将复杂需求拆解为清晰模块，并建立可执行路径。",
    level: "100",
    meter: "100%",
    tags: ["极强结构化", "模块化", "路径建立"],
    status: "EXTREMELY STRONG"
  },
  delivery: {
    category: "CORE SKILLS",
    title: "执行力",
    subtitle: "Execution",
    description: "稳定且高效的落地驱动能力，能够持续推动项目从概念进入现实，并在多方协作中保持节奏。",
    level: "95",
    meter: "95%",
    tags: ["高效落地", "项目推进", "协作协调"],
    status: "HIGHLY RELIABLE"
  },
  empathy: {
    category: "CORE SKILLS",
    title: "AI协同力",
    subtitle: "AI Synergy",
    description: "融合AI工具的创意生产能力，将智能辅助与人类创造力结合，实现效率与质量的双重提升。",
    level: "88",
    meter: "88%",
    tags: ["工具融合", "智能创造", "效率提升"],
    status: "CUTTING-EDGE"
  },
  pr: {
    category: "PRIMARY",
    title: "传播矩阵",
    subtitle: "Amplification Matrix",
    description: "设计媒体生态与传播策略，创造持续的品牌对话",
    level: "90",
    meter: "90%",
    tags: ["媒体架构", "KOL网络", "内容传播"]
  },
  ai: {
    category: "EQUIPPED",
    title: "AI协作",
    subtitle: "AI Co-pilot",
    description: "运用AI工具增强创意与战略工作流程",
    level: "82",
    meter: "82%",
    tags: ["工具整合", "智能辅助", "效率优化"]
  }
};

const renderJourneyDetail = (key) => {
  // Re-query elements to ensure they exist
  const badge = document.querySelector("#skill-detail-badge");
  const title = document.querySelector("#skill-detail-title");
  const subtitle = document.querySelector("#skill-detail-subtitle");
  const power = document.querySelector("#skill-detail-power-value");
  const desc = document.querySelector("#skill-detail-description");
  const tags = document.querySelector("#skill-detail-tags");
  const orbit = document.querySelector("#orbit-center");

  const detail = journeyDetails[key];
  if (!detail) return;

  // Update skill detail panel
  if (badge) badge.textContent = detail.category;
  if (title) title.textContent = detail.title;
  if (subtitle) subtitle.textContent = detail.subtitle;
  if (power) power.textContent = detail.meter;
  if (desc) desc.textContent = detail.description;
  if (tags) {
    tags.innerHTML = detail.tags.map((tag) => `<span>${tag}</span>`).join("");
  }

  // Add pulse animation to center video
  if (orbit) {
    orbit.style.transform = "translateX(-50%) scale(1.02)";
    setTimeout(() => {
      orbit.style.transform = "translateX(-50%) scale(1)";
    }, 300);
  }

  console.log("Rendered skill:", key, detail.title);
};

const renderRadarChart = () => {
  const svg = document.getElementById("skill-radar");
  if (!svg) return;

  const keys = ["brief", "narrative", "structure", "delivery", "pr", "ai"];
  const labels = ["BRIEF", "NARRATIVE", "STRUCTURE", "DELIVERY", "PR", "AI"];
  const gridGroup = svg.querySelector(".radar-grid");
  const area = svg.querySelector(".radar-area");
  const pointsGroup = svg.querySelector(".radar-points");
  const labelsGroup = svg.querySelector(".radar-labels");
  if (!gridGroup || !area || !pointsGroup || !labelsGroup) return;

  const center = 100;
  const radius = 78;

  keys.forEach((_, i) => {
    const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
    const x2 = center + radius * Math.cos(angle);
    const y2 = center + radius * Math.sin(angle);
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", center);
    line.setAttribute("y1", center);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    gridGroup.appendChild(line);
  });

  [0.2, 0.4, 0.6, 0.8, 1].forEach((scale) => {
    const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    const pts = Array.from({ length: 6 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
      return `${center + radius * scale * Math.cos(angle)},${center + radius * scale * Math.sin(angle)}`;
    }).join(" ");
    polygon.setAttribute("points", pts);
    gridGroup.appendChild(polygon);
  });

  const areaPts = [];
  keys.forEach((key, i) => {
    const value = parseInt(journeyDetails[key].meter, 10) / 100;
    const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
    const x = center + radius * value * Math.cos(angle);
    const y = center + radius * value * Math.sin(angle);
    areaPts.push(`${x},${y}`);

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", 4);
    circle.setAttribute("class", "radar-point");
    pointsGroup.appendChild(circle);

    const labelRadius = radius + 14;
    const lx = center + labelRadius * Math.cos(angle);
    const ly = center + labelRadius * Math.sin(angle);
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", lx);
    text.setAttribute("y", ly + 3);
    text.setAttribute("class", "radar-label");
    text.textContent = labels[i];
    labelsGroup.appendChild(text);
  });

  area.setAttribute("points", areaPts.join(" "));
};

renderRadarChart();

const animateJourneyMarker = (station) => {
  if (!station) return;
  const detailPanel = document.querySelector(".journey-detail");

  if (window.gsap) {
    gsap.killTweensOf(station);
    gsap.set(station, { "--marker-progress": 0 });
    gsap.to(station, {
      "--marker-progress": 1,
      duration: 0.58,
      ease: "power3.out"
    });

    if (detailPanel) {
      gsap.killTweensOf(detailPanel);
      gsap.set(detailPanel, { "--detail-marker": 0 });
      gsap.to(detailPanel, {
        "--detail-marker": 1,
        duration: 0.64,
        delay: 0.05,
        ease: "power3.out"
      });
    }
    return;
  }

  station.style.setProperty("--marker-progress", 0);
  requestAnimationFrame(() => {
    station.style.setProperty("--marker-progress", 1);
  });
};

journeyStations.forEach((station) => {
  const activateStation = () => {
    journeyStations.forEach((item) => item.classList.remove("is-active"));
    station.classList.add("is-active");
    journeyRunner?.setAttribute("data-active", station.dataset.journey);
    renderJourneyDetail(station.dataset.journey);
    animateJourneyMarker(station);
  };

  station.addEventListener("click", activateStation);
  station.addEventListener("pointerenter", activateStation);
});

const initialJourneyStation = document.querySelector(".journey-station.is-active");
animateJourneyMarker(initialJourneyStation);

// Energy flow animation function (unused for now)
let time = 0;
const animatePotentialField = () => {
  time += 0.005;
  // Animation logic moved to DOMContentLoaded
};

if (heroStage) {
  heroStage.addEventListener("pointermove", (event) => {
    const rect = heroStage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    heroStage.style.setProperty("--portrait-x", `${(x + 0.5) * 100}%`);
    heroStage.style.setProperty("--portrait-y", `${(y + 0.5) * 100}%`);
    heroStage.style.setProperty("--poster-shift", `${x * 14}px`);
    heroStage.style.transform = `perspective(1000px) rotateY(${x * 2.4}deg) rotateX(${-y * 2.4}deg)`;
    personLayer.style.transform = `translate3d(calc(-50% + ${x * 18}px), ${y * 14}px, 32px) scale(1.04)`;
    frontLayer.style.transform = `translate3d(${-x * 28}px, ${-y * 18}px, 150px)`;
  });

  heroStage.addEventListener("pointerleave", () => {
    heroStage.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg)";
    heroStage.style.removeProperty("--poster-shift");
    personLayer.style.transform = "translate3d(-50%, 0, 32px) scale(1.03)";
    frontLayer.style.transform = "translateZ(150px)";
  });
}

window.addEventListener(
  "scroll",
  () => {
    if (!heroStage) return;
    const scrollRatio = Math.min(window.scrollY / window.innerHeight, 1);
    heroStage.style.setProperty("--scroll-shift", `${scrollRatio * 80}px`);
    personLayer.style.filter = `brightness(${1 - scrollRatio * 0.18}) contrast(1.08)`;
    frontLayer.style.opacity = `${1 - scrollRatio * 0.36}`;
  },
  { passive: true }
);


// Initialize skill system after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("=== Loading Skill System ===");
  
  // Bind skill node events
  const skillNodes = document.querySelectorAll(".skill-node");
  console.log("Found", skillNodes.length, "skill nodes");
  
  skillNodes.forEach((node) => {
    const activateSkill = () => {
      skillNodes.forEach((item) => item.classList.remove("is-active"));
      node.classList.add("is-active");
      renderJourneyDetail(node.dataset.skill);
    };

    node.addEventListener("click", activateSkill);
    node.addEventListener("pointerenter", activateSkill);
    console.log("Bound event for:", node.dataset.skill);
  });
  
  // Click center to reset
  const orbitCenter = document.querySelector("#orbit-center");
  orbitCenter?.addEventListener("click", () => {
    skillNodes.forEach((item) => item.classList.remove("is-active"));
  });
  
  console.log("=== Skill System Ready! ===");
});


/* ==================================
   Simple Skill Click Handlers
   ================================== */

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const skillNodes = document.querySelectorAll(".skill-node");
    console.log("Found", skillNodes.length, "skill nodes");
    
    skillNodes.forEach((node) => {
      node.addEventListener("click", () => {
        // Update active state
        skillNodes.forEach((n) => n.classList.remove("is-active"));
        node.classList.add("is-active");
        
        const skillKey = node.dataset.skill;
        const skillData = journeyDetails[skillKey];
        
        if (skillData) {
          console.log("Clicked skill:", skillKey, skillData.title);
          
          // Update detail panel
          const badge = document.querySelector("#skill-detail-badge");
          const title = document.querySelector("#skill-detail-title");
          const subtitle = document.querySelector("#skill-detail-subtitle");
          const power = document.querySelector("#skill-detail-power-value");
          const desc = document.querySelector("#skill-detail-description");
          const tags = document.querySelector("#skill-detail-tags");
          
          if (badge) badge.textContent = skillData.category || "CORE SKILL";
          if (title) title.textContent = skillData.title;
          if (subtitle) subtitle.textContent = skillData.subtitle;
          if (power) power.textContent = skillData.meter;
          if (desc) desc.textContent = skillData.description;
          if (tags) {
            tags.innerHTML = skillData.tags.map((t) => `<span>${t}</span>`).join("");
          }
        }
      });
    });
    
    console.log("Skill system ready!");
  }, 500);
});


/* ==================================
   Update renderJourneyDetail for VISUAL BARS
   ================================== */

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const skillNodes = document.querySelectorAll(".skill-node");
    
    skillNodes.forEach((node) => {
      node.addEventListener("click", () => {
        const skillKey = node.dataset.skill;
        const skillData = journeyDetails[skillKey];
        
        if (skillData) {
          // Update detail panel
          const badge = document.querySelector("#skill-detail-badge");
          const title = document.querySelector("#skill-detail-title");
          const subtitle = document.querySelector("#skill-detail-subtitle");
          const power = document.querySelector("#skill-detail-power-value");
          const desc = document.querySelector("#skill-detail-description");
          const tags = document.querySelector("#skill-detail-tags");
          
          if (badge) badge.textContent = "核心能力";
          if (title) title.textContent = skillData.title;
          if (subtitle) subtitle.textContent = skillData.subtitle;
          
          // Create VISUAL BAR instead of number
          if (power) {
            const percent = parseInt(skillData.meter);
            power.style.width = percent + "%";
            power.style.background = "linear-gradient(90deg, #a855f7, #6366f1)";
            power.style.height = "100%";
            power.style.borderRadius = "4px";
            power.textContent = ""; // Clear the number
          }
          
          if (desc) desc.textContent = skillData.description;
          if (tags) {
            tags.innerHTML = skillData.tags.map((t) => `<span>${t}</span>`).join("");
          }
        }
      });
    });
  }, 600);
});


/* ==================================
   FINAL Skill Render with CLEAN BARS
   ================================== */

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const skillNodes = document.querySelectorAll(".skill-node");
    
    // First, update all journeyDetails to include status labels
    if (window.journeyDetails) {
      journeyDetails.brief.status = "高度成熟";
      journeyDetails.narrative.status = "高度敏感";
      journeyDetails.structure.status = "极强结构化";
      journeyDetails.delivery.status = "高度可靠";
      journeyDetails.empathy.status = "前沿增强型";
    }
    
    skillNodes.forEach((node) => {
      node.addEventListener("click", () => {
        const skillKey = node.dataset.skill;
        const skillData = journeyDetails[skillKey];
        
        if (skillData) {
          const badge = document.querySelector("#skill-detail-badge");
          const title = document.querySelector("#skill-detail-title");
          const powerContainer = document.querySelector(".detail-power");
          const valueBar = document.querySelector("#skill-detail-power-value");
          const desc = document.querySelector("#skill-detail-description");
          const tags = document.querySelector("#skill-detail-tags");
          
          if (badge) badge.textContent = "核心能力";
          if (title) title.textContent = skillData.title;
          
          // Set bar width
          if (valueBar) {
            valueBar.style.width = skillData.meter;
            valueBar.textContent = "";
          }
          
          // Set name and status via data attributes
          if (powerContainer) {
            powerContainer.setAttribute("data-skill-name", skillData.subtitle);
            powerContainer.setAttribute("data-status", skillData.status || "");
          }
          
          if (desc) desc.textContent = skillData.description;
          if (tags) {
            tags.innerHTML = skillData.tags.map((t) => `<span>${t}</span>`).join("");
          }
        }
      });
    });
    
    // Trigger click on first skill to initialize
    if (skillNodes[0]) {
      skillNodes[0].click();
    }
  }, 800);
});

