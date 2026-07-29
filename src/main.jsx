import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { projectFolders, sortProjectsByRecent } from "./folder-data.js";

const folderAnchors = [
  { x: 84, y: 214, r: -3 },
  { x: 392, y: 200, r: 2 },
  { x: 104, y: 522, r: 2 },
  { x: 414, y: 522, r: -2 },
];

const numbers = [
  ["150+", "跨行业项目参与与沉淀"],
  ["2020-2026", "持续工作在发布会、展区、公关传播和品牌活动现场"],
  ["5", "汽车科技、AI 大会、平台生态、展陈空间、年度公关主线"],
  ["1", "语言、视觉、现场和传播的一体化工作方法"],
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

const personPoses = [
  "/assets/hero/creative-brain-cover.png",
  "/assets/hero/pose-1.jpg",
  "/assets/hero/pose-2.jpg",
  "/assets/hero/pose-3.jpg",
  "/assets/hero/creative-brain-cover.png",
];

const contactInfo = {
  email: "664555295@qq.com",
  wechat: "springaway",
  phone: "18911679852",
};

const clientLogos = [
  { name: "字节跳动", src: "/assets/client-logos/bytedance.svg", mark: true },
  { name: "抖音", src: "/assets/client-logos/tiktok.svg", mark: true },
  { name: "腾讯", src: "/assets/client-logos/tencentqq.svg", mark: true },
  { name: "百度", src: "/assets/client-logos/baidu.svg", mark: true },
  { name: "快手", src: "/assets/client-logos/kuaishou.svg", mark: true },
  { name: "小红书", src: "/assets/client-logos/xiaohongshu.svg", mark: true },
  { name: "小米", src: "/assets/client-logos/xiaomi.svg", mark: true },
  { name: "华为", src: "/assets/client-logos/huawei.svg", mark: true },
  { name: "一汽丰田", src: "/assets/client-logos/toyota.svg", mark: true },
  { name: "奥迪", src: "/assets/client-logos/audi.svg", mark: true },
  { name: "大众", src: "/assets/client-logos/volkswagen.svg", mark: true },
  { name: "现代", src: "/assets/client-logos/hyundai.svg", mark: true },
  { name: "李宁", src: "/assets/client-logos/lining.svg", mark: true },
  { name: "京东", src: "/assets/client-logos/jd-wordmark.svg" },
  { name: "美团", src: "/assets/client-logos/meituan.svg" },
  { name: "爱奇艺", src: "/assets/client-logos/iqiyi-wordmark.svg" },
  { name: "网易", src: "/assets/client-logos/netease-wordmark.svg" },
  { name: "巨量引擎", src: "/assets/client-logos/ocean-engine-wordmark.svg" },
  { name: "联想", src: "/assets/client-logos/lenovo.svg" },
  { name: "比亚迪", src: "/assets/client-logos/byd-wordmark.svg" },
  { name: "小鹏汽车", src: "/assets/client-logos/xpeng-wordmark.svg" },
  { name: "TCL", src: "/assets/client-logos/tcl.svg" },
  { name: "京东方 BOE", src: "/assets/client-logos/boe-wordmark.svg" },
  { name: "杜卡迪", src: "/assets/client-logos/ducati.svg" },
];

const cameraKeys = [
  { p: 0, s: 1, fx: 50, fy: 50, r: 0 },
  { p: 0.1, s: 1, fx: 50, fy: 50, r: 0 },
  { p: 0.24, s: 1.4, fx: 50, fy: 52, r: -0.8 },
  { p: 0.36, s: 1.4, fx: 50, fy: 50, r: -0.4 },
  { p: 0.5, s: 1.55, fx: 50, fy: 42, r: 0.8 },
  { p: 0.6, s: 1.55, fx: 50, fy: 44, r: 0.4 },
  { p: 0.72, s: 1.35, fx: 50, fy: 55, r: -0.6 },
  { p: 0.82, s: 1.35, fx: 50, fy: 55, r: -0.3 },
  { p: 0.92, s: 1.15, fx: 50, fy: 55, r: 0 },
  { p: 1, s: 1.05, fx: 50, fy: 52, r: 0 },
];

const smooth = (t) => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;

function sampleCamera(progress) {
  let a = cameraKeys[0];
  let b = cameraKeys[cameraKeys.length - 1];
  for (let i = 0; i < cameraKeys.length - 1; i += 1) {
    if (progress >= cameraKeys[i].p && progress <= cameraKeys[i + 1].p) {
      a = cameraKeys[i];
      b = cameraKeys[i + 1];
      break;
    }
  }
  const t = smooth(Math.min(1, Math.max(0, (progress - a.p) / (b.p - a.p || 1))));
  return { s: lerp(a.s, b.s, t), fx: lerp(a.fx, b.fx, t), fy: lerp(a.fy, b.fy, t), r: lerp(a.r, b.r, t) };
}

// 把焦点 (fx,fy) 尽量拉向画面中心，同时钳制位移保证放大后的墙始终铺满屏幕
function cameraTranslate(f, s) {
  const desired = 50 - f;
  const hi = f * (s - 1);
  const lo = -(100 - f) * (s - 1);
  return Math.max(lo, Math.min(hi, desired));
}

function fadeRange(p, fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd) {
  if (p <= fadeInStart || p >= fadeOutEnd) return 0;
  if (p < fadeInEnd) return smooth((p - fadeInStart) / (fadeInEnd - fadeInStart));
  if (p > fadeOutStart) return 1 - smooth((p - fadeOutStart) / (fadeOutEnd - fadeOutStart));
  return 1;
}

function ScrollJourney() {
  const journeyRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = journeyRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      setProgress(total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const cam = sampleCamera(progress);
  const titleO = fadeRange(progress, -1, 0, 0.05, 0.11);
  const hintO = fadeRange(progress, -1, 0, 0.03, 0.08);
  const beat1O = fadeRange(progress, 0.14, 0.2, 0.3, 0.36);
  const beat2O = fadeRange(progress, 0.4, 0.46, 0.54, 0.6);
  const beat3O = fadeRange(progress, 0.62, 0.68, 0.76, 0.82);
  const beat4O = fadeRange(progress, 0.84, 0.9, 0.92, 0.96);
  const closingO = fadeRange(progress, 0.955, 0.99, 2, 3);
  const poseOs = [
    fadeRange(progress, -1, 0, 0.06, 0.12),
    fadeRange(progress, 0.06, 0.12, 0.42, 0.48),
    fadeRange(progress, 0.42, 0.48, 0.62, 0.68),
    fadeRange(progress, 0.62, 0.68, 0.84, 0.9),
    fadeRange(progress, 0.84, 0.9, 2, 3),
  ];

  return (
    <section className="journey" id="home" ref={journeyRef} aria-label="创意资料墙滚动叙事">
      <div className="journey-stage">
        <div
          className="cover-stage journey-zoom"
          style={{
            transform: `translate3d(${cameraTranslate(cam.fx, cam.s).toFixed(3)}%, ${cameraTranslate(cam.fy, cam.s).toFixed(3)}%, 0) scale(${cam.s.toFixed(4)}) rotate(${cam.r.toFixed(3)}deg)`,
            transformOrigin: `${cam.fx}% ${cam.fy}%`,
          }}
        >
          {personPoses.map((src, index) => (
            <img
              className="cover-image pose-img"
              src={src}
              alt={index === 0 ? "创意资料墙前的人物" : ""}
              aria-hidden={index !== 0}
              key={src}
              style={{ opacity: poseOs[index] }}
            />
          ))}
          <div className="cover-shade" />
          <div className="poster-wall" aria-label="项目封面墙">
            {coverPosters.map((node, index) => (
              <a
                className={`cover-poster poster-${index + 1}`}
                href={node.href}
                key={node.title}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  width: `${node.w}%`,
                  height: `${node.h}%`,
                  "--r": `${node.rotate}deg`,
                }}
              >
                <img src={node.image} alt={`${node.title} 项目封面`} />
              </a>
            ))}
          </div>
        </div>

        <div className="journey-title" style={{ opacity: titleO }}>
          <p className="journey-kicker">BRAND STRATEGIST / CREATIVE / EXPERIENCE DESIGNER</p>
          <h1>孙瑞</h1>
          <p className="journey-sub">创意工作室主理人</p>
        </div>

        <div
          className="journey-beat beat-left"
          style={{ opacity: beat1O, transform: `translateY(-50%) translateX(${(1 - beat1O) * -60}px)` }}
        >
          <span className="journey-beat-index">01 / ABOUT</span>
          <h2>我是一名以策略导向作为核心工作方向的创意工作室主理人</h2>
          <p>
            长期工作在品牌活动、发布会、展区展厅、公关传播与整合营销的第一线。我擅长把商业目标、产品信息、品牌语境、预算条件和现场限制，组织成一套可以被客户理解、被团队推进、被现场承接的美学系统。
          </p>
        </div>

        <div
          className="journey-beat beat-right"
          style={{ opacity: beat2O, transform: `translateY(-50%) translateX(${(1 - beat2O) * 60}px)` }}
        >
          <span className="journey-beat-index">02 / 经验沉淀</span>
          <h2>从 4A 到上市公司</h2>
          <p>
            十五年的工作积累让我能够快速抓住客户的核心特点，并从战略层级推动活动进入更深的执行转化。2022
            年起，我开设创意工作室，持续参与 300+ 个跨行业公关与活动项目。
          </p>
        </div>

        <div
          className="journey-beat beat-left"
          style={{ opacity: beat3O, transform: `translateY(-50%) translateX(${(1 - beat3O) * -60}px)` }}
        >
          <span className="journey-beat-index">03 / 创意能力</span>
          <h2>用创意与表达打通品牌与公众</h2>
          <p>
            我也享受这个过程：通过策略判断、创意表达、视觉气质、现场秩序和传播出口的融合，帮助品牌完成更准确的推广、公关传播与公众沟通。
          </p>
        </div>

        <div
          className="journey-beat beat-right"
          style={{ opacity: beat4O, transform: `translateY(-50%) translateX(${(1 - beat4O) * 60}px)` }}
        >
          <span className="journey-beat-index">04 / 项目能力</span>
          <h2>复杂需求中的判断力与执行力</h2>
          <p>
            不同规模和行业的项目训练了我的判断力：在复杂需求中识别关键问题，在多方协作中建立清晰路径，并把策略、创意与执行结果稳定连接起来。
          </p>
        </div>

        <div className="journey-title journey-title-end" style={{ opacity: closingO }}>
          <p className="journey-kicker">BRAND STRATEGIST / CREATIVE / EXPERIENCE DESIGNER</p>
          <h1>孙瑞</h1>
          <p className="journey-sub">创意工作室主理人</p>
        </div>

        <div className="journey-hint journey-hint-end" style={{ opacity: closingO }}>
          <span />
          继续向下滚动
        </div>

        <div className="journey-hint" style={{ opacity: hintO }}>
          <span />
          向下滚动，走近这面墙
        </div>
      </div>
    </section>
  );
}

function ProjectFolders() {
  const [openFolder, setOpenFolder] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [dragOffsets, setDragOffsets] = useState({});
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [frontKey, setFrontKey] = useState("folder-pr");
  const [draggingKey, setDraggingKey] = useState(null);
  const dragRef = useRef(null);
  const roomFolder = projectFolders.find((folder) => folder.id === roomId) ?? null;

  // 文件夹展开后，滚轮也可以平移画布（不用每个人都会拖拽）
  const canvasRef = useRef(null);
  useEffect(() => {
    const el = canvasRef.current;
    if (!el || !roomId) return undefined;
    const onWheel = (event) => {
      event.preventDefault();
      setCanvasOffset((current) => ({
        x: Math.min(0, current.x - event.deltaX),
        y: current.y - event.deltaY,
      }));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [roomId]);

  const updateDrag = (event) => {
    if (!dragRef.current) return;
    event.preventDefault?.();
    const drag = dragRef.current;
    const nextX = drag.baseX + event.clientX - drag.startX;
    const nextY = drag.baseY + event.clientY - drag.startY;
    drag.moved = drag.moved || Math.abs(event.clientX - drag.startX) + Math.abs(event.clientY - drag.startY) > 8;
    if (drag.type === "canvas") {
      // 左侧围挡：x 最多回到初始点 0，不能继续右拖露出画布左边界外的空白
      setCanvasOffset({ x: Math.min(0, nextX), y: nextY });
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
      setRoomId(key.replace("folder-", ""));
      setCanvasOffset({ x: -560, y: 0 });
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
      </div>

      <div
        className="case-canvas"
        ref={canvasRef}
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
            <h3>创意无限画布</h3>
            <p>点击案例夹，即可在画布中看到对应案例</p>
          </div>

          {projectFolders.map((folder) => (
            <button
              className={`work-folder ${draggingKey === `folder-${folder.id}` ? "is-dragging" : ""}`}
              key={folder.id}
              type="button"
              onPointerDown={(event) => beginDrag(event, `folder-${folder.id}`, "folder")}
              onPointerMove={updateDrag}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              style={{
                zIndex: frontKey === `folder-${folder.id}` ? 30 : 12,
                transform: `translate3d(${folderAnchors[projectFolders.indexOf(folder)].x + (dragOffsets[`folder-${folder.id}`]?.x ?? 0)}px, ${folderAnchors[projectFolders.indexOf(folder)].y + (dragOffsets[`folder-${folder.id}`]?.y ?? 0)}px, 0) rotate(${folderAnchors[projectFolders.indexOf(folder)].r + ((dragOffsets[`folder-${folder.id}`]?.x ?? 0) * 0.01)}deg)`,
              }}
            >
              <img className="folder-art" src={folder.image} alt="" aria-hidden="true" />
              <span className="folder-body">
                <small>{folder.label}</small>
                <strong>{folder.title}</strong>
                <em>{folder.items.length > 0 ? `${folder.items.length} files` : "coming soon"}</em>
              </span>
            </button>
          ))}

          {roomFolder && <FolderRoom folder={roomFolder} onClose={() => setRoomId(null)} />}
        </div>
      </div>

    </section>
  );
}

/* 画布右侧展开的文件夹内容区：四列横排网格，最多 20 张案例贴纸；第 21 个点位留给「。。。」标签 */
const roomSpreads = [
  { x: 792, y: 124, r: -3 },
  { x: 1128, y: 118, r: 2 },
  { x: 1472, y: 126, r: -1 },
  { x: 1808, y: 116, r: 3 },
  { x: 788, y: 484, r: -2 },
  { x: 1132, y: 478, r: 1 },
  { x: 1468, y: 486, r: -3 },
  { x: 1812, y: 476, r: 2 },
  { x: 794, y: 844, r: 2 },
  { x: 1126, y: 838, r: -1 },
  { x: 1474, y: 846, r: 3 },
  { x: 1806, y: 836, r: -2 },
  { x: 790, y: 1204, r: -3 },
  { x: 1130, y: 1198, r: 1 },
  { x: 1470, y: 1206, r: -2 },
  { x: 1810, y: 1196, r: 2 },
  { x: 792, y: 1564, r: 3 },
  { x: 1128, y: 1558, r: -3 },
  { x: 1472, y: 1566, r: -1 },
  { x: 1808, y: 1556, r: 1 },
  { x: 1130, y: 1960, r: -2 },
];

function CuteEmptyCard() {
  return (
    <div className="cute-card" role="note">
      <span className="cute-tape" aria-hidden="true" />
      <span className="cute-doodle cute-d1" aria-hidden="true">
        ✿
      </span>
      <span className="cute-doodle cute-d2" aria-hidden="true">
        ♪
      </span>
      <span className="cute-doodle cute-d3" aria-hidden="true">
        ☆
      </span>
      <span className="cute-bubble" aria-hidden="true">
        等我哦！
      </span>
      <div className="cute-ellipsis">…</div>
      <p className="cute-title">还在整理中～</p>
      <p className="cute-sub">这个文件夹的内容，很快就来</p>
    </div>
  );
}

function FolderRoom({ folder, onClose }) {
  const allItems = sortProjectsByRecent(folder.items);
  const items = allItems.slice(0, 20);
  const hasMore = allItems.length > 20;
  const [cardOffsets, setCardOffsets] = useState({});
  const [front, setFront] = useState(null);
  const [dragging, setDragging] = useState(null);
  const dragRef = useRef(null);
  const glideRef = useRef(null);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => () => cancelAnimationFrame(glideRef.current), []);

  const removeDragListeners = () => {
    window.removeEventListener("pointermove", moveDrag);
    window.removeEventListener("pointerup", endDrag);
    window.removeEventListener("pointercancel", endDrag);
    window.removeEventListener("blur", endDrag);
  };

  const moveDrag = (event) => {
    const drag = dragRef.current;
    if (!drag) return;
    event.preventDefault?.();
    const nextX = drag.baseX + event.clientX - drag.startX;
    const nextY = drag.baseY + event.clientY - drag.startY;
    const now = performance.now();
    drag.vx = (event.clientX - drag.lastX) / Math.max(1, now - drag.lastT);
    drag.vy = (event.clientY - drag.lastY) / Math.max(1, now - drag.lastT);
    drag.lastX = event.clientX;
    drag.lastY = event.clientY;
    drag.lastT = now;
    setCardOffsets((current) => ({
      ...current,
      [drag.key]: { x: nextX, y: nextY, vx: drag.vx },
    }));
  };

  const endDrag = () => {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    setDragging(null);
    removeDragListeners();
    // 贴纸松手后的惯性滑行：速度按摩擦衰减，卡片带着甩出去的劲儿慢慢停
    const key = drag.key;
    let vx = Math.max(-2.4, Math.min(2.4, drag.vx || 0));
    let vy = Math.max(-2.4, Math.min(2.4, drag.vy || 0));
    if (Math.hypot(vx, vy) < 0.12) return;
    let last = performance.now();
    const step = (now) => {
      const dt = Math.min(48, now - last);
      last = now;
      vx *= 0.94;
      vy *= 0.94;
      setCardOffsets((current) => {
        const offset = current[key] ?? { x: 0, y: 0 };
        return {
          ...current,
          [key]: { x: offset.x + vx * dt, y: offset.y + vy * dt, vx: vx * dt * 0.9 },
        };
      });
      if (Math.hypot(vx, vy) > 0.02) {
        glideRef.current = requestAnimationFrame(step);
      } else {
        setCardOffsets((current) => ({
          ...current,
          [key]: { ...(current[key] ?? { x: 0, y: 0 }), vx: 0 },
        }));
      }
    };
    glideRef.current = requestAnimationFrame(step);
  };

  const beginDrag = (event, key) => {
    event.stopPropagation();
    event.preventDefault();
    cancelAnimationFrame(glideRef.current);
    removeDragListeners();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    const current = cardOffsets[key] ?? { x: 0, y: 0 };
    setFront(key);
    setDragging(key);
    dragRef.current = {
      key,
      startX: event.clientX,
      startY: event.clientY,
      baseX: current.x,
      baseY: current.y,
      lastX: event.clientX,
      lastY: event.clientY,
      lastT: performance.now(),
      vx: 0,
      vy: 0,
    };
    window.addEventListener("pointermove", moveDrag, { passive: false });
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    window.addEventListener("blur", endDrag);
  };

  return (
    <>
      <button
        className="folder-room-close"
        type="button"
        onClick={onClose}
        onPointerDown={(event) => event.stopPropagation()}
      >
        ✕ 收起「{folder.title}」
      </button>
      {items.map((project, index) => {
        const layout = roomSpreads[index];
        const key = `${folder.id}-${project.title}`;
        const offset = cardOffsets[key] ?? { x: 0, y: 0, vx: 0 };
        const tilt = Math.max(-14, Math.min(14, (offset.vx ?? 0) * 1.6));
        return (
          <article
            className={`project-file room-file ${dragging === key ? "is-dragging" : ""}`}
            key={key}
            onPointerDown={(event) => beginDrag(event, key)}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            style={{
              left: layout.x,
              top: layout.y,
              zIndex: front === key ? 40 : index + 10,
              transform: `translate3d(${offset.x}px, ${offset.y}px, 0) rotate(${layout.r + tilt}deg)`,
            }}
          >
            <div
              className="project-file-paper sticker-drop"
              style={{ "--drop-delay": `${index * 70}ms` }}
            >
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
      {hasMore && (
        <a
          className="more-tag"
          href="case.html"
          onPointerDown={(event) => event.stopPropagation()}
          style={{
            left: roomSpreads[items.length].x,
            top: roomSpreads[items.length].y + 36,
            transform: `rotate(${roomSpreads[items.length].r}deg)`,
          }}
        >
          <span
            className="more-tag-inner sticker-drop"
            style={{ "--drop-delay": `${items.length * 70}ms` }}
          >
            <span className="more-tag-dots">。。。</span>
            <span className="more-tag-text">进案例库看全部 →</span>
          </span>
        </a>
      )}
      {items.length === 0 && (
        <div className="cute-card-slot" style={{ left: 800, top: 150 }}>
          <CuteEmptyCard />
        </div>
      )}
    </>
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
          <a href="/case.html">案例库</a>
          <a href="/writing.html">思考</a>
        </div>
        <a className="nav-action" href="#contact">
          联系
        </a>
      </nav>

      <ScrollJourney />

      <section className="intro page-pad" id="profile">
        <div className="profile-sheet">
          <aside className="profile-rail">BRAND STRATEGIST / CREATIVE / EXPERIENCE DESIGNER</aside>
          <div className="profile-main">
            <span className="profile-index">05 / 技能矩阵</span>
            <p className="profile-lead profile-summary">
              我从文字进入这个行业，至今十五年，一直在品牌活动、发布会与公关传播的一线。从 4A 到上市公司，再到 2022 年成立自己的工作室，我做的始终是同一件事：先用语言命名问题、建立结构，再让视觉、空间、流程和传播把这种结构变成公共经验。相比一个漂亮的创意，我更关心另一件事：复杂的信息、模糊的需求和有限的资源，能否被整理成客户能理解、团队能执行、用户能感受到的完整体验。
            </p>
            <p className="profile-lead profile-summary">
              项目横跨汽车、科技、互联网平台、消费和文旅，从竞标提案、展区展厅，到年度传播和现场统筹。这些项目带给我的不只是经验，更是一种面向社会的审美判断：概念精准，视觉成体系，现场有氛围，传播有抓手。
            </p>
            <p className="profile-lead profile-summary">
              我相信策略来自真实世界。工作之外，我持续研究 AI、商业、历史、金融与社会议题，做播客，也长期写作，习惯从一本书、一个事件、一次技术变革里寻找更深层的结构。我把 AI 视为协作者，把判断留给自己——每一次表达，都要有事实、有逻辑，也有温度。
            </p>
            <p className="profile-lead profile-summary profile-summary-tail">
              以下这些能力，正是这个时代的策划人最应该、也最需要具备的。
            </p>
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
          </aside>
          <div className="profile-clients">
            <h3>CLIENTS</h3>
            <div className="client-logo-flow">
              {clientLogos.map((logo) => (
                <span className="client-item" key={logo.name}>
                  <img src={logo.src} alt={logo.name} loading="lazy" />
                  {logo.mark && <em>{logo.name}</em>}
                </span>
              ))}
              <a className="client-more" href="/case.html" aria-label="查看案例库">
                ···
              </a>
            </div>
          </div>
          <footer className="profile-footer">
            <span>© 2026 SUNRUI STUDIO · ALL RIGHTS RESERVED</span>
            <span>BEIJING, CHINA&nbsp;↗</span>
          </footer>
        </div>
      </section>

      <ProjectFolders />

      <section className="contact page-pad" id="contact">
        <div className="contact-copy">
          <span className="profile-index">06 / 联系 & 留言</span>
          <h2>好的方案，很少从方案开始。</h2>
          <p>
            更多时候，它来自一次讨论、一个问题，或者一个还说不完整的想法。如果你正好卡在这里，可以把它发给我。
          </p>
          <ul className="contact-channels">
            <li>
              <span>邮箱</span>
              <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
            </li>
            {contactInfo.wechat && (
              <li>
                <span>微信</span>
                <strong>{contactInfo.wechat}</strong>
              </li>
            )}
            {contactInfo.phone && (
              <li>
                <span>手机</span>
                <strong>{contactInfo.phone}</strong>
              </li>
            )}
          </ul>
        </div>

        <form
          className="contact-board"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            const name = data.get("name") || "";
            const reply = data.get("reply") || "";
            const message = data.get("message") || "";
            const body = encodeURIComponent(`${message}\n\n—— ${name}${reply ? `（联系方式：${reply}）` : ""}`);
            window.location.href = `mailto:${contactInfo.email}?subject=${encodeURIComponent(`网站留言｜${name}`)}&body=${body}`;
          }}
        >
          <h3>留言板</h3>
          <label>
            你的名字
            <input name="name" type="text" autoComplete="name" required />
          </label>
          <label>
            你的联系方式
            <input name="reply" type="text" placeholder="微信 / 邮箱 / 手机" />
          </label>
          <label>
            想说点什么
            <textarea name="message" rows={5} required />
          </label>
          <button className="button primary" type="submit">
            送出留言
          </button>
          <p className="contact-board-note">留言会通过邮件直接送到我的收件箱。</p>
        </form>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
