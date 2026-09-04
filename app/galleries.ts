/* The three photo pages off the reel: /kitchens, /bathrooms, /painting. Each shows every
   photograph of its kind that exists on the site at a size fit for a page — the ones in
   public/full. The other hundred-odd photos in the archive are only here as 200px globe
   tiles, and a tile blown up to a page reads as cheap, so they are left out until Eric
   supplies originals. Chapters and captions come from work-manifest.json, which carries
   the corrections (p2379-2383 are a kitchen remodel, not painting); sizes come from
   full/manifest.json so nothing is ever drawn past native. */
import work from './work-manifest.json'
import full from '../public/full/manifest.json'

export type Photo = { slug: string; w: number; h: number; alt: string }

export const GALLERIES = {
  kitchens: {
    title: 'Kitchens',
    line: 'From the layout drawing to the last cabinet pull. Custom to your specific vision.',
    description:
      'Kitchen remodels by EC Home Improvement across Philadelphia, Bucks, Montgomery and Delaware counties: navy and white, matte black, farmhouse sinks, hex tile, waterfall islands.',
  },
  bathrooms: {
    title: 'Bathrooms',
    line: 'Tile, stone, glass and light. The room you use first and last every day.',
    description:
      'Bathroom remodels by EC Home Improvement: tiled showers with black frames, walnut vanities, patterned floors and skylit ceilings, across Greater Philadelphia.',
  },
  painting: {
    title: 'Painting',
    line: 'Prep done properly, finish done by hand. Interior and exterior.',
    description:
      'Interior painting by EC Home Improvement: painted brick, beamed ceilings, shiplap and trim, cut in clean across Philadelphia and the surrounding counties.',
  },
} as const

export type Chapter = keyof typeof GALLERIES

export function photosFor(ch: Chapter): Photo[] {
  const size = new Map((full as { slug: string; w: number; h: number }[]).map((f) => [f.slug, f]))
  const all = (work as { ch: string; slug: string; alt: string }[])
    .filter((t) => t.ch === ch && size.has(t.slug))
    .map((t) => ({ slug: t.slug, w: size.get(t.slug)!.w, h: size.get(t.slug)!.h, alt: t.alt }))
  /* Hang order. A landscape file takes two columns of the four, so a row is one wide and
     two tall; dealing them out that way keeps every row full and stops the wide MLS shots,
     which sort first in the archive, from stacking into a column of huge photographs. */
  const wide = all.filter((p) => p.w > p.h)
  const tall = all.filter((p) => p.w <= p.h)
  const out: Photo[] = []
  while (wide.length || tall.length) {
    if (wide.length) out.push(wide.shift()!)
    if (tall.length) out.push(tall.shift()!)
    if (tall.length) out.push(tall.shift()!)
  }
  return out
}
