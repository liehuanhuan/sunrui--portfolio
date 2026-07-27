const params = new URLSearchParams(window.location.search);
const articleSlug = params.get("article");
const articles = (window.writingArticles || []).slice().sort((a, b) => a.order - b.order);
const root = document.querySelector("#writing-root");

if (!articleSlug) {
  // 系列索引视图
  document.title = "技术思考｜孙瑞 Portfolio";
  document.body.classList.add("is-case-index");
  root.innerHTML = `
    <section class="case-index writing-index">
      <div class="case-index-head">
        <p class="superline">NOTES ON AI & WORK</p>
        <h1>技术思考</h1>
        <p class="case-index-sub">一个关于 AI、工具与人的五篇系列：怎么干活 → 怎么决策 → 怎么积累 → 怎么自处 → 怎么理解。控制论是底座，人是目的。</p>
      </div>
      <div class="writing-list">
        ${articles
          .map(
            (a) => `
          <a class="writing-item" href="./writing.html?article=${encodeURIComponent(a.slug)}">
            <span class="writing-item-num">${String(a.order).padStart(2, "0")}</span>
            <span class="writing-item-main">
              <strong>${a.title}</strong>
              <em>${a.sub || ""}</em>
            </span>
            <span class="writing-item-arrow">↗</span>
          </a>`
          )
          .join("")}
      </div>
    </section>
  `;
} else {
  // 文章详情视图
  const article = articles.find((a) => a.slug === articleSlug) || articles[0];
  const idx = articles.indexOf(article);
  const prev = articles[idx - 1];
  const next = articles[idx + 1];
  document.title = `${article.title}｜孙瑞 Portfolio`;
  document.body.classList.add("is-case-index", "is-writing-detail");
  root.innerHTML = `
    <article class="writing-detail">
      <header class="writing-detail-head">
        <p class="superline">技术思考 · 第 ${String(article.order).padStart(2, "0")} 篇 / 共 ${articles.length} 篇</p>
        <h1>${article.title}</h1>
        ${article.sub ? `<p class="writing-detail-sub">${article.sub}</p>` : ""}
      </header>
      <div class="writing-prose">${article.html}</div>
      <nav class="writing-pager" aria-label="系列导航">
        ${prev ? `<a href="./writing.html?article=${encodeURIComponent(prev.slug)}">← ${prev.title}</a>` : `<a href="./writing.html">← 返回系列</a>`}
        ${next ? `<a href="./writing.html?article=${encodeURIComponent(next.slug)}">${next.title} →</a>` : `<a href="./writing.html">返回系列 →</a>`}
      </nav>
    </article>
  `;
}
