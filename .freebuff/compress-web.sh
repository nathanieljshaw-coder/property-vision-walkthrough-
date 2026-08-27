#!/bin/bash
# Compress the two large owner CapCut walkthroughs for web deployment.
# Originals stay in place; compressed copies are written to new filenames.
# Target ~10-12 Mbps 4K H.264, faststart for streaming.
set -e
cd "$(dirname "$0")/.."
FF="node_modules/ffmpeg-static/ffmpeg"

compress() {
  local src="$1" dst="$2"
  if [ -f "$dst" ]; then
    echo "SKIP $dst (exists)"
    return
  fi
  echo "COMPRESS $src -> $dst"
  "$FF" -y -i "$src" \
    -c:v libx264 -preset medium -crf 26 -maxrate 12M -bufsize 24M \
    -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart \
    "$dst"
  echo "DONE $dst"
}

compress public/walkthroughs/villa-sereno-full.mp4 public/walkthroughs/villa-sereno-full-web.mp4
compress public/walkthroughs/aura-dining-full.mp4 public/walkthroughs/aura-dining-full-web.mp4
echo "ALL DONE"
