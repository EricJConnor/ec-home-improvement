/* One place for the facts that appear in metadata, structured data, the vCard and the QR.
   Set NEXT_PUBLIC_SITE_URL in Vercel if the domain ever changes — the sitemap, the canonical
   URLs, the link preview and the business card all read from here. */
export const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ec-homes.com').replace(/\/$/, '')

export const BIZ = {
  name: 'EC Home Improvement',
  owner: 'Eric Connor',
  tel: '+12159026636',
  telDisplay: '215 902 6636',
  email: 'eric@ec-homes.com',
  city: 'Philadelphia',
  region: 'PA',
  country: 'US',
}

/* The service-area line Eric wrote, kept verbatim on the page and split here for the
   structured data. Google reads areaServed; people read the sentence. */
export const AREAS = [
  'Philadelphia, PA',
  'Bucks County, PA',
  'Montgomery County, PA',
  'Delaware County, PA',
  'New Hope, PA',
  'Doylestown, PA',
]

export const SERVICES = [
  ['Kitchen remodeling', 'Full kitchen remodels — cabinetry, counters, tile and the finish work that makes them read as one room.'],
  ['Bathroom remodeling', 'Bathrooms taken back to the studs and rebuilt, from tiled showers to full gut renovations.'],
  ['FlexMarble and SPC statement walls', 'Real crushed marble on a flexible backing, and rigid stone composite panels — printed to order, up in a fraction of the time of stone.'],
  ['Outdoor rooms', 'Decks, patios, pergolas and the outdoor spaces that extend the house into the yard.'],
  ['Interior and exterior painting', 'Full interior repaints and exterior work, cut in clean and finished properly.'],
]
