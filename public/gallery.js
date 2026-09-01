/* ec-homes.com — the gallery's depth renderer.
 *
 * Every plate is drawn through ONE fixed, full-viewport WebGL canvas rather than a
 * canvas per plate: browsers cap WebGL contexts at roughly 16 and there are 49 plates,
 * so per-plate contexts would fail outright partway down the page.
 *
 * The DOM still holds a real <img> inside every plate. That is the no-JS/no-WebGL
 * rendering, it carries the alt text, and it doubles as the texture source, so nothing
 * is downloaded twice. When the renderer is live the images are simply made transparent.
 *
 * The effect itself: near pixels travel further than far ones, so a flat photograph
 * reads as a room you are leaning into.
 */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var plates = [].slice.call(document.querySelectorAll('.gp'));
  if (!plates.length) return;

  var canvas = document.getElementById('gl');
  var gl = null;
  if (!reduce && canvas) {
    try {
      gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: false });
    } catch (e) { gl = null; }
  }

  /* ---------- no WebGL: leave the plain images in place ---------- */
  if (!gl) {
    document.body.classList.add('no-gl');
    initRail();
    return;
  }
  document.body.classList.add('has-gl');

  var VS = 'attribute vec2 p;varying vec2 vUv;uniform vec4 uRect;' +
           'void main(){vUv=p*0.5+0.5;' +
           'gl_Position=vec4(uRect.x+(p.x*0.5+0.5)*uRect.z,uRect.y-(p.y*0.5+0.5)*uRect.w,0.,1.);}';
  var FS = 'precision highp float;varying vec2 vUv;uniform sampler2D uTex,uDep;' +
           'uniform vec2 uMouse;uniform float uAmt;' +
           'void main(){' +
           '  float d=texture2D(uDep,vUv).r;' +
           /* 0.45 rather than 0.5 so the picture plane sits just behind the frame */
           '  vec2 off=uMouse*(d-0.45)*uAmt;' +
           '  vec2 s=(vUv-0.5)/1.06+0.5+off;' +
           '  if(s.x<0.0||s.x>1.0||s.y<0.0||s.y>1.0){s=clamp(s,0.0,1.0);}' +
           '  gl_FragColor=texture2D(uTex,s);' +
           '}';

  function shader(type, src) {
    var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s;
  }
  var prog = gl.createProgram();
  gl.attachShader(prog, shader(gl.VERTEX_SHADER, VS));
  gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog); gl.useProgram(prog);

  var quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  var aP = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(aP);
  gl.vertexAttribPointer(aP, 2, gl.FLOAT, false, 0, 0);

  var uRect = gl.getUniformLocation(prog, 'uRect'),
      uMouse = gl.getUniformLocation(prog, 'uMouse'),
      uAmt = gl.getUniformLocation(prog, 'uAmt');
  gl.uniform1i(gl.getUniformLocation(prog, 'uTex'), 0);
  gl.uniform1i(gl.getUniformLocation(prog, 'uDep'), 1);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  /* ---------- textures, loaded as plates approach and evicted behind you ---------- */
  var MAX_LIVE = 26;
  var live = [];          /* least-recently-drawn first */

  function upload(src) {
    var t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    return t;
  }

  function release(pl) {
    if (pl._tex) { gl.deleteTexture(pl._tex); pl._tex = null; }
    if (pl._dep) { gl.deleteTexture(pl._dep); pl._dep = null; }
    pl._state = 0;
    pl.el.classList.remove('drawn');
  }

  function prepare(pl) {
    if (pl._state) return;
    pl._state = 1;
    var img = pl.el.querySelector('img');
    var dep = new Image();
    var ready = function () {
      if (!img.complete || !img.naturalWidth || !dep.complete || !dep.naturalWidth) return;
      if (pl._state !== 1) return;
      pl._tex = upload(img);
      pl._dep = upload(dep);
      pl._state = 2;
      pl.el.classList.add('drawn');       /* fades the DOM image out under the canvas */
      live.push(pl);
      while (live.length > MAX_LIVE) {
        var old = live.shift();
        if (old !== pl && !inView(old, 900)) release(old); else live.push(old);
        if (live.length > MAX_LIVE * 2) break;
      }
    };
    dep.onload = ready;
    dep.src = pl.el.getAttribute('data-depth');
    if (img.complete) ready(); else img.addEventListener('load', ready, { once: true });
  }

  function inView(pl, pad) {
    var r = pl.el.getBoundingClientRect();
    return r.bottom > -pad && r.top < innerHeight + pad;
  }

  var items = plates.map(function (el) { return { el: el, _state: 0, _tex: null, _dep: null }; });

  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) prepare(items[plates.indexOf(e.target)]); });
  }, { rootMargin: '600px 0px' });
  plates.forEach(function (el) { io.observe(el); });

  /* ---------- pointer ---------- */
  var mx = 0, my = 0, tx = 0, ty = 0;
  var coarse = matchMedia('(pointer: coarse)').matches;
  function point(e) {
    mx = (e.clientX / innerWidth - 0.5) * 2;
    my = (e.clientY / innerHeight - 0.5) * 2;
  }
  if (!coarse) addEventListener('mousemove', point, { passive: true });

  function sizeCanvas() {
    var dpr = Math.min(2, devicePixelRatio || 1);
    canvas.width = Math.max(1, Math.round(innerWidth * dpr));
    canvas.height = Math.max(1, Math.round(innerHeight * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  addEventListener('resize', sizeCanvas);
  sizeCanvas();

  var STRENGTH = 0.5;      /* Eric picked 50 on the test rig */

  function frame() {
    /* On touch there is no cursor, so the scroll itself drives the displacement. */
    if (coarse) { mx = 0; my = (scrollY / Math.max(1, innerHeight)) % 2 - 1; }
    tx += (mx - tx) * 0.07;
    ty += (my - ty) * 0.07;

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(uAmt, STRENGTH * 2.2);

    for (var i = 0; i < items.length; i++) {
      var pl = items[i];
      if (pl._state !== 2) continue;
      var r = pl.el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > innerHeight + 200 || r.width < 1) continue;

      /* plates nearer the middle of the screen respond most, so the page has a focus */
      var mid = (r.top + r.height / 2) / innerHeight;
      var falloff = Math.max(0.25, 1 - Math.abs(mid - 0.5) * 1.3);
      gl.uniform2f(uMouse, tx * 0.085 * falloff, ty * 0.085 * falloff);

      gl.uniform4f(uRect,
        (r.left / innerWidth) * 2 - 1,
        1 - (r.top / innerHeight) * 2,
        (r.width / innerWidth) * 2,
        (r.height / innerHeight) * 2);

      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, pl._tex);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, pl._dep);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  initRail();

  /* ---------- the chapter rail ---------- */
  function initRail() {
    var chapters = [].slice.call(document.querySelectorAll('.chapter'));
    var now = document.getElementById('rail-now');
    var links = [].slice.call(document.querySelectorAll('.rail a'));
    if (!chapters.length) return;
    function update() {
      var best = 0;
      for (var i = 0; i < chapters.length; i++) {
        if (chapters[i].getBoundingClientRect().top <= innerHeight * 0.45) best = i;
      }
      if (now) now.textContent = String(best + 1).padStart(2, '0');
      links.forEach(function (a, i) { a.classList.toggle('on', i === best); });
    }
    addEventListener('scroll', update, { passive: true });
    update();
  }
})();
