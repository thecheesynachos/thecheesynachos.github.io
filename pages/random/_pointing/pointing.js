// Pointing games (SingaPointing, Chiang Mai Pointing, ...) — the shared game logic.
// Expects Leaflet (window.L) and, from the game's own folder, config.js, text.js and
// data-photos.js, plus pixel.js and the #pointing markup from _includes/pointing-game.html.
//
// Nothing about a particular city lives here: the map area, map styles, scoring and
// title-screen scene come from the game's config.js, and every word from its text.js.
"use strict";
(function () {

const C = window.POINTING_CONFIG || {};
const ROUNDS = C.rounds || 5;                  // photos per game (fewer if the pool is smaller)
const MAX_POINTS = C.maxPoints || 10000;       // the most a single round can be worth
const FULL_MARKS_KM = C.fullMarksKm || 0.05;   // within this distance you get MAX_POINTS
const DECAY_KM = C.decayKm || 3;               // points fall off as exp(-km / DECAY_KM)
const MIN_SEP_KM = C.minSepKm || 2;            // photos in one game are at least this far apart, when the pool allows
const TIMER_SECONDS = C.timerSeconds || 30;    // "timer" challenge: seconds per photo
const PEEK_SECONDS = C.peekSeconds || 3;       // "quick look" challenge: the photo hides after this long

// Map styles, in button order; the first is the default. Any Leaflet tile URL works.
const MAPS = C.maps || {
  streets: {
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png", maxNativeZoom: 19,
    attr: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
};
const MAP_NAMES = Object.keys(MAPS), DEFAULT_MAP = MAP_NAMES[0];
const cap = function (k) { return k.charAt(0).toUpperCase() + k.slice(1); };

const BEST_KEY = (C.storageKey || "pointing") + "Best";          // + ":t-p-outline" etc. for challenge combos
const SETTINGS_KEY = (C.storageKey || "pointing") + "Settings";

const box = document.getElementById("pointing");
const $ = function (id) { return document.getElementById(id); };
const BASE = box.dataset.base || ".";
const PX = window.SP_PIXEL;
const T = window.POINTING_TEXT;
const POOL = (window.POINTING_PHOTOS || []).filter(function (p) {
  return p && p.file && isFinite(p.lat) && isFinite(p.lon);
});

/* ---------- helpers ---------- */
const RAD = Math.PI / 180;
function haversineKm(a, b) {
  const dLat = (b.lat - a.lat) * RAD, dLon = (b.lon - a.lon) * RAD;
  const s = Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * RAD) * Math.cos(b.lat * RAD) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.min(1, Math.sqrt(s)));
}
function scoreFor(km) {
  if (km <= FULL_MARKS_KM) return MAX_POINTS;
  return Math.round(MAX_POINTS * Math.exp(-km / DECAY_KM));
}
function fmtKm(km) {
  return km < 1 ? Math.round(km * 1000) + " m" : km.toFixed(km < 10 ? 2 : 1) + " km";
}
function fmtN(n) { return Math.round(n).toLocaleString(); }
function rating(km) {
  return T.ratings.filter(function (r) { return km < r.within; })[0] || T.ratings[T.ratings.length - 1];
}
function grade(frac) {
  return (T.grades.filter(function (g) { return frac >= g.atLeast; })[0] || T.grades[T.grades.length - 1]).word;
}
// text.js lookups: tx("end.newBest", {best: 1234}) -> the string with {placeholders} filled
function tx(path, vars) {
  const str = path.split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, T);
  if (str == null) return path;
  const n = G.rounds.length || nRounds();
  vars = Object.assign({
    rounds: n, perRound: fmtN(MAX_POINTS), max: fmtN(n * MAX_POINTS), seconds: TIMER_SECONDS, peek: PEEK_SECONDS
  }, vars || {});
  return String(str).replace(/\{(\w+)\}/g, function (m, k) { return k in vars ? vars[k] : m; });
}
// fill every data-txt / data-html / data-tip element in the markup
// (a string missing from text.js hides its element rather than showing its name)
function hasTx(path) { return path.split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, T) != null; }
function applyText() {
  box.querySelectorAll("[data-txt]").forEach(function (el) {
    el.textContent = hasTx(el.dataset.txt) ? tx(el.dataset.txt) : ""; if (!hasTx(el.dataset.txt)) show(el, false);
  });
  box.querySelectorAll("[data-html]").forEach(function (el) {
    el.innerHTML = hasTx(el.dataset.html) ? tx(el.dataset.html) : ""; if (!hasTx(el.dataset.html)) show(el, false);
  });
  box.querySelectorAll("[data-tip]").forEach(function (el) { el.title = tx(el.dataset.tip); });
}
function tone(pts) {
  const f = pts / MAX_POINTS;
  return f >= 0.7 ? "great" : f >= 0.35 ? "good" : f >= 0.1 ? "ok" : "bad";
}
const TONE_COLOR = { great: "#22a565", good: "#f2b33d", ok: "#ef7d3c", bad: "#e23d4b" };
function shuffle(a) {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}
function photoUrl(p) {
  return /^(https?:)?\/\//.test(p.file) || p.file.charAt(0) === "/" ? p.file : BASE + "/" + p.file;
}
function show(el, on) { el.classList.toggle("sp-hidden", !on); }
function isOpen(id) { return !$(id).classList.contains("sp-hidden"); }
/* ---------- challenge settings (remembered in this browser) ---------- */
const SET = { timer: false, peek: false, map: DEFAULT_MAP };
try { Object.assign(SET, JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}")); } catch (e) { }
if (!MAPS[SET.map]) SET.map = DEFAULT_MAP;
function saveSettings() { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(SET)); } catch (e) { } }
// each combination of challenges keeps its own best score; plain classic keeps the old key
function modeKey() {
  const parts = [];
  if (SET.timer) parts.push("t");
  if (SET.peek) parts.push("p");
  if (SET.map !== DEFAULT_MAP) parts.push(SET.map);
  return parts.length ? BEST_KEY + ":" + parts.join("-") : BEST_KEY;
}
function getBest() { try { return +(localStorage.getItem(modeKey()) || 0); } catch (e) { return 0; } }
function setBest(v) { try { localStorage.setItem(modeKey(), String(v)); } catch (e) { } }
// "30s timer · Quick look" (empty for classic)
function modeList() {
  const l = [];
  if (SET.timer) l.push(tx("options.timer"));
  if (SET.peek) l.push(tx("options.peek"));
  if (SET.map !== DEFAULT_MAP) l.push(tx("options.map" + cap(SET.map)));
  return l;
}
// count a number up in an element
// (frame timestamps can be a hair earlier than t0, hence the clamp; the timeout makes
// sure the final value lands even if the browser stops animating, e.g. a hidden tab)
function countUp(el, to, ms) {
  const t0 = performance.now(), id = (el.spCount = (el.spCount || 0) + 1);
  (function step(now) {
    if (el.spCount !== id) return;
    const k = Math.max(0, Math.min(1, (now - t0) / ms)), e = 1 - Math.pow(1 - k, 3);
    el.textContent = fmtN(to * e);
    if (k < 1) requestAnimationFrame(step);
  })(t0);
  setTimeout(function () {
    if (el.spCount !== id) return;
    el.textContent = fmtN(to); el.spCount++;   // bumping the id stops any late frame
  }, ms + 100);
}

/* ---------- map ---------- */
// The area to play in: config.js gives a box, or "auto" to fit whatever the photos cover.
function photoBounds() {
  if (POOL.length < 2) return null;
  const b = L.latLngBounds(POOL.map(function (p) { return [p.lat, p.lon]; }));
  return b.pad(0.15);
}
const AUTO = C.bounds === "auto";
// the opening view: config's `view` box if given (fits any screen size), else the photos'
// area when bounds is "auto", else center + zoom
const HOME_BOUNDS = C.view ? L.latLngBounds(C.view) : AUTO ? photoBounds() : null;
const MAX_BOUNDS = AUTO ? (HOME_BOUNDS && HOME_BOUNDS.pad(0.6)) : (C.bounds && L.latLngBounds(C.bounds));
const map = L.map("sp-map", {
  center: C.center || [0, 0], zoom: C.zoom || 11, minZoom: C.minZoom || 3, maxZoom: 18,
  maxBounds: MAX_BOUNDS || undefined, maxBoundsViscosity: 0.8, zoomSnap: 0.5
});
// lockZoomOut: while guessing, you can't zoom out past the opening view (it depends on the
// screen size, so it's worked out here). Unlocked for the reveal and the review map, so
// an answer far outside the opening view can still be shown.
function lockZoom(on) {
  const z = HOME_BOUNDS ? map.getBoundsZoom(HOME_BOUNDS) : (C.zoom || 11);
  map.setMinZoom(on && C.lockZoomOut ? z : (C.minZoom || 3));
}
function homeView() {
  lockZoom(true);
  if (HOME_BOUNDS) map.fitBounds(HOME_BOUNDS, { animate: false });
  else map.setView(C.center || [0, 0], C.zoom || 11, { animate: false });
}
homeView();
let tiles = null;
// A `land` map draws shapes from a data file (window.POINTING_LAND = {name: GeoJSON geometry, ...})
// instead of, or on top of (when it also has a `url`), map tiles. Its `layers` in config.js
// give each shape set's Leaflet style, in drawing order; by default it's a land silhouette:
const LAND_STYLE = {
  near: { stroke: false, fillColor: "#8c93a6", fillOpacity: 1 },   // the neighbours
  home: { stroke: false, fillColor: "#2f2c40", fillOpacity: 1 },   // the game's own country / city
};
let landLoading = false;
function landLayer(m) {
  const g = L.layerGroup();
  g.options.attribution = m.attr;   // so the attribution control picks it up
  if (m.url) L.tileLayer(m.url, { maxZoom: 19, maxNativeZoom: m.maxNativeZoom }).addTo(g);   // a base under the shapes
  const styles = m.layers || LAND_STYLE;
  let filled = false;
  g.spFill = function () {
    const land = window.POINTING_LAND;
    if (!land || filled) return;
    filled = true;
    const r = L.canvas({ padding: 0.5 });
    Object.keys(styles).forEach(function (k) {
      if (land[k]) L.geoJSON(land[k], { style: styles[k], renderer: r, interactive: false }).addTo(g);
    });
  };
  if (!window.POINTING_LAND && !landLoading) {   // fetched the first time someone picks this map
    landLoading = true;
    const s = document.createElement("script");
    s.src = BASE + "/" + m.land + (box.dataset.v ? "?v=" + box.dataset.v : "");
    s.onload = function () { if (tiles && tiles.spFill) tiles.spFill(); };
    document.head.appendChild(s);
  }
  g.spFill();
  return g;
}
function setMapStyle(name) {
  const m = MAPS[name] || MAPS[DEFAULT_MAP];
  if (tiles) map.removeLayer(tiles);
  tiles = m.land ? landLayer(m)
    : L.tileLayer(m.url, { attribution: m.attr, maxZoom: 19, maxNativeZoom: m.maxNativeZoom });
  tiles.addTo(map);
  map.setMaxZoom(m.maxZoom || 18);   // don't let blurry upscaled tiles be the closest view
  map.getContainer().style.background = m.bg || "";
  box.dataset.map = name;
}
setMapStyle(SET.map);
const layer = L.layerGroup().addTo(map);   // everything drawn per round

// a pixel sprite as a map marker; anchored at the pin tip / bottom of the flag pole
function spriteIcon(name, label) {
  const sz = PX.spriteSize(name), s = 3, w = sz[0] * s, h = sz[1] * s;
  const anchor = name === "flag" ? [Math.round(1.5 * s), h] : [Math.round(w / 2), h];
  return L.divIcon({
    className: "sp-pin", iconSize: [w, h], iconAnchor: anchor,
    html: '<img src="' + PX.spriteURL(name, 4) + '" alt="">' + (label ? '<span class="sp-pin-n">' + label + "</span>" : "")
  });
}

/* ---------- game state ---------- */
const G = { rounds: [], i: 0, total: 0, guess: null, guessMarker: null, phase: "title", results: [] };
const nRounds = function () { return Math.min(ROUNDS, POOL.length); };

// n random photos, each at least minKm from every other. Greedy picks over a few
// random orderings; if no ordering manages it (the pool is too clustered), the best
// attempt is topped up with whichever leftovers are farthest from what's already
// picked, so a game always has n photos and is as spread out as the pool allows.
function pickSpread(pool, n, minKm) {
  function nearest(p, picked) {
    let d = Infinity;
    for (let k = 0; k < picked.length; k++) d = Math.min(d, haversineKm(p, picked[k]));
    return d;
  }
  let best = [];
  for (let attempt = 0; attempt < 50 && best.length < n; attempt++) {
    const picked = [];
    const order = shuffle(pool);
    for (let k = 0; k < order.length && picked.length < n; k++) {
      if (nearest(order[k], picked) >= minKm) picked.push(order[k]);
    }
    if (picked.length > best.length) best = picked;
  }
  const rest = shuffle(pool.filter(function (p) { return best.indexOf(p) < 0; }));
  while (best.length < n && rest.length) {
    let bi = 0, bd = -1;
    for (let k = 0; k < rest.length; k++) {
      const d = nearest(rest[k], best);
      if (d > bd) { bd = d; bi = k; }
    }
    best.push(rest.splice(bi, 1)[0]);
  }
  return shuffle(best);
}

/* ---------- top bar ---------- */
function renderPips() {
  const n = G.rounds.length || nRounds();
  const live = G.phase === "guessing" || G.phase === "revealed";
  let html = "";
  for (let k = 0; k < n; k++) {
    const r = G.results[k];
    const cls = r ? "sp-t-" + tone(r.pts) : (live && k === G.i ? "sp-now" : "");
    const tip = r ? tx("hud.pipDone", { n: k + 1, points: fmtN(r.pts) }) : tx("hud.pip", { n: k + 1 });
    html += '<span class="sp-pip ' + cls + '" title="' + tip + '">' + (k + 1) + "</span>";
  }
  $("sp-pips").innerHTML = html;
}
function setTip(html) { $("sp-tip").innerHTML = html; }

/* ---------- flow ---------- */
function showTitle() {
  G.phase = "title"; G.results = []; G.rounds = [];
  layer.clearLayers();
  $("sp-score").textContent = "0";
  renderPips();
  show($("sp-end"), false); show($("sp-review-back"), false); show($("sp-help"), false);
  show($("sp-leave"), false);
  show($("sp-splash"), true);
  renderOptions();
  $("sp-play").disabled = POOL.length === 0;
  scene.start();
}

/* ---------- title-screen challenge toggles ---------- */
// one button per map style in config.js, labelled from text.js (options.mapStreets, ...)
MAP_NAMES.forEach(function (k) {
  const b = document.createElement("button");
  b.dataset.map = k; b.dataset.txt = "options.map" + cap(k);
  $("sp-opt-map").appendChild(b);
});
if (MAP_NAMES.length < 2) show($("sp-opt-map"), false);
function renderOptions() {
  $("sp-opt-timer").setAttribute("aria-pressed", SET.timer);
  $("sp-opt-peek").setAttribute("aria-pressed", SET.peek);
  box.querySelectorAll("#sp-opt-map [data-map]").forEach(function (b) {
    b.setAttribute("aria-pressed", b.dataset.map === SET.map);
  });
  const d = [];
  if (SET.timer) d.push(tx("options.descTimer"));
  if (SET.peek) d.push(tx("options.descPeek"));
  if (SET.map !== DEFAULT_MAP) d.push(tx("options.desc" + cap(SET.map)));
  $("sp-opt-desc").innerHTML = d.length ? d.join(" &middot; ") : tx("options.descNone");
  const best = getBest();
  $("sp-stats").innerHTML = POOL.length
    ? tx(best ? "title.statsBest" : "title.stats", { best: fmtN(best) })
    : tx("title.noPhotos");
}
$("sp-opt-timer").onclick = function () { SET.timer = !SET.timer; saveSettings(); renderOptions(); };
$("sp-opt-peek").onclick = function () { SET.peek = !SET.peek; saveSettings(); renderOptions(); };
box.querySelectorAll("#sp-opt-map [data-map]").forEach(function (b) {
  b.onclick = function () { SET.map = b.dataset.map; saveSettings(); setMapStyle(SET.map); renderOptions(); };
});

/* ---------- per-round clocks: the timer and the quick-look cover ---------- */
let timerId = null, peekId = null, deadline = 0;
function stopClocks() {
  clearInterval(timerId); clearTimeout(peekId); timerId = peekId = null;
  $("sp-timer").classList.remove("sp-low");
  const pb = $("sp-peekbar"); pb.style.transition = "none"; pb.style.width = "0";
}
function tickTimer() {
  const left = Math.max(0, (deadline - performance.now()) / 1000);
  $("sp-timer-n").textContent = Math.ceil(left);
  $("sp-timer-bar").style.width = (100 * left / TIMER_SECONDS) + "%";
  $("sp-timer").classList.toggle("sp-low", left <= 10);
  if (left <= 0) { stopClocks(); submitGuess(true); }
}
// called once the round's photo is on screen, so slow loading doesn't eat the clock
function startClocks(round) {
  if (G.phase !== "guessing" || G.i !== round) return;
  if (SET.timer && !timerId) {
    deadline = performance.now() + TIMER_SECONDS * 1000;
    tickTimer(); timerId = setInterval(tickTimer, 100);
  }
  if (SET.peek && !peekId) {
    const pb = $("sp-peekbar");
    pb.style.transition = "none"; pb.style.width = "100%"; void pb.offsetWidth;
    pb.style.transition = "width " + PEEK_SECONDS + "s linear"; pb.style.width = "0";
    peekId = setTimeout(function () {
      if (G.phase !== "guessing" || G.i !== round) return;
      $("sp-frame").classList.add("sp-covered");
    }, PEEK_SECONDS * 1000);
  }
}

function newGame() {
  G.rounds = pickSpread(POOL, nRounds(), MIN_SEP_KM);
  // fetch this game's photos up front so later rounds show instantly; only these
  // few are ever downloaded, never the whole pool
  G.preloaded = G.rounds.map(function (p) { const im = new Image(); im.src = photoUrl(p); return im; });
  G.i = 0; G.total = 0; G.results = [];
  $("sp-score").textContent = "0";
  setMapStyle(SET.map);
  box.classList.toggle("sp-timed", SET.timer);
  show($("sp-splash"), false); show($("sp-end"), false); show($("sp-review-back"), false);
  scene.stop();
  map.invalidateSize();
  startRound();
}

function startRound() {
  const p = G.rounds[G.i], round = G.i;
  G.phase = "guessing"; G.guess = null; G.guessMarker = null;
  layer.clearLayers();
  stopClocks();
  $("sp-frame").classList.remove("sp-covered");
  show($("sp-timer"), SET.timer);
  if (SET.timer) { $("sp-timer-n").textContent = TIMER_SECONDS; $("sp-timer-bar").style.width = "100%"; }
  const img = $("sp-photo");
  img.classList.remove("sp-in"); show($("sp-loading"), true);
  img.onload = function () {
    img.classList.add("sp-in"); show($("sp-loading"), false);
    startClocks(round);
  };
  img.onerror = function () { show($("sp-loading"), false); startClocks(round); };
  img.src = photoUrl(p);
  if (img.complete && img.naturalWidth) img.onload();
  $("sp-badge").textContent = tx("photo.badge", { n: G.i + 1 });
  $("sp-info-round").textContent = tx("info.round", { n: G.i + 1 });
  show($("sp-result"), false); show($("sp-dock"), true);
  $("sp-guess").disabled = true;
  $("sp-guess").textContent = tx("buttons.placePin");
  setTip(tx("info.tipStart"));
  renderPips();
  homeView();
}

map.on("click", function (e) {
  if (G.phase !== "guessing") return;
  G.guess = { lat: e.latlng.lat, lon: e.latlng.lng };
  if (G.guessMarker) layer.removeLayer(G.guessMarker);   // re-add so the drop animation replays
  G.guessMarker = L.marker(e.latlng, { icon: spriteIcon("pin"), keyboard: false }).addTo(layer);
  $("sp-guess").disabled = false;
  $("sp-guess").textContent = tx("buttons.guess");
  setTip(tx("info.tipPinned"));
});

// grow the dashed line from the guess to the answer, then call done()
function drawLine(g, a, color, done) {
  const line = L.polyline([g, g], { color: color, weight: 4, dashArray: "2 8", lineCap: "square" }).addTo(layer);
  const t0 = performance.now(), ms = 650;
  let finished = false;
  function finish() {
    if (finished) return;
    finished = true; line.setLatLngs([g, a]); if (done) done();
  }
  (function step(now) {
    if (finished) return;
    const k = Math.max(0, Math.min(1, (now - t0) / ms)), e = 1 - Math.pow(1 - k, 2);
    line.setLatLngs([g, [g[0] + (a[0] - g[0]) * e, g[1] + (a[1] - g[1]) * e]]);
    if (k < 1) requestAnimationFrame(step); else finish();
  })(t0);
  setTimeout(finish, ms + 100);
}

// timedOut: the timer ran out, so submit whatever is there (possibly no pin at all)
function submitGuess(timedOut) {
  if (G.phase !== "guessing" || (!G.guess && timedOut !== true)) return;
  stopClocks();
  $("sp-frame").classList.remove("sp-covered");   // the photo comes back for the reveal
  const p = G.rounds[G.i];
  const ans = { lat: p.lat, lon: p.lon };
  const km = G.guess ? haversineKm(G.guess, ans) : null;
  const pts = G.guess ? scoreFor(km) : 0;
  G.total += pts;
  G.results.push({ p: p, guess: G.guess, km: km, pts: pts });
  G.phase = "revealed";

  const a = [ans.lat, ans.lon];
  function dropFlag() {
    if (G.phase !== "revealed" || G.rounds[G.i] !== p) return;   // player already moved on
    const m = L.marker(a, { icon: spriteIcon("flag"), keyboard: false }).addTo(layer);
    if (p.caption) m.bindTooltip(p.caption, { permanent: true, direction: "top", offset: [8, -48] });
  }
  lockZoom(false);
  if (G.guess) {
    const g = [G.guess.lat, G.guess.lon];
    map.flyToBounds(L.latLngBounds([g, a]), {
      paddingTopLeft: [50, 70], paddingBottomRight: [50, 230], maxZoom: Math.min(16, map.getMaxZoom()), duration: 0.7
    });
    drawLine(g, a, (MAPS[SET.map] || MAPS[DEFAULT_MAP]).line || "#1d1b26", dropFlag);
  } else {
    map.flyTo(a, 14, { duration: 0.7 });
    dropFlag();
  }

  const r = G.guess ? rating(km) : { word: tx("timer.timeUp"), tone: "bad" };
  $("sp-rating").textContent = r.word;
  $("sp-rating").className = "sp-rating sp-c-" + r.tone;
  $("sp-dist").textContent = G.guess ? tx("result.distance", { dist: fmtKm(km) }) : tx("result.noGuess");
  $("sp-bar").style.width = "0";
  $("sp-bar").style.background = TONE_COLOR[tone(pts)];
  $("sp-next").textContent = tx(G.i + 1 < G.rounds.length ? "buttons.next" : "buttons.results");
  show($("sp-dock"), false); show($("sp-result"), true);
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { $("sp-bar").style.width = (100 * pts / MAX_POINTS) + "%"; });
  });
  countUp($("sp-pts"), pts, 800);
  countUp($("sp-score"), G.total, 800);
  setTip(tx("info.tipRevealed", { points: fmtN(pts), dist: G.guess ? fmtKm(km) : "", rating: r.word }));
  renderPips();
}

function nextRound() {
  if (G.phase !== "revealed") return;
  G.i++;
  if (G.i < G.rounds.length) startRound(); else showEnd();
}

function showEnd() {
  G.phase = "done";
  renderPips();
  const max = G.rounds.length * MAX_POINTS, best = getBest(), isBest = G.total > best;
  if (isBest) setBest(G.total);
  $("sp-grade").textContent = grade(G.total / max);
  const modes = modeList();
  $("sp-modes").textContent = modes.length ? tx("end.modes", { list: modes.join(" \u00B7 ") }) : "";
  $("sp-best").innerHTML = isBest
    ? '<span class="sp-new">' + tx("end.newBest") + "</span>" + (best ? " &nbsp;" + tx("end.wasBest", { best: fmtN(best) }) : "")
    : tx("end.yourBest", { best: fmtN(best) });
  $("sp-rows").innerHTML = G.results.map(function (r, k) {
    return '<div class="sp-row"><img src="' + photoUrl(r.p) + '" alt="">' +
      '<div class="sp-row-mid"><div class="sp-row-name">' + tx("end.row", { n: k + 1 }) + "</div>" +
      '<div class="sp-row-dist">' + (r.guess ? tx("end.rowDetail", { dist: fmtKm(r.km), rating: rating(r.km).word }) : tx("end.rowNoGuess")) + "</div>" +
      '<div class="sp-bar"><i style="width:' + (100 * r.pts / MAX_POINTS) + "%;background:" + TONE_COLOR[tone(r.pts)] + '"></i></div></div>' +
      '<div class="sp-row-pts">' + fmtN(r.pts) + "</div></div>";
  }).join("");
  show($("sp-result"), false);
  show($("sp-end"), true);
  countUp($("sp-total"), G.total, 1100);
  $("sp-info-round").textContent = tx("info.endRound");
  setTip(tx("info.tipEnd", { total: fmtN(G.total) }));
}

// every guess and answer of the game at once, on the map
function review() {
  show($("sp-end"), false); show($("sp-review-back"), true);
  show($("sp-result"), false); show($("sp-dock"), false);
  $("sp-info-round").textContent = tx("info.reviewRound");
  setTip(tx("info.tipReview"));
  lockZoom(false);
  layer.clearLayers();
  const pts = [];
  G.results.forEach(function (r, k) {
    const a = [r.p.lat, r.p.lon];
    if (r.guess) {
      const g = [r.guess.lat, r.guess.lon];
      L.polyline([g, a], { color: TONE_COLOR[tone(r.pts)], weight: 4, dashArray: "2 8", lineCap: "square" }).addTo(layer);
      L.marker(g, { icon: spriteIcon("pin"), keyboard: false }).addTo(layer);
      pts.push(g);
    }
    L.marker(a, { icon: spriteIcon("flag", String(k + 1)), keyboard: false }).addTo(layer)
      .bindTooltip(r.guess ? tx("end.reviewTip", { n: k + 1, dist: fmtKm(r.km), points: fmtN(r.pts) })
                           : tx("end.reviewTipNoGuess", { n: k + 1 }), { direction: "top", offset: [8, -48] });
    pts.push(a);
  });
  map.flyToBounds(L.latLngBounds(pts), { padding: [70, 70], maxZoom: 15, duration: 0.7 });
}

/* ---------- wiring ---------- */
$("sp-play").onclick = newGame;
$("sp-again").onclick = newGame;
$("sp-guess").onclick = function () { submitGuess(false); };
$("sp-next").onclick = nextRound;
$("sp-review").onclick = review;
$("sp-end-home").onclick = showTitle;
$("sp-review-back").onclick = function () { show($("sp-review-back"), false); show($("sp-end"), true); };
// Home mid-game asks first (the clock keeps running while it's open); otherwise just go
$("sp-home-btn").onclick = function () {
  if (G.phase === "guessing" || G.phase === "revealed") show($("sp-leave"), true);
  else showTitle();
};
$("sp-leave-stay").onclick = function () { show($("sp-leave"), false); };
$("sp-leave-go").onclick = function () { show($("sp-leave"), false); stopClocks(); showTitle(); };
$("sp-leave").onclick = function (e) { if (e.target === this) show(this, false); };
function openHelp() { show($("sp-help"), true); }
$("sp-how").onclick = openHelp;
$("sp-help-btn").onclick = openHelp;
$("sp-help-close").onclick = function () { show($("sp-help"), false); };
$("sp-help").onclick = function (e) { if (e.target === this) show(this, false); };


/* ---------- fullscreen ---------- */
// Real browser fullscreen where available; otherwise (e.g. iPhone Safari) the game just
// fills the browser window. The sp-full class does the layout either way.
function isFull() { return box.classList.contains("sp-full"); }
function fsElement() { return document.fullscreenElement || document.webkitFullscreenElement; }
function setFull(on) {
  box.classList.toggle("sp-full", on);
  document.body.style.overflow = document.documentElement.style.overflow = on ? "hidden" : "";
  box.querySelectorAll(".sp-fs-btn").forEach(function (b) { b.title = tx(on ? "hud.exitFullscreen" : "hud.fullscreen"); });
  setTimeout(function () { map.invalidateSize(); scene.resize(); }, 60);
}
function toggleFull() {
  if (!isFull()) {
    const req = box.requestFullscreen || box.webkitRequestFullscreen;
    if (req) { try { const pr = req.call(box); if (pr && pr.catch) pr.catch(function () { }); } catch (e) { } }
    setFull(true);
  } else {
    if (fsElement()) {
      const ex = document.exitFullscreen || document.webkitExitFullscreen;
      try { const pr = ex.call(document); if (pr && pr.catch) pr.catch(function () { }); } catch (e) { }
    }
    setFull(false);
  }
}
function onFsChange() { if (!fsElement() && isFull()) setFull(false); }   // left via Esc / browser UI
document.addEventListener("fullscreenchange", onFsChange);
document.addEventListener("webkitfullscreenchange", onFsChange);
// view count from the site's visitor counter (layout: game reads it from the hidden widget)
function showVisits(v) {
  if (!v || !(v.count > 0)) return;
  $("sp-visits").innerHTML = tx("title.visits", { count: fmtN(v.count) });
  if (v.range) $("sp-visits").title = v.range;
  show($("sp-visits"), true);
}
if (window.SITE_VISITS) showVisits(window.SITE_VISITS);
else document.addEventListener("sitevisits", function (e) { showVisits(e.detail); });

// on its own full-window page with no fullscreen support (e.g. iPhone Safari) the buttons would do nothing
if (document.body.classList.contains("game-page") && !(box.requestFullscreen || box.webkitRequestFullscreen))
  box.querySelectorAll(".sp-fs-btn").forEach(function (b) { b.style.display = "none"; });
$("sp-fs").onclick = toggleFull;
$("sp-fs2").onclick = toggleFull;
window.addEventListener("resize", function () {
  map.invalidateSize(); scene.resize();
  if (G.phase === "guessing") lockZoom(true);   // the opening view's zoom depends on the screen size
});

document.addEventListener("keydown", function (e) {
  const t = e.target;
  if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
  if (e.key === "Escape") {
    if (isOpen("sp-help")) show($("sp-help"), false);
    else if (isOpen("sp-leave")) show($("sp-leave"), false);
    else if (isFull()) toggleFull();
    return;
  }
  if (e.key !== " " && e.key !== "Enter") return;
  if (isOpen("sp-help") || isOpen("sp-leave")) return;
  if (t && t.tagName === "BUTTON" && box.contains(t)) return;   // let a focused button do its own click
  // only take over Space/Enter while the game is on screen
  const r = box.getBoundingClientRect();
  if (r.bottom < 0 || r.top > window.innerHeight) return;
  if (G.phase === "guessing" && G.guess) { e.preventDefault(); submitGuess(); }
  else if (G.phase === "revealed") { e.preventDefault(); nextRound(); }
});

/* ---------- boot ---------- */
$("sp-logo").src = PX.spriteURL("pin", 2);
document.querySelectorAll("#pointing [data-sprite]").forEach(function (im) {
  im.src = PX.spriteURL(im.dataset.sprite, 4);
});
$("sp-photo").alt = tx("photo.alt");
applyText();
const scene = new PX.Scene($("sp-scene"), C.scene);
showTitle();

})();
