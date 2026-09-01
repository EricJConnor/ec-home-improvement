import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Bricolage_Grotesque } from 'next/font/google'
import './globals.css'
import { SITE, BIZ } from './site'
import StructuredData from './components/StructuredData'

// Self-hosted by next/font — no CDN link, no layout shift.
// opsz is the axis the display type leans on (`font-variation-settings:'opsz' 96`);
// wght is variable across 200–600 by default for this family.
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  axes: ['opsz'],
  display: 'swap',
  variable: '--font-bricolage',
})

const title =
  'EC Home Improvement — Kitchens, bathrooms, FlexMarble and outdoor rooms across Greater Philadelphia'
const description =
  'EC Home Improvement builds kitchens, bathrooms, outdoor rooms and custom FlexMarble statement walls across Philadelphia, Bucks, Montgomery and Delaware counties. Call 215-902-6636 to book a walkthrough.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title,
  description,
  alternates: { canonical: '/' },
  applicationName: BIZ.name,
  keywords: [
    'kitchen remodeling Philadelphia', 'bathroom remodeling Bucks County',
    'general contractor Montgomery County PA', 'home improvement Delaware County PA',
    'contractor Doylestown', 'contractor New Hope PA', 'FlexMarble', 'SPC wall panels',
    'interior painting Philadelphia', 'deck and patio builder Bucks County',
  ],
  authors: [{ name: BIZ.owner }],
  creator: BIZ.owner,
  openGraph: {
    title,
    description,
    siteName: BIZ.name,
    locale: 'en_US',
    type: 'website',
    url: SITE,
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'EC Home Improvement — Greater Philadelphia' }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og.jpg'],
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#141414',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={bricolage.variable}>
      <body>
        <StructuredData />
        {children}
        <Script src="/cursor.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
