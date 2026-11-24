// The SingaPointing Game — settings. The game itself is shared with the other pointing
// games (pages/random/_pointing/); this file and text.js are what make it Singapore.
window.POINTING_CONFIG = {
  storageKey: "singapointing",   // best scores + challenge settings are saved in the browser under this name
  scene: "singapore",            // title-screen art, from _pointing/pixel.js

  // scoring
  rounds: 5,                     // photos per game
  maxPoints: 10000,              // the most one photo is worth
  fullMarksKm: 0.05,             // within this distance you get full marks
  decayKm: 3,                    // points fall off as exp(-km / decayKm): 1 km≈7200, 5 km≈1900, 10 km≈360
  minSepKm: 3,                   // photos in one game are at least this far apart, when the pool allows
                                 // (3 km spreads a game out while still letting some games stay fairly
                                 // central; much more and photos in busy areas come up rarely)

  // challenges
  timerSeconds: 30,              // "timer": seconds per photo
  peekSeconds: 3,                // "quick look": the photo hides after this long

  // the map: opening view, and panning is kept inside `bounds`
  center: [1.3521, 103.8198],
  zoom: 11,
  minZoom: 10,
  bounds: [[1.13, 103.55], [1.50, 104.12]],

  // map styles, in button order (the first is the default). Each button's label and
  // description are options.map<Name> / options.desc<Name> in text.js.
  //   url: tile address   land: a silhouette file instead of tiles (with bg = sea colour)
  //   line: colour of the guess-to-answer line   maxZoom / maxNativeZoom: zoom limits
  maps: {
    streets: {
      url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png", maxNativeZoom: 19, line: "#1d1b26",
      attr: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    plain: {     // roads and coastline, no names
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
      maxNativeZoom: 16, line: "#1d1b26", attr: "Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors"
    },
    outline: {   // a flat silhouette of the land (data-land.js), no tiles: no roads, no names
      land: "data-land.js", bg: "#a9c9e2", maxZoom: 16, line: "#fffdf8",
      attr: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
  },
};
