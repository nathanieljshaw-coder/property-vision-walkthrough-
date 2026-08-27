#!/bin/bash
# Regenerates the 30-second portfolio walkthrough videos at 4K (3840×2160)
# using AI-upscaled source photos (Real-ESRGAN x4, .freebuff/upscaled-8k).
# Structure: ONE drone reveal at the start (14.8s — camera starts tight on
# the property and pulls back to the full wide shot with a gentle orbit
# rotation), then each part of the property shown ONCE as a gentle slow
# push-in (2 × 8.0s, zoom 1.0x → 1.18x) so the drone feel carries through.
# 3 shots with 0.4s crossfades = exactly 30.0s.
#
# Sources are the true 8K (7680×4320) upscales; zoom shots pre-scale to
# 5760×3240 (1.5x of output) so even the tightest crop samples ≥3840px wide.
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

SRC="$ROOT/.freebuff/upscaled-8k"
OUT="$ROOT/public/walkthroughs"
mkdir -p "$OUT"

FPS=30
XFADE=0.4
FRAMES1=444        # 14.8s drone reveal
FRAMES2=240        # 8.0s push-in views
# xfade offsets: 14.8-0.4=14.4, then (14.8+8.0)-0.8=22.0  (3 shots -> 30.0s)
O1=14.4
O2=22.0

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

# build_reveal <image> <out.mp4> — the opening DRONE REVEAL, 3840x2160@30fps.
# Starts zoomed in (1.45x) on the property and pulls back to the full frame
# while rotating slightly (a drone backing away and circling). Centred.
build_reveal() {
  local img="$1" out="$2" last=$((FRAMES1 - 1))
  "$FFMPEG" -y -i "$img" \
    -vf "scale=5760:3240:flags=lanczos,zoompan=z='1.45-0.45*on/$last':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=$FRAMES1:s=3840x2160:fps=30,rotate=angle='(PI/180)*(-1.2+2.0*n/$last)':ow=iw:oh=ih:c=black,scale=4032:2268:flags=lanczos,crop=3840:2160,unsharp=5:5:0.5:5:5:0.0" \
    -frames:v "$FRAMES1" -c:v libx264 -preset faster -crf 18 -pix_fmt yuv420p -an \
    "$out" -loglevel error
}

# build_push <image> <out.mp4> — one GENTLE SLOW PUSH-IN, 3840x2160@30fps.
# Slow zoom 1.0x → 1.18x over the shot (a drone gliding into the space),
# centred. Same zoompan headroom pre-scale as the reveal.
build_push() {
  local img="$1" out="$2" last=$((FRAMES2 - 1))
  "$FFMPEG" -y -i "$img" \
    -vf "scale=5760:3240:flags=lanczos,zoompan=z='1.0+0.18*on/$last':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=$FRAMES2:s=3840x2160:fps=30,unsharp=5:5:0.5:5:5:0.0" \
    -frames:v "$FRAMES2" -c:v libx264 -preset faster -crf 18 -pix_fmt yuv420p -an \
    "$out" -loglevel error
}

for spec in "${PROJECTS[@]}"; do
  IFS=':' read -r slug hero a1 a2 <<< "$spec"
  if [ -n "$ONLY" ] && [ "$ONLY" != "$slug" ]; then continue; fi
  tmp="$OUT/.$slug"
  mkdir -p "$tmp"
  echo "== $slug =="

  build_reveal  "$SRC/$hero.jpg" "$tmp/0.mp4"
  build_push    "$SRC/$a1.jpg"   "$tmp/1.mp4"
  build_push    "$SRC/$a2.jpg"   "$tmp/2.mp4"

  "$FFMPEG" -y -i "$tmp/0.mp4" -i "$tmp/1.mp4" -i "$tmp/2.mp4" \
    -filter_complex "
      [0:v][1:v]xfade=transition=fade:duration=$XFADE:offset=$O1[v01];
      [v01][2:v]xfade=transition=fade:duration=$XFADE:offset=$O2[vout]
    " \
    -map "[vout]" -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p \
    -movflags +faststart -an "$OUT/$slug.mp4" -loglevel error

  rm -rf "$tmp"
  echo "  -> $OUT/$slug.mp4"
done
echo "Done."
