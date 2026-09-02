/* The close of every page: phone huge, email, service area.
   The form is out at Eric's ask (Sep 2026) until the Resend key is sorted — ContactForm.tsx
   and the /api/contact route are still here, wired and tested, to put back in one line. */
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
      <p className="area">
        Serving Philadelphia, Bucks County, Montgomery County, Delaware County and the
        surrounding areas.
      </p>
    </section>
  )
}
