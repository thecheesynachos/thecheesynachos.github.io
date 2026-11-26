// The Map Game — game logic. Expects text.js, data-map.js and data-cities.js to have
// run first, and the #citypin markup from index.html to be in the document.
//
// No wording lives in this file: everything the player reads comes from text.js, and
// every label in the markup is filled in by applyText() below.
"use strict";
const MAP_DATA = window.CITYPIN_MAP;
const BORDER_DATA = window.CITYPIN_BORDERS || "";
const MAP_SCALE = 100;       // data-map.js stores points in 1/100 degree (keep in step with _make_map.py)
const CITY_DATA = window.CITYPIN_CITIES;
const T = window.CITYPIN_TEXT;

/* ---------- settings ---------- */
const ROUNDS = 10;           // Classic: cities per game
const MAX_POINTS = 5000;     // the most a single city can be worth
const TIMER_SECONDS = 15;    // Timed: seconds per city

// Levels: play them in order; each gives you `tries` cities to score `target` points
// in total, drawn from the city tiers listed (0 Famous, 1 Tricky, 2 ???, as in
// data-cities.js; easier tiers stay in the mix so the odd giveaway still turns up).
// You always play every city in a level; fall short of the target by the end and the
// run is over. The run's score is everything you scored. Level n has n+2 cities, and
// the average needed per city climbs from 2,000 to 4,000 (targets rounded to 500).
// Rough guide to what an average asks for: 2,000 ≈ within 1,250 km, 3,000 ≈ 700 km,
// 3,500 ≈ 500 km, 4,000 ≈ 300 km. Add, remove or reorder levels freely.
const LEVELS = [
  { tiers: [0], tries: 3, target: 6000 },           // avg 2,000
  { tiers: [0], tries: 4, target: 9000 },           // avg 2,250
  { tiers: [0], tries: 5, target: 12000 },          // avg 2,400
  { tiers: [0, 1], tries: 6, target: 16000 },       // avg 2,670
  { tiers: [0, 1], tries: 7, target: 20000 },       // avg 2,860
  { tiers: [0, 1], tries: 8, target: 25000 },       // avg 3,125
  { tiers: [0, 1, 2], tries: 9, target: 30000 },    // avg 3,330
  { tiers: [0, 1, 2], tries: 10, target: 35500 },   // avg 3,550
  { tiers: [0, 1, 2], tries: 11, target: 41500 },   // avg 3,770
  { tiers: [0, 1, 2], tries: 12, target: 48000 }    // avg 4,000
];

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

// lines: {lon:Float64Array, lat:Float64Array, w, e, s, n} — land rings, or border polylines
function decodeLines(data) {
  const v = decodeInts(data), lines = [];
  let i = 0;
  while (i < v.length) {
    const n = v[i++];
    const lon = new Float64Array(n), lat = new Float64Array(n);
    let x = 0, y = 0, prev = null, w = 1e9, e = -1e9, s = 1e9, nn = -1e9;
    for (let k = 0; k < n; k++) {
      x += v[i++]; y += v[i++];
      let lo = x / MAP_SCALE, la = y / MAP_SCALE;
      if (prev !== null) {                     // unwrap across the antimeridian
        while (lo - prev > 180) lo -= 360;
        while (prev - lo > 180) lo += 360;
      }
      prev = lo;
      lon[k] = lo; lat[k] = la;
      if (lo < w) w = lo; if (lo > e) e = lo;
      if (la < s) s = la; if (la > nn) nn = la;
    }
    lines.push({ lon, lat, w, e, s, n: nn });
  }
  return lines;
}
const RINGS = decodeLines(MAP_DATA);
const BORDERS = decodeLines(BORDER_DATA);

const CITIES = CITY_DATA.split("\n")
  .map(function (r) { return r.trim(); })
  .filter(function (r) { return r && r.charAt(0) !== "#"; })
  .map(function (r) {
    const f = r.split("|");
    return { name: f[0], country: f[1], lat: +f[2], lon: +f[3], tier: +f[4] };
  });
const FAMOUS = CITIES.filter(function (c) { return c.tier === 0; });

/* ---------- helpers ---------- */
const $ = function (id) { return document.getElementById(id); };
const show = function (el, on) { (typeof el === "string" ? $(el) : el).classList.toggle("hidden", !on); };

// "{n} km" + {n: 12} -> "12 km". Unknown placeholders are left alone.
function fmt(str, vars) {
  return String(str).replace(/\{(\w+)\}/g, function (m, k) {
    return vars && k in vars ? vars[k] : m;
  });
}
function text(path) {
  return path.split(".").reduce(function (o, k) { return o[k]; }, T);
}
const num = function (n) { return Math.round(n).toLocaleString(); };
// values available to every string in text.js
function textVars() {
  return {
    rounds: ROUNDS,
    perRound: num(MAX_POINTS),
    total: num(ROUNDS * MAX_POINTS),
    seconds: TIMER_SECONDS,
    levels: LEVELS.length
  };
}
function tx(path, vars) { return fmt(text(path), Object.assign(textVars(), vars || {})); }
function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); }

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
  return fmt(T.ui.km, { n: km < 10 ? km.toFixed(1) : num(km) });
}
function rating(km) {
  const r = T.ratings.filter(function (x) { return km < x.within; })[0] ||
    T.ratings[T.ratings.length - 1];
  return { word: r.word, tone: r.tone };
}
function store(k, v) {
  try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { }
  return null;
}
const clamp01 = function (x) { return x < 0 ? 0 : x > 1 ? 1 : x; };
const easeOut = function (p) { return 1 - Math.pow(1 - p, 3); };
const easeInOut = function (p) { return p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; };
const easeBack = function (p) { const c = 1.9; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
function easeBounce(p) {
  const n = 7.5625, d = 2.75;
  if (p < 1 / d) return n * p * p;
  if (p < 2 / d) return n * (p -= 1.5 / d) * p + .75;
  if (p < 2.5 / d) return n * (p -= 2.25 / d) * p + .9375;
  return n * (p -= 2.625 / d) * p + .984375;
}

// count a number up in an element, e.g. a score
const counters = new WeakMap();
function countUp(el, from, to, ms, prefix) {
  const t0 = performance.now(), token = {};
  counters.set(el, token);
  (function step() {
    if (counters.get(el) !== token) return;
    const p = clamp01((performance.now() - t0) / ms);
    el.textContent = (prefix || "") + num(from + (to - from) * easeOut(p));
    if (p < 1) requestAnimationFrame(step);
  })();
}
function setNum(el, n, prefix) { counters.delete(el); el.textContent = (prefix || "") + num(n); }

function confetti(host) {
  host.innerHTML = "";
  const cols = ["#f5b83d", "#3ddc97", "#ff5d6c", "#eef2f8", "#6c9cff"];
  for (let i = 0; i < 46; i++) {
    const c = document.createElement("i");
    c.style.left = (Math.random() * 100) + "%";
    c.style.background = cols[i % cols.length];
    c.style.animationDelay = (Math.random() * .45) + "s";
    c.style.animationDuration = (1.2 + Math.random() * .9) + "s";
    c.style.setProperty("--dx", (Math.random() * 120 - 60) + "px");
    c.style.setProperty("--r", (Math.random() * 720 - 360) + "deg");
    if (Math.random() < .5) c.style.height = "4px";
    host.appendChild(c);
  }
  setTimeout(function () { host.innerHTML = ""; }, 2600);
}

/* ---------- player settings (remembered in the browser) ---------- */
const S = {
  mode: store("cityPinMode") === "levels" ? "levels" : "classic",
  tier: Math.max(0, Math.min(2, +(store("cityPinTier") || 0))),
  timed: store("cityPinTimed") === "1",
  borders: store("cityPinBorders") !== "0"
};

/* ---------- game state ---------- */
// phase: start | level (level intro card) | guess | result | final
const G = {
  phase: "start",
  list: [], idx: 0, guess: null, city: null,
  log: [],          // this game's (Classic) or this level's (Levels) guesses
  total: 0,         // the score in the top bar: game total, or the whole Levels run
  mode: "classic", level: 0, lvlPts: 0, status: "", runLog: [], seen: null, timedRun: false
};
const inRound = function () { return G.phase === "guess" || G.phase === "result"; };

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
  FX.tween = null;
  const lon = toLon(x), lat = toLat(y);
  view.zoom = Math.max(1, Math.min(60, view.zoom * factor));
  clampView();
  view.clon += lon - toLon(x);
  view.clat += lat - toLat(y);
  clampView(); kick();
}

/* ---------- animation ---------- */
// One requestAnimationFrame loop that runs only while something is moving: a camera
// flight, a pin dropping, the answer being revealed, or the title-screen pings.
const DROP_MS = 420, REVEAL_MS = 1900;
const FX = { tween: null, drop: -1e9, reveal: -1e9, pings: [], lastPing: 0 };
let raf = 0;
function kick() { if (!raf) raf = requestAnimationFrame(frame); }
function frame() {
  raf = 0;
  const now = performance.now();   // not the rAF timestamp: it can lag behind times stored elsewhere
  if (FX.tween) stepTween(now);
  draw(now);
  const titleOn = G.phase === "start" && !$("startScreen").classList.contains("hidden");
  if (FX.tween || now - FX.drop < DROP_MS || (G.phase === "result" && now - FX.reveal < REVEAL_MS) || titleOn)
    kick();
}

// the view a given (zoom, centre) settles at once clamped to the map
function settled(t) {
  const keep = { zoom: view.zoom, clon: view.clon, clat: view.clat };
  Object.assign(view, t); clampView();
  const out = { zoom: view.zoom, clon: view.clon, clat: view.clat };
  Object.assign(view, keep);
  return out;
}
function flyTo(target, ms) {
  const to = settled(target);
  FX.tween = { from: { zoom: view.zoom, clon: view.clon, clat: view.clat }, to: to, t0: performance.now(), ms: ms || 700 };
  kick();
}
function stepTween(now) {
  const tw = FX.tween, p = clamp01((now - tw.t0) / tw.ms), e = easeInOut(p);
  view.zoom = Math.exp(Math.log(tw.from.zoom) + (Math.log(tw.to.zoom) - Math.log(tw.from.zoom)) * e);
  view.clon = tw.from.clon + (tw.to.clon - tw.from.clon) * e;
  view.clat = tw.from.clat + (tw.to.clat - tw.from.clat) * e;
  clampView();
  if (p >= 1) FX.tween = null;
}
const HOME = { zoom: 1, clon: 0, clat: 0 };

// a view showing both points, kept clear of the result card along the bottom
function fitBoth(a, b, padB) {
  let lon2 = b.lon;
  while (lon2 - a.lon > 180) lon2 -= 360;
  while (a.lon - lon2 > 180) lon2 += 360;
  const Hv = Math.max(120, H - padB);
  const spanLon = Math.max(Math.abs(lon2 - a.lon) * 1.7, 16);
  const spanLat = Math.max(Math.abs(b.lat - a.lat) * 1.7, 10);
  // visible spans are (W/s)*360 and (H/(s/2))*180, with s = baseW*zoom
  const zoom = Math.max(1, Math.min(18, Math.min((360 * W) / (spanLon * baseW()), (360 * Hv) / (spanLat * baseW()))));
  const k = baseW() * zoom / 360;                // pixels per degree at that zoom
  return {
    zoom: zoom,
    clon: ((a.lon + lon2) / 2 + 540) % 360 - 180,
    clat: (a.lat + b.lat) / 2 - padB / (2 * k)   // centre the pair in the space above the card
  };
}
function fitOne(b, padB) {
  const zoom = 4, k = baseW() * zoom / 360;
  return { zoom: zoom, clon: b.lon, clat: b.lat - padB / (2 * k) };
}

/* ---------- drawing ---------- */
let cssCache = {};
function getCSS(v) {
  if (!cssCache[v]) cssCache[v] = getComputedStyle(box).getPropertyValue(v).trim();
  return cssCache[v];
}

// add every line in view to the current path. Points closer than ~0.7px to the last
// one drawn are skipped, so the detailed outlines stay cheap when zoomed out.
function tracePaths(lines, closed) {
  const s = scaleW();
  const lonPad = (W / s) * 360 / 2 + 2, latPad = (H / (s / 2)) * 180 / 2 + 2;
  const wMin = view.clon - lonPad, wMax = view.clon + lonPad;
  const sMin = view.clat - latPad, sMax = view.clat + latPad;
  const kx = s / 360, ky = s / 360, cx = W / 2 - view.clon * kx, cy = H / 2 + view.clat * ky;
  for (let i = 0; i < lines.length; i++) {
    const r = lines[i];
    if (r.s > sMax || r.n < sMin) continue;
    for (let k = -1; k <= 1; k++) {
      const off = k * 360;
      if (k !== 0 && (r.e + off < -180.5 || r.w + off > 180.5)) continue;  // only wrap copies that belong
      if (r.e + off < wMin || r.w + off > wMax) continue;
      const lon = r.lon, lat = r.lat, n = lon.length;
      let lx = cx + (lon[0] + off) * kx, ly = cy - lat[0] * ky;
      ctx.moveTo(lx, ly);
      for (let j = 1; j < n; j++) {
        const x = cx + (lon[j] + off) * kx, y = cy - lat[j] * ky;
        if (j < n - 1 && Math.abs(x - lx) + Math.abs(y - ly) < 0.7) continue;
        ctx.lineTo(x, y); lx = x; ly = y;
      }
      if (closed) ctx.closePath();
    }
  }
}

function drawLand() {
  ctx.beginPath();
  tracePaths(RINGS, true);
  ctx.fillStyle = getCSS("--land"); ctx.fill("evenodd");
  ctx.lineJoin = "round";
  ctx.strokeStyle = getCSS("--coast");
  ctx.lineWidth = Math.min(1.3, 0.7 + view.zoom * 0.05);
  ctx.stroke();
  if (S.borders && BORDERS.length) {
    ctx.beginPath();
    tracePaths(BORDERS, false);
    ctx.strokeStyle = getCSS("--border");
    ctx.lineWidth = Math.min(1.3, 0.6 + view.zoom * 0.05);
    ctx.stroke();
  }
}

function drawGrid() {
  const step = view.zoom > 16 ? 5 : view.zoom > 6 ? 10 : 30;
  ctx.strokeStyle = "rgba(255,255,255,.05)"; ctx.lineWidth = 1;
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
    ctx.strokeStyle = "rgba(255,255,255,.11)";
    ctx.beginPath(); ctx.moveTo(0, y0); ctx.lineTo(W, y0); ctx.stroke();
  }
}

// title screen: faint city lights, with a ping every so often at a random famous city
function drawTitleFx(now) {
  ctx.fillStyle = "rgba(245,184,61,.32)";
  for (let i = 0; i < FAMOUS.length; i++) {
    const c = FAMOUS[i];
    ctx.fillRect(px(c.lon) - 1, py(c.lat) - 1, 2, 2);
  }
  if (now - FX.lastPing > 170 && FAMOUS.length) {
    FX.lastPing = now;
    FX.pings.push({ c: FAMOUS[Math.floor(Math.random() * FAMOUS.length)], t0: now });
  }
  FX.pings = FX.pings.filter(function (p) { return now - p.t0 < 1700; });
  FX.pings.forEach(function (p) {
    const k = clamp01((now - p.t0) / 1700), x = px(p.c.lon), y = py(p.c.lat);
    ctx.globalAlpha = 1 - k;
    ctx.strokeStyle = "#f5b83d"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(x, y, 3 + easeOut(k) * 22, 0, 7); ctx.stroke();
    ctx.fillStyle = "#ffe2a3";
    ctx.beginPath(); ctx.arc(x, y, 2.2, 0, 7); ctx.fill();
  });
  ctx.globalAlpha = 1;
}

const PIN_RED = "#ff5d6c", PIN_GREEN = "#3ddc97";
const offscreen = function (x, y) { return x < -80 || x > W + 80 || y < -80 || y > H + 80; };

// your guess: a teardrop pin whose tip sits on the spot. `lift` raises it (drop animation)
function guessPin(lon, lat, lift) {
  const x = px(lon), y = py(lat);
  if (offscreen(x, y)) return;
  const sq = 1 - Math.min(1, lift / 40);
  ctx.fillStyle = "rgba(0,0,0,.45)";
  ctx.beginPath(); ctx.ellipse(x, y, 2 + 4 * sq, 1 + 1.6 * sq, 0, 0, 7); ctx.fill();
  const t = y - lift;
  ctx.beginPath();
  ctx.moveTo(x, t);
  ctx.bezierCurveTo(x - 2.5, t - 7, x - 9, t - 12, x - 9, t - 20);
  ctx.arc(x, t - 20, 9, Math.PI, 0);
  ctx.bezierCurveTo(x + 9, t - 12, x + 2.5, t - 7, x, t);
  ctx.closePath();
  ctx.fillStyle = PIN_RED; ctx.fill();
  ctx.lineWidth = 2; ctx.strokeStyle = "#14070a"; ctx.stroke();
  ctx.fillStyle = "#fff";
  ctx.beginPath(); ctx.arc(x, t - 20, 3.4, 0, 7); ctx.fill();
}

// the answer: a green dot that pops in, with ripples
function answerPin(lon, lat, age) {
  const x = px(lon), y = py(lat);
  if (offscreen(x, y) || age < 0) return;
  for (let r = 0; r < 2; r++) {
    const k = (age - r * 260) / 1000;
    if (k <= 0 || k >= 1) continue;
    ctx.globalAlpha = (1 - k) * .8;
    ctx.strokeStyle = PIN_GREEN; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(x, y, 8 + easeOut(k) * 34, 0, 7); ctx.stroke();
  }
  ctx.globalAlpha = 1;
  const sc = easeBack(clamp01(age / 320));
  ctx.beginPath(); ctx.arc(x, y, 7.5 * sc, 0, 7);
  ctx.fillStyle = PIN_GREEN; ctx.fill();
  ctx.lineWidth = 2.5; ctx.strokeStyle = "#04120b"; ctx.stroke();
  ctx.fillStyle = "#fff";
  ctx.beginPath(); ctx.arc(x, y, 2.6 * sc, 0, 7); ctx.fill();
}

// a pill label beside a point; `dy` lifts it (to sit by the pin head, not the tip)
function label(lon, lat, str, color, alpha, dy) {
  const x = px(lon), y = py(lat) - (dy || 0);
  if (offscreen(x, y) || alpha <= 0) return;
  ctx.globalAlpha = alpha;
  ctx.font = "700 13px -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif";
  const w = ctx.measureText(str).width;
  let lx = x + 16, ly = y - 10;
  if (lx + w + 22 > W) lx = x - w - 30;
  if (lx < 4) lx = 4;
  if (ly < 4) ly = y + 8;
  ctx.fillStyle = "rgba(0,0,0,.9)";
  roundRect(lx - 7, ly - 3, w + 14, 24, 6); ctx.fill();
  ctx.fillStyle = "#141a26";
  roundRect(lx - 7, ly - 5, w + 14, 24, 6); ctx.fill();
  ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.fillStyle = color; ctx.fillText(str, lx, ly + 11);
  ctx.globalAlpha = 1;
}
function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

// dashed line from the guess towards the answer, `p` of the way (0..1)
function drawLink(a, b, p) {
  if (p <= 0) return;
  let lon2 = b.lon;
  while (lon2 - a.lon > 180) lon2 -= 360;
  while (a.lon - lon2 > 180) lon2 += 360;
  const ex = a.lon + (lon2 - a.lon) * p, ey = a.lat + (b.lat - a.lat) * p;
  ctx.save();
  ctx.lineCap = "round";
  for (const off of [0, -360, 360]) {
    ctx.beginPath();
    ctx.moveTo(px(a.lon + off), py(a.lat));
    ctx.lineTo(px(ex + off), py(ey));
    ctx.setLineDash([]); ctx.lineWidth = 5; ctx.strokeStyle = "rgba(0,0,0,.55)"; ctx.stroke();
    ctx.setLineDash([2, 8]); ctx.lineWidth = 3; ctx.strokeStyle = "#f5b83d"; ctx.stroke();
  }
  ctx.restore();
}

function draw(now) {
  if (!W || !H) return;
  now = now || performance.now();
  ctx.fillStyle = getCSS("--void");
  ctx.fillRect(0, 0, W, H);
  const x0 = px(-180), y0 = py(90), x1 = px(180), y1 = py(-90);
  ctx.save();
  ctx.beginPath(); ctx.rect(x0, y0, x1 - x0, y1 - y0); ctx.clip();
  ctx.fillStyle = getCSS("--ocean");
  ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  drawGrid();
  drawLand();
  if (G.phase === "start") drawTitleFx(now);
  if (G.phase === "result") {
    const age = now - FX.reveal;
    if (G.guess) {
      drawLink(G.guess, G.city, easeInOut(clamp01((age - 250) / 600)));
      guessPin(G.guess.lon, G.guess.lat, 0);
      answerPin(G.city.lon, G.city.lat, age - 850);
      label(G.guess.lon, G.guess.lat, T.ui.yourPin, PIN_RED, clamp01((age - 850) / 300), 20);
      label(G.city.lon, G.city.lat, G.city.name, PIN_GREEN, clamp01((age - 950) / 300), 0);
    } else {
      answerPin(G.city.lon, G.city.lat, age - 300);
      label(G.city.lon, G.city.lat, G.city.name, PIN_GREEN, clamp01((age - 400) / 300), 0);
    }
  } else if (G.guess && G.phase === "guess") {
    const p = clamp01((now - FX.drop) / DROP_MS);
    guessPin(G.guess.lon, G.guess.lat, (1 - easeBounce(p)) * 34);
  }
  ctx.restore();
  ctx.strokeStyle = "rgba(255,255,255,.14)";
  ctx.lineWidth = 1;
  ctx.strokeRect(x0 + .5, y0 + .5, x1 - x0 - 1, y1 - y0 - 1);
}

/* ---------- picking cities ---------- */
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; }
  return a;
}
// n cities passing `ok`, spread out over the world: each pick is drawn at random, but
// weighted against cities near the ones already picked this round (weight
// 1 - exp(-(d / SPREAD_KM)^2) for the nearest pick d km away: ~0.1 at 500 km, ~0.4 at
// 1,000 km, ~0.8 at 2,000 km) and against repeating a country. Cities in `seen` are
// skipped, so a Levels run doesn't show the same city twice.
const SPREAD_KM = 1500, SAME_COUNTRY = 0.15;
function pickCities(ok, n, seen) {
  let pool = CITIES.filter(function (c) { return ok(c) && !(seen && seen.has(c)); });
  if (pool.length < n) pool = CITIES.filter(ok);
  const near = pool.map(function () { return Infinity; });   // km to the nearest pick so far
  const used = new Set(), countries = new Set(), out = [];
  while (out.length < n && out.length < pool.length) {
    const w = pool.map(function (c, i) {
      if (used.has(i)) return 0;
      const d = near[i] === Infinity ? 1 : 1 - Math.exp(-Math.pow(near[i] / SPREAD_KM, 2));
      return Math.max(d, 1e-6) * (countries.has(c.country) ? SAME_COUNTRY : 1);
    });
    let r = Math.random() * w.reduce(function (s, x) { return s + x; }, 0), i = 0;
    while (i < w.length - 1 && (r -= w[i]) > 0) i++;
    while (used.has(i)) i = (i + 1) % pool.length;     // float round-off safety
    const c = pool[i];
    used.add(i); countries.add(c.country); out.push(c);
    for (let j = 0; j < pool.length; j++) {
      const d = haversine(c, pool[j]);
      if (d < near[j]) near[j] = d;
    }
  }
  if (seen) out.forEach(function (c) { seen.add(c); });
  return shuffle(out);
}

/* ---------- the clock ---------- */
let timerId = 0, deadline = 0, pausedLeft = 0;
function stopTimer() { clearInterval(timerId); timerId = 0; }
function tickTimer() {
  const left = Math.max(0, (deadline - performance.now()) / 1000);
  $("timerN").textContent = Math.ceil(left);
  $("timerBar").style.width = (100 * left / TIMER_SECONDS) + "%";
  $("timer").classList.toggle("mid", left <= TIMER_SECONDS / 2);
  $("timer").classList.toggle("low", left <= 5 && left > 0);
  if (left <= 0) { stopTimer(); submitGuess(); }
}
function startTimer() {
  stopTimer(); pausedLeft = 0;
  show("timer", G.timedRun);
  $("timer").classList.remove("low", "mid", "paused");
  if (!G.timedRun) return;
  deadline = performance.now() + TIMER_SECONDS * 1000;
  tickTimer(); timerId = setInterval(tickTimer, 100);
}
function pauseTimer() {
  if (!timerId) return;
  pausedLeft = deadline - performance.now();
  stopTimer();
  $("timer").classList.add("paused");
}
function resumeTimer() {
  if (pausedLeft <= 0 || G.phase !== "guess") return;
  deadline = performance.now() + pausedLeft; pausedLeft = 0;
  $("timer").classList.remove("paused");
  timerId = setInterval(tickTimer, 100);
}

/* ---------- top bar ---------- */
function renderPips() {
  const host = $("pips"), n = G.list.length;
  host.innerHTML = "";
  host.classList.toggle("many", n > 8);
  for (let i = 0; i < n; i++) {
    const p = document.createElement("span"), r = G.log[i];
    p.className = "pip";
    p.textContent = i + 1;
    if (r) {
      p.classList.add("done", "t-" + r.tone);
      p.title = fmt(T.ui.pipDone, { n: i + 1, points: num(r.pts) });
    } else {
      p.title = fmt(T.ui.pip, { n: i + 1 });
      if (i === G.idx && G.phase === "guess") p.classList.add("now");
    }
    host.appendChild(p);
  }
}
function renderLevelBox(animateFrom) {
  const L = LEVELS[G.level];
  $("lvlN").textContent = G.level + 1;
  $("lvlTarget").textContent = "/ " + num(L.target);
  if (animateFrom !== undefined) countUp($("lvlPts"), animateFrom, G.lvlPts, 800);
  else setNum($("lvlPts"), G.lvlPts);
  $("lvlFill").style.width = (100 * clamp01(G.lvlPts / L.target)) + "%";
  $("lvlFill").parentNode.classList.toggle("full", G.lvlPts >= L.target);
}
function resetBar() {
  $("city").textContent = T.ui.cityPlaceholder;
  setNum($("scoreN"), 0);
  G.list = []; G.log = [];
  renderPips();
  show("lvlBox", false);
}

/* ---------- game flow ---------- */
function hideScreens() {
  ["startScreen", "endScreen", "leaveScreen", "levelScreen"].forEach(function (id) { show(id, false); });
}

function startGame() {
  hideScreens();
  G.total = 0; G.log = []; G.status = ""; G.timedRun = S.timed;
  box.classList.toggle("timed", S.timed);
  setNum($("scoreN"), 0);
  show("lvlBox", S.mode === "levels");
  if (S.mode === "classic") {
    G.mode = "classic";
    G.list = pickCities(function (c) { return c.tier <= S.tier; }, ROUNDS);
    G.idx = 0;
    nextRound();
  } else {
    G.mode = "levels";
    G.level = 0; G.runLog = []; G.seen = new Set();
    showLevelCard(null);
  }
}

// the card before each level; `cleared` describes the level just beaten, if any
function showLevelCard(cleared) {
  G.phase = "level";
  stopTimer(); show("timer", false); show("dock", false); show("result", false);
  const L = LEVELS[G.level], n = G.level + 1;
  G.list = []; G.log = []; G.lvlPts = 0; G.status = "";
  renderPips(); renderLevelBox();
  $("city").textContent = T.ui.cityPlaceholder;
  show("lvlCleared", !!cleared);
  if (cleared) {
    $("lvlCleared").innerHTML = esc(tx("levels.cleared", { level: cleared.level })) +
      "<small>" + esc(tx("levels.clearedPts", { pts: num(cleared.pts), target: num(cleared.target) })) + "</small>";
    confetti($("confetti"));
  }
  $("lvlKicker").textContent = n === LEVELS.length ? tx("levels.lastLevel") : tx("levels.kicker", { level: n });
  $("lvlBig").textContent = tx("levels.big", { level: n });
  const names = L.tiers.map(function (t) { return T.levels.tierNames[t]; }).join(" + ");
  $("lvlPool").textContent = tx("levels.pool", { names: names });
  $("lvlPool").className = "lvl-pool t" + Math.max.apply(null, L.tiers);
  $("lvlGoal").innerHTML = fmt(esc(T.levels.goal), {
    target: "<b>" + num(L.target) + "</b>", tries: "<b>" + L.tries + "</b>"
  });
  $("lvlSteps").innerHTML = LEVELS.map(function (_, i) {
    return '<i class="' + (i < G.level ? "done" : i === G.level ? "now" : "") + '"></i>';
  }).join("");
  $("lvlGo").textContent = T.levels.go;
  show("levelScreen", true);
  flyTo(HOME, 500);
}

function beginLevel() {
  const L = LEVELS[G.level];
  show("levelScreen", false);
  G.list = pickCities(function (c) { return L.tiers.indexOf(c.tier) >= 0; }, L.tries, G.seen);
  G.idx = 0; G.log = []; G.lvlPts = 0; G.status = "going";
  nextRound();
}

function nextRound() {
  G.city = G.list[G.idx];
  G.guess = null;
  G.phase = "guess";
  flyTo(HOME, 550);
  const c = $("city");
  c.innerHTML = esc(G.city.name) + "<small>" + esc(G.city.country) + "</small>";
  c.classList.remove("swap"); void c.offsetWidth; c.classList.add("swap");
  show("result", false); show("dock", true);
  const b = $("guessBtn");
  b.textContent = T.ui.dropPin; b.disabled = true; b.classList.remove("ready");
  renderPips();
  if (G.mode === "levels") renderLevelBox();
  showHint(T.ui.hintClick);
  startTimer();
}

function place(x, y) {
  if (G.phase !== "guess") return;
  const lon = toLon(x), lat = toLat(y);
  if (lon < -180 || lon > 180 || lat < -90 || lat > 90) { showHint(T.ui.hintOffMap); return; }
  G.guess = { lon: lon, lat: lat };
  FX.drop = performance.now();
  const b = $("guessBtn");
  if (b.disabled) { b.disabled = false; b.textContent = T.ui.guess; b.classList.remove("ready"); void b.offsetWidth; b.classList.add("ready"); }
  hideHint();
  kick();
}

// lock in the pin (or, when the clock ran out without one, no pin at all)
function submitGuess() {
  if (G.phase !== "guess") return;
  stopTimer();
  $("timer").classList.remove("low");
  const km = G.guess ? haversine(G.guess, G.city) : null;
  const pts = G.guess ? scoreFor(km) : 0;
  const r = G.guess ? rating(km) : { word: T.timer.timeUp, tone: "bad" };
  G.log.push({ city: G.city, km: km, pts: pts, tone: r.tone });
  const before = G.total, lvlBefore = G.lvlPts;
  G.total += pts;
  G.phase = "result";
  FX.reveal = performance.now();
  hideHint();

  // the result card
  show("dock", false);
  $("resRate").textContent = r.word;
  $("resRate").className = "res-rate c-" + r.tone;
  $("resDist").textContent = G.guess ? fmt(T.result.distance, { km: fmtKm(km), city: G.city.name }) : T.timer.noPin;
  setNum($("resPts"), 0, "+");
  const fill = $("resFill"), note = $("resNote"), btn = $("nextBtn");
  note.className = "res-note"; note.textContent = "";
  fill.style.transition = "none";

  if (G.mode === "levels") {
    const L = LEVELS[G.level], used = G.log.length;
    G.lvlPts += pts;
    const nv = { have: num(G.lvlPts), target: num(L.target) };
    fill.style.width = (100 * clamp01(lvlBefore / L.target)) + "%";
    const left = L.tries - used, hit = G.lvlPts >= L.target;
    if (left > 0) {
      // keep going to the end of the level either way: every point counts towards the run
      G.status = "going";
      if (hit) {
        note.textContent = tx(left === 1 ? "levels.noteSecuredOne" : "levels.noteSecured", Object.assign({ tries: left }, nv));
        note.classList.add("good");
      } else {
        note.textContent = tx(left === 1 ? "levels.noteGoingOne" : "levels.noteGoing",
          Object.assign({ need: num(L.target - G.lvlPts), tries: left }, nv));
      }
      btn.textContent = T.ui.nextCity;
    } else if (hit) {
      G.status = "cleared";
      note.textContent = tx("levels.noteCleared", nv); note.classList.add("good");
      btn.textContent = G.level + 1 >= LEVELS.length ? T.levels.finish : T.levels.nextLevel;
    } else {
      G.status = "failed";
      note.textContent = tx("levels.noteFailed", nv); note.classList.add("bad");
      btn.textContent = T.levels.finish;
    }
    fill.parentNode.classList.toggle("full", hit);
    renderLevelBox(lvlBefore);
  } else {
    fill.style.width = "0";
    fill.parentNode.classList.remove("full");
    btn.textContent = G.idx + 1 >= G.list.length ? T.ui.seeResults : T.ui.nextCity;
  }
  $("resOutOf").textContent = tx("result.outOf");
  show("result", true);
  void fill.offsetWidth;
  fill.style.transition = "";
  const finalW = (100 * (G.mode === "levels" ? clamp01(G.lvlPts / LEVELS[G.level].target) : pts / MAX_POINTS)) + "%";
  setTimeout(function () { fill.style.width = finalW; }, 250);
  countUp($("resPts"), 0, pts, 800, "+");
  countUp($("scoreN"), before, G.total, 900);
  renderPips();

  // the camera: fit both points above the card
  const padB = $("result").offsetHeight + 28;
  flyTo(G.guess ? fitBoth(G.guess, G.city, padB) : fitOne(G.city, padB), 750);
}

function next() {
  if (G.phase !== "result") return;
  if (G.mode === "classic") {
    G.idx++;
    if (G.idx >= G.list.length) finishClassic(); else nextRound();
    return;
  }
  const L = LEVELS[G.level];
  if (G.status === "going") { G.idx++; nextRound(); return; }
  const entry = { level: G.level + 1, pts: G.lvlPts, target: L.target, used: G.log.length, tries: L.tries,
    pass: G.status === "cleared" };
  G.runLog.push(entry);
  if (!entry.pass) { finishLevels(false); return; }
  G.level++;
  if (G.level >= LEVELS.length) finishLevels(true);
  else showLevelCard(entry);
}

/* ---------- end screens ---------- */
function endScreen() {
  G.phase = "final";
  stopTimer(); show("timer", false); show("dock", false); show("result", false);
  show("endScreen", true);
}
function rowHtml(i, n, name, sub, frac, tone, right, cls) {
  return '<div class="row ' + (cls || "") + '" style="animation-delay:' + (0.15 + i * 0.05) + 's">' +
    '<div class="row-n">' + n + '</div>' +
    '<div class="row-mid"><div class="row-top"><div class="row-name">' + name + '</div><div class="row-dist">' + sub + '</div></div>' +
    '<div class="meter' + (tone === "good" ? " full" : "") + '"><i style="width:' + (100 * clamp01(frac)) + '%;' +
    (tone === "bad" ? "background:var(--bad)" : "") + '"></i></div></div>' +
    '<div class="row-pts">' + right + '</div></div>';
}
function timedNote() { return G.timedRun ? " · " + tx("end.timed") : ""; }

function finishClassic() {
  endScreen();
  const max = G.list.length * MAX_POINTS, pct = G.total / max;
  $("endKicker").textContent = T.end.kicker;
  countUp($("endTotal"), 0, G.total, 1100);
  $("endOutOf").textContent = "/ " + num(max);
  const hit = T.end.messages.filter(function (m) { return pct > m.above; })[0] ||
    T.end.messages[T.end.messages.length - 1];
  $("endMsg").textContent = hit.text;
  const guessed = G.log.filter(function (r) { return r.km !== null; });
  const avg = guessed.reduce(function (s, r) { return s + r.km; }, 0) / (guessed.length || 1);
  $("endSub").textContent = (guessed.length ? fmt(T.end.averageMiss, { km: fmtKm(avg) }) : "") + timedNote();
  $("endRows").innerHTML = G.log.map(function (r, i) {
    return rowHtml(i, i + 1, esc(r.city.name) + " <span>" + esc(r.city.country) + "</span>",
      r.km === null ? esc(T.timer.noPin) : fmtKm(r.km), r.pts / MAX_POINTS, r.tone, num(r.pts));
  }).join("");
  const key = "cityPinBest" + S.tier + (G.timedRun ? "t" : "");
  const best = +(store(key) || 0);
  if (G.total > best) store(key, G.total);
  $("bestNote").innerHTML = G.total > best && G.total > 0
    ? '<span class="new">' + esc(T.end.newBest) + "</span>" + (best ? esc(fmt(T.end.previousBest, { n: num(best) })) : "")
    : (best ? esc(fmt(T.end.best, { n: num(best) })) : "");
  if (pct > 0.75) confetti($("confetti2"));
}

function levelsBest(timed) {
  try { const b = JSON.parse(store("cityPinLevels" + (timed ? "t" : "")) || "null"); if (b && b.r) return b; } catch (e) { }
  return null;
}

function finishLevels(won) {
  endScreen();
  const reached = won ? LEVELS.length + 1 : G.level + 1;
  $("endKicker").textContent = won ? T.levelsEnd.kickerWon : tx("levelsEnd.kickerLost", { level: reached });
  countUp($("endTotal"), 0, G.total, 1100);
  $("endOutOf").textContent = T.levelsEnd.outOf;
  const hit = T.levelsEnd.messages.filter(function (m) { return reached >= m.reached; })[0] ||
    T.levelsEnd.messages[T.levelsEnd.messages.length - 1];
  $("endMsg").textContent = hit.text;
  $("endSub").textContent = (won ? tx("levelsEnd.subWon") : tx("levelsEnd.sub", { level: reached })) + timedNote();
  $("endRows").innerHTML = G.runLog.map(function (r, i) {
    const detail = tx("levelsEnd.rowDetail", { pts: num(r.pts), target: num(r.target), tries: r.tries });
    return rowHtml(i, r.level, esc(tx("levelsEnd.row", { level: r.level })), esc(detail),
      r.pts / r.target, r.pass ? "good" : "bad", r.pass ? "✓" : "✗", r.pass ? "pass" : "fail");
  }).join("");
  const prev = levelsBest(G.timedRun);
  const better = !prev || reached > prev.r || (reached === prev.r && G.total > prev.s);
  if (better) store("cityPinLevels" + (G.timedRun ? "t" : ""), JSON.stringify({ r: reached, s: G.total }));
  if (better) $("bestNote").innerHTML = '<span class="new">' + esc(T.levelsEnd.newBest) + "</span>";
  else if (prev) $("bestNote").textContent = prev.r > LEVELS.length
    ? tx("levelsEnd.bestWon", { n: num(prev.s) }) : tx("levelsEnd.best", { level: prev.r, n: num(prev.s) });
  else $("bestNote").textContent = "";
  if (won || reached >= 7) confetti($("confetti2"));
}

/* ---------- hint ---------- */
let hintTimer = null;
function showHint(t) {
  const h = $("hint");
  h.textContent = t; h.classList.add("on");
  clearTimeout(hintTimer);
  hintTimer = setTimeout(hideHint, 2600);
}
function hideHint() { $("hint").classList.remove("on"); }

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
      FX.tween = null;
      cv.classList.add("panning");
      view.clon -= (dx / scaleW()) * 360;
      view.clat += (dy / (scaleW() / 2)) * 180;
      clampView(); kick();
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

cv.addEventListener("wheel", function (e) {
  e.preventDefault();
  const q = evPt(e);
  zoomAt(q.x, q.y, Math.exp(-e.deltaY * (e.deltaMode === 1 ? 0.05 : 0.0022)));
}, { passive: false });

cv.addEventListener("dblclick", function (e) { const q = evPt(e); zoomAt(q.x, q.y, 2); });

$("zin").onclick = function () { zoomAt(W / 2, H / 2, 1.8); };
$("zout").onclick = function () { zoomAt(W / 2, H / 2, 1 / 1.8); };
$("zres").onclick = function () { flyTo(HOME, 450); };

const FS_REQ = document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen;
$("fsBtn").onclick = function () {
  // on its own full-window page the game already fills the window, so this goes
  // properly fullscreen instead (hides the browser bars too)
  if (document.body.classList.contains("game-page") && FS_REQ) {
    const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
    const fn = fsEl ? (document.exitFullscreen || document.webkitExitFullscreen) : FS_REQ;
    try { const p = fn.call(fsEl ? document : document.documentElement); if (p && p.catch) p.catch(function () { }); } catch (e) { }
    return;
  }
  box.classList.toggle("full");
  document.body.style.overflow = box.classList.contains("full") ? "hidden" : "";
  resize();
};

// no fullscreen support (e.g. iPhone Safari) and already full-window: the button has nothing to do
if (document.body.classList.contains("game-page") && !FS_REQ) $("fsBtn").style.display = "none";

$("guessBtn").onclick = function () { if (G.guess) submitGuess(); };
$("nextBtn").onclick = next;
$("lvlGo").onclick = beginLevel;

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && leaveOpen()) { closeLeave(); return; }
  if (e.key === "Escape" && box.classList.contains("full")) { $("fsBtn").onclick(); return; }
  const active = box.classList.contains("full") || document.body.classList.contains("game-page") ||
    box.contains(document.activeElement) || (box.matches && box.matches(":hover"));
  if (!active || leaveOpen()) return;
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    if (e.repeat) return;
    if (G.phase === "start" || G.phase === "final") startGame();
    else if (G.phase === "level") beginLevel();
    else if (G.phase === "guess") { if (G.guess) submitGuess(); }
    else if (G.phase === "result") next();
  }
  if (e.key === "+" || e.key === "=") zoomAt(W / 2, H / 2, 1.6);
  if (e.key === "-") zoomAt(W / 2, H / 2, 1 / 1.6);
});

/* ---------- title screen ---------- */
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
}

// one row of choose-one buttons, built from a list in text.js
function buildOpts(host, items, isSel, onPick, noteFor) {
  host.innerHTML = "";
  items.forEach(function (it) {
    const b = document.createElement("button");
    const name = document.createElement("b");
    const note = document.createElement("span");
    name.textContent = it.name;
    note.textContent = noteFor ? noteFor(it) : fmt(it.note, textVars());
    b.appendChild(name); b.appendChild(note);
    if (isSel(it)) b.classList.add("sel");
    b.onclick = function () {
      Array.from(host.children).forEach(function (o) { o.classList.remove("sel"); });
      b.classList.add("sel");
      onPick(it);
      refreshStart();
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
  buildOpts($("modeOpts"), T.start.modes,
    function (m) { return m.mode === S.mode; },
    function (m) { S.mode = m.mode; store("cityPinMode", m.mode); });
  buildOpts($("diffOpts"), T.start.pools,
    function (p) { return p.tier === S.tier; },
    function (p) { S.tier = p.tier; store("cityPinTier", p.tier); },
    function (p) { return fmt(p.note, { n: num(upTo(p.tier)) }); });
  buildOpts($("bordOpts"), T.start.mapModes,
    function (m) { return m.borders === S.borders; },
    function (m) {
      S.borders = m.borders;
      store("cityPinBorders", S.borders ? "1" : "0");
      kick();   // the map sits behind the title screen, so this previews the choice
    });
  buildOpts($("timeOpts"), T.start.clockModes,
    function (m) { return m.timed === S.timed; },
    function (m) { S.timed = m.timed; store("cityPinTimed", S.timed ? "1" : "0"); });
}

// the parts of the title screen that depend on the chosen settings
function refreshStart() {
  const lv = S.mode === "levels";
  show("poolRow", !lv); show("levelsRow", lv);
  const best = levelsBest(S.timed);
  $("ladder").innerHTML = LEVELS.map(function (L, i) {
    const t = Math.max.apply(null, L.tiers);
    const tip = tx("start.ladderTip", { level: i + 1, target: num(L.target), tries: L.tries });
    return '<div class="rung t' + t + (best && best.r > i + 1 ? " beat" : "") + '" title="' + esc(tip) + '">' +
      '<i style="height:' + (20 + 80 * i / Math.max(1, LEVELS.length - 1)) + '%"></i><b>' + (i + 1) + "</b></div>";
  }).join("");
  let line = "";
  if (lv && best) {
    line = best.r > LEVELS.length ? tx("start.bestLevelsWon", { n: "<b>" + num(best.s) + "</b>" })
      : tx("start.bestLevels", { level: "<b>" + best.r + "</b>", n: "<b>" + num(best.s) + "</b>" });
  } else if (!lv) {
    const b = +(store("cityPinBest" + S.tier + (S.timed ? "t" : "")) || 0);
    if (b) line = tx("start.bestClassic", { n: "<b>" + num(b) + "</b>" });
  }
  $("bestLine").innerHTML = line;
}

applyText();
buildStartCard();
refreshStart();
$("playBtn").onclick = startGame;
$("againBtn").onclick = startGame;
$("changeBtn").onclick = goHome;

// Home: back to the title screen. Mid-game it asks first, since the score is lost.
function goHome() {
  hideScreens();
  stopTimer(); pausedLeft = 0;
  G.phase = "start"; G.guess = null; G.city = null; G.idx = 0; G.total = 0; G.status = "";
  box.classList.remove("timed");
  show("timer", false); show("dock", false); show("result", false);
  resetBar();
  refreshStart();
  show("startScreen", true);
  hideHint();
  flyTo(HOME, 500);
}
function leaveOpen() { return !$("leaveScreen").classList.contains("hidden"); }
function closeLeave() { show("leaveScreen", false); resumeTimer(); }
$("homeBtn").onclick = function () {
  const midRun = inRound() || (G.phase === "level" && G.level > 0);
  if (midRun) { pauseTimer(); show("leaveScreen", true); }
  else goHome();
};
$("leaveGo").onclick = goHome;
$("leaveStay").onclick = closeLeave;
$("leaveScreen").onclick = function (e) { if (e.target === this) closeLeave(); };

// view count from the site's visitor counter (layout: game reads it from the hidden widget)
function showVisits(v) {
  if (!v || !(v.count > 0)) return;
  $("visits").textContent = fmt(T.start.visits, { count: num(v.count) });
  if (v.range) $("visits").title = v.range;
  $("visits").classList.remove("hidden");
}
if (window.SITE_VISITS) showVisits(window.SITE_VISITS);
else document.addEventListener("sitevisits", function (e) { showVisits(e.detail); });

window.addEventListener("resize", resize);
if (window.ResizeObserver) new ResizeObserver(resize).observe(cv);
resize();
kick();
