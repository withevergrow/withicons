// COQUETTE tune: per-icon adjustments for the AUTOMATIC path only (art director's file).
// Hand-composed icons live in _coquette-redraw-*.mjs and the exemplars; this table only
// nudges how auto() dresses a skeleton. Every Live icon (forge/dynamic) goes through
// auto(), so this is where each Live generator gets its family ornament.
//   bow:    false (no bow) | { x, y, s, rot } (exact knot position) | { s } (scale only)
//   orn:    the ornament: 'bow' (corner bow) | 'heart' (a heart clasp on the corner) |
//           'plate' (a tiny bow on the free-text label plate) | null (none: the object
//           already wears pearls, or it is a row of small things)
//   corner: 'tl' | 'tr'  which upper corner the bow prefers
//   scale, dx, dy        object placement on top of the defaults (auto A.SCALE / TX / TY)
//   mat:    body material ('blush' | 'rose' | 'cream' | 'gold' | 'ribbon')
//   remap:  { A: 'K', ... } read a plate as another
//   wk, wl, wa           stroke widths; noFills; fillPlate
//   dotShape: 'star'     dots become soft blush stars (empty rating marks)
//   under:  (k, ctx) => parts painted first (behind the object)
//   extra:  (k, ctx) => parts painted last; ctx = { icon, sk, params } (sk.tf maps a
//           skeleton point to the canvas, sk.s is the scale)
// An entry may be a function of the Live params returning such an object.

// a cream track ring behind a progress arc that has none of its own (track: false)
const creamTrack = (k, { sk }) => {
  const [cx, cy] = sk.tf([12, 12])
  return k.cream(k.ring(cx, cy, 9.5 * sk.s, 1.9), { plate: 'K', ow: 0.4, noShadow: true })
}

export const TUNE = {
  // ---- Live icons: one family ornament each (COQUETTE-GUIDE section 5)
  // badges and stickers: a ribbon-red heart clasp on the corner
  'badge-text': { orn: 'heart' },
  'percent-badge': { orn: 'heart' },
  'sale-sticker': { orn: 'heart' },
  'step-number': { orn: 'heart' },
  // rings: the pearls of the track are the ornament; a bare arc gets a cream track
  'progress-ring': p => p && p.track === false ? { orn: null, under: creamTrack } : { orn: null },
  'timer-ring': { orn: null },
  // a row of stars: no bow on one of them; empty marks are soft blush stars, not specks
  'rating-stars': { orn: null, dotShape: 'star' },
}

export function tuneFor(name, params) {
  const e = TUNE[name]
  const t = typeof e === 'function' ? (e(params || null) || {}) : (e || {})
  return params ? { ...t } : t
}
