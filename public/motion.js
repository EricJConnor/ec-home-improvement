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
    /* The copy behaves like ordinary text for the first stretch of the pin: it rises with
       the finger, at the finger's speed, easing to a stop. Before, it sat fixed at the
       bottom of the screen and faded the moment you scrolled — and on a phone, scrolling is
       exactly what you do to bring the paragraph up to read it. The ink starts arriving
       only after that, and the copy is the last thing to go. */
    var d = clamp01((t - 0.25) / 0.75);
    dim.style.opacity = Math.pow(d, 1.4) * 0.96;
    if (!reduce && copy) {
      var a = 0.7, u = Math.min(t, a), rise = (u - u * u / (2 * a)) * range;
      var c = clamp01((t - 0.45) / 0.42);
      copy.style.transform = 'translateY(' + (-rise).toFixed(1) + 'px)';
      copy.style.opacity = 1 - Math.pow(c, 1.6);
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

  /* ---------- how we work: the booth reel ---------- */
  /* It plays itself. The first version was scroll-linked and Eric was right that it did not
     work: scroll-driven motion runs at whatever speed the reader scrolls, so a fast scroll
     skips the whole build and a slow one stutters frame to frame. A build sequence only
     reads as one if it keeps its own time. Runs only while on screen. */
  var build = document.querySelector('.build');
  if (build) {
    var frames = [].slice.call(build.querySelectorAll('img'));
    var seqBar = build.querySelector('.build-bar span');
    var idx = 0, timer = null;
    var HOLD = 1250, FINALE = 3200;   /* the last frame is the payoff — let it land */

    function show(i) {
      for (var k = 0; k < frames.length; k++) frames[k].classList.toggle('on', k === i);
      if (seqBar) seqBar.style.transform = 'scaleX(' + ((i + 1) / frames.length) + ')';
    }
    function advance() {
      idx = (idx + 1) % frames.length;
      show(idx);
      timer = setTimeout(advance, idx === frames.length - 1 ? FINALE : HOLD);
    }
    function play() { if (!timer) timer = setTimeout(advance, HOLD); }
    function stop() { clearTimeout(timer); timer = null; }

    show(0);
    if (!reduce) {
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (es) {
          es.forEach(function (e) { e.isIntersecting ? play() : stop(); });
        }, { threshold: 0.15 }).observe(build);
      } else play();
    }
  }

  /* ---------- the reel ---------- */
  var strip = document.querySelector('.strip'),
      pin   = document.querySelector('.strip-pin'),
      track = document.querySelector('.strip-track'),
      bar   = document.querySelector('.strip-progress span'),
      panels = [].slice.call(document.querySelectorAll('.panel'));
  var dist = 0, travel = 0, k = 1;
  var pinned = function () { return !reduce; };

  function size() {
    if (!strip || !pin || !track) return;
    if (!pinned()) { strip.style.height = ''; track.style.transform = ''; track.style.paddingRight = ''; return; }
    /* room after the last plate so a menu link can land it in the middle of the screen,
       and so the reel ends on a plate rather than running off the edge */
    var last = panels[panels.length - 1];
    if (last) track.style.paddingRight = Math.max(0, (pin.clientWidth - last.offsetWidth) / 2) + 'px';
    /* measure the pin rather than innerHeight: on phones the address bar
       resizes the visual viewport mid-scroll and the two disagree. */
    dist = Math.max(0, track.scrollWidth - pin.clientWidth);
    /* One screen of scrolling moves the reel about one plate. At 1:1 a single flick on a
       phone threw the whole reel past before anyone could look at it. */
    var step = panels.length > 1 ? panels[1].offsetLeft - panels[0].offsetLeft : pin.clientWidth;
    k = pin.offsetHeight / Math.max(1, step);
    /* a phone flick carries about a screen and a half, so on a narrow screen the reel is
       geared down further: one flick lands roughly one plate on, a slow thumb pulls it by hand */
    if (innerWidth <= 820) k *= 1.6;
    k = Math.max(1.2, Math.min(3.4, k));
    travel = dist * k;
    strip.style.height = (pin.offsetHeight + travel) + 'px';
    slide();
  }

  function slide() {
    if (!strip || !track || !pinned() || dist <= 0) return;
    var t = clamp01(-strip.getBoundingClientRect().top / travel);
    track.style.transform = 'translate3d(' + (-t * dist) + 'px,0,0)';
    if (bar) bar.style.transform = 'scaleX(' + t + ')';
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
      /* Scaled to the slack rather than a fixed factor. A fixed 0.055 hit the clamp almost
         at once on a wide screen — the photo sat pinned at maximum for the whole pass and
         the depth vanished, while a narrow phone kept its offsets small and looked right.
         Mapping the pin's half-width onto the overhang uses the full travel at every size. */
      /* a pixel short of the true overhang: at exactly the limit, sub-pixel rounding
         let a sliver of the plate show at the trailing edge */
      var slack = Math.max(0, (img.offsetWidth - img.parentNode.clientWidth) / 2 - 1);
      var t = -(off / mid) * slack;
      img.style.transform =
        'translate3d(' + Math.max(-slack, Math.min(slack, t)).toFixed(2) + 'px,0,0)';
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

  /* Nav links land the matching panel in the middle of the screen. */
  function goTo(panel, behavior) {
    if (pinned()) {
      var to = panel.offsetLeft + panel.offsetWidth / 2 - pin.clientWidth / 2;
      var top = strip.getBoundingClientRect().top + scrollY;
      scrollTo({ top: top + Math.max(0, Math.min(to, dist)) * k, behavior: behavior });
    } else {
      strip.scrollIntoView({ behavior: behavior });
      track.scrollTo({ left: panel.offsetLeft - track.offsetLeft, behavior: behavior });
    }
  }
  function panelFor(hash) {
    var panel = hash && hash.length > 1 && document.getElementById(hash.slice(1));
    return panel && panel.classList.contains('panel') && strip && track ? panel : null;
  }
  [].forEach.call(document.querySelectorAll('a[href^="#"]'), function (a) {
    a.addEventListener('click', function (e) {
      var panel = panelFor(a.getAttribute('href'));
      if (!panel) return;
      e.preventDefault();
      goTo(panel, 'smooth');
    });
  });
  /* Arriving from another page with #painting in the address, the browser jumps to the
     panel's own position — which is the top of the reel, showing the first plate, not
     the fifth. Land on it properly once the reel is measured. */
  var arrived = panelFor(location.hash);
  if (arrived) {
    var land = function () { size(); goTo(arrived, 'instant'); };
    land();
    addEventListener('load', function () { setTimeout(land, 0); }, { once: true });
  }

  /* ---------- the plumb drops ---------- */
  /* Its own observer, not the shared .rule-draw one: that fires as the row's top edge
     crosses the viewport, which for a tall row is several seconds before the reader is
     looking at it — the animation had already finished and read as static. This waits for
     the row to be properly on screen, and replays on re-entry rather than firing once. */
  var doneRow = document.querySelector('.mani-row.done');
  if (doneRow && 'IntersectionObserver' in window) {
    var plumb = doneRow.querySelector('.plumb');
    var bob = doneRow.querySelector('.plumb-bob');
    function armDrop() {
      if (!plumb || !bob) return;
      /* the fall is the container's height less the bob, measured rather than guessed so it
         lands on the end of the line at every breakpoint */
      doneRow.style.setProperty('--drop', -(plumb.offsetHeight - bob.offsetHeight) + 'px');
    }
    armDrop();
    addEventListener('resize', armDrop, { passive: true });

    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { armDrop(); doneRow.classList.add('dropped'); }
        else doneRow.classList.remove('dropped');   /* rearm for the next visit */
      });
    }, { threshold: 0.55 }).observe(doneRow);
  }

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
  var band = document.querySelector('.band'),
      bandLayers = band ? [].slice.call(band.querySelectorAll('img, .band-hex')) : [];
  function bandDrift() {
    if (!band || !bandLayers.length || reduce) return;
    var r = band.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    var t = (innerHeight - r.top) / (innerHeight + r.height);   /* 0 entering, 1 leaving */
    var y = 'translate3d(0,' + ((t - 0.5) * 2 * -5.5) + '%,0)';
    for (var i = 0; i < bandLayers.length; i++) bandLayers[i].style.transform = y;
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
