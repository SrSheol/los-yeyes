/* ============================================================
   Karún Travel Group — v23 motion & interaction layer
   · Dependency-free (no GSAP/Lenis): one rAF-throttled scroll loop,
     native scroll (so the Destinos sticky stack + modal scroll lock
     keep working exactly as in v22).
   · Remount-safe: support.js/React can re-create the page DOM. Nothing
     here rewrites React-managed markup; state lives in <html> attributes,
     CSS custom properties or inside empty containers we own
     (zone chips, map nodes). A MutationObserver re-binds new nodes.
   · prefers-reduced-motion: scroll hijacks (pinned arrival / horizontal
     services), canvases and magnetic effects are disabled.
   ============================================================ */
(function () {
  "use strict";

  var D = document, W = window, HTML = D.documentElement;
  var RM = false;
  try { RM = W.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  var FINE = false;
  try { FINE = W.matchMedia("(hover: hover) and (pointer: fine)").matches; } catch (e) {}

  function $(s, r) { return (r || D).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || D).querySelectorAll(s)); }
  function clamp(n, a, b) { return Math.min(b, Math.max(a, n)); }
  function vh() { return W.innerHeight || HTML.clientHeight; }
  function vw() { return W.innerWidth || HTML.clientWidth; }
  function wide() { return vw() > 900; }
  function lang() { var l = $("x-dc .lm[data-lang]") || $(".lm[data-lang]"); return (l && l.getAttribute("data-lang")) || "es"; }
  function es() { return lang() === "es"; }
  function tt(en, s) { return es() ? s : en; }
  function data() { return W.KRN_TARIFARIO || null; }
  function usd(n) { return "US$" + (n % 1 === 0 ? n.toFixed(0) : n.toFixed(2)); }
  function escH(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  HTML.classList.add("k23-js");
  if (RM) HTML.setAttribute("data-k23-rm", "1");

  /* ------------------------------------------------------------------
     1. NAV — hero vs sea-glass island, tide progress, active section ink
     ------------------------------------------------------------------ */
  var SECTIONS = ["services", "fleet", "rates-search", "reservar", "map", "destinations", "faq"];
  var lastY = 0, navState = "", activeId = "";
  function navUpdate(y) {
    var nav = $("nav.k23-nav");
    var hero = $("#top");
    if (!nav) return;
    var nh = nav.getBoundingClientRect().height || 76;
    HTML.style.setProperty("--k-nav-h", Math.round(nh) + "px");
    var heroEnd = hero ? hero.offsetHeight - nh - 10 : 400;
    var st = y > heroEnd ? "sea" : "hero";
    if (st !== navState) { navState = st; HTML.setAttribute("data-k23-nav", st); paintInk(); setTimeout(paintInk, 560); }
    // hide on fast scroll down (desktop only, never with menus open)
    var down = y > lastY + 4, up = y < lastY - 4;
    var drawerOpen = HTML.getAttribute("data-k23-drawer") === "1";
    var langOpen = !!$(".langmenu[style*='grid'], .langmenu[style*='block']");
    if (!RM && wide() && y > heroEnd + 400 && down && !drawerOpen && !langOpen) HTML.setAttribute("data-k23-nav-hide", "1");
    else if (up || y <= heroEnd + 400) HTML.removeAttribute("data-k23-nav-hide");
    lastY = y;
    var max = Math.max(1, HTML.scrollHeight - vh());
    HTML.style.setProperty("--k23-prog", clamp(y / max, 0, 1).toFixed(4));
    // active section
    var cur = "";
    for (var i = 0; i < SECTIONS.length; i++) {
      var el = D.getElementById(SECTIONS[i]);
      if (el && el.getBoundingClientRect().top <= nh + 80) cur = SECTIONS[i];
    }
    if (cur !== activeId) { activeId = cur; paintInk(); }
  }
  function paintInk() {
    $$("[data-k23-link]").forEach(function (a) { a.setAttribute("data-on", a.getAttribute("data-k23-link") === activeId ? "1" : "0"); });
    $$(".nav-drawer .nav-opt").forEach(function (a) { var h = (a.getAttribute("href") || "").slice(1); a.setAttribute("data-on", h && h === activeId ? "1" : "0"); });
    var links = $(".k23-nav .navlinks"), ink = $(".k23-nav-ink");
    if (!links || !ink) return;
    var on = $('[data-k23-link="' + activeId + '"]', links);
    if (!on) { ink.style.setProperty("--ink-w", "0px"); return; }
    ink.style.setProperty("--ink-x", on.offsetLeft + "px");
    ink.style.setProperty("--ink-w", on.offsetWidth + "px");
  }
  function drawerSync() {
    var dr = $("#ly-nav-drawer");
    var open = !!(dr && dr.getAttribute("data-open") === "true");
    if (open) HTML.setAttribute("data-k23-drawer", "1"); else HTML.removeAttribute("data-k23-drawer");
  }

  /* ------------------------------------------------------------------
     2. REAL NUMBERS from the official tarifario (no invented stats)
     ------------------------------------------------------------------ */
  function paintStats() {
    var d = data(); if (!d) return;
    var hotels = 0, zones = 0;
    d.origins.forEach(function (o) { zones += o.zones.length; o.zones.forEach(function (z) { hotels += z.hotels.length; }); });
    var vals = { hotels: hotels, zones: zones, classes: d.vehicles.length };
    $$("[data-k23-stat]").forEach(function (el) {
      var k = el.getAttribute("data-k23-stat"); if (vals[k] == null) return;
      if (el.getAttribute("data-k23-done") === String(vals[k])) return;
      el.setAttribute("data-k23-done", String(vals[k]));
      countUp(el, vals[k]);
    });
  }
  function countUp(el, to) {
    if (RM || !("IntersectionObserver" in W)) { el.textContent = String(to); return; }
    var io = new IntersectionObserver(function (en) {
      if (!en[0].isIntersecting) return; io.disconnect();
      var t0 = null, dur = 1100;
      function step(ts) {
        if (t0 == null) t0 = ts;
        var k = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        el.textContent = String(Math.round(to * e));
        if (k < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }, { threshold: .4 });
    io.observe(el);
  }

  /* ------------------------------------------------------------------
     3. ARRIVAL JOURNEY — plane → van → lobby along a scrubbed path
     ------------------------------------------------------------------ */
  var jLen = 0, jPathRef = null;
  function journeyUpdate() {
    var sec = $("#llegada"), path = $(".k23-journey-line"), base = $(".k23-journey-base"), trav = $(".k23-traveler");
    var stops = $$(".k23-stop");
    if (!sec || !stops.length) return;
    var r = sec.getBoundingClientRect(), h = vh();
    if (wide() && !RM && path && base && trav) {
      if (jPathRef !== base) { jPathRef = base; try { jLen = base.getTotalLength(); } catch (e) { jLen = 0; } }
      var p = clamp(-r.top / Math.max(1, r.height - h), 0, 1);
      var pe = clamp((p - .04) / .9, 0, 1);
      if (jLen) {
        path.style.strokeDasharray = jLen + " " + jLen;
        path.style.strokeDashoffset = String(jLen * (1 - pe));
        var pt = base.getPointAtLength(jLen * pe);
        var pt2 = base.getPointAtLength(Math.min(jLen, jLen * pe + 2));
        var ang = Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180 / Math.PI;
        var mode = pe < .36 ? "plane" : (pe < .9 ? "van" : "bell");
        trav.setAttribute("transform", "translate(" + pt.x.toFixed(1) + " " + (pt.y - (mode === "plane" ? 6 : 0)).toFixed(1) + ")");
        trav.setAttribute("data-mode", mode);
        var inner = $(".k23-tv-plane", trav);
        if (inner) inner.setAttribute("transform", "rotate(" + ang.toFixed(1) + ")");
        var van = $(".k23-tv-van", trav);
        if (van) van.setAttribute("transform", "rotate(" + (ang * .35).toFixed(1) + ")");
      }
      stops.forEach(function (s, i) { s.setAttribute("data-on", pe >= i * .2 - .02 ? "1" : "0"); });
    } else {
      var ol = $(".k23-stops"); if (!ol) return;
      var or = ol.getBoundingClientRect();
      var jp = clamp((h * .72 - or.top) / Math.max(1, or.height), 0, 1);
      ol.style.setProperty("--k23-jp", jp.toFixed(3));
      stops.forEach(function (s) { s.setAttribute("data-on", RM || s.getBoundingClientRect().top < h * .78 ? "1" : "0"); });
      if (path) { path.style.strokeDasharray = ""; path.style.strokeDashoffset = ""; }
    }
  }

  /* ------------------------------------------------------------------
     4. SERVICES — horizontal chapters driven by vertical scroll
     ------------------------------------------------------------------ */
  var svcDist = 0;
  function svcMeasure() {
    var sec = $("#services"), track = $(".k23-svc-track");
    if (!sec || !track) return;
    if (!wide() || RM) { sec.style.removeProperty("--k23-svc-h"); sec.style.removeProperty("--k23-svc-x"); svcDist = 0; return; }
    svcDist = Math.max(0, track.scrollWidth - vw());
    sec.style.setProperty("--k23-svc-h", Math.round(vh() + svcDist) + "px");
  }
  function svcUpdate() {
    var sec = $("#services"); if (!sec) return;
    if (!wide() || RM || !svcDist) return;
    var r = sec.getBoundingClientRect();
    var p = clamp(-r.top / Math.max(1, r.height - vh()), 0, 1);
    sec.style.setProperty("--k23-svc-x", (-p * svcDist).toFixed(1) + "px");
    sec.style.setProperty("--k23-svc-p", p.toFixed(3));
    var chs = $$(".k23-ch", sec);
    var now = $("[data-k23-svc-now]", sec);
    var idx = 0, mid = vw() * .5;
    chs.forEach(function (c, i) {
      var cr = c.getBoundingClientRect();
      if (cr.left < mid) idx = i;
      var rel = clamp((cr.left + cr.width / 2 - mid) / vw(), -1, 1);
      c.style.setProperty("--k23-par", rel.toFixed(3));
      c.style.setProperty("--k23-draw", cr.left < vw() * .95 ? "0" : "180");
    });
    if (now) { var t = (idx + 1 < 10 ? "0" : "") + (idx + 1); if (now.textContent !== t) now.textContent = t; }
  }

  /* ------------------------------------------------------------------
     5. FLEET — showroom tabs, pointer parallax, "which one suits me?"
     ------------------------------------------------------------------ */
  var fleetSel = "starex", chooserPax = 2, chooserStyle = "value";
  var UNIT_NAME = { starex: "Hyundai Grand Starex", hiace: "Toyota Hiace", solati: "Hyundai Solati", suburban: "Chevrolet Suburban LWB", cadillac: "Cadillac Escalade" };
  var UNIT_CLASS = { starex: "starex", hiace: "hiace", solati: "hiace", suburban: "suburban", cadillac: "cadillac" };
  function fleetApply() {
    var sr = $(".k23-showroom"); if (!sr) return;
    if (sr.getAttribute("data-sel") !== fleetSel) sr.setAttribute("data-sel", fleetSel);
    $$(".k23-tab", sr).forEach(function (b) { b.setAttribute("aria-selected", b.getAttribute("data-k23-unit") === fleetSel ? "true" : "false"); });
  }
  function minFare(cls, origin) {
    var d = data(); if (!d) return null;
    var best = null;
    d.origins.forEach(function (o) {
      if (origin && o.id !== origin) return;
      o.zones.forEach(function (z) { z.hotels.forEach(function (h) { var f = h.fares && h.fares[cls]; if (f != null && (best == null || f < best)) best = f; }); });
    });
    return best;
  }
  function chooserRender() {
    var out = $("[data-k23-rec]"), outN = $("[data-k23-pax-out]");
    if (outN) outN.textContent = String(chooserPax);
    $$("[data-k23-style]").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-k23-style") === chooserStyle ? "true" : "false"); });
    if (!out) return;
    var rec, note = "";
    var n = chooserPax;
    if (chooserStyle === "lux") {
      rec = n <= 4 ? "cadillac" : (n <= 6 ? "starex" : "hiace");
      if (n > 4) note = tt("For more than 4 in luxury, book two Escalades — or keep the group together in ", "Para más de 4 en lujo, reserva dos Escalade — o mantengan el grupo junto en ") + UNIT_NAME[rec] + ".";
    } else if (chooserStyle === "exec") {
      rec = n <= 4 ? "suburban" : (n <= 6 ? "starex" : "hiace");
      if (n > 4) note = tt("The Suburban seats 4; for your group we suggest ", "La Suburban lleva 4; para tu grupo sugerimos ") + UNIT_NAME[rec] + ".";
    } else {
      rec = n <= 6 ? "starex" : "hiace";
      if (n > 10) note = tt("More than 10? We combine two vehicles — each extra traveler above a class pays the sheet's per-person amount.", "¿Más de 10? Combinamos dos unidades — cada pasajero sobre la clase paga el monto por persona del tarifario.");
    }
    var cls = UNIT_CLASS[rec], from = minFare(cls, "PUJ");
    $$(".k23-tab").forEach(function (b) { b.setAttribute("data-rec", b.getAttribute("data-k23-unit") === rec ? "1" : "0"); });
    out.innerHTML = "<b>" + escH(UNIT_NAME[rec]) + "</b> — " +
      escH(note || (tt("the right fit for ", "la indicada para ") + n + (n === 1 ? tt(" traveler", " pasajero") : tt(" travelers", " pasajeros")) + ".")) +
      (from != null ? " " + escH(tt("From ", "Desde ")) + "<b>" + usd(from) + "</b>" + escH(tt(" one-way from PUJ.", " por vía desde PUJ.")) : "") +
      '<br><button type="button" data-k23-show="' + rec + '">' + escH(tt("Show me this one →", "Ver esta unidad →")) + "</button>";
  }

  /* ------------------------------------------------------------------
     6. RATES — zone chips mirror the zone <select> (wizard stays the source)
     ------------------------------------------------------------------ */
  var chipSig = "";
  function zoneChips() {
    var wrap = $("[data-k23-zonechips]"), sel = $("#krn-zone-filter");
    if (!wrap || !sel) return;
    var opts = Array.prototype.map.call(sel.options, function (o) { return [o.value, o.textContent]; });
    var sig = JSON.stringify(opts) + "|" + sel.value + "|" + lang();
    if (sig === chipSig && wrap.childElementCount) return;
    chipSig = sig;
    wrap.innerHTML = opts.map(function (o) {
      var m = /^(.*)\s\((\d+)\)$/.exec(o[1]);
      var label = m ? m[1] : o[1], cnt = m ? m[2] : "";
      return '<button type="button" class="k23-zchip" data-k23-zchip="' + escH(o[0]) + '" aria-pressed="' + (sel.value === o[0]) + '">' + escH(label) + (cnt ? "<small>" + cnt + "</small>" : "") + "</button>";
    }).join("");
  }
  function setRateZone(origin, zoneId) {
    var og = $('[data-krn-rateorigin="' + origin + '"]');
    if (og && og.getAttribute("aria-pressed") !== "true") og.click();
    var sel = $("#krn-zone-filter");
    if (sel) {
      sel.value = zoneId || "";
      sel.dispatchEvent(new Event("change", { bubbles: true }));
    }
    zoneChips();
  }

  /* ------------------------------------------------------------------
     7. BOOKING — 3-step flow on top of the existing wizard (no logic fork)
     ------------------------------------------------------------------ */
  var step = 1;
  function formEl() { return $("#krn-wizard-form"); }
  function msg(t) { var m = $("#krn-form-msg"); if (!m) return; m.textContent = t || ""; m.style.display = t ? "block" : "none"; }
  function hasHotel() { return $$('#krn-legs select[data-field="hotel"]').some(function (s) { return !!s.value; }); }
  function setStep(n, focus) {
    step = clamp(n, 1, 3);
    var f = formEl(); if (!f) return;
    f.setAttribute("data-k23-step", String(step));
    $$(".k23-steps button", f).forEach(function (b) { b.setAttribute("aria-current", b.getAttribute("data-k23-go") === String(step) ? "step" : "false"); });
    if (focus) {
      var r = f.getBoundingClientRect();
      if (r.top < 0 || r.top > vh() * .5) {
        var y = W.scrollY + r.top - (parseFloat(getComputedStyle(HTML).getPropertyValue("--k-nav-h")) || 76) - 16;
        W.scrollTo({ top: y, behavior: RM ? "auto" : "smooth" });
      }
      var panel = $('.k23-panel[data-panel="' + step + '"]', f);
      var first = panel && $("select, input:not([type=radio]), .btn", panel);
      if (first) setTimeout(function () { try { first.focus({ preventScroll: true }); } catch (e) {} }, 380);
    }
  }
  function tryGo(n) {
    if (n > 1 && !hasHotel()) { msg(tt("Choose a hotel for at least one leg to continue.", "Elige un hotel en al menos un tramo para continuar.")); setStep(1, true); return; }
    if (n > 2) {
      var nm = $("#krn-name");
      if (!nm || !nm.value.trim()) { msg(tt("Please enter the passenger name — it goes on your pickup sign.", "Escribe el nombre del pasajero — va en tu letrero de recogida.")); setStep(2, true); if (nm) setTimeout(function () { nm.focus(); }, 400); return; }
    }
    msg("");
    setStep(n, true);
  }

  /* ------------------------------------------------------------------
     8. ZONES — illustrated corridor, nodes sized by real hotel counts
     ------------------------------------------------------------------ */
  var ZPOS = {
    "uvero-alto": [800, 162, "e"], "macao": [836, 192, "e"], "arena-gorda": [856, 222, "e"], "bavaro": [874, 256, "e"],
    "bavaro-zona-i": [856, 222, "e"], "bavaro-zona-ii": [874, 256, "e"], "bavaro-zona-iii": [888, 282, "e"],
    "cabeza-de-toro": [896, 300, "w2"], "punta-cana": [904, 346, "e"], "cap-cana": [884, 386, "s"],
    "bayahibe": [556, 436, "n"], "la-romana": [474, 414, "n"], "playa-nueva-romana": [420, 412, "s"],
    "juan-dolio": [300, 404, "n"], "boca-chica": [240, 408, "s"], "santo-domingo": [128, 402, "n"]
  };
  var zOrigin = "PUJ", zSel = { PUJ: "bavaro", SDQ: "bavaro-zona-i" }, zSig = "";
  function zoneData(origin) { var d = data(); if (!d) return null; for (var i = 0; i < d.origins.length; i++) if (d.origins[i].id === origin) return d.origins[i]; return null; }
  function zMin(h) { var m = null; for (var k in h.fares) { var f = h.fares[k]; if (f != null && (m == null || f < m)) m = f; } return m; }
  function zonesRender(force) {
    var root = $(".k23-zones"), g = $("[data-k23-nodes]"), list = $("[data-k23-zlist]");
    var o = zoneData(zOrigin);
    if (!root || !g || !o) return;
    var sig = zOrigin + "|" + zSel[zOrigin] + "|" + lang() + "|" + g.childElementCount;
    if (!force && sig === zSig && g.childElementCount) return;
    root.setAttribute("data-origin", zOrigin);
    $$("[data-k23-origin]", root).forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-k23-origin") === zOrigin ? "true" : "false"); });
    var html = "", lis = "";
    o.zones.forEach(function (z) {
      var p = ZPOS[z.id]; if (!p) return;
      var n = z.hotels.length, r = 9 + Math.sqrt(n) * 3.6, on = z.id === zSel[zOrigin];
      var lx = p[0], ly = p[1], anchor = "middle";
      if (p[2] === "e" || p[2] === "w2") { lx = p[0] + r + 8; ly = p[1] + 5; anchor = "start"; }
      else if (p[2] === "n") { ly = p[1] - r - 8; }
      else { ly = p[1] + r + 18; }
      html += '<g class="k23-zn" data-zone="' + z.id + '" data-on="' + (on ? 1 : 0) + '" tabindex="0" role="button" aria-label="' + escH(z.name + " · " + n + " hoteles") + '">' +
        '<circle class="k23-zn-halo" cx="' + p[0] + '" cy="' + p[1] + '" r="' + r.toFixed(1) + '"/>' +
        (RM ? "" : '<circle class="k23-zn-pulse" cx="' + p[0] + '" cy="' + p[1] + '" r="' + r.toFixed(1) + '"/>') +
        '<circle class="k23-zn-core" cx="' + p[0] + '" cy="' + p[1] + '" r="6"/>' +
        '<text class="k23-zn-label" x="' + lx.toFixed(0) + '" y="' + ly.toFixed(0) + '" text-anchor="' + anchor + '">' + escH(z.name.replace("Bávaro · Zona ", "Bávaro ")) + "</text></g>";
      lis += '<li><button type="button" data-k23-zbtn="' + z.id + '" data-on="' + (on ? 1 : 0) + '">' + escH(z.name) + "<small>" + n + "</small></button></li>";
    });
    g.innerHTML = html;
    if (list) list.innerHTML = lis;
    zSig = zOrigin + "|" + zSel[zOrigin] + "|" + lang() + "|" + g.childElementCount;
    zonePanel();
  }
  function zonePanel() {
    var card = $("[data-k23-zpanel]"), o = zoneData(zOrigin); if (!card || !o) return;
    var z = null; o.zones.forEach(function (x) { if (x.id === zSel[zOrigin]) z = x; });
    if (!z) z = o.zones[0];
    var min = null;
    var hs = z.hotels.map(function (h) { var m = zMin(h); if (m != null && (min == null || m < min)) min = m; return { n: h.name, m: m }; })
      .sort(function (a, b) { return (a.m || 0) - (b.m || 0) || a.n.localeCompare(b.n); });
    $(".k23-zp-name", card).textContent = z.name;
    $(".k23-zp-count", card).textContent = String(z.hotels.length);
    $(".k23-zp-from", card).textContent = min != null ? usd(min) : "—";
    var ul = $(".k23-zp-hotels", card);
    var show = hs.slice(0, 5);
    ul.innerHTML = show.map(function (h) { return "<li>" + escH(h.n) + "<span>" + (h.m != null ? escH(tt("from ", "desde ")) + usd(h.m) : "") + "</span></li>"; }).join("") +
      (hs.length > show.length ? '<li class="more">+ ' + (hs.length - show.length) + " " + escH(tt("more on the sheet", "más en el tarifario")) + "</li>" : "");
    var k = $(".k23-zp-k", card);
    if (k) k.textContent = tt("Zone · from " + zOrigin, "Zona · desde " + zOrigin);
    card.classList.remove("is-swap"); void card.offsetWidth; card.classList.add("is-swap");
  }

  /* ------------------------------------------------------------------
     9. DESTINATIONS — counter / index + dusk wash (stack itself untouched)
     ------------------------------------------------------------------ */
  function destUpdate() {
    var sec = $("#destinations"); if (!sec) return;
    var cards = $$(".dest-card", sec); if (!cards.length) return;
    var pin = 0; try { pin = parseFloat(getComputedStyle(cards[0]).top) || 90; } catch (e) { pin = 90; }
    var idx = 0;
    cards.forEach(function (c, i) { if (c.getBoundingClientRect().top <= pin + 40) idx = i; });
    var t = "0" + (idx + 1);
    $$("[data-k23-dest-now]", sec).forEach(function (now) { if (now.textContent !== t) now.textContent = t; });
    var nm = $("[data-k23-dest-name]", sec), lbl = cards[idx].getAttribute("aria-label") || "";
    if (nm && nm.textContent !== lbl) nm.textContent = lbl;
    sec.style.setProperty("--k23-dest-p", ((idx + 1) / cards.length).toFixed(2));
    $$("[data-k23-dest]", sec).forEach(function (li) { li.setAttribute("data-on", li.getAttribute("data-k23-dest") === String(idx) ? "1" : "0"); });
    var wrap = $(".dest-wrap", sec);
    if (wrap && !RM) {
      var r = wrap.getBoundingClientRect(), h = vh();
      var a = clamp((h * .9 - r.top) / (h * .6), 0, 1), b = clamp((r.bottom - h * .35) / (h * .5), 0, 1);
      sec.style.setProperty("--k23-dusk", (a * b).toFixed(3));
    }
  }
  function destModalCta() {
    var host = $("#dest-detail-root"); if (!host) return;
    var body = $(".dest-detail-body", host); if (!body) return;
    var cta = $(".dest-detail-cta", body);
    var l = host.getAttribute("data-lang") || lang(), isEs = l === "es";
    var sig = l;
    if (cta && cta.getAttribute("data-l") === sig) return;
    if (!cta) {
      cta = D.createElement("div"); cta.className = "dest-detail-cta"; body.appendChild(cta);
      // the dialog stops click propagation, so the CTA needs its own listener
      cta.addEventListener("click", function (e) {
        var a = e.target && e.target.closest && e.target.closest("[data-k23-modalgo]"); if (!a) return;
        e.preventDefault();
        var target = a.getAttribute("data-k23-modalgo");
        var close = D.getElementById("dest-detail-close"); if (close) close.click();
        setTimeout(function () { var el = D.getElementById(target); if (el) el.scrollIntoView({ behavior: RM ? "auto" : "smooth", block: "start" }); }, 260);
      });
    }
    cta.setAttribute("data-l", sig);
    cta.innerHTML = '<a class="pri" href="#reservar" data-k23-modalgo="reservar">' + (isEs ? "Reservar esta ruta →" : "Book this route →") + "</a>" +
      '<a class="sec" href="#rates-search" data-k23-modalgo="rates-search">' + (isEs ? "Ver tarifas" : "See fares") + "</a>";
  }

  /* ------------------------------------------------------------------
     10. Ambient: foam canvases, band parallax, wordmark, reveals
     ------------------------------------------------------------------ */
  var foams = [];
  function Foam(cv) {
    this.cv = cv; this.ctx = cv.getContext("2d"); this.p = []; this.on = false; this.raf = 0; this.w = 0; this.h = 0;
    var self = this;
    this.io = new IntersectionObserver(function (en) { self.on = en[0].isIntersecting; if (self.on) self.loop(); }, { rootMargin: "80px" });
    this.io.observe(cv);
    this.size();
  }
  Foam.prototype.size = function () {
    var dpr = Math.min(1.5, W.devicePixelRatio || 1), r = this.cv.getBoundingClientRect();
    this.w = r.width; this.h = r.height; this.cv.width = Math.round(r.width * dpr); this.cv.height = Math.round(r.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.round(clamp(r.width / (vw() < 700 ? 22 : 14), 18, 90));
    this.p = [];
    for (var i = 0; i < n; i++) this.p.push(this.spawn(true));
  };
  Foam.prototype.spawn = function (anyY) {
    var big = Math.random() < .12;
    return { x: Math.random() * this.w, y: anyY ? Math.random() * this.h : this.h + 10, r: big ? 6 + Math.random() * 14 : .8 + Math.random() * 1.8,
      vy: -(.12 + Math.random() * .38) * (big ? .5 : 1), vx: (Math.random() - .5) * .25, a: big ? .05 + Math.random() * .07 : .25 + Math.random() * .45, ph: Math.random() * 6.28, big: big };
  };
  Foam.prototype.loop = function () {
    var self = this;
    if (this.raf) return;
    function f() {
      self.raf = 0;
      if (!self.on) return;
      var c = self.ctx; c.clearRect(0, 0, self.w, self.h);
      for (var i = 0; i < self.p.length; i++) {
        var q = self.p[i];
        q.ph += .015; q.x += q.vx + Math.sin(q.ph) * .18; q.y += q.vy;
        if (q.y < -20 || q.x < -20 || q.x > self.w + 20) self.p[i] = q = self.spawn(false);
        var fade = clamp(q.y / (self.h * .35), 0, 1);
        c.beginPath(); c.arc(q.x, q.y, q.r, 0, 6.2832);
        if (q.big) { c.fillStyle = "rgba(190,240,246," + (q.a * fade).toFixed(3) + ")"; }
        else { c.fillStyle = "rgba(255,255,255," + (q.a * fade).toFixed(3) + ")"; }
        c.fill();
      }
      self.raf = requestAnimationFrame(f);
    }
    this.raf = requestAnimationFrame(f);
  };
  function bindFoams() {
    if (RM || !("IntersectionObserver" in W)) return;
    $$("canvas.k23-foam").forEach(function (cv) {
      if (cv._k23) return;
      cv._k23 = new Foam(cv); foams.push(cv._k23);
    });
  }

  var RV_SEL = ".k23-head,.k23-promise,.k23-stage,.k23-unit-tabs,.k23-chooser,.k23-zones-map,.k23-zones-panel,.k23-faq .faq-item,.k23-rates-shell,.k23-book,.k23-glance,.k23-dest-index,.k23-end-main,.k23-delay,.k23-trust-quote";
  var rvIO = null;
  function bindReveals() {
    if (RM || !("IntersectionObserver" in W)) return;
    if (!rvIO) rvIO = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("k23-in"); rvIO.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: .08 });
    $$(RV_SEL).forEach(function (el, i) {
      if (el._k23rv) return; el._k23rv = 1;
      var r = el.getBoundingClientRect();
      if (r.top < vh() * .92) return;             // already on screen: never hide it
      el.classList.add("k23-rv");
      el.style.setProperty("--rv-d", (i % 4) * 70 + "ms");
      rvIO.observe(el);
    });
  }
  (function injectRevealCss() {
    var st = D.createElement("style");
    st.textContent = "html.k23-js .lm .k23-rv{opacity:0;transform:translateY(34px);transition:opacity .9s cubic-bezier(.22,1,.36,1) var(--rv-d,0ms),transform 1s cubic-bezier(.22,1,.36,1) var(--rv-d,0ms)}" +
      "html.k23-js .lm .k23-rv.k23-in{opacity:1;transform:none}";
    D.head.appendChild(st);
  })();

  function ambientUpdate() {
    var band = $(".k23-trust-band");
    if (band && !RM) {
      var r = band.getBoundingClientRect();
      band.style.setProperty("--k23-bandp", clamp((vh() - r.top) / (vh() + r.height), 0, 1).toFixed(3));
    }
    var word = $(".k23-end-word");
    if (word && !RM) {
      var w = word.getBoundingClientRect();
      word.style.setProperty("--k23-word", clamp((vh() - w.top) / (w.height + vh() * .25), 0, 1).toFixed(3));
    }
  }

  /* ------------------------------------------------------------------
     11. Pointer: magnetic CTAs, fleet parallax, ticket tilt
     ------------------------------------------------------------------ */
  function onPointerMove(e) {
    if (RM || !FINE) return;
    var t = e.target;
    var mag = t && t.closest && t.closest("[data-magnetic]");
    $$("[data-k23-magon]").forEach(function (m) { if (m !== mag) { m.style.transform = ""; m.removeAttribute("data-k23-magon"); } });
    if (mag) {
      var r = mag.getBoundingClientRect();
      var dx = (e.clientX - (r.left + r.width / 2)) / r.width, dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      mag.style.transform = "translate(" + (dx * 10).toFixed(1) + "px," + (dy * 8).toFixed(1) + "px)";
      mag.setAttribute("data-k23-magon", "1");
    }
    var ph = t && t.closest && t.closest(".k23-unit-photo");
    if (ph) {
      var pr = ph.getBoundingClientRect();
      ph.style.setProperty("--px", (((e.clientX - pr.left) / pr.width) - .5).toFixed(3));
      ph.style.setProperty("--py", (((e.clientY - pr.top) / pr.height) - .5).toFixed(3));
    }
    var tk = t && t.closest && t.closest("[data-k23-tilt]");
    $$("[data-k23-tilt]").forEach(function (x) { if (x !== tk) { x.style.removeProperty("--rx"); x.style.removeProperty("--ry"); } });
    if (tk) {
      var tr = tk.getBoundingClientRect();
      tk.style.setProperty("--rx", ((((e.clientX - tr.left) / tr.width) - .5) * 14).toFixed(2) + "deg");
      tk.style.setProperty("--ry", ((((e.clientY - tr.top) / tr.height) - .5) * -12).toFixed(2) + "deg");
    }
  }

  /* ------------------------------------------------------------------
     Events (delegated once — survive remounts)
     ------------------------------------------------------------------ */
  function onClick(e) {
    var t = e.target; if (!t || !t.closest) return;
    var tab = t.closest("[data-k23-unit]");
    if (tab) { fleetSel = tab.getAttribute("data-k23-unit"); fleetApply(); return; }
    var show = t.closest("[data-k23-show]");
    if (show) {
      fleetSel = show.getAttribute("data-k23-show"); fleetApply();
      var st = $(".k23-stage"); if (st && !wide()) st.scrollIntoView({ behavior: RM ? "auto" : "smooth", block: "start" });
      return;
    }
    var px = t.closest("[data-k23-pax]");
    if (px) { chooserPax = clamp(chooserPax + parseInt(px.getAttribute("data-k23-pax"), 10), 1, 14); chooserRender(); return; }
    var sty = t.closest("[data-k23-style]");
    if (sty) { chooserStyle = sty.getAttribute("data-k23-style"); chooserRender(); return; }
    var zc = t.closest("[data-k23-zchip]");
    if (zc) { var sel = $("#krn-zone-filter"); if (sel) { sel.value = zc.getAttribute("data-k23-zchip"); sel.dispatchEvent(new Event("change", { bubbles: true })); zoneChips(); } return; }
    var og = t.closest("[data-krn-rateorigin]");
    if (og) setTimeout(zoneChips, 30);
    var zo = t.closest("[data-k23-origin]");
    if (zo) { zOrigin = zo.getAttribute("data-k23-origin"); zonesRender(true); return; }
    var zn = t.closest(".k23-zn,[data-k23-zbtn]");
    if (zn) { zSel[zOrigin] = zn.getAttribute("data-zone") || zn.getAttribute("data-k23-zbtn"); zonesRender(true); return; }
    var zr = t.closest("[data-k23-zone-rates]");
    if (zr) {
      setRateZone(zOrigin, zSel[zOrigin]);
      var rs = D.getElementById("rates-search"); if (rs) rs.scrollIntoView({ behavior: RM ? "auto" : "smooth", block: "start" });
      return;
    }
    var go = t.closest("[data-k23-go]");
    if (go) { var n = parseInt(go.getAttribute("data-k23-go"), 10); if (n <= step) { msg(""); setStep(n, true); } else tryGo(n); return; }
    var nx = t.closest("[data-k23-next]");
    if (nx) { var m = parseInt(nx.getAttribute("data-k23-next"), 10); if (m < step) { msg(""); setStep(m, true); } else tryGo(m); return; }
    if (t.closest("[data-krn-quote]") || t.closest("button[data-hotel]")) { msg(""); setStep(1, false); return; }
    var mg = t.closest("[data-k23-modalgo]");
    if (mg) {
      e.preventDefault();
      var target = mg.getAttribute("data-k23-modalgo");
      var close = $("#dest-detail-close"); if (close) close.click();
      setTimeout(function () { var el = D.getElementById(target); if (el) el.scrollIntoView({ behavior: RM ? "auto" : "smooth", block: "start" }); }, 260);
      return;
    }
  }
  function onKey(e) {
    var t = e.target;
    if ((e.key === "Enter" || e.key === " ") && t && t.classList && t.classList.contains("k23-zn")) {
      e.preventDefault(); zSel[zOrigin] = t.getAttribute("data-zone"); zonesRender(true);
      var again = $('.k23-zn[data-zone="' + zSel[zOrigin] + '"]'); if (again) again.focus();
    }
  }
  function onSubmitCapture(e) {
    if (!e.target || e.target.id !== "krn-wizard-form") return;
    if (step < 3) { e.preventDefault(); e.stopImmediatePropagation(); tryGo(step + 1); return; }
    // let karun-wizard.js confirm; if it rejects, jump to the step that needs attention
    setTimeout(function () {
      var m = $("#krn-form-msg");
      if (!m || m.style.display === "none" || !m.textContent) return;
      if (!hasHotel()) setStep(1, true);
      else { var nm = $("#krn-name"); if (nm && !nm.value.trim()) setStep(2, true); }
    }, 40);
  }

  /* ------------------------------------------------------------------
     Loop + lifecycle
     ------------------------------------------------------------------ */
  var ticking = false;
  function frame() {
    ticking = false;
    var y = W.scrollY || HTML.scrollTop || 0;
    navUpdate(y); journeyUpdate(); svcUpdate(); destUpdate(); ambientUpdate();
  }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  var rsT = 0;
  function onResize() {
    clearTimeout(rsT);
    rsT = setTimeout(function () { jPathRef = null; svcMeasure(); foams.forEach(function (f) { f.size(); }); paintInk(); req(); }, 120);
  }

  var lastLang = null;
  function refresh() {
    // (re)bind everything that may have been re-created by a remount
    drawerSync(); paintStats(); fleetApply(); chooserRender(); zoneChips(); zonesRender(false);
    var f = formEl(); if (f && f.getAttribute("data-k23-step") !== String(step)) setStep(step, false);
    bindFoams(); bindReveals(); destModalCta(); svcMeasure(); paintInk();
    var l = lang(); if (l !== lastLang) { lastLang = l; chooserRender(); zonesRender(true); zoneChips(); }
    req();
  }

  var moT = 0, mutating = false;
  function boot() {
    D.addEventListener("click", onClick);
    D.addEventListener("keydown", onKey);
    W.addEventListener("submit", onSubmitCapture, true);
    D.addEventListener("change", function (e) { if (e.target && e.target.id === "krn-zone-filter") zoneChips(); });
    D.addEventListener("pointermove", onPointerMove, { passive: true });
    W.addEventListener("scroll", req, { passive: true });
    W.addEventListener("resize", onResize);
    W.addEventListener("load", function () { svcMeasure(); req(); });
    if (D.fonts && D.fonts.ready) D.fonts.ready.then(function () { svcMeasure(); paintInk(); req(); });
    try {
      var mo = new MutationObserver(function (list) {
        if (mutating) return;
        var relevant = list.some(function (m) {
          if (m.type === "attributes") return true;
          var n = m.target;
          return !(n && n.closest && (n.closest("[data-k23-dest-name]") || n.closest("[data-k23-nodes]") || n.closest("[data-k23-zonechips]") || n.closest("[data-k23-zlist]") || n.closest("[data-k23-rec]") || n.closest(".k23-zp-card") || n.closest("[data-k23-svc-now]") || n.closest("[data-k23-dest-now]") || n.closest("[data-k23-stat]")));
        });
        if (!relevant) return;
        clearTimeout(moT);
        moT = setTimeout(function () { mutating = true; try { refresh(); } finally { setTimeout(function () { mutating = false; }, 0); } }, 80);
      });
      mo.observe(D.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-lang", "data-open"] });
    } catch (e) {}
    refresh();
    setTimeout(refresh, 400);
    setTimeout(refresh, 1500);
    setTimeout(refresh, 3500);
  }

  if (D.readyState === "loading") D.addEventListener("DOMContentLoaded", boot);
  else boot();

  W.K23 = { refresh: refresh, setStep: setStep, zones: function (o, z) { zOrigin = o || zOrigin; if (z) zSel[zOrigin] = z; zonesRender(true); } };
})();
