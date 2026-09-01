import type { Metadata } from 'next'
import Script from 'next/script'
import SiteHeader from '../components/SiteHeader'
import ContactBand from '../components/ContactBand'
import Logo from '../components/Logo'
import Backdrop from '../components/Backdrop'
import manifest from '../work-manifest.json'

export const metadata: Metadata = {
  title: 'Our work — EC Home Improvement',
  description:
    'Kitchens, bathrooms, painted interiors, statement walls, outdoor rooms and one restaurant, built across Philadelphia, Bucks, Montgomery and Delaware counties.',
}

type Tile = { ch: string; slug: string; w: number; h: number; alt: string }

export default function Work() {
  const tiles = manifest as Tile[]
  return (
    <>
      <SiteHeader base="/" />

      <Backdrop />

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
              <figure className="tile" key={t.slug} data-ar={(t.w / t.h).toFixed(4)}>
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
          <div className="shotwrap">
            {/* the photo's own colours, blurred, so its edge melts into the page
                instead of sitting there as a hard rectangle */}
            <img className="bloom" alt="" aria-hidden="true" />
            <img className="shot" alt="" />
          </div>
          <p />
        </figure>
      </div>

      <footer className="ftr">
        <a className="mark" href="/"><Logo /><span className="mark-text">EC<b>Home Improvement</b></span></a>
        <p className="legal">© 2026 EC Home Improvement. Wyncote, Pennsylvania.</p>
      </footer>

      <Script src="/globe.js" strategy="afterInteractive" />
      <Script src="/motion.js" strategy="afterInteractive" />
    </>
  )
}
