#!/bin/bash
# Regenerates the 30-second portfolio walkthrough videos at TRUE 8K (3840×2160)
# using AI-upscaled source photos (Real-ESRGAN x4). Camera style: COMPLETELY
# STILL — every shot is a locked-off static view. The tour moves between spaces
# through crossfades. 8 shots × 4.1s with 0.4s crossfades = exactly 30.0s.
#
# Uses crop+scale instead of zoompan for much faster encoding on static content.
# Source images are 3840×2160 from .freebuff/upscaled-8k/.
#
# Usage: ./.freebuff/generate-walkthroughs.sh [slug]   (optional: one place only)
# Output: public/walkthroughs/<slug>.mp4
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FFMPEG="$ROOT/node_modules/ffmpeg-static/ffmpeg"
if [ ! -x "$FFMPEG" ]; then
  FFMPEG="$(command -v ffmpeg || true)"
fi
if [ -z "$FFMPEG" ]; then
  echo "ffmpeg not found. Install it with: cd $ROOT && bun add -d ffmpeg-static" >&2
  exit 1
fi

SRC="$ROOT/.freebuff/upscaled-4k"
OUT="$ROOT/public/walkthroughs"
mkdir -p "$OUT"

FPS=30
FRAMES=123        # 4.1s per shot at 30fps
XFADE=0.4         # crossfade duration (s)
# xfade offsets: n * (shot length - fade) = n * 3.7  (8 shots -> exactly 30.0s)
O1=3.7
O2=7.4
O3=11.1
O4=14.8
O5=18.5
O6=22.2
O7=25.9

# slug:hero:angle1:angle2  (image basenames, without extension)
PROJECTS=(
  "villa-sereno:villa-sereno-hero:villa-sereno-1:villa-sereno-2"
  "grand-alpine:grand-alpine-hero:grand-alpine-1:grand-alpine-2"
  "pine-valley:pine-valley-hero:pine-valley-1:pine-valley-2"
  "aura-dining:aura-dining-hero:aura-dining-1:aura-dining-2"
  "cotswold-haven:cotswold-haven-hero:cotswold-haven-1:cotswold-haven-2"
  "apex-estate:apex-estate-hero:apex-estate-1:apex-estate-2"
)

ONLY="${1:-}"

# build_shot <image> <view> <out.mp4> — one LOCKED-OFF static view, 3840x2160@30fps.
# Uses crop+scale (much faster than zoompan for static content) on the 8K
# AI-upscaled source image. Framing matches the original zoompan parameters:
#   centre → crop 87% of frame (zoom 1.15), centred
#   left   → crop 74% from left edge (zoom 1.35)
#   right  → crop 74% from right edge (zoom 1.35)
build_shot() {
  local img="$1" view="$2" out="$3" crop
  case "$view" in
    centre)  crop="crop=iw/1.15:ih/1.15:(iw-iw/1.15)/2:(ih-ih/1.15)/2" ;;
    left)    crop="crop=iw/1.35:ih/1.35:0:(ih-ih/1.35)/2" ;;
    right)   crop="crop=iw/1.35:ih/1.35:(iw-iw/1.35):(ih-ih/1.35)/2" ;;
    *) echo "unknown view: $view" >&2; exit 1 ;;
  esac
  "$FFMPEG" -y -loop 1 -i "$img" \
    -vf "$crop,scale=3840:2160:flags=lanczos,unsharp=5:5:0.5:5:5:0.0" \
    -frames:v "$FRAMES" -c:v libx264 -preset faster -crf 18 -pix_fmt yuv420p -an \
    "$out" -loglevel error
}

for spec in "${PROJECTS[@]}"; do
  IFS=':' read -r slug hero a1 a2 <<< "$spec"
  if [ -n "$ONLY" ] && [ "$ONLY" != "$slug" ]; then continue; fi
  tmp="$OUT/.$slug"
  mkdir -p "$tmp"
  echo "== $slug =="

  build_shot "$SRC/$hero.jpg" centre "$tmp/0.mp4"
  build_shot "$SRC/$hero.jpg" right  "$tmp/1.mp4"
  build_shot "$SRC/$a1.jpg"   centre "$tmp/2.mp4"
  build_shot "$SRC/$a1.jpg"   left   "$tmp/3.mp4"
  build_shot "$SRC/$a1.jpg"   right  "$tmp/4.mp4"
  build_shot "$SRC/$a2.jpg"   centre "$tmp/5.mp4"
  build_shot "$SRC/$a2.jpg"   left   "$tmp/6.mp4"
  build_shot "$SRC/$a2.jpg"   right  "$tmp/7.mp4"

  "$FFMPEG" -y -i "$tmp/0.mp4" -i "$tmp/1.mp4" -i "$tmp/2.mp4" -i "$tmp/3.mp4" \
    -i "$tmp/4.mp4" -i "$tmp/5.mp4" -i "$tmp/6.mp4" -i "$tmp/7.mp4" \
    -filter_complex "
      [0:v][1:v]xfade=transition=fade:duration=$XFADE:offset=$O1[v01];
      [v01][2:v]xfade=transition=fade:duration=$XFADE:offset=$O2[v02];
      [v02][3:v]xfade=transition=fade:duration=$XFADE:offset=$O3[v03];
      [v03][4:v]xfade=transition=fade:duration=$XFADE:offset=$O4[v04];
      [v04][5:v]xfade=transition=fade:duration=$XFADE:offset=$O5[v05];
      [v05][6:v]xfade=transition=fade:duration=$XFADE:offset=$O6[v06];
      [v06][7:v]xfade=transition=fade:duration=$XFADE:offset=$O7[vout]
    " \
    -map "[vout]" -c:v libx264 -preset faster -crf 18 -pix_fmt yuv420p \
    -movflags +faststart -an "$OUT/$slug.mp4" -loglevel error

  rm -rf "$tmp"
  echo "  -> $OUT/$slug.mp4"
done
echo "Done."
