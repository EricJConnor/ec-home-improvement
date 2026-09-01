/* The cursor as a mote of marble dust.
 *
 * A ring in place of the arrow, and dust kicked up behind it — pale on the dark sections,
 * ink on the plaster ones, because a single colour disappears on one or the other.
 *
 * Rules it has to obey:
 *   - desktop with a real pointer only; a touch screen has no cursor to decorate
 *   - nothing at all under prefers-reduced-motion
 *   - dust is emitted by SPEED, not by time. Standing still leaves none, which is what
 *     makes it read as dust disturbed rather than a permanent effect
 *   - one canvas, never DOM nodes: this also runs over the 137-tile globe
 *   - the loop sleeps when the pointer stops and the last speck has faded
 *   - anything that sets its own meaningful cursor (the globe's grab, the overlay's
 *     zoom-out, text fields) keeps it, and the ring hides there rather than lying
 */
(function () {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var cv = document.createElement('canvas');
  cv.className = 'dust-canvas';
  cv.setAttribute('aria-hidden', 'true');
  var ring = document.createElement('div');
  ring.className = 'dust-ring';
  ring.setAttribute('aria-hidden', 'true');

  function mount() {
    document.body.appendChild(cv);
    document.body.appendChild(ring);
    document.documentElement.classList.add('has-dust');
  }
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount, { once: true });

  /* deliberately 1: specks are sub-pixel soft anyway, and a full-viewport canvas at
     dpr 2 quadruples the clear-and-fill every frame — the globe page cannot spare it */
  var ctx = cv.getContext('2d', { alpha: true }), dpr = 1;
  function size() {
    cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
    cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  size();
  addEventListener('resize', size, { passive: true });

  var bits = [], MAX = 190;
  var px = -999, py = -999, lx = -999, ly = -999, onLight = false, native = false;
  var running = false, idle = 0;

  /* A speck. Given a push away from the direction of travel, then it drifts and settles —
     dust does not fly, it hangs and falls. */
  function spawn(x, y, sp, dx, dy) {
    var a = Math.atan2(-dy, -dx) + (Math.random() - 0.5) * 1.5;
    var v = (0.18 + Math.random() * 0.5) * Math.min(3.2, sp * 0.16);
    bits.push({
      x: x + (Math.random() - 0.5) * 7,
      y: y + (Math.random() - 0.5) * 7,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v - 0.06,
      r: 0.35 + Math.random() * 1.5,
      life: 1,
      fade: 0.011 + Math.random() * 0.016,
      warm: Math.random(),
    });
    if (bits.length > MAX) bits.splice(0, bits.length - MAX);
  }

  function frame() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (var i = bits.length - 1; i >= 0; i--) {
      var b = bits[i];
      b.life -= b.fade;
      if (b.life <= 0) { bits.splice(i, 1); continue; }
      b.x += b.vx; b.y += b.vy;
      b.vx *= 0.94; b.vy = b.vy * 0.94 + 0.014;   /* drag, then a little gravity */
      var a = b.life * b.life * 0.75;             /* squared so it lingers then goes */
      ctx.fillStyle = onLight
        ? 'rgba(' + (46 + b.warm * 26) + ',' + (44 + b.warm * 24) + ',' + (40 + b.warm * 22) + ',' + a + ')'
        : 'rgba(' + (238 + b.warm * 17) + ',' + (234 + b.warm * 18) + ',' + (222 + b.warm * 24) + ',' + a + ')';
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, 6.283);
      ctx.fill();
    }
    if (bits.length) { idle = 0; requestAnimationFrame(frame); }
    else if (++idle < 8) requestAnimationFrame(frame);
    else { running = false; cv.style.visibility = 'hidden'; }
  }
  function wake() {
    cv.style.visibility = 'visible';
    if (!running) { running = true; idle = 0; requestAnimationFrame(frame); }
  }

  addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    px = e.clientX; py = e.clientY;
    if (lx < -900) { lx = px; ly = py; }
    var dx = px - lx, dy = py - ly, sp = Math.hypot(dx, dy);
    lx = px; ly = py;

    var el = e.target;
    onLight = !!(el && el.closest && el.closest('.sec.light'));
    /* respect any element that means something by its cursor */
    /* If the browser is drawing any cursor here, it means something — grab on the globe,
       zoom-out on the overlay, a text I-beam, pointer on a tile. Never draw two. */
    var cs = el && el.nodeType === 1 ? getComputedStyle(el).cursor : 'auto';
    /* the computed check alone reads only the exact event target, which on a form field is
       often the wrapper rather than the input — so name the regions outright as well */
    native = cs !== 'none' ||
      !!(el && el.closest && el.closest('input,textarea,select,#globe,#ov'));

    var hot = !!(el && el.closest && el.closest('a,button,.pill'));
    ring.style.transform =
      'translate3d(' + (px - (hot ? 19 : 11)) + 'px,' + (py - (hot ? 19 : 11)) + 'px,0)';
    ring.classList.toggle('big', hot && !native);
    ring.classList.toggle('on-light', onLight);
    ring.classList.toggle('hide', native);

    if (sp > 1.4 && !native) {
      var n = Math.min(4, 1 + (sp * 0.11) | 0);
      for (var k = 0; k < n; k++) spawn(px, py, sp, dx, dy);
      wake();
    }
  }, { passive: true });

  addEventListener('pointerdown', function () { ring.classList.add('press'); });
  addEventListener('pointerup', function () { ring.classList.remove('press'); });
  addEventListener('mouseleave', function () { ring.classList.add('hide'); });
  addEventListener('mouseenter', function () { if (!native) ring.classList.remove('hide'); });
})();
