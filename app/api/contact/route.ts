import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

// Every lead goes to both: the business address, and the Gmail Eric actually lives in.
const TO = ['eric@ec-homes.com', '7echome@gmail.com']
const FROM = process.env.RESEND_FROM || 'EC Home Improvement <onboarding@resend.dev>'
// Resend's own sender works with no domain set-up at all, but only to the address that owns
// the Resend account — which is the Gmail. If the ec-homes.com sender fails for any reason,
// the lead still lands there.
const FALLBACK_FROM = 'EC Home Improvement <onboarding@resend.dev>'
const FALLBACK_TO = ['7echome@gmail.com']

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)

export async function POST(req: Request) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Bad request.' }, { status: 400 })
  }

  // Honeypot: a real person never fills this, so accept and drop silently.
  if (str(body.company, 200)) return NextResponse.json({ ok: true })

  const name = str(body.name, 120)
  const phone = str(body.phone, 60)
  const email = str(body.email, 200)
  const message = str(body.message, 4000)

  if (!name || !email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: 'Please add your name and a valid email.' }, { status: 400 })
  }

  // trimmed: a key pasted into Vercel with a trailing space or line break makes fetch throw
  // on the Authorization header before Resend is ever reached
  const key = (process.env.RESEND_API_KEY || '').trim()
  if (!key) {
    // Better a visible failure than a lead that vanishes: the form falls back
    // to the phone number when this happens.
    console.error('[contact] RESEND_API_KEY is not set — submission not delivered:', {
      name, phone, email,
    })
    return NextResponse.json({ error: 'Email is not connected yet.' }, { status: 503 })
  }

  const text = [
    `Name:    ${name}`,
    `Phone:   ${phone || '—'}`,
    `Email:   ${email}`,
    '',
    message || '(no message)',
    '',
    '— sent from ec-homes.com',
  ].join('\n')

  const html =
    `<p><b>Name:</b> ${esc(name)}<br>` +
    `<b>Phone:</b> ${esc(phone) || '&mdash;'}<br>` +
    `<b>Email:</b> <a href="mailto:${esc(email)}">${esc(email)}</a></p>` +
    `<p style="white-space:pre-wrap">${esc(message) || '(no message)'}</p>` +
    `<p style="color:#888;font-size:12px">Sent from ec-homes.com</p>`

  const send = async (from: string, to: string[]) => {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: from.trim(), to, reply_to: email, subject: `Walkthrough request — ${name}`, text, html }),
      })
      if (res.ok) return null
      const detail = await res.json().catch(() => ({}))
      const reason = typeof detail?.message === 'string' ? detail.message : `Resend ${res.status}`
      console.error('[contact] resend failed', from, to, res.status, reason)
      return reason
    } catch (e) {
      // never a bare 500: whatever threw is the diagnosis, so it goes back to the page
      const reason = e instanceof Error ? e.message : String(e)
      console.error('[contact] send threw', from, reason)
      return reason
    }
  }

  let reason = await send(FROM, TO)
  if (reason && FROM !== FALLBACK_FROM) {
    const again = await send(FALLBACK_FROM, FALLBACK_TO)
    if (!again) return NextResponse.json({ ok: true, fallback: reason })
    reason = `${reason}; fallback: ${again}`
  }
  // The reason is shown on the page. It comes from Resend, not the visitor, so it is safe
  // to surface, and it turns "didn't go through" into something that can be fixed.
  if (reason) return NextResponse.json({ error: reason.slice(0, 200) }, { status: 502 })

  return NextResponse.json({ ok: true })
}
