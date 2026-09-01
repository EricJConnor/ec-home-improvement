# ec-homes.com

Flagship site for EC Home Improvement — Philadelphia, Bucks, Montgomery and Delaware counties.

Next.js (App Router) + plain CSS. No Tailwind, no component libraries.
`CLAUDE.md` is the project brief; `reference/index.html` is the approved design
source of truth for the landing page.

## Run it

    npm install
    npm run dev        # http://localhost:3000

## Hero footage

`/public/video` is not in git. Build it once:

    ./scripts/build-hero-video.sh                 # downloads from Pexels, then encodes
    ./scripts/build-hero-video.sh ~/hero-src.mp4  # encodes a file you already have

Without it the hero falls back to its gradient poster — the reference's own
designed fallback. The section still pins and still darkens to ink on scroll.

## Contact form

`POST /api/contact` emails eric@ec-homes.com through Resend. Set in Vercel:

    RESEND_API_KEY   required — from resend.com
    RESEND_FROM      optional — defaults to the shared onboarding sender until
                     ec-homes.com is verified in Resend

With no key the route returns 503 and the form shows the phone number instead,
so a lead is never silently swallowed.

## Layout

    app/page.tsx                 the landing page markup
    app/globals.css              the reference stylesheet, ported verbatim
    app/components/SiteMotion    pinned hero + pinned horizontal strip + menu
    app/components/ContactForm   form and its confirmation state
    app/api/contact/route.ts     Resend handler
    public/assets                photos
    reference/index.html         approved design, do not edit
