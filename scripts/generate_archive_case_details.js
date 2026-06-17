const fs = require("fs");
const path = require("path");

const vaultRoot = path.resolve(__dirname, "../..");
const siteRoot = path.resolve(__dirname, "..");
const archivePath = path.join(siteRoot, "archive-shots.js");
const outputPath = path.join(siteRoot, "archive-case-details.js");
const sourceRoots = [
  path.join(vaultRoot, "01工作系统/项目精华沉淀"),
  path.join(vaultRoot, "01工作系统/桌面项目索引")
];

const aliases = new Map(
  Object.entries({
    "厨房小家电健康趋势发布会": "厨房小家电健康趋势发布",
    "H3C workspace 2.0": "h3c",
    "潜江旅游": "潜江旅游IP企划",
    "第一届“游戏+”论坛暨网易游戏社会责任促进中心成立发布会": "网易游戏社会责任促进中心成立",
    "大悦城15周年": "中粮控股大悦城15周年庆典",
    "卫龙辣条": "卫龙辣条第一轮",
    "易点云": "易点云年会",
    "北京现代": "北京现代国际展",
    "传祺": "广汽传祺车展方案",
    "联想NETAPP": "联想凌拓",
    "航天信息发布会": "航天信息新品发布会",
    "传祺东莞车站": "传祺执行",
    "小米MIPC": "小米互联网合作伙伴大会",
    "汽车之间成都车展": "汽车之家车展",
    "字节跳动中秋装修": "2022字节中秋节装修",
    "度小满金融聚合支付大会": "度小满聚合支付发布会",
    "李宁成都开业": "李宁成都太古里开业",
    "byd第一轮": "比亚迪BC第一轮",
    "BYD第二轮": "BYD第二轮",
    "传祺北京车展": "广汽传祺车展方案"
  })
);

function walk(dir, output = []) {
  if (!fs.existsSync(dir)) return output;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const current = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(current, output);
    else if (entry.name.endsWith(".md")) output.push(current);
  }
  return output;
}

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/汽车之间/g, "汽车之家")
    .replace(/byd/g, "比亚迪")
    .replace(/workspace/g, "工作空间")
    .replace(/netapp/g, "凌拓")
    .replace(/[\s\-_&+·｜|（）()【】\[\]“”"'：:，,。.!！?？]/g, "");
}

function getTitles() {
  const source = fs.readFileSync(archivePath, "utf8");
  return [...source.matchAll(/"title":\s*"([^"]+)"/g)].map((match) => match[1]);
}

function readNotes() {
  return sourceRoots
    .flatMap((root) => walk(root))
    .map((filePath) => {
      const text = fs.readFileSync(filePath, "utf8");
      const project = text.match(/^project:\s*(.+)$/m)?.[1]?.trim() || "";
      return {
        filePath,
        text,
        basename: path.basename(filePath, ".md"),
        normalizedName: normalize(path.basename(filePath, ".md")),
        normalizedProject: normalize(project)
      };
    });
}

function scoreNote(title, note) {
  const query = normalize(aliases.get(title) || title);
  let score = 0;
  if (note.normalizedName === query) score += 120;
  if (note.normalizedProject === query) score += 140;
  if (note.normalizedName.includes(query) || query.includes(note.normalizedName)) score += 70;
  if (note.normalizedProject.includes(query) || query.includes(note.normalizedProject)) score += 70;
  for (const part of query.match(/[\u4e00-\u9fa5a-z0-9]{2,}/g) || []) {
    if (note.normalizedName.includes(part)) score += Math.min(part.length, 12);
    if (note.normalizedProject.includes(part)) score += Math.min(part.length, 12);
  }
  return score;
}

function findBestNote(title, notes) {
  const best = notes
    .map((note) => ({ note, score: scoreNote(title, note) }))
    .sort((a, b) => b.score - a.score)[0];
  return best && best.score >= 55 ? best : null;
}

function section(text, heading) {
  const lines = text.split("\n");
  const start = lines.findIndex((line) => line.trim() === `## ${heading}`);
  if (start < 0) return "";
  const end = lines.findIndex((line, index) => index > start && line.startsWith("## "));
  return lines.slice(start + 1, end < 0 ? undefined : end).join("\n");
}

function subsection(text, heading) {
  const lines = text.split("\n");
  const start = lines.findIndex((line) => line.trim() === `### ${heading}`);
  if (start < 0) return "";
  const end = lines.findIndex((line, index) => index > start && (line.startsWith("### ") || line.startsWith("## ")));
  return lines.slice(start + 1, end < 0 ? undefined : end).join("\n");
}

function cleanLine(line) {
  return line
    .replace(/^[-*>#\s]+/, "")
    .replace(/!\[\[[^\]]+\]\]/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^(关键创意点|技术手段|搜索词|需求关键词|来源链)[:：]?$/, "")
    .replace(/来源链：.*$/, "")
    .replace(/生成说明：.*$/, "")
    .replace(/^[、，,；;：:\s]+/, "")
    .trim();
}

function linesFrom(text, limit = 6) {
  const blocked = /^(暂无|来源链|原始资料|搜索词|成案：|思路：|Brief 来源|创意来源|其他参考|下次检索|生成说明|保留理由|PDF 文本暂时|先搜项目名|所属链路|包装方式|用户路径|可复用价值|需求来源链)/;
  const seen = new Set();
  const result = [];
  for (const raw of text.split("\n")) {
    const line = cleanLine(raw);
    if (!line || blocked.test(line) || line.length < 2) continue;
    if (/^【[^】]+】$/.test(line)) continue;
    if (/^\d{2}\s/.test(line)) continue;
    if (/^PART\s/i.test(line)) continue;
    if (/^https?:\/\//i.test(line) || /^www\./i.test(line)) continue;
    if (/\.(docx|pptx|xlsx|pdf)$/i.test(line)) continue;
    if (/鼎琪展业|暂未精准识别|文件名里带上/.test(line)) continue;
    if (/^们/.test(line)) continue;
    if (/^(时间建议|项目主题|项目目标|项目预算|项目时间\/地点|硬性要求|客户真实用意|需求关键词)$/.test(line)) continue;
    if (/^(发布|主题输出|核心导入)$/.test(line)) continue;
    if (/客户需要方案把零散要求|客户真实关注点通常|自动识别|适合后续回看和复用|自动从 Brief|建议后续对重点项目/.test(line)) continue;
    if (seen.has(line)) continue;
    seen.add(line);
    result.push(line);
    if (result.length >= limit) break;
  }
  return result;
}

function uniqueItems(items, limit = 6) {
  const seen = new Set();
  const result = [];
  for (const item of items) {
    const normalized = item.replace(/\s+/g, "");
    if (!item || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(item);
    if (result.length >= limit) break;
  }
  return result;
}

function sentence(items, fallback, limit = 6) {
  const list = uniqueItems(items, limit);
  return list.length ? list.join("；") : fallback;
}

function monthFrom(note) {
  return note.text.match(/^month:\s*(.+)$/m)?.[1]?.trim() || "";
}

function projectFrom(note, title) {
  return note.text.match(/^project:\s*(.+)$/m)?.[1]?.trim() || aliases.get(title) || title;
}

function keywordsFrom(note) {
  const raw = note.text.match(/^keywords:\s*(.+)$/m)?.[1] || "";
  const matches = [...raw.matchAll(/"([^"]+)"/g)].map((match) => match[1]);
  return matches.slice(0, 7);
}

function buildDetail(title, match) {
  if (!match) {
    return {
      title,
      level: "待补",
      group: "资料待校准",
      scale: "需要回到硬盘核对原始方案",
      year: "",
      category: "项目档案 / 待补资料",
      keywords: ["待补Brief", "待补概念", "待补成案体验"],
      thinking: `这条档案目前只找到了截图，还没有在 Obsidian 中稳定匹配到项目沉淀页。下一步需要回到原始方案文件，补齐项目 Brief、核心概念、方案考虑和成案体验。`,
      why: `项目名称：${title}。当前资料状态：缺少可确认 Brief，暂不强行编写项目介绍。`,
      role: "概念待补：需要从原始方案或 Obsidian 对应笔记中确认主题表达。",
      value: "考虑因素待补：需要确认客户诉求、人群、场景、传播路径和执行条件。",
      source: ""
    };
  }

  const { note } = match;
  const projectName = projectFrom(note, title);
  const month = monthFrom(note);
  const brief = linesFrom(section(note.text, "Brief 背景"), 5);
  const bestThoughts = linesFrom(section(note.text, "这项目最值得留下的思路"), 5);
  const finalContent = linesFrom(section(note.text, "这项目最后的成案内容"), 7);
  const manualConcept = linesFrom(section(note.text, "人工确认核心概念"), 4);
  const demand = linesFrom(section(note.text, "客户强需求分析"), 5);
  const hardNeeds = linesFrom(subsection(section(note.text, "客户强需求分析"), "硬性要求"), 4);
  const realNeed = linesFrom(subsection(section(note.text, "客户强需求分析"), "客户真实用意"), 3);
  const structure = linesFrom(section(note.text, "成案结构梳理"), 8);
  const interaction = linesFrom(section(note.text, "核心互动技术链"), 5);
  const excerpts = linesFrom(section(note.text, "关键摘录（成案）"), 4);
  const keywords = keywordsFrom(note);

  const projectClues = [...finalContent, ...bestThoughts, ...keywords].slice(0, 8);
  const briefText = brief.length
    ? `${projectName} 的 Brief 重点是：${sentence(brief, "", 5)}。`
    : `${projectName} 的项目资料里，能看到的工作重点是：${sentence(projectClues, "围绕品牌主题、现场内容和传播动作展开", 5)}。`;
  const conceptItems = manualConcept.length ? manualConcept : finalContent.length ? finalContent : bestThoughts;
  const conceptText = conceptItems.length
    ? `我们给出的概念集中在：${sentence(conceptItems, "", 6)}。`
    : `概念方向围绕 ${sentence(keywords, "项目主题与现场体验", 4)} 展开。`;
  const factors = [...hardNeeds, ...realNeed, ...demand].slice(0, 6);
  const factorText = factors.length
    ? `方案考虑了这些因素：${sentence(factors, "", 5)}。`
    : `方案考虑了项目目标、人群进入、传播路径、现场体验和执行落地之间的关系。`;
  const experienceItems = [...structure, ...interaction, ...excerpts].slice(0, 8);
  const experienceText = experienceItems.length
    ? `成案最后落到：${sentence(experienceItems, "", 7)}。`
    : `成案体验主要围绕 ${sentence(projectClues, "视觉表达、内容组织和现场参与", 5)} 展开。`;

  return {
    title: projectName,
    level: "档案",
    group: "项目方案档案",
    scale: month ? `${month} 项目沉淀` : "项目沉淀",
    year: month,
    category: "方案截图 / 项目思考",
    keywords: keywords.length ? keywords : ["项目Brief", "核心概念", "成案体验"],
    thinking: experienceText,
    why: briefText,
    role: conceptText,
    value: factorText,
    source: path.relative(vaultRoot, note.filePath)
  };
}

const notes = readNotes();
const details = {};
for (const title of getTitles()) {
  const match = findBestNote(title, notes);
  details[normalize(title)] = buildDetail(title, match);
}

const output = `// Auto-generated from Obsidian project notes. Run scripts/generate_archive_case_details.js to refresh.\nwindow.archiveCaseDetails = ${JSON.stringify(details, null, 2)};\n`;
fs.writeFileSync(outputPath, output);
console.log(`generated ${Object.keys(details).length} archive details -> ${path.relative(vaultRoot, outputPath)}`);
