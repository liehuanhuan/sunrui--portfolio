# 批量压缩 assets/ 里的网站图片：
# - 无透明通道的大图 -> 降为最长边 1600px 的 JPEG(q82)，扩展名 .png 改 .jpg
# - 有透明通道的（人物抠图等）-> 保留 PNG，只降尺寸 + optimize
# - 输出 scripts/image_map.json 记录 旧相对路径 -> 新相对路径
import json
import os
from pathlib import Path

from PIL import Image

Image.MAX_IMAGE_PIXELS = None
ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"
MAX_SIDE = 1600
MIN_BYTES = 300 * 1024

mapping = {}
processed = 0
before_total = 0
after_total = 0


def has_real_alpha(im: Image.Image) -> bool:
    if im.mode in ("RGBA", "LA"):
        alpha = im.getchannel("A")
        lo, _ = alpha.getextrema()
        return lo < 255
    if im.mode == "P" and "transparency" in im.info:
        return True
    return False


for path in sorted(ASSETS.rglob("*")):
    if path.suffix.lower() not in (".png", ".jpg", ".jpeg"):
        continue
    size = path.stat().st_size
    if size < MIN_BYTES:
        continue
    rel = path.relative_to(ROOT).as_posix()
    try:
        im = Image.open(path)
        im.load()
    except Exception as exc:  # noqa: BLE001
        print(f"跳过(打不开): {rel} ({exc})")
        continue

    w, h = im.size
    scale = min(1.0, MAX_SIDE / max(w, h))
    if scale < 1.0:
        im = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)

    before_total += size

    if has_real_alpha(im):
        im.save(path, optimize=True)
        new_rel = rel
    else:
        rgb = im.convert("RGB")
        new_path = path.with_suffix(".jpg")
        rgb.save(new_path, quality=82, optimize=True, progressive=True)
        if new_path != path:
            path.unlink()
        new_rel = new_path.relative_to(ROOT).as_posix()

    after = (ROOT / new_rel).stat().st_size
    after_total += after
    mapping[rel] = new_rel
    processed += 1
    if processed % 50 == 0:
        print(f"已处理 {processed} 张…")

out = ROOT / "scripts" / "image_map.json"
out.write_text(json.dumps(mapping, ensure_ascii=False, indent=1), encoding="utf-8")
print(f"\n完成: {processed} 张")
print(f"压缩前: {before_total / 1024 / 1024:.0f} MB")
print(f"压缩后: {after_total / 1024 / 1024:.0f} MB")
changed_ext = sum(1 for a, b in mapping.items() if a != b)
print(f"扩展名变化(.png->.jpg): {changed_ext} 个, 映射已写入 {out}")
