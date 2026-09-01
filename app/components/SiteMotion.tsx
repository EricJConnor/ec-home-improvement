'use client'

import { useEffect } from 'react'

/**
 * The landing page's behaviour, ported 1:1 from reference/index.html.
 *
 * Two orchestrated moments and nothing else:
 *   1. the hero pins while the footage darkens to ink and the headline settles
 *   2. the work strip pins while vertical scroll drags it sideways, 1:1
 *
 * Plus the header hide-on-scroll-down and the mobile sheet. Everything is
 * driven off scroll position rather than IntersectionObserver so it stays
 * exact at any scroll speed, same as the reference.
 */
export default function SiteMotion() {
  useEffect(() => {
    const ac = new AbortController()
    const { signal } = ac
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches

    // ---------- hero ----------
    const wrap = document.querySelector<HTMLElement>('.hero-wrap')
    const dim = document.querySelector<HTMLElement>('.dim')
    const copy = document.querySelector<HTMLElement>('.hero-copy')
    const vid = document.querySelector<HTMLVideoElement>('.hero video')

    function tick() {
      if (!wrap || !dim) return
      const r = wrap.getBoundingClientRect()
      const range = wrap.offsetHeight - innerHeight
      if (range <= 0) return
      const t = Math.min(1, Math.max(0, -r.top / range))
      dim.style.opacity = String(Math.pow(t, 1.6) * 0.96)
      if (!reduce && copy) {
        copy.style.transform = 'translateY(' + -t * 40 + 'px)'
        copy.style.opacity = String(1 - Math.pow(t, 2.2))
      }
    }

    // ---------- header ----------
    const hdr = document.querySelector<HTMLElement>('.hdr')
    let lastY = 0
    addEventListener(
      'scroll',
      () => {
        const y = scrollY
        hdr?.classList.toggle('hide', y > lastY && y > 120)
        lastY = y
      },
      { passive: true, signal },
    )
    addEventListener('scroll', tick, { passive: true, signal })
    addEventListener('resize', tick, { signal })
    tick()

    // If the footage can't load, drop it and let the gradient poster carry the hero.
    // With <source> children the error surfaces on the sources, not the <video>.
    if (vid) {
      const dropVideo = () => {
        vid.style.display = 'none'
      }
      vid.addEventListener('error', dropVideo, { signal })
      vid.querySelectorAll('source').forEach((s) =>
        s.addEventListener(
          'error',
          () => {
            if (vid.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) dropVideo()
          },
          { signal },
        ),
      )
    }

    // ---------- work strip ----------
    const strip = document.querySelector<HTMLElement>('.strip')
    const track = document.querySelector<HTMLElement>('.strip-track')
    const bar = document.querySelector<HTMLElement>('.strip-progress span')
    const pinned = () => innerWidth > 820 && !reduce
    let dist = 0

    function slide() {
      if (!pinned() || !strip || !track) return
      const r = strip.getBoundingClientRect()
      const t = Math.min(1, Math.max(0, -r.top / dist))
      track.style.transform = 'translate3d(' + -t * dist + 'px,0,0)'
      if (bar) bar.style.width = t * 100 + '%'
    }

    function size() {
      if (!strip || !track) return
      if (!pinned()) {
        strip.style.height = ''
        track.style.transform = ''
        return
      }
      dist = track.scrollWidth - innerWidth
      strip.style.height = innerHeight + dist + 'px'
      slide()
    }

    addEventListener('scroll', slide, { passive: true, signal })
    addEventListener('resize', size, { signal })
    addEventListener('load', size, { signal })
    size()

    // decode every panel photo up front so the first pass doesn't stutter
    document.querySelectorAll<HTMLImageElement>('.panel img').forEach((i) => {
      if (i.decode) i.decode().catch(() => {})
    })

    // Panel photos are lazy by default; once they've all decoded the track's real
    // width is known, so re-measure. Cheap, and it fixes a short first drag.
    const imgs = Array.from(document.querySelectorAll<HTMLImageElement>('.panel img'))
    Promise.all(
      imgs.map((i) =>
        i.complete ? Promise.resolve() : new Promise<void>((res) => {
          i.addEventListener('load', () => res(), { once: true, signal })
          i.addEventListener('error', () => res(), { once: true, signal })
        }),
      ),
    ).then(() => size())

    // nav links land on the right panel inside the strip
    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
      a.addEventListener(
        'click',
        (e) => {
          const id = a.getAttribute('href')!.slice(1)
          const panel = document.getElementById(id)
          if (!panel || !panel.classList.contains('panel') || !strip || !track) return
          e.preventDefault()
          const idx = [].indexOf.call(track.children as never, panel as never)
          if (pinned()) {
            const top = strip.getBoundingClientRect().top + scrollY
            scrollTo({ top: top + idx * panel.offsetWidth, behavior: 'smooth' })
          } else {
            strip.scrollIntoView({ behavior: 'smooth' })
            track.scrollTo({ left: idx * panel.offsetWidth, behavior: 'smooth' })
          }
        },
        { signal },
      )
    })

    // ---------- mobile menu ----------
    const b = document.querySelector<HTMLButtonElement>('.burger')
    const s = document.getElementById('sheet')
    b?.addEventListener(
      'click',
      () => {
        s?.classList.add('open')
        b.setAttribute('aria-expanded', 'true')
      },
      { signal },
    )
    s?.querySelectorAll('a,button').forEach((el) =>
      el.addEventListener(
        'click',
        () => {
          s.classList.remove('open')
          b?.setAttribute('aria-expanded', 'false')
        },
        { signal },
      ),
    )

    return () => ac.abort()
  }, [])

  return null
}
