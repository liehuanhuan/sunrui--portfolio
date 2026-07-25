const params = new URLSearchParams(window.location.search);
const id = params.get("id") || "cetc";
const archiveTitle = params.get("archive");
const projectSlug = params.get("project");
const projectPlaceholder = "./assets/cases/project-placeholder.svg";
const hasDetailParams = Boolean(params.get("id") || archiveTitle || projectSlug);

if (!hasDetailParams) {
  // 案例仓库索引视图：不带参数进入 case.html 时，按时间倒序展示全部项目
  const entries = [...(window.fullProjectIndex || [])];
  const monthOf = (item) => {
    const m = String(item.slug || "").match(/^(\d{4})-(\d{2})/);
    return m ? `${m[1]}.${m[2]}` : item.year || item.month || "";
  };
  const sortKey = (item) => {
    const m = String(item.slug || "").match(/^(\d{4})-(\d{2})/);
    return m ? Number(m[1]) * 100 + Number(m[2]) : 0;
  };
  entries.sort((a, b) => sortKey(b) - sortKey(a));

  document.title = "案例仓库｜孙瑞 Portfolio";
  ["case-hero", "case-thinking", "case-body", "case-gallery"].forEach((cls) => {
    const el = document.querySelector(`.${cls}`);
    if (el) el.style.display = "none";
  });

  const indexSection = document.createElement("section");
  indexSection.className = "case-index";
  indexSection.innerHTML = `
    <div class="case-index-head">
      <p class="superline">CASE ARCHIVE</p>
      <h1>案例仓库</h1>
      <p class="case-index-sub">按时间倒序，共 ${entries.length} 个项目。点击任意卡片查看详情。</p>
      <input class="case-index-search" type="search" placeholder="搜索项目名或年份…" aria-label="搜索案例" />
    </div>
    <div class="case-index-grid"></div>
  `;
  document.querySelector(".case-page").appendChild(indexSection);

  const grid = indexSection.querySelector(".case-index-grid");
  const renderCards = (list) => {
    grid.innerHTML = list
      .map(
        (item) => `
      <a class="case-index-card" href="./case.html?project=${encodeURIComponent(item.slug)}">
        <span class="case-index-thumb"><img src="./assets/project-covers/${item.slug}.png" data-hero="${item.hero || ""}" alt="" loading="lazy" onerror="if(this.dataset.hero){this.src=this.dataset.hero;this.dataset.hero='';}else{this.onerror=null;this.src='./assets/cases/project-placeholder.svg';}" /></span>
        <span class="case-index-meta">${monthOf(item)}${item.group ? ` · ${item.group}` : ""}</span>
        <strong class="case-index-title">${item.title}</strong>
      </a>
    `,
      )
      .join("");
  };
  renderCards(entries);

  indexSection.querySelector(".case-index-search").addEventListener("input", (event) => {
    const q = event.target.value.trim().toLowerCase();
    renderCards(
      !q
        ? entries
        : entries.filter((item) =>
            `${item.title} ${item.slug} ${monthOf(item)}`.toLowerCase().includes(q),
          ),
    );
  });
} else {
const normalizeArchiveTitle = (title) =>
  String(title || "")
    .toLowerCase()
    .replace(/汽车之间/g, "汽车之家")
    .replace(/byd/g, "比亚迪")
    .replace(/workspace/g, "工作空间")
    .replace(/netapp/g, "凌拓")
    .replace(/[\s\-_&+·｜|（）()【】\[\]“”"'：:，,。.!！?？]/g, "");
const manualArchiveCaseDetails = {
  wavesummit: {
    level: "重点",
    group: "科技大会与议题转译",
    scale: "2021-2024 连续项目沉淀",
    year: "2021-2024",
    category: "AI开发者峰会 / 飞桨技术品牌活动",
    keywords: [
      "飞桨开发者峰会",
      "技术大会叙事",
      "开发者互动",
      "预热视频",
      "传播策略",
      "展区机制",
      "可能世界"
    ],
    thinking:
      "我看 Wave Summit，不会只把它当成一场 AI 开发者大会。它真正难的地方，是每一年技术语境都在变，但大会需要形成自己的记忆点。2021 年的「神码」把开发者语言变成解码任务，2022 年的「有解」把平台能力放进中国技术叙事，2024 年的「技术临界点」开始回应大模型时代的速度感和不确定感。这个方案好在它不是把技术词堆满页面，而是持续寻找一个能被传播、能被现场化、能被开发者参与的叙事入口。",
    why:
      "Wave Summit 适合放进作品集，因为它是一条连续的技术大会经验线。2021 年处理「神码」和解码挑战，2022 年把飞桨平台能力放进「有解」主题里，2024 年转向大模型语境下的「技术临界点」与「可能世界」。它考验的不是单次提案的漂亮程度，而是怎么长期面对同一类抽象技术议题，把平台、开发者、现场和传播组织成可以被理解、被参与、被记住的公共表达。",
    role:
      "我的工作集中在主题方向、预热内容、互动机制和方案结构。2021 年围绕「神码」搭建 H5、抽奖、ARG 式线索、任务解码和开发者游戏指南；2022 年处理「人工智能何解」「中国的有解思维」，把行业问题、平台能力和大会预热视频连起来；2024 年围绕「站在技术的临界点」整理主题输出、展区现场、开发者金句、传播卡片和后续纪录片式传播。",
    value:
      "这组资料能说明我处理技术品牌活动的方式：先读懂技术概念背后的行业情绪，再把它翻译成大会主题、互动路径和传播材料。它也能看到我的项目尺度感，既能写主题和视频逻辑，也能往下落到 H5 玩法、现场动线、分享卡片、展区内容和提案结构。"
  },
  rog: {
    title: "ROG BW",
    level: "重点",
    group: "游戏展区与玩家互动",
    scale: "Bilibili World 400㎡ 展区",
    year: "2023 / 2026",
    category: "游戏品牌展区 / 玩家任务系统",
    keywords: [
      "Bilibili World",
      "玩家任务线",
      "赛博宇宙",
      "穿越指南",
      "信仰之眼",
      "本命之地",
      "四步互动闭环"
    ],
    thinking:
      "这个项目做的是 ROG 在 Bilibili World 的线下展区体验。它面对的不是普通展会人群，而是 B 站年轻玩家、DIY 电竞玩家、手游和掌机玩家、UP 主、主播、ROG 粉丝、媒体与 KOL。我的判断是，ROG 不能只把产品摆出来，也不能只做几个热闹的互动点。玩家需要的是身份感、任务感和进入感。所以方案用“赛博宇宙 / 穿越指南 / 信仰之眼 / 本命之地”把展区写成一个游戏现场：用户扫码进入、订立契约、完成任务、收集碎片或印章，在不同产品与互动区域里完成一次属于 ROG 的玩家试炼。",
    why:
      "ROG BW 的核心工作，是把 400㎡ 展区从产品陈列变成玩家行动路径。方案围绕 Bilibili World 的年轻玩家语境，设计了赛博宇宙式的展区故事线、穿越指南、任务清单、扫码注册、契约机制、互动体验和产品分区，把游戏本、掌机、潮酷周边、赛车体验、液氮超频等内容纳入同一套现场叙事。",
    role:
      "我主要处理主题延展、玩家视角、展区故事线和互动机制：把“参观展台”改写成“进入 ROG 世界并完成任务”，让不同展区不再只是分散陈列，而是围绕信仰之力、任务清单、互动挑战和玩家身份组织起来。",
    value:
      "这个案子说明我能读懂游戏品牌和玩家文化。它不是把互动做得更多，而是让互动有理由、有顺序、有身份感：为什么要扫码，为什么要完成任务，为什么要收集，为什么要走到下一个区域。对游戏、潮玩、二次元和硬件品牌来说，这种现场结构比单纯的视觉包装更重要。"
  }
};
const rawArchiveCaseDetails = {
  ...(window.archiveCaseDetails || {}),
  ...manualArchiveCaseDetails
};
const archiveCaseDetails = {};
Object.entries(rawArchiveCaseDetails).forEach(([key, value]) => {
  archiveCaseDetails[key] = value;
  archiveCaseDetails[normalizeArchiveTitle(key)] = value;
  if (value?.title) archiveCaseDetails[normalizeArchiveTitle(value.title)] = value;
});
const archiveCase = archiveTitle
  ? window.projectScreenshotArchive?.find(
      (item) =>
        item.title === archiveTitle ||
        normalizeArchiveTitle(item.title) === normalizeArchiveTitle(archiveTitle)
    )
  : null;
const archiveDetail = archiveTitle
  ? archiveCaseDetails[archiveTitle] || archiveCaseDetails[normalizeArchiveTitle(archiveTitle)]
  : null;
const archiveImages = archiveCase?.shots || [];
const projectCase = projectSlug
  ? window.fullProjectIndex?.find((item) => item.slug === projectSlug)
  : null;
const projectArchiveCase = projectCase
  ? window.projectScreenshotArchive?.find(
      (item) =>
        item.title === projectCase.title ||
        normalizeArchiveTitle(item.title) === normalizeArchiveTitle(projectCase.title)
    )
  : null;
const projectImages = projectCase
  ? [projectCase.hero, ...(projectCase.images || []), ...(projectArchiveCase?.shots || [])].filter(Boolean)
  : [];
const archiveFallbackCase = archiveTitle
  ? {
      id: "",
      level: "档案",
      group: "Screenshot Archive",
      scale: archiveCase ? "桌面项目资料" : "Obsidian 项目材料",
      title: archiveCase?.title || archiveDetail?.title || archiveTitle,
      year: archiveDetail?.year || archiveCase?.month || "项目档案",
      category: archiveDetail?.category || "项目方案截图",
      hero: archiveImages[0] || archiveDetail?.hero || projectPlaceholder,
      images: archiveImages.slice(1),
      keywords: ["方案截图", "项目资料", "项目档案"],
      why: "项目资料来自 Obsidian 与桌面方案文件，保留项目名称、方案截图与已沉淀的项目判断。",
      role: "整理方案封面、结构页、关键视觉页与项目思考，形成可浏览的项目档案。",
      value: "呈现项目数量、类型跨度、方案产出密度与持续积累。"
    }
  : null;
const currentCase = archiveTitle && (archiveCase || archiveDetail)
  ? {
      ...archiveFallbackCase,
      ...archiveDetail,
      hero: archiveDetail?.hero || archiveFallbackCase.hero,
      images: archiveDetail?.images?.length ? archiveDetail.images : archiveFallbackCase.images,
      keywords: archiveDetail?.keywords?.length ? archiveDetail.keywords : archiveFallbackCase.keywords
    }
  : projectCase
    ? {
        id: "",
        level: projectCase.level || "档案",
        group: projectCase.group || "项目索引",
        scale: projectCase.scale || "Obsidian 项目资料",
        title: projectCase.title,
        year: projectCase.year || projectCase.month || "项目档案",
        category: projectCase.category || "项目资料",
        hero: projectImages[0] || projectPlaceholder,
        images: projectImages.slice(1),
        keywords: projectCase.keywords?.length ? projectCase.keywords : ["项目资料", "方案索引", "Obsidian"],
        why: projectCase.why || "这是从 Obsidian 工作系统中整理出的项目资料页。",
        thinking: projectCase.thinking || projectCase.why || "保留项目的 Brief、创意方向、成案内容与可复用线索。",
        role: projectCase.role || "项目资料整理",
        value: projectCase.value || "保留项目资料、方案文件、关键画面与可复用方法。",
        source: projectCase.source
      }
  : window.portfolioCases.find((item) => item.id === id) || window.portfolioCases[0];

document.title = `${currentCase.title}｜孙瑞 Portfolio`;
document.querySelector("#case-level").textContent = `${currentCase.group} / ${currentCase.level}项目`;
document.querySelector("#case-title").textContent = currentCase.title;
document.querySelector("#case-summary").textContent = currentCase.why;
document.querySelector("#case-hero-image").src = currentCase.hero;
document.querySelector("#case-hero-image").alt = currentCase.title;
document.querySelector("#case-year").textContent = currentCase.year;
document.querySelector("#case-category").textContent = `${currentCase.category} · ${currentCase.scale}`;
document.querySelector("#case-thinking").textContent = currentCase.thinking || currentCase.why;
document.querySelector("#case-why").textContent = currentCase.why;
document.querySelector("#case-role").textContent = currentCase.role;
document.querySelector("#case-value").textContent = currentCase.value;

document.querySelector("#case-keywords").innerHTML = currentCase.keywords
  .map((keyword) => `<span>${keyword}</span>`)
  .join("");

const galleryImages = [currentCase.hero, ...(currentCase.images || [])].filter(Boolean);
document.querySelector("#case-gallery").innerHTML = galleryImages
  .map(
    (src, index) => `
      <figure>
        <img src="${src}" alt="${currentCase.title} 项目截图 ${index + 1}" />
      </figure>
    `
  )
  .join("");
}
