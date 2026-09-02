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
 *
 * Every tile shows a window onto one shared sheet (public/work/atlas-*.jpg). One request
 * instead of 137, and because the sheet is a progressive JPEG the whole sphere appears
 * at once and sharpens, rather than filling in a square at a time on a phone.
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
      /* photographs keep their own proportions; area-normalising the size means a wide
         one and a tall one still carry the same weight on the sphere */
      var ar = parseFloat(tiles[i].getAttribute('data-ar')) || 1, k = Math.sqrt(ar);
      var tw = Math.round(S * k), thh = Math.round(S / k);
      tiles[i].style.width = tw + 'px';
      tiles[i].style.height = thh + 'px';
      tiles[i].style.marginLeft = (-tw / 2) + 'px';
      tiles[i].style.marginTop = (-thh / 2) + 'px';
      tiles[i].style.transform =
        'rotateY(' + lon + 'deg) rotateX(' + (-lat) + 'deg) translateZ(' + R + 'px)';
    }
  }
  addEventListener('resize', layout);
  layout();
  stage.classList.add('live');

  /* ---------- turning ---------- */
  var ry = 20, rx = -12, vy = reduce ? 0 : 0.09, vx = 0, drag = false, lx = 0, ly = 0;
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

  /* ---------- pressing, dragging, tapping ----------
     One set of pointer events for mouse and finger alike. The sphere never stops turning,
     so a press and a release land on different tiles and the browser fires `click` on
     their common ancestor rather than on either one — so the press and the release are
     paired here, against the tile that was under the finger when the press began.

     Two things made a thumb miss where a mouse did not. The old test summed every wobble
     of the finger and called anything over ten pixels a drag, which a thumb exceeds while
     standing still; it is the straight-line distance now, with a wider allowance for
     touch. And a thumb lands beside a small tile as often as on it, so the press probes
     a ring around the point and takes the nearest tile it finds. */
  var pid = null, downX = 0, downY = 0, pressed = null, capTimer = 0;

  function tileFrom(node) {
    while (node && node !== stage) {
      if (node.classList && node.classList.contains('tile')) return node;
      node = node.parentNode;
    }
    return null;
  }
  /* elementFromPoint, never getBoundingClientRect: a tile on the far side still reports a
     rect but is culled by backface-visibility and cannot be pressed */
  function tileAt(x, y, reach) {
    var t = tileFrom(document.elementFromPoint(x, y));
    if (t || !reach) return t;
    for (var ring = 1; ring <= 2; ring++) {
      var r = reach * ring / 2;
      for (var a = 0; a < 8; a++) {
        var el = document.elementFromPoint(x + Math.cos(a * Math.PI / 4) * r, y + Math.sin(a * Math.PI / 4) * r);
        if ((t = tileFrom(el))) return t;
      }
    }
    return null;
  }
  function name(tile) {
    if (!cap) return;
    clearTimeout(capTimer);
    cap.textContent = tile.querySelector('img').getAttribute('alt') || '';
  }
  function unname(delay) {
    clearTimeout(capTimer);
    capTimer = setTimeout(function () { if (cap && !hovering) cap.textContent = ''; }, delay);
  }
  /* fetch the full-size file the moment a tile is touched, so the closer look has it as
     early as possible — on a desktop this already happened on hover */
  function prefetch(tile) {
    var full = tile.querySelector('img').getAttribute('data-full');
    if (full && !tile._pre) { tile._pre = new Image(); tile._pre.src = full; }
  }

  stage.addEventListener('pointerdown', function (e) {
    if (e.button !== 0 || pid !== null) return;
    if (e.pointerType === 'mouse') e.preventDefault();       /* no text selection, no image drag */
    pid = e.pointerId; downX = lx = e.clientX; downY = ly = e.clientY;
    pressed = tileAt(e.clientX, e.clientY, e.pointerType === 'touch' ? Math.max(16, S * 0.5) : 0);
    if (pressed) { pressed.classList.add('pressed'); prefetch(pressed); name(pressed); }
    drag = true; stage.classList.add('dragging');
  });
  addEventListener('pointermove', function (e) {
    if (e.pointerId !== pid || !drag) return;
    var dx = e.clientX - lx, dy = e.clientY - ly;
    lx = e.clientX; ly = e.clientY;
    vy = dx * 0.22; vx = -dy * 0.22;
    ry += vy; rx = Math.max(-62, Math.min(62, rx + vx));
    apply();
    /* once it has clearly travelled it is a drag, and the pressed tile lets go */
    if (pressed && Math.hypot(e.clientX - downX, e.clientY - downY) > slop(e)) release(false);
  }, { passive: true });
  function slop(e) { return e.pointerType === 'touch' ? 18 : 8; }
  function release(opening) {
    var t = pressed; pressed = null;
    if (!t) return;
    if (opening) setTimeout(function () { t.classList.remove('pressed'); }, 420);
    else { t.classList.remove('pressed'); if (!hovering) unname(900); }
  }
  function end(e) {
    if (e.pointerId !== pid) return;
    pid = null; drag = false; stage.classList.remove('dragging');
    var t = pressed;
    /* distance is the only test — a press that stays put opens, however long it is held,
       the way a button works; a time limit only punished a slow phone */
    var tap = e.type === 'pointerup' && !!t && Math.hypot(e.clientX - downX, e.clientY - downY) <= slop(e);
    release(tap);
    if (tap) { e.preventDefault(); open(t); }
  }
  addEventListener('pointerup', end);
  addEventListener('pointercancel', end);
  /* An <img> is natively draggable, so on a desktop a press-and-move on a tile starts the
     browser's own image drag and eats the mousemove — the sphere simply would not turn.
     Touch has no native drag, which is why the phone worked and the laptop did not. */
  stage.addEventListener('dragstart', function (e) { e.preventDefault(); });

  tiles.forEach(function (t) {
    t.addEventListener('mouseenter', function () {
      hovering = true;
      name(t);
      prefetch(t);
    });
    t.addEventListener('mouseleave', function () {
      hovering = false;
      /* hold the name for a moment: tiles slide out from under the cursor constantly,
         and clearing instantly makes the caption flicker */
      unname(500);
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
     picture just appears, and reads as pasted on top of the page.

     It no longer waits for the network. The frame is sized from the photograph's known
     dimensions and filled with the tile's own crop of the sheet, which is already on
     screen, so the flight begins on the tap; the full-size file fades in over it when it
     arrives. On a phone that wait was long enough to read as "nothing happened", and the
     second tap it invited closed the overlay the first had just opened. */
  var ov = document.getElementById('ov'),
      ovWrap = ov && ov.querySelector('.shotwrap'),
      ovImg = ov && ov.querySelector('.shot'),
      ovLo = ov && ov.querySelector('.lo'),
      ovBloom = ov && ov.querySelector('.bloom'),
      ovCap = ov && ov.querySelector('p'), fromTile = null, busy = false;

  function tileTransform(tile) {
    var t = tile.getBoundingClientRect(), f = ovWrap.getBoundingClientRect(), g = stage.getBoundingClientRect();
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

  /* the tile's window onto the sheet, redrawn at the overlay's size */
  function crop(el, tile, W, H) {
    if (!el) return;
    var v = function (n, from) { return parseFloat((from || tile).style.getPropertyValue(n)) || 0; };
    var ax = v('--ax'), ay = v('--ay'), aw = v('--aw') || 1, ah = v('--ah') || 1,
        AW = v('--AW', stage) || 1, AH = v('--AH', stage) || 1;
    var kx = W / aw, ky = H / ah;
    el.style.backgroundImage = 'url("' + tile.querySelector('img').src + '")';
    el.style.backgroundSize = (AW * kx) + 'px ' + (AH * ky) + 'px';
    el.style.backgroundPosition = (-ax * kx) + 'px ' + (-ay * ky) + 'px';
  }

  var openedAt = 0;

  function open(tile) {
    if (!ov || busy) return;
    openedAt = Date.now();
    var img = tile.querySelector('img');
    fromTile = tile;
    var full = img.getAttribute('data-full') || img.src;
    var alt = img.getAttribute('alt') || '';

    /* size the frame from the photograph's own dimensions, never above them */
    var fw = parseFloat(tile.getAttribute('data-fw')) || 640, fh = parseFloat(tile.getAttribute('data-fh')) || 480;
    var cs = getComputedStyle(ov), padX = (parseFloat(cs.paddingLeft) || 0) * 2;
    var s = Math.min(1, Math.min(760, innerWidth - padX) / fw, innerHeight * 0.78 / fh);
    var W = Math.round(fw * s), H = Math.round(fh * s);
    ovWrap.style.width = W + 'px'; ovWrap.style.height = H + 'px';
    crop(ovLo, tile, W, H);
    crop(ovBloom, tile, W, H);

    ovWrap.classList.remove('ready');
    ovImg.alt = alt;
    if (ovCap) ovCap.textContent = alt;
    var ready = function () { ovWrap.classList.add('ready'); };
    ovImg.src = full;
    if (ovImg.complete && ovImg.naturalWidth) ready();
    else ovImg.addEventListener('load', ready, { once: true });

    ov.hidden = false;
    ov.classList.remove('in');
    requestAnimationFrame(function () {
      var from = tileTransform(tile);
      if (from) {
        ovWrap.style.transition = 'none';
        ovWrap.style.transform = from;
        ovWrap.style.opacity = '0.6';
        ovWrap.getBoundingClientRect();                /* force the start state to stick */
        ovWrap.style.transition = '';
      }
      requestAnimationFrame(function () {
        ov.classList.add('in');
        ovWrap.style.transform = '';
        ovWrap.style.opacity = '';
      });
    });
  }

  function close() {
    if (!ov || ov.hidden || busy) return;
    busy = true;
    /* fly back into wherever that tile has turned to by now */
    var back = fromTile ? tileTransform(fromTile) : null;
    ov.classList.remove('in');
    if (back) { ovWrap.style.transform = back; ovWrap.style.opacity = '0'; }
    setTimeout(function () {
      ov.hidden = true; busy = false; fromTile = null;
      ovWrap.style.transition = 'none'; ovWrap.style.transform = ''; ovWrap.style.opacity = '';
      ovWrap.getBoundingClientRect(); ovWrap.style.transition = '';
    }, 460);
  }

  if (ov) {
    /* The tap that opens also produces a synthesized click a moment later, and on touch the
       browser hit-tests that click when it dispatches — by which time the overlay is covering
       the screen, so it lands here and closes what it just opened. Desktop sends it to the
       original tile instead, which is why this only ever broke on a phone. Ignore anything
       arriving in the first half second. */
    ov.addEventListener('click', function () {
      if (Date.now() - openedAt < 500) return;
      close();
    });
    addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }
})();
