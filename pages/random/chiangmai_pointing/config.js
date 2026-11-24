// The Chiang Mai Pointing Game — settings. The game itself is shared with the other
// pointing games (pages/random/_pointing/); this file and text.js are what make it Chiang Mai.
window.POINTING_CONFIG = {
  storageKey: "chiangmaipointing",   // best scores + challenge settings are saved in the browser under this name
  scene: "chiangmai",                // title-screen art, from _pointing/pixel.js

  // scoring. Tuned to the photo spread: the photos sit ~2.9x closer together than
  // Singapore's (median gap 3.6 km vs 10.5 km), so points fall off faster. Guessing
  // "right city, wrong spot" averages ~1,350 pts (Singapore: ~1,180).
  rounds: 5,                     // photos per game
  maxPoints: 10000,              // the most one photo is worth
  fullMarksKm: 0.05,             // within this distance you get full marks
  decayKm: 1.25,                 // points fall off as exp(-km / decayKm): 0.5 km≈6700, 1 km≈4500, 2 km≈2000, 5 km≈180
  minSepKm: 1,                   // photos in one game are at least this far apart (low, since the photos aren't
                                 // very dense; higher values make outlying photos repeat more)

  // challenges
  timerSeconds: 30,              // "timer": seconds per photo
  peekSeconds: 3,                // "quick look": the photo hides after this long

  // the map. All photos are in and around the city (within ~9 km of Tha Phae Gate); the
  // opening view is their area plus a little margin. `view` is also the game's photo
  // area: _process_photos.py skips any photo taken outside it (Chiang Dao, Mae Kampong, ...),
  // so widening it lets more photos in.
  view: [[18.710, 98.897], [18.840, 99.022]],   // opening view, fitted to the screen whatever its size; also the photo area
  lockZoomOut: true,                            // while guessing, no zooming out past the opening view
  bounds: [[18.66, 98.86], [18.88, 99.07]],     // panning is kept inside this box (the view + a few km)
  center: [18.7728, 98.9615],                   // (only used if `view` is removed)
  zoom: 13,
  minZoom: 11,

  // map styles, in button order (the first is the default). Each button's label and
  // description are options.map<Name> / options.desc<Name> in text.js.
  maps: {
    streets: {
      url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png", maxNativeZoom: 19, line: "#1d1b26",
      attr: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    plain: {     // roads and rivers, no names
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
      maxNativeZoom: 16, line: "#1d1b26", attr: "Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors"
    },
    rivers: {   // no roads or names: just the hills (Doi Suthep) plus water: the Ping and other rivers,
                // the old-city moat, canals, lakes and reservoirs (data-water.js, loaded only when picked)
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}",
      maxNativeZoom: 13, maxZoom: 16, land: "data-water.js", line: "#1d1b26",
      layers: {   // drawing order and style of each set of shapes in data-water.js
        areas:  { stroke: true, color: "#3d84c6", weight: 2.5, fillColor: "#3d84c6", fillOpacity: 1 },   // (thick outline so the moat reads as a square)
        canals: { color: "#5a9bd5", weight: 1.5, opacity: 0.9 },
        rivers: { color: "#3d84c6", weight: 3 },
      },
      attr: "Tiles &copy; Esri &mdash; Source: Esri; water &copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"
    },
  },
};
