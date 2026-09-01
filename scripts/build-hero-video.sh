#!/usr/bin/env bash
# Builds /public/video from the Pexels source clip.
#
#   "Philadelphia skyline at dusk with pastel sky"
#   https://www.pexels.com/download/video/37165639/
#
# Pexels is blocked by the egress policy on the machine this site was built on,
# so the download is a separate step. Either:
#   ./scripts/build-hero-video.sh                 # downloads, then encodes
#   ./scripts/build-hero-video.sh path/to/src.mp4 # encodes a file you already have
#
# Never hotlink Pexels in production — that's the whole point of this script.
set -euo pipefail

SRC="${1:-}"
OUT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/public/video"
mkdir -p "$OUT"

if [ -z "$SRC" ]; then
  SRC="$(mktemp -t hero-src.XXXXXX).mp4"
  echo "→ downloading source clip"
  curl -fSL --retry 3 -o "$SRC" "https://www.pexels.com/download/video/37165639/"
fi

echo "→ H.264 MP4, 1920x1080"
ffmpeg -y -i "$SRC" -an \
  -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080" \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 26 -preset slow \
  -movflags +faststart "$OUT/hero.mp4"

echo "→ VP9 WebM"
ffmpeg -y -i "$SRC" -an \
  -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080" \
  -c:v libvpx-vp9 -crf 36 -b:v 0 -row-mt 1 "$OUT/hero.webm"

echo "→ poster from the first frame"
ffmpeg -y -i "$SRC" -vframes 1 \
  -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080" \
  -q:v 4 "$OUT/hero-poster.jpg"

ls -lh "$OUT"
echo "Done. Target for hero.mp4 is roughly 4-6 MB — raise -crf if it came out heavier."
