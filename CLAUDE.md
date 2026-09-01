# ec-homes.com — project brief

Flagship website for EC Home Improvement, Eric Connor's contracting business (Philadelphia suburbs).
Eric is the owner and the decision-maker. Work at his direction: propose, then wait for his go before
building anything he hasn't asked for. He reviews on desktop and phone.

## What exists

`reference/index.html` is the originally approved landing page. The palette, type, section order and
copy from it are still locked and still the source of truth.

**The work section was reworked at Eric's direction after he reviewed it (see "The reel" below), so
`reference/index.html` no longer matches the built site there. The Next.js app is authoritative.**

## The reel (the work section)

Eric's note on the first review: the photos were "too in your face" on a laptop, and the horizontal
scroll only moved if you swiped it yourself on a phone. Both are fixed, and the reasoning matters
more than the CSS:

- His photos are close-range job documentation, not editorial compositions with negative space in
  them. Run full-bleed at 86vw x 100vh they read as surface pressed against the glass, and the
  portrait originals had to be cropped to a narrow landscape band to fit.
- So each photo is now a **plate**: a framed image sitting in the ink ground with real air around it,
  caption below it rather than over it, no scrim. The ink is the page; the photo is an object on it.
- Displaying a 640px file at roughly half the previous size also renders it sharper. Smaller reads
  more expensive — do not "fix" this by making the plates bigger again.
- The FlexMarble plate is landscape (4:3) because its source is; the rest are 3:4. Alternate plates
  sit slightly low so the hang reads composed rather than gridded.
- Plate size is capped by viewport **height** as well as width (`min(30vw,46vh)`), because sizing off
  width alone let a 3:4 plate push its caption past the pinned area on a short laptop screen, where
  `overflow:hidden` clipped it. It reproduced at 1512x700 on all four portrait panels. Keep the vh term.
- The reel pins and travels on scroll **on every viewport now, phones included**. It is scroll-linked,
  not a timed carousel — the visitor sets the pace. Plates parallax inside their frames as they pass.

## The second half

Eric's second note: past the reel the page went "all kind of one note." It was three consecutive ink
sections with the same shape — big headline left, small grey paragraph right, a grid of small text
blocks — and no photography at all after FlexMarble. Fixed structurally, not with fade-ins (his brief
rules those out and they would have made identical blocks more identical):

- **Ground rhythm.** Agents moved to the plaster ground, so the page now alternates
  ink → light → ink → light → ink instead of running three darks together.
- **The manifesto carries its proof.** Rows of claim + photo, alternating sides. Plates cap at 380px
  so the 640px sources stay near native.
  **Eric cut "No sales layer" and "We're not the cheapest" — do not reinstate them.** Two rows remain:
  "If it doesn't exist, we build it" (the finished Yankee Chipper booth) and "Done means done" (a
  finished shower — deliberately not a second restaurant shot, so two rows don't read as one job).
  Show **finished** work here. Eric rejected an in-progress booth photo: the archive has better
  finished ones, and process shots undercut the claim.
- **The full-bleed band.** One image between FlexMarble and the manifesto, edge to edge. It works at
  that size *because* it is treated as ground, not subject: brightness .58, a veil, and the hero's
  grain over it, so the upscaling is invisible. Do not brighten it to "show the photo better" — that
  is what makes a 640px file look cheap. It drifts slowly against the scroll.
  The photo is `IMG_3222`, the level, straight-on frame of the hex backsplash. An earlier pick
  (`IMG_3181`) was the same kitchen shot on a tilt and Eric spotted it immediately — at full width a
  crooked horizon is unmissable. Only **12** non-WEBP landscape photos exist in the archive and six
  of those are watermarked MLS shots, so the pool for this band is very small until Eric supplies
  originals.
- **The hairlines draw.** Rules are the site's signature, so they carry the motion between sections:
  one left-to-right sweep on entry via IntersectionObserver, then they stay. The contact phone number
  gets a single beat. Nothing else animates on scroll.

`scripts/build-preview.py` renders the running server into one self-contained HTML file (fonts and
photos inlined) for publishing as an Artifact, since there is still no Vercel preview. Generating it
from the live server means the page Eric reviews is the page that ships.

Page behaviour lives in `public/motion.js`, one plain file the app loads with `next/script` and the
standalone preview inlines verbatim, so the two cannot drift.

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

## MLS photography — licensing

39 photos in `contractorpics.zip` are BrightMLS listing shots (all 33 `.WEBP` plus
`IMG_2616-2623.JPG`). Every one has a `bright MLS` watermark burned into the bottom-left.
They are the sharpest images in the archive — five at 1344x896 — and mostly landscape, which the
rest of the archive badly lacks.

Eric did not shoot these and does not own them: copyright sits with the listing photographer or
brokerage. Having built the work confers no rights in a photograph of it, and the homeowner, not
the contractor, controls access to the finished space. **Do not use any of them without permission,
and never strip or obscure the watermark.**

- **Cleared:** Eric obtained verbal permission by phone for the painted-brick rowhouse set
  (`IMG_2624-2636`). `IMG_2630` is now the Painting panel. He was asked to get it in writing.
- **Not cleared:** the white-kitchen set (`IMG_2379-2383`, `IMG_2616-2623`) and the green-wall set
  (`IMG_2637-2651`). Leave them alone until he says otherwise.

The copies in the zip are downscales. When a permission comes in, ask for the photographer's
original — those run 2000-3000px and would be the first genuinely full-bleed-capable photos in the
project. Going forward Eric was advised to put a portfolio clause in his contracts so future jobs
are his to shoot and publish.

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
