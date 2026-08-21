#!/usr/bin/env python3
"""Upscale all source photos to true 8K (7680x4320) with Real-ESRGAN x4.

The source photos are ~1600x900; a plain resize can't invent detail, so we run
each one through the RealESRGAN_x4plus GAN, which synthesizes plausible detail,
then finish at exactly 7680x4320. Output goes to .freebuff/upscaled-8k/ with the
same basenames so the walkthrough generator can point at them.

Usage: ./.freebuff/venv/bin/python .freebuff/upscale-photos.py
"""
import os
import sys

import cv2
import torch

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "src", "assets", "portfolio")
OUT = os.path.join(ROOT, ".freebuff", "upscaled-8k")
WEIGHTS = os.path.join(ROOT, ".freebuff", "weights", "RealESRGAN_x4plus.pth")

TARGET_W, TARGET_H = 7680, 4320

# Photos used by the walkthrough generator: <hero>/<angle1>/<angle2> per slug.
USED = [
    "villa-sereno-hero", "villa-sereno-1", "villa-sereno-2",
    "grand-alpine-hero", "grand-alpine-1", "grand-alpine-2",
    "pine-valley-hero", "pine-valley-1", "pine-valley-2",
    "aura-dining-hero", "aura-dining-1", "aura-dining-2",
    "cotswold-haven-hero", "cotswold-haven-1", "cotswold-haven-2",
    "apex-estate-hero", "apex-estate-1", "apex-estate-2",
]

def main():
    print("MPS available:", torch.backends.mps.is_available())
    device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")

    from basicsr.archs.rrdbnet_arch import RRDBNet
    from realesrgan import RealESRGANer

    model = RRDBNet(num_in_ch=3, num_out_ch=3, num_feat=64, num_block=23, num_grow_ch=32, scale=4)
    upsampler = RealESRGANer(
        scale=4,
        model_path=WEIGHTS,
        model=model,
        tile=256,
        tile_pad=10,
        pre_pad=0,
        half=False,
        device=device,
    )

    os.makedirs(OUT, exist_ok=True)
    for name in USED:
        src = os.path.join(SRC, name + ".jpg")
        dst = os.path.join(OUT, name + ".jpg")
        if not os.path.exists(src):
            print(f"SKIP (missing): {name}")
            continue
        if os.path.exists(dst):
            print(f"SKIP (exists):  {name}")
            continue
        img = cv2.imread(src, cv2.IMREAD_COLOR)
        h, w = img.shape[:2]
        outscale = max(TARGET_W / w, TARGET_H / h)
        print(f"== {name}  {w}x{h} -> outscale {outscale:.2f} ==", flush=True)
        output, _ = upsampler.enhance(img, outscale=outscale)
        # finish at exactly 8K
        if output.shape[1] != TARGET_W or output.shape[0] != TARGET_H:
            output = cv2.resize(output, (TARGET_W, TARGET_H), interpolation=cv2.INTER_LANCZOS4)
        cv2.imwrite(dst, output, [cv2.IMWRITE_JPEG_QUALITY, 95])
        print(f"   -> {dst}  {output.shape[1]}x{output.shape[0]}", flush=True)
    print("Done.")

if __name__ == "__main__":
    sys.exit(main())
