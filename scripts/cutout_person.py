#!/usr/bin/env python3
"""从封面与三张动作照自动抠人物：干净墙板差分法。
输出: assets/hero/wall-clean.png + person-0..3.png (均 1683x935, 与封面同帧)
"""
from PIL import Image, ImageFilter
import numpy as np

COVER = "assets/hero/creative-brain-cover.png"

cover = Image.open(COVER).convert("RGB")
W, H = cover.size
arr = np.array(cover).astype(np.float32)

x0, x1 = int(W * 0.27), int(W * 0.73)
y0 = int(H * 0.29)

# 1) 干净墙板：人物区域按每行墙色填充
plate = arr.copy()
for y in range(y0, H):
    left = arr[y, max(0, x0 - 60):x0]
    right = arr[y, x1:min(W, x1 + 60)]
    strip = np.concatenate([left, right], axis=0)
    plate[y, x0:x1] = np.median(strip, axis=0)

boxmask = np.zeros((H, W), np.float32)
boxmask[y0:H, x0:x1] = 255
bm = Image.fromarray(boxmask.astype(np.uint8)).filter(ImageFilter.GaussianBlur(18))
bm_arr = np.array(bm).astype(np.float32) / 255.0
plate = plate * bm_arr[..., None] + arr * (1 - bm_arr[..., None])
plate_img = Image.fromarray(plate.astype(np.uint8))
plate_img.save("assets/hero/wall-clean.png")
print("干净墙板 OK")


def cutout(src_path, out_path, rx0=0.27, rx1=0.73, ry0=0.29):
    img = Image.open(src_path).convert("RGB")
    w, h = img.size
    pl = plate_img.resize((w, h), Image.LANCZOS) if plate_img.size != (w, h) else plate_img
    a = np.array(img).astype(np.int16)
    b = np.array(pl).astype(np.int16)
    dist = np.sqrt(((a - b) ** 2).sum(axis=2))
    m = np.zeros((h, w), np.uint8)
    region = dist[int(h * ry0):h, int(w * rx0):int(w * rx1)]
    m[int(h * ry0):h, int(w * rx0):int(w * rx1)] = (region > 16).astype(np.uint8) * 255
    mask = Image.fromarray(m)
    mask = mask.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.MinFilter(7))
    mask = mask.filter(ImageFilter.GaussianBlur(2))
    rgba = img.convert("RGBA")
    rgba.putalpha(mask)
    # 统一到封面帧：按宽度缩放后垂直居中裁剪
    if (w, h) != (W, H):
        nh = round(h * W / w)
        rgba = rgba.resize((W, nh), Image.LANCZOS)
        top = max(0, (nh - H) // 2)
        rgba = rgba.crop((0, top, W, top + H))
    rgba.save(out_path)
    print(out_path, "bbox:", mask.getbbox())


cutout(COVER, "assets/hero/person-0.png")
for i, p in enumerate(["pose-1", "pose-2", "pose-3"], start=1):
    cutout(f"assets/hero/{p}.jpg", f"assets/hero/person-{i}.png")
print("全部完成")
