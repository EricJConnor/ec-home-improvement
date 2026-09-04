# Google Business Profile — EC Home Improvement

**Status (4 Sep 2026): claimed, verified instantly, and filled.** Eric created it under
7echome@gmail.com; it is connected to Windsor.ai under his ejc1273@gmail.com Windsor login
(username eric77) with write actions on. Pushed through the `google_my_business` connector:
description, hours, all nine categories, eleven services, text-message and appointment links,
cover, eighteen gallery photos, and the first post. Place ID `ChIJc7WKB_P8ayIRhKWvJ89fn4E`,
location `locations/14849499194649271730`, Maps `https://maps.google.com/maps?cid=9340289495518389636`.
Google's own "processing your verification, up to 5 days" notice was showing on the dashboard
at the time; the listing is not public until that clears.

Still to do: the fourteen extra towns in the service area (Windsor needs a Google place ID per
town, which this environment cannot look up — add them in the dashboard under Edit profile →
Service area), the logo (`gbp/logo.png` needs a public URL; upload it in the dashboard), the
Q&A (not exposed by the connector; paste from section 11), posts two to four on a weekly
cadence, and the PA HIC number in the description.

Everything below is ready to paste. Where a line says **push**, it can be sent to the listing
directly through Windsor.ai once the profile is connected there, so Eric never has to type it.

## 1. Claim it (Eric, 15 minutes, phone is fine)

1. Sign in to Google as **7echome@gmail.com** and open https://business.google.com/create
2. Business name: **EC Home Improvement** — exactly that. No "Kitchens & Baths Philadelphia" tacked on;
   Google suspends listings for that and a suspension takes weeks to lift.
3. Business type: **Service business** (you go to the customer). Do **not** show an address. Enter the
   home address when asked — Google needs it to verify — then choose to hide it.
4. Service area: paste the list in section 3.
5. Phone **215 902 6636**, website **https://ec-homes.com**
6. Verification: for a service business Google usually asks for a **video**. Have ready, in one take:
   the truck or van with tools, the tools themselves, anything with the business name on it (a
   business card on the phone counts: ec-homes.com/card), and a job in progress if there is one.
   Sometimes it is a postcard instead; that takes about five days.
7. Connect the finished listing to Windsor.ai so the rest can be pushed:
   https://onboard.windsor.ai/connect?connector=google_my_business&next=/google_my_business/authorize

## 2. Categories (push)

Primary: **General contractor**
Additional, in this order:
1. Kitchen remodeler
2. Bathroom remodeling company
3. Remodeler
4. Painter
5. Deck builder
6. Interior construction contractor
7. Tile contractor
8. Carpenter

The primary category is the single strongest ranking signal on the listing. "General contractor"
wins because it is what people in Bucks and Montgomery search when they do not yet know what they
need, and every service below fits under it.

## 3. Service area (push, max 20)

Philadelphia, PA · Bucks County, PA · Montgomery County, PA · Delaware County, PA ·
Doylestown, PA · New Hope, PA · Newtown, PA · Yardley, PA · Langhorne, PA · Warminster, PA ·
Willow Grove, PA · Ambler, PA · Blue Bell, PA · Chestnut Hill, Philadelphia, PA · Media, PA ·
Havertown, PA · Wayne, PA · Jenkintown, PA

Counties first so the listing covers the whole territory, then the towns where the money is.
Google shows the listing to people searching *from* these places, so this is the one place a
town list is worth more than the sentence on the site.

## 4. Description (push — 748 of 750 characters)

EC Home Improvement is a general contractor serving Philadelphia, Bucks County, Montgomery County and Delaware County. Owner Eric Connor runs every job himself, from the first walkthrough to the last punch-list item. We build full kitchen and bathroom remodels, outdoor rooms, decks and patios, and interior and exterior painting, and we are the only contractor in the area installing FlexMarble, real crushed-marble panels that can be printed with any image, alongside SPC stone-composite walls for showers, kitchens and feature walls. If it doesn't exist, we build it: custom booths, bars, built-ins and framing to finish. The job isn't done until we walk it together. Call 215-902-6636 to book a walkthrough.

## 5. Services (push)

Each with a description Google shows under the listing. No prices; "Contact for quote" is the
right call for custom work.

- **Kitchen remodeling** — Full kitchen remodels: cabinetry, counters, tile and the finish work that makes them read as one room. One contractor from demo to the last cabinet pull.
- **Bathroom remodeling** — Bathrooms taken back to the studs and rebuilt. Tiled showers, double vanities, skylights, full gut renovations.
- **FlexMarble statement walls** — Real crushed marble on a flexible backing, printed to order with any image. Nobody else in the Philadelphia area installs it.
- **SPC stone wall panels** — Rigid stone-composite panels in marble, stone and wood looks. Fully waterproof, no grout, up in a fraction of the time of tile.
- **Interior painting** — Full interior repaints, cut in clean and finished properly. Walls, trim, ceilings, cabinets.
- **Exterior painting** — Exterior repaints and trim work that lasts.
- **Deck building** — Decks, pergolas and outdoor rooms that extend the house into the yard.
- **Patio construction** — Patios and hardscape built to drain and to last.
- **Custom carpentry and built-ins** — Booths, bars, shelving, feature walls and framing to finish. If it doesn't exist, we build it.
- **Pre-sale renovation for agents and investors** — Walkthroughs with agents and buyers, pre-listing prep and renovation of new purchases, on a timeline.
- **Restaurant and commercial buildouts** — Booths, bars and full interiors, from framing to service.

## 6. Hours (push)

Monday–Friday 7:00 AM – 6:00 PM · Saturday 8:00 AM – 2:00 PM · Sunday closed.
These are also in the site's structured data (`app/site.ts`, `HOURS`), so change both together.
If Eric wants different hours, say so and both get changed.

## 7. Attributes (push)

- Identifies as **owner-operated** (if offered)
- **On-site services**: yes
- **Online estimates**: no (the walkthrough is the estimate; that is the pitch)
- Appointment link: https://ec-homes.com/#contact

## 8. Photos (push — URLs are live on the site)

Google ranks listings with more photos higher and people click them far more. Upload in this order.

Logo: https://ec-homes.com/icon.svg (Google wants PNG/JPG; a 720x720 PNG of the mark on ink is in `gbp/logo.png`)
Cover: https://ec-homes.com/og.jpg

Kitchens (finished work; the sharp 1344px ones are painting jobs and say so in the caption):
- https://ec-homes.com/full/p3634.jpg — Farmhouse sink under the window, navy cabinets, brass gooseneck
- https://ec-homes.com/full/p3222.jpg — Hex-tile backsplash lit from under the cabinets
- https://ec-homes.com/full/p3633.jpg — Kitchen remodel
- https://ec-homes.com/full/p3635.jpg — Kitchen remodel
- https://ec-homes.com/full/p2379.jpg — Kitchen remodel, dining room under a black chandelier
- https://ec-homes.com/full/p2380.jpg — Kitchen remodel, white kitchen with wood counter
- https://ec-homes.com/full/p2381.jpg — Kitchen remodel, island with open shelving
- https://ec-homes.com/full/p2383.jpg — Kitchen remodel, stainless fridge and open shelves

Painting (MLS shots, cleared, watermark stays):
- https://ec-homes.com/full/p2627.jpg — Beamed ceiling over a navy island, interior painting
- https://ec-homes.com/full/p2628.jpg — Painted brick fireplace under painted beams
- https://ec-homes.com/full/p2629.jpg — Island kitchen under a white beamed ceiling
- https://ec-homes.com/full/p2635.jpg — White shiplap living room with fireplace
- https://ec-homes.com/full/p2636.jpg — Fireplace wall with built-in shelving
- https://ec-homes.com/full/p2626.jpg — Exposed brick beside a black stair

Bathrooms:
- https://ec-homes.com/full/p2633.jpg — Black-framed shower under a skylight
- https://ec-homes.com/full/p2634.jpg — Double vanity under a skylit ceiling

Statement walls:
- https://ec-homes.com/full/p4085.jpg — Backlit peony printed across a FlexMarble wall

Commercial:
- https://ec-homes.com/full/p9555.jpg — Restaurant dining room, wainscoting and framed prints

Then add **one new phone photo a week** from whatever job is running. Google's own guidance is
that listings adding photos regularly get more calls, and a phone photo of a job in progress
beats a polished one from two years ago because it proves the business is working this week.

## 9. First four posts (push, one a week)

Posts expire from the front of the listing after about a week, so the rhythm matters more
than any single one. Each has a "Learn more" button to the site.

**Post 1 — FlexMarble** (photo p4085)
Real crushed marble, printed with any image you want, on a wall in a day. FlexMarble is a
flexible marble panel nobody else in the Philadelphia area installs. This one is a peony
across a whole wall. If you have an image in mind, we can put it on the wall.
Button: Learn more → https://ec-homes.com/#walls

**Post 2 — The walkthrough** (photo p3634)
The job isn't done until we walk it together. Every EC Home Improvement project ends with the
owner and you going room by room before the last invoice. That is how a kitchen like this
one goes from finished to done.
Button: Call

**Post 3 — Kitchens** (photo p3222)
A kitchen remodel across Bucks, Montgomery and Delaware counties, run by one contractor from
demo to the last cabinet pull. Hex-tile backsplash, under-cabinet light, one room that reads
as one idea. Book a walkthrough and we will tell you what it takes.
Button: Learn more → https://ec-homes.com/#kitchens

**Post 4 — If it doesn't exist, we build it** (photo p9555)
Booths, bars, built-ins, feature walls, framing to finish. When the thing you want isn't in a
catalogue, we build it. This restaurant was framed, finished and opened by us.
Button: Learn more → https://ec-homes.com/work

## 10. Reviews — the part that actually brings business

Reviews decide who gets the call. Five recent reviews with photos beat fifty from three years ago.

**The link:** https://ec-homes.com/review — short enough to say out loud. It opens Google's
review box directly once the Place ID is set (section 12), and it is on the business card
page under "Leave a review", so at a walkthrough Eric can hold up the phone.

**When to ask:** at the end of the final walkthrough, in person, while they are standing in
the finished room. Not by email a week later. Then send this text the same evening:

> Thanks again for having us in, [name]. If you have two minutes, a Google review helps
> more than anything else we could do: ec-homes.com/review. A photo of the [kitchen] with
> it would be even better. — Eric

**Past customers:** go back through the phone. Every finished job from the last two years
gets one text, spaced out over a month so the reviews arrive naturally rather than in a
clump (Google filters clumps).

**Reply to every review within a day** (push via Windsor). Replies are public and Google
reads them; name the job and the town, because that is what the next searcher types.

Five stars:
> Thank you, [name]. The [navy kitchen in Doylestown] was a good one to build, and walking
> it with you at the end is the part of the job we like best. Enjoy it. — Eric

Four stars or a fair complaint:
> Thanks for the honest review, [name]. You're right about [the thing]; that's on us and it's
> what the walkthrough is for. I'd like to make it right — call me on 215 902 6636. — Eric

Unfair or fake:
> We don't have a record of working with you, [name]. If we did, call me directly on
> 215 902 6636 and I'll sort it out. — Eric
Then flag it to Google.

## 11. Questions and answers

The Q&A section is public and anyone can ask; seed it so the first thing people see is the
pitch. Post these as questions from the business account and answer them as the owner.

- **Do you do free estimates?** We do a walkthrough at your home first, which is free. The
  estimate comes from that, so it is a real number rather than a guess.
- **What areas do you cover?** Philadelphia, Bucks County, Montgomery County, Delaware County
  and the surrounding areas.
- **Are you licensed and insured?** Yes. [Eric: add the PA HIC number here — Pennsylvania
  requires it on all advertising over $500 anyway, and it belongs in the description too.]
- **What is FlexMarble?** Real crushed marble on a flexible backing that can be printed with
  any image. We are the only installer in the area. See ec-homes.com/#walls.
- **Do you work with real estate agents?** Yes. Pre-sale prep, walkthroughs with agents and
  buyers, and renovating new purchases on a timeline.
- **How long does a kitchen take?** Most full kitchens run four to eight weeks depending on
  cabinetry lead times. We give you a schedule at the walkthrough and keep to it.

## 12. After it is verified: wire it into the site

Two values go into Vercel → the project → Settings → Environment Variables → Production, then Redeploy:

- `NEXT_PUBLIC_GBP_PLACE_ID` — the listing's Place ID. Easiest: open the listing in Google
  Maps, Share, copy the link, and paste it here; the ID gets pulled from it.
- `NEXT_PUBLIC_GBP_MAPS_URL` — that same share link.
- `NEXT_PUBLIC_FACEBOOK_URL` — the business Facebook page, if there is one.

With those set, ec-homes.com/review opens the review box in one tap, and the site's
structured data links to the listing so Google treats the two as one business.

## 13. Weekly, ten minutes

- One photo from the current job.
- One post (rotate: a job, the walkthrough promise, FlexMarble, a before/after).
- Reply to any review.
- Answer any question.
- Check the listing's Insights: calls, direction requests, website clicks. That number is the
  scoreboard for all of this.

## 14. Things not to do

- Never add keywords or a town to the business name.
- Never buy reviews or ask for them from a batch of friends in one week.
- Never let a category sit that the business does not do; Google checks the site against them.
- Never change the address on the listing without expecting re-verification.
