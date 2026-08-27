#!/bin/bash
# Generates the 3-minute (180.0s) 4K "full villa" montage for Villa Sereno.
#
# Structure: opening DRONE REVEAL on the exterior (14.8s, from the 8K hero),
# then all 28 rooms in walkthrough order, each 6.3s rendered as a TRUE 2.5D
# PARALLAX WALK-IN (.freebuff/parallax-render.py): MiDaS depth warps each
# photo per-frame so near objects glide past faster than the background —
# the camera walks INTO the room, not a flat zoom. 0.4s crossfades.
# Total = 14.8 + 28*6.3 - 28*0.4 = 180.0s exactly.
#
# Room sources are the Real-ESRGAN x4 upscales (.freebuff/villa-rooms-4k);
# they get pre-scaled to 4608x2592 (1.2x of output) so the tightest zoom
# still samples >=3840px wide, then finished at 3840x2160 with unsharp.
#
# Usage: ./.freebuff/generate-villa-montage.sh
# Output: public/walkthroughs/villa-sereno-full.mp4
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FFMPEG="$ROOT/node_modules/ffmpeg-static/ffmpeg"
if [ ! -x "$FFMPEG" ]; then
  FFMPEG="$(command -v ffmpeg || true)"
fi
if [ -z "$FFMPEG" ]; then
  echo "ffmpeg not found." >&2
  exit 1
fi

ROOMS8K="$ROOT/.freebuff/upscaled-8k"
ROOMS="$ROOT/.freebuff/villa-rooms-4k"
OUT="$ROOT/public/walkthroughs"
mkdir -p "$OUT"
TMP="$OUT/.villa-full"
mkdir -p "$TMP"   # NOTE: do NOT wipe — clips are resumable across runs

FPS=30
XFADE=0.4
REVEAL_FRAMES=444        # 14.8s drone reveal
ROOM_FRAMES=189          # 6.3s per room

# Walkthrough order: exterior -> living -> kitchens/dining -> bars ->
# bedrooms -> bathrooms -> wardrobe -> libraries -> amenities -> close.
ROOM_ORDER=(
  living-room-fireplace
  rustic-kitchen
  modern-kitchen
  formal-dining
  wet-bar
  wine-cellar
  games-room
  single-bedroom
  double-bedroom
  twin-bedroom
  queen-bedroom
  king-bedroom
  master-bedroom
  kids-bunk-bedroom
  bathroom-tub
  bathroom-shower
  walk-in-wardrobe
  private-library
  two-story-library
  indoor-pool
  home-gym
  basketball-court
  home-theater
  sauna-steam
  massage-room
  hot-tub-grotto
  yoga-room
  living-room-wide
)

# build_walk <image> <out.mp4>  — one 6.3s 2.5D parallax walk-in at 4K.
build_walk() {
  "$ROOT/.freebuff/venv/bin/python" "$ROOT/.freebuff/parallax-render.py" "$1" "$2"
}

echo "== drone reveal (exterior) =="
if [ -f "$TMP/0.mp4" ]; then
  echo "  exists, skipping"
else
"$FFMPEG" -y -i "$ROOMS8K/villa-sereno-hero.jpg" \
  -vf "scale=5760:3240:flags=lanczos,zoompan=z='1.45-0.45*on/$((REVEAL_FRAMES-1))':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=$REVEAL_FRAMES:s=3840x2160:fps=30,rotate=angle='(PI/180)*(-1.2+2.0*n/$((REVEAL_FRAMES-1)))':ow=iw:oh=ih:c=black,scale=4032:2268:flags=lanczos,crop=3840:2160,unsharp=5:5:0.5:5:5:0.0" \
  -frames:v "$REVEAL_FRAMES" -c:v libx264 -preset faster -crf 18 -pix_fmt yuv420p -an \
  "$TMP/0.mp4" -loglevel error
fi

i=1
for room in "${ROOM_ORDER[@]}"; do
  if [ -f "$TMP/$i.mp4" ]; then
    echo "== $room exists, skipping =="
  else
    echo "== $room (parallax walk-in) =="
    build_walk "$ROOMS/$room.jpg" "$TMP/$i.mp4"
  fi
  i=$((i + 1))
done

echo "== concat with crossfades =="
# offsets: O1=14.4, then +5.9 each (6.3 - 0.4)
INPUTS=()
FILTERS=()
PREV="[0:v]"
OFF=14.4
for i in $(seq 1 28); do
  INPUTS+=(-i "$TMP/$i.mp4")
  CUR="[v$i]"
  FILTERS+=("$PREV[$i:v]xfade=transition=fade:duration=$XFADE:offset=$OFF$CUR")
  PREV="$CUR"
  OFF=$(python3 -c "print(f'{$OFF + 5.9:.2f}')")
done
FILTERS+=("$PREV"trim=duration=180.0[vout])
FC="$(IFS=';'; echo "${FILTERS[*]}")"

"$FFMPEG" -y -i "$TMP/0.mp4" "${INPUTS[@]}" \
  -filter_complex "$FC" \
  -map "[vout]" -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p \
  -movflags +faststart -an "$OUT/villa-sereno-full.mp4" -loglevel error

rm -rf "$TMP"
echo "Done -> $OUT/villa-sereno-full.mp4"
