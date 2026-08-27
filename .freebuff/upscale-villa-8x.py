#!/usr/bin/env python3
"""Re-upscale Villa Sereno rooms to 8x for 8K montage output.

First pass: existing 4x ESRGAN upscales (~1200px)
Second pass: Real-ESRGAN x4 again on those (~4800px)
Final: 4x again? No — that's 32x total from 300px which is wasteful.
Better approach: upscale the RAW crops (300px) with ESRGAN x4 = 1200px,
then use lanczos to scale to ~3600px for8K canvas (2x from 1200px).

Usage: ./.freebuff/venv/bin/python .freebuff/upscale-villa-8x.py
"""
import os
import subprocess
import sys
import time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VENV_PY = os.path.join(ROOT, ".freebuff", "venv", "bin", "python")
ESRGAN_SCRIPT = os.path.join(ROOT, ".freebuff", "upscale-photos.py")
RAW_DIR = os.path.join(ROOT, ".freebuff", "villa-rooms")
OUT_DIR = os.path.join(ROOT, ".freebuff", "villa-rooms-8k")
os.makedirs(OUT_DIR, exist_ok=True)

# For 8K output (7680x4320), we need source images ~3600px wide.
# Raw panels are ~300px. ESRGAN x4 = 1200px. Then 3x lanczos = 3600px.
# But a single ESRGAN x4 pass + lanczos is faster and nearly as good.

files = sorted(os.listdir(RAW_DIR))
print(f"Found {len(files)} room photos to upscale for 8K")

for i, f in enumerate(files):
    src = os.path.join(RAW_DIR, f)
    dst = os.path.join(OUT_DIR, f)
    if os.path.exists(dst):
        print(f"  [{i+1}/{len(files)}] {f} — exists, skipping")
        continue
    print(f"  [{i+1}/{len(files)}] {f} — ESRGAN x4 then lanczos 3x...", flush=True)

    # Step 1: ESRGAN x4 (300px -> 1200px)
    tmp4x = os.path.join(OUT_DIR, f".tmp4x_{f}")
    subprocess.run([
        VENV_PY, ESRGAN_SCRIPT,
        "-i", src, "-o", tmp4x, "-n", "realesrgan-x4plus",
        "--outscale", "4"
    ], capture_output=True, check=True)

    # Step 2: Lanczos upscale 3x (1200px -> 3600px)
    from PIL import Image
    img = Image.open(tmp4x)
    w, h = img.size
    target_w = max(w * 3, 3600)
    target_h = int(h * (target_w / w))
    img_up = img.resize((target_w, target_h), Image.LANCZOS)
    img_up.save(dst, "JPEG", quality=97)
    os.remove(tmp4x)
    print(f"    -> {target_w}x{target_h}")

print(f"\nDone — {len(os.listdir(OUT_DIR))} upscaled to 8K in {OUT_DIR}")
