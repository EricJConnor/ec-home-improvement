import ContactForm from './ContactForm'

/* The close of every page: phone huge, email, form, service area. */
export default function ContactBand() {
  return (
    <section className="sec contact rule-draw" id="contact">
      <h2 className="h-l">Book a walkthrough.</h2>
      <a className="big-tel" href="tel:+12159026636">215 902 6636</a>
      <p className="p" style={{ marginTop: 22 }}>
        Or write to{' '}
        <a className="mail-link" href="mailto:eric@ec-homes.com">
          eric@ec-homes.com
        </a>
        . Tell us the room and the rough idea. We&rsquo;ll come see it.
      </p>
      <ContactForm />
      <p className="area">
        Serving Philadelphia, Bucks County, Montgomery County, Delaware County, New Hope, Doylestown
        and the surrounding areas.
      </p>
    </section>
  )
}
