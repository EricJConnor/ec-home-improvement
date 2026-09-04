import type { Metadata } from 'next'
import SiteHeader from './SiteHeader'
import ContactBand from './ContactBand'
import Backdrop from './Backdrop'
import Logo from './Logo'
import { GALLERIES, photosFor, type Chapter } from '../galleries'

export function galleryMetadata(ch: Chapter): Metadata {
  const g = GALLERIES[ch]
  return {
    title: `${g.title} — EC Home Improvement`,
    description: g.description,
    alternates: { canonical: `/${ch}` },
    openGraph: { title: `${g.title} — EC Home Improvement`, description: g.line },
  }
}

/* One page for all three chapters. The photographs hang as plates, the way the reel hangs
   them: each at its true proportion, never drawn wider than its file, caption in small grey
   type beneath. Landscape files span two columns so a 1344px kitchen is not shown at the
   width of a 480px portrait. The grid is the only structure — no chapters, no headline
   photo, nothing is the "main" one, which is the same rule the globe follows. */
export default function Gallery({ ch }: { ch: Chapter }) {
  const g = GALLERIES[ch]
  const photos = photosFor(ch)
  return (
    <>
      <SiteHeader base="/" />
      <Backdrop quiet />
      <main id="top" className="gal-page">
        <section className="work-head">
          <h1 className="h-xl">{g.title}.</h1>
          <div className="work-head-side">
            <p className="p">{g.line}</p>
            <p className="hint">{photos.length} photographs. Tap any one to look closer.</p>
          </div>
        </section>

        <section className="gal-grid" aria-label={`${g.title} photographs`}>
          {photos.map((p) => (
            <figure key={p.slug} className={p.w > p.h ? 'wide' : undefined} style={{ maxWidth: p.w }}>
              <a href={`/full/${p.slug}.jpg`} className="gal-plate" style={{ aspectRatio: `${p.w} / ${p.h}` }}>
                <img src={`/full/${p.slug}.jpg`} width={p.w} height={p.h} alt={p.alt} loading="lazy" decoding="async" />
              </a>
              <figcaption>{p.alt}</figcaption>
            </figure>
          ))}
        </section>

        <p className="gal-more p">
          More of this work turns on the <a href="/work">globe</a>, and the rest is on the phone.
          Ask, and we&rsquo;ll show you the job that matches yours.
        </p>

        <ContactBand />
      </main>

      <footer className="ftr">
        <a className="mark" href="/"><Logo /><span className="mark-text">Home Improvement</span></a>
        <div className="links">
          <div>
            <b>Work</b>
            <a href="/kitchens">Kitchens</a>
            <a href="/bathrooms">Bathrooms</a>
            <a href="/#flexmarble">Statement Walls</a>
            <a href="/#outdoors">Outdoors</a>
            <a href="/painting">Painting</a>
          </div>
          <div>
            <b>Partners</b>
            <a href="/#agents">Real estate agents</a>
          </div>
          <div>
            <b>Contact</b>
            <a href="tel:+12159026636">215 902 6636</a>
            <a href="mailto:eric@ec-homes.com">eric@ec-homes.com</a>
          </div>
        </div>
        <p className="legal">© 2026 EC Home Improvement. Wyncote, Pennsylvania.<a className="by" href="https://ecwd1.com" rel="noopener">Web design and powered by ecwd1.com</a></p>
      </footer>
    </>
  )
}
