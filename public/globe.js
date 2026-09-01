/* ec-homes.com — the work globe.
 *
 * 49 photographs distributed over a sphere, turning slowly, draggable, each one small
 * enough that the archive's 640px files are oversampled rather than stretched.
 *
 * Written against raw WebGL rather than three.js so the page carries no library and the
 * standalone preview stays self-contained. The <img> elements behind it are real: they
 * are the no-JS/no-WebGL rendering, they carry the alt text, and they are the texture
 * source, so nothing downloads twice.
 */
(function () {
  var root = document.getElementById('globe');
  if (!root) return;
  var canvas = root.querySelector('canvas');
  var imgs = [].slice.call(root.querySelectorAll('.tile img'));
  var cap = document.getElementById('globe-cap');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gl = null;
  try { gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: false }); } catch (e) {}
  if (!gl || !imgs.length) return;                    /* leave the plain grid in place */
  root.classList.add('live');

  var VS =
    'attribute vec2 p;uniform vec3 uC,uR,uU;uniform mat4 uProj;uniform float uHS;varying vec2 vUv;' +
    'void main(){vec3 w=uC+uR*(p.x*uHS)+uU*(p.y*uHS);vUv=vec2(p.x*0.5+0.5,0.5-p.y*0.5);' +
    'gl_Position=uProj*vec4(w.x,w.y,w.z-2.85,1.0);}';
  var FS =
    'precision mediump float;varying vec2 vUv;uniform sampler2D uTex;uniform float uA,uHi;' +
    'void main(){vec3 c=texture2D(uTex,vUv).rgb;' +
    /* tiles at the back sit down in the ink; the hovered one lifts to full */
    'c*=mix(0.74,1.12,uHi);gl_FragColor=vec4(c,uA);}';

  function sh(t, s) { var o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return o; }
  var pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS));
  gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(pr); gl.useProgram(pr);

  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  var aP = gl.getAttribLocation(pr, 'p');
  gl.enableVertexAttribArray(aP);
  gl.vertexAttribPointer(aP, 2, gl.FLOAT, false, 0, 0);

  var uC = gl.getUniformLocation(pr, 'uC'), uR = gl.getUniformLocation(pr, 'uR'),
      uU = gl.getUniformLocation(pr, 'uU'), uProj = gl.getUniformLocation(pr, 'uProj'),
      uHS = gl.getUniformLocation(pr, 'uHS'), uA = gl.getUniformLocation(pr, 'uA'),
      uHi = gl.getUniformLocation(pr, 'uHi');
  gl.uniform1i(gl.getUniformLocation(pr, 'uTex'), 0);
  gl.enable(gl.BLEND);
  gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.disable(gl.DEPTH_TEST);

  /* ---------- an even spread, not a grid: Fibonacci sphere ---------- */
  var N = imgs.length, GOLD = Math.PI * (3 - Math.sqrt(5));
  var tiles = imgs.map(function (img, i) {
    var y = 1 - (i / Math.max(1, N - 1)) * 2, r = Math.sqrt(Math.max(0, 1 - y * y)), th = GOLD * i;
    var n = [Math.cos(th) * r, y, Math.sin(th) * r];
    /* tangent basis so the tile lies flat against the sphere */
    var up0 = Math.abs(n[1]) > 0.97 ? [1, 0, 0] : [0, 1, 0];
    var rt = norm(cross(up0, n)), up = cross(n, rt);
    return { img: img, n: n, rt: rt, up: up, tex: null, el: img.parentNode };
  });
  function cross(a, b) { return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]]; }
  function norm(v) { var l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0]/l, v[1]/l, v[2]/l]; }

  function texture(img) {
    var t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    return t;
  }
  tiles.forEach(function (t) {
    if (t.img.complete && t.img.naturalWidth) t.tex = texture(t.img);
    else t.img.addEventListener('load', function () { t.tex = texture(t.img); }, { once: true });
  });

  /* ---------- projection ---------- */
  var proj = new Float32Array(16), W = 1, H = 1;
  function size() {
    var dpr = Math.min(2, devicePixelRatio || 1), b = root.getBoundingClientRect();
    W = Math.max(1, b.width); H = Math.max(1, b.height);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    var f = 1 / Math.tan((38 * Math.PI / 180) / 2), a = W / H, near = 0.1, far = 20;
    proj.set([f/a,0,0,0, 0,f,0,0, 0,0,(far+near)/(near-far),-1, 0,0,2*far*near/(near-far),0]);
    gl.uniformMatrix4fv(uProj, false, proj);
  }
  addEventListener('resize', size); size();

  /* ---------- input ---------- */
  var ry = 0.4, rx = -0.15, vy = reduce ? 0 : 0.0016, vx = 0;
  var drag = false, lx = 0, ly = 0, hover = -1, moved = 0;

  function down(e) { drag = true; moved = 0; var t = e.touches ? e.touches[0] : e; lx = t.clientX; ly = t.clientY; }
  function move(e) {
    var t = e.touches ? e.touches[0] : e;
    if (drag) {
      var dx = t.clientX - lx, dy = t.clientY - ly;
      moved += Math.abs(dx) + Math.abs(dy);
      vy = dx * 0.00042; vx = dy * 0.00042;
      ry += vy * 8; rx = Math.max(-0.9, Math.min(0.9, rx + vx * 8));
      lx = t.clientX; ly = t.clientY;
    }
    var b = root.getBoundingClientRect();
    pick(t.clientX - b.left, t.clientY - b.top);
  }
  function up() { drag = false; }
  root.addEventListener('mousedown', down);
  addEventListener('mousemove', move, { passive: true });
  addEventListener('mouseup', up);
  root.addEventListener('touchstart', down, { passive: true });
  root.addEventListener('touchmove', move, { passive: true });
  addEventListener('touchend', up);
  root.addEventListener('click', function () {
    if (moved > 12 || hover < 0) return;
    open(tiles[hover]);
  });

  var HS = 0.132, screenPos = [];
  function pick(px, py) {
    var best = -1, bd = 1e9;
    for (var i = 0; i < screenPos.length; i++) {
      var s = screenPos[i];
      if (!s || s.z <= 0.05) continue;
      var d = Math.hypot(s.x - px, s.y - py);
      if (d < s.r && d < bd) { bd = d; best = i; }
    }
    if (best !== hover) {
      hover = best;
      root.style.cursor = best >= 0 ? 'pointer' : '';
      if (cap) cap.textContent = best >= 0 ? tiles[best].img.getAttribute('alt') : '';
    }
  }

  function rot(v) {
    var cy = Math.cos(ry), sy = Math.sin(ry), cx = Math.cos(rx), sx = Math.sin(rx);
    var x = v[0]*cy + v[2]*sy, z = -v[0]*sy + v[2]*cy;      /* around Y */
    var y = v[1]*cx - z*sx;  z = v[1]*sx + z*cx;            /* then around X */
    return [x, y, z];
  }

  function frame() {
    if (!drag) { ry += vy; rx += vx; vy += ((reduce ? 0 : 0.0016) - vy) * 0.04; vx *= 0.92;
                 rx += (-0.15 - rx) * 0.008; }
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);

    var order = [], i;
    for (i = 0; i < tiles.length; i++) {
      var c = rot(tiles[i].n);
      order.push({ i: i, c: c, z: c[2] });
      var w = 2.85 - c[2], f = 1 / Math.tan((38 * Math.PI / 180) / 2);
      screenPos[i] = { x: (c[0] * f / (W / H) / w * 0.5 + 0.5) * W,
                       y: (0.5 - c[1] * f / w * 0.5) * H,
                       z: c[2], r: (HS * f / w * 0.5) * H * 0.95 };
    }
    order.sort(function (a, b) { return a.z - b.z; });        /* back to front for blending */

    gl.uniform1f(uHS, HS);
    for (i = 0; i < order.length; i++) {
      var t = tiles[order[i].i];
      var c = order[i].c;
      if (!t.tex || c[2] < 0.02) continue;
      gl.uniform3fv(uC, c);
      gl.uniform3fv(uR, rot(t.rt));
      gl.uniform3fv(uU, rot(t.up));
      gl.uniform1f(uA, Math.min(1, Math.max(0, (c[2] - 0.02) / 0.34)));
      gl.uniform1f(uHi, order[i].i === hover ? 1 : 0);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, t.tex);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ---------- the closer look ---------- */
  var ov = document.getElementById('ov'), ovImg = ov && ov.querySelector('img'),
      ovCap = ov && ov.querySelector('p');
  function open(t) {
    if (!ov) return;
    ovImg.src = t.img.getAttribute('data-full');
    ovImg.alt = t.img.getAttribute('alt');
    if (ovCap) ovCap.textContent = t.img.getAttribute('alt');
    ov.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function close() { if (!ov) return; ov.hidden = true; document.body.style.overflow = ''; }
  if (ov) {
    ov.addEventListener('click', close);
    addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }
})();
