#!/usr/bin/env python3
"""Render one room photo as a 2.5D "walk into the room" clip at 8K 60fps.

Uses MiDaS depth to warp the photo per-frame: NEAR objects expand outward
faster than the background as the camera pushes forward, so it reads as
walking into the space (true parallax), not a flat zoom.

Usage:
  ./.freebuff/venv/bin/python .freebuff/parallax-render-8k.py <room.jpg> <out.mp4>

Output: 7680x4320 @ 60fps, ~4.4s (264 frames), h264 crf 15.
"""
import os
import subprocess
import sys

import cv2
import numpy as np
import torch

FPS = 60
FRAMES = 264          # 4.4s at 60fps
W, H = 7680, 4320
PRE_W, PRE_H = 10752, 6048   # 1.4x canvas so near zoom never samples below 8K
ZOOM_NEAR = 1.25            # near-pixel push at end of shot (gentle)
ZOOM_FAR = 1.05             # background push at end of shot (subtle)
LATERAL = 0.020             # subtle alternating drift (fraction of width)
BLUR_SIGMA = 60             # smooth depth map for silky warp


def load_depth(img_bgr):
    """MiDaS small inverse-depth map for the image, as float32 [0,1] (near=1)."""
    torch.set_num_threads(4)
    midas = torch.hub.load("intel-isl/MiDaS", "MiDaS_small").eval()
    transform = torch.hub.load("intel-isl/MiDaS", "transforms").small_transform

    rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
    inp = transform(rgb)
    with torch.no_grad():
        d = midas(inp)
    depth = d.squeeze().cpu().numpy().astype(np.float32)
    depth = cv2.resize(depth, (W, H), interpolation=cv2.INTER_CUBIC)
    depth = (depth - depth.min()) / (depth.max() - depth.min() + 1e-6)
    return depth


def build_map(depth, t, drift):
    """Per-pixel remap maps so near pixels scale more than far (parallax)."""
    t_norm = t / (FRAMES - 1)
    # smooth ease-in-out for natural walking feel
    t_ease = t_norm * t_norm * (3 - 2 * t_norm)  # smoothstep
    cx = W / 2 + drift * W * t_ease
    cy = H / 2

    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    # scale factor per pixel: far=ZOOM_FAR, near=ZOOM_NEAR (linear in depth)
    s = ZOOM_FAR + (ZOOM_NEAR - ZOOM_FAR) * depth
    s = 1.0 + (s - 1.0) * t_ease

    # invert: source = (dst - c)/s + c  (sample farther out as we push in)
    sx = (xx - cx) / s + cx
    sy = (yy - cy) / s + cy
    return sx, sy


def main() -> int:
    src_path, out_path = sys.argv[1], sys.argv[2]
    if os.path.exists(out_path):
        print(f"SKIP (exists): {os.path.basename(out_path)}")
        return 0

    img = cv2.imread(src_path, cv2.IMREAD_COLOR)
    h, w = img.shape[:2]
    # cover-scale to the 1.4x canvas (never stretch)
    scale = max(PRE_W / w, PRE_H / h)
    big = cv2.resize(img, (round(w * scale), round(h * scale)), interpolation=cv2.INTER_LANCZOS4)
    bh, bw = big.shape[:2]
    x0 = (bw - PRE_W) // 2
    y0 = (bh - PRE_H) // 2
    big = big[y0:y0 + PRE_H, x0:x0 + PRE_W]
    if big.shape[0] != PRE_H or big.shape[1] != PRE_W:
        big = cv2.resize(big, (PRE_W, PRE_H), interpolation=cv2.INTER_LANCZOS4)

    print(f"== {os.path.basename(src_path)} — estimating depth (8K 60fps) ==",
          flush=True)
    depth = load_depth(img)
    depth = cv2.GaussianBlur(depth, (0, 0), sigmaX=BLUR_SIGMA)

    # subtle alternating lateral drift so consecutive rooms navigate, not pan
    drift = LATERAL if (abs(hash(os.path.basename(src_path))) % 2 == 0) else -LATERAL

    cmd = [
        "node_modules/ffmpeg-static/ffmpeg",
        "-y", "-f", "rawvideo", "-pix_fmt", "bgr24",
        "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
        "-c:v", "libx265", "-preset", "slow", "-crf", "15",
        "-pix_fmt", "yuv420p", "-tag:v", "hvc1", "-an", out_path,
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)

    for t in range(FRAMES):
        sx, sy = build_map(depth, t, drift)
        frame = cv2.remap(big, sx, sy, interpolation=cv2.INTER_CUBIC,
                          borderMode=cv2.BORDER_REPLICATE)
        # gentle sharpen to keep the GAN detail crisp
        frame = cv2.addWeighted(frame, 1.06,
                                cv2.GaussianBlur(frame, (0, 0), 1.5),
                                -0.06, 0)
        proc.stdin.write(frame.tobytes())

    proc.stdin.close()
    proc.wait()
    print(f"   -> {out_path}", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
