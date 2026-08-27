#!/usr/bin/env python3
"""Upscale the 28 cropped Villa Sereno room panels with Real-ESRGAN x4.

Each collage panel is small (~300px); one x4 GAN pass synthesizes real detail,
then the montage script handles the final lanczos scaling to 4K.
Output: .freebuff/villa-rooms-4k/<name>.jpg
"""
import os
import sys

import cv2
import torch

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, ".freebuff", "villa-rooms")
OUT = os.path.join(ROOT, ".freebuff", "villa-rooms-4k")
WEIGHTS = os.path.join(ROOT, ".freebuff", "weights", "RealESRGAN_x4plus.pth")


def main() -> int:
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
    names = sorted(f for f in os.listdir(SRC) if f.endswith(".jpg"))
    for fname in names:
        src = os.path.join(SRC, fname)
        dst = os.path.join(OUT, fname)
        if os.path.exists(dst):
            print(f"SKIP (exists): {fname}")
            continue
        img = cv2.imread(src, cv2.IMREAD_COLOR)
        h, w = img.shape[:2]
        print(f"== {fname}  {w}x{h} ==", flush=True)
        output, _ = upsampler.enhance(img, outscale=4)
        cv2.imwrite(dst, output, [cv2.IMWRITE_JPEG_QUALITY, 95])
        print(f"   -> {output.shape[1]}x{output.shape[0]}", flush=True)
    print("Done.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
