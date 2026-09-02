The share image (`public/og.jpg`) is rendered from `og.html` through headless Chromium so it
uses the real Bricolage face and the real hero frame. Run `next dev` once so the font exists
under `.next/dev/static/media/`, point the `@font-face` url at the `-s.p.` woff2 there, then:

    NODE_PATH=$(npm root -g) node scripts/og/shoot.js

It carries the lockup, "Work worth coming home to." and the service-area line — no phone
number; Eric cut that.
