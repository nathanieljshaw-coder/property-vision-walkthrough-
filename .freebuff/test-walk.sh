#!/bin/bash
# Test: animated-perpective "walk into the room" on one photo.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FF="$ROOT/node_modules/ffmpeg-static/ffmpeg"
IMG="$ROOT/.freebuff/villa-rooms-4k/living-room-fireplace.jpg"
LAST=189   # 6.3s at 30fps

# Pre-scale to 4K canvas up-front (fast), THEN run the perspective+zoom anim.
# sense=destination: we say where the SOURCE corners go in the DESTINATION.
# Animate the corners OUTWARD (and the whole quad toward the frame edges a
# touch) so near geometry appears to come at the camera; combine with a
# forward zoom for the walking push.
"$FF" -y -i "$IMG" \
  -vf "scale=4608:2592:flags=lanczos:force_original_aspect_ratio=increase,crop=4608:2592,scale=3840:2160:flags=lanczos,\
perspective=sense=destination:eval=frame:x0='0':y0='(H*0.03)*n/$LAST':x1='W':y1='(H*0.03)*n/$LAST':x2='0':y2='H-(H*0.03)*n/$LAST':x3='W':y3='H-(H*0.03)*n/$LAST',\
zoompan=z='1.0+0.16*on/$LAST':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=190:s=3840x2160:fps=30,unsharp=5:5:0.4:5:5:0.0" \
  -frames:v 190 -c:v libx264 -preset faster -crf 18 -pix_fmt yuv420p -an \
  "$ROOT/.freebuff/walk-test.mp4" -loglevel error

echo "done -> .freebuff/walk-test.mp4"
