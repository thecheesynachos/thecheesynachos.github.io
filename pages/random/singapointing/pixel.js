// The Singapointing Game — hand-written pixel art. Every sprite below is a little grid of
// characters (one character = one pixel, "." = transparent) mapped to colours by a
// palette, plus a procedurally drawn dusk skyline for the title screen. Nothing here
// is an image file; it is all drawn onto <canvas> at load time.
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

function Scene(canvas) {
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
// lay out the skyline once per size; only lights, clouds, water and the pin animate
Scene.prototype.build = function () {
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
Scene.prototype.draw = function (now) {
  const x = this.x, W = this.W, H = this.H, g = this.ground, t = (now - this.t0) / 1000;
  // sky: banded gradient with ordered dithering between neighbouring bands
  const n = SKY.length - 1;
  for (let yy = 0; yy < g; yy++) {
    const f = (yy / g) * n, i = Math.floor(f), frac = f - i;
    for (let xx = 0; xx < W; xx += 1) {
      const useNext = frac * 16 > BAYER[yy & 3][xx & 3];
      x.fillStyle = SKY[Math.min(n, i + (useNext ? 1 : 0))];
      x.fillRect(xx, yy, 1, 1);
    }
  }
  // stars
  this.stars.forEach(function (s) {
    if (Math.sin(t * 2 + s.p) > -0.2) { x.fillStyle = "#fff6d8"; x.fillRect(s.x, s.y, 1, 1); }
  });
  // setting sun
  const sx = Math.round(W * 0.76), sy = g - Math.round(H * 0.17), sr = Math.round(H * 0.1);
  for (let yy = -sr; yy <= sr; yy++) for (let xx = -sr; xx <= sr; xx++) {
    if (xx * xx + yy * yy <= sr * sr) {
      x.fillStyle = (yy % 3 === 0 && yy > 0) ? "#ff8a5c" : "#ffd27a";
      x.fillRect(sx + xx, sy + yy, 1, 1);
    }
  }
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
  const pw = this.pin.width, ph = this.pin.height, land = g - Math.round(H * 0.22) - ph;
  let py;
  if (t < 0.9) { const k = t / 0.9; py = -ph + (land + ph) * k * k; }
  else if (t < 1.3) { const k = (t - 0.9) / 0.4; py = land - Math.sin(k * Math.PI) * 6; }
  else py = land + Math.round(Math.sin((t - 1.3) * 2.2) * 2);
  x.drawImage(this.pin, this.pinX - (pw >> 1), Math.round(py));
  // its shadow on the rooftops
  const sw = 5 + (py > land - 3 ? 2 : 0);
  x.fillStyle = "rgba(0,0,0,.35)"; x.fillRect(this.pinX - (sw >> 1), land + ph + 3, sw, 1);
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
