/* ============================================================
   Karún Travel Group — sensory FX (v22)
   · hero: sun glints on the water + drifting salt-air motes (canvas)
   · fleet cards: pointer glare + inner parallax (CSS vars only)
   · scroll "tide" progress var for browsers without scroll-driven CSS
   Remount-safe: the landing is re-created by the React runtime, so nothing
   here holds on to DOM nodes — a debounced MutationObserver re-attaches the
   canvas when a fresh <canvas class="krn-glint"> appears.
   Everything is skipped under prefers-reduced-motion (one still frame only).
   ============================================================ */
(function () {
  "use strict";
  var mqReduce = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  var glint = null;   // { canvas, stop() }

  /* ---------------- hero glints ---------------- */
  function startGlint(canvas) {
    var ctx = canvas.getContext("2d");
    if (!ctx) return null;
    var W = 0, H = 0, dpr = 1, raf = 0, running = false, visible = true, last = 0;
    var glints = [], motes = [];

    function rnd(a, b) { return a + Math.random() * (b - a); }
    function seed() {
      glints.length = 0; motes.length = 0;
      var n = Math.max(28, Math.min(84, Math.round(W / 18)));
      for (var i = 0; i < n; i++) {
        glints.push({ x: rnd(0.02, 0.98), y: rnd(0.52, 0.96), s: rnd(2.2, 6.4), p: rnd(0, 6.28), v: rnd(0.6, 1.7), warm: Math.random() < 0.35 });
      }
      for (var j = 0; j < 26; j++) {
        motes.push({ x: rnd(0, 1), y: rnd(0.1, 1), r: rnd(0.8, 2.1), vy: rnd(0.008, 0.026), vx: rnd(-0.006, 0.01), p: rnd(0, 6.28) });
      }
    }
    function resize() {
      var r = canvas.getBoundingClientRect();
      dpr = Math.min(1.5, window.devicePixelRatio || 1);
      W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      draw(performance.now());
    }
    function star(x, y, s, a, warm) {
      ctx.globalAlpha = a;
      ctx.strokeStyle = warm ? "#ffe6a8" : "#eafcff";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - s, y); ctx.lineTo(x + s, y);
      ctx.moveTo(x, y - s * 0.6); ctx.lineTo(x, y + s * 0.6);
      ctx.stroke();
      ctx.globalAlpha = a * 0.7;
      ctx.fillStyle = warm ? "#fff3cf" : "#ffffff";
      ctx.beginPath(); ctx.arc(x, y, Math.max(0.8, s * 0.22), 0, 6.283); ctx.fill();
    }
    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      var sec = t / 1000, still = mqReduce.matches;
      for (var i = 0; i < glints.length; i++) {
        var g = glints[i];
        var a = still ? 0.5 : Math.pow(Math.max(0, Math.sin(sec * g.v + g.p)), 5);
        if (a > 0.02) star(g.x * W, g.y * H, g.s, 0.15 + a * 0.85, g.warm);
      }
      if (!still) {
        ctx.fillStyle = "#ffffff";
        for (var j = 0; j < motes.length; j++) {
          var m = motes[j];
          ctx.globalAlpha = 0.16 + 0.14 * Math.sin(sec * 0.7 + m.p);
          ctx.beginPath(); ctx.arc(m.x * W, m.y * H, m.r, 0, 6.283); ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }
    function tick(ts) {
      if (!running) return;
      raf = requestAnimationFrame(tick);
      if (ts - last < 33) return;           // ~30 fps is plenty for twinkles
      var dt = last ? (ts - last) / 1000 : 0.033;
      last = ts;
      for (var j = 0; j < motes.length; j++) {
        var m = motes[j];
        m.y -= m.vy * dt; m.x += m.vx * dt;
        if (m.y < -0.02) { m.y = 1.02; m.x = Math.random(); }
        if (m.x > 1.02) m.x = -0.02;
      }
      draw(ts);
    }
    function play() {
      if (running || mqReduce.matches || !visible || document.hidden) return;
      running = true; last = 0; raf = requestAnimationFrame(tick);
    }
    function pause() { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; }

    var io = null, ro = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(function (es) { visible = es[0].isIntersecting; visible ? play() : pause(); }, { threshold: 0 });
      io.observe(canvas);
    }
    if ("ResizeObserver" in window) { ro = new ResizeObserver(function () { resize(); }); ro.observe(canvas); }
    else window.addEventListener("resize", resize);
    var onVis = function () { document.hidden ? pause() : play(); };
    document.addEventListener("visibilitychange", onVis);
    resize(); play();

    return {
      canvas: canvas,
      stop: function () {
        pause();
        if (io) io.disconnect();
        if (ro) ro.disconnect(); else window.removeEventListener("resize", resize);
        document.removeEventListener("visibilitychange", onVis);
      }
    };
  }

  function ensureGlint() {
    var c = document.querySelector("canvas.krn-glint");
    if (glint && glint.canvas === c && document.contains(c)) return;
    if (glint) { glint.stop(); glint = null; }
    if (c) glint = startGlint(c);
  }

  /* ---------------- fleet card glare / parallax ---------------- */
  var tiltCard = null;
  function onMove(e) {
    if (e.pointerType && e.pointerType !== "mouse") return;
    if (mqReduce.matches) return;
    var card = e.target && e.target.closest ? e.target.closest(".krn-fleet-card") : null;
    if (tiltCard && tiltCard !== card) reset(tiltCard);
    tiltCard = card;
    if (!card) return;
    var r = card.getBoundingClientRect();
    var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    card.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
    card.style.setProperty("--my", (y * 100).toFixed(1) + "%");
    card.style.setProperty("--px", (x * 2 - 1).toFixed(3));
    card.style.setProperty("--py", (y * 2 - 1).toFixed(3));
  }
  function reset(card) {
    card.style.removeProperty("--px"); card.style.removeProperty("--py");
  }

  /* ---------------- scroll progress fallback ---------------- */
  var progTicking = false;
  function setProgress() {
    progTicking = false;
    var d = document.documentElement;
    var max = Math.max(1, d.scrollHeight - window.innerHeight);
    d.style.setProperty("--krn-prog", Math.min(1, Math.max(0, (window.scrollY || d.scrollTop) / max)).toFixed(4));
  }
  function onScroll() { if (!progTicking) { progTicking = true; requestAnimationFrame(setProgress); } }
  var needsProgFallback = !(window.CSS && CSS.supports && CSS.supports("animation-timeline: scroll()"));

  /* ---------------- boot ---------------- */
  function init() {
    ensureGlint();
    document.addEventListener("pointermove", onMove, { passive: true });
    if (needsProgFallback) { window.addEventListener("scroll", onScroll, { passive: true }); setProgress(); }
    var t = null;
    try {
      var mo = new MutationObserver(function () { clearTimeout(t); t = setTimeout(ensureGlint, 120); });
      mo.observe(document.querySelector("x-dc") || document.body, { childList: true, subtree: true });
    } catch (e) {}
    setTimeout(ensureGlint, 400); setTimeout(ensureGlint, 1500);
    if (mqReduce.addEventListener) mqReduce.addEventListener("change", function () { if (glint) { glint.stop(); glint = null; } ensureGlint(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
