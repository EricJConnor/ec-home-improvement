'use client'

import { useState } from 'react'

type State = 'idle' | 'sending' | 'sent' | 'error'

export default function ContactForm() {
  const [state, setState] = useState<State>('idle')
  const [why, setWhy] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (state === 'sending') return
    setState('sending')

    const data = Object.fromEntries(new FormData(e.currentTarget).entries())
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) { setState('sent'); return }
      /* say what went wrong, in words, so a failed test is diagnosable from the page */
      const j = await res.json().catch(() => ({}))
      setWhy(typeof j.error === 'string' ? j.error : `Error ${res.status}.`)
      setState('error')
    } catch {
      setWhy('No connection.')
      setState('error')
    }
  }

  // A failure takes the form's place at the same scale as the thank-you, with the reason
  // Resend gave. The old one-line note under the button went unread on a phone.
  if (state === 'error') {
    return (
      <div className="sent" role="alert">
        <p className="h-m">That didn&rsquo;t go through.</p>
        <p className="p" style={{ marginTop: 14 }}>
          The site said: &ldquo;{why}&rdquo;
        </p>
        <p className="p" style={{ marginTop: 14 }}>
          Call{' '}
          <a href="tel:+12159026636" style={{ color: '#fff', borderBottom: '1px solid var(--line)' }}>
            215 902 6636
          </a>{' '}
          or write to{' '}
          <a className="mail-link" href="mailto:eric@ec-homes.com">eric@ec-homes.com</a>.
        </p>
        <button className="btn" type="button" style={{ marginTop: 28 }} onClick={() => setState('idle')}>
          Try again
        </button>
      </div>
    )
  }

  // Plain confirmation state, same type scale as the rest of the section.
  if (state === 'sent') {
    return (
      <div className="sent">
        <p className="h-m">Thanks — we&rsquo;ve got it.</p>
        <p className="p" style={{ marginTop: 14 }}>
          Eric will call you back shortly. If it&rsquo;s urgent, ring{' '}
          <a href="tel:+12159026636" style={{ color: '#fff', borderBottom: '1px solid var(--line)' }}>
            215 902 6636
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="f-name">Name</label>
        <input id="f-name" name="name" autoComplete="name" required />
      </div>
      <div className="field">
        <label htmlFor="f-phone">Phone</label>
        <input id="f-phone" name="phone" type="tel" autoComplete="tel" />
      </div>
      <div className="field">
        <label htmlFor="f-email">Email</label>
        <input id="f-email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="field">
        <label htmlFor="f-msg">What can we do for you?</label>
        <textarea id="f-msg" name="message" />
      </div>

      {/* honeypot — hidden from people, catches the bots that fill every field */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="f-company">Company</label>
        <input id="f-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <button className="btn" type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? 'Sending…' : 'Send and we’ll call you'}
      </button>

    </form>
  )
}
