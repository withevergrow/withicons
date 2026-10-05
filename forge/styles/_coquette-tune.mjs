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
//   fitText: false       Live text on the object is never set smaller to clear the outline
//   ribbon: [y0, y1]     Live: a cream ribbon across the object (skeleton y), under its text
//   under:  (k, ctx) => parts painted first (behind the object)
//   extra:  (k, ctx) => parts painted last; ctx = { icon, sk, params } (sk.tf maps a
//           skeleton point to the canvas, sk.s is the scale)
// An entry may be a function of the Live params returning such an object.

// a cream track ring behind a progress arc that has none of its own (track: false)
const creamTrack = (k, { sk }) => {
  const [cx, cy] = sk.tf([12, 12])
  return k.cream(k.ring(cx, cy, 9.5 * sk.s, 1.9), { plate: 'K', ow: 0.4, noShadow: true })
}

// Live clocks wear the static clock's dress: a cream dial inside the blush case, pearl hour marks where no hand
// points, ribbon-satin hands and a pearl pivot (painted last, over the automatic drawing of the face). The dial is the
// generator's face: (centre, radius) or a square's half side; the hands its lengths (forge/dynamic/_parts-time.mjs).
const DIALS = {
  'clock-time': p => p && p.shape === 'square' ? { c: [12, 12], sq: 7, r: 7, min: 5.5, hour: 3.5, w: 1.6, marks: true } : { c: [12, 12], r: 7.4, min: 6, hour: 3.5, w: 1.6, marks: true },
  'alarm-clock-time': () => ({ c: [12, 12.5], r: 5.1, min: 4, hour: 2.5, w: 1.5, marks: true }),
  'watch-time': p => p && p.shape === 'square' ? { c: [12, 12], sq: 4.7, r: 4.7, min: 3.75, hour: 2.25, w: 1.3 } : { c: [12, 12], r: 4.7, min: 3.5, hour: 2.25, w: 1.3 },
}
const dial = name => (k, { icon, sk, params }) => {
  const D = DIALS[name](params)
  const [cx, cy] = sk.tf(D.c), s = sk.s, r = D.r * s
  // the hands are the skeleton's own (A-plate segments through the pivot), so they are the moving part
  const segDist = (q, u, v) => { const dx = v[0] - u[0], dy = v[1] - u[1], L = dx * dx + dy * dy, t = L ? Math.max(0, Math.min(1, ((q[0] - u[0]) * dx + (q[1] - u[1]) * dy) / L)) : 0; return Math.hypot(q[0] - u[0] - t * dx, q[1] - u[1] - t * dy) }
  const hands = (icon.lines || []).filter(l => l.plate === 'A' && !l.closed && l.pts.length === 2 && segDist(D.c, l.pts[0], l.pts[1]) < 0.3)
  const tips = hands.flatMap(l => l.pts).filter(q => Math.hypot(q[0] - D.c[0], q[1] - D.c[1]) > 1.6)
  const angle = q => (Math.atan2(q[0] - D.c[0], D.c[1] - q[1]) * 180 / Math.PI + 360) % 360
  const at = (a, L) => [cx + L * s * Math.sin(a * Math.PI / 180), cy - L * s * Math.cos(a * Math.PI / 180)]
  const face = D.sq ? k.rr(cx - D.sq * s, cy - D.sq * s, cx + D.sq * s, cy + D.sq * s, 1.6 * s) : k.disc(cx, cy, r)
  const out = [k.cream(face, { ow: 0.45, noShadow: true })]
  if (D.marks) {
    const near = a => tips.some(q => Math.abs(((angle(q) - a + 540) % 360) - 180) < 28)
    const ms = [0, 90, 180, 270].filter(a => !near(a)).map(a => k.disc(...at(a, D.r - 1.15), 0.6 * s))
    if (ms.length) out.push(k.fill(k.union(...ms), 'c2'))
  }
  if (hands.length) out.push(k.satin(k.union(...hands.map(l => { const [u, v] = [sk.tf(l.pts[0]), sk.tf(l.pts[1])]; return k.seg(u[0], u[1], v[0], v[1], D.w * s) })), { plate: 'A' }))
  out.push(k.pearl(cx, cy, 0.85 * s, { plate: 'A' }))
  return out
}

export const TUNE = {
  'clock-time': { extra: dial('clock-time') },
  'alarm-clock-time': { extra: dial('alarm-clock-time') },
  'watch-time': { extra: dial('watch-time') },
  // ---- Live icons: one family ornament each (COQUETTE-GUIDE section 5)
  // badges and stickers: a ribbon-red heart clasp on the corner
  'badge-text': { orn: 'heart' },
  'percent-badge': { orn: 'heart' },
  // the burst parts for its text: the value stays as drawn, on a cream ribbon tied across the burst (skeleton y;
  // the ribbon is the ornament)
  'sale-sticker': { orn: null, fitText: false, ribbon: [7.75, 16.25] },
  'step-number': { orn: 'heart' },
  // rings: the pearls of the track are the ornament; a bare arc gets a cream track
  'progress-ring': p => p && p.track === false ? { orn: null, under: creamTrack } : { orn: null },
  'timer-ring': { orn: null },
  // a row of stars: no bow on one of them; empty marks are soft blush stars, not specks
  'rating-stars': { orn: null, dotShape: 'star' },
  // a compact sun (beside its temperature) is too small to wear a bow: the bow is tied on the temperature's plate
  'weather': p => p && p.condition === 'sunny' && p.showTemperature !== false ? { orn: 'plate' } : null,
}

export function tuneFor(name, params) {
  const e = TUNE[name]
  const t = typeof e === 'function' ? (e(params || null) || {}) : (e || {})
  return params ? { ...t } : t
}
