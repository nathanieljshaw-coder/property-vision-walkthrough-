#!/usr/bin/env python3
"""Estimate camera motion (pan dx/dy, zoom) between consecutive PGM frames.
Frames are 160x90 gray P5 PGM files named fNNN.pgm at 2.5 fps (0.4s apart).
Prints per-pair: time, dx (px), dy (px), zoom factor, corr (motion quality).
Low corr means a scene cut. Pure stdlib — no numpy/PIL needed.
"""
import glob
import sys


def load_pgm(path):
    with open(path, "rb") as f:
        data = f.read()
    # P5 header: "P5\n<w> <h>\n255\n" then raw bytes (may have comments)
    parts = data.split(b"\n", 3)
    assert parts[0] == b"P5", parts[0]
    w, h = map(int, parts[1].split())
    return w, h, parts[3][: w * h]


def corr(a, b):
    """Normalized correlation of two equal-length lists."""
    n = len(a)
    ma = sum(a) / n
    mb = sum(b) / n
    sa = sum((x - ma) ** 2 for x in a)
    sb = sum((x - mb) ** 2 for x in b)
    if sa == 0 or sb == 0:
        return 0.0
    num = sum((x - ma) * (y - mb) for x, y in zip(a, b))
    return num / (sa * sb) ** 0.5


def best_shift(prof_a, prof_b, max_shift):
    best = (0, -1.0)
    for s in range(-max_shift, max_shift + 1):
        if s < 0:
            c = corr(prof_a[-s:], prof_b[:s])
        elif s > 0:
            c = corr(prof_a[:-s], prof_b[s:])
        else:
            c = corr(prof_a, prof_b)
        if c > best[1]:
            best = (s, c)
    return best


def frames_of(d):
    fs = sorted(glob.glob(f"{d}/f*.pgm"))
    out = []
    for p in fs:
        w, h, raw = load_pgm(p)
        out.append((w, h, raw))
    return out


def main(d):
    fr = frames_of(d)
    print(f"== {d}: {len(fr)} frames (0.4s apart) ==")
    for i in range(len(fr) - 1):
        w, h, ra = fr[i]
        _, _, rb = fr[i + 1]
        # column profile (sum over rows) -> horizontal shift
        ca = [sum(ra[y * w + x] for y in range(h)) for x in range(w)]
        cb = [sum(rb[y * w + x] for y in range(h)) for x in range(w)]
        dx, cx = best_shift(ca, cb, 30)
        # row profile -> vertical shift
        ra_ = [sum(ra[y * w + x] for x in range(w)) for y in range(h)]
        rb_ = [sum(rb[y * w + x] for x in range(w)) for y in range(h)]
        dy, cy = best_shift(ra_, rb_, 20)
        # zoom: scale B by k about centre and correlate with A
        best_k, best_c = 1.0, -1.0
        for k in [0.92, 0.95, 0.98, 1.0, 1.02, 1.05, 1.08]:
            scaled = []
            cxm, cym = w / 2.0, h / 2.0
            for y in range(h):
                for x in range(w):
                    # map output pixel to input pixel under zoom about centre
                    sx = cxm + (x - cxm) / k
                    sy = cym + (y - cym) / k
                    xi, yi = int(sx), int(sy)
                    if 0 <= xi < w and 0 <= yi < h:
                        scaled.append(rb[yi * w + xi])
                    else:
                        scaled.append(127)
            c = corr(list(ra), scaled)
            if c > best_c:
                best_c, best_k = c, k
        t = i * 0.4
        qual = "CUT " if (cx < 0.5 or cy < 0.5 or best_c < 0.5) else "    "
        print(f"t={t:4.1f}s dx={dx:+3d}px dy={dy:+3d}px zoom={best_k:+.2f}/0.4s corr={best_c:.2f} {qual}")


if __name__ == "__main__":
    main(sys.argv[1])
