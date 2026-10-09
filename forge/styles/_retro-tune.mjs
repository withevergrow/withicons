// RETRO per-icon tuning. Skeletons stay style-agnostic; anything Retro needs to
// know about one icon lives here.
//   w      ink weight override (dense icons breathe better a touch lighter)
//   bands  force a stripe count (1-4)
//   order  stripe palette indices, top to bottom (e.g. [1, 3])
//   echo   true: treat as a line glyph (offset colour line); false: never
const T = {
  'qr-code': { w: 2.0 },   // modules stay separate
  coffee: { w: 2.15 },     // the steam curls stay open
  'piggy-bank': { w: 1.75 },   // the coin, tail and snout keep their counters
  tennis: { w: 2.0 },      // the string grid stays open
  hotel: { w: 2.1, bands: 3 },      // the sign and bed keep their counters
  'bar-values': { w: 2.0 }, // live: five bars + their echoes stay five separate bars
}

// Live icons (forge/DYNAMIC.md) that letter a value on their face: the face is a plain mustard label at every value
//   (only applied to a live skeleton, icon.params; a static icon of the same name keeps its stripes)
for (const n of ['avatar-initials', 'badge-text', 'battery-percent', 'calendar-date', 'calendar-event', 'calendar-month',
  'calendar-range', 'calendar-tear', 'calendar-weekday', 'cellular-tech', 'digital-clock', 'file-type', 'folder-label',
  'humidity', 'keycap', 'map-pin-number', 'percent-badge', 'price-tag', 'progress-ring', 'ribbon-label', 'sale-sticker',
  'speech-bubble-text', 'step-number', 'tag-label', 'ticket-number', 'timer-ring', 'uv-index']) T[n] = { ...(T[n] || {}), label: true }

export const tune = name => T[name] || {}
