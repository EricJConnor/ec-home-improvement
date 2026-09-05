import SiteHeader from './components/SiteHeader'
import Logo from './components/Logo'
import Backdrop from './components/Backdrop'
import Script from 'next/script'

export default function Home() {
  return (
    <>
      <SiteHeader />
      <Backdrop quiet />
      <div className="rails" aria-hidden="true"><i /><i /><i /></div>

      <main id="top">
        {/* HERO: two cells cut on the grid. The sky on the left with the words cycling over it,
            the booth build on the right, one sentence in the black block. */}
        <section className="hero4" aria-label="Introduction">
          <div className="cell l">
            <video autoPlay muted loop playsInline preload="auto" poster="/video/skyline-poster.jpg" aria-label="The Center City Philadelphia skyline from Logan Square, day turning to dusk">
              <source src="/video/skyline.mp4" type="video/mp4" />
              <source src="/video/skyline.webm" type="video/webm" />
            </video>
            <div className="scrim" aria-hidden="true" />
            <h1 className="line4">Work worth<br />coming home to.</h1>
          </div>
          <div className="cell r">
            <video autoPlay muted loop playsInline preload="auto" poster="/video/river-poster.jpg" aria-label="A drone flight along the Schuylkill River at Conshohocken">
              <source src="/video/river.mp4" type="video/mp4" />
              <source src="/video/river.webm" type="video/webm" />
            </video>
          </div>
          <div className="cell k">
            <p>EC Home Improvement is the custom interiors specialist for Philadelphia and the surrounding counties. Unique spaces, built one at a time. Nothing off a shelf.</p>
            <a className="pill4" href="/work"><b></b>View our work</a>
          </div>
        </section>

        {/* STATEMENT */}
        <section className="stmt4">
          <p className="big">Kitchens, bathrooms, statement walls and painting for Philadelphia and the counties around it <span className="chip4">Bucks · Montgomery · Delaware</span>. Custom to your vision, built one at a time. The job isn&rsquo;t done until we walk it together.</p>
        </section>

        {/* WHAT WE BUILD: five full-screen panels that stack as you scroll */}
        <section className="svcs4" id="work" aria-label="What we build">
          <article className="pnl ink" id="kitchens">
            <div className="pin">
              <div className="copy">
                <span className="idx">01 <i>/ 05</i> &nbsp; Kitchens</span>
                <h2 className="ttl" dangerouslySetInnerHTML={{ __html: 'Kitchens.' }} />
                <p className="one">From the layout drawing to the hardware. Custom to your specific vision, built to be lived in.</p>
                <div className="tags"><span>Layout and cabinetry</span><span>Stone, tile, lighting</span><span>Farmhouse to matte black</span></div>
                <a className="btn4" href="/kitchens">See the kitchens <span className="ar">→</span></a>
              </div>
              <div className="art plate4">
                <img className="bloom" src="/assets/kitchens.jpg" alt="" aria-hidden="true" />
                <img className="shot" src="/assets/kitchens.jpg" alt="Farmhouse sink under the kitchen window, brass faucet, white counter running out to the sill, navy cabinets below" loading="lazy" />
              </div>
            </div>
          </article>
          <article className="pnl plaster" id="bathrooms">
            <div className="pin">
              <div className="copy">
                <span className="idx">02 <i>/ 05</i> &nbsp; Bathrooms</span>
                <h2 className="ttl" dangerouslySetInnerHTML={{ __html: 'The room you use<br />first and last.' }} />
                <p className="one">Tile, stone, glass and light. Vanities, showers and the details that make a small room feel considered.</p>
                <div className="tags"><span>Showers and wet rooms</span><span>Vanities and stone</span><span>Tile laid by hand</span></div>
                <a className="btn4" href="/bathrooms">See the bathrooms <span className="ar">→</span></a>
              </div>
              <div className="art plate4">
                <img className="bloom" src="/assets/bathrooms.jpg" alt="" aria-hidden="true" />
                <img className="shot" src="/assets/bathrooms.jpg" alt="Bathroom with striped wallpaper, walnut vanity and brass sconces" loading="lazy" />
              </div>
            </div>
          </article>
          <article className="pnl ink" id="flexmarble">
            <div className="pin">
              <div className="copy">
                <span className="idx">03 <i>/ 05</i> &nbsp; Statement Walls</span>
                <h2 className="ttl" dangerouslySetInnerHTML={{ __html: 'Walls people<br />remember.' }} />
                <p className="one">We source the materials nobody expects, and produce any look you want. Cutting-edge materials for executing one-of-a-kind visions.</p>
                <div className="tags"><span>FlexMarble</span><span>SPC panels</span><span>Stainless steel fabrics</span><span>Bio composites</span></div>
              </div>
              <div className="art plate4">
                <img className="bloom" src="/assets/flexmarble-peony-panel.jpg" alt="" aria-hidden="true" />
                <img className="shot" src="/assets/flexmarble-peony-panel.jpg" alt="Backlit peony printed across a FlexMarble wall" loading="lazy" />
              </div>
            </div>
          </article>
          <article className="pnl plaster" id="outdoors">
            <div className="pin">
              <div className="copy">
                <span className="idx">04 <i>/ 05</i> &nbsp; Outdoors</span>
                <h2 className="ttl" dangerouslySetInnerHTML={{ __html: 'Custom backyard<br />experiences.' }} />
                <p className="one">Patios, pergolas, outdoor bars and the structures that make the outside part of the house. Built the way we build inside.</p>
                <div className="tags"><span>Patios and pergolas</span><span>Outdoor bars</span><span>Sheds and structures</span></div>
              </div>
              <div className="art plate4">
                <img className="bloom" src="/assets/outdoors.jpg" alt="" aria-hidden="true" />
                <img className="shot" src="/assets/outdoors.jpg" alt="Modern backyard shed with a black window" loading="lazy" />
              </div>
            </div>
          </article>
          <article className="pnl ink" id="painting">
            <div className="pin">
              <div className="copy">
                <span className="idx">05 <i>/ 05</i> &nbsp; Painting</span>
                <h2 className="ttl" dangerouslySetInnerHTML={{ __html: 'Prep done properly.<br />Finish done by hand.' }} />
                <p className="one">Interior and exterior. The prep is where the job is won, and it is the part you never see.</p>
                <div className="tags"><span>Interior and exterior</span><span>Cabinets and trim</span><span>Pre-sale refresh</span></div>
                <a className="btn4" href="/painting">See the painting <span className="ar">→</span></a>
              </div>
              <div className="art plate4">
                <img className="bloom" src="/assets/painting.jpg" alt="" aria-hidden="true" />
                <img className="shot" src="/assets/painting.jpg" alt="An arched niche in white-painted brick with a walnut ledge and brass pulls" loading="lazy" />
              </div>
            </div>
          </article>
        </section>

        {/* THE BREATH: one full-bleed image between chapters */}
        <figure className="band">
          <img src="/assets/band-kitchen.jpg" alt="A matte black kitchen, its hex-tile backsplash lit from under the cabinets" />
          <div className="band-hex" aria-hidden="true"><div className="band-lines" /><div className="band-lit"><div className="pool" /></div></div>
          <div className="veil" />
          <div className="grain" />
          <figcaption>Matte black, hex tile, veined stone.</figcaption>
        </figure>

        {/* OUR WORK: the names, huge; a photograph floats beside the one under the cursor */}
        <section className="wl4" id="photos">
          <div className="lab4"><span>Our work</span><i /><span>Hover a name</span></div>
          <ul className="wl">
            <li><a href="/kitchens" data-img="/assets/kitchens.jpg"><span className="nm">Kitchens</span><span className="ds">14 photographs</span></a></li>
            <li><a href="/bathrooms" data-img="/assets/bathrooms.jpg"><span className="nm">Bathrooms</span><span className="ds">9 photographs</span></a></li>
            <li><a href="/painting" data-img="/assets/painting.jpg"><span className="nm">Painting</span><span className="ds">9 photographs</span></a></li>
            <li><a href="/work" data-img="/assets/flexmarble-peony.jpg"><span className="nm">Every job</span><span className="ds">137 photographs, in one house</span></a></li>
          </ul>
          <div className="wl-prev" aria-hidden="true"><img alt="" /></div>
        </section>

        {/* MANIFESTO */}
        <section className="sec rule-draw" id="how">
          <h2 className="h-l">How we work.</h2>
          <div className="mani">
            {/* The one place on the site that shows process rather than result: the same
                restaurant booth from bare studs to service, built by the scroll. */}
            <div className="mani-row rule-draw">
              <figure className="build" aria-label="A restaurant booth built from framing to finished">
                {[
                  ['build-1',  'Bare timber framing standing in the empty dining room'],
                  ['build-2',  'Framing run out across the floor'],
                  ['build-3',  'The first mahogany panel skinned, still taped at the base'],
                  ['build-4',  'A second panel up, tape still down'],
                  ['build-5',  'Booth backs in, chairs stacked, floor still covered'],
                  ['build-6',  'The run of partitions standing, site not yet cleared'],
                  ['build-7',  'The finished row of mahogany partitions, floor clear'],
                  ['build-8',  'The green banquette in'],
                  ['build-9',  'Table and lamp set in the booth'],
                  ['build-10', 'Finished and lit, ready for service'],
                ].map(([f, alt], i) => (
                  <img key={f} src={`/assets/${f}.jpg`} alt={alt} data-i={i}
                       loading="lazy" decoding="async" />
                ))}
                <span className="build-bar" aria-hidden="true"><span /></span>
              </figure>
              <div className="mani-text">
                <h3>If it doesn't exist, we build it.</h3>
                <p>Custom booths, a bar from scratch, a marble wall with your photograph in it. "Off the shelf" isn't a phrase we use much.</p>
              </div>
            </div>

            {/* No photograph here on purpose. This one is a promise, not a product — a picture
                beside it turns it into a caption for the picture. The plumb line is the mark's
                own figure: it swings in and comes to rest, which is the whole claim. */}
            <div className="mani-row done rule-draw">
              <div className="done-text">
                <h3 className="h-xl">Done means done.</h3>
                <p className="done-lead">The job isn't done until we walk it together.</p>
                <p>The punch list gets finished, the site gets cleaned, and you don't chase us for the last ten percent.</p>
              </div>
              <div className="plumb" aria-hidden="true">
                <span className="plumb-arm"><span className="plumb-line" /><span className="plumb-bob" /></span>
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

        {/* CONTACT: the black block, then the band */}
        <section className="ft4" id="contact">
          <div className="ftg">
            <div>
              <h2>Book a walkthrough.</h2>
              <p className="ftp">Tell us the room and the rough idea. We&rsquo;ll come see it.</p>
              <a className="tel4" href="tel:+12159026636">215 902 6636</a>
              <p className="ftp"><a href="mailto:eric@ec-homes.com">eric@ec-homes.com</a></p>
              <p className="ftp small">Serving Philadelphia, Bucks County, Montgomery County, Delaware County and the surrounding areas.</p>
            </div>
            <nav className="ftn"><a href="#kitchens">Kitchens</a><a href="#bathrooms">Bathrooms</a><a href="#flexmarble">Statement Walls</a><a href="#outdoors">Outdoors</a><a href="#painting">Painting</a><a href="#how">How we work</a><a href="#agents">Agents</a></nav>
          </div>
          <a className="talk" href="tel:+12159026636" aria-label="Book a walkthrough"><div className="run"><span>Book a walkthrough <i>↗</i></span><span>Book a walkthrough <i>↗</i></span><span>Book a walkthrough <i>↗</i></span><span>Book a walkthrough <i>↗</i></span></div></a>
        </section>
      </main>

      <footer className="ftr">
        <a className="mark" href="#top"><Logo /><span className="mark-text">Home Improvement</span></a>
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
        <p className="legal">© 2026 EC Home Improvement. Wyncote, Pennsylvania. Philadelphia footage: Chuck Homler (CC BY-SA 4.0), Chris Cafiero (CC BY 3.0).<a className="by" href="https://ecwd1.com" rel="noopener">Web design and powered by ecwd1.com</a></p>
      </footer>

      <Script src="/home.js" strategy="afterInteractive" />
      <Script src="/motion.js" strategy="afterInteractive" />
    </>
  )
}
