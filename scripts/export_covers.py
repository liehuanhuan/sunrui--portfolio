"""从 Obsidian 项目精华库批量导出工作室项目的方案封面（01-*.png 标题页）。

读取 project-index.js 中所有 slug 含「工作室项目」的条目，
沿 hero 路径找到 _assets 项目目录，取其中 01-*.png 封面（取体积最大者，
标题页通常比文字页图大），压缩为宽 960 的 JPEG 存到 assets/project-covers/<slug>.jpg。
已存在 .jpg 或 .png 封面的跳过。
"""

import re
import sys
from pathlib import Path

from PIL import Image

ROOT = Path("/Users/sunrui/Documents/Obsidian Vault")
SITE = ROOT / "个人网站"
OUT = SITE / "assets" / "project-covers"
OUT.mkdir(parents=True, exist_ok=True)

src = (SITE / "project-index.js").read_text(encoding="utf-8")

entries = []
for chunk in src.split('"slug": "')[1:]:
    slug = chunk.split('"', 1)[0]
    if "工作室项目" not in slug:
        continue
    m = re.search(r'"hero": "([^"]+)"', chunk[:6000])
    entries.append((slug, m.group(1) if m else ""))

print(f"工作室项目条目: {len(entries)}")

done = skip = 0
miss = []
for slug, hero in entries:
    out_jpg = OUT / f"{slug}.jpg"
    if out_jpg.exists() or (OUT / f"{slug}.png").exists():
        skip += 1
        continue
    cover = None
    if hero:
        hero_path = (SITE / hero).resolve()
        asset_dir = hero_path.parent
        if asset_dir.is_dir():
            cands = sorted(asset_dir.glob("01-*.png"))
            if cands:
                cover = max(cands, key=lambda p: p.stat().st_size)
    if cover is None:
        miss.append(slug)
        continue
    try:
        img = Image.open(cover).convert("RGB")
        if img.width > 960:
            img = img.resize((960, round(img.height * 960 / img.width)), Image.LANCZOS)
        img.save(out_jpg, "JPEG", quality=78)
        done += 1
    except Exception as exc:  # noqa: BLE001
        miss.append(f"{slug} ({exc})")

print(f"新导出: {done}, 已有跳过: {skip}, 缺封面: {len(miss)}")
for slug in miss:
    print("MISS", slug)
