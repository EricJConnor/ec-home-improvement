import type { Metadata } from 'next'
import Script from 'next/script'
import SiteHeader from '../components/SiteHeader'
import ContactBand from '../components/ContactBand'
import manifest from '../gallery-manifest.json'

export const metadata: Metadata = {
  title: 'The work — EC Home Improvement',
  description:
    'Kitchens, bathrooms, painted interiors, statement walls, outdoor rooms and one restaurant, built across Philadelphia, Bucks, Montgomery and Delaware counties.',
}

type Plate = { ch: string; slug: string; w: number; h: number; alt: string }

/* Chapter order follows the landing's reel so the two pages agree, with the
   restaurant added at the end. The MLS set is filed under Painting because that is
   the work Eric did on those houses — the room in the photo is not the job. */
const CHAPTERS: { key: string; n: string; name: string; line: string }[] = [
  { key: 'kitchens',   n: '01', name: 'Kitchens',        line: 'From the layout drawing to the last cabinet pull.' },
  { key: 'bathrooms',  n: '02', name: 'Bathrooms',       line: 'Tile, stone, glass and light.' },
  { key: 'walls',      n: '03', name: 'Statement Walls', line: 'FlexMarble and SPC. Surfaces nobody else here is making.' },
  { key: 'outdoors',   n: '04', name: 'Outdoors',        line: 'Sheds, pergolas, bars and the structures that make a yard a room.' },
  { key: 'painting',   n: '05', name: 'Painting',        line: 'Whole interiors taken back and brought up properly — brick, beams, trim and ceilings.' },
  { key: 'commercial', n: '06', name: 'Commercial',      line: 'The Yankee Chipper, framing to finished bar.' },
]

/* A deliberate rhythm rather than a grid: widths are percentages of the column and the
   offsets stagger the hang, so no two rows land the same way. Cycled by row index. */
const RHYTHM: { align: 'start' | 'end'; items: { w: number; off: number }[] }[] = [
  { align: 'start', items: [{ w: 54, off: 0 }] },
  { align: 'end',   items: [{ w: 30, off: 0 }, { w: 38, off: 16 }] },
  { align: 'start', items: [{ w: 42, off: 12 }, { w: 30, off: 0 }] },
  { align: 'end',   items: [{ w: 62, off: 0 }] },
  { align: 'start', items: [{ w: 26, off: 14 }, { w: 26, off: 0 }, { w: 32, off: 22 }] },
  { align: 'end',   items: [{ w: 36, off: 0 }, { w: 28, off: 18 }] },
]

function rows(plates: Plate[], seed: number) {
  const out: { align: string; cells: { p: Plate; w: number; off: number }[] }[] = []
  let i = 0, r = seed
  while (i < plates.length) {
    const pat = RHYTHM[r++ % RHYTHM.length]
    const take = Math.min(pat.items.length, plates.length - i)
    out.push({
      align: pat.align,
      cells: pat.items.slice(0, take).map((it, k) => ({ p: plates[i + k], w: it.w, off: it.off })),
    })
    i += take
  }
  return out
}

export default function Gallery() {
  const all = manifest as Plate[]
  return (
    <>
      <SiteHeader base="/" />
      <canvas id="gl" aria-hidden="true" />

      <main id="top" className="gal">
        <section className="gal-open">
          <h1 className="h-xl">The work.</h1>
          <div className="gal-open-side">
            <p className="p">
              Kitchens, bathrooms, whole painted interiors, outdoor rooms and one restaurant.
              Built across Philadelphia and the counties around it, one at a time.
            </p>
            <p className="hint">Move your cursor across the photographs.</p>
          </div>
        </section>

        <nav className="rail" aria-label="Chapters">
          <span className="rail-count"><b id="rail-now">01</b>/{String(CHAPTERS.length).padStart(2, '0')}</span>
          {CHAPTERS.map((c) => (
            <a key={c.key} href={`#${c.key}`}>{c.name}</a>
          ))}
        </nav>

        {CHAPTERS.map((c, ci) => {
          const plates = all.filter((p) => p.ch === c.key)
          return (
            <section className="chapter" id={c.key} key={c.key}>
              <span className="ghost" aria-hidden="true">{c.n}</span>
              <div className="chapter-head rule-draw">
                <h2 className="h-l">{c.name}</h2>
                <div>
                  <p className="p">{c.line}</p>
                  <p className="hint">{plates.length} photograph{plates.length === 1 ? '' : 's'}</p>
                </div>
              </div>

              {rows(plates, ci).map((row, ri) => (
                <div className="gal-row" style={{ justifyContent: row.align === 'end' ? 'flex-end' : 'flex-start' }} key={ri}>
                  {row.cells.map(({ p, w, off }) => (
                    <figure
                      className="gp"
                      key={p.slug}
                      data-depth={`/gallery/${p.slug}-d.jpg`}
                      style={{ width: `${w}%`, aspectRatio: `${p.w} / ${p.h}`, marginTop: `${off}vh` }}
                    >
                      <img src={`/gallery/${p.slug}.jpg`} alt={p.alt} loading="lazy" decoding="async" />
                    </figure>
                  ))}
                </div>
              ))}
            </section>
          )
        })}

        <ContactBand />
      </main>

      <footer className="ftr">
        <a className="mark" href="/">EC<span>Home Improvement</span></a>
        <p className="legal">© 2026 EC Home Improvement. Wyncote, Pennsylvania.</p>
      </footer>

      <Script src="/gallery.js" strategy="afterInteractive" />
      <Script src="/motion.js" strategy="afterInteractive" />
    </>
  )
}
