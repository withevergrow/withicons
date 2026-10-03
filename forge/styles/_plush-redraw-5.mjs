// PLUSH redraws, chunk 5: hand-composed stuffed-toy icons (see forge/styles/PLUSH-GUIDE.md).
// Each entry: name -> (icon, P) => pieces, built with the frozen kit (P = prim + kit + P.auto()).
// The art director's exemplars (EXEMPLAR in _plush-render.mjs) win over any entry here.
//
// Chunk 5 = icons 401-500 alphabetically (smartphone .. zoom-out). star, trash and user are
// exemplars and are not redefined. Family rules kept from the exemplars: arrows tomato, checks
// mint, people a sunflower head over sky shoulders, locks a sky shackle on a sunflower body,
// search a tomato ring round sky glass on a sunflower handle, square/circle buttons a felt
// cushion with a cream glyph sewn on.

// ---------------------------------------------------------------------------
// local helpers (the kit is frozen; everything chunk-specific lives here)

const SOFT = { stitch: false, out: 0.5 }                       // small sewn-on parts
const DECO = { part: 'deco', stitch: false, out: 0.5 }          // floating decorations
const STEAM = { part: 'A', stitch: false, out: 0.5 }            // steam / sparkles that Line animates as A
const rad = d => d * Math.PI / 180
const pt = (cx, cy, r, deg) => [cx + r * Math.cos(rad(deg)), cy + r * Math.sin(rad(deg))]
const wave = (P, d) => P.linesOf(d)[0]
// a cream plus / minus / x sewn onto a cushion, as one soft felt glyph
const plusF = (P, cx, cy, s = 5.5, w = 2.8) => P.fillet(P.unite(P.seg(cx - s, cy, cx + s, cy, w), P.seg(cx, cy - s, cx, cy + s, w)), 0.5)
const minusF = (P, cx, cy, s = 5.5, w = 2.8) => P.seg(cx - s, cy, cx + s, cy, w)
const xF = (P, cx, cy, s = 4, w = 2.8) => P.fillet(P.unite(P.seg(cx - s, cy - s, cx + s, cy + s, w), P.seg(cx + s, cy - s, cx - s, cy + s, w)), 0.5)
// a person in the user family (sunflower head over sky shoulders), shrunk to sit left of a badge
// (local build of the family part: a 0.8u neck gap and a taller, wider shoulder dome so the head sits on it)
function personL(P, cx, top, k, head = 'c2', body = 'c3', part = 'K') {
  const r = 3.9 * k, hy = top + r, y0 = hy + r + 0.8 * k, bot = Math.min(21.25, y0 + 8.2 * k)
  const sh = P.round(P.clip(P.ellipse(cx, y0 + 8.2 * k, 8.6 * k, 8.2 * k), P.rect(0, 0, 24, bot)), 1.2)
  return [P.felt(body, sh, { part }), P.felt(head, P.circle(cx, hy, r), { part })]
}
const PERSON = (P, cx = 10.25, top = 2.25, k = 1) => personL(P, cx, top, k)
// rays round a centre: pills from r0 to r1 at the given angles, one panel
const raysF = (P, cx, cy, r0, r1, angles, w = 2.2) => P.unite(...angles.map(a => { const [ax, ay] = pt(cx, cy, r0, a), [bx, by] = pt(cx, cy, r1, a); return P.seg(ax, ay, bx, by, w) }))
// a tomato digit "2" path for sub/superscript, top-left at (x, y)
const two = (x, y) => `M${x} ${y + 1.5} C${x + 0.25} ${y - 0.5} ${x + 3.75} ${y - 0.5} ${x + 3.75} ${y + 1.5} C${x + 3.75} ${y + 3} ${x} ${y + 4.5} ${x} ${y + 6.25} L${x + 4} ${y + 6.25}`
// the search-family lens (tomato ring, sky glass, sunflower handle), centred (cx, cy)
function lens(P, cx = 10.25, cy = 10.25, r = 5.25, o = {}) {
  const h = o.handle ?? 4.75
  return [
    P.tube('c2', [[cx + r * 0.95, cy + r * 0.95], [cx + r * 0.95 + h, cy + r * 0.95 + h]], 3.25, { part: o.hpart || 'A' }),
    P.felt('c3', P.circle(cx, cy, r), { part: o.part || 'K', stitch: false, pinch: false }),
    P.felt('c1', P.ring(cx, cy, r + 2.15, r - 0.4), { part: o.part || 'K', stitch: false }),
  ]
}

// a mitten hand (thumbs up), flipped for thumbs down: sunflower hand, sky cuff, knuckle threads
function thumb(P, down) {
  const f = F => down ? P.flipY(F, 12) : F
  const ys = down ? [10, 6.5] : [14, 17.5]
  return [
    P.felt('c2', f(P.fillet(P.unite(P.rr(7.25, 10, 20.75, 21.25, [1.25, 2.75, 2.75, 1.25]), P.seg(10.75, 11.5, 13.5, 4.25, 4.6)), 1.4)), { part: 'K' }),
    P.thread(ys.map(y => [[15.25, y], [20, y]]), { w: 1, op: 0.6, part: 'K' }),
    P.felt('c3', f(P.rr(2.5, 10, 7.75, 21.25, 1.75)), { part: 'A', stitch: false }),
  ]
}

// a stadium (chain link) centre line: straight length len, end radius r, rotated deg
function stadium(cx, cy, len, r, deg) {
  const out = [], h = len / 2
  for (let i = 0; i <= 12; i++) { const a = -90 + 180 * i / 12; out.push([h + r * Math.cos(rad(a)), r * Math.sin(rad(a))]) }
  for (let i = 0; i <= 12; i++) { const a = 90 + 180 * i / 12; out.push([-h + r * Math.cos(rad(a)), r * Math.sin(rad(a))]) }
  const c = Math.cos(rad(deg)), s = Math.sin(rad(deg))
  return out.map(([x, y]) => [cx + x * c - y * s, cy + x * s + y * c])
}
// a trend line: zig-zag plus a rounded arrowhead as one panel (down = tomato, mirrored)
function trend(P, down) {
  const f = F => down ? P.flipY(F, 12) : F
  const line = [[2.5, 17.75], [8.75, 11.5], [12.75, 15.5], [18, 10.25]]
  const head = P.poly([[21.75, 5.5], [21.25, 13.5], [13.75, 6]], [1.3, 0.8, 0.8])
  const seam = down ? line.map(([x, y]) => [x, 24 - y]) : line
  const role = down ? 'c1' : 'c4'
  // the head is its own sewn-on piece (A) so the head-nudge motion survives
  return [
    P.felt(role, f(P.bar(line, 3)), { part: 'K', seam: [seam.slice(0, 3).concat([[16, down ? 12.75 : 11.25]])] }),
    P.felt(role, f(head), { part: 'A', stitch: false, out: 0.55 }),
  ]
}

// a tomato camcorder with a sky lens horn and a sunflower record light
const vcam = (P, body = 'c1', horn = 'c3') => [
  P.felt(horn, P.poly([[14, 12], [22.25, 6.75], [22.25, 17.25]], [0.8, 1.3, 1.3]), { part: 'A', stitch: false }),
  P.felt(body, P.rr(1.75, 5.25, 16.25, 18.75, 2.75), { part: 'K' }),
  P.knot(5.4, 8.9, 1.05, 'c2', { part: 'K' }),
]
// a sky speaker cone (box + horn as one panel)
const cone = P => [
  P.felt('c3', P.poly([[2.5, 8.75], [7, 8.75], [12.75, 3.5], [12.75, 20.5], [7, 15.25], [2.5, 15.25]], [1.1, 0.6, 1.2, 1.2, 0.6, 1.1]), { part: 'K', stitch: false }),
]
// the wifi rainbow
const wifi = P => [
  P.arcTube('c3', 12, 19.75, 12, -137, -43, 2.6, { part: 'K', stitch: false }),
  P.arcTube('c4', 12, 19.75, 8, -135, -45, 2.6, { part: 'K', stitch: false }),
  P.arcTube('c2', 12, 19.75, 4, -130, -50, 2.6, { part: 'K', stitch: false }),
  P.felt('c1', P.circle(12, 19.5, 1.9), { part: 'A', stitch: false, out: 0.5 }),
]

export const R = {
  // ---------------------------------------------------------------- s
  // a sky phone, a cream screen with a glint, a cream home button
  smartphone: (icon, P) => [
    P.felt('c3', P.rr(5.75, 2, 18.25, 22, 3), { part: 'K', stitch: false }),
    P.felt('tint', P.rr(7.75, 4.25, 16.25, 16.75, 1.4), { part: 'K', stitchMin: 1.2, inset: 0.75 }),
    P.thread([[9.75, 9], [12, 6.75]], { w: 1, role: 'c3', op: 0.55, part: 'K' }),
    ...P.button(12, 19.4, 1.2, 'tint', { part: 'A' }),
  ],
  // a sunflower smiley cushion: knot eyes, an embroidered grin, bubblegum cheeks
  smile: (icon, P) => [
    P.felt('c2', P.circle(12, 12, 9.75), { part: 'K' }),
    P.flat('accent', P.unite(P.ellipse(6.9, 14, 1.5, 1.05), P.ellipse(17.1, 14, 1.5, 1.05)), { part: 'K', op: 0.85 }),
    ...P.smile(12, 14, 6, { part: 'A', w: 1.15, eye: 0.95 }),
  ],
  // a sky snowflake: six stuffed arms with little branches, a cream button at the heart
  snowflake: (icon, P) => {
    const arms = [], A = [-90, -30, 30, 90, 150, 210]
    for (const a of A) {
      const [bx, by] = pt(12, 12, 5.75, a), [l, r] = [pt(bx, by, 3, a - 50), pt(bx, by, 3, a + 50)]
      arms.push(P.seg(12, 12, ...pt(12, 12, 9.75, a), 2.5), P.bar([l, [bx, by], r], 2.1))
    }
    return [
      P.felt('c3', P.fillet(P.unite(...arms), 0.5), { part: 'K', stitch: false, pinch: false }),
      ...P.button(12, 12, 2.4, 'tint', { part: 'A' }),
    ]
  },
  // a tomato sofa with sky back cushions, tufted with knots, a sunflower seat
  sofa: (icon, P) => [
    P.tube('c3', [[5.5, 18.5], [5.5, 21]], 1.9, { part: 'K', ...SOFT }),
    P.tube('c3', [[18.5, 18.5], [18.5, 21]], 1.9, { part: 'K', ...SOFT }),
    P.felt('c3', P.rr(4.75, 4.25, 19.25, 13.75, 3), { part: 'K' }),
    P.knot(9.5, 8.75, 0.7, 'ink', { part: 'K' }), P.knot(14.5, 8.75, 0.7, 'ink', { part: 'K' }),
    P.felt('c2', P.pill(5.5, 11.25, 18.5, 15.25), { part: 'A', stitch: false }),
    P.felt('c1', P.fillet(P.unite(P.rr(1.75, 9.5, 7, 19.25, 2.6), P.rr(17, 9.5, 22.25, 19.25, 2.6), P.rr(5, 14.5, 19, 19.25, 1)), 0.7), { part: 'K' }),
  ],
  // a tomato down arrow beside three toy-box bars, longest first
  sort: (icon, P) => [
    P.arrow(6.75, 3, 6.75, 21, { len: 6.5, half: 4.6, w: 3, r: 1.3, role: 'c1', part: 'K' }),
    P.tube('c3', [[14, 5], [20.5, 5]], 3, { part: 'A' }),
    P.tube('c4', [[14, 11.5], [18.75, 11.5]], 3, { part: 'A', stitch: false }),
    P.tube('c2', [[14, 18], [16.75, 18]], 3, { part: 'A', stitch: false }),
  ],
  // a tomato bowl brimming with sunflower soup, three curls of cream steam
  soup: (icon, P) => [
    P.felt('c1', P.pill(8.5, 18.75, 15.5, 21.5), { part: 'K', stitch: false }),
    P.felt('c1', P.round(P.clip(P.ellipse(12, 11.75, 9.25, 8.75), P.rect(0, 12, 24, 24)), 1), { part: 'K' }),
    P.felt('c2', P.pill(2, 10.75, 22, 14), { part: 'K', stitchMin: 1.2, inset: 0.75 }),
    P.tube('tint', wave(P, 'M7.75 8.25 C6.25 7 9.25 5.5 7.75 3.5'), 1.7, STEAM),
    P.tube('tint', wave(P, 'M12 8.25 C10.5 7 13.5 5.5 12 3.5'), 1.7, STEAM),
    P.tube('tint', wave(P, 'M16.25 8.25 C14.75 7 17.75 5.5 16.25 3.5'), 1.7, STEAM),
  ],
  // a big sunflower twinkle with two little sparkles (bubblegum and sky)
  sparkles: (icon, P) => [
    P.felt('c2', P.poly(P.starPts(9.75, 13.75, 8.75, 2.75, 4), [1.1, 0.7]), { part: 'K' }),
    P.felt('accent', P.poly(P.starPts(18.25, 5.5, 3.9, 1.35, 4), [0.6, 0.4]), STEAM),
    P.felt('c3', P.poly(P.starPts(18.75, 17.75, 3.1, 1.15, 4), [0.5, 0.35]), STEAM),
  ],
  // a sky speaker box, a cream woofer with a tomato cone, a cream tweeter
  speaker: (icon, P) => [
    P.felt('c3', P.rr(4.75, 2, 19.25, 22, 3), { part: 'K', stitch: false }),
    P.felt('tint', P.circle(12, 14.75, 4.6), { part: 'K', stitch: false }),
    ...P.button(12, 14.75, 2.3, 'c1', { part: 'A' }),
    P.felt('tint', P.circle(12, 6.6, 1.9), { part: 'K', stitch: false, out: 0.5, shade: false }),
  ],
  // a mint sprout, two puffy leaves, in a little tomato pot
  sprout: (icon, P) => [
    P.tube('c4', [[12, 17], [12, 9.5]], 2.3, { part: 'K', ...SOFT }),
    P.felt('c4', P.lens(12.25, 11.25, 3.25, 5.25, 3.4), { part: 'A', stitch: 'seam', seam: [[[11.25, 10.75], [5, 6.25]]] }),
    P.felt('c4', P.lens(11.75, 9.75, 20.75, 4.25, 3.8), { part: 'A', stitch: 'seam', seam: [[[13, 9.25], [19.25, 5.25]]] }),
    P.felt('c1', P.rr(7.5, 15.25, 16.5, 21.5, [1, 1, 2.75, 2.75]), { part: 'K', stitch: false }),
    P.felt('c1', P.pill(6.5, 14.25, 17.5, 17), { part: 'K', stitch: false }),
  ],
  // sky cushion, cream minus sewn on
  'square-minus': (icon, P) => [
    P.felt('c3', P.rr(3, 3, 21, 21, 3.5), { part: 'K' }),
    P.felt('tint', minusF(P, 12, 12), { part: 'A', ...SOFT }),
  ],
  // sky cushion, cream plus sewn on
  'square-plus': (icon, P) => [
    P.felt('c3', P.rr(3, 3, 21, 21, 3.5), { part: 'K' }),
    P.felt('tint', plusF(P, 12, 12), { part: 'A', ...SOFT }),
  ],
  // tomato cushion, cream x sewn on
  'square-x': (icon, P) => [
    P.felt('c1', P.rr(3, 3, 21, 21, 3.5), { part: 'K' }),
    P.felt('tint', xF(P, 12, 12), { part: 'A', ...SOFT }),
  ],
  // a sky square cushion (the outlined-geometry family); stop stays tomato and smaller
  square: (icon, P) => [P.felt('c3', P.rr(3, 3, 21, 21, 3.5), { part: 'K' })],
  // a star half sewn in sunflower, half left as cream felt
  'star-half': (icon, P) => {
    const s = P.poly(P.starPts(12, 12.75, 10.5, 5.4, 5), [1.3, 0.9])
    return [
      P.felt('tint', s, { part: 'K' }),
      P.felt('c2', P.clip(s, P.rect(0, 0, 12, 24)), { part: 'A', stitch: false, out: 0.45 }),
    ]
  },
  // a sky tube stethoscope with sunflower earpieces and a tomato chest piece
  stethoscope: (icon, P) => [
    P.tube('c3', [[5.25, 3.5], [5.25, 8.5], ...P.arcPts(9.5, 8.5, 4.25, 180, 0, 6), [13.75, 8.5], [13.75, 3.5]], 2.3, { part: 'K', stitch: false }),
    P.tube('c3', wave(P, 'M9.5 12.75 C9.5 21.5 17.75 21.5 17.75 16.5'), 2.3, { part: 'K', stitch: false }),
    P.felt('c2', P.circle(5.25, 3.25, 1.5), { part: 'A', ...SOFT }), P.felt('c2', P.circle(13.75, 3.25, 1.5), { part: 'A', ...SOFT }),
    P.felt('c1', P.circle(17.75, 13.5, 3.5), { part: 'A', stitch: false }),
    P.knot(17.75, 13.5, 1.1, 'tint', { part: 'A' }),
  ],
  // a sunflower sticky note, its corner peeling up in bubblegum, scribbled lines
  'sticky-note': (icon, P) => [
    P.felt('c2', P.round(P.cut(P.rr(3, 3, 21, 21, 2.5), P.poly([[13.5, 22.5], [22.5, 13.5], [26, 26]])), 1), { part: 'K' }),
    P.felt('accent', P.poly([[14.5, 21.25], [21.25, 14.5], [14.5, 14.5]], 1), { part: 'A', stitch: false, out: 0.5 }),
    P.thread([[[7, 8], [17, 8]], [[7, 11.75], [12.5, 11.75]]], { w: 1.15, op: 0.75, part: 'K' }),
  ],
  // a tomato stop cushion, plain and huggable
  stop: (icon, P) => [P.felt('c1', P.rr(4.5, 4.5, 19.5, 19.5, 3.5), { part: 'K' })],
  // a sunflower shop with a striped tomato-and-cream awning, a sky door
  store: (icon, P) => {
    const awn = P.fillet(P.unite(P.rr(2.5, 3, 21.5, 9.25, 1.6), ...[4.875, 9.625, 14.375, 19.125].map(x => P.circle(x, 9.5, 2.4))), 0.5)
    return [
      P.felt('c2', P.rr(4, 9, 20, 21.25, [0, 0, 2.25, 2.25]), { part: 'K' }),
      P.felt('c3', P.rr(9.75, 14, 14.25, 21.25, [2.25, 2.25, 0, 0]), { part: 'A', stitch: false }),
      P.knot(13.1, 17.75, 0.5, 'ink', { part: 'A' }),
      P.felt('c1', awn, { part: 'K', stitch: false }),
      P.felt('tint', P.clip(awn, P.unite(P.rect(7.25, 0, 12, 24), P.rect(16.75, 0, 21.5, 24))), { part: 'K', line: false, stitch: false, pinch: false, shade: false }),
      P.thread([[2.75, 5.5], [21.25, 5.5]], { w: 0.5, op: 0.5, part: 'K' }),
    ]
  },
  // a sky stuffed S, a tomato bar struck through it
  strikethrough: (icon, P) => [
    P.tube('c3', wave(P, 'M16.75 6.5 C15.5 3.75 7.75 3.75 7.75 7.75 C7.75 11.5 16.25 11 16.25 15.75 C16.25 20.25 8.5 20.5 7 17.5'), 3, { part: 'K', stitch: false }),
    P.moat(P.seg(3.25, 12, 20.75, 12, 2.6), 0.7),
    P.tube('c1', [[3.25, 12], [20.75, 12]], 2.6, { part: 'A', stitch: false }),
  ],
  // a sky stuffed X and a little tomato 2 below
  subscript: (icon, P) => [
    P.felt('c3', P.fillet(P.unite(P.seg(3.5, 5, 13.5, 17, 3.2), P.seg(13.5, 5, 3.5, 17, 3.2)), 0.6), { part: 'K', stitch: false }),
    P.tube('c1', wave(P, two(16.75, 14.25)), 2.1, { part: 'A', stitch: false }),
  ],
  // a sunflower sun with tomato rays on its left, a sky moon on its right half
  'sun-moon': (icon, P) => [
    P.felt('c1', raysF(P, 12, 12, 8.25, 10.5, [90, 135, 180, 225, 270], 2.2), { part: 'deco', stitch: false, out: 0.5 }),
    P.felt('c2', P.circle(12, 12, 6.25), { part: 'K' }),
    P.felt('c3', P.round(P.half(12, 12, 6.25, 'e'), 0.5), { part: 'A', stitch: false }),
    P.knot(14.75, 10, 0.6, 'tint', { part: 'A' }), P.knot(15.5, 14, 0.5, 'tint', { part: 'A' }),
  ],
  // a sunflower sun cushion with eight tomato rays
  sun: (icon, P) => [
    P.felt('c1', raysF(P, 12, 12, 7.75, 10.25, [0, 45, 90, 135, 180, 225, 270, 315], 2.3), STEAM),
    P.felt('c2', P.circle(12, 12, 5.75), { part: 'K' }),
    P.thread(P.arcPts(12, 12, 3.5, 195, 255, 10), { w: 1.1, role: 'shine', op: 0.9, part: 'K' }),
  ],
  // a sunflower half sun on a sky horizon, tomato rays, a tomato arrow rising
  sunrise: (icon, P) => [
    P.felt('c1', raysF(P, 12, 17.5, 7.5, 9.75, [190, 230, 310, 350], 2.1), STEAM),
    P.felt('c2', P.round(P.half(12, 18, 5.75, 'n'), 0.9), { part: 'K', stitch: false }),
    P.tube('c3', [[2.75, 18.5], [21.25, 18.5]], 2.7, { part: 'K' }),
    P.arrow(12, 10.25, 12, 2, { len: 4.5, half: 3.9, w: 2.4, r: 1, rb: 0.6, role: 'c1', part: 'S' }),
  ],
  // a sunflower half sun on a sky horizon, tomato rays, a tomato arrow setting
  sunset: (icon, P) => [
    P.felt('c1', raysF(P, 12, 17.5, 7.5, 9.75, [190, 230, 310, 350], 2.1), STEAM),
    P.felt('c2', P.round(P.half(12, 18, 5.75, 'n'), 0.9), { part: 'K', stitch: false }),
    P.tube('c3', [[2.75, 18.5], [21.25, 18.5]], 2.7, { part: 'K' }),
    P.arrow(12, 2, 12, 10.25, { len: 4.5, half: 3.9, w: 2.4, r: 1, rb: 0.6, role: 'c1', part: 'S' }),
  ],
  // ---------------------------------------------------------------- su..tr
  // a sky stuffed X with a little tomato 2 up top
  superscript: (icon, P) => [
    P.felt('c3', P.fillet(P.unite(P.seg(3.5, 8, 13.5, 20, 3.2), P.seg(13.5, 8, 3.5, 20, 3.2)), 0.6), { part: 'K', stitch: false }),
    P.tube('c1', wave(P, two(16.75, 2.5)), 2.1, { part: 'A', stitch: false }),
  ],
  // a tomato arrow going right over a sky arrow coming back
  swap: (icon, P) => [
    P.arrow(3, 7.25, 21, 7.25, { len: 5.75, half: 4.4, w: 2.9, r: 1.2, rb: 0.6, role: 'c1', part: 'K' }),
    P.arrow(21, 16.75, 3, 16.75, { len: 5.75, half: 4.4, w: 2.9, r: 1.2, rb: 0.6, role: 'c3', part: 'A' }),
  ],
  // a cream syringe barrel half full of tomato medicine, sky plunger and hub, tilted
  syringe: (icon, P) => {
    const r = f => P.rot(f, 45, 12, 12)
    return [
      P.felt('c3', r(P.seg(12, 18.5, 12, 23, 1.1)), { part: 'A', stitch: false, out: 0.4, shade: false, hi: false }),
      P.felt('c3', r(P.unite(P.seg(12, 2.5, 12, 6.5, 1.9), P.pill(8.75, 1, 15.25, 3.25))), { part: 'A', stitch: false, out: 0.5 }),
      P.felt('c3', r(P.rr(10.5, 16.25, 13.5, 19.25, 0.8)), { part: 'K', stitch: false, out: 0.5 }),
      P.felt('tint', r(P.rr(8.75, 6, 15.25, 17.25, 1.75)), { part: 'K', stitch: false }),
      P.felt('c1', r(P.rr(8.75, 11.25, 15.25, 17.25, [0.5, 0.5, 1.75, 1.75])), { part: 'K', stitch: false, out: 0.45 }),
      P.felt('c3', r(P.pill(7.25, 5.25, 16.75, 7.5)), { part: 'K', stitch: false, out: 0.5 }),
      P.thread([[[8.95, 12.1], [10.4, 10.65]], [[7.4, 10.55], [8.85, 9.1]]], { w: 0.7, op: 0.7, part: 'K' }),
    ]
  },
  // a cream table sheet with a tomato header row, embroidered grid lines
  table: (icon, P) => {
    const body = P.rr(2.75, 3, 21.25, 21, 2.5)
    return [
      P.felt('tint', body, { part: 'K', inset: 0.85 }),
      P.felt('c1', P.clip(body, P.rect(0, 0, 24, 8.5)), { part: 'K', stitch: false, out: 0.5 }),
      P.thread([[[9, 9.25], [9, 19.75]], [[15, 9.25], [15, 19.75]], [[4, 13.25], [20, 13.25]], [[4, 17], [20, 17]]], { w: 0.9, op: 0.7, part: 'K' }),
    ]
  },
  // a tomato tablet, a cream screen, a cream home button
  tablet: (icon, P) => [
    P.felt('c1', P.rr(3.75, 2.25, 20.25, 21.75, 3), { part: 'K', stitch: false }),
    P.felt('tint', P.rr(6, 4.5, 18, 17, 1.5), { part: 'K', stitchMin: 1.2, inset: 0.8 }),
    P.thread([[8.25, 10], [11, 7.25]], { w: 1, role: 'c1', op: 0.5, part: 'K' }),
    ...P.button(12, 19.4, 1.2, 'tint', { part: 'A' }),
  ],
  // a sunflower price tag with a cream eyelet and a bubblegum heart
  tag: (icon, P) => [
    P.felt('c2', P.poly([[2.75, 2.75], [11.75, 2.75], [21.25, 12.25], [12.25, 21.25], [2.75, 11.75]], [2.25, 1.4, 2.5, 2.5, 1.4]), { part: 'K' }),
    P.felt('tint', P.circle(7.6, 7.6, 1.7), { part: 'A', ...SOFT }),
    P.knot(7.6, 7.6, 0.7, 'ink', { part: 'A' }),
    P.felt('accent', P.heart(13.25, 13.5, 0.34), { part: 'K', ...SOFT }),
  ],
  // a tomato bullseye of felt rings, a sunflower button dead centre
  target: (icon, P) => [
    P.felt('c1', P.circle(12, 12, 9.75), { part: 'K' }),
    P.felt('tint', P.circle(12, 12, 6.5), { part: 'K', stitch: false }),
    P.felt('c1', P.circle(12, 12, 3.75), { part: 'K', stitch: false, out: 0.5 }),
    ...P.button(12, 12, 1.6, 'c2', { part: 'A' }),
  ],
  // a sunflower cab with a tomato roof sign, checker stitches, sky wheels
  taxi: (icon, P) => [
    P.felt('c1', P.pill(9.25, 3.25, 14.75, 6.5), { part: 'A', stitch: false, out: 0.5 }),
    P.felt('c2', P.fillet(P.unite(P.rr(1.75, 11, 22.25, 18.5, 2.5), P.rr(5.75, 6, 18.25, 13, [2.75, 2.75, 0, 0])), 1), { part: 'K', stitch: false }),
    P.felt('tint', P.rr(7.5, 7.75, 11.4, 11.25, [1.4, 0.4, 0.4, 0.4]), { part: 'K', stitch: false, out: 0.4, shade: false }),
    P.felt('tint', P.rr(12.6, 7.75, 16.5, 11.25, [0.4, 1.4, 0.4, 0.4]), { part: 'K', stitch: false, out: 0.4, shade: false }),
    P.flat('ink', P.unite(...[4.5, 7.5, 10.5, 13.5, 16.5, 19.5].map((x, i) => P.rect(x - 0.75, i % 2 ? 13 : 14.5, x + 0.75, i % 2 ? 14.5 : 16))), { part: 'K', op: 0.7 }),
    P.felt('c3', P.circle(7, 18.5, 2.6), { part: 'A', stitch: false }),
    P.felt('c3', P.circle(17, 18.5, 2.6), { part: 'A', stitch: false }),
    P.knot(7, 18.5, 0.85, 'tint', { part: 'A' }), P.knot(17, 18.5, 0.85, 'tint', { part: 'A' }),
  ],
  // a sky telescope barrel with a tomato lens cap on a sunflower tripod
  telescope: (icon, P) => [
    P.tube('c2', [[11.75, 12.5], [7.75, 21.25]], 2.2, { part: 'K', ...SOFT }),
    P.tube('c2', [[12.25, 12.5], [16.25, 21.25]], 2.2, { part: 'K', ...SOFT }),
    P.felt('c3', P.seg(6, 13.25, 17.75, 6.75, 4.5), { part: 'A', stitch: 'seam', seam: [[[7.25, 12.6], [16.5, 7.4]]] }),
    P.felt('c1', P.seg(17.25, 7, 20.25, 5.3, 5.75), { part: 'A', stitch: false }),
    P.felt('c2', P.seg(2.75, 15.25, 5, 14, 2.6), { part: 'A', stitch: false, out: 0.5 }),
    P.knot(12, 12.25, 0.9, 'ink', { part: 'K' }),
  ],
  // a tomato racket with a cross-stitched cream net, sky grip, a sunflower ball
  tennis: (icon, P) => {
    const c = 9.5, r = 3.9, L = []
    for (const d of [-2.4, 0, 2.4]) { const h = Math.sqrt(r * r - d * d); L.push([[c - h, c + d], [c + h, c + d]], [[c + d, c - h], [c + d, c + h]]) }
    return [
      P.tube('c3', [[13.75, 13.75], [20.25, 20.25]], 3, { part: 'A' }),
      P.felt('c1', P.circle(c, c, 6.9), { part: 'K', stitch: false }),
      P.felt('tint', P.circle(c, c, 4.6), { part: 'K', stitch: false, out: 0.45, shade: false }),
      P.thread(L, { w: 0.55, op: 0.65, part: 'K' }),
      P.felt('c2', P.circle(19.25, 4.75, 2.75), { part: 'deco', stitch: false, out: 0.5 }),
      P.thread(P.arcPts(21.75, 2.25, 2.9, 110, 175, 8), { w: 0.6, role: 'tint', part: 'deco' }),
    ]
  },
  // a mint tent with a cream doorway, sunflower poles crossing at the peak
  tent: (icon, P) => [
    P.tube('c2', [[9.75, 1.75], [13, 5.25]], 1.7, { part: 'A', ...SOFT }),
    P.tube('c2', [[14.25, 1.75], [11, 5.25]], 1.7, { part: 'A', ...SOFT }),
    P.felt('c4', P.poly([[12, 3.5], [21.75, 20.75], [2.25, 20.75]], [1.7, 1.5, 1.5]), { part: 'K' }),
    P.felt('tint', P.poly([[12, 10.75], [16.25, 20.75], [7.75, 20.75]], [0.9, 0.4, 0.4]), { part: 'A', stitch: false, out: 0.5 }),
    P.thread([[12, 11.25], [12, 20.25]], { w: 0.7, op: 0.6, part: 'A' }),
  ],
  // a sky console with a cream prompt and cursor sewn on
  terminal: (icon, P) => [
    P.felt('c3', P.rr(2.25, 3.25, 21.75, 20.75, 2.75), { part: 'K' }),
    P.tube('tint', [[6.75, 8.75], [10.25, 12], [6.75, 15.25]], 2.3, { part: 'A', ...SOFT }),
    P.tube('tint', [[12.75, 15.5], [17.25, 15.5]], 2.3, { part: 'A', ...SOFT }),
  ],
  // a sky input field with a line of cream text and a sunflower I-beam cursor
  'text-cursor-input': (icon, P) => {
    const beam = P.fillet(P.unite(P.seg(15.5, 4.25, 15.5, 19.75, 2.3), P.pill(12.75, 3, 18.25, 5.5), P.pill(12.75, 18.5, 18.25, 21)), 0.5)
    return [
      P.felt('c3', P.rr(2, 7, 22, 17, 2.75), { part: 'K', stitch: false }),
      P.thread([[5.5, 12], [10.5, 12]], { w: 1.3, role: 'edge', part: 'K' }),
      P.moat(beam, 0.75),
      P.felt('c2', beam, { part: 'A', stitch: false }),
    ]
  },
  // a cream thermometer with a tomato reading, sky tick marks
  thermometer: (icon, P) => [
    P.felt('tint', P.fillet(P.unite(P.pill(8.75, 2.25, 15.25, 16), P.circle(12, 17.25, 4.5)), 0.8), { part: 'K', stitch: false }),
    P.felt('c1', P.unite(P.seg(12, 8.25, 12, 17, 2.2), P.circle(12, 17.25, 2.6)), { part: 'A', stitch: false, out: 0.45 }),
    P.tube('c3', [[17.75, 5], [20.75, 5]], 1.8, { part: 'deco', ...SOFT }),
    P.tube('c3', [[17.75, 8.5], [20, 8.5]], 1.8, { part: 'deco', ...SOFT }),
    P.tube('c3', [[17.75, 12], [20.75, 12]], 1.8, { part: 'deco', ...SOFT }),
  ],
  // a sunflower mitten hand, thumb down, a sky cuff
  'thumbs-down': (icon, P) => thumb(P, true),
  // a sunflower mitten hand, thumb up, a sky cuff
  'thumbs-up': (icon, P) => thumb(P, false),
  // a tomato ticket, notched sides, a perforation stitch and a sunflower star
  ticket: (icon, P) => [
    P.felt('c1', P.round(P.cut(P.rr(1.75, 5.5, 22.25, 18.5, 2.25), P.circle(1.75, 12, 2.6), P.circle(22.25, 12, 2.6)), 0.6), { part: 'K', stitch: false }),
    P.thread([7.25, 9.6, 11.95, 14.3, 16.65].map(y => [[15.5, y], [15.5, y + 0.9]]), { w: 0.9, role: 'edge', part: 'K' }),
    P.felt('c2', P.poly(P.starPts(9, 12, 3.6, 1.7, 5), [0.6, 0.4]), { part: 'A', ...SOFT }),
  ],
  // a tomato stopwatch with a cream face, an embroidered hand, sky crown and pusher
  timer: (icon, P) => [
    P.felt('c3', P.unite(P.seg(12, 3.5, 12, 6, 2), P.pill(9.5, 1.5, 14.5, 4)), { part: 'A', stitch: false, out: 0.5 }),
    P.felt('c3', P.rot(P.pill(16.75, 4.5, 20.25, 6.75), 40, 18.5, 5.6), { part: 'A', stitch: false, out: 0.5 }),
    P.felt('c1', P.circle(12, 13.75, 8), { part: 'K', stitch: false }),
    P.felt('tint', P.circle(12, 13.75, 5.75), { part: 'K', inset: 0.7, stitchMin: 1.2 }),
    P.thread([[12, 13.75], [14.6, 11.15]], { w: 1.3, part: 'K' }),
    P.knot(12, 13.75, 0.85, 'c1', { part: 'K' }),
  ],
  // a mint switch track with a cream button knob slid on
  toggle: (icon, P) => [
    P.felt('c4', P.pill(1.75, 5.75, 22.25, 18.25), { part: 'K', stitch: 'seam', seam: [[[5.5, 12], [10.5, 12]]] }),
    ...P.button(16, 12, 4.4, 'tint', { part: 'A' }),
  ],
  // a sky toilet tank and seat, a cream bowl, a cream flush button
  toilet: (icon, P) => [
    P.felt('c3', P.rr(3.25, 2.25, 10, 13.5, 1.75), { part: 'K', stitch: false }),
    ...P.button(6.6, 5.75, 1.15, 'tint', { part: 'K' }),
    P.felt('tint', P.fillet(P.unite(P.round(P.clip(P.ellipse(12.5, 13.5, 8.5, 6.25), P.rect(0, 13.5, 24, 24)), 1), P.rr(8.25, 17, 14.75, 21.5, 1)), 1), { part: 'K', stitch: false }),
    P.felt('c3', P.pill(3, 11.25, 21.75, 14.5), { part: 'A', stitchMin: 1.2, inset: 0.75 }),
  ],
  // a cream tooth pillow with a glint
  tooth: (icon, P) => [
    P.felt('tint', P.cut(P.fillet(P.unite(P.ellipse(8.5, 8, 5, 5.25), P.ellipse(15.5, 8, 5, 5.25), P.rr(3.75, 7, 20.25, 13, 2), P.seg(7.25, 11, 8.5, 20.25, 3.4), P.seg(16.75, 11, 15.5, 20.25, 3.4)), 1.6), P.ellipse(12, 19.5, 2.4, 3.4)), { part: 'K' }),
    P.thread(P.arcPts(8.5, 8.25, 2.6, 200, 260, 10), { w: 1.1, role: 'c3', op: 0.45, part: 'K' }),
  ],
  // a tomato cone with two cream reflective bands on a sky base
  'traffic-cone': (icon, P) => {
    const cone = P.poly([[12, 2.25], [17.75, 19], [6.25, 19]], [1.5, 0.6, 0.6])
    return [
      P.felt('c1', cone, { part: 'K', stitch: false }),
      P.felt('tint', P.clip(cone, P.unite(P.rect(0, 7.75, 24, 10.25), P.rect(0, 13, 24, 15.5))), { part: 'A', line: false, stitch: false, pinch: false, shade: false }),
      P.felt('c3', P.pill(2.75, 17.75, 21.25, 21.25), { part: 'K', stitchMin: 1.2, inset: 0.75 }),
    ]
  },
  // a sky train face, a cream windscreen, sunflower lamps, tomato rails
  train: (icon, P) => [
    P.tube('c1', [[8.25, 18], [6, 21.5]], 2, { part: 'A', ...SOFT }),
    P.tube('c1', [[15.75, 18], [18, 21.5]], 2, { part: 'A', ...SOFT }),
    P.felt('c3', P.rr(4.75, 2.25, 19.25, 18.75, [4.5, 4.5, 3, 3]), { part: 'K' }),
    P.felt('tint', P.rr(7, 5, 17, 10.75, [2.25, 2.25, 1, 1]), { part: 'K', stitch: false, out: 0.5 }),
    P.thread([[12, 5.4], [12, 10.35]], { w: 0.8, op: 0.7, part: 'K' }),
    P.knot(8.6, 14.75, 1.15, 'c2', { part: 'K' }), P.knot(15.4, 14.75, 1.15, 'c2', { part: 'K' }),
  ],
  // a mint pine of three puffy tiers on a tomato trunk, two felt baubles
  'tree-pine': (icon, P) => [
    P.felt('c1', P.rr(10.6, 17, 13.4, 22, 0.8), { part: 'A', stitch: false, out: 0.5 }),
    P.felt('c4', P.fillet(P.unite(
      P.poly([[12, 1.75], [16.75, 8.75], [7.25, 8.75]], [1.1, 1, 1]),
      P.poly([[12, 5.25], [18.75, 13.5], [5.25, 13.5]], [1.1, 1.1, 1.1]),
      P.poly([[12, 9.5], [20.75, 18.75], [3.25, 18.75]], [1.1, 1.2, 1.2]),
    ), 0.6), { part: 'K' }),
    P.knot(9.25, 15.75, 0.95, 'c1', { part: 'K' }), P.knot(14.5, 11.25, 0.9, 'c2', { part: 'K' }),
  ],
  // ---------------------------------------------------------------- tr..us
  // a tomato zig-zag going down to a rounded arrowhead
  'trending-down': (icon, P) => trend(P, true),
  // a mint zig-zag climbing to a rounded arrowhead
  'trending-up': (icon, P) => trend(P, false),
  // a sky triangle pillow
  triangle: (icon, P) => [P.felt('c3', P.poly([[12, 2.75], [22, 20.25], [2, 20.25]], [2.4, 2.2, 2.2]), { part: 'K' })],
  // a sunflower cup with tube handles, a cream star sewn on, a tomato plinth
  trophy: (icon, P) => [
    P.arcTube('c2', 6.75, 7.75, 2.75, 90, 270, 2.1, { part: 'A', stitch: false, out: 0.5 }),
    P.arcTube('c2', 17.25, 7.75, 2.75, -90, 90, 2.1, { part: 'A', stitch: false, out: 0.5 }),
    P.felt('c2', P.seg(12, 12, 12, 17.5, 2.6), { part: 'K', stitch: false, out: 0.5 }),
    P.felt('c2', P.rr(6.25, 2.5, 17.75, 13.5, [1.25, 1.25, 5.75, 5.75]), { part: 'K' }),
    P.felt('tint', P.poly(P.starPts(12, 7.75, 3, 1.4, 5), [0.5, 0.3]), { part: 'K', ...SOFT }),
    P.felt('c1', P.rr(6.75, 16.75, 17.25, 21.25, 1.75), { part: 'K', stitchMin: 1.2, inset: 0.75 }),
  ],
  // a tomato delivery box with a heart patch, a sky cab, sunflower wheels
  truck: (icon, P) => [
    P.felt('c3', P.poly([[13.5, 8.5], [18.25, 8.5], [22, 12.75], [22, 17.75], [13.5, 17.75]], [1, 1.5, 1.2, 1.4, 0.4]), { part: 'K', stitch: false }),
    P.felt('tint', P.poly([[15.75, 10.25], [17.75, 10.25], [20.25, 13.1], [15.75, 13.1]], [0.6, 0.8, 0.5, 0.5]), { part: 'K', stitch: false, out: 0.4, shade: false }),
    P.felt('c1', P.rr(2, 4.75, 15, 17.75, 2.25), { part: 'K' }),
    P.felt('accent', P.heart(8.5, 11.25, 0.42), { part: 'K', ...SOFT }),
    P.felt('c2', P.circle(6.75, 18.5, 2.6), { part: 'A', stitch: false }),
    P.felt('c2', P.circle(17.5, 18.5, 2.6), { part: 'A', stitch: false }),
    P.knot(6.75, 18.5, 0.85, 'ink', { part: 'A' }), P.knot(17.5, 18.5, 0.85, 'ink', { part: 'A' }),
  ],
  // a mint-shelled toy turtle: sunflower head, feet and tail, cream shell spots, a knot eye
  turtle: (icon, P) => [
    P.felt('c2', P.unite(P.pill(4.75, 14, 8.25, 19.75), P.pill(14.25, 14, 17.75, 19.75), P.seg(3.5, 15, 1.75, 16.25, 1.6)), { part: 'A', ...SOFT, pinch: false }),
    P.felt('c2', P.fillet(P.unite(P.circle(19.5, 11.25, 2.9), P.seg(16, 13.75, 18.75, 12.25, 2.4)), 0.6), { part: 'A', stitch: false, out: 0.5, pinch: false }),
    P.knot(20.4, 10.6, 0.6, 'ink', { part: 'A' }),
    P.felt('c4', P.round(P.clip(P.ellipse(10.75, 15, 8, 9.25), P.rect(0, 0, 24, 15)), 1.1), { part: 'K', stitch: false }),
    P.felt('c4', P.pill(2.25, 13.25, 19.25, 16.5), { part: 'K', stitchMin: 1.2, inset: 0.75 }),
    P.felt('tint', P.unite(P.circle(7.5, 10.75, 1.35), P.circle(11, 8.25, 1.45), P.circle(14.25, 10.75, 1.35)), { part: 'K', stitch: false, out: 0.4, shade: false }),
  ],
  // a sky telly with tomato rabbit-ear antenna, a cream screen, sunflower knobs
  tv: (icon, P) => [
    P.tube('c1', [[7.5, 2.25], [12, 6.75], [16.5, 2.25]], 1.7, { part: 'A', ...SOFT }),
    P.felt('c3', P.rr(2, 6.25, 22, 20.75, 2.75), { part: 'K' }),
    P.felt('tint', P.rr(4.75, 9, 16, 18, 1.75), { part: 'K', stitch: false, out: 0.5 }),
    P.knot(19, 11.25, 1.1, 'c2', { part: 'K' }), P.knot(19, 15, 1.1, 'c2', { part: 'K' }),
  ],
  // a sky stuffed letter T, its seam down the stem
  type: (icon, P) => [
    P.felt('c3', P.fillet(P.unite(P.rr(3.5, 2.75, 20.5, 6.75, 2), P.seg(12, 4, 12, 19.25, 3.4), P.pill(3.5, 2.75, 6.25, 9), P.pill(17.75, 2.75, 20.5, 9)), 0.8), { part: 'K', stitch: 'seam', seam: [[[12, 7.5], [12, 16.75]]] }),
    P.felt('c3', P.pill(8, 18, 16, 21.5), { part: 'A', stitch: false, out: 0.55 }),
  ],
  // a sky umbrella canopy with scalloped hem, a sunflower crook handle
  umbrella: (icon, P) => [
    P.tube('c2', [[12, 11], [12, 18.5], ...P.arcPts(9.75, 18.5, 2.25, 0, 180, 10)], 2.2, { part: 'A', ...SOFT }),
    P.felt('c3', P.cut(P.round(P.clip(P.circle(12, 12.5, 10), P.rect(0, 0, 24, 12.5)), 1), ...[4.5, 9.5, 14.5, 19.5].map(x => P.circle(x, 13.6, 2.5))), { part: 'K', stitch: false }),
    P.thread([[[12, 3.25], [12, 10.25]], [[12, 3.25], [7.5, 10.25]], [[12, 3.25], [16.5, 10.25]]], { w: 0.7, role: 'edge', op: 0.8, part: 'K' }),
    P.knot(12, 2.4, 0.95, 'c1', { part: 'K' }),
  ],
  // a tomato stuffed U resting on a sky underline
  underline: (icon, P) => [
    P.tube('c1', [[6.75, 3], [6.75, 10.5], ...P.arcPts(12, 10.5, 5.25, 180, 0, 6), [17.25, 10.5], [17.25, 3]], 3.1, { part: 'K' }),
    P.tube('c3', [[4.25, 20.5], [19.75, 20.5]], 2.7, { part: 'A', stitch: false }),
  ],
  // a tomato arrow that heads back left and loops round
  undo: (icon, P) => [
    P.felt('c1', P.bar([[7.5, 9.25], [14.5, 9.25], ...P.arcPts(14.5, 14.25, 5, -90, 90, 6), [8.75, 19.25]], 3.1), { part: 'K', seam: [[[9.75, 9.25], [14.5, 9.25], ...P.arcPts(14.5, 14.25, 5, -90, 90, 6), [9.5, 19.25]]] }),
    P.felt('c1', P.poly([[2.5, 9.25], [8.75, 3.5], [8.75, 15]], [1.3, 0.8, 0.8]), { part: 'A', stitch: false, out: 0.55 }),
  ],
  // two broken chain links, tomato and sky, with sunflower sparks between them
  unlink: (icon, P) => [
    P.tube('c1', stadium(7.6, 16.4, 4.25, 2.5, -45), 2.3, { part: 'K', closed: true, stitch: false }),
    P.tube('c3', stadium(16.4, 7.6, 4.25, 2.5, -45), 2.3, { part: 'K', closed: true, stitch: false }),
    P.tube('c2', [[15.5, 16.5], [18.25, 18.75]], 1.7, { part: 'S', stitch: false, out: 0.5 }),
    P.tube('c2', [[5.75, 5.25], [8.5, 7.5]], 1.7, { part: 'S', stitch: false, out: 0.5 }),
  ],
  // the lock family with the sky shackle sprung open
  unlock: (icon, P) => {
    // the lock family's shackle, swung open on its right leg
    const sw = q => q.map(([x, y]) => { const c = Math.cos(rad(24)), n = Math.sin(rad(24)), dx = x - 16.5, dy = y - 11.5; return [16.5 + dx * c - dy * n, 11.5 + dx * n + dy * c] })
    const sh = sw([[7.5, 9.5], ...P.arcPts(12, 8, 4.5, 180, 360), [16.5, 11.5]])
    return [
      P.tube('c3', sh, 2.75, { part: 'A' }),
    P.felt('c2', P.rr(4, 10.25, 20, 21, 3), { part: 'K' }),
    P.felt('accent', P.heart(12, 15.75, 0.42), { part: 'K', stitch: false, out: 0.5 }),
    P.flat('ink', P.unite(P.circle(12, 14.6, 0.8), P.pill(11.55, 14.6, 12.45, 16.9)), { part: 'K', op: 0.9 }),
    ]
  },
  // a sky tray and a tomato arrow lifting out of it
  upload: (icon, P) => {
    const a = P.arrow(12, 16.5, 12, 2.25, { len: 6, half: 5, w: 3.1, r: 1.3, role: 'c1', part: 'A' })
    return [
      P.felt('c3', P.rr(2.75, 12.5, 21.25, 21.25, [1.5, 1.5, 3, 3]), { part: 'K', stitch: false }),
      P.moat(a.F, 0.75),
      a,
    ]
  },
  // the USB trident in sky felt, a tomato bead and a sunflower block on its arms
  usb: (icon, P) => [
    P.felt('c3', P.fillet(P.unite(
      P.seg(12, 6, 12, 18, 2.4),
      P.poly([[12, 1.5], [15.25, 6.5], [8.75, 6.5]], [0.9, 0.7, 0.7]),
      P.bar([[12, 15.5], [6.75, 12.25], [6.75, 10]], 2.1),
      P.bar([[12, 13.25], [17.25, 10.75], [17.25, 9]], 2.1),
      P.circle(12, 19.5, 2.6),
    ), 0.6), { part: 'K', stitch: false }),
    P.felt('c1', P.circle(6.75, 8.5, 2.1), { part: 'A', ...SOFT }),
    P.felt('c2', P.rr(15.1, 5.4, 19.4, 9.7, 0.9), { part: 'A', ...SOFT }),
  ],
  // ---------------------------------------------------------------- user family
  // the person (sunflower head, sky shoulders) with a mint check badge
  'user-check': (icon, P) => [...PERSON(P), ...P.badge('check', 'c4', 17.5, 17.25, 4.4)],
  // a sky disc with a sunflower head and cream shoulders sewn on
  'user-circle': (icon, P) => {
    const disc = P.circle(12, 12, 9.75)
    return [
      P.felt('c3', disc, { part: 'K', stitch: false }),
      P.felt('tint', P.round(P.clip(P.ellipse(12, 21.5, 6.75, 6), P.circle(12, 12, 8.6)), 0.8), { part: 'A', stitch: false, out: 0.5 }),
      P.felt('c2', P.circle(12, 9.6, 3.6), { part: 'A', stitch: false }),
    ]
  },
  // the person with a tomato gear, a cream button hub
  'user-cog': (icon, P) => {
    const g = P.fillet(P.unite(P.around(P.pill(16.3, 11.85, 18.7, 15), 6, 17.5, 17.25), P.circle(17.5, 17.25, 3.75)), 0.5)
    return [...PERSON(P), P.moat(g, 1), P.felt('c1', g, { part: 'S', stitch: false }), P.knot(17.5, 17.25, 1.5, 'tint', { part: 'S' })]
  },
  // the person with a tomato minus badge
  'user-minus': (icon, P) => [...PERSON(P), ...P.badge('minus', 'c1', 17.5, 17.25, 4.4)],
  // the person with a tomato pencil, a cream tip
  'user-pen': (icon, P) => {
    const r = f => P.rot(f, -45, 17, 17.25)
    const body = r(P.rr(14.25, 15.5, 22.75, 19, [0, 1.3, 1.3, 0])), tip = r(P.poly([[10.75, 17.25], [14.5, 15.5], [14.5, 19]], [0.5, 0.25, 0.25]))
    return [...PERSON(P), P.moat(P.unite(body, tip), 0.9),
      P.felt('tint', tip, { part: 'S', stitch: false, out: 0.45 }),
      P.felt('c1', body, { part: 'S', stitch: false }),
      P.knot(...pt(17, 17.25, 5.6, 135), 0.55, 'ink', { part: 'S' })]
  },
  // the person with a mint plus badge
  'user-plus': (icon, P) => [...PERSON(P), ...P.badge('plus', 'c4', 17.5, 17.25, 4.4)],
  // the person with a little search lens
  'user-search': (icon, P) => {
    const L = lens(P, 16.25, 16, 2.5, { handle: 2.6, part: 'S', hpart: 'S' })
    return [...PERSON(P), P.moat(P.unite(P.circle(16.25, 16, 4.65), P.seg(18.6, 18.35, 21.25, 21, 3.25)), 0.9), ...L]
  },
  // the person with a tomato x badge
  'user-x': (icon, P) => [...PERSON(P), ...P.badge('x', 'c1', 17.5, 17.25, 4.4)],
  // two people: a friend in mint behind, the user in sky in front
  users: (icon, P) => {
    const front = personL(P, 9.5, 3.5, 0.92)
    return [
      ...personL(P, 16.25, 2.25, 0.82, 'c2', 'c4', 'A'),
      P.moat(P.unite(front[0].F, front[1].F), 0.7),
      ...front,
    ]
  },
  // ---------------------------------------------------------------- ut..
  // a sky fork and a knife with a cream blade on a tomato handle
  utensils: (icon, P) => [
    P.felt('c3', P.fillet(P.unite(P.pill(3.75, 2.25, 5.75, 9), P.pill(6.9, 2.25, 8.9, 9), P.pill(10.05, 2.25, 12.05, 9), P.rr(3.75, 6.75, 12.05, 11, [0, 0, 3.5, 3.5]), P.seg(7.9, 10, 7.9, 21, 2.8)), 0.5), { part: 'K', stitch: false }),
    P.felt('tint', P.poly([[17, 2.25], [20.25, 5.5], [20.25, 13], [15, 13], [15, 5]], [1.6, 1.6, 0.4, 0.4, 1.4]), { part: 'A', stitch: false }),
    P.felt('c1', P.pill(15.25, 12, 19.5, 21.5), { part: 'A', stitch: false }),
    P.knot(17.4, 15.5, 0.6, 'tint', { part: 'A' }),
  ],
  // a sky camera with a cream caller sewn on its screen, a sunflower lens
  'video-call': (icon, P) => [
    P.felt('c2', P.poly([[14, 12], [22.25, 6.75], [22.25, 17.25]], [0.8, 1.3, 1.3]), { part: 'A', stitch: false }),
    P.felt('c3', P.rr(1.75, 4.75, 16.25, 19.25, 2.75), { part: 'K' }),
    P.felt('tint', P.circle(9, 10.25, 2.4), { part: 'K', ...SOFT }),
    P.felt('tint', P.round(P.clip(P.ellipse(9, 17.75, 4.25, 4), P.rect(0, 0, 24, 16.5)), 0.8), { part: 'K', ...SOFT }),
  ],
  // a tomato camcorder, a sky lens horn, a sunflower record light
  'video-camera': (icon, P) => vcam(P),
  // the camcorder (sky body, as video-call) with the family's tomato slash
  'video-off': (icon, P) => [...vcam(P, 'c3', 'c2'), ...P.slash({ from: [3.5, 3.5], to: [20.5, 20.5], role: 'c1' })],
  // a cream volleyball: Line's three swirl panels, one sky and one sunflower, embroidered seams (A)
  volleyball: (icon, P) => {
    const R = 9.75, near = (q, p) => Math.hypot(q[0] - p[0], q[1] - p[1])
    const seams = ['M12 12 A9.5 9.5 0 0 0 20.23 7.25', 'M12 12 A9.5 9.5 0 0 0 12 21.5', 'M12 12 A9.5 9.5 0 0 0 3.77 7.25']
    const arcs = ['M21.5 12.09 A13.5 13.5 0 0 1 10.76 15.94', 'M7.17 20.18 A13.5 13.5 0 0 1 9.2 8.96', 'M7.33 3.73 A13.5 13.5 0 0 1 16.03 11.1']
    const S = seams.map(d => P.linesOf(d)[0]), A = arcs.map(d => P.linesOf(d)[0])
    const ang = q => Math.atan2(q[1] - 12, q[0] - 12) * 180 / Math.PI
    // panel i: seam i out to the rim, along the rim to arc i, arc i in to seam j, seam j back to the centre
    const panel = (i, j) => {
      const s0 = S[i], a0 = A[i], end = a0[a0.length - 1], dEnd = near(end, [12, 12])
      let t0 = ang(s0[s0.length - 1]), t1 = ang(a0[0]); while (t1 < t0) t1 += 360
      const back = S[j].filter(q => near(q, [12, 12]) < dEnd).reverse()
      return P.clip(P.poly([...s0, ...P.arcPts(12, 12, R + 1, t0, t1, 6), ...a0, ...back], 0.3), P.circle(12, 12, R))
    }
    return [
      P.felt('tint', P.circle(12, 12, R), { part: 'K', stitch: false }),
      P.felt('c3', panel(0, 1), { part: 'A', line: false, stitch: false, pinch: false, out: 0 }),
      P.felt('c2', panel(2, 0), { part: 'A', line: false, stitch: false, pinch: false, out: 0 }),
      P.thread([...S, ...A], { w: 0.95, role: 'ink', op: 0.75, part: 'A' }),
    ]
  },
  // a sky speaker cone with one tomato sound wave
  'volume-1': (icon, P) => [...cone(P), P.arcTube('c1', 13.5, 12, 4, -50, 50, 2.4, { part: 'A', stitch: false })],
  // a sky speaker cone with a tomato x
  'volume-off': (icon, P) => [...cone(P), P.felt('c1', xF(P, 18.5, 12, 2.5, 2.4), { part: 'S', stitch: false, out: 0.5 })],
  // a sky speaker cone with two tomato sound waves
  volume: (icon, P) => [
    ...cone(P),
    P.arcTube('c1', 13.5, 12, 4, -50, 50, 2.4, { part: 'A', stitch: false }),
    P.arcTube('c1', 13.5, 12, 8, -52, 52, 2.4, { part: 'A', stitch: false }),
  ],
  // a tomato wallet, a sky card peeking out, a sunflower clasp with a snap
  wallet: (icon, P) => [
    P.felt('c3', P.rot(P.rr(5, 2.25, 15, 8, 1), -8, 10, 5), { part: 'A', stitch: false }),
    P.felt('c1', P.rr(2.5, 5.75, 20.75, 20.5, 2.75), { part: 'K' }),
    P.felt('c2', P.rr(14, 10, 22, 16, [2.5, 1.5, 1.5, 2.5]), { part: 'A', stitch: false }),
    P.knot(16.75, 13, 0.9, 'ink', { part: 'A' }),
  ],
  // a sky wand with a sunflower star, sparkles flying off
  wand: (icon, P) => [
    P.tube('c3', [[3.5, 20.5], [13, 11]], 2.8, { part: 'K' }),
    P.felt('tint', P.seg(3.5, 20.5, 5.5, 18.5, 3.1), { part: 'K', stitch: false, out: 0.5 }),
    P.felt('c2', P.poly(P.starPts(15.75, 8.25, 6, 2.75, 5, -72), [1, 0.6]), { part: 'A' }),
    P.felt('accent', P.poly(P.starPts(21, 15.25, 2.6, 1, 4), [0.4, 0.3]), DECO),
    P.felt('c3', P.poly(P.starPts(7.75, 4, 2.3, 0.9, 4), [0.4, 0.3]), DECO),
  ],
  // sunflower walls under a tomato roof, a cream roller door with embroidered slats
  warehouse: (icon, P) => [
    P.felt('c2', P.rr(3.75, 9.5, 20.25, 21, [0, 0, 2, 2]), { part: 'K', stitch: false }),
    P.felt('c1', P.poly([[1.75, 9.25], [12, 2.75], [22.25, 9.25], [22.25, 11.5], [1.75, 11.5]], [1, 1.5, 1, 0.9, 0.9]), { part: 'K' }),
    P.felt('tint', P.rr(7, 13.5, 17, 21, [1.25, 1.25, 0, 0]), { part: 'A', stitch: false, out: 0.5 }),
    P.thread([[[8, 16], [16, 16]], [[8, 18.5], [16, 18.5]]], { w: 0.8, op: 0.6, part: 'A' }),
  ],
  // a cream washer with a tomato control strip, a sunflower porthole round sky water
  'washing-machine': (icon, P) => {
    const body = P.rr(3.5, 2.25, 20.5, 21.75, 2.75)
    return [
      P.felt('tint', body, { part: 'K', inset: 0.85 }),
      P.felt('c1', P.clip(body, P.rect(0, 0, 24, 6.75)), { part: 'K', stitch: false, out: 0.5 }),
      P.knot(7, 4.6, 0.8, 'tint', { part: 'K' }), P.knot(9.75, 4.6, 0.8, 'tint', { part: 'K' }),
      P.felt('c2', P.circle(12, 14.25, 5.4), { part: 'K', stitch: false }),
      P.felt('c3', P.circle(12, 14.25, 3.5), { part: 'A', stitch: false, out: 0.45 }),
      P.knot(10.9, 13.1, 0.7, 'shine', { part: 'A', op: 0.9 }),
    ]
  },
  // a tomato watch face on a sky strap, a cream dial, a sunflower crown
  watch: (icon, P) => [
    P.felt('c3', P.unite(P.rr(8.25, 1.75, 15.75, 8, 1.5), P.rr(8.25, 16, 15.75, 22.25, 1.5)), { part: 'K', stitch: false }),
    P.felt('c2', P.pill(18.25, 10.5, 20.5, 13.5), { part: 'A', stitch: false, out: 0.5 }),
    P.felt('c1', P.circle(12, 12, 6.75), { part: 'K', stitch: false }),
    P.felt('tint', P.circle(12, 12, 4.75), { part: 'K', stitch: false, out: 0.45 }),
    P.thread([[12, 9.25], [12, 12], [13.9, 13.2]], { w: 1.1, part: 'K' }),
  ],
  // a sky webcam head, a sunflower lens ring round a sky lens, a tomato stand
  webcam: (icon, P) => [
    P.felt('c1', P.pill(6.25, 18.75, 17.75, 21.75), { part: 'K', stitch: false }),
    P.felt('c3', P.seg(12, 15, 12, 19.5, 2.4), { part: 'K', stitch: false, out: 0.5 }),
    P.felt('c3', P.circle(12, 9.25, 7.25), { part: 'K', stitch: false }),
    P.felt('c2', P.circle(12, 9.25, 4.25), { part: 'K', stitch: false }),
    P.felt('c3', P.circle(12, 9.25, 2.3), { part: 'A', stitch: false, out: 0.45 }),
    P.knot(11.1, 8.35, 0.6, 'shine', { part: 'A', op: 0.9 }),
  ],
  // three toy-box buttons joined by sky cords
  webhook: (icon, P) => [
    // the three cords as one closed loop panel (one piping pass instead of three)
    P.felt('c3', P.bar([...wave(P, 'M12 6.25 C8.25 8.5 6 12.5 6.25 17'), ...wave(P, 'M6.25 17 C10 19.75 14 19.75 17.75 17').slice(1), ...wave(P, 'M17.75 17 C18 12.5 15.75 8.5 12 6.25').slice(1, -1)], 2.3, true), { part: 'K', stitch: false }),
    ...[[12, 6, 'c1'], [5.75, 17.25, 'c2'], [18.25, 17.25, 'c4']].flatMap(([x, y, r]) => [
      P.felt(r, P.circle(x, y, 3), { part: 'A', stitch: false, out: 0.5 }),
      P.knot(x, y, 0.85, r === 'c2' ? 'ink' : 'tint', { part: 'A' }),
    ]),
  ],
  // the wifi rainbow with a sky slash
  'wifi-off': (icon, P) => [...wifi(P), ...P.slash({ from: [3.5, 3], to: [20.5, 21], role: 'c1', w: 2.5 })],
  // a toy-box wifi rainbow: sky, mint and sunflower arcs over a tomato dot
  wifi: (icon, P) => wifi(P),
  // three stuffed breezes curling at their ends
  wind: (icon, P) => [
    P.tube('c3', wave(P, 'M2.75 8.5 L13.75 8.5 C17.25 8.5 17.5 3.5 14 4'), 2.5, { part: 'K', stitch: false }),
    P.tube('c4', wave(P, 'M2.75 12.75 L18.5 12.75 C22.25 12.75 22.25 18 18.5 17.75'), 2.5, { part: 'A', stitch: false }),
    P.tube('c3', wave(P, 'M2.75 17 L9.25 17 C12.5 17 12.75 21.25 9.75 21'), 2.5, { part: 'K', stitch: false }),
  ],
  // a cream wine glass with a tomato pour, a fleece glint
  wine: (icon, P) => {
    const bowl = P.round(P.clip(P.ellipse(12, 5, 6.5, 9.25), P.rect(0, 2.25, 24, 24)), 1)
    return [
      P.felt('tint', P.unite(P.seg(12, 12, 12, 19.5, 2.1), P.pill(7.5, 18.75, 16.5, 21.75)), { part: 'K', stitch: false }),
      P.felt('tint', bowl, { part: 'K', stitch: false }),
      P.felt('c1', P.clip(bowl, P.rect(0, 7.25, 24, 24)), { part: 'A', stitch: false, out: 0.45 }),
    ]
  },
  // two sky lines, a tomato line wrapping round into an arrow
  'wrap-text': (icon, P) => [
    P.tube('c3', [[3.5, 5.75], [20.5, 5.75]], 2.6, { part: 'K', stitch: false }),
    P.felt('c1', P.fillet(P.unite(P.bar([[3.5, 12], [16.75, 12], ...P.arcPts(16.75, 15.25, 3.25, -90, 90, 6), [14, 18.5]], 2.6), P.poly([[10.25, 18.5], [15, 14.5], [15, 22.5]], [1, 0.7, 0.7])), 0.5), { part: 'A', stitch: false }),
    P.tube('c3', [[3.5, 18.5], [7.25, 18.5]], 2.6, { part: 'K', stitch: false }),
  ],
  // a sky wrench, one stuffed piece, with a cream hanging eyelet
  wrench: (icon, P) => {
    const r = f => P.rot(f, 45, 12, 12)
    return [
      P.felt('c3', r(P.fillet(P.unite(P.cut(P.circle(12, 5.5, 5.25), P.rr(10.1, -1, 13.9, 5.25, 0.9)), P.seg(12, 8, 12, 21.75, 3.6)), 1)), { part: 'K', seam: [[pt(12, 12, 1, 135), pt(12, 12, 8.25, 135)].map(([x, y]) => [x, y])] }),
      P.knot(...pt(12, 12, 8.4, 135), 0.85, 'tint', { part: 'K' }),
    ]
  },
  // a tomato disc, a cream x sewn on
  'x-circle': (icon, P) => [
    P.felt('c1', P.circle(12, 12, 9.75), { part: 'K' }),
    P.felt('tint', xF(P, 12, 12, 3.6), { part: 'A', ...SOFT }),
  ],
  // a sunflower lightning bolt pillow
  zap: (icon, P) => [
    P.felt('c2', P.poly([[14, 1.75], [3.75, 13.75], [11, 13.75], [9.75, 22.25], [20.25, 9.75], [13, 9.75]], [1.1, 1.1, 0.6, 1.1, 1.1, 0.6]), { part: 'K' }),
  ],
  // the search lens with a light-thread plus
  'zoom-in': (icon, P) => [...lens(P), P.glyph('plus', 10.25, 10.25, 2.5, { part: 'K' })],
  // the search lens with a light-thread minus
  'zoom-out': (icon, P) => [...lens(P), P.glyph('minus', 10.25, 10.25, 2.5, { part: 'K' })],
}
