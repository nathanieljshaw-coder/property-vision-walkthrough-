#!/bin/bash
# Regenerates the 30-second portfolio walkthrough videos from each place's
# existing photos (hero + two angle shots). Camera style: COMPLETELY STILL —
# every shot is a fixed, locked-off view (no bob, no sway, no pan, no zoom);
# the tour moves between spaces purely through crossfades. Each place gets
# 8 static views: 2 exterior (wide centre, right) + 3 views of interior 1
# (centre, left detail, right detail) + 3 views of interior 2 (centre, left
# detail, right detail). 8 shots x 4.1s with 0.4s crossfades = exactly 30.0s.
# Requires ffmpeg — vendored via the ffmpeg-static dev dependency.
#
# Usage: ./.freebuff/generate-walkthroughs.sh [slug]   (optional: one place only)
# Output: public/walkthroughs/<slug>.mp4  (referenced by src/content/portfolio.ts)
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

SRC="$ROOT/src/assets/portfolio"
OUT="$ROOT/public/walkthroughs"
mkdir -p "$OUT"

FPS=30
FRAMES=123        # 4.1s per shot at 30fps
XFADE=0.4         # crossfade duration (s)
LAST=$((FRAMES - 1))
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

# build_shot <image> <view> <out.mp4> — one LOCKED-OFF static view, 1280x720@30fps.
# The camera does not move at all: zoom and x/y offsets are constants, so the
# frame is identical for the whole shot. zoompan is still used (not plain crop)
# so every shot flows through the same 2560x1440 -> 1280x720 pipeline.
build_shot() {
  local img="$1" view="$2" out="$3" zp
  case "$view" in
    # wide centre framing
    centre)  zp="zoompan=z='1.15':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1280x720:fps=$FPS" ;;
    # close-up on the LEFT region of the frame
    left)    zp="zoompan=z='1.35':x='0':y='ih/2-(ih/zoom/2)':d=1:s=1280x720:fps=$FPS" ;;
    # close-up on the RIGHT region of the frame
    right)   zp="zoompan=z='1.35':x='iw-iw/zoom':y='ih/2-(ih/zoom/2)':d=1:s=1280x720:fps=$FPS" ;;
    *) echo "unknown view: $view" >&2; exit 1 ;;
  esac
  "$FFMPEG" -y -loop 1 -i "$img" \
    -vf "scale=2560:1440:force_original_aspect_ratio=increase,crop=2560:1440,$zp" \
    -frames:v "$FRAMES" -c:v libx264 -preset faster -crf 23 -pix_fmt yuv420p -an \
    "$out" -loglevel error
}

for spec in "${PROJECTS[@]}"; do
  IFS=':' read -r slug hero a1 a2 <<< "$spec"
  if [ -n "$ONLY" ] && [ "$ONLY" != "$slug" ]; then continue; fi
  tmp="$OUT/.$slug"
  mkdir -p "$tmp"
  echo "== $slug =="

  # 30s tour, camera still: exterior wide -> exterior right -> interior 1
  # centre/left/right -> interior 2 centre/left/right, crossfading between
  # each locked-off view.
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
    -map "[vout]" -c:v libx264 -preset faster -crf 23 -pix_fmt yuv420p \
    -movflags +faststart -an "$OUT/$slug.mp4" -loglevel error

  rm -rf "$tmp"
  echo "  -> $OUT/$slug.mp4"
done
echo "Done."
