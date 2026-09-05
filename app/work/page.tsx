import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import { preload } from 'react-dom'
import Script from 'next/script'
import SiteHeader from '../components/SiteHeader'
import Logo from '../components/Logo'
import Backdrop from '../components/Backdrop'
import manifest from '../work-manifest.json'
import atlas from '../work-atlas.json'

export const metadata: Metadata = {
  title: 'Our work — EC Home Improvement',
  description:
    'Kitchens, bathrooms, painted interiors, statement walls, outdoor rooms and one restaurant, built across Philadelphia, Bucks, Montgomery and Delaware counties.',
}

type Tile = { ch: string; slug: string; w: number; h: number; alt: string }
type Window = { x: number; y: number; w: number; h: number; fw: number; fh: number }
const sheet = atlas as { file: string; w: number; h: number; phone: string; pw: number; tiles: Record<string, Window> }
/* two sizes of the same sheet; the browser picks by screen, and the preload uses the same
   rule so it never fetches the one the tiles will not use */
const srcSet = `${sheet.phone} ${sheet.pw}w, ${sheet.file} ${sheet.w}w`

export default function Work() {
  const tiles = manifest as Tile[]
  /* One sheet carries all 137 tiles (scripts/build-atlas.py). Ask for it before anything
     else on the page: it is the page. */
  preload(sheet.file, { as: 'image', fetchPriority: 'high', imageSrcSet: srcSet, imageSizes: '100vw' })
  return (
    <>
      <SiteHeader base="/" />

      <Backdrop />

      <main id="top" className="work work4">
        <div className="rails" aria-hidden="true"><i /><i /><i /></div>
        <div className="work-grid">
          <section className="work-copy">
            <span className="idx4">Our work</span>
            <h1 className="ttl4">Every job,<br />in one house.</h1>
            <p className="one4">
              Kitchens, bathrooms, painted interiors, statement walls, outdoor rooms and one
              restaurant, across Philadelphia and the counties around it. {tiles.length} photographs.
            </p>
            <p className="hint"><span className="fine">Drag to turn it. Click any one to look closer.</span><span className="coarse">Swipe to turn it. Tap any one to look closer.</span></p>
            <ul className="cats">
              {[
                ['Kitchens', 'kitchens', '/kitchens'],
                ['Painting', 'painting', '/painting'],
                ['Bathrooms', 'bathrooms', '/bathrooms'],
                ['Commercial', 'commercial', null],
                ['Outdoors', 'outdoors', null],
                ['Statement walls', 'walls', null],
              ].map(([name, ch, href]) => {
                const n = tiles.filter((t) => t.ch === ch).length
                const inner = <><span className="cn">{name}</span><span className="cc">{n} photograph{n === 1 ? '' : 's'}</span>{href && <span className="ca">↗</span>}</>
                return <li key={ch as string}>{href ? <a href={href as string}>{inner}</a> : <span className="static">{inner}</span>}</li>
              })}
            </ul>
          </section>

          <section className="work-cell" aria-label="The house">
            {/* The images are real: they render without JS or WebGL, carry the alt text,
                and are the texture source for the globe. Each one is a window onto the shared
                sheet — one request instead of 137, and a progressive JPEG, so the whole sphere
                appears at once and sharpens rather than filling in a square at a time. */}
            <div
              id="globe"
              aria-label="Photographs of our work"
              style={{ '--AW': sheet.w, '--AH': sheet.h } as CSSProperties}
            >
              <div className="sphere">
                {tiles.map((t) => {
                  const a = sheet.tiles[t.slug]
                  return (
                    <figure
                      className="tile"
                      key={t.slug}
                      data-ar={(t.w / t.h).toFixed(4)}
                      data-fw={a.fw}
                      data-fh={a.fh}
                      style={{ '--ax': a.x, '--ay': a.y, '--aw': a.w, '--ah': a.h, '--ar': (t.w / t.h).toFixed(4) } as CSSProperties}
                    >
                      <img
                        src={sheet.file}
                        srcSet={srcSet}
                        sizes="100vw"
                        data-full={`/full/${t.slug}.jpg`}
                        alt={t.alt}
                        decoding="async"
                        draggable={false}
                      />
                    </figure>
                  )
                })}
              </div>
            </div>
            <p className="globe-cap" id="globe-cap" aria-live="polite" />
          </section>
        </div>

        <section className="ft4" id="contact">
          <div className="ftg">
            <div>
              <h2>Book a walkthrough.</h2>
              <p className="ftp">Tell us the room and the rough idea. We&rsquo;ll come see it.</p>
              <a className="tel4" href="tel:+12159026636">215 902 6636</a>
              <p className="ftp"><a href="mailto:eric@ec-homes.com">eric@ec-homes.com</a></p>
              <p className="ftp small">Serving Philadelphia, Bucks County, Montgomery County, Delaware County and the surrounding areas.</p>
            </div>
            <nav className="ftn"><a href="/#kitchens">Kitchens</a><a href="/#bathrooms">Bathrooms</a><a href="/#flexmarble">Statement Walls</a><a href="/#outdoors">Outdoors</a><a href="/#painting">Painting</a><a href="/#how">How we work</a><a href="/#agents">Agents</a></nav>
          </div>
          <a className="talk" href="tel:+12159026636" aria-label="Book a walkthrough"><div className="run"><span>Book a walkthrough <i>↗</i></span><span>Book a walkthrough <i>↗</i></span><span>Book a walkthrough <i>↗</i></span><span>Book a walkthrough <i>↗</i></span></div></a>
        </section>
      </main>

      <div id="ov" hidden>
        <figure>
          <div className="shotwrap">
            {/* the photo's own colours, blurred, so its edge melts into the page
                instead of sitting there as a hard rectangle */}
            <div className="bloom" aria-hidden="true" />
            {/* the tile's own crop of the sheet: on screen already, so the flight starts
                on the tap and the full-size file fades in over it when it arrives */}
            <div className="lo" aria-hidden="true" />
            <img className="shot" alt="" />
          </div>
          <p />
        </figure>
      </div>

      <footer className="ftr">
        <a className="mark" href="/"><Logo /><span className="mark-text">Home Improvement</span></a>
        <p className="legal">© 2026 EC Home Improvement. Wyncote, Pennsylvania.<a className="by" href="https://ecwd1.com" rel="noopener">Web design and powered by ecwd1.com</a></p>
      </footer>

      <Script src="/globe.js" strategy="afterInteractive" />
      <Script src="/motion.js" strategy="afterInteractive" />
    </>
  )
}
