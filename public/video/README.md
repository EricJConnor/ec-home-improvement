# /public/video

The hero footage lives here as three files:

    hero.mp4          H.264, 1920x1080, ~4-6 MB, +faststart
    hero.webm         VP9, same framing
    hero-poster.jpg   first frame

They are **not** in git — they're binary and rebuildable. Generate them with:

    ./scripts/build-hero-video.sh                 # downloads from Pexels, then encodes
    ./scripts/build-hero-video.sh ~/hero-src.mp4  # encodes a file you already have

Source: "Philadelphia skyline at dusk with pastel sky",
https://www.pexels.com/download/video/37165639/

Until they exist the hero falls back to the gradient poster behind the video,
which is the reference's own designed fallback — the section still pins and
still darkens to ink on scroll.
