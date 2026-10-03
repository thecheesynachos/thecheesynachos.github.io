// City Pin — every piece of wording the game shows, in one place.
//
// Edit any string here and reload; nothing else needs touching. A few strings take
// placeholders in {braces}, which the game fills in — keep the brace names as they
// are, but move or drop them freely:
//
//     {n}        a number (already formatted with thousands separators)
//     {km}       a formatted distance, e.g. "531 km"
//     {city}     the city name for the round
//     {rounds}   how many rounds a game has
//     {perRound} the most points a single round can be worth
//     {total}    the most points a whole game can be worth
//
// Round count and points live in citypin.js (ROUNDS and MAX_POINTS); the numbers
// that appear in the text below follow whatever those are set to.

window.CITYPIN_TEXT = {

  // --- the bar across the top, and the strip along the bottom ---
  ui: {
    findThisCity: "Where is",
    cityPlaceholder: "—",          // shown before the first round starts
    roundLabel: "Round",
    scoreLabel: "Score",
    roundCounter: "{n}/{rounds}",
    fullscreen: "Fullscreen (Esc to exit)",   // tooltips
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    resetView: "Reset view",

    guess: "Guess",                // the confirm button, round in progress
    nextCity: "Next city",         // …after a guess
    seeResults: "See results",     // …after the last guess

    pickPrompt: "Drop the pin, click confirm.",
    pinDropped: "Pin dropped. Confirm, or click again to move it.",
    hintClick: "Click the map to drop your pin.",
    hintOffMap: "Psst -- that's not the map!",
    yourPin: "Your pin",           // label on your marker once the answer shows
    km: "{n} km"
  },

  // --- the opening card ---
  start: {
    title: "The Map Game",
    blurb: "I give you a city name, you locate it on the map. {perRound} points a round, {total} in all. Easy.",

    poolLabel: "City pool",
    // One button each. `tier` says which cities it draws on and must stay 0, 1 or 2
    // to match data-cities.js; the buttons appear in the order listed here.
    pools: [
      { tier: 0, name: "Famous", note: "{n} cities" },
      { tier: 1, name: "Tricky", note: "{n} cities" },
      { tier: 2, name: "???", note: "{n} cities" }
    ],

    mapLabel: "Map",
    // `borders` decides whether country outlines are drawn during the game.
    mapModes: [
      { borders: true, name: "With borders", note: "Country outlines drawn" },
      { borders: false, name: "Without borders", note: "Just like the doctors" }
    ],

    play: "Play",
    // This one is HTML, so it can carry a link.
    credits: 'Drag to pan, scroll or pinch to zoom. Everything runs offline in your browser.<br>' +
      'City data © <a href="https://www.geonames.org/" target="_blank" rel="noopener">GeoNames</a> ' +
      '(CC BY 4.0), map from Natural Earth.'
  },

  // --- how a guess is described, worst case last ---
  // The first entry whose `within` distance (km) the guess beats is the one used,
  // so keep them in increasing order. `tone` is good, accent or bad — it only sets
  // the colour. Add or remove rows as you like; the last one catches everything.
  ratings: [
    { within: 50, word: "Bosh", tone: "good" },
    { within: 200, word: "Almost", tone: "good" },
    { within: 500, word: "Close", tone: "accent" },
    { within: 1000, word: "Getting there", tone: "accent" },
    { within: 2000, word: "Not quite", tone: "bad" },
    { within: 4000, word: "Yikes", tone: "bad" },
    { within: Infinity, word: "Try harder", tone: "bad" }
  ],

  result: {
    distance: "{km} from {city}"
  },

  // --- the scoreboard at the end ---
  end: {
    title: "Game over",
    outOf: "/ {total}",
    columns: ["#", "City", "Off by", "Points"],
    averageMiss: "Average miss: {km}.",
    playAgain: "Play again",
    changeDifficulty: "Change difficulty",

    // Picked by score as a fraction of the maximum: the first row whose `above`
    // the fraction beats. Keep them in decreasing order, last one at 0.
    messages: [
      { above: 0.95, text: "Did you eat a map when you were a baby" },
      { above: 0.9, text: "You definitely qualify as a geography teacher." },
      { above: 0.75, text: "I rate that effort." },
      { above: 0.6, text: "Solid geography." },
      { above: 0.4, text: "Not everyone is talented in everything." },
      { above: 0.2, text: "You tried. Could be better, but you tried." },
      { above: 0.1, text: "The map is that thing with the countries on it." },
      { above: 0, text: "Are you okay?" }
    ],

    newBest: "New personal best on this difficulty.",
    previousBest: " Previous: {n}.",
    best: "Personal best on this difficulty: {n}."
  }
};
