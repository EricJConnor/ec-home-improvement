import ContactForm from './components/ContactForm'
import SiteMotion from './components/SiteMotion'

export default function Home() {
  return (
    <>
      <header className="hdr">
        <a className="mark" href="#top" aria-label="EC Home Improvement, home">
          EC<span>Home Improvement</span>
        </a>
        <nav className="nav" aria-label="Primary">
          <a href="#kitchens">Kitchens</a>
          <a href="#bathrooms">Bathrooms</a>
          <a href="#flexmarble">Statement Walls</a>
          <a href="#outdoors">Outdoors</a>
          <a href="#painting">Painting</a>
          <a href="#how">How we work</a>
          <a href="#agents">Agents</a>
          <a href="#contact">Contact</a>
        </nav>
        <button className="burger" aria-expanded="false" aria-controls="sheet">
          Menu
        </button>
      </header>

      <div className="sheet" id="sheet">
        <button aria-label="Close menu">Close</button>
        <a href="#kitchens">Kitchens</a>
        <a href="#bathrooms">Bathrooms</a>
        <a href="#flexmarble">Statement Walls</a>
        <a href="#outdoors">Outdoors</a>
        <a href="#painting">Painting</a>
        <a href="#agents">Agents</a>
        <a href="#contact">Contact</a>
      </div>

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

        {/* WORK: horizontal strip */}
        <section className="strip" id="work" aria-label="What we build">
          <div className="strip-pin">
            <div className="strip-track">
              <article className="panel" id="kitchens">
                <img src="/assets/kitchens.jpg" alt="Black kitchen with hex-tile backsplash and acacia floors" />
                <div className="cap">
                  <h2>Kitchens</h2>
                  <p>From the layout drawing to the last cabinet pull. Custom to your specific vision.</p>
                </div>
              </article>
              <article className="panel" id="bathrooms">
                <img src="/assets/bathrooms.jpg" alt="Bathroom with striped wallpaper, walnut vanity and brass sconces" />
                <div className="cap">
                  <h2>Bathrooms</h2>
                  <p>Tile, stone, glass and light. The room you use first and last every day.</p>
                </div>
              </article>
              <article className="panel" id="flexmarble">
                <img src="/assets/flexmarble-peony-panel.jpg" alt="Backlit peony printed across a FlexMarble wall" />
                <div className="cap">
                  <h2>Statement Walls</h2>
                  <p>FlexMarble, SPC stone panels, and more. Truly unique products for one-off custom designs.</p>
                </div>
              </article>
              <article className="panel" id="outdoors">
                <img src="/assets/outdoors.jpg" alt="Modern backyard shed with a black window" />
                <div className="cap">
                  <h2>Outdoors</h2>
                  <p>Patios, pergolas, outdoor bars and the structures that make a yard a room.</p>
                </div>
              </article>
              <article className="panel" id="painting">
                <img src="/assets/painting.jpg" alt="Grey painted front door on a brick rowhouse" />
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

        {/* MANIFESTO */}
        <section className="sec" id="how">
          <h2 className="h-l">How we work.</h2>
          <div className="mani">
            <div>
              <h3>If it doesn't exist, we build it.</h3>
              <p>
                Custom booths, a bar from scratch, a marble wall with your photograph in it. "Off the
                shelf" isn't a phrase we use much.
              </p>
            </div>
            <div>
              <h3>No sales layer.</h3>
              <p>
                You talk to the person who'll do the work. Same person on the estimate, the job site and
                the final walkthrough.
              </p>
            </div>
            <div>
              <h3>We're not the cheapest.</h3>
              <p>
                A real crew, real materials and a finish date that holds cost what they cost. Cheap work
                is the most expensive kind.
              </p>
            </div>
            <div>
              <h3>Done means done.</h3>
              <p>
                The punch list gets finished, the site gets cleaned, and you don't chase us for the last
                ten percent.
              </p>
            </div>
          </div>
        </section>

        {/* AGENTS */}
        <section className="sec" id="agents">
          <div className="two">
            <h2 className="h-l">Agents, we've been in your corner for years.</h2>
            <p className="p">
              Across Montgomery, Bucks, Delaware and Philadelphia, we've worked alongside agents and
              investors at every stage of a sale. We show up when you say, we finish when we said, and
              the house photographs the way you need it to.
            </p>
          </div>
          <div className="cols">
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

        {/* CONTACT */}
        <section className="sec contact" id="contact">
          <h2 className="h-l">Book a walkthrough.</h2>
          <a className="big-tel" href="tel:+12159026636">
            215 902 6636
          </a>
          <p className="p" style={{ marginTop: 22 }}>
            Or write to{' '}
            <a href="mailto:eric@ec-homes.com" style={{ color: '#fff', borderBottom: '1px solid var(--line)' }}>
              eric@ec-homes.com
            </a>
            . Tell us the room and the rough idea. We'll come see it.
          </p>

          <ContactForm />

          <p className="area">
            Serving Philadelphia, Bucks County, Montgomery County, Delaware County, New Hope, Doylestown
            and the surrounding areas.
          </p>
        </section>
      </main>

      <footer className="ftr">
        <a className="mark" href="#top">
          EC<span>Home Improvement</span>
        </a>
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

      <SiteMotion />
    </>
  )
}
