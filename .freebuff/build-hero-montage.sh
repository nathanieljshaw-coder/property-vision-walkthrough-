#!/bin/bash
# Builds the home-page hero background montage: all six 4K (3840×2160)
# portfolio walkthroughs stitched into one looping video with crossfades
# (6 × 30s − 5 × 0.4s fades = ~178s). Referenced from src/routes/index.tsx
# as /walkthroughs/hero-montage.mp4.
# Requires ffmpeg — vendored via the ffmpeg-static dev dependency.
#
# Usage: ./.freebuff/build-hero-montage.sh
# Output: public/walkthroughs/hero-montage.mp4
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

WT="$ROOT/public/walkthroughs"
OUT="$WT/hero-montage.mp4"
TMP="$WT/.hero-montage.new.mp4"

XFADE=0.4
# xfade offsets: n * (shot length - fade) = n * 29.6  (6 shots -> 178.0s)
O1=29.6
O2=59.2
O3=88.8
O4=118.4
O5=148.0

echo "== hero montage (4K) =="
"$FFMPEG" -y \
  -i "$WT/villa-sereno.mp4" \
  -i "$WT/grand-alpine.mp4" \
  -i "$WT/pine-valley.mp4" \
  -i "$WT/aura-dining.mp4" \
  -i "$WT/cotswold-haven.mp4" \
  -i "$WT/apex-estate.mp4" \
  -filter_complex "
    [0:v][1:v]xfade=transition=fade:duration=$XFADE:offset=$O1[v01];
    [v01][2:v]xfade=transition=fade:duration=$XFADE:offset=$O2[v02];
    [v02][3:v]xfade=transition=fade:duration=$XFADE:offset=$O3[v03];
    [v03][4:v]xfade=transition=fade:duration=$XFADE:offset=$O4[v04];
    [v04][5:v]xfade=transition=fade:duration=$XFADE:offset=$O5[vout];
    [vout]unsharp=5:5:0.6:5:5:0.0[vfinal]
  " \
  -map "[vfinal]" -c:v libx264 -preset veryfast -crf 27 -pix_fmt yuv420p \
  -movflags +faststart -an "$TMP" -loglevel error
mv -f "$TMP" "$OUT"
echo "  -> $OUT"
