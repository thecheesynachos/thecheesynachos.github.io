// The Singapointing Game — every piece of wording the game shows, in one place.
//
// Edit any string here and reload; nothing else needs touching. Some strings take
// placeholders in {braces}, which the game fills in. Keep the brace names as they are,
// but move or drop them freely:
//
//     {n}         the current photo number (1, 2, 3 ...)
//     {rounds}    how many photos a game has
//     {points}    points scored this round, e.g. "4,120"
//     {perRound}  the most points one photo is worth, e.g. "10,000"
//     {total}     total score so far / for the game
//     {max}       the most points a whole game is worth, e.g. "50,000"
//     {dist}      a distance, e.g. "850 m" or "2.31 km"
//     {best}      your best score
//     {rating}    the round's rating word (from `ratings` below)
//
// Strings marked (html) may use <b>, <em> and <kbd>; the rest are plain text.
// Round count, points and distances live at the top of singapointer.js.

window.SINGAPOINTING_TEXT = {

  // --- title screen ---
  title: {
    kicker: "The",
    line1: "Singa",
    line2: "Pointing",
    sub: "Game",
    tagline: "Where in Singapore was this photo taken?",
    play: "▶ Play",
    how: "How to play",
    stats: "{rounds} rounds",               // (html) shown under the buttons
    statsBest: "{rounds} rounds &middot; best {best}",
    noPhotos: "No photos yet. Add some to data-photos.js.",
  },

  // --- title screen: optional challenges (times are set in singapointer.js) ---
  options: {
    heading: "Challenges",
    timer: "{seconds}s timer",
    peek: "Quick look",
    map: "Map",
    mapStreets: "Streets",
    mapPlain: "No names",
    mapOutline: "Outline",
    // the line under the toggles describing what's switched on (html)
    descNone: "the chill mode",
    descTimer: "{seconds} seconds per photo",
    descPeek: "photo only shown for {peek} seconds",
    descPlain: "where the streets have no name",
    descOutline: "just the terrain map",
  },
  timer: {
    tip: "Time left",
    timeUp: "Time's up!",
  },

  // --- the bar along the top ---
  hud: {
    name: "The SingaPointing Game",
    score: "Score",
    help: "How to play",                    // button tooltips
    home: "Back to title screen",
    fullscreen: "Fullscreen",
    exitFullscreen: "Exit fullscreen (Esc)",
    pip: "Photo {n}",                       // round marker tooltips
    pipDone: "Photo {n}: {points} pts",
  },

  // --- photo panel and the info card under it ---
  photo: {
    badge: "Photo {n}/{rounds}",
    alt: "Where in Singapore was this taken?",
    hidden: "Photo hidden",
  },
  info: {
    round: "Photo {n} of {rounds}",
    tipStart: "<b>Click the map</b> to drop your pin.",              // (html)
    tipPinned: "<b>Click again</b> to move it, or hit <b>Guess!</b>", // (html)
    tipRevealed: "The <b>green flag</b> is the answer.",             // (html) also takes {points} {dist} {rating}
    endRound: "Game over",
    tipEnd: "Final score: <b>{total}</b>",                           // (html)
    reviewRound: "Your game",
    tipReview: "<b>Flags</b> are answers, <b>pins</b> are your guesses.", // (html)
    keys: "<span><kbd>Space</kbd> guess / next</span><span><kbd>Scroll</kbd> zoom map</span>", // (html)
  },

  // --- buttons on the map ---
  buttons: {
    placePin: "Place a pin on the map",
    guess: "Guess!",
    next: "Next photo ▸",
    results: "See results ▸",
    back: "◀ Back to results",
  },

  // --- the card after each guess ---
  result: {
    distance: "{dist} away",
    noGuess: "No pin placed",
    outOf: "/ {perRound}",
  },

  // Rating for one guess, by distance in km: the first line whose `within` the
  // guess is inside wins. `tone` picks the colour: great, good, ok or bad.
  ratings: [
    { within: 0.1, word: "BOSH!", tone: "great" },
    { within: 0.5, word: "very close", tone: "great" },
    { within: 1.5, word: "close", tone: "great" },
    { within: 4, word: "getting there", tone: "good" },
    { within: 8, word: "eh close enough", tone: "ok" },
    { within: 15, word: "lmao", tone: "bad" },
    { within: Infinity, word: "????", tone: "bad" },
  ],

  // --- results screen ---
  end: {
    kicker: "Final score",
    outOf: "/ {max}",
    newBest: "New best!",
    wasBest: "was {best}",
    yourBest: "Your best: {best}",
    row: "Photo {n}",
    rowDetail: "{dist} &middot; {rating}",   // (html)
    rowNoGuess: "No guess",
    modes: "{list}",                         // challenges that were on, e.g. "30s timer · Outline"
    playAgain: "Play again",
    review: "See all on map",
    home: "Home",                          // back to the title screen
    reviewTip: "Photo {n}: {dist}, {points} pts",   // hover text on the map flags
    reviewTipNoGuess: "Photo {n}: no guess",
  },

  // Title for the whole game, by share of the maximum score (0.9 = 90%).
  grades: [
    { atLeast: 0.9, word: "What a pro!" },
    { atLeast: 0.7, word: "Very nice." },
    { atLeast: 0.5, word: "Nice." },
    { atLeast: 0.3, word: "Not bad." },
    { atLeast: 0.1, word: "Eh." },
    { atLeast: 0, word: "Did you even try?" },
  ],

  // --- "leave this game?" card, from the Home button mid-game ---
  leave: {
    title: "Leave this game?",
    text: "Your score so far won't be saved.",
    stay: "Keep playing",
    go: "Leave",
  },

  // --- how-to-play card ---
  help: {
    title: "How to play",
    step1: "<b>Look at the photo.</b> It was taken somewhere in Singapore.",          // (html)
    step2: "<b>Drop a pin</b> where you think it was taken, then hit <em>Guess</em>.", // (html)
    step3: "<b>Score up to {perRound}</b> per photo. Closer is better.",               // (html)
    keys: "<span><kbd>Space</kbd> guess / next</span><span><kbd>Scroll</kbd> zoom map</span><span><kbd>Esc</kbd> close</span>", // (html)
    close: "Got it",
  },
};
