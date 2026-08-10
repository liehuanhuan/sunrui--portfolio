#!/bin/bash
# 一键发布「技术思考」：改稿后跑一次即可全自动上线
# 用法: scripts/publish.sh ["自定义 commit 信息"]
set -e
cd "$(dirname "$0")/.."

MSG="${1:-更新技术思考文章 $(date '+%Y-%m-%d %H:%M')}"

echo "==> 1/5 导出文章数据（技术思考/*.md → writing-data.js）"
python scripts/export_writing.py

echo "==> 2/5 生成文章页（article-01~05.html）"
python scripts/generate_article_pages.py

echo "==> 3/5 构建首页（vite build）"
npm run build --silent

echo "==> 4/5 同步构建产物并更新首页引用"
rsync -a --delete dist/bundle/ bundle/
JS=$(ls dist/bundle | grep -E '^main-.*\.js$' | head -1)
CSS=$(ls dist/bundle | grep -E '^main-.*\.css$' | head -1)
sed -i '' -E "s|\./bundle/main-[^\"]+\.js|./bundle/$JS|; s|\./bundle/main-[^\"]+\.css|./bundle/$CSS|" index.html
echo "    bundle: $JS / $CSS"

echo "==> 5/5 提交并推送"
git add -A
if git diff --cached --quiet; then
  echo "没有内容变化，无需提交。线上已是最新。"
  exit 0
fi
git commit -m "$MSG"
git push origin main

echo ""
echo "完成 ✅ 1-2 分钟后生效："
echo "  https://liehuanhuan.github.io/sunrui--portfolio/"
