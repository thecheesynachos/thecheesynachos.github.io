// Pointing games — hand-written pixel art. Every sprite below is a little grid of
// characters (one character = one pixel, "." = transparent) mapped to colours by a
// palette, plus a procedurally drawn dusk scene for each game's title screen (picked by
// `scene` in the game's config.js). Nothing here is an image file; it is all drawn onto
// <canvas> at load time.
"use strict";
window.SP_PIXEL = (function () {

/* ---------- sprites ---------- */
const PAL = {
  K: "#2a1630",  // outline
  R: "#e23d4b",  // red
  r: "#b82835",  // red shade
  H: "#ff9aa0",  // red highlight
  W: "#ffffff",
  G: "#22a565",  // green
  g: "#167a49",  // green shade
  h: "#7fe0ad",  // green highlight
  Y: "#f6c343",  // gold
  y: "#c8902a",  // gold shade
  B: "#3a4a8c",  // blue-grey
  b: "#6c7bc4",
  S: "#c9d2ff",  // glass/lens
  N: "#5a4a3a",  // brown pole
};

const SPRITES = {
  pin: [
    "...KKKKK...",
    "..KRRRRRK..",
    ".KRHHRRRrK.",
    "KRHRWWWRRrK",
    "KRRWWWWWRrK",
    "KRRWWWWWRrK",
    "KRRRWWWRRrK",
    ".KRRRRRRrK.",
    ".KRRRRRrrK.",
    "..KRRRRrK..",
    "..KRRRrrK..",
    "...KRRrK...",
    "...KRrrK...",
    "....KrK....",
    "....KrK....",
    ".....K.....",
  ],
  flag: [
    "KK.........",
    "KNKKKKKKK..",
    "KNGhhGGGGK.",
    "KNGhGGGGGgK",
    "KNGGGGGGGgK",
    "KNGGGGGGgK.",
    "KNgggggggK.",
    "KNKKKKKKK..",
    "KNK........",
    "KNK........",
    "KNK........",
    "KNK........",
    "KNK........",
    "KNK........",
    "KNK........",
    "KKK........",
  ],
  camera: [
    "...KKKK.......",
    "..KBBBBK......",
    "KKKKKKKKKKKKKK",
    "KbbbbbbbbbbbbK",
    "KbBBBKKKKBBRbK",
    "KbBBKSSSSKBBbK",
    "KbBKSSWSSSKBbK",
    "KbBKSWSSSSKBbK",
    "KbBKSSSSSSKBbK",
    "KbBBKSSSSKBBbK",
    "KbBBBKKKKBBBbK",
    "KbbbbbbbbbbbbK",
    "KKKKKKKKKKKKKK",
  ],
  // little house for the Home buttons: white for the dark top bar …
  homeLight: [
    ".....W.....",
    "....WWW....",
    "...WW.WW...",
    "..WW...WW..",
    ".WW.....WW.",
    "WWWWWWWWWWW",
    ".W.......W.",
    ".W..WWW..W.",
    ".W..W.W..W.",
    ".WWWW.WWWW.",
  ],
  // … and dark for the light results card
  homeDark: [
    ".....K.....",
    "....KKK....",
    "...KK.KK...",
    "..KK...KK..",
    ".KK.....KK.",
    "KKKKKKKKKKK",
    ".K.......K.",
    ".K..KKK..K.",
    ".K..K.K..K.",
    ".KKKK.KKKK.",
  ],
  trophy: [
    "KKKKKKKKKKKK",
    "KYYWYYYYYYyK",
    "KYYWYYYYYYyK",
    "KYWYYYYYYyyK",
    ".KYYYYYYYyK.",
    ".KYYYYYYyyK.",
    "..KYYYYyyK..",
    "...KKYyKK...",
    "....KYyK....",
    "....KYyK....",
    "...KKYyKK...",
    "..KYYYYyyK..",
    "..KKKKKKKK..",
  ],
};

function spriteCanvas(name, scale) {
  const rows = SPRITES[name], h = rows.length, w = rows[0].length;
  const c = document.createElement("canvas");
  c.width = w * scale; c.height = h * scale;
  const x = c.getContext("2d");
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const col = PAL[rows[j][i]];
    if (col) { x.fillStyle = col; x.fillRect(i * scale, j * scale, scale, scale); }
  }
  return c;
}
const urlCache = {};
function spriteURL(name, scale) {
  const k = name + "@" + scale;
  return urlCache[k] || (urlCache[k] = spriteCanvas(name, scale).toDataURL());
}
function spriteSize(name) { return [SPRITES[name][0].length, SPRITES[name].length]; }

/* ---------- title-screen scene ---------- */
// The canvas is drawn at a low resolution and scaled up with
// image-rendering: pixelated, so every "pixel" is a chunky block.
// (between 110 and 220 pixels across, about one art pixel per 5 screen pixels)
const SKY = ["#171a3f", "#1f2457", "#2d2c6e", "#4a3584", "#733f93", "#a24c90", "#d35f83", "#f27f6f", "#ffa86a"];
const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];

function mulberry(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function Scene(canvas, theme) {
  this.theme = THEMES[theme] || THEMES.singapore;
  this.c = canvas; this.x = canvas.getContext("2d");
  this.timer = null; this.t0 = performance.now();
  this.pin = spriteCanvas("pin", 1);
  this.resize();
}
Scene.prototype.resize = function () {
  const r = this.c.getBoundingClientRect();
  const W = Math.max(110, Math.min(220, Math.round((r.width || 1000) / 5)));
  const H = Math.max(90, Math.round(W * (r.height || 300) / (r.width || 400)));
  if (W === this.W && H === this.H) return;
  this.W = this.c.width = W; this.H = this.c.height = H;   // (resizing clears the canvas…)
  this.build();
  this.draw(performance.now());                               // (…so repaint straight away)
};
Scene.prototype.build = function () { this.theme.build.call(this); };
Scene.prototype.draw = function (now) { this.theme.draw.call(this, now); };

// shared bits: dithered dusk sky, twinkling stars, a dithered sun, the bouncing pin
function drawSky(x, W, g) {
  const n = SKY.length - 1;
  for (let yy = 0; yy < g; yy++) {
    const f = (yy / g) * n, i = Math.floor(f), frac = f - i;
    for (let xx = 0; xx < W; xx += 1) {
      const useNext = frac * 16 > BAYER[yy & 3][xx & 3];
      x.fillStyle = SKY[Math.min(n, i + (useNext ? 1 : 0))];
      x.fillRect(xx, yy, 1, 1);
    }
  }
}
function drawStars(x, stars, t) {
  stars.forEach(function (s) {
    if (Math.sin(t * 2 + s.p) > -0.2) { x.fillStyle = "#fff6d8"; x.fillRect(s.x, s.y, 1, 1); }
  });
}
function drawSun(x, sx, sy, sr) {
  for (let yy = -sr; yy <= sr; yy++) for (let xx = -sr; xx <= sr; xx++) {
    if (xx * xx + yy * yy <= sr * sr) {
      x.fillStyle = (yy % 3 === 0 && yy > 0) ? "#ff8a5c" : "#ffd27a";
      x.fillRect(sx + xx, sy + yy, 1, 1);
    }
  }
}
function drawPin(self, t) {
  const x = self.x, H = self.H, g = self.ground;
  const pw = self.pin.width, ph = self.pin.height, land = g - Math.round(H * 0.22) - ph;
  let py;
  if (t < 0.9) { const k = t / 0.9; py = -ph + (land + ph) * k * k; }
  else if (t < 1.3) { const k = (t - 0.9) / 0.4; py = land - Math.sin(k * Math.PI) * 6; }
  else py = land + Math.round(Math.sin((t - 1.3) * 2.2) * 2);
  x.drawImage(self.pin, self.pinX - (pw >> 1), Math.round(py));
  const sw = 5 + (py > land - 3 ? 2 : 0);   // its shadow on the rooftops
  x.fillStyle = "rgba(0,0,0,.35)"; x.fillRect(self.pinX - (sw >> 1), land + ph + 3, sw, 1);
}

const THEMES = {};

/* --- Singapore: HDB blocks, the three towers with the sky deck, the big wheel, the bay --- */
THEMES.singapore = {};
// lay out the skyline once per size; only lights, clouds, water and the pin animate
THEMES.singapore.build = function () {
  const W = this.W, H = this.H, rnd = mulberry(7);
  this.ground = Math.round(H * 0.84);
  const g = this.ground, blds = [];
  // back row: pale, short HDB-ish blocks
  for (let x = -4; x < W; ) {
    const w = 7 + Math.floor(rnd() * 8), h = Math.round(H * (0.10 + rnd() * 0.13));
    blds.push({ x: x, w: w, h: h, col: "#5a3f74", win: "#c98a8a", back: true }); x += w + 1;
  }
  // front row: taller blocks with lit windows, leaving gaps for the two landmarks
  for (let x = -2; x < W; ) {
    const w = 8 + Math.floor(rnd() * 10), h = Math.round(H * (0.07 + rnd() * 0.22));
    const inGap = (x + w > W * 0.52 && x < W * 0.74) || x + w > W * 0.8;
    if (!inGap) blds.push({ x: x, w: w, h: h, col: "#2e2044", win: "#ffd27a" });
    x += w + 1 + Math.floor(rnd() * 4);
  }
  this.blds = blds;
  this.wins = [];
  blds.forEach(function (b) {
    for (let yy = g - b.h + 3; yy < g - 2; yy += 3) for (let xx = b.x + 2; xx < b.x + b.w - 1; xx += 2) {
      if (rnd() < (b.back ? 0.18 : 0.42)) this.wins.push({ x: xx, y: yy, c: b.win, p: rnd() * 6.28, s: 0.3 + rnd() });
    }
  }, this);
  this.stars = [];
  for (let k = 0; k < 40; k++) this.stars.push({ x: Math.floor(rnd() * W), y: Math.floor(rnd() * H * 0.38), p: rnd() * 6.28 });
  this.clouds = [0, 1, 2].map(function (k) {
    return { x: rnd() * W, y: Math.round(H * (0.12 + k * 0.09)), w: 18 + Math.floor(rnd() * 16), v: 1.2 + rnd() * 1.6 };
  });
  this.pinX = Math.round(W * 0.27);
};
THEMES.singapore.draw = function (now) {
  const x = this.x, W = this.W, H = this.H, g = this.ground, t = (now - this.t0) / 1000;
  drawSky(x, W, g);
  drawStars(x, this.stars, t);
  // setting sun
  const sx = Math.round(W * 0.76), sy = g - Math.round(H * 0.17), sr = Math.round(H * 0.1);
  drawSun(x, sx, sy, sr);
  // clouds
  this.clouds.forEach(function (c) {
    const cx = Math.round(((c.x + t * c.v) % (W + c.w * 2)) - c.w);
    x.fillStyle = "#f7a6b0"; x.fillRect(cx, c.y, c.w, 2); x.fillRect(cx + 3, c.y - 2, c.w - 9, 2); x.fillRect(cx + 7, c.y - 3, 6, 1);
    x.fillStyle = "#c8708f"; x.fillRect(cx + 1, c.y + 2, c.w - 2, 1);
  });
  // skyline
  this.blds.forEach(function (b) { x.fillStyle = b.col; x.fillRect(b.x, g - b.h, b.w, b.h); });
  // big observation wheel
  const fx = Math.round(W * 0.9), fr = Math.round(H * 0.15), fy = g - fr - 3;
  x.fillStyle = "#2e2044";
  for (let a = 0; a < 6.283; a += 0.05) x.fillRect(Math.round(fx + Math.cos(a) * fr), Math.round(fy + Math.sin(a) * fr), 1, 1);
  for (let k = 0; k < 8; k++) {
    const a = k * 0.785 + t * 0.15;
    for (let d = 0; d < fr; d += 2) x.fillRect(Math.round(fx + Math.cos(a) * d), Math.round(fy + Math.sin(a) * d), 1, 1);
    x.fillStyle = "#ffd27a"; x.fillRect(Math.round(fx + Math.cos(a) * fr), Math.round(fy + Math.sin(a) * fr), 1, 1); x.fillStyle = "#2e2044";
  }
  x.fillRect(fx - 3, fy, 1, g - fy); x.fillRect(fx + 3, fy, 1, g - fy);
  // three towers with a sky deck across the top
  const mx = Math.round(W * 0.56), mh = Math.round(H * 0.30), tw = 7, gap = 4;
  x.fillStyle = "#24183a";
  for (let k = 0; k < 3; k++) {
    const bx = mx + k * (tw + gap);
    x.fillRect(bx, g - mh, tw, mh); x.fillRect(bx - 1, g - Math.round(mh * 0.5), 1, Math.round(mh * 0.5));
  }
  x.fillRect(mx - 3, g - mh - 2, 3 * tw + 2 * gap + 9, 2);
  x.fillRect(mx + 3 * tw + 2 * gap + 4, g - mh - 1, 3, 1);
  x.fillStyle = "#ffd27a";
  for (let k = 0; k < 3; k++) for (let yy = g - mh + 3; yy < g - 2; yy += 4) {
    if (Math.sin(yy * 1.7 + k * 3 + t * 0.7) > 0.3) x.fillRect(mx + k * (tw + gap) + 3, yy, 1, 1);
  }
  // twinkling windows
  this.wins.forEach(function (w) {
    if (Math.sin(t * w.s + w.p) > -0.6) { x.fillStyle = w.c; x.fillRect(w.x, w.y, 1, 1); }
  });
  // water with a shimmering reflection of the sun and lights
  for (let yy = g; yy < H; yy++) {
    x.fillStyle = yy % 2 ? "#1a1d45" : "#20255a"; x.fillRect(0, yy, W, 1);
  }
  for (let yy = g + 1; yy < H; yy += 2) {
    const wob = Math.round(Math.sin(t * 2 + yy) * 2), wdt = Math.max(2, sr - (yy - g));
    x.fillStyle = "#ff9a6a"; x.fillRect(sx - (wdt >> 1) + wob, yy, wdt, 1);
    for (let k = 0; k < 6; k++) {
      const rx = (k * 37 + yy * 13) % W;
      if (Math.sin(t * 3 + k + yy) > 0.5) { x.fillStyle = "#ffd27a"; x.fillRect(rx + wob, yy, 2, 1); }
    }
  }
  // the pin: drops in, bounces, then hovers
  drawPin(this, t);
};

/* --- Chiang Mai: Doi Suthep with its golden chedi, a Lanna temple hall and a big chedi,
       the old city wall and moat, and sky lanterns drifting up --- */
THEMES.chiangmai = {};
THEMES.chiangmai.build = function () {
  const W = this.W, H = this.H, rnd = mulberry(11);
  this.ground = Math.round(H * 0.84);
  const g = this.ground;
  // heights scale with S, not H, so tall phone screens don't get towering mountains
  const S = this.S = Math.min(H, Math.round(W * 0.7));
  this.u = Math.max(1, Math.round(W / 110));   // building pixel size: 1 on phones, 2 on wide screens
  // two mountain ridges; the back one peaks at Doi Suthep (left of centre)
  const peakX = W * 0.22, back = [], front = [];
  for (let xx = 0; xx < W; xx++) {
    const u = xx / W;
    const bump = Math.exp(-Math.pow((xx - peakX) / (W * 0.13), 2));
    back.push(Math.round(g - S * (0.15 + 0.05 * Math.sin(u * 5.1 + 0.4) + 0.02 * Math.sin(u * 23) + 0.24 * bump)));
    front.push(Math.round(g - S * Math.max(0.05, 0.15 - 0.15 * u + 0.025 * Math.sin(u * 17 + 1))));
  }
  this.back = back; this.front = front;
  this.peak = { x: Math.round(peakX), y: Math.min.apply(null, back.slice(Math.round(peakX) - 3, Math.round(peakX) + 4)) };
  // low town in the valley: roofs and trees
  this.town = [];
  for (let xx = -3; xx < W; ) {
    const tree = rnd() < 0.45, w = tree ? 3 + Math.floor(rnd() * 4) : 5 + Math.floor(rnd() * 7);
    this.town.push({ x: xx, w: w, h: Math.round(S * (tree ? 0.04 + rnd() * 0.05 : 0.03 + rnd() * 0.06)), tree: tree });
    xx += w + Math.floor(rnd() * 2);
  }
  this.wins = [];
  this.town.forEach(function (b) {
    if (!b.tree && rnd() < 0.6) this.wins.push({ x: b.x + 1 + Math.floor(rnd() * Math.max(1, b.w - 2)), y: g - 2 - Math.floor(rnd() * Math.max(1, b.h - 2)), p: rnd() * 6.28, s: 0.3 + rnd() });
  }, this);
  this.stars = [];
  for (let k = 0; k < 34; k++) this.stars.push({ x: Math.floor(rnd() * W), y: Math.floor(rnd() * H * 0.34), p: rnd() * 6.28 });
  // sky lanterns (khom loi): some near (bigger), most far
  this.lanterns = [];
  for (let k = 0; k < 16; k++) {
    this.lanterns.push({ x: W * (0.3 + rnd() * 0.75), off: rnd() * H, v: 2 + rnd() * 3.5, sway: rnd() * 6.28, big: rnd() < 0.3 });
  }
  this.pinX = Math.round(W * 0.27);
};
THEMES.chiangmai.draw = function (now) {
  const x = this.x, W = this.W, H = this.H, g = this.ground, t = (now - this.t0) / 1000;
  drawSky(x, W, g);
  drawStars(x, this.stars, t);
  // sun setting over the valley
  const S = this.S, sx = Math.round(W * 0.72), sy = g - Math.round(S * 0.16), sr = Math.round(S * 0.1);
  drawSun(x, sx, sy, sr);
  // ridges
  for (let xx = 0; xx < W; xx++) {
    x.fillStyle = "#5a3f74"; x.fillRect(xx, this.back[xx], 1, g - this.back[xx]);
  }
  for (let xx = 0; xx < W; xx++) {
    x.fillStyle = "#3d2b5c"; x.fillRect(xx, this.front[xx], 1, g - this.front[xx]);
  }
  // the golden chedi on Doi Suthep, glinting
  const p = this.peak;
  x.fillStyle = "#ffd27a"; x.fillRect(p.x - 1, p.y - 1, 3, 1); x.fillRect(p.x, p.y - 3, 1, 2);
  if (Math.sin(t * 1.5) > 0.6) { x.fillStyle = "#fff6d8"; x.fillRect(p.x, p.y - 4, 1, 1); }
  // sky lanterns rising (drawn before the town so they come up from behind it)
  this.lanterns.forEach(function (l) {
    const span = g + 12, y = Math.round(g - ((t * l.v + l.off) % span));
    const lx = Math.round(l.x + Math.sin(t * 0.6 + l.sway) * 2);
    if (l.big) {
      x.fillStyle = "#ffd27a"; x.fillRect(lx, y, 2, 1);
      x.fillStyle = "#ff9a4a"; x.fillRect(lx, y + 1, 2, 2);
      if (Math.sin(t * 6 + l.sway) > -0.3) { x.fillStyle = "#fff0b8"; x.fillRect(lx, y + 3, 2, 1); }
    } else {
      x.fillStyle = "#ffb45c"; x.fillRect(lx, y, 1, 2);
    }
  });
  // town
  this.town.forEach(function (b) {
    x.fillStyle = b.tree ? "#2a2a45" : "#33234d";
    if (b.tree) { x.fillRect(b.x + 1, g - b.h, b.w - 2, 1); x.fillRect(b.x, g - b.h + 1, b.w, b.h - 1); }
    else { x.fillRect(b.x, g - b.h, b.w, b.h); x.fillRect(b.x + 1, g - b.h - 1, b.w - 2, 1); }
  });
  this.wins.forEach(function (w) {
    if (Math.sin(t * w.s + w.p) > -0.5) { x.fillStyle = "#ffd27a"; x.fillRect(w.x, w.y, 1, 1); }
  });
  // big chedi: stepped base, bell, spire
  const cx = Math.round(W * 0.6), u = this.u;
  x.fillStyle = "#24183a";
  const tiers = [[13, 3], [10, 3], [7, 3]];
  let top = g;
  tiers.forEach(function (tr) { const w = tr[0] * u, h = tr[1] * u; x.fillRect(cx - w, top - h, 2 * w + 1, h); top -= h; });
  const bell = 5 * u;
  for (let yy = 0; yy < bell * 1.6; yy++) {
    const half = Math.round(bell * Math.sqrt(Math.max(0, 1 - Math.pow(yy / (bell * 1.6), 2))));
    x.fillRect(cx - half, top - yy, 2 * half + 1, 1);
  }
  top -= Math.round(bell * 1.6);
  const spire = 9 * u;
  for (let yy = 0; yy < spire; yy++) {
    const half = Math.max(0, Math.round(2 * u * (1 - yy / spire)));
    x.fillRect(cx - half, top - yy, 2 * half + 1, 1);
  }
  x.fillStyle = "#ffd27a"; x.fillRect(cx, top - spire - 1, 1, 2);
  // Lanna temple hall (viharn): stacked, swept roofs with gold edges and chofa finials
  const vx = Math.round(W * 0.88), vw = 13 * u, vh = 4 * u;
  x.fillStyle = "#24183a"; x.fillRect(vx - vw + 2 * u, g - vh, 2 * (vw - 2 * u) + 1, vh);
  let ry = g - vh;
  [[vw, 3 * u], [vw - 3 * u, 3 * u], [vw - 6 * u, 3 * u]].forEach(function (r) {
    const half = r[0], h = r[1];
    for (let yy = 0; yy < h; yy++) {
      const w = Math.round(half - (yy * half * 0.3) / h);
      x.fillStyle = "#24183a"; x.fillRect(vx - w, ry - yy, 2 * w + 1, 1);
      x.fillStyle = "#c8902a"; x.fillRect(vx - w, ry - yy, 1, 1); x.fillRect(vx + w, ry - yy, 1, 1);
    }
    const tw = Math.round(half * 0.55);
    x.fillStyle = "#ffd27a";                      // chofa: little hooks at each ridge end
    x.fillRect(vx - tw - 1, ry - h - 1, 1, 2); x.fillRect(vx + tw + 1, ry - h - 1, 1, 2);
    ry -= h;
  });
  // old city wall with crenellations and a gate
  const wallH = Math.max(3, Math.round(S * 0.04)), gateX = Math.round(W * 0.42), gateW = 4 * u + 2;
  x.fillStyle = "#4a2440"; x.fillRect(0, g - wallH, W, wallH);
  x.fillStyle = "#6b2c45"; x.fillRect(0, g - wallH, W, 1);
  x.fillStyle = "#4a2440";
  for (let xx = 0; xx < W; xx += 4) x.fillRect(xx, g - wallH - 1, 2, 1);
  x.fillStyle = "#3a1f3a"; x.fillRect(gateX, g - wallH + 1, gateW, wallH - 1);
  // moat, reflecting the sun and the lanterns
  for (let yy = g; yy < H; yy++) {
    x.fillStyle = yy % 2 ? "#1a1d45" : "#20255a"; x.fillRect(0, yy, W, 1);
  }
  for (let yy = g + 1; yy < H; yy += 2) {
    const wob = Math.round(Math.sin(t * 2 + yy) * 2), wdt = Math.max(2, sr - (yy - g));
    x.fillStyle = "#ff9a6a"; x.fillRect(sx - (wdt >> 1) + wob, yy, wdt, 1);
    for (let k = 0; k < 7; k++) {
      const rx = Math.round(W * 0.3 + ((k * 41 + yy * 11) % Math.round(W * 0.7)));
      if (Math.sin(t * 3 + k + yy) > 0.55) { x.fillStyle = "#ffb45c"; x.fillRect(rx + wob, yy, 1, 1); }
    }
  }
  drawPin(this, t);
};
Scene.prototype.start = function () {
  if (this.timer) return;
  const self = this;
  this.t0 = performance.now();
  this.resize(); this.draw(performance.now());
  this.timer = setInterval(function () { self.draw(performance.now()); }, 1000 / 12);  // 12 fps: retro and cheap
};
Scene.prototype.stop = function () { clearInterval(this.timer); this.timer = null; };

return { spriteURL: spriteURL, spriteSize: spriteSize, Scene: Scene };
})();
