/* The jobs on /work. Each is one project with the photographs of it that exist at page size
   (public/full). The unit is the job, not the category: a visitor hires off one kitchen they
   can see, not off a mosaic. Photos outside public/full stay on the house only. Order: the
   strongest kitchens first, the restaurant last as proof of scope. */
import full from '../../public/full/manifest.json'

export type Job = { id: string; name: string; line: string; photos: string[] }

export const JOBS: Job[] = [
  { id: 'navy-kitchen', name: 'A navy and white kitchen', line: 'Farmhouse sink under the window, brass lantern and pulls, the counter running out to become the sill.', photos: ['p3634', 'p3633', 'p3635', 'p3637'] },
  { id: 'black-kitchen', name: 'The black kitchen', line: 'Matte black run with a waterfall stone island, walnut ledge, hex backsplash lit from under the cabinets, acacia floors.', photos: ['p3220', 'p3222', 'p3203', 'p3189', 'p3202'] },
  { id: 'white-kitchen', name: 'A white kitchen, opened up', line: 'Gas range on a wood counter, open shelving, the kitchen looking through to the stair.', photos: ['p2380', 'p2381', 'p2382', 'p2383'] },
  { id: 'brick-and-beams', name: 'Painted brick and beams', line: 'Exposed brick beside a black stair, beamed ceilings over a navy island, an arched niche, a white-painted fireplace. Painting throughout.', photos: ['p2627', 'p2626', 'p2628', 'p2629', 'p2630'] },
  { id: 'painted-house', name: 'A house painted top to bottom', line: 'Shiplap living room, built-ins around the fireplace, a skylit bath, the dining room under a black chandelier.', photos: ['p2635', 'p2636', 'p2633', 'p2634', 'p2379'] },
  { id: 'black-frame-showers', name: 'Black-framed showers', line: 'White subway tile, a black shelf and hex floor, a sliding black door.', photos: ['p2811', 'p2812', 'p2822'] },
  { id: 'baths', name: 'Tub, tile and walnut', line: 'Tiled tub surrounds with black fittings, walnut vanities, arched mirrors, striped paper and brass sconces, a patterned floor.', photos: ['p3193', 'p3205', 'p2820', 'p3210', 'p4804', 'p9473'] },
  { id: 'flexmarble', name: 'FlexMarble walls', line: 'Real crushed marble on a flexible backing, printed with any image. A backlit peony and geometric panels with moss and florals.', photos: ['p4085', 'p4082'] },
  { id: 'shed', name: 'The backyard shed', line: 'Modern shed with a black window and a cedar-framed roofline, under the trees.', photos: ['p1472', 'p1556', 'p1557'] },
  { id: 'outdoor-rooms', name: 'Outdoor rooms', line: 'A covered bar in stone and timber, a pergola over a stone patio, a timber playset built into the yard, a detached garage.', photos: ['p1426', 'p1428', 'p3682', 'p3954'] },
  { id: 'yankee-chipper', name: 'The Yankee Chipper, from studs to service', line: 'A restaurant Eric owned and built himself: mahogany booths, the bar, framing to finish.', photos: ['p9648', 'p9567', 'p9604', 'p9650', 'p9649', 'p9644', 'p9694', 'p9555'] },
]

export type Photo = { slug: string; w: number; h: number }
const size = new Map((full as Photo[]).map((f) => [f.slug, f]))
export function photo(slug: string): Photo {
  const f = size.get(slug)
  if (!f) throw new Error(`no full-size file for ${slug}`)
  return f
}
