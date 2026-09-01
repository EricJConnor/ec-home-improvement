import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque } from 'next/font/google'
import './globals.css'

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
  title,
  description,
  openGraph: { title, description, siteName: 'EC Home Improvement', locale: 'en_US', type: 'website' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#141414',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={bricolage.variable}>
      <body>{children}</body>
    </html>
  )
}
