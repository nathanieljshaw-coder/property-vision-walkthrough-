#!/usr/bin/env python3
"""Crop the two collage grids into individual room photos.

Collage A (image_1bb920...): 4x3 grid of 12 rooms, 1200x896  -> 300x224 panels
Collage B (image_7ed7d6...): 4x4 grid of 16 rooms, 1376x768  -> 344x192 panels

Outputs to .freebuff/villa-rooms/<name>.jpg, each panel with a small inset
crop so any gutter line between panels is excluded.
"""
import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, ".freebuff", "villa-rooms")
os.makedirs(OUT, exist_ok=True)

COLLAGES = [
    {
        "path": "/Users/nathanieljshaw/Downloads/image_1bb920cc461983d8280bdc07d60c56b8.jpg",
        "cols": 4,
        "rows": 3,
        "names": [
            "single-bedroom",
            "double-bedroom",
            "king-bedroom",
            "queen-bedroom",
            "twin-bedroom",
            "kids-bunk-bedroom",
            "master-bedroom",
            "bathroom-tub",
            "bathroom-shower",
            "walk-in-wardrobe",
            "private-library",
            "living-room-fireplace",
        ],
    },
    {
        "path": "/Users/nathanieljshaw/Downloads/image_7ed7d6c76b0196957a6f1fdf74e8cb35.jpg",
        "cols": 4,
        "rows": 4,
        "names": [
            "indoor-pool",
            "home-gym",
            "basketball-court",
            "home-theater",
            "two-story-library",
            "games-room",
            "wine-cellar",
            "wet-bar",
            "formal-dining",
            "rustic-kitchen",
            "modern-kitchen",
            "sauna-steam",
            "massage-room",
            "hot-tub-grotto",
            "yoga-room",
            "living-room-wide",
        ],
    },
]


def main() -> int:
    for spec in COLLAGES:
        img = Image.open(spec["path"]).convert("RGB")
        w, h = img.size
        cw, rh = w / spec["cols"], h / spec["rows"]
        print(f"== {os.path.basename(spec['path'])} {w}x{h} -> {spec['cols']}x{spec['rows']} = {cw:.0f}x{rh:.0f} panels ==")
        idx = 0
        for r in range(spec["rows"]):
            for c in range(spec["cols"]):
                # small inset (1.5%) to exclude the gutter lines between panels
                ix, iy = cw * 0.015, rh * 0.015
                box = (
                    round(c * cw + ix),
                    round(r * rh + iy),
                    round((c + 1) * cw - ix),
                    round((r + 1) * rh - iy),
                )
                name = spec["names"][idx]
                dst = os.path.join(OUT, name + ".jpg")
                img.crop(box).save(dst, "JPEG", quality=95)
                print(f"  {name}: {box[2]-box[0]}x{box[3]-box[1]}")
                idx += 1
    print("Done.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
