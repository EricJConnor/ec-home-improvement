import { SITE, BIZ } from '../site'

/* Served rather than shipped as a static file so the URL inside the card always matches
   whatever domain the site is actually deployed on. */
export async function GET() {
  const vcf = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:Connor;Eric;;;`,
    `FN:${BIZ.owner}`,
    `ORG:${BIZ.name}`,
    'TITLE:Owner',
    `TEL;TYPE=CELL,VOICE:${BIZ.tel}`,
    `EMAIL;TYPE=WORK,INTERNET:${BIZ.email}`,
    `URL:${SITE}`,
    `ADR;TYPE=WORK:;;;${BIZ.city};${BIZ.region};;${BIZ.country}`,
    'NOTE:Kitchens, bathrooms, FlexMarble statement walls, outdoor rooms and painting across Philadelphia, Bucks, Montgomery and Delaware counties.',
    'END:VCARD',
    '',
  ].join('\r\n')

  return new Response(vcf, {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': 'attachment; filename="eric-connor.vcf"',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
