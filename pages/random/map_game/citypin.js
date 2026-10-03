// City Pin — game logic. Expects text.js, data-map.js and data-cities.js to have run
// first, and the #citypin markup from index.html to be in the document.
//
// No wording lives in this file: everything the player reads comes from text.js, and
// every label in the markup is filled in by applyText() below.
"use strict";
const MAP_DATA = window.CITYPIN_MAP;
const CITY_DATA = window.CITYPIN_CITIES;
const T = window.CITYPIN_TEXT;

const ROUNDS = 10;         // cities per game
const MAX_POINTS = 5000;   // the most a single round can be worth

/* ---------- decoding ---------- */
const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const IDX = new Int8Array(128).fill(-1);
for (let i = 0; i < 64; i++) IDX[B64.charCodeAt(i)] = i;

function decodeInts(s) {
  const out = [];
  let v = 0, sh = 0;
  for (let i = 0; i < s.length; i++) {
    const c = IDX[s.charCodeAt(i)];
    if (!(c >= 0)) continue;          // skip the newlines that wrap data-map.js
    v |= (c & 31) << sh;
    if (c & 32) { sh += 5; }
    else { out.push((v >>> 1) ^ -(v & 1)); v = 0; sh = 0; }
  }
  return out;
}

// rings: {lon:Float64Array, lat:Float64Array, w:number, e:number, n:number, s:number}
const RINGS = (function () {
  const v = decodeInts(MAP_DATA), rings = [];
  let i = 0;
  while (i < v.length) {
    const n = v[i++];
    const lon = new Float64Array(n), lat = new Float64Array(n);
    let x = 0, y = 0, prev = null, w = 1e9, e = -1e9, s = 1e9, nn = -1e9;
    for (let k = 0; k < n; k++) {
      x += v[i++]; y += v[i++];
      let lo = x / 50, la = y / 50;
      if (prev !== null) {                     // unwrap across the antimeridian
        while (lo - prev > 180) lo -= 360;
        while (prev - lo > 180) lo += 360;
      }
      prev = lo;
      lon[k] = lo; lat[k] = la;
      if (lo < w) w = lo; if (lo > e) e = lo;
      if (la < s) s = la; if (la > nn) nn = la;
    }
    rings.push({ lon, lat, w, e, s, n: nn });
  }
  return rings;
})();

const CITIES = CITY_DATA.split("\n")
  .map(function (r) { return r.trim(); })
  .filter(function (r) { return r && r.charAt(0) !== "#"; })
  .map(function (r) {
    const f = r.split("|");
    return { name: f[0], country: f[1], lat: +f[2], lon: +f[3], tier: +f[4] };
  });

/* ---------- helpers ---------- */
const $ = function (id) { return document.getElementById(id); };

// "{n} km" + {n: 12} -> "12 km". Unknown placeholders are left alone.
function fmt(str, vars) {
  return String(str).replace(/\{(\w+)\}/g, function (m, k) {
    return vars && k in vars ? vars[k] : m;
  });
}
function text(path) {
  return path.split(".").reduce(function (o, k) { return o[k]; }, T);
}
// values available to every string in text.js
function textVars() {
  return {
    rounds: ROUNDS,
    perRound: MAX_POINTS.toLocaleString(),
    total: (ROUNDS * MAX_POINTS).toLocaleString()
  };
}
const RAD = Math.PI / 180;

function haversine(a, b) {
  const dLat = (b.lat - a.lat) * RAD, dLon = (b.lon - a.lon) * RAD;
  const s = Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * RAD) * Math.cos(b.lat * RAD) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.min(1, Math.sqrt(s)));
}
function scoreFor(km) {
  if (km < 25) return MAX_POINTS;
  return Math.round(MAX_POINTS * Math.exp(-km / 1400));
}
function fmtKm(km) {
  return fmt(T.ui.km, { n: km < 10 ? km.toFixed(1) : Math.round(km).toLocaleString() });
}
const TONES = { good: "var(--good)", accent: "var(--accent)", bad: "var(--bad)" };
function rating(km) {
  const r = T.ratings.filter(function (x) { return km < x.within; })[0] ||
    T.ratings[T.ratings.length - 1];
  return [r.word, TONES[r.tone] || r.tone];
}

/* ---------- view / projection ---------- */
const box = $("citypin"), cv = $("map"), ctx = cv.getContext("2d");
let W = 0, H = 0, DPR = 1;
const view = { zoom: 1, clon: 0, clat: 0 };

function baseW() { return Math.min(W, H * 2); }
function scaleW() { return baseW() * view.zoom; }

function clampView() {
  view.zoom = Math.max(1, Math.min(60, view.zoom));
  const s = scaleW(), sh = s / 2;
  if (s <= W) view.clon = 0;
  else { const half = (W / s) * 180; view.clon = Math.max(-180 + half, Math.min(180 - half, view.clon)); }
  if (sh <= H) view.clat = 0;
  else { const half = (H / sh) * 90; view.clat = Math.max(-90 + half, Math.min(90 - half, view.clat)); }
}
function px(lon) { return W / 2 + ((lon - view.clon) / 360) * scaleW(); }
function py(lat) { return H / 2 - ((lat - view.clat) / 180) * (scaleW() / 2); }
function toLon(x) { return view.clon + ((x - W / 2) / scaleW()) * 360; }
function toLat(y) { return view.clat - ((y - H / 2) / (scaleW() / 2)) * 180; }

// canvas-relative coords; re-syncs the backing store if the layout moved under us
function evPt(e) {
  const r = cv.getBoundingClientRect();
  if (Math.abs(r.width - W) > 0.5 || Math.abs(r.height - H) > 0.5) resize();
  return { x: e.clientX - r.left, y: e.clientY - r.top };
}

function resize() {
  DPR = Math.min(2, window.devicePixelRatio || 1);
  const r = cv.getBoundingClientRect();
  W = r.width; H = r.height;
  cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  clampView(); draw();
}

function zoomAt(x, y, factor) {
  const lon = toLon(x), lat = toLat(y);
  view.zoom = Math.max(1, Math.min(60, view.zoom * factor));
  clampView();
  view.clon += lon - toLon(x);
  view.clat += lat - toLat(y);
  clampView(); draw();
}

/* ---------- drawing ---------- */
function drawLand() {
  const s = scaleW();
  const lonPad = (W / s) * 360 / 2 + 2, latPad = (H / (s / 2)) * 180 / 2 + 2;
  const wMin = view.clon - lonPad, wMax = view.clon + lonPad;
  const sMin = view.clat - latPad, sMax = view.clat + latPad;
  ctx.beginPath();
  for (let i = 0; i < RINGS.length; i++) {
    const r = RINGS[i];
    if (r.s > sMax || r.n < sMin) continue;
    for (let k = -1; k <= 1; k++) {
      const off = k * 360;
      if (k !== 0 && (r.e + off < -180.5 || r.w + off > 180.5)) continue;  // only wrap copies that belong
      if (r.e + off < wMin || r.w + off > wMax) continue;
      const lon = r.lon, lat = r.lat, n = lon.length;
      ctx.moveTo(px(lon[0] + off), py(lat[0]));
      for (let j = 1; j < n; j++) ctx.lineTo(px(lon[j] + off), py(lat[j]));
      ctx.closePath();
    }
  }
  ctx.fillStyle = getCSS("--land"); ctx.fill();
  if (borders) {
    ctx.strokeStyle = getCSS("--border");
    ctx.lineWidth = Math.min(1.4, 0.6 + view.zoom * 0.06);
    ctx.stroke();
  }
}

let borders = true;
try { borders = localStorage.getItem("cityPinBorders") !== "0"; } catch (e) { }

let cssCache = {};
function getCSS(v) {
  if (!cssCache[v]) cssCache[v] = getComputedStyle(box).getPropertyValue(v).trim();
  return cssCache[v];
}

function drawGrid() {
  const step = view.zoom > 16 ? 5 : view.zoom > 6 ? 10 : 30;
  ctx.strokeStyle = "rgba(255,255,255,.055)"; ctx.lineWidth = 1;
  ctx.beginPath();
  for (let lon = -180; lon <= 180; lon += step) {
    const x = px(lon); if (x < -1 || x > W + 1) continue;
    ctx.moveTo(x, 0); ctx.lineTo(x, H);
  }
  for (let lat = -90; lat <= 90; lat += step) {
    const y = py(lat); if (y < -1 || y > H + 1) continue;
    ctx.moveTo(0, y); ctx.lineTo(W, y);
  }
  ctx.stroke();
  const y0 = py(0);
  if (y0 > 0 && y0 < H) {
    ctx.strokeStyle = "rgba(255,255,255,.12)";
    ctx.beginPath(); ctx.moveTo(0, y0); ctx.lineTo(W, y0); ctx.stroke();
  }
}

function pin(lon, lat, color, label) {
  const x = px(lon), y = py(lat);
  if (x < -60 || x > W + 60 || y < -60 || y > H + 60) return;
  ctx.beginPath(); ctx.arc(x, y, 6.5, 0, 7);
  ctx.fillStyle = color; ctx.fill();
  ctx.lineWidth = 2.5; ctx.strokeStyle = "rgba(10,14,20,.85)"; ctx.stroke();
  ctx.beginPath(); ctx.arc(x, y, 12, 0, 7);
  ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.globalAlpha = .45; ctx.stroke();
  ctx.globalAlpha = 1;
  if (label) {
    ctx.font = "600 13px -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif";
    const w = ctx.measureText(label).width;
    let lx = x + 16, ly = y - 9;
    if (lx + w + 22 > W) lx = x - w - 30;
    if (lx < 4) lx = 4;
    if (ly < 4) ly = y + 6;
    ctx.fillStyle = "rgba(13,17,23,.86)";
    roundRect(lx - 7, ly - 5, w + 14, 22, 6); ctx.fill();
    ctx.fillStyle = color; ctx.fillText(label, lx, ly + 11);
  }
}
function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

function drawLink(a, b) {
  let lon2 = b.lon;
  while (lon2 - a.lon > 180) lon2 -= 360;
  while (a.lon - lon2 > 180) lon2 += 360;
  ctx.save();
  ctx.setLineDash([6, 5]); ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(240,180,41,.75)";
  for (const off of [0, -360, 360]) {
    ctx.beginPath();
    ctx.moveTo(px(a.lon + off), py(a.lat));
    ctx.lineTo(px(lon2 + off), py(b.lat));
    ctx.stroke();
  }
  ctx.restore();
}

function draw() {
  ctx.fillStyle = getCSS("--void");
  ctx.fillRect(0, 0, W, H);
  const x0 = px(-180), y0 = py(90), x1 = px(180), y1 = py(-90);
  ctx.save();
  ctx.beginPath(); ctx.rect(x0, y0, x1 - x0, y1 - y0); ctx.clip();
  ctx.fillStyle = getCSS("--ocean");
  ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  drawGrid();
  drawLand();
  if (G.phase === "result") {
    drawLink(G.guess, G.city);
    pin(G.guess.lon, G.guess.lat, "#ff6b6b", T.ui.yourPin);
    pin(G.city.lon, G.city.lat, "#3ddc97", G.city.name);
  } else if (G.guess) {
    pin(G.guess.lon, G.guess.lat, "#ff6b6b", null);
  }
  ctx.restore();
  ctx.strokeStyle = "rgba(255,255,255,.14)";
  ctx.lineWidth = 1;
  ctx.strokeRect(x0 + .5, y0 + .5, x1 - x0 - 1, y1 - y0 - 1);
}

/* ---------- game ---------- */
const G = { phase: "start", tier: 0, list: [], idx: 0, total: 0, guess: null, city: null, log: [] };

function pickCities(tier) {
  const pool = CITIES.filter(function (c) { return c.tier <= tier; });
  const out = [];
  const used = new Set();
  while (out.length < ROUNDS && used.size < pool.length) {
    const i = Math.floor(Math.random() * pool.length);
    if (used.has(i)) continue;
    used.add(i);
    const c = pool[i];
    // avoid two cities from the same country in one game where possible
    if (out.length < ROUNDS - 2 && out.some(function (o) { return o.country === c.country; })) continue;
    out.push(c);
  }
  return out;
}

function startGame() {
  G.list = pickCities(G.tier);
  G.idx = 0; G.total = 0; G.log = [];
  $("startScreen").classList.add("hidden");
  $("endScreen").classList.add("hidden");
  nextRound();
}

function nextRound() {
  G.city = G.list[G.idx];
  G.guess = null;
  G.phase = "guess";
  view.zoom = 1; view.clon = 0; view.clat = 0; clampView();
  $("city").innerHTML = esc(G.city.name) + "<small>" + esc(G.city.country) + "</small>";
  $("roundN").textContent = fmt(T.ui.roundCounter, { n: G.idx + 1, rounds: ROUNDS });
  $("scoreN").textContent = G.total.toLocaleString();
  setVerdict(T.ui.pickPrompt);
  const b = $("actionBtn");
  b.textContent = T.ui.guess; b.disabled = true;
  showHint(T.ui.hintClick);
  draw();
}

// plain message in the strip along the bottom
function setVerdict(msg) {
  $("verdict").innerHTML = '<span class="dist"></span>';
  $("verdict").firstChild.textContent = msg;
}

function esc(s) { return s.replace(/[&<>]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]; }); }

function submitGuess() {
  const km = haversine(G.guess, G.city);
  const pts = scoreFor(km);
  G.total += pts;
  G.log.push({ city: G.city, km: km, pts: pts });
  G.phase = "result";
  const [word, col] = rating(km);
  $("verdict").innerHTML =
    '<span class="rate" style="color:' + col + '">' + esc(word) + '</span>' +
    '<span class="pts">+' + pts.toLocaleString() + '</span>' +
    '<span class="dist">' +
    esc(fmt(T.result.distance, { km: fmtKm(km), city: G.city.name })) + '</span>';
  $("scoreN").textContent = G.total.toLocaleString();
  $("actionBtn").textContent = G.idx + 1 >= ROUNDS ? T.ui.seeResults : T.ui.nextCity;
  $("actionBtn").disabled = false;
  fitBoth(G.guess, G.city);
  hideHint();
}

function fitBoth(a, b) {
  let lon2 = b.lon;
  while (lon2 - a.lon > 180) lon2 -= 360;
  while (a.lon - lon2 > 180) lon2 += 360;
  const spanLon = Math.max(Math.abs(lon2 - a.lon) * 1.8, 16);
  const spanLat = Math.max(Math.abs(b.lat - a.lat) * 1.8, 10);
  // visible spans are (W/s)*360 and (H/(s/2))*180, with s = baseW*zoom
  const zLon = (360 * W) / (spanLon * baseW());
  const zLat = (360 * H) / (spanLat * baseW());
  view.zoom = Math.max(1, Math.min(18, Math.min(zLon, zLat)));
  view.clon = ((a.lon + lon2) / 2 + 540) % 360 - 180;
  view.clat = (a.lat + b.lat) / 2;
  clampView(); draw();
}

function finish() {
  G.phase = "final";
  $("endTotal").textContent = G.total.toLocaleString();
  const avg = G.log.reduce(function (s, r) { return s + r.km; }, 0) / G.log.length;
  const pct = G.total / (ROUNDS * MAX_POINTS);
  const hit = T.end.messages.filter(function (m) { return pct > m.above; })[0] ||
    T.end.messages[T.end.messages.length - 1];
  $("endMsg").textContent = hit.text + " " + fmt(T.end.averageMiss, { km: fmtKm(avg) });
  $("endRows").innerHTML = G.log.map(function (r, i) {
    return "<tr><td>" + (i + 1) + "</td><td>" + esc(r.city.name) +
      ' <span style="color:var(--dim)">' + esc(r.city.country) + "</span></td>" +
      '<td class="n">' + fmtKm(r.km) + '</td><td class="n">' + r.pts.toLocaleString() + "</td></tr>";
  }).join("");
  let best = 0;
  try {
    best = +(localStorage.getItem("cityPinBest" + G.tier) || 0);
    if (G.total > best) { localStorage.setItem("cityPinBest" + G.tier, G.total); }
  } catch (e) { }
  $("bestNote").textContent = G.total > best
    ? T.end.newBest + (best ? fmt(T.end.previousBest, { n: best.toLocaleString() }) : "")
    : (best ? fmt(T.end.best, { n: best.toLocaleString() }) : "");
  $("endScreen").classList.remove("hidden");
}

/* ---------- hint ---------- */
let hintTimer = null;
function showHint(t) {
  const h = $("hint");
  h.textContent = t; h.style.opacity = 1;
  clearTimeout(hintTimer);
  hintTimer = setTimeout(hideHint, 2600);
}
function hideHint() { $("hint").style.opacity = 0; }

/* ---------- input ---------- */
const pointers = new Map();
let dragged = 0, downAt = 0, lastDist = 0, lastMid = null;

cv.addEventListener("pointerdown", function (e) {
  e.preventDefault();
  cv.setPointerCapture(e.pointerId);
  const q = evPt(e);
  pointers.set(e.pointerId, { x: q.x, y: q.y });
  if (pointers.size === 1) { dragged = 0; downAt = Date.now(); }
  else { lastDist = 0; lastMid = null; }
});
cv.addEventListener("pointermove", function (e) {
  const p = pointers.get(e.pointerId);
  if (!p) return;
  const q = evPt(e), nx = q.x, ny = q.y;
  if (pointers.size === 1) {
    const dx = nx - p.x, dy = ny - p.y;
    dragged += Math.abs(dx) + Math.abs(dy);
    if (dragged > 4) {
      cv.classList.add("panning");
      view.clon -= (dx / scaleW()) * 360;
      view.clat += (dy / (scaleW() / 2)) * 180;
      clampView(); draw();
    }
  }
  p.x = nx; p.y = ny;
  if (pointers.size === 2) {
    const pts = Array.from(pointers.values());
    const d = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
    const mid = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
    if (lastDist && d > 0) {
      dragged = 999;
      if (lastMid) {
        view.clon -= ((mid.x - lastMid.x) / scaleW()) * 360;
        view.clat += ((mid.y - lastMid.y) / (scaleW() / 2)) * 180;
        clampView();
      }
      zoomAt(mid.x, mid.y, d / lastDist);
    }
    lastDist = d; lastMid = mid;
  }
});
function endPointer(e) {
  const p = pointers.get(e.pointerId);
  pointers.delete(e.pointerId);
  if (pointers.size < 2) { lastDist = 0; lastMid = null; }
  cv.classList.remove("panning");
  if (!p) return;
  if (pointers.size === 0 && dragged <= 4 && Date.now() - downAt < 700) {
    const q = evPt(e);
    place(q.x, q.y);
  }
}
cv.addEventListener("pointerup", endPointer);
cv.addEventListener("pointercancel", function (e) { pointers.delete(e.pointerId); cv.classList.remove("panning"); });

function place(x, y) {
  if (G.phase !== "guess") return;
  const lon = toLon(x), lat = toLat(y);
  if (lon < -180 || lon > 180 || lat < -90 || lat > 90) {
    showHint(T.ui.hintOffMap);
    return;
  }
  G.guess = { lon: lon, lat: lat };
  $("actionBtn").disabled = false;
  setVerdict(T.ui.pinDropped);
  draw();
}

cv.addEventListener("wheel", function (e) {
  e.preventDefault();
  const q = evPt(e);
  zoomAt(q.x, q.y, Math.exp(-e.deltaY * (e.deltaMode === 1 ? 0.05 : 0.0022)));
}, { passive: false });

cv.addEventListener("dblclick", function (e) { const q = evPt(e); zoomAt(q.x, q.y, 2); });

$("zin").onclick = function () { zoomAt(W / 2, H / 2, 1.8); };
$("zout").onclick = function () { zoomAt(W / 2, H / 2, 1 / 1.8); };
$("zres").onclick = function () { view.zoom = 1; view.clon = 0; view.clat = 0; clampView(); draw(); };

$("fsBtn").onclick = function () {
  box.classList.toggle("full");
  document.body.style.overflow = box.classList.contains("full") ? "hidden" : "";
  resize();
};

$("actionBtn").onclick = function () {
  if (G.phase === "guess") { if (G.guess) submitGuess(); }
  else if (G.phase === "result") {
    G.idx++;
    if (G.idx >= ROUNDS) finish(); else nextRound();
  }
};

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && box.classList.contains("full")) { $("fsBtn").onclick(); return; }
  const active = box.classList.contains("full") || box.contains(document.activeElement) ||
    (box.matches && box.matches(":hover"));
  if (!active) return;
  if (e.key === "Enter" || e.key === " ") {
    if (G.phase === "start") { e.preventDefault(); startGame(); }
    else if (G.phase === "final") { e.preventDefault(); startGame(); }
    else if (!$("actionBtn").disabled) { e.preventDefault(); $("actionBtn").click(); }
  }
  if (e.key === "+" || e.key === "=") zoomAt(W / 2, H / 2, 1.6);
  if (e.key === "-") zoomAt(W / 2, H / 2, 1 / 1.6);
});

// fill every [data-txt] label in the markup from text.js
function applyText() {
  const vars = textVars();
  Array.from(box.querySelectorAll("[data-txt]")).forEach(function (el) {
    const val = fmt(text(el.dataset.txt), vars);
    if (el.hasAttribute("data-attr")) el.setAttribute(el.dataset.attr, val);
    else if (el.hasAttribute("data-html")) el.innerHTML = val;
    else el.textContent = val;
  });
  $("city").textContent = T.ui.cityPlaceholder;
  $("actionBtn").textContent = T.ui.guess;   // the footer shows behind the start card
  setVerdict(T.ui.pickPrompt);
  $("roundN").textContent = fmt(T.ui.roundCounter, { n: 1, rounds: ROUNDS });
  $("endHead").innerHTML = "";
  T.end.columns.forEach(function (c, i) {
    const th = document.createElement("th");
    th.textContent = c;
    if (i >= 2) th.className = "n";
    $("endHead").appendChild(th);
  });
}

// one row of choose-one buttons, built from a list in text.js
function buildOpts(host, items, isSel, onPick, noteFor) {
  host.innerHTML = "";
  items.forEach(function (it) {
    const b = document.createElement("button");
    const name = document.createElement("b");
    const note = document.createElement("span");
    name.textContent = it.name;
    note.textContent = noteFor(it);
    b.appendChild(name); b.appendChild(note);
    if (isSel(it)) b.classList.add("sel");
    b.onclick = function () {
      Array.from(host.children).forEach(function (o) { o.classList.remove("sel"); });
      b.classList.add("sel");
      onPick(it);
    };
    host.appendChild(b);
  });
}

function buildStartCard() {
  const n = [0, 0, 0];
  CITIES.forEach(function (c) { n[c.tier]++; });
  const upTo = function (tier) {
    let s = 0;
    for (let i = 0; i <= tier; i++) s += n[i] || 0;
    return s;
  };
  buildOpts($("diffOpts"), T.start.pools,
    function (p) { return p.tier === G.tier; },
    function (p) { G.tier = p.tier; },
    function (p) { return fmt(p.note, { n: upTo(p.tier).toLocaleString() }); });
  buildOpts($("bordOpts"), T.start.mapModes,
    function (m) { return m.borders === borders; },
    function (m) {
      borders = m.borders;
      try { localStorage.setItem("cityPinBorders", borders ? "1" : "0"); } catch (e) { }
      draw();   // the map sits behind the overlay, so this previews the choice
    },
    function (m) { return m.note; });
}

applyText();
buildStartCard();
$("playBtn").onclick = startGame;
$("againBtn").onclick = startGame;
$("changeBtn").onclick = function () {
  $("endScreen").classList.add("hidden");
  $("startScreen").classList.remove("hidden");
  G.phase = "start";
};

window.addEventListener("resize", resize);
if (window.ResizeObserver) new ResizeObserver(resize).observe(cv);
resize();
draw();
