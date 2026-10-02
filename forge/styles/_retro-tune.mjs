// RETRO per-icon tuning. Skeletons stay style-agnostic; anything Retro needs to
// know about one icon lives here.
//   w      ink weight override (dense icons breathe better a touch lighter)
//   bands  force a stripe count (1-4)
//   order  stripe palette indices, top to bottom (e.g. [1, 3])
//   echo   true: treat as a line glyph (offset colour line); false: never
const T = {
  'qr-code': { w: 2.0 },   // modules stay separate
  coffee: { w: 2.15 },     // the steam curls stay open
  tennis: { w: 2.0 },      // the string grid stays open
  hotel: { w: 2.1, bands: 3 },      // the sign and bed keep their counters
}

export const tune = name => T[name] || {}
