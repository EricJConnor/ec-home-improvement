# ec-homes.com — project brief

Flagship website for EC Home Improvement, Eric Connor's contracting business (Philadelphia suburbs).
Eric is the owner and the decision-maker. Work at his direction: propose, then wait for his go before
building anything he hasn't asked for. He reviews on desktop and phone.

## What exists

`reference/index.html` (saved from the block at the bottom of this message) is the approved landing page,
built and reviewed in chat. It is the design source of truth — the type, palette, spacing, section order
and copy are all locked. Port it faithfully into the framework; do not redesign it.

## Stack

- Next.js (App Router), plain CSS (CSS modules or a global stylesheet). No Tailwind, no component
  libraries, no template kits — this site must not look like anything off a shelf.
- GitHub repo → Vercel auto-deploy. Every change gets a preview URL Eric can open on his phone.
- Form submissions email `eric@ec-homes.com` (Resend via a route handler; Formspree is an acceptable
  fallback). Show a plain confirmation state after send.
- Fonts: Bricolage Grotesque via `next/font/google` (opsz 12–96, wght 200–600). Self-hosted, no CDN link.

## Design system (from the reference — reuse, don't reinvent)

- Palette: ink `#141414`, plaster `#ECEBE7`, paper `#F3F2EF`, mute `#9C9B97`, hairlines at 14% white
  on dark / 16% ink on light. No accent color — the photos and footage carry all the color.
- Type: one family. Display at weight 300, tracking -0.035em, `font-variation-settings: 'opsz' 96`.
  Headlines huge with a lot of air; body small and grey; paragraphs pushed to the right column.
- Register: calm, editorial, expensive. Reference sites Eric loves: bywater.group, magonsistemi.it.
  Hairline rules, full-bleed imagery, one idea per screen. No cards, no icons, no eyebrow labels,
  no numbered markers, no fade-in-on-scroll on every element.
- Motion budget: one orchestrated moment per page. On the landing that's the pinned hero (footage
  darkens to ink) and the pinned horizontal strip. Everything else scrolls normally.

## Landing page — remaining wiring (not design)

1. **Hero video.** Download the Pexels clip (`https://www.pexels.com/download/video/37165639/`,
   "Philadelphia skyline at dusk with pastel sky"). Compress with ffmpeg to 1920×1080 H.264
   (~4–6 MB, `-crf 26 -movflags +faststart`) plus a WebM, and a poster JPEG from the first frame.
   Put them in `/public/video/`. Never hotlink Pexels in production.
2. **Form** → email as above.
3. **Photos**: the shed and grey-door panels are 640px files. When Eric provides originals, swap them.
   The peony FlexMarble photo shows a "…nya Design" sign in a doorway — clean it when a full-res
   version arrives. Skip every `.WEBP` in his photo archive; those are watermarked MLS listing shots.

## Interior pages — build ONE first, get approval, then template the rest

Order: Kitchens first (best photos), then Bathrooms, Statement Walls, Outdoors, Painting, Agents.

Interior page pattern (propose, then build after Eric's go):
- Full-bleed hero photo, page name huge at bottom-left, one-line description right (same caption
  treatment as the strip panels).
- Short intro: one big statement line + one small paragraph in the right column.
- Editorial gallery: mixed-size grid, hairline gaps, captions in small grey type. Real photos only.
- The 3D moment lives on interior pages, not the landing. Eric's idea: rotating "globes" of project
  photos (react-three-fiber). Build it as a component once, after Kitchens is approved, and only
  where it earns its place. Restraint over gimmick.
- Close with the contact band (phone huge, email, form link) and the service-area line.

Page-specific content already decided:
- **Statement Walls**: covers two products. FlexMarble = real crushed marble on a flexible backing,
  supplier can print any image into it — the "nobody else here does this" product. SPC = rigid
  stone-composite panels, fully waterproof, marble/stone/wood looks, no grout — showers, kitchens,
  full feature walls. SPC is common; the custom-print claim belongs to FlexMarble only.
- **Agents**: no agent or brokerage names. Position as years of experience working with agents and
  investors: pre-sale prep, walkthroughs with agents and buyers, renovating new purchases.
- **Restaurants** is not a page. The Yankee Chipper buildout (Eric owned it and built it himself —
  booths, bar, framing to finish) is proof in the "How we work" manifesto, and its photos can appear
  in galleries as evidence of scope.
- Service area line, verbatim: Philadelphia, Bucks County, Montgomery County, Delaware County,
  New Hope, Doylestown and the surrounding areas.
- Contact: 215 902 6636 · eric@ec-homes.com. CTA is "Book a walkthrough."

## Working rules

- Don't describe results in prose and deliver template-grade code. Match the reference's quality.
- Don't build the whole site blind. One page → preview URL → Eric's feedback → next page.
- When something's unclear, ask Eric one plain question. Don't hand him research or errands.
- Photos: prefer originals from Eric's phone over anything under 1500px for full-bleed use.
