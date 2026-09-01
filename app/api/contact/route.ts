import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

const TO = 'eric@ec-homes.com'
// Until ec-homes.com is verified in Resend, RESEND_FROM should stay on the
// shared onboarding sender. Once the domain is verified, set it to something
// like "EC Home Improvement <site@ec-homes.com>".
const FROM = process.env.RESEND_FROM || 'EC Home Improvement <onboarding@resend.dev>'

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

  const key = process.env.RESEND_API_KEY
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

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      reply_to: email,
      subject: `Walkthrough request — ${name}`,
      text,
      html:
        `<p><b>Name:</b> ${esc(name)}<br>` +
        `<b>Phone:</b> ${esc(phone) || '&mdash;'}<br>` +
        `<b>Email:</b> <a href="mailto:${esc(email)}">${esc(email)}</a></p>` +
        `<p style="white-space:pre-wrap">${esc(message) || '(no message)'}</p>` +
        `<p style="color:#888;font-size:12px">Sent from ec-homes.com</p>`,
    }),
  })

  if (!res.ok) {
    console.error('[contact] resend failed', res.status, await res.text().catch(() => ''))
    return NextResponse.json({ error: 'Could not send.' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
