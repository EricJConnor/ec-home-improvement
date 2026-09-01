import SiteHeader from './components/SiteHeader'
import Logo from './components/Logo'
import Backdrop from './components/Backdrop'
import ContactBand from './components/ContactBand'
import Script from 'next/script'

export default function Home() {
  return (
    <>
      <SiteHeader />
      <Backdrop quiet />

      <main id="top">
        {/* HERO */}
        <div className="hero-wrap">
          <section className="hero" aria-label="Introduction">
            <div className="poster" />
            <video autoPlay muted loop playsInline preload="metadata" poster="/video/hero-poster.jpg">
              <source src="/video/hero.webm" type="video/webm" />
              <source src="/video/hero.mp4" type="video/mp4" />
            </video>
            <div className="veil" />
            <div className="grain" />
            <div className="dim" />
            <div className="hero-copy">
              <h1 className="h-xl">
                Work worth
                <br />
                coming home to.
              </h1>
              <p className="p">
                EC Home Improvement is the custom interiors specialist for Philadelphia and the
                surrounding counties. Unique spaces, built one at a time. Nothing off a shelf.
              </p>
            </div>
          </section>
        </div>

        {/* WORK: the reel */}
        <section className="strip" id="work" aria-label="What we build">
          <div className="strip-pin">
            <div className="strip-track">
              <article className="panel" id="kitchens">
                <div className="plate">
                  <img src="/assets/kitchens.jpg" alt="Farmhouse sink under the kitchen window, brass faucet, white counter running out to the sill, navy cabinets below" />
                </div>
                <div className="cap">
                  <h2>Kitchens</h2>
                  <p>From the layout drawing to the last cabinet pull. Custom to your specific vision.</p>
                </div>
              </article>
              <article className="panel" id="bathrooms">
                <div className="plate">
                  <img src="/assets/bathrooms.jpg" alt="Bathroom with striped wallpaper, walnut vanity and brass sconces" />
                </div>
                <div className="cap">
                  <h2>Bathrooms</h2>
                  <p>Tile, stone, glass and light. The room you use first and last every day.</p>
                </div>
              </article>
              <article className="panel wide" id="flexmarble">
                <div className="plate">
                  <img src="/assets/flexmarble-peony-panel.jpg" alt="Backlit peony printed across a FlexMarble wall" />
                </div>
                <div className="cap">
                  <h2>Statement Walls</h2>
                  <p>FlexMarble, SPC stone panels, and more. Truly unique products for one-off custom designs.</p>
                </div>
              </article>
              <article className="panel" id="outdoors">
                <div className="plate">
                  <img src="/assets/outdoors.jpg" alt="Modern backyard shed with a black window" />
                </div>
                <div className="cap">
                  <h2>Outdoors</h2>
                  <p>Patios, pergolas, outdoor bars and the structures that make a yard a room.</p>
                </div>
              </article>
              <article className="panel wide" id="painting">
                <div className="plate">
                  <img src="/assets/painting.jpg" alt="An arched niche in white-painted brick with a walnut ledge and brass pulls" />
                </div>
                <div className="cap">
                  <h2>Painting</h2>
                  <p>Prep done properly, finish done by hand. Interior and exterior.</p>
                </div>
              </article>
            </div>
            <div className="strip-progress" aria-hidden="true">
              <span />
            </div>
          </div>
        </section>

        {/* FLEXMARBLE */}
        <section className="sec light" id="fm">
          <div className="two">
            <h2 className="h-l">Walls people remember.</h2>
            <p className="p on-light">
              Two materials nobody expects. FlexMarble is real crushed marble on a thin, flexible
              backing, and our supplier can print any image you want straight into it. SPC is a rigid
              stone composite panel, fully waterproof, in marble, stone and wood looks. Both go up in a
              fraction of the time of real stone.
            </p>
          </div>
          <div className="fm-grid">
            <figure>
              <img src="/assets/flexmarble-peony.jpg" alt="A backlit peony printed across a full FlexMarble showroom wall" />
              <figcaption>A single peony across a full showroom wall.</figcaption>
            </figure>
            <figure className="tall">
              <img src="/assets/flexmarble-geometric.jpg" alt="Geometric FlexMarble panels with moss and trailing florals" />
              <figcaption>Panelled marble with living moss and trailing florals.</figcaption>
            </figure>
          </div>
          <div className="fm-more">
            <div>
              <h3 className="h-m">FlexMarble. Any image, real marble.</h3>
              <p className="p on-light" style={{ marginTop: 14 }}>
                Accent walls, columns, lobbies, bars, headboards, restaurant interiors. Nobody else in
                the region is printing into marble. Bring us the image and the room.
              </p>
            </div>
            <div>
              <h3 className="h-m">SPC. Stone looks, waterproof, no grout.</h3>
              <p className="p on-light" style={{ marginTop: 14 }}>
                Large-format panels for showers, kitchen walls and full feature walls. Marble, stone and
                wood finishes, seamless, and nothing to scrub out of grout lines.
              </p>
            </div>
          </div>
        </section>

        {/* THE BREATH: one full-bleed image between chapters */}
        <figure className="band">
          <img src="/assets/band-kitchen.jpg" alt="A matte black kitchen, its hex-tile backsplash lit from under the cabinets" />
          <div className="veil" />
          <div className="grain" />
          <figcaption>Matte black, hex tile, veined stone.</figcaption>
        </figure>

        {/* MANIFESTO */}
        <section className="sec rule-draw" id="how">
          <h2 className="h-l">How we work.</h2>
          <div className="mani">
            <div className="mani-row rule-draw">
              <div className="mani-plate">
                <img src="/assets/how-build.jpg" alt="A finished booth: green banquette, a round wood table and a brass lamp" />
              </div>
              <div className="mani-text">
                <h3>If it doesn't exist, we build it.</h3>
                <p>Custom booths, a bar from scratch, a marble wall with your photograph in it. "Off the shelf" isn't a phrase we use much.</p>
              </div>
            </div>
            <div className="mani-row rule-draw">
              <div className="mani-plate">
                <img src="/assets/how-done.jpg" alt="A finished shower in white subway tile with a black frame and hex floor" />
              </div>
              <div className="mani-text">
                <h3>Done means done.</h3>
                <p>The punch list gets finished, the site gets cleaned, and you don't chase us for the last ten percent.</p>
              </div>
            </div>
          </div>
        </section>

        {/* AGENTS */}
        <section className="sec light" id="agents">
          <div className="two">
            <h2 className="h-l">Agents, we've been in your corner for years.</h2>
            <p className="p on-light">
              Across Montgomery, Bucks, Delaware and Philadelphia, we've worked alongside agents and
              investors at every stage of a sale. We show up when you say, we finish when we said, and
              the house photographs the way you need it to.
            </p>
          </div>
          <div className="cols rule-draw on-light">
            <div>
              <h3>Before the listing</h3>
              <p>
                Pre-sale prep, punch lists and the refresh that moves a house from "needs work" to
                "move-in ready."
              </p>
            </div>
            <div>
              <h3>During the deal</h3>
              <p>
                Walkthroughs with you and your buyers. Straight answers on what it'll take and what
                it'll cost, before anyone signs.
              </p>
            </div>
            <div>
              <h3>After the closing</h3>
              <p>
                Renovating new purchases — kitchens, baths, whole floors — so your clients move into the
                house they pictured.
              </p>
            </div>
          </div>
        </section>

        <ContactBand />
      </main>

      <footer className="ftr">
        <a className="mark" href="#top"><Logo /><span className="mark-text">EC<b>Home Improvement</b></span></a>
        <div className="links">
          <div>
            <b>Work</b>
            <a href="#kitchens">Kitchens</a>
            <a href="#bathrooms">Bathrooms</a>
            <a href="#flexmarble">Statement Walls</a>
            <a href="#outdoors">Outdoors</a>
            <a href="#painting">Painting</a>
          </div>
          <div>
            <b>Partners</b>
            <a href="#agents">Real estate agents</a>
          </div>
          <div>
            <b>Contact</b>
            <a href="tel:+12159026636">215 902 6636</a>
            <a href="mailto:eric@ec-homes.com">eric@ec-homes.com</a>
          </div>
        </div>
        <p className="legal">© 2026 EC Home Improvement. Wyncote, Pennsylvania.</p>
      </footer>

      <Script src="/motion.js" strategy="afterInteractive" />
    </>
  )
}
