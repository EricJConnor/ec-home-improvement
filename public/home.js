/* ec-homes.com — the landing page's own behaviour (v5): the cycling words over the hero film,
   the panels receding as the next covers them, the photograph that follows the cursor on the
   work list, and films that only play on screen. motion.js still runs the booth reel and the
   plumb line further down. */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  var cyc = document.querySelector('.cyc');
  if (cyc) {
    var pairs = [['Work worth', 'coming home to.'], ['Kitchens', 'to the last pull.'], ['Bathrooms', 'done means done.'], ['Walls', 'nobody else does.'], ['Outdoors', 'built to stay.']];
    var A = cyc.querySelector('.a'), B = cyc.querySelector('.b'), ci = 0;
    [A, B].forEach(function (el) { var w = document.createElement('span'); w.className = 'w'; w.textContent = el.textContent; el.textContent = ''; el.appendChild(w); });
    if (!reduce) setInterval(function () {
      ci = (ci + 1) % pairs.length;
      cyc.classList.add('out');
      setTimeout(function () {
        A.firstChild.textContent = pairs[ci][0]; B.firstChild.textContent = pairs[ci][1];
        cyc.classList.remove('out'); cyc.classList.add('in');
        requestAnimationFrame(function () { requestAnimationFrame(function () { cyc.classList.remove('in'); }); });
      }, 620);
    }, 3400);
  }

  /* one film on a phone, and it is the tower sweep (Eric: "I like the movement better"); the
     right cell is hidden there, so the left cell's video swaps its sources before it plays */
  var phone = matchMedia('(max-width:820px)').matches;
  var lv = document.querySelector('.hero4 .l video[data-phone]');
  if (phone && lv) {
    var base = lv.getAttribute('data-phone');
    lv.poster = base + '-poster.jpg';
    [].forEach.call(lv.querySelectorAll('source'), function (src) {
      src.src = base + (src.type === 'video/webm' ? '.webm' : '.mp4');
    });
    lv.load(); var pr = lv.play(); if (pr && pr.catch) pr.catch(function () {});
  }

  /* the panels only stack (and recede) on screens wider than a phone; under 820px they flow */
  var pnls = [].slice.call(document.querySelectorAll('.pnl'));
  if (pnls.length && !reduce && !matchMedia('(max-width:820px)').matches) {
    var pn = function () {
      for (var i = 0; i < pnls.length - 1; i++) {
        var nt = pnls[i + 1].getBoundingClientRect().top;
        var pr = Math.max(0, Math.min(1, (innerHeight - nt) / innerHeight));
        pnls[i].style.transform = 'scale(' + (1 - pr * 0.06).toFixed(4) + ') translateY(' + (-pr * 4).toFixed(2) + 'vh)';
        pnls[i].style.opacity = (1 - pr * 0.4).toFixed(3);
      }
    };
    addEventListener('scroll', pn, { passive: true }); pn();
  }

  var prev = document.querySelector('.wl-prev');
  if (prev && fine) {
    var pimg = prev.querySelector('img'), px = 0, py = 0, tx = 0, ty = 0, on = false;
    document.querySelectorAll('.wl a').forEach(function (a) {
      a.addEventListener('mouseenter', function () { pimg.src = a.dataset.img; prev.classList.add('on'); on = true; });
      a.addEventListener('mouseleave', function () { prev.classList.remove('on'); on = false; });
    });
    addEventListener('mousemove', function (e) { tx = e.clientX + 28; ty = e.clientY - prev.clientHeight / 2; }, { passive: true });
    (function loop() { px += (tx - px) * 0.14; py += (ty - py) * 0.14; prev.style.transform = (on ? '' : 'scale(.94) rotate(-2deg) ') + 'translate(' + px.toFixed(1) + 'px,' + py.toFixed(1) + 'px)'; requestAnimationFrame(loop); })();
  }

  document.querySelectorAll('.hero4 video').forEach(function (v) {
    v.muted = true;
    var o = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause(); }); }, { threshold: 0.05 });
    o.observe(v);
  });
})();
