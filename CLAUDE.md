# ec-homes.com — project brief

Flagship website for EC Home Improvement, Eric Connor's contracting business (Philadelphia suburbs).
Eric is the owner and the decision-maker. Work at his direction: propose, then wait for his go before
building anything he hasn't asked for. He reviews on desktop and phone.

## Where things stand (Sep 2026)

**The site is live at https://ec-homes.com.** Vercel project `ec-home-improvement`, deploying
automatically from `claude/clone-ec-homes-repo-t915hn` — that branch is the repo's default; there is
no `main`. **Any change is a commit and a push. There is nothing to click.**

- **DNS** is at GoDaddy: `A @ -> 216.150.1.1`. His Microsoft 365 email on the domain is untouched and
  must stay that way — the `autodiscover`, `email`, `msoid` and `lyncdiscover` CNAMEs are his inbox.
- **Resend** account is under `7echome@gmail.com`. `ec-homes.com` was added and auto-configured
  through GoDaddy; `levelworks.org` (his other domain) was already verified and is the fallback
  sender if `ec-homes.com` ever fails. All three Resend records resolved on public DNS when checked.
- **Vercel env vars**: `RESEND_API_KEY`, and `RESEND_FROM` = `EC Home Improvement <site@ec-homes.com>`.
- **This environment cannot reach Vercel or Resend** — the egress proxy 403s both, and there is no
  token here. Anything in those dashboards is Eric's to click. Do not try to route around it.

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

## Landing page wiring — DONE, kept for the reasoning

All three are done. Left here because the reasoning still applies to replacements.

1. **Hero video** — Eric supplied the clip; Pexels is blocked by this environment's egress proxy.
   It lives in `/public/video/` as H.264 + WebM + a poster, and it is **committed, not gitignored**
   (it was ignored once, which would have shipped an empty hero). The first 6.4s is sky only, so it
   is trimmed to start there and boomeranged — forward then reversed — for a seamless loop.
2. **Form** → Resend, wired. See "Where things stand".
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
- Service area line, verbatim: Philadelphia, Bucks County, Montgomery County, Delaware County and
  the surrounding areas. (New Hope and Doylestown were cut by Eric as redundant — both are in Bucks.
  They stay in `AREAS` for the structured data, where a town is a signal rather than a repetition.)
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

### The mark, second version (Sep 2026)

Eric saw the old open-frame mark at the 40px Google shows a logo and said it should read as
EC. It now does, everywhere: `Logo.tsx` is EC set as real text in the display face at weight
300 under the frame's top rail, with the plumb hanging off the rail's end beside the C. He
chose it from three drawn at Google's sizes (the others: hairline-drawn letters with the plumb
inside the C; a heavier EC with the plumb cradled in the C). Because the mark carries EC, the
lockup text beside it is only the tracked-out "Home Improvement", stacked beneath. The letters
are `<text>` so they inherit the font and `currentColor`, which is what keeps the difference
blend working. `app/icon.svg` draws the same mark with the letters as paths (no webfont in a
favicon). The Google listing carries it as `public/gbp-logo.png`, 720px on ink, rendered from
`gbp/logo-a.html` with the real face. `public/og.jpg` still shows the old lockup; regenerate it
with `scripts/og/` when convenient.

## The photo pages (`/kitchens`, `/bathrooms`, `/painting`)

Eric asked for the kitchen, bathroom and painting plates on the landing to link to a photo page
each. `app/components/Gallery.tsx` is the one page; `app/galleries.ts` picks the photos: every
tile in `work-manifest.json` for that chapter **that also has a file in `public/full`**. That is
14, 9 and 9. The other hundred-odd photos exist on the site only as 200px globe tiles, and a
tile blown up to a page reads as cheap, so they are left out until Eric supplies originals —
tell him this is why a page looks short. Plates hang in four columns (three under 1100px),
landscape files span two, each figure is capped at its file's own width, and the order deals
one wide then two tall so rows stay full and the wide MLS shots do not stack into a column of
huge photographs (they sort first in the archive and did exactly that on the first pass). The
reel's plate and title are the links (`a.plate`); Statement Walls and Outdoors are not linked
because he did not ask and they have two and zero page-fit photographs respectively.

## The one piece of colour

The footer credit — **"Web design and powered by ecwd1.com"**, linking to ecwd1.com — is in an oxide
red (`#9E3B33` at 72%, brightening on hover). Eric asked for it in red and subtle.

This is a deliberate exception to the brief's "no accent colour — photos and footage carry all
colour", and it is the only one. It is a credit line rather than part of the design, it sits at the
very bottom next to the copyright, and at 12px it never competes with anything. **Do not let this red
spread anywhere else on the site** — the moment a second thing is red, the rule is gone and the
photographs stop being the only colour on the page.

It is in the footer on both the landing page and `/work`.

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

- **The share card and the search result are deliberately different strings.** `title` and
  `description` in `app/layout.tsx` are long and keyword-heavy because that is what Google shows in
  a result. `shareTitle` and `shareText` feed `openGraph` and `twitter` only, and are short because
  that is what fits on a lock screen when someone texts the link: **"EC Home Improvement"** and
  **"Custom interiors specialist in Philadelphia and the surrounding counties."** Changing one
  should not change the other — that is the whole point of the split.
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

## Round of fixes from Eric's wife's phone (Sep 2026)

- **The globe loads from one sheet.** `scripts/build-atlas.py` packs the 137 tiles into a
  progressive JPEG (`public/work/atlas-<hash>.jpg`, ~860KB) and writes `app/work-atlas.json`;
  each tile is an `<img>` of that sheet cropped in CSS by percentage (`--ax/--ay/--aw/--ah`
  against `--AW/--AH`). 137 requests became one, and progressive means the whole sphere
  appears softly and sharpens instead of filling in a square at a time. Re-run the script
  after touching any tile; the hash changes and the immutable cache header is safe.
- **Taps.** Pointer events only, and the tap test is straight-line distance (18px on touch,
  8 on mouse) with no time limit — the old test summed every wobble and rejected a thumb
  standing still. A finger that lands beside a tile is probed in a ring and takes the nearest.
  Long-press callout is suppressed. `.tile.pressed` is the touch equivalent of hover, added
  and removed by the script so it cannot stick.
- **The closer look no longer waits for the network.** The frame is sized from the photo's
  known dimensions (`data-fw/fh`) and filled with the tile's own crop (`.lo`), so the flight
  begins on the tap; the full file fades in over it (`.ready`). The bloom is that crop too.
- **Hero copy rises with the scroll** (1:1, easing out over the first 70% of the pin) and only
  fades from 45%; the ink starts at 25%. It used to sit pinned at the bottom and fade the moment
  you scrolled to read it. `padding-bottom` also adds `100lvh - 100svh` so the paragraph is not
  under a phone's toolbar on load.
- **Reel ratio.** Vertical scroll maps to horizontal travel at `k = pin height / plate step`,
  clamped 1.2–2, so one screen of scrolling moves about one plate (was 1:1). Menu links centre
  the panel; the track gets trailing padding so the last plate can be centred, and arriving at
  `/#painting` from another page lands on it after the reel is measured. On a laptop the first
  two panels cannot be centred because the reel still opens left-aligned; that is deliberate.
- **The reel eases to a stop.** Eric: after the geared-down reel let go, the page "flew"
  through Statement Walls. Not fixable by slowing the page (that is scroll-jacking; refused).
  Instead the last quarter of the reel's travel decelerates to zero over twice its share of
  scroll (`A = 0.75`, `reelPos`/`reelScroll` in motion.js — the inverse keeps menu links
  exact), Statement Walls carries the most padding on the page, and its two photographs
  overhang their frames by 8% and drift at 3.5% as they pass, the band's trick at half weight.
- Booth reel 1250ms a frame, 3.2s finale (slowed twice at Eric's ask). On phones the reel gear
  is multiplied by 1.6 (k up to 3.4), since a flick carries about a screen and a half.
- **The drum.** On screens up to 820px the same tiles are laid on a cylinder (`globe.js`,
  `drum`): seven rows, twenty round, edge to edge and clipped, ~4.5 across the front, spinning
  on a vertical axis only, so vertical finger movement scrolls the page. Eric's verdict on the
  sphere at phone size was that the tiles were fingernails; the drum triples their area and
  keeps the object. The sheet has a phone edition at 0.8 scale (`atlas-phone-*.jpg`, ~520KB)
  picked by `srcset`; crops are ratios of the sheet so both editions share one set of numbers.
  The laptop sphere is untouched.
- **The band on phones is drawn, not photographed.** Eric rejected four portrait photos for it
  and asked for a design element. It is the hex backsplash from the laptop photo as a hairline
  honeycomb (one SVG tile as a data URL, used as both the faint lattice and the mask over a
  drifting pool of light, so the two cannot misalign). Photo and caption are hidden ≤820px.
- **Done means done on a phone**: the plumb hangs in a 34px gutter beside the words, full row
  height, so the bob lands level with the last line instead of dropping into an empty band. Service line drops New Hope and Doylestown; the share
  image was re-rendered (`scripts/og/`).
- The backdrop uses 240px copies (`public/assets/field-*.jpg`); under a 30px blur nothing more
  survives, and it stops competing with the sheet on a phone.
- `next dev` appends an agent-rules block to this file; `agentRules: false` in `next.config.mjs`
  stops it. Strip it if it ever reappears.

## Sep 4 2026 (evening): lighter ink, and the hero hands off to the reel

- **Ink lifted.** `--ink` #141414 → #242424, `--ink-2` → #2c2c2c, and every hard-coded dark
  (hero and band base, poster gradient, veils, the globe field scrim, the closer-look backdrop,
  plate backings, favicon ground, theme-color) moved with it. Paper, plaster, mute untouched.
  Eric asked for it lighter across the whole site; this is the whole site.
- **No more black between the hero and the reel.** The reel's pin overlaps the hero by 48vh
  (`.strip{margin-top:-48vh;z-index:2}`), and the footage scales back into the ink as it does
  (`--hs`, set in `motion.js` from the hero progress, ease-out 1.02 → .92), so the hero leaves as
  one more receding plate while the reel's plates rise. The dim tops out at .9. Eric had asked
  for "a flip or an image" there; this was the answer and he accepted it.
- Both pushed straight to the deploy branch `claude/clone-ec-homes-repo-t915hn`, so they are
  live. (This repo's default branch accepts pushes from the Claude environment; ecwd1's does
  not.)

## v5 landing (Sep 4 2026, night): the ecwd1 theories, this site's material

Eric, after the ecwd1 rebuild: "the changes you made in ecwd1 are so good i want to change ec homes
as well, using the same design theories, but you can use all the info/pics/etc that's already on
that page." So the landing page is recomposed, nothing else on the site touched:

- **The grid.** `.rails` hairlines at the page padding each side and down the centre, over
  everything (white at 10%, under the header). Every block below cuts on them.
- **The hero** (`.hero4`): the sky footage in the left cell with `.cyc` cycling pairs over it
  ("Work worth / coming home to." first, then Kitchens / Bathrooms / Walls / Outdoors lines), the
  **booth build as a film** in the right cell (`public/video/build.*`, the ten `build-N.jpg`
  frames with a slow push-in and crossfades, made with ffmpeg zoompan, 640x854), and the black
  block with the one sentence and a "View our work" pill to `/work`. The old pinned hero, its
  handoff and the reel are gone from the page; `motion.js` keeps that code but every hook is
  guarded, and it still runs the booth reel and the plumb line in How we work.
- **Hero films, second cut (Eric's note: the booth frames were "literally shaky" and the line got
  lost).** The left cell under the words is now `public/video/craft.*`: six Mixkit free-tier
  clips of hands at work (1446 marking a board, 1455 pencil on a stud, 776 sanding, 1444 mitre
  saw, 1445 measuring, 1459 a room being framed), 720x960, darkened a touch, with a bottom
  scrim (`.hero4 .l .scrim`) so the paper type reads. The sky footage moved to the right cell.
  The booth film is deleted; the ten frames are still in `public/assets` for the How we work
  reel. Mixkit restricted-tier IDs in this category, do not use: 1440, 1442, 1443 were free but
  people-on-phones; everything else on the construction/contractor pages checked free.
- **Video encoding rule:** every mp4 must be `-pix_fmt yuv420p -profile:v high`; ffmpeg's xfade
  chain drifts to yuv444p, which iPhones cannot decode (the craft film shipped that way once and
  was blank on Eric's phone). mp4 `<source>` before webm. Check with ffprobe.
- **Hero, third cut (Eric: "we're not understanding each other with the top of that page").**
  No cycling phrases: he rarely builds outside, so "Outdoors / built to stay" was wrong, and
  catch phrases over rough framing did not fit a finished-interiors company. The line is fixed:
  **"Work worth coming home to."** (`.line4`), which he loves. Under it, **two daytime drone
  approaches into the city** (Sep 5; Eric: "i like the drone shots coming into the city, similar
  to the first one we had just daytime. try a couple different ones"): left
  `public/video/bridge.*`, a push over the Ben Franklin Bridge into the Center City skyline
  (Pexels 37196332, 4K landscape, centre 3:4 crop); right `public/video/tower.*`, the portrait
  sweep past the bridge tower toward the towers (Pexels 37258721). Both **Pexels licence, no
  credit required**, so the footer's footage credit line is gone. Two more are cut and sitting
  in the session scratchpad only: `street` (37261867, down a street toward the skyline) and
  `hall` (37196466, over City Hall and the glass towers); the other downloaded ids (37166114
  Schuylkill and Cira, 37165732/37165650 rooftops, 37180937 dusk, 37165833 Schuylkill Yards
  glass) are framed in `stock/px/*-sheet.jpg`. **Getting Pexels files:** the search and item
  pages sit behind a Cloudflare wall (curl and Chromium both get "Just a moment"), and the
  `videos.pexels.com/video-files/<id>/<id>-<size>.mp4` pattern does not hold for newer ids.
  What works is `https://www.pexels.com/download/video/<id>/` with a browser User-Agent: it
  302s to the real file (`<file-id>_3840_2160_24fps.mp4`), and that URL downloads at full
  speed. Ids come from a web search of pexels.com for "Philadelphia drone". Each film is
  720x960, ~2.5MB, and its last second is crossfaded into its first (`cut.sh` in the
  scratchpad: xfade needs `fps=24` on both trimmed branches or it refuses) so the loop has no
  jump. The films that were here before (Logan Square timelapse, Conshohocken river, both
  Commons) are deleted; Eric's own dusk clip (`hero.*`) is still in the repo but off the page.
  Commons rate-limits hard: send a User-Agent, and download big files with
  `curl --retry 6 --retry-delay 90 --retry-all-errors`; ffmpeg reading Commons URLs directly
  segfaults through the proxy, so download first. The craft
  film is deleted. Statement rewritten to what is true: kitchens, bathrooms, statement walls
  and painting, the counties chip, "built one at a time", and his own line "The job isn't
  done until we walk it together." Panel titles: "Kitchens." and "Custom backyard
  experiences." (his wording). **Painting sits before Outdoors** (Sep 5, Eric's ask), so the
  panel grounds run kitchens ink, bathrooms plaster, statement walls ink, painting plaster,
  outdoors ink.
- **The house (Sep 4, late).** Eric: "i like the idea and operation of the globe, but it just isn't
  working on the laptop, what if we made like an architectural drawing that was made up of the
  pictures." So on a laptop `globe.js` lays the same 137 tiles on a **gabled house** instead of a
  sphere (`house()` in globe.js): four walls and two roof planes, each surfaced with a grid of
  tiles, and the drawing itself as hairline edges in 3D (`.sphere .lines i`: box, ridge, gable
  slopes, and a plan outline on the ground). Turning, dragging, hover and the closer look are
  unchanged. Two things learned: the grid pitch has to be searched so every face takes its full
  share of the 137 (an empty near roof let the far roof show through and read as a cluster
  floating above the house), and the roof rise is 0.17 of the stage, flatter than a real
  house, because the default tilt foreshortens it. The phone drum is untouched.
- **`/work` on a laptop** (Eric: keep the phone version, rethink the laptop one, "just the
  spinning globe on a blank page" did not fit): now `.work4`, the page on the same grid as the
  landing. Left column: "Every job, on one globe.", the one-liner with the photo count, the
  hint, and a hairline list of the six chapters with counts (Kitchens / Painting / Bathrooms
  link to the photo pages; Commercial / Outdoors / Statement walls are static). Right column:
  `#globe` in a bounded cell (border-left on the centre rail, full height, globe.js sizes the
  sphere from the cell). Then the same `.ft4` contact block and Book-a-walkthrough band as the
  landing. The phone drum is untouched: under 820px the grid collapses and the old sizes apply.
- **Statement** (`.stmt4`) with a chip of the counties.
- **Five panels** (`.svcs4 .pnl`, ids kitchens / bathrooms / flexmarble / outdoors / painting so
  the nav and footer links still land): full-screen, sticky, stacking, ink and plaster
  alternating, the copy left and the photograph right **as a plate on a bloom of itself**
  (`.art .bloom` is the same file blurred 60px behind `.art .shot`, which is capped at its own
  width and never upscaled: the files are 480x640). The Statement Walls panel carries Eric's own
  materials copy. The panel underneath recedes as the next covers it (`public/home.js`).
- **The band** kept as the breath, then **Our work as giant names** (`.wl`: Kitchens, Bathrooms,
  Painting to the photo pages, Every job to the globe) with a photograph that follows the cursor.
- **How we work and Agents kept verbatim.** Then `.ft4`: the contact block (phone huge, email,
  service line, the section links) and a plaster **"Book a walkthrough ↗" marquee** that dials
  the phone. `ContactBand` is no longer imported on the landing; it still exists for other pages.
- Bricolage at 300, ink and plaster, no accent: the theories transferred, the palette did not.
- The FlexMarble section (`#fm`) is off the page; its two photos still exist in `public/assets`.

## Standing asks (not yet done)

1. **The contact form is off the page.** Eric pulled it (Sep 2026) after a long round of
   failed tests: the Resend key in Vercel was the *shortened* display copy (`re_xxxx…`, with a
   literal ellipsis at index 7 — the page reported "cannot convert argument to a bytestring …
   value of 8230"). The fix is a fresh key copied from Resend's create pop-up, pasted into the
   Production row, then Redeploy. `ContactForm.tsx` and `/api/contact` stay in the repo,
   tested locally; put `<ContactForm />` back in `ContactBand.tsx` once the key is real.
   The band now closes on the phone number and the email link only.
   Earlier note, kept for the mechanics: Eric's first live attempt showed no confirmation and
   nothing arrived, and this environment cannot reach the live site to see why. The form now
   prints Resend's own reason on the page, sends every lead to `7echome@gmail.com` as well as
   `eric@ec-homes.com`, and retries through `onboarding@resend.dev` to the Gmail if the
   ec-homes.com sender fails. Eric has since set up the Microsoft mailbox and forwards it to
   Gmail. Original note: Everything is wired and DNS resolved, but no
   message has actually been sent through it. Fill the form on the live site and confirm it lands at
   `eric@ec-homes.com`. If Resend never finished verifying `ec-homes.com`, point `RESEND_FROM` at
   `levelworks.org`, which is already verified, and it will send immediately.
2. **Claim the Google Business Profile.** The single biggest lever for local search, free, and
   nothing in the code substitutes for it. **The whole listing is drafted in `gbp/profile.md`**
   (categories, service area, 750-char description, services, hours, photo URLs, first four
   posts, review scripts, Q&A) and Eric's Windsor.ai account can push all of it through the
   `google_my_business` connector once he has claimed and connected the listing. Site side is
   done: `/review` redirects to Google's review box (needs `NEXT_PUBLIC_GBP_PLACE_ID` in Vercel;
   falls back to a Google search until then), the card page carries "Leave a review", and the
   structured data states hours (`HOURS` in `site.ts`, must match the listing) and `sameAs`
   links (`NEXT_PUBLIC_GBP_MAPS_URL`, `NEXT_PUBLIC_FACEBOOK_URL`). Left to Eric: claim, verify
   by video, connect to Windsor, set the three env vars, add his PA HIC number to the description.
3. **Get the MLS permission in writing.** Eric has it by phone. An email trail costs nothing.
4. **Put a portfolio clause in his contracts** so future jobs come with photo rights attached.
5. **Statement Walls still has only two photographs.** Thinnest section on the site. Eric is
   relaxed about it — do not push, but a proper FlexMarble shoot would fix it.

### Settled — do not reopen

- **Chasing the listing photographer for unwatermarked originals.** Eric decided against it: it was
  a while ago, the agent says it would be a headache, and his position is that if anyone objects he
  takes them down. His call, made explicitly. The never-strip-the-watermark rule still stands.
- **Chapters, bigger tiles and a hero photo on `/work`**, and **porting the globe back to WebGL**.
- **A page-wide fixed veil** behind the header, and **any attempt to replace the header's
  `mix-blend-mode: difference`** with stated colour, a scrim or a light/dark switch.
