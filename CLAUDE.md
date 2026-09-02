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

Eric has decided not to chase the photographer for originals — it was a while ago, the agent says
it would be a headache, and his position is that if anyone asks he will take them down. That is his
call and it is settled; do not raise it again. The never-strip-the-watermark rule still stands.

The copies in the zip are downscales. If a permission ever comes in, ask for the photographer's
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

- **137 tiles at their true proportions** (long side 320px), spread by Fibonacci distribution so the
  sphere is even rather than banded. Sizes are area-normalised in `layout()` — width `S*sqrt(ar)`,
  height `S/sqrt(ar)` — so a wide photo and a tall one carry the same visual weight. Nothing on
  the page is cropped any more; they were square-cropped until Eric asked for the real shapes. Kitchens 39, Painting 28, Bathrooms 27, Commercial 26, Outdoors 15, Walls 2 —
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

It lives in `app/components/Backdrop.tsx` and is on **both** pages — full strength on `/work`,
`quiet` (half opacity) on the landing, where the footage and the plates already carry colour.
`.strip-pin` on the landing is transparent so the field runs continuously behind the reel instead
of stopping at an opaque black band.

Eric asked for "something happening in the full page background, like that gear thing from the CNC
site, just to give it some depth and colour contrast." It is his own FlexMarble peony wall
(`p4085`), blurred to 58px, saturated and darkened under a radial scrim, drifting on a 54s
animation and leaning against the cursor.

- **Blur less than you think.** At 90px the teal and the gold average into a flat olive. It now sits
  at 30px, with a second, more heavily blurred plate (`p4082`) counter-moving behind it on `screen`
  blend.
- **A blurred wash cannot show movement, and this cost two rounds to learn.** Eric said twice that
  the background had no motion while it was in fact animating the whole time — a heavily blurred
  field has no edges, so there is nothing for the eye to track no matter how far or fast it travels.
  The motion he can actually see comes from `.bg-sweep`: two travelling highlights with a readable
  shape, counter-timed on 23s and 31s. If more movement is ever wanted, add shape, not speed.

### Pulling a photograph off the globe

Eric on the first closer look: "a very static image that looks like it was just slapped in there."
It now flies. The overlay image starts at the exact rect, scale and lean of the tile that was
clicked — computed from that tile's live `getBoundingClientRect()` and its offset from the sphere's
centre — and transitions to the middle; closing sends it back to wherever that tile has turned to
by then.

- The backdrop is `backdrop-filter: blur(8px)` over a 20% scrim, **not** an opaque black. The globe
  keeps turning and the colour field stays readable behind, which is what he asked for.
- **No hard rectangle.** The photo's four edges are feathered evenly by two linear-gradient masks
  intersected with `mask-composite` — a radial feather cuts the corners hard and leaves the sides
  boxy, which was Eric's "blur the boxy lines" note. Behind it sits a `.bloom`: the same image
  blurred to 62px and scaled past the frame, so the photo's own colour spills out and its boundary
  dissolves. Where `mask-composite` is unsupported the layers simply union and the photo shows in
  full, which is a safe way to fail.
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

## The mark

Eric asked for the top-left to be more pronounced — "just want people to know where they are" —
and it was 18px, smaller than the nav links beside it, so it read as incidental. It is now a
lockup: `app/components/Logo.tsx`, then EC at ~25px tight, then the full name below as a 10px
tracked-out label. Same in both footers.

The logo is drawn **from the site's own language rather than dropped on top of it**: the whole
layout is hairline rules, so the mark is one too — an open frame with a plumb line hanging off the
top rail. The plumb bob is the oldest tool on a job site and means true, level, upright; it also
nods to the pendant in Eric's own mark. It is `currentColor`, so it inverts with the header's
difference blend.

**The header blends, and that is the whole look.** `mix-blend-mode: difference` on `.hdr` is what
Eric means by transparency — the sky comes through the type and the mark, and they shift against
whatever is behind them. Three attempts to "fix" its contrast (a page-wide veil, an explicit
light/dark switch, a tinted scrim, stated colours with alpha) all made it read as pasted on, and he
rejected each one. When he says it is getting lost, the answer is a bolder stroke and a larger mark
inside the blend — never solid colour, never a scrim, never a switch. Current: stroke 2, size
`clamp(34px,2.95vw,43px)`.

Eric's original logo (`IMG_1149` in the archive) is his own work and he asked for something
cohesive with the site instead. The open-frame idea came from it; the pendant bells did not
survive, as they read as clip art next to this typography.

## Working rules

- Don't describe results in prose and deliver template-grade code. Match the reference's quality.
- Don't build the whole site blind. One page → preview URL → Eric's feedback → next page.
- When something's unclear, ask Eric one plain question. Don't hand him research or errands.
- Photos: prefer originals from Eric's phone over anything under 1500px for full-bleed use.

## Sharing, search and the business card

`app/site.ts` holds the domain, the phone number, the email and the service areas. Everything
downstream reads from it — metadata, structured data, the sitemap, the vCard and the QR. Change the
domain by setting `NEXT_PUBLIC_SITE_URL` in Vercel, then re-run `python3 scripts/build-qr.py <url>`,
which is the one thing that does not pick it up automatically (the QR is a committed SVG).

- **`public/og.jpg`** is what a texted link looks like. Built by rendering an HTML template through
  headless Chromium so it uses the real Bricolage face and the real hero frame, rather than being
  laid out by hand. Three things, centred: **the lockup, "Work worth coming home to.", and the
  service-area line.** The preview and the page now open on the same sentence. An earlier pass also
  carried the phone number — Eric cut that, and it stays off. Variants are in
  `scratchpad/og/og-b.html` (shipped) and `og-a.html` (without the line); regenerate with
  `shoot2.js`.
- **`app/icon.svg`** is the mark on ink, picked up automatically by Next as the favicon.
- **Structured data** (`app/components/StructuredData.tsx`) states the trade and every area served,
  once, in the form Google expects. It is not a substitute for a Google Business Profile — for a
  local contractor that profile is the bigger lever by far, and it is Eric's to claim.
- **`/card`** is the business card: Eric pulls it up when someone asks for one, they scan the QR,
  land on the same page and tap **Save to contacts** (`/vcard`, served so the URL inside always
  matches the deployed domain). The QR points at the page rather than carrying a vCard directly —
  a URL stays small enough to scan instantly off a phone screen, and it puts the work one tap away
  instead of only dropping a contact in. Verified by decoding it back out of a rendered screenshot,
  not by eye.

Two things that will bite: segno writes the QR with `width`/`height` in module units and **no
viewBox**, so it will not scale — `build-qr.py` rewrites that, and a hand-regenerated QR without it
renders as a 29px speck in the corner of its box. And the contact form returns 503 until
`RESEND_API_KEY` is set in Vercel; it fails visibly with the phone number rather than faking a
success, but no mail reaches Eric until that key exists.

## How we work

Eric said this section's photos were plain next to the rest of the site, and he was right — both
rows were finished results, which is what every other section already shows.

**"If it doesn't exist, we build it"** is the same restaurant booth from bare studs to service — ten
frames: framing, the run across the floor, the first mahogany panel taped, a second up, booth backs
with the floor still covered, the partitions standing, the row finished and the floor clear, the
green banquette, the table and lamp, finished and lit. **This is the only place on the site that
shows process**, which is the whole job of the section. Photos are 480x640: reel at plate size,
never full bleed.

**It keeps its own clock, and that was a correction.** The first version was scroll-linked and Eric
said it did not work — rightly: scroll-driven motion runs at whatever speed the reader scrolls, so a
fast scroll skips the build entirely and a slow one stutters frame to frame. It now advances itself
at 780ms a frame, holds 2.2s on the finished shot so the payoff lands, loops, and stops entirely
while off screen. The slow scale on the showing frame is what separates footage from a slideshow.

**"Done means done"** has no photograph on purpose. It is a promise, not a product, and a picture
beside it turns it into a caption for the picture. Instead the mark's own plumb line is **lowered**: the bob
falls the length of the line, the string pays out with it, it catches at the bottom and wobbles to
true. Lowering a plumb is literally how you check something is upright, so the motion is the
sentence.

It swung rather than dropped at first, and Eric said it did not move at all. It did — but it fired
off the shared `.rule-draw` observer, which triggers as a row's top edge crosses the viewport. On a
row this tall that is several seconds before anyone is looking at it, so the animation had finished
and read as static. It has its own observer now at `threshold: 0.55`, and it **rearms when the row
leaves** so it replays if you scroll back. The fall distance is measured from the container rather
than guessed, so the bob lands on the end of the line at every breakpoint.

Three tiers of type, because with only a heading the row still read as a gap where a photograph had
been: the statement at near-hero scale, then **"The job isn't done until we walk it together."** —
Eric's own line, and the most valuable sentence in the section because it is a specific commitment a
competitor cannot copy without meaning it — then the punch-list detail small beneath. Do not put a
claim in this section that is not actually true of how he works.

Watch the specificity here: `.mani h3` and `.mani p` are more specific than the `.h-xl` utility and
than a bare `.done-lead`, so both were silently overridden and the row stayed at the size of the one
above it. Everything in this row is scoped `.mani-row.done …` for that reason.

Built against the vendored `animate` skill, which caught three things worth remembering: both
progress bars were animating `width` (a layout property) and are now `transform: scaleX`; the
settle used an invented cubic-bezier where a pendulum wants `ease-in-out` per keyframe, since its
angle is sinusoidal.

And one real bug: `motion.js` is a single IIFE, so `var bar` for the sequence and `var bar` for the
reel are **the same variable** — the reel's assignment runs later and the sequence silently drove
the wrong progress bar. It is `seqBar` now. Watch for this whenever adding a block to that file.

## The dust cursor

Eric asked for the cursor to be "a little circle that leaves marble dust behind it".
`public/cursor.js` draws a hairline ring in place of the arrow and kicks up specks on a single
canvas. It is the one deliberately decorative thing on the site; the rules that keep it from
becoming a liability:

- **Speed emits, not time.** Standing still leaves nothing. That is what makes it read as dust
  disturbed rather than an effect running.
- **Never on touch, never under reduced motion.** The script returns before it mounts anything, so
  the `.has-dust` class on `<html>` is the guarantee that none of the CSS applies where it should not.
- **Never two cursors, but the ring does the work.** The first pass let the globe keep `grab` and
  the overlay keep `zoom-out`, and Eric caught it immediately: the effect quit on the two most
  interactive things on the site. The ring now carries those states itself — wide and thin over the
  globe stage, open over a tile, closed to a small bright ring while dragging. Only text fields stay
  native, because an I-beam says where the caret will land and a ring cannot.
  Note `#globe{cursor:grab}` and `.tile{cursor:pointer}` are more specific than the inherited
  `none`, so they have to be answered directly under `.has-dust` — miss that and the ring silently
  hides instead of showing.
- **Canvas at dpr 1, deliberately.** Specks are soft; at dpr 2 a full-viewport clear-and-fill every
  frame is four times the work. The canvas is also `visibility:hidden` when idle so it is not holding
  a compositing layer over the page.

Measured on `/work` with the script blocked versus running: identical frame timing. It costs nothing.
If it ever looks like it does, A/B it by aborting the `cursor.js` request before blaming it — the
container's own frame times drift by 2x between runs and that fooled me once.

## The hero's "View our work"

"Our work" was the last link in a row of nine and Eric said it was hidden — which it was: the one
page that sells the business read as another nav item. It is out of the nav entirely and lives in the
hero instead, as a pill above the standing paragraph.

`.pill` is drawn like the mark: hairline outline, nothing filled, so it belongs to the same language
rather than sitting on the footage as a button. It fills to paper on hover. The mobile sheet keeps
its "Our work" link, since there the sheet is the only navigation there is.

## Statement Walls copy

Eric rewrote this section himself. The claim is **the sourcing**, not the product spec: "We source
the materials nobody expects, and produce any look you want." The two explainer columns that used to
sit below the photos — one for FlexMarble, one for SPC — are gone; they read as a spec sheet and
put two paragraphs in competition with the images. In their place, one statement under a hairline:
the materials list, then the line beneath it.

The list is his and should stay open-ended — FlexMarble, SPC panels, stainless steel fabrics, bio
composites, and more. Do not narrow it back to two products. The only edit made to his wording was
"one of a kind vision execution" → "executing one-of-a-kind visions", to undo the noun pile-up;
revert it if he prefers his phrasing.

The two wall photos are **tagged on the image**, the way the full-bleed band is — "Custom image on
FlexMarble" and "Marble veins on FlexMarble". Eric asked for the band's treatment specifically:
a label on the work reads as a note, the same words under it read as a catalogue caption. The band
gets its legibility from a separate `.veil` element, but these two photos end light at the bottom
(pale floor, grey rug), so the scrim is carried on the caption's own gradient instead.

Note the reel's Statement Walls caption still says "FlexMarble, SPC stone panels, and more" — it was
left alone because he did not ask for it, but it is the same claim in an older form.

## The reel's plates

The kitchen panel is `p3634` — the farmhouse sink under the window, brass gooseneck, white counter
running out to become the sill, navy cabinets below. Eric asked for it by description. It replaced
the black kitchen, which still carries the full-bleed band further down, so the page shows two
different kitchens rather than the same one twice. `object-position: 50% 46%` was compared against
34% and 58%: 46% keeps the sink the hero and the counter-to-sill relationship readable on both
sides.

**The plate drift is scaled to the slack, not a fixed factor.** A fixed `0.055 * off` reached the
clamp almost immediately on a wide screen — the photo sat pinned at maximum for nearly the whole
pass, so the depth vanished on a laptop while a phone, whose offsets stay small, looked right. Eric
spotted exactly that asymmetry. Mapping the pin's half-width onto the available overhang uses the
full travel at every width: the middle panels now move 59-155px on a laptop where they were frozen
at 38. The clamp stays, a pixel short of the true overhang, because at exactly the limit sub-pixel
rounding let a sliver of plate show.

**The plate photos were silently un-parallaxed.** `.plate img` sets `width:118%; left:-9%` so the
photo can drift inside its frame, but the global `img,video{max-width:100%}` reset at the top of the
file capped it at exactly the frame width — so the drift slid a photo that had no overhang and
exposed the plate's own `#1b1b1b` background at the trailing edge of every panel. Fixed with
`max-width:none` on `.plate img`, plus a clamp in `parallax()` that never translates further than
the photo actually overhangs. If a plate ever shows a dark band at one edge again, that reset is the
first place to look.

## The globe's feathered tiles

The tiles carry the **same two-linear-gradient feather as the closer look**, so a photo does not
change character when it flies out of the globe. Three things about it are load-bearing:

- **The mask is on `.tile`, not on `.tile img`.** The tile has its own `#1b1b1b` background; masking
  only the image leaves that showing through the soft edge as exactly the hard rectangle the feather
  is there to lose.
- **`--f:13%`.** Compared at 0 / 13 / 22 / 30 on a frozen sphere: 0 is hard tiles, 22 starts washing
  the photos out, 30 is mush. 13 loses the rectangle and keeps every photo readable. It has to be a
  percentage rather than pixels because tile size is computed from the viewport.
- **Hover reduces the feather to 3% instead of drawing a ring.** A ring cannot sit on an edge that
  has no edge — it fades at the corners and reads as a smear — so the photo pulls into focus out of
  the cloud instead. `--f` is registered with `@property` so it animates rather than snaps.
  `filter: drop-shadow` is not an option here: filters apply *before* masking, so the shadow would
  be a rectangle that the mask then cuts.

Measured before and after over 180 frames: median frame time unchanged (83.3 → 83.4ms in a
GPU-less container). 137 masked layers cost nothing measurable.

**An `<img>` is natively draggable, and that silently broke the globe on every desktop.** Pressing a
tile and moving started the browser's own image drag, which ate the mousemove, so the sphere would
not turn — while touch, which has no native drag, worked fine. That asymmetry is the tell. Fixed
three ways because any one alone can be defeated: `draggable={false}` on the tiles, `user-drag:none`
in CSS, and `preventDefault` on `dragstart` and `mousedown` at the stage.

**Tiles are 200px on the long edge, progressive, quality 76 — 827KB for all 137.** They were 240px
and 2066KB, and Eric said the globe took a minute to fill on a phone. They paint at 123px on a
phone, 168px on a laptop and 200px on a large monitor, so 240 was never reaching the screen. Do not
raise this without measuring what a tile actually paints at first.

**The overlay closed itself on a phone, and the guard against it is load-bearing.** A tap that opens
the overlay also produces a synthesized `click` a moment later. On touch the browser hit-tests that
click when it *dispatches* it — by which point the overlay is covering the screen, so it landed on
`#ov`'s close handler and shut what the same tap had just opened. Desktop dispatches it to the
original tile instead, which is why it only ever broke on a phone. `open()` stamps `openedAt` and the
overlay's click handler ignores anything inside 500ms. Reproduced both ways before and after:
0/4 taps stayed open without the guard, 6/6 with it. Note `preventDefault()` on `pointerup` does
**not** suppress that click — only the time guard does.

When testing hover or clicks on the globe, **find the tile with `elementFromPoint`, never with
`getBoundingClientRect`** — a back-facing tile still reports a bounding rect but is culled by
`backface-visibility` and cannot be hovered or clicked. That mistake has now produced a false
negative twice.

## Motion and design craft

Eric asked for Emil Kowalski's skills on this project and they are vendored, unmodified and MIT
licensed, in `.claude/skills/` — see the README there for what is installed, what was deliberately
left out, and how to update them. They load automatically in any session on this repo.

Use them. `animate` before building a new motion moment, `review-animations` on the motion in a
diff, `improve-animations` to audit what is already here. But they assume React, Motion and Tailwind
are in reach and this site is none of those: take the judgment — easing direction, duration
ceilings, interruptibility, transform and opacity only, reduced-motion — and leave the tooling.
**Where a skill and the brief disagree, the brief wins.** Never let one argue you into a dependency.

Motion now runs on tokens: `--ease-out` (the strong ease-out that was hand-typed in four places
before it was a token), `--ease-in-out`, and `--t-press` / `--t-hover` / `--t-panel`. Use them rather
than typing another curve. Two things the first audit caught that are worth not repeating: a
find-and-replace that turns a value into a token will also rewrite the token's own definition into
`--x:var(--x)`, which is invalid at computed-value time and silently drops every `transition`
shorthand that references it back to `transition-property: all` — check the `:root` block after any
such replace. And hover motion must sit inside `@media(hover:hover) and (pointer:fine)`, because a
tap fires a false hover and tapping a tile is exactly how the globe is used on a phone.

Note his own site is blocked by this environment's egress proxy; the skills came from
`github.com/emilkowalski/skills`, which is reachable. Update from there, not from the site.

## Standing asks (not yet done)

