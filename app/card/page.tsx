import type { Metadata } from 'next'
import Link from 'next/link'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import Logo from '../components/Logo'
import { SITE, BIZ } from '../site'

export const metadata: Metadata = {
  title: 'Eric Connor — EC Home Improvement',
  description: `Save Eric Connor's contact details. ${BIZ.telDisplay} · ${BIZ.email}`,
  alternates: { canonical: '/card' },
  openGraph: { title: 'Eric Connor — EC Home Improvement', description: 'Kitchens, bathrooms, statement walls and outdoor rooms across Greater Philadelphia.' },
}

/* The QR is inlined rather than loaded as an image: this page is the thing Eric holds up
   when someone asks for a card, and it has to be on screen the instant it opens — no
   second request, no broken-image square in a basement with one bar of signal. */
function Qr() {
  const svg = readFileSync(join(process.cwd(), 'public', 'qr.svg'), 'utf8')
    .replace(/<\?xml[^>]*\?>\s*/, '')
    .replace('<svg ', '<svg class="qr-svg" shape-rendering="crispEdges" aria-hidden="true" ')
  return <div className="qr" dangerouslySetInnerHTML={{ __html: svg }} />
}

export default function Card() {
  return (
    <main className="card">
      <div className="card-inner">
        <Link href="/" className="card-mark">
          <Logo />
          <span className="mark-text">
            EC<b>Home Improvement</b>
          </span>
        </Link>

        <div className="card-who">
          <h1>{BIZ.owner}</h1>
          <p className="card-role">Owner · {BIZ.name}</p>
        </div>

        <Qr />
        <p className="card-hint">Point a camera here</p>

        <div className="card-lines">
          <a href={`tel:${BIZ.tel}`}>{BIZ.telDisplay}</a>
          <a href={`mailto:${BIZ.email}`}>{BIZ.email}</a>
          <a href={SITE}>{SITE.replace(/^https?:\/\//, '')}</a>
        </div>

        <a className="card-save" href="/vcard" download="eric-connor.vcf">
          Save to contacts
        </a>

        <div className="card-links">
          <Link href="/work">See the work</Link>
          <Link href="/#contact">Book a walkthrough</Link>
        </div>

        <p className="card-area">
          Philadelphia, Bucks County, Montgomery County, Delaware County, New Hope, Doylestown
          and the surrounding areas.
        </p>
      </div>
    </main>
  )
}
