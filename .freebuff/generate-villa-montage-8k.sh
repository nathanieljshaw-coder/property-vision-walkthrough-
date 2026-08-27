#!/bin/bash
# Generates the ~1:50 (110s) 4K "full villa" montage for Villa Sereno.
#
# Structure: opening DRONE REVEAL on the exterior (8s, from the 8K hero),
# then all 28 rooms in walkthrough order, each 4.4s rendered as a TRUE 2.5D
# PARALLAX WALK-IN (.freebuff/parallax-render.py): MiDaS depth warps each
# photo per-frame so near objects glide past faster than the background —
# the camera walks INTO the room, not a flat zoom. 0.5s crossfades.
# Total = 8 + 28*4.4 - 28*0.5 = 8 + 123.2 - 14 = 117.2s (trim to 110s).
#
# Usage: ./.freebuff/generate-villa-montage-8k.sh
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

ROOMS="$ROOT/.freebuff/villa-rooms-4k"
OUT="$ROOT/public/walkthroughs"
mkdir -p "$OUT"
TMP="$OUT/.villa-full-4k"
mkdir -p "$TMP"   # NOTE: do NOT wipe — clips are resumable across runs

FPS=30
XFADE=0.5
REVEAL_FRAMES=240        # 8s drone reveal at 30fps
ROOM_FRAMES=132          # 4.4s per room at 30fps
TOTAL_DURATION=110.0     # 1:50 target

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

# build_walk <image> <out.mp4>  — one 4.4s 2.5D parallax walk-in at 4K.
build_walk() {
  "$ROOT/.freebuff/venv/bin/python" "$ROOT/.freebuff/parallax-render.py" "$1" "$2"
}

echo "== drone reveal (exterior) at 4K =="
if [ -f "$TMP/0.mp4" ]; then
  echo "  exists, skipping"
else
  "$FFMPEG" -y -i "$ROOMS/../upscaled-8k/villa-sereno-hero.jpg" \
  -vf "scale=5760:3240:flags=lanczos,zoompan=z='1.45-0.45*on/$((REVEAL_FRAMES-1))':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=$REVEAL_FRAMES:s=3840x2160:fps=30,rotate=angle='(PI/180)*(-0.8+1.6*n/$((REVEAL_FRAMES-1)))':ow=iw:oh=ih:c=black,scale=4032:2268:flags=lanczos,crop=3840:2160,unsharp=5:5:0.3:5:5:0.0" \
  -frames:v "$REVEAL_FRAMES" -c:v libx264 -preset faster -crf 16 -pix_fmt yuv420p -an \
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

echo "== concat with crossfades at 4K =="
# offsets: O1=7.5 (reveal 8s - 0.5 crossfade), then +3.9 each (4.4 - 0.5)
INPUTS=()
FILTERS=()
PREV="[0:v]"
OFF=7.5
for i in $(seq 1 28); do
  INPUTS+=(-i "$TMP/$i.mp4")
  CUR="[v$i]"
  FILTERS+=("$PREV[$i:v]xfade=transition=fade:duration=$XFADE:offset=$OFF$CUR")
  PREV="$CUR"
  OFF=$(python3 -c "print(f'{$OFF + 3.9:.2f}')")
done
FILTERS+=("$PREV"trim=duration=$TOTAL_DURATION[vout])
FC="$(IFS=';'; echo "${FILTERS[*]}")"

"$FFMPEG" -y -i "$TMP/0.mp4" "${INPUTS[@]}" \
  -filter_complex "$FC" \
  -map "[vout]" -c:v libx264 -preset slower -crf 16 -pix_fmt yuv420p \
  -movflags +faststart -an "$OUT/villa-sereno-full.mp4" -loglevel error

rm -rf "$TMP"
echo "Done -> $OUT/villa-sereno-full.mp4"
