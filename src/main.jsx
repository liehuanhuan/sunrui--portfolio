import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const featuredProjects = [
  {
    title: "中电展位方案",
    label: "央企科技展陈 / 空间叙事",
    year: "2026",
    image: "/assets/cases/cetc/hero.png",
    text: "把总部级表达、产业成果、裸眼 3D 和动线秩序组织成一个可进入的展厅世界观。",
  },
  {
    title: "iCAR A展运营",
    label: "汽车展区 / 产品体验",
    year: "2026",
    image: "/assets/cases/icar-a/hero.png",
    text: "让年轻汽车品牌在高密度展会里被记住，用体验、打卡和传播路径连接产品性格。",
  },
  {
    title: "威麟汽车发布会",
    label: "发布会 / 试驾体验",
    year: "2026",
    image: "/assets/cases/weylin/hero.png",
    text: "把产品卖点放回具体生活，用路线、试驾科目和停留区完成场景化体验验证。",
  },
  {
    title: "ROG BW",
    label: "游戏展区 / 玩家任务系统",
    year: "2026",
    image: "/assets/cases/rog-bw/hero.png",
    text: "用本命之地、任务清单和互动闭环，把展区写成一个有规则的玩家行动空间。",
  },
  {
    title: "TCL 链博会",
    label: "科技展台 / AI 交互",
    year: "2026",
    image: "/assets/cases/tcl/hero.png",
    text: "把工业 AI、数字人导览、任务系统和数据追踪组织成可理解的产业展台界面。",
  },
  {
    title: "岚图技术品牌年度公关",
    label: "年度公关 / 技术心智",
    year: "2025",
    image: "/assets/cases/voyah-tech/hero.png",
    text: "以年度节奏处理技术心智、车型传播、媒体内容和热点借势，建立持续运营框架。",
  },
  {
    title: "Wave Summit",
    label: "AI 峰会 / 技术叙事",
    year: "2024",
    image: "/assets/cases/wave/hero.png",
    text: "让抽象技术被开发者、行业和公众共同感知，建立技术大会的主题与传播秩序。",
  },
  {
    title: "TROUVER 俄罗斯发布会",
    label: "海外发布 / 技术体验",
    year: "2026",
    image: "/assets/cases/trouver/hero.png",
    text: "面对全新市场和高认知壁垒，用可验证体验路径建立技术产品的首次公共理解。",
  },
];

const caseHref = (slug) => `case.html?project=${encodeURIComponent(slug)}`;

const prPlanningProjects = [
  {
    title: "一汽丰田",
    label: "品牌发布 / 新品发布会",
    year: "2025-12",
    image: "/assets/project-covers/2025-12-工作室项目-一汽丰田.png",
    text: "公关策划",
    href: caseHref("2025-12-工作室项目-一汽丰田"),
  },
  {
    title: "岚图技术品牌年度公关",
    label: "品牌年度 / 整合营销",
    year: "2025-12",
    image: "/assets/project-covers/2025-12-工作室项目-岚图技术品牌年度公关.png",
    text: "公关策划",
    href: caseHref("2025-12-工作室项目-岚图技术品牌年度公关"),
  },
  {
    title: "风云T9深度自驾公益体验之旅",
    label: "消费者体验 / 路演 / 快闪",
    year: "2025-09",
    image: "/assets/project-covers/2025-09-工作室项目-风云t9深度自驾公益体验之旅.png",
    text: "公关策划",
    href: caseHref("2025-09-工作室项目-风云t9深度自驾公益体验之旅"),
  },
  {
    title: "iCAR品牌年度",
    label: "品牌年度 / 整合营销",
    year: "2024-11",
    image: "/assets/project-covers/2024-11-工作室项目-icar品牌年度.png",
    text: "公关策划",
    href: caseHref("2024-11-工作室项目-icar品牌年度"),
  },
  {
    title: "腾讯 OPENDAY",
    label: "公益 / 社会议题项目",
    year: "2024-08",
    image: "/assets/project-covers/2024-08-工作室项目-腾讯openday.png",
    text: "公关策划",
    href: caseHref("2024-08-工作室项目-腾讯openday"),
  },
  {
    title: "网易游戏社会责任促进中心成立",
    label: "文旅 / 城市 / 商业空间企划",
    year: "2022-10",
    image: "/assets/project-covers/2022-10-工作室项目-网易游戏社会责任促进中心成立.png",
    text: "公关策划",
    href: caseHref("2022-10-工作室项目-网易游戏社会责任促进中心成立"),
  },
  {
    title: "极狐露营",
    label: "消费者体验 / 路演 / 快闪",
    year: "2022-07",
    image: "/assets/project-covers/2022-07-工作室项目-极狐露营.png",
    text: "公关策划",
    href: caseHref("2022-07-工作室项目-极狐露营"),
  },
  {
    title: "小米暑促",
    label: "消费者体验 / 路演 / 快闪",
    year: "2022-05",
    image: "/assets/project-covers/2022-05-工作室项目-小米暑促.png",
    text: "公关策划",
    href: caseHref("2022-05-工作室项目-小米暑促"),
  },
  {
    title: "比亚迪粉丝跨界",
    label: "消费者体验 / 路演 / 快闪",
    year: "2022-04",
    image: "/assets/project-covers/2022-04-工作室项目-比亚迪粉丝跨界.png",
    text: "公关策划",
    href: caseHref("2022-04-工作室项目-比亚迪粉丝跨界"),
  },
  {
    title: "哈弗5-6月区域营销",
    label: "消费者体验 / 路演 / 快闪",
    year: "2022-04",
    image: "/assets/project-covers/2022-04-工作室项目-哈弗56月区域营销.png",
    text: "公关策划",
    href: caseHref("2022-04-工作室项目-哈弗56月区域营销"),
  },
  {
    title: "美好目的地",
    label: "文旅 / 城市 / 商业空间企划",
    year: "2022-04",
    image: "/assets/project-covers/2022-04-工作室项目-美好目的地.png",
    text: "公关策划",
    href: caseHref("2022-04-工作室项目-美好目的地"),
  },
  {
    title: "厨房小家电健康趋势发布",
    label: "展览展示 / 展台 / 车展",
    year: "2022-03",
    image: "/assets/project-covers/2022-03-工作室项目-厨房小家电健康趋势发布.png",
    text: "公关策划",
    href: caseHref("2022-03-工作室项目-厨房小家电健康趋势发布"),
  },
  {
    title: "快手营销大事件",
    label: "展览展示 / 展台 / 车展",
    year: "2022-01",
    image: "/assets/project-covers/2022-01-工作室项目-快手营销大事件.png",
    text: "公关策划",
    href: caseHref("2022-01-工作室项目-快手营销大事件"),
  },
];

const projectFolders = [
  {
    id: "pr",
    title: "品牌公关",
    label: "PR Proposals",
    note: "品牌发布、年度传播、公益体验、区域营销与议题项目。",
    image: "/assets/project-folders/pr.png",
    items: prPlanningProjects,
  },
  {
    id: "experience",
    title: "空间与体验",
    label: "Event Experience",
    note: "活动方案、展区展厅、发布会现场与用户体验路径。",
    image: "/assets/project-folders/experience.png",
    items: [featuredProjects[0], featuredProjects[1], featuredProjects[2], featuredProjects[3], featuredProjects[4]],
  },
  {
    id: "ai",
    title: "技术思考",
    label: "AI Practice",
    note: "AI 思考、工具实践、提示词方法与创意工作流实验。",
    image: "/assets/project-folders/ai.png",
    items: [featuredProjects[4], featuredProjects[6], featuredProjects[0], featuredProjects[3]],
  },
  {
    id: "notes",
    title: "创作笔记",
    label: "Creative Notes",
    note: "个人写作、观察、创作草稿与尚未公开的思考入口。",
    image: "/assets/project-folders/notes.png",
    items: [featuredProjects[6], featuredProjects[5], featuredProjects[2]],
  },
];

const folderAnchors = [
  { x: 84, y: 214, r: -3 },
  { x: 392, y: 200, r: 2 },
  { x: 104, y: 522, r: 2 },
  { x: 414, y: 522, r: -2 },
];

const caseSpreads = [
  { x: 520, y: -72, r: -4, z: 18 },
  { x: 850, y: -42, r: 2, z: 17 },
  { x: 1180, y: -66, r: -2, z: 16 },
  { x: 1510, y: -28, r: 3, z: 15 },
  { x: 610, y: 250, r: 2, z: 14 },
  { x: 940, y: 282, r: -3, z: 13 },
  { x: 1270, y: 246, r: 2, z: 12 },
  { x: 1600, y: 278, r: -2, z: 11 },
  { x: 720, y: 590, r: -1, z: 10 },
  { x: 1050, y: 612, r: 3, z: 9 },
  { x: 1380, y: 586, r: -3, z: 8 },
];

const projectTimeValue = (project) => {
  const raw = String(project.year ?? "");
  const match = raw.match(/(\d{4})(?:[-./年](\d{1,2}))?(?:[-./月](\d{1,2}))?/);
  if (!match) return 0;
  const year = Number(match[1]);
  const month = match[2] ? Number(match[2]) : 12;
  const day = match[3] ? Number(match[3]) : 31;
  return new Date(year, month - 1, day).getTime();
};

const sortProjectsByRecent = (items) =>
  [...items].sort((a, b) => projectTimeValue(a) - projectTimeValue(b));

const capabilities = [
  ["洞察力", "在复杂信息里抓住关键变量，判断项目真正要解决的问题。"],
  ["共情力", "理解客户、用户、媒体和现场参与者各自的期待和阻力。"],
  ["分析力", "把散乱材料整理成主题、结构、路径和可推进的方案骨架。"],
  ["执行力", "让创意不是停在 PPT 里，而能被现场、供应商和团队承接。"],
  ["AI协同力", "用 AI 扩展资料整理、视觉探索、文案推演和项目复盘效率。"],
];

const numbers = [
  ["150+", "跨行业项目参与与沉淀"],
  ["2020-2026", "持续工作在发布会、展区、公关传播和品牌活动现场"],
  ["5", "汽车科技、AI 大会、平台生态、展陈空间、年度公关主线"],
  ["1", "语言、视觉、现场和传播的一体化工作方法"],
];

const clientLogos = [
  ["ByteDance", "/assets/client-logos/bytedance.svg"],
  ["抖音", "/assets/client-logos/douyin.svg"],
  ["今日头条", "/assets/client-logos/toutiao.svg"],
  ["巨量引擎", "/assets/client-logos/ocean-engine.svg"],
  ["小红书", "/assets/client-logos/xiaohongshu.svg"],
  ["快手", "/assets/client-logos/kuaishou.svg"],
  ["iQIYI", "/assets/client-logos/iqiyi.svg"],
  ["BOE", "/assets/client-logos/boe.svg"],
  ["TCL", "/assets/client-logos/tcl.svg"],
  ["小米", "/assets/client-logos/xiaomi.svg"],
  ["小鹏", "/assets/client-logos/xpeng.svg"],
  ["蔚来", "/assets/client-logos/nio.svg"],
  ["理想", "/assets/client-logos/li-auto.svg"],
  ["BYD", "/assets/client-logos/byd.svg"],
  ["Lenovo", "/assets/client-logos/lenovo.svg"],
  ["传祺", "/assets/client-logos/gac.svg"],
  ["岚图", "/assets/client-logos/voyah.svg"],
  ["Volkswagen", "/assets/client-logos/volkswagen.svg"],
  ["Mercedes-Benz", "/assets/client-logos/mercedes.svg"],
  ["Audi", "/assets/client-logos/audi.svg"],
  ["Estee Lauder", "/assets/client-logos/estee-lauder.svg"],
  ["More", "/assets/client-logos/more.svg"],
];

const archiveGroups = [
  "汽车与产品体验",
  "科技大会与议题转译",
  "展陈与空间叙事",
  "品牌活动与互动机制",
  "公关传播与品牌策略",
  "平台活动与公共参与",
];

const coverPosters = [
  {
    title: "ROG",
    label: "文件夹封面",
    image: "/assets/archive/2023-4-rog/shot-1.png",
    href: "/case.html?archive=ROG",
    x: 1.25,
    y: 3.74,
    w: 6.6,
    h: 16.47,
    rotate: -4,
  },
  {
    title: "联想NETAPP",
    label: "文件夹封面",
    image: "/assets/archive/2023-4-联想netapp/shot-1.png",
    href: "/case.html?archive=%E8%81%94%E6%83%B3NETAPP",
    x: 9.33,
    y: 0,
    w: 5.23,
    h: 8.98,
    rotate: 2,
  },
  {
    title: "抖音电商生态大会",
    label: "文件夹封面",
    image: "/assets/archive/2023-2-抖音电商生态大会/shot-1.png",
    href: "/case.html?archive=%E6%8A%96%E9%9F%B3%E7%94%B5%E5%95%86%E7%94%9F%E6%80%81%E5%A4%A7%E4%BC%9A",
    x: 15.69,
    y: 0,
    w: 9.21,
    h: 13.8,
    rotate: -2,
  },
  {
    title: "极氪",
    label: "文件夹封面",
    image: "/assets/archive/2023-3-极氪/shot-1.png",
    href: "/case.html?archive=%E6%9E%81%E6%B0%AA",
    x: 28.05,
    y: 0,
    w: 3.45,
    h: 9.41,
    rotate: 3,
  },
  {
    title: "岚图",
    label: "文件夹封面",
    image: "/assets/archive/2023-3-岚图/shot-1.png",
    href: "/case.html?archive=%E5%B2%9A%E5%9B%BE",
    x: 34.17,
    y: 0,
    w: 5.41,
    h: 13.26,
    rotate: -2,
  },
  {
    title: "BYD第二轮",
    label: "文件夹封面",
    image: "/assets/archive/2023-2-byd第二轮/shot-1.png",
    href: "/case.html?archive=BYD%E7%AC%AC%E4%BA%8C%E8%BD%AE",
    x: 40.29,
    y: 9.84,
    w: 6.89,
    h: 13.48,
    rotate: 2,
  },
  {
    title: "小米CJ",
    label: "文件夹封面",
    image: "/assets/archive/2023-6-小米cj/shot-1.png",
    href: "/case.html?archive=%E5%B0%8F%E7%B1%B3CJ",
    x: 48.13,
    y: 0,
    w: 5.59,
    h: 12.62,
    rotate: 2,
  },
  {
    title: "航天信息发布会",
    label: "文件夹封面",
    image: "/assets/archive/2023-6-航天信息发布会/shot-1.png",
    href: "/case.html?archive=%E8%88%AA%E5%A4%A9%E4%BF%A1%E6%81%AF%E5%8F%91%E5%B8%83%E4%BC%9A",
    x: 54.43,
    y: 0,
    w: 6.24,
    h: 13.9,
    rotate: -3,
  },
  {
    title: "京东工业",
    label: "文件夹封面",
    image: "/assets/archive/2023-8-京东工业/shot-1.png",
    href: "/case.html?archive=%E4%BA%AC%E4%B8%9C%E5%B7%A5%E4%B8%9A",
    x: 61.79,
    y: 0,
    w: 6.18,
    h: 9.84,
    rotate: 3,
  },
  {
    title: "美团春归",
    label: "文件夹封面",
    image: "/assets/archive/2023-8-美团春归/shot-1.png",
    href: "/case.html?archive=%E7%BE%8E%E5%9B%A2%E6%98%A5%E5%BD%92",
    x: 68.33,
    y: 0,
    w: 6.6,
    h: 13.05,
    rotate: 4,
  },
  {
    title: "传祺广州车展",
    label: "文件夹封面",
    image: "/assets/archive/2023-9-传祺广州车展/shot-1.png",
    href: "/case.html?archive=%E4%BC%A0%E7%A5%BA%E5%B9%BF%E5%B7%9E%E8%BD%A6%E5%B1%95",
    x: 74.75,
    y: 0,
    w: 7.13,
    h: 11.23,
    rotate: 5,
  },
  {
    title: "中国化学工程集团",
    label: "文件夹封面",
    image: "/assets/archive/2023-9-中国化学工程集团产业链融通发展推进会/shot-1.png",
    href: "/case.html?archive=%E4%B8%AD%E5%9B%BD%E5%8C%96%E5%AD%A6%E5%B7%A5%E7%A8%8B%E9%9B%86%E5%9B%A2%E4%BA%A7%E4%B8%9A%E9%93%BE%E8%9E%8D%E9%80%9A%E5%8F%91%E5%B1%95%E6%8E%A8%E8%BF%9B%E4%BC%9A",
    x: 85.2,
    y: 1.71,
    w: 5.53,
    h: 14.76,
    rotate: -3,
  },
  {
    title: "BOE技术品牌赋能计划",
    label: "文件夹封面",
    image: "/assets/archive/2022-5-boe技术品牌赋能计划发布会/shot-1.png",
    href: "/case.html?archive=BOE%E6%8A%80%E6%9C%AF%E5%93%81%E7%89%8C%E8%B5%8B%E8%83%BD%E8%AE%A1%E5%88%92%E5%8F%91%E5%B8%83%E4%BC%9A",
    x: 91.92,
    y: 0.96,
    w: 5.11,
    h: 14.87,
    rotate: 4,
  },
  {
    title: "小米MIPC",
    label: "文件夹封面",
    image: "/assets/archive/2023-9-小米mipc/shot-1.png",
    href: "/case.html?archive=%E5%B0%8F%E7%B1%B3MIPC",
    x: 8.62,
    y: 19.89,
    w: 7.31,
    h: 8.56,
    rotate: -4,
  },
  {
    title: "巨量星图嘉年华",
    label: "文件夹封面",
    image: "/assets/archive/2022-5-巨量星图嘉年华/shot-1.png",
    href: "/case.html?archive=%E5%B7%A8%E9%87%8F%E6%98%9F%E5%9B%BE%E5%98%89%E5%B9%B4%E5%8D%8E",
    x: 15.63,
    y: 20.32,
    w: 5.88,
    h: 14.12,
    rotate: -5,
  },
  {
    title: "度小满金融聚合支付大会",
    label: "文件夹封面",
    image: "/assets/archive/2022-8-度小满金融聚合支付大会/shot-1.png",
    href: "/case.html?archive=%E5%BA%A6%E5%B0%8F%E6%BB%A1%E9%87%91%E8%9E%8D%E8%81%9A%E5%90%88%E6%94%AF%E4%BB%98%E5%A4%A7%E4%BC%9A",
    x: 23.59,
    y: 24.49,
    w: 7.07,
    h: 16.04,
    rotate: 5,
  },
  {
    title: "传祺",
    label: "文件夹封面",
    image: "/assets/archive/2023-3-传祺/shot-1.png",
    href: "/case.html?archive=%E4%BC%A0%E7%A5%BA",
    x: 31.79,
    y: 13.05,
    w: 7.31,
    h: 12.62,
    rotate: 3,
  },
  {
    title: "北京现代",
    label: "文件夹封面",
    image: "/assets/archive/2023-3-北京现代/shot-1.png",
    href: "/case.html?archive=%E5%8C%97%E4%BA%AC%E7%8E%B0%E4%BB%A3",
    x: 40.05,
    y: 23.32,
    w: 7.31,
    h: 13.9,
    rotate: -2,
  },
  {
    title: "箭牌",
    label: "文件夹封面",
    image: "/assets/archive/2023-4-箭牌/shot-1.png",
    href: "/case.html?archive=%E7%AE%AD%E7%89%8C",
    x: 48.25,
    y: 14.87,
    w: 6.24,
    h: 11.55,
    rotate: 1,
  },
  {
    title: "美的年框",
    label: "文件夹封面",
    image: "/assets/archive/2023-8-美的年框/shot-1.png",
    href: "/case.html?archive=%E7%BE%8E%E7%9A%84%E5%B9%B4%E6%A1%86",
    x: 55.38,
    y: 13.9,
    w: 5.7,
    h: 10.05,
    rotate: -2,
  },
  {
    title: "火山",
    label: "文件夹封面",
    image: "/assets/archive/2023-5-火山/shot-1.png",
    href: "/case.html?archive=%E7%81%AB%E5%B1%B1",
    x: 61.62,
    y: 10.91,
    w: 6.6,
    h: 21.93,
    rotate: 2,
  },
  {
    title: "游戏+论坛",
    label: "文件夹封面",
    image: "/assets/archive/2022-10-第一届-游戏-论坛暨网易游戏社会责任促进中心成立发布会/shot-1.png",
    href: "/case.html?archive=%E7%AC%AC%E4%B8%80%E5%B1%8A%E2%80%9C%E6%B8%B8%E6%88%8F%2B%E2%80%9D%E8%AE%BA%E5%9D%9B%E6%9A%A8%E7%BD%91%E6%98%93%E6%B8%B8%E6%88%8F%E7%A4%BE%E4%BC%9A%E8%B4%A3%E4%BB%BB%E4%BF%83%E8%BF%9B%E4%B8%AD%E5%BF%83%E6%88%90%E7%AB%8B%E5%8F%91%E5%B8%83%E4%BC%9A",
    x: 69.04,
    y: 18.93,
    w: 5.64,
    h: 11.34,
    rotate: -2,
  },
  {
    title: "百度联盟峰会",
    label: "文件夹封面",
    image: "/assets/archive/2022-10-百度联盟峰会/shot-1.png",
    href: "/case.html?archive=%E7%99%BE%E5%BA%A6%E8%81%94%E7%9B%9F%E5%B3%B0%E4%BC%9A",
    x: 76.35,
    y: 15.4,
    w: 5.88,
    h: 13.05,
    rotate: 3,
  },
  {
    title: "现代巡展",
    label: "文件夹封面",
    image: "/assets/archive/2022-10-现代巡展/shot-1.png",
    href: "/case.html?archive=%E7%8E%B0%E4%BB%A3%E5%B7%A1%E5%B1%95",
    x: 82.12,
    y: 31.44,
    w: 6.95,
    h: 11.02,
    rotate: -3,
  },
  {
    title: "55购物节",
    label: "文件夹封面",
    image: "/assets/archive/2022-3-55购物节/shot-1.png",
    href: "/case.html?archive=55%E8%B4%AD%E7%89%A9%E8%8A%82",
    x: 91.03,
    y: 22.35,
    w: 4.75,
    h: 10.59,
    rotate: 2,
  },
];

function HeroCover() {
  const coverRef = useRef(null);
  const [activeNode, setActiveNode] = useState(coverPosters[2]);

  function handlePointerMove(event) {
    const rect = coverRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((event.clientX - rect.left) / rect.width - 0.5).toFixed(3);
    const y = ((event.clientY - rect.top) / rect.height - 0.5).toFixed(3);
    coverRef.current.style.setProperty("--mx", x);
    coverRef.current.style.setProperty("--my", y);
  }

  return (
    <section
      className="hero-cover"
      id="home"
      ref={coverRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setActiveNode(coverPosters[2])}
    >
      <div className="cover-stage">
        <img
          className="cover-image"
          src="/assets/hero/creative-brain-cover.png"
          alt="创意资料墙与人物封面"
        />
        <div className="cover-shade" />
        <div className="poster-wall" aria-label="项目封面墙">
          {coverPosters.map((node, index) => (
            <a
              className={`cover-poster poster-${index + 1} ${activeNode.title === node.title ? "is-active" : ""}`}
              href={node.href}
              key={node.title}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                width: `${node.w}%`,
                height: `${node.h}%`,
                "--r": `${node.rotate}deg`,
              }}
              onFocus={() => setActiveNode(node)}
              onMouseEnter={() => setActiveNode(node)}
            >
              <img src={node.image} alt={`${node.title} 项目封面`} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectFolders() {
  const [openFolder, setOpenFolder] = useState(projectFolders[0].id);
  const [openingFolder, setOpeningFolder] = useState(projectFolders[0].id);
  const [openCycle, setOpenCycle] = useState(0);
  const [dragOffsets, setDragOffsets] = useState({});
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [frontKey, setFrontKey] = useState("folder-pr");
  const [draggingKey, setDraggingKey] = useState(null);
  const dragRef = useRef(null);
  const openTimerRef = useRef(null);
  const activeFolder = projectFolders.find((folder) => folder.id === openFolder) ?? projectFolders[0];
  const activeFolderIndex = Math.max(
    0,
    projectFolders.findIndex((folder) => folder.id === activeFolder.id),
  );
  const activeAnchor = folderAnchors[activeFolderIndex] ?? folderAnchors[0];
  const activeOffset = dragOffsets[`folder-${activeFolder.id}`] ?? { x: 0, y: 0 };
  const activeX = activeAnchor.x + activeOffset.x;
  const activeY = activeAnchor.y + activeOffset.y;
  const activeProjects = sortProjectsByRecent(activeFolder.items);

  const openCaseFolder = (folderId, key) => {
    setOpenFolder(folderId);
    setOpeningFolder(folderId);
    setOpenCycle((cycle) => cycle + 1);
    setFrontKey(key);
    if (openTimerRef.current) {
      window.clearTimeout(openTimerRef.current);
    }
    openTimerRef.current = window.setTimeout(() => setOpeningFolder(null), 520);
    setDragOffsets((current) =>
      Object.fromEntries(Object.entries(current).filter(([entryKey]) => entryKey.startsWith("folder-"))),
    );
  };

  const updateDrag = (event) => {
    if (!dragRef.current) return;
    event.preventDefault?.();
    const drag = dragRef.current;
    const nextX = drag.baseX + event.clientX - drag.startX;
    const nextY = drag.baseY + event.clientY - drag.startY;
    drag.moved = drag.moved || Math.abs(event.clientX - drag.startX) + Math.abs(event.clientY - drag.startY) > 8;
    if (drag.type === "canvas") {
      setCanvasOffset({ x: nextX, y: nextY });
      return;
    }
    setDragOffsets((current) => ({
      ...current,
      [drag.key]: { x: nextX, y: nextY },
    }));
  };

  const endDrag = (event) => {
    if (!dragRef.current) return;
    event?.preventDefault?.();
    const { key, type, moved, target, pointerId } = dragRef.current;
    dragRef.current = null;
    setDraggingKey(null);
    removeWindowDragListeners();
    try {
      if (target?.hasPointerCapture?.(pointerId)) {
        target.releasePointerCapture(pointerId);
      }
    } catch {
      // Pointer capture may already be released when the pointer leaves the element.
    }
    if (type === "folder" && !moved) {
      const nextFolder = key.replace("folder-", "");
      openCaseFolder(nextFolder, key);
      return;
    }
    if (type === "canvas") return;
    setDragOffsets((current) => {
      const offset = current[key] ?? { x: 0, y: 0 };
      return {
        ...current,
        [key]: {
          x: offset.x,
          y: offset.y + (type === "file" ? 12 : 0),
        },
      };
    });
  };

  const removeWindowDragListeners = () => {
    window.removeEventListener("pointermove", updateDrag);
    window.removeEventListener("pointerup", endDrag);
    window.removeEventListener("pointercancel", endDrag);
    window.removeEventListener("blur", endDrag);
  };

  const beginDrag = (event, key, type = "file") => {
    event.stopPropagation();
    event.preventDefault();
    removeWindowDragListeners();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    const current = type === "canvas" ? canvasOffset : dragOffsets[key] ?? { x: 0, y: 0 };
    if (type !== "canvas") {
      setFrontKey(key);
    }
    setDraggingKey(key);
    dragRef.current = {
      key,
      type,
      target: event.currentTarget,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      baseX: current.x,
      baseY: current.y,
      moved: false,
    };
    window.addEventListener("pointermove", updateDrag, { passive: false });
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    window.addEventListener("blur", endDrag);
  };

  return (
    <section className="work page-pad" id="work">
      <div className="section-title work-title">
        <h2>案例库</h2>
        <p>
          <span className="click-hint">
            <span className="click-cursor" aria-hidden="true" />
            点开文件夹，拖动画布和案例
          </span>
        </p>
      </div>

      <div
        className="case-canvas"
        aria-label="可拖动案例库画布"
        onPointerDown={(event) => beginDrag(event, "canvas", "canvas")}
        onPointerMove={updateDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div
          className={`case-canvas-world ${draggingKey === "canvas" ? "is-dragging" : ""}`}
          style={{
            transform: `translate3d(${canvasOffset.x}px, ${canvasOffset.y}px, 0)`,
          }}
        >
          <div className="canvas-caption">
            <span>CASE LIBRARY</span>
            <h3>{activeFolder.title}</h3>
            <p>{activeFolder.note}</p>
          </div>

          {projectFolders.map((folder) => (
            <button
              className={`work-folder ${folder.id === openFolder ? "is-open" : ""} ${folder.id === openingFolder ? "is-opening" : ""} ${draggingKey === `folder-${folder.id}` ? "is-dragging" : ""}`}
              key={folder.id}
              type="button"
              onPointerDown={(event) => beginDrag(event, `folder-${folder.id}`, "folder")}
              onPointerMove={updateDrag}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              style={{
                zIndex: frontKey === `folder-${folder.id}` ? 30 : folder.id === openFolder ? 24 : 12,
                transform: `translate3d(${folderAnchors[projectFolders.indexOf(folder)].x + (dragOffsets[`folder-${folder.id}`]?.x ?? 0)}px, ${folderAnchors[projectFolders.indexOf(folder)].y + (dragOffsets[`folder-${folder.id}`]?.y ?? 0)}px, 0) rotate(${folderAnchors[projectFolders.indexOf(folder)].r + ((dragOffsets[`folder-${folder.id}`]?.x ?? 0) * 0.01)}deg)`,
              }}
            >
              <img className="folder-art" src={folder.image} alt="" aria-hidden="true" />
              <span className="folder-body">
                <small>{folder.label}</small>
                <strong>{folder.title}</strong>
                <em>{folder.items.length} files</em>
              </span>
            </button>
          ))}

          {activeProjects.map((project, index) => {
            const layout = caseSpreads[index % caseSpreads.length];
            const key = `${activeFolder.id}-${project.title}`;
            const offset = dragOffsets[key] ?? { x: 0, y: 0 };
            return (
              <article
                className={`project-file ${draggingKey === key ? "is-dragging" : ""}`}
                key={`${key}-${openCycle}`}
                onPointerDown={(event) => beginDrag(event, key, "file")}
                onPointerMove={updateDrag}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                style={{
                  "--i": index,
                  zIndex: frontKey === key ? 40 : layout.z + 14,
                  transform: `translate3d(${activeX + layout.x + offset.x}px, ${activeY + layout.y + offset.y}px, 0) rotate(${layout.r + offset.x * 0.018}deg)`,
                }}
              >
                <div className="project-file-paper">
                  <img src={project.image} alt={`${project.title} 项目封面`} draggable="false" />
                  <div>
                    <small>
                      {project.year} / {project.label}
                    </small>
                    <h3>{project.title}</h3>
                    <p>{project.text}</p>
                    <a href={project.href ?? "case.html"} onPointerDown={(event) => event.stopPropagation()}>
                      查看详情
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function App() {
  return (
    <main className="site">
      <nav className="nav" aria-label="主导航">
        <a className="nav-brand" href="#home">
          孙瑞
        </a>
        <div className="nav-menu">
          <a href="#profile">经历</a>
          <a href="#work">案例</a>
          <a href="#method">能力</a>
          <a href="/case.html">案例库</a>
        </div>
        <a className="nav-action" href="#contact">
          联系
        </a>
      </nav>

      <HeroCover />

      <section className="intro page-pad" id="profile">
        <div className="profile-sheet">
          <aside className="profile-rail">BRAND STRATEGIST / CREATIVE / EXPERIENCE DESIGNER</aside>
          <div className="profile-main">
            <span className="profile-index">01 / ABOUT</span>
            <h2>
              <span className="profile-title-prefix">我是一名</span>
              <span className="profile-title-line">以策略导向作为核心工作方向的</span>
              <span className="profile-title-role">创意工作室主理人</span>
            </h2>
            <p className="profile-lead">
              长期工作在品牌活动、发布会、展区展厅、公关传播与整合营销的第一线。我擅长把商业目标、产品信息、品牌语境、预算条件和现场限制，组织成一套可以被客户理解、被团队推进、被现场承接的美学系统。
            </p>
            <div className="profile-columns">
              <article>
                <h3>
                  <span>01 经验沉淀</span>
                  从 4A 到上市公司
                </h3>
                <p>
                  十五年的工作积累让我能够快速抓住客户的核心特点，并从战略层级推动活动进入更深的执行转化。2022 年起，我开设创意工作室，持续参与 300+ 个跨行业公关与活动项目。
                </p>
              </article>
              <article>
                <h3>
                  <span>02 创意能力</span>
                  用创意与表达打通品牌与公众
                </h3>
                <p>
                  我也享受这个过程：通过策略判断、创意表达、视觉气质、现场秩序和传播出口的融合，帮助品牌完成更准确的推广、公关传播与公众沟通。
                </p>
              </article>
              <article>
                <h3>
                  <span>03 项目能力</span>
                  复杂需求中的判断力与执行力
                </h3>
                <p>
                  不同规模和行业的项目训练了我的判断力：在复杂需求中识别关键问题，在多方协作中建立清晰路径，并把策略、创意与执行结果稳定连接起来。
                </p>
              </article>
            </div>
            <div className="profile-skill-grid">
              {[
                ["01", "品牌策略", "STRATEGY"],
                ["02", "体验设计", "EXPERIENCE"],
                ["03", "创意执行", "CREATIVE"],
                ["04", "内容叙事", "CONTENT"],
                ["05", "整合营销", "IMC"],
                ["06", "现场营造", "SPATIAL"],
                ["07", "AI 工作流", "AI WORKFLOW"],
                ["08", "知识沉淀", "KNOWLEDGE"],
              ].map(([num, cn, en]) => (
                <span key={num}>
                  <small>{num}</small>
                  <strong>{cn}</strong>
                  <em>{en}</em>
                </span>
              ))}
            </div>
          </div>
          <aside className="profile-side">
            <div className="profile-stat">
              <strong>15</strong>
              <span>YEARS</span>
              <p>品牌活动与传播领域经验</p>
            </div>
            <div className="profile-stat">
              <strong>300+</strong>
              <span>PROJECTS</span>
              <p>行业顶级项目参与</p>
            </div>
            <div className="profile-stat">
              <strong>100+</strong>
              <span>CLIENTS</span>
              <p>世界级公司服务</p>
            </div>
            <div className="profile-stat">
              <strong>2022</strong>
              <span>STUDIO FOUNDED</span>
              <p>创意工作室成立</p>
            </div>
            <div className="profile-stat">
              <strong>BEIJING</strong>
              <span>BASE</span>
              <p>工作与生活在北京</p>
            </div>
            <div className="profile-clients">
              <h3>CLIENTS</h3>
              <img className="client-wall" src="/assets/client-logos/client-wall.png" alt="客户品牌 logo 墙" />
            </div>
          </aside>
        </div>
      </section>

      <ProjectFolders />

      <section className="archive page-pad">
        <div className="archive-copy">
          <h2>旧的交互案例集不是废掉，它应该成为这个网站的深层资料库。</h2>
          <p>
            它承载的是项目数量、行业跨度和可检索性。新的首页负责建立专业第一印象，案例库负责把证据摊开。
          </p>
          <a className="button primary" href="/case.html">
            进入案例库
          </a>
        </div>
        <div className="archive-map">
          {archiveGroups.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section className="method page-pad" id="method">
        <div className="method-media">
          <video src="/assets/lenin-character.mp4" autoPlay muted loop playsInline />
        </div>
        <div className="method-content">
          <h2>优势不是“会想创意”，而是能让项目成立。</h2>
          <div className="capability-list">
            {capabilities.map(([title, text]) => (
              <article className="capability" key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="visual page-pad">
        <div className="visual-copy">
          <h2>视觉习惯也会进入工作。</h2>
          <p>
            城市、空间、光线和现场秩序的观察，会影响我如何处理一个品牌项目的气质、节奏和可感知性。
          </p>
        </div>
        <div className="photo-grid">
          <img src="/assets/life/sea-birds.jpg" alt="海面与天空" />
          <img src="/assets/life/city-dusk.jpg" alt="城市黄昏" />
          <img src="/assets/life/sagrada-city.jpg" alt="城市建筑远景" />
          <img src="/assets/life/soft-cloud.jpg" alt="云层与天光" />
        </div>
      </section>

      <section className="contact page-pad" id="contact">
        <h2>如果一个项目需要被重新组织、讲清楚并落到现场，我们可以聊。</h2>
        <p>适合品牌发布、年度传播、科技大会、展区体验、竞标提案与创意策略类项目。</p>
        <div className="hero-actions">
          <a className="button primary" href="mailto:664555295@qq.com">
            发邮件
          </a>
          <a className="button ghost" href="/case.html">
            看案例库
          </a>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
