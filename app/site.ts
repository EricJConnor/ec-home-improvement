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

/* The Google Business Profile. Everything here is empty until Eric has claimed and verified
   the listing; the site degrades to a Google search for the business name until then.
   - GBP_PLACE_ID: the Place ID Google assigns the listing (Business Profile → the listing's
     Maps URL, or https://developers.google.com/maps/documentation/places/web-service/place-id).
     It drives the "leave a review" link, which opens the review box directly.
   - GBP_MAPS_URL: the listing's share link, for sameAs in the structured data.
   Set both as NEXT_PUBLIC_* in Vercel; nothing else needs to change. */
export const GBP = {
  placeId: process.env.NEXT_PUBLIC_GBP_PLACE_ID ?? '',
  mapsUrl: process.env.NEXT_PUBLIC_GBP_MAPS_URL ?? '',
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? '',
}

/* Where a review request goes. With a Place ID this opens Google's review box in one tap;
   without one it opens the business in Google search, where the reviews panel is. */
export const REVIEW_URL = GBP.placeId
  ? `https://search.google.com/local/writereview?placeid=${GBP.placeId}`
  : `https://www.google.com/search?q=${encodeURIComponent(`${BIZ.name} Philadelphia reviews`)}`

/* Hours as stated on the Business Profile. Google cross-checks the site against the listing,
   so these must match what is set there — change both or neither. */
export const HOURS = [
  { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '07:00', closes: '18:00' },
  { days: ['Saturday'], opens: '08:00', closes: '14:00' },
]

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
