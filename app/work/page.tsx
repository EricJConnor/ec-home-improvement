import type { Metadata } from 'next'
import Script from 'next/script'
import SiteHeader from '../components/SiteHeader'
import ContactBand from '../components/ContactBand'
import manifest from '../work-manifest.json'

export const metadata: Metadata = {
  title: 'Our work — EC Home Improvement',
  description:
    'Kitchens, bathrooms, painted interiors, statement walls, outdoor rooms and one restaurant, built across Philadelphia, Bucks, Montgomery and Delaware counties.',
}

type Tile = { ch: string; slug: string; alt: string }

export default function Work() {
  const tiles = manifest as Tile[]
  return (
    <>
      <SiteHeader base="/" />

      {/* A field of colour behind the whole page. It is Eric's own FlexMarble peony wall,
          blurred past recognition so it reads as atmosphere rather than a photograph —
          the teal and gold give the ink something to sit against. */}
      <div className="bg" aria-hidden="true">
        <div className="bg-inner">
          <img src="/full/p4085.jpg" alt="" />
        </div>
        <div className="bg-2">
          <img src="/full/p4082.jpg" alt="" />
        </div>
        <div className="bg-grain" />
      </div>

      <main id="top" className="work">
        <section className="work-head">
          <h1 className="h-xl">Our work.</h1>
          <div className="work-head-side">
            <p className="p">
              Kitchens, bathrooms, whole interiors, outdoor rooms and one restaurant, across
              Philadelphia and the counties around it.
            </p>
            <p className="hint">Drag to turn it. Click any one to look closer.</p>
          </div>
        </section>

        {/* The images are real: they render without JS or WebGL, carry the alt text,
            and are the texture source for the globe. */}
        <div id="globe" aria-label="Photographs of our work">
          <div className="sphere">
            {tiles.map((t) => (
              <figure className="tile" key={t.slug}>
                <img
                  src={`/work/${t.slug}.jpg`}
                  data-full={`/full/${t.slug}.jpg`}
                  alt={t.alt}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            ))}
          </div>
        </div>
        <p className="globe-cap" id="globe-cap" aria-live="polite" />

        <ContactBand />
      </main>

      <div id="ov" hidden>
        <figure>
          <img alt="" />
          <p />
        </figure>
      </div>

      <footer className="ftr">
        <a className="mark" href="/">EC<span>Home Improvement</span></a>
        <p className="legal">© 2026 EC Home Improvement. Wyncote, Pennsylvania.</p>
      </footer>

      <Script src="/globe.js" strategy="afterInteractive" />
      <Script src="/motion.js" strategy="afterInteractive" />
    </>
  )
}
