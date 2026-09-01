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

- **All 39 are cleared.** Eric confirmed with the agent that every watermarked photo is of a
  **painting** job he did, and the agent sent them to him for his use. He has also said explicitly
  to leave the watermark visible. Use them; still never edit the watermark out.
- Because they are painting work, they are filed under **Painting** in the gallery — the room in the
  photo is not the job. Do not refile an MLS kitchen shot under Kitchens; that would imply he built it.

The copies in the zip are downscales. When a permission comes in, ask for the photographer's
original — those run 2000-3000px and would be the first genuinely full-bleed-capable photos in the
project. Going forward Eric was advised to put a portfolio clause in his contracts so future jobs
are his to shoot and publish.

## Our work (`/work`)

Eric reviewed a chaptered gallery of large plates and rejected it: the photos were too big, the
sections unwanted, and he did not want the black kitchen reading as the headline. What he asked for
was "a general Our Work, and below small concise snapshots into our world", and he returned to his
original idea of a rotating globe.

**He was right and an earlier objection of mine was wrong.** I had argued against the globe because
640px photos on moving geometry turn to mush — but that assumed large. At ~120px on a sphere those
files are oversampled and genuinely crisp. The globe also settles three of his complaints
structurally: every photo is small, there are no sections, and nothing is the "main" thing.

- **137 tiles**, square-cropped to 320px, spread by Fibonacci distribution so the sphere is even
  rather than banded. Kitchens 39, Painting 28, Bathrooms 27, Commercial 26, Outdoors 15, Walls 2 —
  deliberately wide so no single project carries it.
- **Density, brightness and scale are the whole design.** The first build had 93 tiles at 74%
  brightness fading from z=0.36 inward, and Eric's verdict was that you couldn't see anything — it
  read as a dark ball with specks on it, and he was right. Tiles are now near full brightness and
  opaque across the visible face, fading only in the last sliver at the rim, with the camera pulled
  in to 2.42 so the sphere fills the frame. If this ever looks weak again, the fix is more tiles and
  more light, not smaller ones.
- Turns on its own, drag to spin with inertia, hover names the photo underneath, click opens a
  closer look **capped so it never upscales past native** — a smaller sharp image beats a big soft one.
- **Only the front hemisphere draws.** Tangent tiles seen from behind read as grey rectangles and
  clutter the sphere; culling them is what makes it read as a globe.
- **CSS 3D transforms, not WebGL, and this is deliberate.** A WebGL build created a context, hid
  the fallback grid on the strength of that, and then drew nothing inside the artifact sandbox —
  Eric saw a completely blank page. There is no equivalent silent failure here: if the browser can
  transform a div it can draw this. The tiles are ordinary `<img>` elements, hover and click are
  native rather than raycast, and `backface-visibility:hidden` culls the far side for free.
  **Do not port this back to WebGL.**
- Only the parent `.sphere` transform changes per frame; each tile's transform is set once on
  layout, so the browser composites the whole `preserve-3d` subtree on the GPU and 137 photographs
  cost about the same as one.
- Without `.live` (script not run) or without `preserve-3d` support, the same tiles fall back to a
  plain scrolling grid of snapshots — the same idea, minus the sphere.
- **Clicking is paired manually, and must stay that way.** The sphere never stops turning, so a
  press and a release land on different tiles and the browser fires `click` on their common
  ancestor rather than on either photo — a per-tile click listener simply never runs. `pointerdown`
  records the tile under the cursor and `pointerup` opens it, gated on movement and elapsed time so
  a drag doesn't open anything. Note this is invisible to synthetic events dispatched straight at a
  tile, which is how it passed testing while being broken for Eric.
- Rotation slows to about an eighth while a tile is hovered, and the caption is held for half a
  second after `mouseleave`. Without both, tiles slide out from under the cursor and the name
  flickers on and off.

### The background field

Eric asked for "something happening in the full page background, like that gear thing from the CNC
site, just to give it some depth and colour contrast." It is his own FlexMarble peony wall
(`p4085`), blurred to 58px, saturated and darkened under a radial scrim, drifting on a 54s
animation and leaning against the cursor.

- **Blur less than you think.** At 90px the teal and the gold average into a flat olive. It now sits
  at 30px, with a second, more heavily blurred plate (`p4082`) counter-moving behind it on `screen`
  blend. The counter-motion between the two plates is what reads as depth — one drifting layer just
  reads as a static wash.

### Pulling a photograph off the globe

Eric on the first closer look: "a very static image that looks like it was just slapped in there."
It now flies. The overlay image starts at the exact rect, scale and lean of the tile that was
clicked — computed from that tile's live `getBoundingClientRect()` and its offset from the sphere's
centre — and transitions to the middle; closing sends it back to wherever that tile has turned to
by then.

- The backdrop is `backdrop-filter: blur(15px)` over a light scrim, **not** an opaque black. The
  globe keeps turning and the colour field stays visible behind, which is what he asked for.
- The full-size file is prefetched on `mouseenter`. Without it the flight cannot start until the
  image arrives, and the first frame has no size to measure from.
- Measure only once `ovImg.complete && naturalWidth` — measuring an undecoded image gives a zero
  rect and the flight silently does nothing.
- The globe originally had its own `.vignette` over the top. A radial gradient inside a rectangular
  element draws a hard-edged box across the field — it was removed, and the field supplies the
  depth instead. Don't reintroduce it.

`public/full/` holds the full-size images the closer look opens. The depth-displacement shader Eric
liked (strength 50) is **not** on this page — the globe is the moment now. It is still worth
offering for the closer look if he wants the effect back.

### Corrections worth keeping

- `IMG_2379-2383` and `IMG_2616-2623` are a **kitchen remodel**, not painting. Eric corrected this
  after I inferred it from "all the watermark pics are painting jobs".
- Do not re-add chapters, do not enlarge the tiles, and do not reintroduce a hero photograph — each
  was explicitly rejected.

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
