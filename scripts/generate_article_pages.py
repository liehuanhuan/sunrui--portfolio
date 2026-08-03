# 从 writing-data.js 生成每篇文章的独立静态页 article-XX.html
# 不再使用 writing.html?article=XX 的整合页面形式
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
raw = (ROOT / "writing-data.js").read_text(encoding="utf-8")
m = re.search(r"window\.writingArticles\s*=\s*(\[.*\])\s*;?\s*$", raw, re.S)
articles = sorted(json.loads(m.group(1)), key=lambda a: a["order"])

TEMPLATE = """<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}｜孙瑞 Portfolio</title>
    <link rel="stylesheet" href="./styles.css?v=20260803a" />
  </head>
  <body class="is-case-index is-writing-detail">
    <header class="site-header" aria-label="文章页导航">
      <a class="brand" href="./index.html">
        <span class="brand-mark">SR</span>
        <span>回到首页</span>
      </a>
      <nav class="nav-links" aria-label="页面导航">
        <a href="./index.html#profile">经历</a>
        <a href="./index.html#work">案例</a>
        <a href="./case.html">案例库</a>
        <a href="./index.html#contact">联系</a>
      </nav>
    </header>

    <main class="writing-page">
      <article class="writing-detail">
        <header class="writing-detail-head">
          <p class="superline">技术思考 · 第 {num} 篇 / 共 {total} 篇</p>
          <h1>{title}</h1>
          {sub}
        </header>
        <div class="writing-prose">{html}</div>
        <nav class="writing-pager" aria-label="系列导航">
          {prev}
          {next}
        </nav>
      </article>
    </main>
  </body>
</html>
"""

total = len(articles)
for i, a in enumerate(articles):
    slug = a["slug"]
    prev_a = articles[i - 1] if i > 0 else None
    next_a = articles[i + 1] if i + 1 < total else None
    prev_html = (
        f'<a href="./article-{prev_a["slug"]}.html">← {prev_a["title"]}</a>'
        if prev_a
        else '<a href="./index.html#work">← 回到画布</a>'
    )
    next_html = (
        f'<a href="./article-{next_a["slug"]}.html">{next_a["title"]} →</a>'
        if next_a
        else '<a href="./index.html#work">回到画布 →</a>'
    )
    page = TEMPLATE.format(
        title=a["title"],
        num=str(a["order"]).zfill(2),
        total=total,
        sub=f'<p class="writing-detail-sub">{a["sub"]}</p>' if a.get("sub") else "",
        html=a["html"],
        prev=prev_html,
        next=next_html,
    )
    out = ROOT / f"article-{slug}.html"
    out.write_text(page, encoding="utf-8")
    print(f"生成 {out.name}")

print("完成")
