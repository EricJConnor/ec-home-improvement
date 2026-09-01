/* ec-homes.com — page behaviour.
 *
 * Loaded by the Next.js app and inlined verbatim into the standalone preview,
 * so the two can never drift apart.
 *
 * Two orchestrated moments, nothing else:
 *   1. the hero pins while the footage darkens to ink and the headline settles
 *   2. the work reel pins while vertical scroll drags it sideways, the plates
 *      travelling inside their frames so the pass has depth
 *
 * The reel now pins on phones too — previously it fell back to a manual swipe,
 * which meant the one piece of choreography on the page simply didn't happen
 * on the device most people will see it on.
 */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp01 = function (n) { return Math.min(1, Math.max(0, n)); };

  /* ---------- hero ---------- */
  var wrap = document.querySelector('.hero-wrap'),
      dim  = document.querySelector('.dim'),
      copy = document.querySelector('.hero-copy'),
      vid  = document.querySelector('.hero video');

  function hero() {
    if (!wrap || !dim) return;
    var range = wrap.offsetHeight - innerHeight;
    if (range <= 0) return;
    var t = clamp01(-wrap.getBoundingClientRect().top / range);
    dim.style.opacity = Math.pow(t, 1.6) * 0.96;
    if (!reduce && copy) {
      copy.style.transform = 'translateY(' + (-t * 40) + 'px)';
      copy.style.opacity = 1 - Math.pow(t, 2.2);
    }
  }

  /* If the footage can't load, drop it and let the gradient poster carry the
     hero. With <source> children the failure lands on the sources, not the video. */
  if (vid) {
    var drop = function () { vid.style.display = 'none'; };
    vid.addEventListener('error', drop);
    [].forEach.call(vid.querySelectorAll('source'), function (s) {
      s.addEventListener('error', function () {
        if (vid.networkState === 3) drop();
      });
    });
  }

  /* ---------- header ---------- */
  var hdr = document.querySelector('.hdr'), lastY = 0;
  addEventListener('scroll', function () {
    var y = scrollY;
    if (hdr) hdr.classList.toggle('hide', y > lastY && y > 120);
    lastY = y;
  }, { passive: true });

  /* ---------- the reel ---------- */
  var strip = document.querySelector('.strip'),
      pin   = document.querySelector('.strip-pin'),
      track = document.querySelector('.strip-track'),
      bar   = document.querySelector('.strip-progress span'),
      panels = [].slice.call(document.querySelectorAll('.panel'));
  var dist = 0;
  var pinned = function () { return !reduce; };

  function size() {
    if (!strip || !pin || !track) return;
    if (!pinned()) { strip.style.height = ''; track.style.transform = ''; return; }
    /* measure the pin rather than innerHeight: on phones the address bar
       resizes the visual viewport mid-scroll and the two disagree. */
    dist = Math.max(0, track.scrollWidth - pin.clientWidth);
    strip.style.height = (pin.offsetHeight + dist) + 'px';
    slide();
  }

  function slide() {
    if (!strip || !track || !pinned() || dist <= 0) return;
    var t = clamp01(-strip.getBoundingClientRect().top / dist);
    track.style.transform = 'translate3d(' + (-t * dist) + 'px,0,0)';
    if (bar) bar.style.width = (t * 100) + '%';
    parallax();
  }

  /* Each plate's photo drifts against the reel's travel, so a panel crossing the
     middle of the screen reads as having depth rather than sliding flat. */
  function parallax() {
    if (reduce || !pin) return;
    var mid = pin.clientWidth / 2;
    for (var i = 0; i < panels.length; i++) {
      var img = panels[i].querySelector('img');
      if (!img) continue;
      var r = panels[i].getBoundingClientRect();
      var off = (r.left + r.width / 2) - mid;
      /* never drift further than the photo actually overhangs its frame, or the plate's
         own background shows at the trailing edge */
      var slack = Math.max(0, (img.offsetWidth - img.parentNode.clientWidth) / 2);
      var t = -off * 0.055;
      img.style.transform =
        'translate3d(' + Math.max(-slack, Math.min(slack, t)) + 'px,0,0)';
    }
  }

  addEventListener('scroll', function () { hero(); slide(); }, { passive: true });
  addEventListener('resize', function () { hero(); size(); });
  addEventListener('orientationchange', size);
  addEventListener('load', size);

  /* Panel photos are lazy by default, so the track's true width isn't known until
     they've decoded. Re-measure once they have. */
  var imgs = [].slice.call(document.querySelectorAll('.plate img'));
  var left = imgs.length;
  if (!left) size();
  imgs.forEach(function (i) {
    if (i.decode) i.decode().catch(function () {});
    var done = function () { if (--left <= 0) size(); };
    if (i.complete) done();
    else { i.addEventListener('load', done, { once: true }); i.addEventListener('error', done, { once: true }); }
  });
  hero(); size();

  /* Nav links land on the matching panel inside the reel. */
  [].forEach.call(document.querySelectorAll('a[href^="#"]'), function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href').slice(1);
      var panel = document.getElementById(id);
      if (!panel || !panel.classList.contains('panel') || !strip || !track) return;
      e.preventDefault();
      if (pinned()) {
        /* how far the reel must travel to bring this panel to the left margin */
        var travel = panel.offsetLeft - track.offsetLeft;
        var top = strip.getBoundingClientRect().top + scrollY;
        scrollTo({ top: top + Math.min(travel, dist), behavior: 'smooth' });
      } else {
        strip.scrollIntoView({ behavior: 'smooth' });
        track.scrollTo({ left: panel.offsetLeft - track.offsetLeft, behavior: 'smooth' });
      }
    });
  });

  /* ---------- the hairlines draw ----------
     The rules are already the site's signature, so they carry the motion between
     sections instead of a fade on every element. Each sweeps once, then stays. */
  var drawable = [].slice.call(document.querySelectorAll('.rule-draw, .contact .big-tel'));
  if (drawable.length) {
    if (!('IntersectionObserver' in window) || reduce) {
      drawable.forEach(function (el) { el.classList.add('drawn'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add('drawn');
          io.unobserve(e.target);       /* one sweep, never again */
        });
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.01 });
      drawable.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- the full-bleed breath ----------
     The photo drifts slowly against the scroll so the band reads as a held shot
     rather than a static picture. Small shift — it should be felt, not watched. */
  var band = document.querySelector('.band'), bandImg = band && band.querySelector('img');
  function bandDrift() {
    if (!band || !bandImg || reduce) return;
    var r = band.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    var t = (innerHeight - r.top) / (innerHeight + r.height);   /* 0 entering, 1 leaving */
    bandImg.style.transform = 'translate3d(0,' + ((t - 0.5) * 2 * -5.5) + '%,0)';
  }
  addEventListener('scroll', bandDrift, { passive: true });
  bandDrift();

  /* ---------- mobile menu ---------- */
  var b = document.querySelector('.burger'), s = document.getElementById('sheet');
  if (b && s) {
    b.addEventListener('click', function () { s.classList.add('open'); b.setAttribute('aria-expanded', 'true'); });
    [].forEach.call(s.querySelectorAll('a,button'), function (el) {
      el.addEventListener('click', function () { s.classList.remove('open'); b.setAttribute('aria-expanded', 'false'); });
    });
  }
})();
