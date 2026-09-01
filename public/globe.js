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
    S = Math.round(R * 0.30);                 /* ~full coverage at this tile count */
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
  function apply() { sphere.style.transform = 'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)'; }
  function tick() {
    if (!drag) {
      ry += vy; rx += vx;
      vy += ((reduce ? 0 : 0.09) - vy) * 0.03;      /* ease back to the idle drift */
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

  /* ---------- naming and opening ---------- */
  tiles.forEach(function (t) {
    var img = t.querySelector('img');
    t.addEventListener('mouseenter', function () { if (cap) cap.textContent = img.getAttribute('alt') || ''; });
    t.addEventListener('mouseleave', function () { if (cap) cap.textContent = ''; });
    t.addEventListener('click', function (e) {
      if (moved > 10) return;                        /* that was a drag, not a click */
      e.preventDefault();
      open(img);
    });
  });

  var ov = document.getElementById('ov'), ovImg = ov && ov.querySelector('img'), ovCap = ov && ov.querySelector('p');
  function open(img) {
    if (!ov) return;
    ovImg.src = img.getAttribute('data-full') || img.src;
    ovImg.alt = img.getAttribute('alt') || '';
    if (ovCap) ovCap.textContent = img.getAttribute('alt') || '';
    ov.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function close() { if (ov) { ov.hidden = true; document.body.style.overflow = ''; } }
  if (ov) {
    ov.addEventListener('click', close);
    addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }
})();
