const fs = require("fs");
const path = require("path");

const vaultRoot = path.resolve(__dirname, "../..");
const siteRoot = path.resolve(__dirname, "..");
const outputPath = path.join(siteRoot, "project-index.js");

const sourceRoots = [
  { root: path.join(vaultRoot, "01工作系统/项目精华沉淀"), weight: 4 },
  { root: path.join(vaultRoot, "01工作系统/桌面项目索引"), weight: 3 },
  { root: path.join(vaultRoot, "01工作系统/公司项目索引"), weight: 2 },
  { root: path.join(vaultRoot, "01工作系统/Absen资深策划索引"), weight: 1 }
];

const allowedTypes = new Set([
  "work-summary",
  "work-index",
  "company-project-index",
  "absen-senior-planner-project"
]);

function walk(dir, output = []) {
  if (!fs.existsSync(dir)) return output;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const current = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(current, output);
    else if (entry.name.endsWith(".md")) output.push(current);
  }
  return output;
}

function parseFrontmatter(text) {
  if (!text.startsWith("---")) return {};
  const end = text.indexOf("\n---", 3);
  if (end < 0) return {};
  const raw = text.slice(3, end).trim();
  const data = {};
  raw.split("\n").forEach((line) => {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) return;
    const [, key, value] = match;
    data[key] = value.replace(/^["']|["']$/g, "").trim();
  });
  return data;
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

function slugify(title, month, line) {
  return `${month || "0000"}-${normalize(line)}-${normalize(title)}`.replace(/^-+|-+$/g, "");
}

function extractMonth(filePath, meta) {
  if (meta.month) return meta.month;
  if (meta.period) {
    const periodMatch = meta.period.match(/(20\d{2})[^\d]?(0?[1-9]|1[0-2])?/);
    if (periodMatch?.[2]) return `${periodMatch[1]}-${String(periodMatch[2]).padStart(2, "0")}`;
    if (periodMatch?.[1]) return periodMatch[1];
  }
  if (meta.year) return meta.year;
  const fromPath = filePath.match(/(20\d{2})-(\d{2})/);
  if (fromPath) return `${fromPath[1]}-${fromPath[2]}`;
  const yearOnly = filePath.match(/(20\d{2})/);
  if (yearOnly?.[1]) return yearOnly[1];
  if (meta.line === "省广窗外") return "2024";
  if (meta.line === "华视新瑞项目") return "2023";
  return yearOnly?.[1] || "未标注";
}

function section(text, heading) {
  const lines = text.split("\n");
  const start = lines.findIndex((line) => line.trim() === `## ${heading}`);
  if (start < 0) return "";
  const end = lines.findIndex((line, index) => index > start && line.startsWith("## "));
  return lines.slice(start + 1, end < 0 ? undefined : end).join("\n").trim();
}

function cleanLine(line) {
  return line
    .replace(/^[-*>#\s]+/, "")
    .replace(/!\[\[[^\]]+\]\]/g, "")
    .replace(/\[\[([^\]|]+)\|?([^\]]*)\]\]/g, (_, a, b) => b || a)
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function firstTextLine(value) {
  return String(value || "")
    .split("\n")
    .map(cleanLine)
    .find((line) => line && !line.includes("暂未") && !line.includes("暂无")) || "";
}

function parseKeywords(meta, text, title) {
  const source = meta.keywords || text.match(/能力标签[：:]\s*([^\n]+)/)?.[1] || "";
  const cleaned = source.replace(/^\[|\]$/g, "").replace(/"/g, "");
  const words = cleaned
    .split(/[、,，；;\/]/)
    .map((item) => item.trim())
    .filter(Boolean);
  if (words.length) return [...new Set(words)].slice(0, 8);
  if (/车|汽车|小鹏|比亚迪|传祺|岚图|极氪|丰田|奥迪|现代|埃安|雷达|iCAR/i.test(title)) {
    return ["汽车品牌", "产品体验", "活动方案"];
  }
  if (/展|空间|展厅|展区|车展/i.test(title)) return ["展区展厅", "空间动线", "现场体验"];
  if (/大会|峰会|论坛|发布会/i.test(title)) return ["大会策划", "议题结构", "现场传播"];
  return ["项目方案", "策略整理", "执行转化"];
}

function inferGroup(title, keywords) {
  const text = `${title} ${keywords.join(" ")}`;
  if (/公关|传播|舆情|年框|年度|品牌策略|内容规划/i.test(text)) return "公关传播与品牌策略";
  if (/AI|技术|峰会|大会|论坛|飞桨|百度|BOE|H3C|航天|京东工业|钉钉|Intel|浪潮|曙光/i.test(text)) return "科技大会与议题转译";
  if (/展区|展厅|展览|空间|展台|车展|巡展/i.test(text)) return "展陈与空间叙事";
  if (/车|汽车|小鹏|比亚迪|传祺|岚图|极氪|丰田|奥迪|现代|埃安|雷达|iCAR|哈弗/i.test(text)) return "汽车与产品体验";
  if (/平台|抖音|快手|小红书|美团|巨量|电商|嘉年华|购物节/i.test(text)) return "平台活动与公共参与";
  if (/AI|交互|互动|Workspace|MIPC|联想|凌拓|NetApp/i.test(text)) return "科技展台与AI交互";
  return "品牌活动与互动机制";
}

function inferCategory(type, group, line) {
  if (type === "absen-senior-planner-project") return "Absen 资深策划 / 项目资料";
  if (type === "company-project-index") return `${line || "公司项目"} / 项目资料`;
  return group;
}

function extractImages(text) {
  return [...text.matchAll(/!\[\[([^\]]+\.(?:png|jpg|jpeg|webp|svg))\]\]/gi)]
    .map((match) => `../${match[1].split("|")[0]}`)
    .slice(0, 8);
}

function buildSummary(text, title) {
  return (
    firstTextLine(section(text, "项目一句话概览")) ||
    cleanLine(text.match(/一句话沉淀[：:]\s*([^\n]+)/)?.[1] || "") ||
    `${title} 是 Obsidian 工作系统中整理出的项目资料，包含原始文件、方案线索、成案内容与可复用关键词。`
  );
}

function buildThinking(text, summary) {
  return (
    firstTextLine(section(text, "这项目最值得留下的思路")) ||
    firstTextLine(section(text, "创意 / Idea")) ||
    firstTextLine(section(text, "创意 / 思路 / 策略")) ||
    summary
  );
}

function buildRole(text, fallback) {
  return (
    firstTextLine(section(text, "方案 / 成案")) ||
    firstTextLine(section(text, "方案 / 成案 / 总结")) ||
    firstTextLine(section(text, "方案 / 竞标 / 述标")) ||
    fallback
  );
}

const records = [];

sourceRoots.forEach(({ root, weight }) => {
  walk(root).forEach((filePath) => {
    const text = fs.readFileSync(filePath, "utf8");
    const meta = parseFrontmatter(text);
    if (!allowedTypes.has(meta.type)) return;
    const title = meta.project || text.match(/^#\s+(.+)$/m)?.[1] || path.basename(filePath, ".md");
    if (!title || /项目精华|工作索引|总览|经历补充|核心互动技术索引/.test(title)) return;
    if (title === "美的" || title === "小米旅拍" || title === "魔兽争霸III世界选手小聚" || /执行/.test(title)) return; // 美的未执行；小米旅拍/魔兽小聚是执行的活；执行汇报类不上站
    if (/^(参考资料|可追溯资料|品牌\s*VI|散文件|iCAR散文件|日常|日常文档)$/i.test(title)) return;
    if (/资料-|资料_/.test(path.basename(filePath)) && /参考资料|可追溯资料|品牌\s*VI|散文件/.test(title)) return;
    const month = extractMonth(filePath, meta);
    const keywords = parseKeywords(meta, text, title);
    const group = inferGroup(title, keywords);
    const line = meta.line || (meta.type.includes("absen") ? "Absen 资深策划" : "工作室项目");
    const summary = buildSummary(text, title);
    const images = extractImages(text);
    records.push({
      slug: slugify(title, month, line),
      title,
      year: month,
      month,
      group,
      level: meta.type === "work-summary" ? "重点" : "档案",
      scale: line,
      category: inferCategory(meta.type, group, line),
      keywords,
      role: meta.role || line,
      why: summary,
      thinking: buildThinking(text, summary),
      value: buildRole(text, "保留项目资料、方案文件、关键画面与可复用方法。"),
      hero: images[0] || "",
      images: images.slice(1),
      source: path.relative(vaultRoot, filePath),
      sourceType: meta.type,
      weight
    });
  });
});

const byKey = new Map();
records
  .sort((a, b) => b.weight - a.weight || b.images.length - a.images.length)
  .forEach((item) => {
    const key = `${normalize(item.title)}-${item.month}`;
    if (!byKey.has(key)) byKey.set(key, item);
  });

const projects = [...byKey.values()]
  .sort((a, b) => {
    const ay = String(a.month || "");
    const by = String(b.month || "");
    const aRank = /^\d{4}/.test(ay) ? Number(ay.slice(0, 4)) : -1;
    const bRank = /^\d{4}/.test(by) ? Number(by.slice(0, 4)) : -1;
    if (aRank !== bRank) return bRank - aRank;
    return by.localeCompare(ay) || a.title.localeCompare(b.title, "zh-CN");
  })
  .map(({ weight, ...item }) => item);

const output = `// Auto-generated from Obsidian work indexes. Run scripts/generate_project_index.js to refresh.\nwindow.fullProjectIndex = ${JSON.stringify(projects, null, 2)};\n`;
fs.writeFileSync(outputPath, output);
console.log(`Generated ${projects.length} projects -> ${path.relative(vaultRoot, outputPath)}`);
