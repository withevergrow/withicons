// PASTEL live compositions — Live icons (forge/dynamic) hand-composed so they match their static siblings
// exactly. Same contract as a redraw:
//   (icon, p) => layers     icon.paths is the generator's skeleton; p is the prim + kit vocabulary.
// Anything not listed here (or that throws) falls back to the automatic composer.
//
// RULE: every moving part (a battery's charge, a progress arc, a star, a warning mark) is read from the
// SKELETON, never re-derived from the params, so the drawing is exactly where the generator put it and
// moves exactly when it moves. Text is the font's own glyphs at the font's weight ('text' key: a deeper
// ink of the field under it). Readings take the hue's deep tone ('hue.deep'), so they read at 24px.
//
// Batteries follow the static battery (_pastel-redraw-1.mjs): a lavender shell and terminal, a paper
// well, the charge as a mint level (blush when low), the warning "!" in blush, the charging bolt in butter.
import { parsePath } from '../kernel/geom.mjs'

const TW = 1.75 // the font's weight (it is spaced for it)
const isText = q => typeof q.id === 'string' && q.id.startsWith('text:')
const subs = d => { try { return parsePath(d) } catch { return [] } }
function boxOf(d) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (const s of subs(d)) for (const [x, y] of s.pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) }
  return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, ok: Number.isFinite(x0) }
}
const pathsOf = (icon, f) => (icon.paths || []).filter(q => q && q.d && f(q))
const ghost = q => !isText(q) && boxOf(q.d).w < 0.6 && boxOf(q.d).h < 0.6
// a centreline as round-capped capsules (robust on the font's tight curves, where an offset outline folds)
const line = (p, d, w) => subs(d).flatMap(s => { const pts = s.closed ? [...s.pts, s.pts[0]] : s.pts; return pts.length ? [p.bar(pts, w)] : [] })
// the generator's glyphs, stroked at the font's weight, one layer per plate
function text(icon, p, hue = '') {
  const by = {}
  for (const g of pathsOf(icon, isText)) (by[g.plate || 'A'] ||= []).push(...line(p, g.d, TW))
  return Object.entries(by).map(([pl, sh]) => [`text${hue ? '.' + hue : ''}@${pl}`, ...sh])
}
// a warning mark from its S strokes: a soft pill per stroke, a dot per point
const mark = (icon, p) => {
  const sh = pathsOf(icon, q => q.plate === 'S' && !isText(q)).map(q => {
    const b = boxOf(q.d)
    return b.h < 0.6 && b.w < 0.6 ? p.circle(b.cx, b.cy, 1.05) : p.pill(b.cx - 0.95, b.y0 - 0.2, b.cx + 0.95, b.y1 + 0.2)
  })
  return sh.length ? [['blush.deep@S', ...sh]] : []
}
// the charge: the A cell the skeleton hatches inside the well, as one soft level
function charge(icon, p, horizontal) {
  const cells = pathsOf(icon, q => q.plate === 'A' && !isText(q)).map(q => boxOf(q.d)).filter(b => b.ok && b.w >= 1 && b.h >= 1)
  if (!cells.length) return []
  const b = cells.reduce((a, c) => (c.w * c.h > a.w * a.h ? c : a))
  const low = horizontal ? b.w <= 2.5 : b.h <= 2.5
  const hue = low ? 'blush' : 'mint'
  return [[`${hue}.deep@A`, p.rr(b.x0 - 0.75, b.y0 - 0.25, b.x1 + 0.75, b.y1 + 0.25, 1.1)]]
}

const shellH = p => [
  ['lavender@K', p.rr(2, 6.25, 19.25, 17.75, 3.25)],
  ['lavender.flat@K', p.rr(19.75, 9.75, 22.25, 14.25, [0, 1.1, 1.1, 0])],
  ['paper.well@K', p.rr(4.25, 8.5, 17, 15.5, 1.6)],
]
const shellV = p => [
  ['lavender@K', p.rr(5.75, 4.75, 18.25, 22, 3.25)],
  ['lavender.flat@K', p.rr(9.75, 2.25, 14.25, 4.75, [1.1, 1.1, 0, 0])],
  ['paper.well@K', p.rr(8, 7, 16, 19.75, 1.6)],
]

// a meter ring: the empty track as small lavender dots, the done arc in the deep tone, a soft disc for the
// value inside it (its centre from the skeleton's face fill, its size from the arc's radius); parts off the
// ring (a timer's crown) in the hue, a mark inside it (the done check) in ink
function ring(hue) {
  return (icon, p) => {
    const K = pathsOf(icon, q => q.plate === 'K' && !isText(q))
    const A = pathsOf(icon, q => q.plate === 'A' && !isText(q))
    const fb = (icon.fills || [])[0] ? boxOf(icon.fills[0].d) : null
    const c = fb && fb.ok ? [fb.cx, fb.cy] : [12, 12]
    const m = K.map(q => String(q.d).match(/A\s*(\d+(?:\.\d+)?)/)).find(Boolean)
    const R = m ? +m[1] : 9.5
    const dots = A.filter(ghost).map(q => { const b = boxOf(q.d); return p.circle(b.cx, b.cy, 0.95) })
    const other = A.filter(q => !ghost(q))
    const inside = q => { const b = boxOf(q.d); return Math.hypot(b.cx - c[0], b.cy - c[1]) < R - 2 }
    const marks = other.filter(inside), parts = other.filter(q => !inside(q))
    return [
      ...(parts.length ? [[`${hue}@A`, ...parts.map(q => p.stroke(q.d, 2.5))]] : []),
      ...(dots.length ? [['lavender.deep@A', ...dots]] : []),
      [`${hue}@K`, p.circle(c[0], c[1], R - 2.05)],
      ...(K.length ? [[`${hue}.deep@K`, ...K.map(q => p.stroke(q.d, 2.6))]] : []),
      ...(marks.length ? [['text@A', ...marks.map(q => p.stroke(q.d, 2))]] : []),
      ...text(icon, p),
    ]
  }
}

// a price tag: the skeleton's tag (its fill) cut to the run of its outline, so it grows with the price
// exactly as the line's outline does; a punched hole, the price in deep ink
function tag(hue) {
  return (icon, p) => {
    const K = pathsOf(icon, q => q.plate === 'K' && !isText(q))
    const A = pathsOf(icon, q => q.plate === 'A' && !isText(q))
    const fill = (icon.fills || [])[0]
    if (!fill) return []
    // the body is where the outline runs: no outline, no tag (only the hole and the price)
    const kb = K.map(q => boxOf(q.d)).filter(b => b.ok)
    const x0 = kb.length ? Math.min(...kb.map(b => b.x0)) - 1.25 : 0, x1 = kb.length ? Math.max(...kb.map(b => b.x1)) + 1.25 : 0
    return [
      ...(kb.length ? [[`${hue}@K`, p.clip(p.unite(p.path(fill.d), ...K.flatMap(q => line(p, q.d, 2.5))), p.rr(x0, 0, x1, 24, 1.25))]] : []),
      ...(A.length ? [['cut', ...A.map(q => { const b = boxOf(q.d); return p.circle(b.cx, b.cy, Math.max(1.1, b.w / 2 + 0.1)) })]] : []),
      ...text(icon, p),
    ]
  }
}

// rating stars: each earned (part) star in deep butter, sized to the line's star; empty marks lavender dots
function stars(icon, p) {
  const K = pathsOf(icon, q => q.plate === 'K' && !isText(q))
  const A = pathsOf(icon, q => q.plate === 'A' && !isText(q))
  const dots = A.filter(ghost).map(q => { const b = boxOf(q.d); return p.circle(b.cx, b.cy, 1.1) })
  return [
    ...(dots.length ? [['lavender.deep@A', ...dots]] : []),
    ...(K.length ? [['butter.deep@K', ...K.map(q => p.unite(p.path(q.d), p.stroke(q.d, 1.6)))]] : []),
    ...(A.some(q => !ghost(q)) ? [['lavender.flat@A', ...A.filter(q => !ghost(q)).map(q => p.unite(p.path(q.d), p.stroke(q.d, 1.3)))]] : []),
    ...text(icon, p),
  ]
}

// a stopwatch: a lavender case with a paper face, peach crown and pushers, the elapsed seconds as a deep
// lavender sector read from the skeleton
function stopwatch(icon, p) {
  const K = pathsOf(icon, q => q.plate === 'K' && !isText(q))
  const A = pathsOf(icon, q => q.plate === 'A' && !isText(q))
  const kb = K.map(q => boxOf(q.d)).filter(b => b.ok)
  if (!kb.length) return []
  const b = kb[0], r = b.w / 2
  const inside = q => { const c = boxOf(q.d); return Math.hypot(c.cx - b.cx, c.cy - b.cy) < r - 1 }
  const sectors = A.filter(q => inside(q) && /[Zz]\s*$/.test(q.d)), hands = A.filter(q => inside(q) && !sectors.includes(q))
  const parts = A.filter(q => !inside(q))
  return [
    ...(parts.length ? [['peach@A', ...parts.flatMap(q => line(p, q.d, 2.4))]] : []),
    ['lavender@K', p.circle(b.cx, b.cy, r + 1.25)],
    ['paper.well@K', p.circle(b.cx, b.cy, r - 0.85)],
    ...(sectors.length ? [['lavender.deep@A', ...sectors.map(q => p.unite(p.path(q.d), ...line(p, q.d, 1.2)))]] : []),
    ...(hands.length ? [['lavender.deep@A', ...hands.flatMap(q => line(p, q.d, 2))]] : []),
    ...text(icon, p),
  ]
}

// a sale sticker: a deep blush burst (its fill, whole, with the K edge at the bar's width) and a paper ribbon across
// its middle that carries the value; the band is set by the layout (the text row), never by the text
function sticker(icon, p) {
  const fill = (icon.fills || [])[0]
  const K = pathsOf(icon, q => q.plate === 'K' && !isText(q))
  const body = fill ? p.unite(p.path(fill.d), ...K.flatMap(q => line(p, q.d, 1.75))) : null
  return [
    ...(body ? [['blush.deep@K', body]] : []),
    ['paper@K', p.rr(1.25, 7.75, 22.75, 16.25, 2)],
    ...text(icon, p),
  ]
}

export const LIVE = {
  'sale-sticker': sticker,
  stopwatch,
  'battery-level': (icon, p) => [...shellH(p), ...charge(icon, p, true), ...mark(icon, p)],
  'battery-vertical': (icon, p) => [...shellV(p), ...charge(icon, p, false), ...mark(icon, p)],
  // a battery-percent writes its number in the paper well
  // (a slimmer shell: the well is wide enough for "100")
  'battery-percent': (icon, p) => [
    ['lavender@K', p.rr(1.75, 5.5, 19.25, 18.5, 3)],
    ['lavender.flat@K', p.rr(19.75, 9.75, 22.25, 14.25, [0, 1.1, 1.1, 0])],
    ['paper.well@K', p.rr(3.4, 7.15, 17.6, 16.85, 1.75)],
    ...charge(icon, p, true), ...text(icon, p),
  ],
  // the charging battery: shell open to the right where the butter bolt stands (as line draws it)
  'battery-charging-level': (icon, p) => {
    const bolt = pathsOf(icon, q => q.plate === 'S' && !isText(q)).map(q => p.stroke(q.d, 2.6))
    return [
      ['lavender@K', p.rr(2, 6.25, 15, 17.75, [3.25, 2, 2, 3.25])],
      ['paper.well@K', p.rr(4.25, 8.5, 12.75, 15.5, 1.6)],
      ...charge(icon, p, true),
      ...(bolt.length ? [['butter.deep@S', ...bolt]] : []),
    ]
  },
  'progress-ring': ring('mint'),
  'timer-ring': ring('lavender'),
  'price-tag': tag('blush'),
  'rating-stars': stars,
}
