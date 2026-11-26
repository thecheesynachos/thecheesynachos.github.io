// The Map Game — every piece of wording the game shows, in one place.
//
// Edit any string here and reload; nothing else needs touching. A few strings take
// placeholders in {braces}, which the game fills in — keep the brace names as they
// are, but move or drop them freely:
//
//     {n}        a number (already formatted with thousands separators)
//     {km}       a formatted distance, e.g. "531 km"
//     {city}     the city name for the round
//     {rounds}   how many rounds a classic game has
//     {perRound} the most points a single round can be worth
//     {total}    the most points a whole classic game can be worth
//     {seconds}  seconds on the clock per city, in timed games
//     {levels}   how many levels the Levels mode has
//     {level}    a level number
//     {target}   the points a level asks for
//     {tries}    how many cities a level gives you
//
// Round count, points, timer length and the level ladder live at the top of
// citypin.js; the numbers that appear in the text below follow whatever those are.

window.CITYPIN_TEXT = {

  // --- the bar across the top, and the buttons over the map ---
  ui: {
    findThisCity: "Where is",
    cityPlaceholder: "—",          // shown before the first round starts
    scoreLabel: "Score",
    home: "Home (back to the start)",         // tooltips
    fullscreen: "Fullscreen (Esc to exit)",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    resetView: "Reset view",
    pip: "City {n}",               // round marker tooltips
    pipDone: "City {n}: {points} pts",

    dropPin: "Drop a pin",         // the guess button, before a pin is down
    guess: "Guess!",               // …once it is
    nextCity: "Next city ▸",       // …after a guess
    seeResults: "See results ▸",   // …after the last guess

    hintClick: "Click the map to drop your pin.",
    hintOffMap: "Psst -- that's not the map!",
    yourPin: "Your pin",           // label on your marker once the answer shows
    km: "{n} km"
  },

  // --- the clock, in timed games ---
  timer: {
    timeUp: "Time's up!",
    noPin: "No pin dropped"
  },

  // --- "leave this game?" card, from the Home button mid-game ---
  leave: {
    title: "Leave this game?",
    text: "Your score so far won't be saved.",
    stay: "Keep playing",
    go: "Leave"
  },

  // --- the title screen ---
  start: {
    back: "◂ Back to site",     // top-left button on the title screen, back to the Random Stuff page
    kicker: "The",
    title: "Map Game",
    blurb: "I give you a city name, you locate it on the map. Easy.",

    modeLabel: "Mode",
    // `mode` must stay "classic" or "levels"; the cards appear in this order.
    modes: [
      { mode: "classic", name: "Classic", note: "{rounds} cities, {perRound} pts each" },
      { mode: "levels", name: "Levels", note: "{levels} levels, hit the target to move on" }
    ],

    poolLabel: "City pool",
    // One button each. `tier` says which cities it draws on and must stay 0, 1 or 2
    // to match data-cities.js; the buttons appear in the order listed here.
    pools: [
      { tier: 0, name: "Famous", note: "{n} cities" },
      { tier: 1, name: "Tricky", note: "{n} cities" },
      { tier: 2, name: "???", note: "{n} cities" }
    ],

    // shown in place of the pool buttons when Levels is picked: one square per level
    levelsLabel: "The climb",
    ladderTip: "Level {level}: {target} pts in {tries} cities",

    mapLabel: "Map",
    // `borders` decides whether country outlines are drawn during the game.
    mapModes: [
      { borders: true, name: "Borders", note: "Country outlines" },
      { borders: false, name: "No borders", note: "Just like the doctors" }
    ],

    clockLabel: "Clock",
    // `timed` turns the per-city countdown on or off.
    clockModes: [
      { timed: false, name: "Relaxed", note: "Take your time" },
      { timed: true, name: "Timed", note: "{seconds}s per city" }
    ],

    play: "▶ Play",
    bestClassic: "Best on this setting: {n}",
    bestLevels: "Best on this setting: level {level} · {n} pts",
    bestLevelsWon: "Best on this setting: all {levels} levels · {n} pts",
    // site-wide page views over the last 30 days, from the visitor counter;
    // only shown once the counter has loaded
    visits: "{count} site views this month",
    // This one is HTML, so it can carry a link.
    credits: 'Drag to pan, scroll or pinch to zoom, <b>Space</b> to guess.<br>' +
      'City data © <a href="https://www.geonames.org/" target="_blank" rel="noopener">GeoNames</a> ' +
      '(CC BY 4.0), map from Natural Earth.'
  },

  // --- Levels mode ---
  levels: {
    short: "Lvl",                  // the badge in the top bar, before the number
    kicker: "Level {level} of {levels}",
    big: "Level {level}",
    // which cities a level draws on, by its `tiers` in citypin.js (joined with " + ")
    tierNames: ["Famous", "Tricky", "???"],
    pool: "{names} cities",
    goal: "Score {target} in {tries} cities",
    go: "Go ▸",
    cleared: "Level {level} cleared!",
    clearedPts: "{pts} / {target}",
    // the strip under the result bar; {have} = points so far this level, {tries} = cities left
    noteCleared: "{have} / {target} · level cleared!",
    noteFailed: "{have} / {target} · not enough, the climb ends here",
    noteGoing: "{have} / {target} · {need} to go, {tries} cities left",
    noteGoingOne: "{have} / {target} · {need} to go, last city!",
    noteSecured: "{have} / {target} · target hit! {tries} more to add to your score",
    noteSecuredOne: "{have} / {target} · target hit! One more to add to your score",
    nextLevel: "Next level ▸",
    finish: "See results ▸",
    lastLevel: "Final level"       // the kicker on the last level's card, instead of `kicker`
  },

  // --- how a guess is described, worst case last ---
  // The first entry whose `within` distance (km) the guess beats is the one used,
  // so keep them in increasing order. `tone` is good, accent or bad — it sets the
  // colour, and the round markers in the top bar. Add or remove rows as you like;
  // the last one catches everything.
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
    distance: "{km} from {city}",
    outOf: "/ {perRound}"
  },

  // --- the scoreboard at the end ---
  end: {
    kicker: "Game over",
    outOf: "/ {total}",
    averageMiss: "Average miss: {km}.",
    playAgain: "Play again",
    changeDifficulty: "Change settings",
    timed: "Timed · {seconds}s per city",

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

    newBest: "★ New personal best",
    previousBest: " (previous: {n})",
    best: "Personal best on this setting: {n}"
  },

  // --- the end of a Levels run ---
  levelsEnd: {
    kickerWon: "You beat every level",
    kickerLost: "Out on level {level}",
    outOf: "points in total",
    sub: "Reached level {level} of {levels}",
    subWon: "All {levels} levels cleared",
    row: "Level {level}",
    rowDetail: "{pts} / {target} over {tries} cities",
    // Picked by the level you got out on (or levels+1 if you won): the first row
    // whose `reached` the level is at least.
    messages: [
      { reached: 11, text: "Geography god. Bow down." },
      { reached: 9, text: "So close to the top. The ??? cities are no joke." },
      { reached: 7, text: "Tricky cities, handled. Mostly." },
      { reached: 4, text: "The famous ones are fine, the rest... less so." },
      { reached: 2, text: "Warm-up done, at least." },
      { reached: 1, text: "Level 1 though?" }
    ],
    newBest: "★ New personal best",
    best: "Personal best on this setting: level {level} · {n} pts",
    bestWon: "Personal best on this setting: all levels · {n} pts"
  }
};
