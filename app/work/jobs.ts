/* The jobs on /work. Each is one project with the photographs of it that exist at page size
   (public/full). The unit is the job, not the category: a visitor hires off one kitchen they
   can see, not off a mosaic. Photos outside public/full stay on the house only. Order: the
   order is Eric's (Sep 5): the navy kitchen, brick and beams, the black kitchen, the olive house,
   the restaurant, FlexMarble, the white kitchen, the rest of the black house, then the rest. No shed: he painted that pool house and it did not photograph well. */
import full from '../../public/full/manifest.json'

export type Job = { id: string; name: string; line: string; photos: string[] }

export const JOBS: Job[] = [
  { id: 'navy-kitchen', name: 'A navy and white kitchen', line: 'Farmhouse sink under the window, brass lantern and pulls, the counter running out to become the sill.', photos: ['p3634', 'p3633', 'p3635', 'p3637', 'p3638', 'p3639'] },
  { id: 'brick-and-beams', name: 'Painted brick and beams', line: 'Exposed brick beside a black stair, beamed ceilings over the living room and a navy island, an arched niche, a white-painted fireplace. Painting throughout.', photos: ['p2627', 'p2624', 'p2625', 'p2626', 'p2628', 'p2629', 'p2630', 'p2631', 'p2632'] },
  { id: 'black-kitchen', name: 'The black kitchen', line: 'Matte black run with a waterfall stone island, walnut ledge, hex backsplash lit from under the cabinets, acacia floors.', photos: ['p3220', 'p3222', 'p3203', 'p3189', 'p3202', 'p3180', 'p3182', 'p3219'] },
  { id: 'green-house', name: 'Green, olive and white', line: 'A whole house repainted: the living room and stair hall, an olive dining wall, a teal-tiled bath, the bedrooms in white.', photos: ['p2637', 'p2640', 'p2642', 'p2644', 'p2646', 'p2648', 'p2650', 'p2645'] },
  { id: 'yankee-chipper', name: 'The Yankee Chipper, from studs to service', line: 'A restaurant Eric owned and built himself: the partitions framed, the mahogany booths panelled and finished, the green banquette, the bar, the dining room set for service.', photos: ['p9498', 'p9508', 'p9565', 'p9592', 'p9648', 'p9567', 'p9604', 'p9603', 'p9650', 'p9649', 'p9651', 'p9644', 'p9694', 'p9688', 'p9555', 'p9554', 'p9702', 'p1003', 'p1002', 'p4427', 'p9698', 'p9696'] },
  { id: 'flexmarble', name: 'FlexMarble walls', line: 'Real crushed marble on a flexible backing, printed with any image. A backlit peony and geometric panels with moss and florals.', photos: ['p4085', 'p4082'] },
  { id: 'white-kitchen', name: 'A white kitchen, opened up', line: 'Gas range on a butcher block counter, open shelving, the kitchen looking through to the stair, the dining room beside it.', photos: ['p2380', 'p2381', 'p2382', 'p2383', 'p2620', 'p2621', 'p2616'] },
  { id: 'black-house', name: 'The rest of the black house', line: 'Same rowhouse: the entry and stair painted black around a leaded glass door, an accent wall, and three baths on slate with walnut and glass.', photos: ['p3201', 'p3204', 'p3196', 'p3143', 'p3211', 'p3199', 'p3206', 'p3194', 'p3192', 'q0001', 'p3200', 'p3195'] },
  { id: 'painted-house', name: 'A house painted top to bottom', line: 'Shiplap living room, built-ins around the fireplace, a skylit bath, the dining room under a black chandelier.', photos: ['p2635', 'p2636', 'p2633', 'p2634', 'p2379'] },
  { id: 'black-frame-showers', name: 'Black-framed showers', line: 'White subway tile, a black shelf and hex floor, sliding black doors, a vanity under an arched mirror.', photos: ['p2811', 'p2812', 'p2822', 'p2813', 'p2821', 'p2814', 'p2820'] },
  { id: 'baths', name: 'Tub, tile and walnut', line: 'Tiled tub surrounds with black fittings, walnut vanities, striped paper and brass sconces, terrazzo and patterned floors, a powder room in dark green.', photos: ['p3193', 'p3205', 'p3210', 'p4804', 'p4803', 'p9473', 'p9474', 'p9471', 'p9472', 'p4036'] },
  { id: 'outdoor-rooms', name: 'Outdoor rooms', line: 'A covered bar and patio in stone and timber, a pergola, a timber playset with a slide built into the yard, a new rear door, a detached garage.', photos: ['p1426', 'p1429', 'p1427', 'p1428', 'p3682', 'p3681', 'p3947', 'p3954', 'p3955', 'p3956'] },
  { id: 'exteriors', name: 'Doors and landings', line: 'A front door painted grey against the brick, a landing in white with a black rail.', photos: ['p2456', 'p2447'] },
]

/* Photographs that exist only at page size, sent by Eric from his phone (Drive), and so are not
   on the house or in work-manifest.json. Slugs start with q. */
export const EXTRA: Record<string, string> = {
  q0001: 'Basin tucked under the stair, copper tap',
}

export type Photo = { slug: string; w: number; h: number }
const size = new Map((full as Photo[]).map((f) => [f.slug, f]))
export function photo(slug: string): Photo {
  const f = size.get(slug)
  if (!f) throw new Error(`no full-size file for ${slug}`)
  return f
}
