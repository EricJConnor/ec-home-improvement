import { SITE, BIZ, AREAS, SERVICES } from '../site'

/* What Google reads. A contractor lives or dies on local search, so the point of this block
   is to state plainly what the business does and every area it does it in — the same list
   Eric gives on the phone, in the form search engines expect. */
export default function StructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['GeneralContractor', 'HomeAndConstructionBusiness', 'LocalBusiness'],
        '@id': `${SITE}/#business`,
        name: BIZ.name,
        url: SITE,
        telephone: BIZ.tel,
        email: BIZ.email,
        image: `${SITE}/og.jpg`,
        logo: `${SITE}/icon.svg`,
        priceRange: '$$',
        description:
          'Kitchens, bathrooms, FlexMarble statement walls, outdoor rooms and painting, built across Philadelphia and the counties around it.',
        founder: { '@type': 'Person', name: BIZ.owner },
        address: { '@type': 'PostalAddress', addressLocality: BIZ.city, addressRegion: BIZ.region, addressCountry: BIZ.country },
        areaServed: AREAS.map((a) => ({ '@type': 'Place', name: a })),
        knowsAbout: SERVICES.map(([name]) => name),
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Services',
          itemListElement: SERVICES.map(([name, description]) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name, description, areaServed: AREAS.map((a) => ({ '@type': 'Place', name: a })) },
          })),
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE}/#website`,
        url: SITE,
        name: BIZ.name,
        publisher: { '@id': `${SITE}/#business` },
        inLanguage: 'en-US',
      },
    ],
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
