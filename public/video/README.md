# /public/video

The hero footage. **These files are committed** — Pexels is unreachable from the
build environment, the source came from Eric by hand, and Vercel builds from the
repo, so they cannot be treated as rebuildable artifacts.

    hero.mp4          H.264 1920x1080, 16.9s, ~3.9 MB, +faststart
    hero.webm         VP9, same cut, ~680 KB
    hero-poster.jpg   first frame of the cut
    hero-preview.mp4  720p cut, NOT committed — only for scripts/build-preview.py

Source: "Philadelphia skyline at dusk with pastel sky", Pexels 37165639,
downloaded at Full HD (1920x1080 H.264, 14.85s, 2.2 MB, no audio).

Two things were done to it, both deliberate:

1. **Trimmed to start at 6.4s.** The drone tilts down through the shot: the first
   six seconds are pure sky and the skyline only enters around t=8. Since the hero
   autoplays from zero and loops, most visitors would never have seen Philadelphia
   at all. The cut starts with the city already in frame.
2. **Boomeranged** (forward + reversed) so the loop has no visible cut. A hard loop
   jumped the skyline across the frame; the shot is slow enough that the reverse
   reads as a gentle drift.

The MP4 is a lossless remux of that cut where possible — the source is only
1.2 Mbps, so re-encoding it at the brief's -crf 26 would have thrown away quality
for no size win. `object-position: 50% 62%` in the hero CSS biases the cover-crop
low so the skyline survives on wide, short viewports.

To rebuild from a new source: `./scripts/build-hero-video.sh <file.mp4>`
