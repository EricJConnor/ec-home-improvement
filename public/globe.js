/* ec-homes.com — the work globe.
 *
 * Built on CSS 3D transforms, deliberately, not WebGL. An earlier WebGL version
 * created a context, hid the fallback, and then drew nothing inside the artifact
 * sandbox — leaving a blank page. There is no equivalent silent failure here: if the
 * browser can transform a div it can draw this, the tiles are ordinary <img> elements,
 * and hover and click are native rather than raycast.
 *
 * Only the parent rotates each frame; every tile's own transform is set once. The
 * browser composites the whole preserve-3d subtree on the GPU, so 137 photographs
 * turning is about as cheap as one.
 */
(function () {
  var stage = document.getElementById('globe');
  if (!stage) return;
  var sphere = stage.querySelector('.sphere');
  var tiles = [].slice.call(stage.querySelectorAll('.tile'));
  var cap = document.getElementById('globe-cap');
  if (!sphere || !tiles.length) return;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- lay the tiles out on the sphere ---------- */
  var GOLD = Math.PI * (3 - Math.sqrt(5)), N = tiles.length, R = 300, S = 96;
  function layout() {
    var b = stage.getBoundingClientRect();
    R = Math.max(140, Math.min(b.width, b.height) * 0.44);
    S = Math.round(R * 0.265);               /* just under touching, so tiles don't clip */
    stage.style.setProperty('--r', R + 'px');
    stage.style.setProperty('--s', S + 'px');
    for (var i = 0; i < N; i++) {
      var y = 1 - (i / Math.max(1, N - 1)) * 2, r = Math.sqrt(Math.max(0, 1 - y * y)), th = GOLD * i;
      var lat = Math.asin(y) * 180 / Math.PI, lon = Math.atan2(Math.cos(th) * r, Math.sin(th) * r) * 180 / Math.PI;
      tiles[i].style.transform =
        'rotateY(' + lon + 'deg) rotateX(' + (-lat) + 'deg) translateZ(' + R + 'px)';
    }
  }
  addEventListener('resize', layout);
  layout();
  stage.classList.add('live');

  /* ---------- turning ---------- */
  var ry = 20, rx = -12, vy = reduce ? 0 : 0.09, vx = 0, drag = false, lx = 0, ly = 0, moved = 0;
  var hovering = false;
  function apply() { sphere.style.transform = 'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)'; }
  function tick() {
    if (!drag) {
      ry += vy; rx += vx;
      var idle = reduce ? 0 : (hovering ? 0.012 : 0.09);
      vy += (idle - vy) * 0.045;                     /* eases toward the idle drift */
      vx *= 0.93;
      rx += (-12 - rx) * 0.01;                       /* and settle back to the level */
    }
    rx = Math.max(-62, Math.min(62, rx));
    apply();
    requestAnimationFrame(tick);
  }
  apply();
  requestAnimationFrame(tick);

  function pt(e) { return e.touches ? e.touches[0] : e; }
  function down(e) { drag = true; moved = 0; var t = pt(e); lx = t.clientX; ly = t.clientY; stage.classList.add('dragging'); }
  function move(e) {
    if (!drag) return;
    var t = pt(e), dx = t.clientX - lx, dy = t.clientY - ly;
    moved += Math.abs(dx) + Math.abs(dy);
    vy = dx * 0.22; vx = -dy * 0.22;
    ry += vy; rx = Math.max(-62, Math.min(62, rx + vx));
    lx = t.clientX; ly = t.clientY;
    apply();
  }
  function up() { drag = false; stage.classList.remove('dragging'); }
  stage.addEventListener('mousedown', down);
  addEventListener('mousemove', move, { passive: true });
  addEventListener('mouseup', up);
  stage.addEventListener('touchstart', down, { passive: true });
  stage.addEventListener('touchmove', move, { passive: true });
  addEventListener('touchend', up);

  /* ---------- naming and opening ----------
     The sphere never stops turning, so a press and a release land on different tiles and
     the browser fires `click` on their common ancestor rather than on either one. Pair
     the press and release ourselves instead, against the tile that was under the cursor
     when the press happened. */
  var pressed = null, pressedAt = 0, capTimer = 0;

  function tileFrom(node) {
    while (node && node !== stage) {
      if (node.classList && node.classList.contains('tile')) return node;
      node = node.parentNode;
    }
    return null;
  }

  stage.addEventListener('pointerdown', function (e) {
    pressed = tileFrom(e.target); pressedAt = Date.now();
  });
  stage.addEventListener('pointerup', function (e) {
    var t = pressed; pressed = null;
    if (!t || moved > 10 || Date.now() - pressedAt > 600) return;
    e.preventDefault();
    open(t);
  });

  tiles.forEach(function (t) {
    var img = t.querySelector('img');
    t.addEventListener('mouseenter', function () {
      hovering = true;
      clearTimeout(capTimer);
      if (cap) cap.textContent = img.getAttribute('alt') || '';
      /* fetch the full-size file now, so the flight can start the instant it is clicked
         rather than after a round trip */
      var full = img.getAttribute('data-full');
      if (full && !t._pre) { t._pre = new Image(); t._pre.src = full; }
    });
    t.addEventListener('mouseleave', function () {
      hovering = false;
      /* hold the name for a moment: tiles slide out from under the cursor constantly,
         and clearing instantly makes the caption flicker */
      clearTimeout(capTimer);
      capTimer = setTimeout(function () { if (cap && !hovering) cap.textContent = ''; }, 500);
    });
  });

  /* the field behind everything leans the other way from the cursor */
  var bg = document.querySelector('.bg-inner');
  if (bg && !reduce) {
    var bxT = 0, byT = 0, bx = 0, by = 0;
    addEventListener('mousemove', function (e) {
      bxT = (e.clientX / innerWidth - 0.5) * 2; byT = (e.clientY / innerHeight - 0.5) * 2;
    }, { passive: true });
    (function bgTick() {
      bx += (bxT - bx) * 0.045; by += (byT - by) * 0.045;
      bg.style.transform = 'translate3d(' + (-bx * 26) + 'px,' + (-by * 20) + 'px,0)';
      requestAnimationFrame(bgTick);
    })();
  }

  /* ---------- pulling a photograph off the sphere ----------
     The overlay starts life at the exact position, size and lean of the tile that was
     clicked, then flies to the middle. That is what connects the two — without it the
     picture just appears, and reads as pasted on top of the page. */
  var ov = document.getElementById('ov'), ovImg = ov && ov.querySelector('img'),
      ovCap = ov && ov.querySelector('p'), fromTile = null, busy = false;

  function tileTransform(tile) {
    var t = tile.getBoundingClientRect(), f = ovImg.getBoundingClientRect(), g = stage.getBoundingClientRect();
    if (!t.width || !f.width) return null;
    var s = t.width / f.width;
    var dx = (t.left + t.width / 2) - (f.left + f.width / 2);
    var dy = (t.top + t.height / 2) - (f.top + f.height / 2);
    /* lean it the way that part of the sphere was facing */
    var ry = ((t.left + t.width / 2) - (g.left + g.width / 2)) / Math.max(1, g.width / 2);
    var rx = ((t.top + t.height / 2) - (g.top + g.height / 2)) / Math.max(1, g.height / 2);
    return 'translate(' + dx + 'px,' + dy + 'px) scale(' + s + ') ' +
           'rotateY(' + (ry * 46) + 'deg) rotateX(' + (-rx * 34) + 'deg)';
  }

  function open(tile) {
    if (!ov || busy) return;
    var img = tile.querySelector('img');
    fromTile = tile;
    ovImg.src = img.getAttribute('data-full') || img.src;
    ovImg.alt = img.getAttribute('alt') || '';
    if (ovCap) ovCap.textContent = img.getAttribute('alt') || '';
    ov.hidden = false;
    ov.classList.remove('in');

    var start = function () {
      var from = tileTransform(tile);
      if (from) {
        ovImg.style.transition = 'none';
        ovImg.style.transform = from;
        ovImg.style.opacity = '0.6';
        ovImg.getBoundingClientRect();                 /* force the start state to stick */
        ovImg.style.transition = '';
      }
      requestAnimationFrame(function () {
        ov.classList.add('in');
        ovImg.style.transform = '';
        ovImg.style.opacity = '';
      });
    };
    /* the full-size file may not be decoded yet; measuring before it is gives a wrong size */
    if (ovImg.complete && ovImg.naturalWidth) requestAnimationFrame(start);
    else ovImg.addEventListener('load', function () { requestAnimationFrame(start); }, { once: true });
  }

  function close() {
    if (!ov || ov.hidden || busy) return;
    busy = true;
    /* fly back into wherever that tile has turned to by now */
    var back = fromTile ? tileTransform(fromTile) : null;
    ov.classList.remove('in');
    if (back) { ovImg.style.transform = back; ovImg.style.opacity = '0'; }
    setTimeout(function () {
      ov.hidden = true; busy = false; fromTile = null;
      ovImg.style.transition = 'none'; ovImg.style.transform = ''; ovImg.style.opacity = '';
      ovImg.getBoundingClientRect(); ovImg.style.transition = '';
    }, 460);
  }

  if (ov) {
    ov.addEventListener('click', close);
    addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }
})();
