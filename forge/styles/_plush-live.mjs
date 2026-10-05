// PLUSH Live: the Live icons (forge/DYNAMIC.md) dressed as the same toys as their static families.
// Every entry is (icon, ctx, F) => pieces, ctx = prim + kit + auto() (see _plush-render.mjs).
// Most start from the automatic pieces and add the family part the skeleton cannot carry (a
// calendar's tomato header, a bell's rim, a folder's back); the meters whose empty steps Line
// draws as ghost dots are sewn in full, the empty steps as cream felt, so they never shrink to specks.
// Work happens in the automatic path's coordinates (the skeleton at 0.88 about the centre): T().
import * as P from './_plush-prim.mjs'
import * as Kit from './_plush-kit.mjs'
import * as F from './_plush-field.mjs'
import { build, T, A, subsOf, freeText, textW } from './_plush-auto.mjs'
import { LIGHT } from './_plush-compose.mjs'
import { splitText } from './_live-text.mjs'
import { distToPolyline } from '../kernel/geom.mjs'

const S = A.S
const isText = p => typeof p.id === 'string' && p.id.startsWith('text:')
const lenOf = d => subsOf(d).reduce((L, s) => { for (let i = 1; i < s.pts.length; i++) L += Math.hypot(s.pts[i][0] - s.pts[i - 1][0], s.pts[i][1] - s.pts[i - 1][1]); return L }, 0)
// Line's ghost dot: a zero-ish path standing in for an empty step
const isGhost = p => !isText(p) && p.plate === 'A' && lenOf(p.d) < 0.6
const centreOf = d => { const s = subsOf(d)[0]; return s ? s.pts[0] : [12, 12] }
const without = (icon, drop) => ({ ...icon, paths: (icon.paths || []).filter(p => !drop(p)) })
const tp = pts => pts.map(T)
const ringsOf = d => subsOf(d).filter(s => s.pts.length > 2).map(s => s.pts.map(T))
const area = f => F.inkArea(f)
// re-embroider the text threads once a felt has been added under them (light thread on dark felt)
function rethread(pieces) {
  pieces.forEach((pc, k) => {
    if (pc.kind !== 'thread' || !pc.text) return
    const v = { ink: 0, edge: 0 }
    for (const L of pc.lines) for (let i = 0; i < L.length; i += 3) {
      const q = L[i]
      for (let j = k - 1; j >= 0; j--) {
        const o = pieces[j]
        if (o.kind !== 'felt' || !o.F || F.sampleAt(o.F, q[0], q[1]) >= 0) continue
        v[LIGHT.has(o.role) ? 'ink' : 'edge']++
        break
      }
    }
    if (v.ink + v.edge) pc.role = v.edge > v.ink ? 'edge' : 'ink'
  })
  return pieces
}
const biggestK = pieces => {
  let best = -1, a = 0
  pieces.forEach((p, i) => { if (p.kind === 'felt' && p.part === 'K') { const v = area(p.F); if (v > a) { a = v; best = i } } })
  return best
}
// the text glyph boxes (T coords) with their cap heights, for layout decisions
function textBoxes(icon) {
  return (icon.paths || []).filter(isText).map(p => {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
    for (const s of subsOf(p.d)) for (const q of s.pts) { const [x, y] = T(q); x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) }
    return { x0, y0, x1, y1, cap: Number(String(p.id).split(':')[2]) || 5 }
  }).filter(b => Number.isFinite(b.x0))
}

const LABEL_ROW = new Set(['calendar-date', 'calendar-weekday', 'calendar-month'])
// a calendar page: cream, a tomato header band, sky binder loops (the static calendar family)
function calendar(icon) {
  const pcs = build(icon)
  const i = biggestK(pcs)
  if (i < 0) return pcs
  const page = pcs[i]
  const bb = F.box(page.F)
  // the header is set by the generator's layout, never by the text it happens to carry (a value change never
  // moves it): the month / weekday label row of a date sits on it (skeleton y < 11.4); other pages keep a
  // narrow header over their number
  const yb = LABEL_ROW.has(icon.name) ? T([12, 11.4])[1] : bb.y0 + 2.2
  const band = P.clip(page.F, P.rect(0, 0, 24, yb))
  pcs.splice(i + 1, 0, Kit.felt('c1', band, { part: 'K', stitch: false, out: 0.5 }))
  return rethread(pcs)
}

// a bell: sunflower dome, sky clapper, a tomato rim pill and a little tomato loop (the static bell)
function bell(icon) {
  const pcs = build(icon)
  const i = biggestK(pcs)
  if (i < 0) return pcs
  const bb = F.box(pcs[i].F)
  // the rim spans the bell mouth: the widest rows of the body
  const yb = bb.y1
  const rim = P.pill(bb.x0 - 0.35, yb - 2.5, bb.x1 + 0.35, yb + 0.1)
  // the dome's crown: the topmost body row's middle
  let cx = (bb.x0 + bb.x1) / 2
  { const row = []; for (let x = bb.x0; x <= bb.x1; x += 0.12) if (F.sampleAt(pcs[i].F, x, bb.y0 + 0.4) < 0) row.push(x); if (row.length) cx = (row[0] + row.at(-1)) / 2 }
  const loop = Kit.tube('c1', P.arcPts(cx, bb.y0 + 0.1, 1.25, 180, 360), 1.45, { part: 'K', stitch: false, out: 0.5 })
  pcs.splice(i + 1, 0, Kit.felt('c1', rim, { part: 'K', stitchMin: 1.1, inset: 0.7 }))
  pcs.splice(i, 0, loop)
  return pcs
}

// an envelope: cream, a tomato flap sewn from the top corners down to the skeleton's V (the static mail)
function mail(icon) {
  const flapL = (icon.paths || []).filter(p => p.plate === 'A' && !isText(p))
  const fp = flapL.flatMap(p => subsOf(p.d).map(s => s.pts))
  const near = q => fp.some(L => distToPolyline(q, L, false) < 2.2)
  const cutouts = (icon.cutouts || []).filter(c => !subsOf(c.d).every(s => s.pts.every(near)))
  const pcs = build({ ...without(icon, p => flapL.includes(p)), cutouts })
  const i = biggestK(pcs)
  if (i < 0 || !flapL.length) return pcs
  const bb = F.box(pcs[i].F)
  let v = null
  for (const p of flapL) for (const s of subsOf(p.d)) for (const q of s.pts) { const t = T(q); if (!v || t[1] > v[1]) v = t }
  const cx = (bb.x0 + bb.x1) / 2
  const flap = P.poly([[bb.x0 + 0.7, bb.y0 + 0.45], [bb.x1 - 0.7, bb.y0 + 0.45], [cx, Math.max(bb.y0 + 5, v[1] + 0.5)]], [1, 1, 1.6])
  pcs.splice(i + 1, 0, Kit.felt('c1', flap, { part: 'A', stitchMin: 1.3, inset: 0.75 }))
  return pcs
}

// a folder: a tomato back with its tab, a sunflower front pocket carrying the label
function folder(icon) {
  const pcs = build(icon)
  const i = biggestK(pcs)
  if (i < 0) return pcs
  const body = pcs[i]
  const bb = F.box(body.F)
  // the pocket starts a little under the back's top edge (the tab row stays tomato)
  let top = bb.y0
  for (let y = bb.y0; y < bb.y1; y += 0.12) {
    let n = 0
    for (let x = bb.x0; x <= bb.x1; x += 0.25) if (F.sampleAt(body.F, x, y) < 0) n++
    if (n * 0.25 > (bb.x1 - bb.x0) * 0.8) { top = y; break }
  }
  const tb = textBoxes(icon)
  const yf = Math.min(top + 2.3, tb.length ? Math.min(...tb.map(b => b.y0)) - 1.1 : top + 2.3)
  const front = P.round(P.clip(body.F, P.rect(0, yf, 24, 24)), 1.2)
  pcs.splice(i, 1, { ...body, role: 'c1', stitch: false }, Kit.felt('c2', front, { part: 'K' }))
  return rethread(pcs)
}

// a meter of stuffed bars: lit bars in the static signal colours, an empty slot as a column of cream felt balls.
// Both are read from the skeleton (the lit bars are its K strokes, an empty slot its ghost dots), so a bar is
// sewn exactly where the generator puts it and only when it does.
function signalBars(icon) {
  const cols = ['c3', 'c4', 'c2', 'c1'], slots = [4.5, 9.5, 14.5, 19.5], tops = [16.25, 12.25, 8.25, 4.25]
  const slot = x => slots.reduce((k, v, i) => (Math.abs(v - x) < Math.abs(slots[k] - x) ? i : k), 0)
  const out = []
  const lit = (icon.paths || []).filter(p => p.plate === 'K' && !isText(p))
  // an empty step: one soft cream felt ball per ghost dot (countable, never a speck)
  for (const g of (icon.paths || []).filter(isGhost)) { const c = T(centreOf(g.d)); out.push(Kit.felt('tint', P.circle(c[0], c[1], 1.2), { part: 'A', stitch: false, out: 0.45, hi: false })) }
  for (const p of lit) for (const sb of subsOf(p.d)) {
    if (sb.pts.length < 2) continue
    const k = slot(sb.pts[0][0])
    out.push(Kit.tube(cols[k], tp(sb.pts), 2.75, { part: 'K', stitch: 'auto' }))
  }
  const sx = (icon.paths || []).filter(p => p.plate === 'S' && !isText(p))
  if (sx.length) {
    const L = sx.flatMap(p => subsOf(p.d).map(s => tp(s.pts)))
    const G = F.strokes(L.map(pts => ({ pts, closed: false })), 2.3, 1.3)
    out.push(Kit.moat(G, 0.9), Kit.felt('c1', G, { part: 'S', stitch: false }))
  }
  return out
}

// a bar chart: each K bar a stuffed felt column (colours in turn), narrowed when the bars stand close so a
// seam of page always shows between them; the A baseline a cream tube under them
function barValues(icon) {
  const cols = ['c3', 'c4', 'c2', 'c1', 'accent']
  const bars = (icon.paths || []).filter(p => p.plate === 'K' && !isText(p)).map(p => {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
    for (const sb of subsOf(p.d)) for (const q of sb.pts) { const [x, y] = T(q); x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) }
    return { x0, y0, x1, y1, cx: (x0 + x1) / 2 }
  }).filter(b => Number.isFinite(b.x0)).sort((a, b) => a.cx - b.cx)
  const pitch = bars.length > 1 ? Math.min(...bars.slice(1).map((b, i) => b.cx - bars[i].cx)) : 6
  const half = Math.max(0.55, Math.min(1.25, (pitch - 2 * 0.62 - 0.7) / 2))
  const out = []
  for (const L of (icon.paths || []).filter(p => p.plate === 'A' && !isText(p)).flatMap(p => subsOf(p.d).map(sb => tp(sb.pts)))) if (L.length > 1) out.push(Kit.tube('tint', L, 2.2, { part: 'A' }))
  bars.forEach((b, i) => {
    const top = Math.min(b.y0, b.y1 - 0.4)
    out.push(Kit.felt(cols[i % cols.length], P.rr(b.cx - half, top - 0.3, b.cx + half, b.y1 + 1.4, Math.min(0.9, half)), { part: 'K', stitch: half >= 1 ? 'auto' : false }))
  })
  return out
}

// the wifi fan: a tomato dot, then mint, sunflower and sky arcs as in the static wifi; empty arcs cream
function wifi(icon) {
  const n = Math.max(0, Math.min(3, Math.round(icon.params.strength ?? 2)))
  const cx = 12, cy = 17.6, cols = ['c4', 'c2', 'c3']
  const out = []
  for (let k = 2; k >= 0; k--) {
    const r = 4.15 + 3.55 * k
    out.push(Kit.arcTube(k < n ? cols[k] : 'tint', cx, cy, r, 223, 317, 2.55, { part: k < n ? 'K' : 'A', stitch: k < n && k > 0 ? 'auto' : false }))
  }
  out.push(Kit.felt('c1', P.circle(cx, cy, 1.65), { part: 'K', stitch: false }))
  return out
}

// rating stars: earned stars as drawn, the stars not earned as cream felt stars (never bare dots)
function stars(icon) {
  const ghosts = (icon.paths || []).filter(isGhost)
  const pcs = build(without(icon, isGhost))
  const out = []
  for (const g of ghosts) {
    const [x, y] = T(centreOf(g.d))
    out.push(Kit.felt('tint', P.poly(P.starPts(x, y - 0.1, 2.75 * S * 1.04, 1.42 * S * 1.04, 5), [0.55, 0.35]), { part: 'A', stitch: false, out: 0.5 }))
  }
  return [...out, ...pcs]
}

// a progress ring: the empty track as cream felt balls, the done arc a stuffed mint tube, the disc as drawn
function progress(icon) {
  const arcP = (icon.paths || []).find(p => !isText(p) && p.plate === 'K')
  const keep = p => isText(p) || (p.plate === 'A' && !isGhost(p))
  const pcs = build(without(icon, p => !keep(p)))
  const c = T([12, 12]), r = 9.5 * S, w = 2.45
  // the empty track: one cream felt ball per ghost dot (as line dots it), so the track shortens as the arc grows
  const out = (icon.paths || []).filter(isGhost).map(g => { const q = T(centreOf(g.d)); return Kit.felt('tint', P.circle(q[0], q[1], 1.05), { part: 'A', stitch: false, out: 0.45, hi: false }) })
  if (arcP) {
    const subs = subsOf(arcP.d)
    for (const s of subs) {
      const pts = tp(s.closed ? [...s.pts, s.pts[0]] : s.pts)
      if (pts.length > 1) out.push(Kit.tube('c4', pts, w, { part: 'K', closed: false, stitch: 'seam', pinch: false }))
    }
  }
  return [...out, ...pcs]
}

// a wrist watch: sky straps, a tomato case, a cream face with ink hands (the static watch)
function watch(icon) {
  const fills = (icon.fills || []).map(f => ringsOf(f.d)).filter(r => r.length).map(r => F.region(r, 1.3))
  if (!fills.length) return build(icon)
  fills.sort((a, b) => area(b) - area(a))
  const [cs, ...straps] = fills
  const out = []
  for (const s of straps) out.push(Kit.felt('c3', P.round(P.grow(s, 0.15), 0.6), { part: 'K', stitch: false }))
  out.push(Kit.felt('c1', cs, { part: 'K', stitch: false }))
  out.push(Kit.felt('tint', P.shrink(cs, 1.55), { part: 'K', stitch: false, out: 0.45, shadeOp: 0.12 }))
  const hands = (icon.paths || []).filter(p => p.plate === 'A' && !isText(p)).flatMap(p => subsOf(p.d).map(s => tp(s.pts)))
  if (hands.length) out.push(Kit.thread(hands, { w: 1.3, role: 'ink', part: 'A' }))
  const c = T([12, 12])
  out.push(Kit.knot(c[0], c[1], 0.85, 'c1', { part: 'A' }))
  return out
}

// a battery: sky body, cream inside, the charge level a mint felt cell (the static battery). The
// skeleton knocks the level out of the inside (even-odd) and hatches it: here it is sewn as felt.
function battery(icon, drop = () => false) {
  const slabs = (icon.cutouts || []).flatMap(c => ringsOf(c.d).slice(1))
  if (!slabs.length) return build(without(icon, drop))
  const slab = F.region(slabs, 1.3)
  const hatch = p => p.plate === 'A' && !isText(p) && subsOf(p.d).every(s => s.pts.every(q => { const t = T(q); return F.sampleAt(slab, t[0], t[1]) < 0.7 }))
  const pcs = build(without(icon, p => drop(p) || hatch(p)))
  const at = pcs.findIndex(p => p.kind === 'felt' && p.role === 'tint')
  const cell = Kit.felt('c4', P.round(slab, 0.5), { part: 'A', stitch: false, out: 0.45, hiOp: 0.55 }) // a brighter fleece highlight: the level's top edge reads at 24px
  if (at >= 0) pcs.splice(at + 1, 0, cell); else pcs.push(cell)
  return pcs
}

// a charging battery: the bolt is a sunflower felt bolt sewn on beside the body, with a moat
function charging(icon) {
  const pcs = battery(icon, p => p.plate === 'S' && !isText(p))
  const bolt = P.poly(tp([[20.4, 2.6], [14.9, 12.85], [17.75, 12.85], [16.1, 21.4], [22.1, 10.9], [19.15, 10.9]]), [0.8, 0.55, 0.35, 0.8, 0.55, 0.35])
  return [...pcs, Kit.moat(bolt, 0.85), Kit.felt('c2', bolt, { part: 'S', stitch: false })]
}

// a stopwatch: a tomato case with a cream face, sky crown and pushers, the elapsed seconds a sky felt sector
// (read from the skeleton), a hand in ink thread
function stopwatch(icon) {
  const K = (icon.paths || []).filter(p => p.plate === 'K' && !isText(p))
  const A = (icon.paths || []).filter(p => p.plate === 'A' && !isText(p))
  const ring = K.flatMap(p => subsOf(p.d)).find(s => s.closed && s.pts.length > 2)
  if (!ring) return build(icon)
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (const q of ring.pts.map(T)) { x0 = Math.min(x0, q[0]); y0 = Math.min(y0, q[1]); x1 = Math.max(x1, q[0]); y1 = Math.max(y1, q[1]) }
  const c = [(x0 + x1) / 2, (y0 + y1) / 2], r = (x1 - x0) / 2
  const inside = s => s.pts.every(q => { const t = T(q); return Math.hypot(t[0] - c[0], t[1] - c[1]) < r - 0.5 })
  const out = []
  for (const p of A) for (const s of subsOf(p.d)) if (!inside(s) && s.pts.length > 1) out.push(Kit.tube('c3', tp(s.pts), 2.2, { part: 'A', stitch: false }))
  out.push(Kit.felt('c1', P.circle(c[0], c[1], r + 1.1), { part: 'K' }))
  out.push(Kit.felt('tint', P.circle(c[0], c[1], r - 0.75), { part: 'K', stitch: false, out: 0.45, shadeOp: 0.12 }))
  for (const p of A) for (const s of subsOf(p.d)) {
    if (!inside(s)) continue
    if (s.closed && s.pts.length > 2) out.push(Kit.felt('c3', P.round(P.unite(P.poly(tp(s.pts)), P.bar(tp(s.pts), 0.9, true)), 0.3), { part: 'A', stitch: false, out: 0.45 }))
    else out.push(Kit.thread([tp(s.pts)], { w: 1.4, role: 'ink', part: 'A' }))
  }
  out.push(Kit.knot(c[0], c[1], 0.7, 'ink', { part: 'A' }))
  return out
}

// a sale sticker: a sunflower burst (its fill, always whole, the K edge sewn on as the same felt) with a cream
// ribbon band stitched across its middle that carries the value in ink. The band is set by the layout (the
// text row), never by the text, so the burst can change its points while the value stays put.
function sticker(icon) {
  const fill = (icon.fills || [])[0]
  const out = []
  const body = fill ? F.region(subsOf(fill.d).filter(s => s.pts.length > 2).map(s => s.pts.map(T)), 1.3) : null
  const K = (icon.paths || []).filter(p => p.plate === 'K' && !isText(p)).flatMap(p => subsOf(p.d).map(s => ({ pts: tp(s.pts), closed: false })))
  if (body && K.length) F.union(body, F.strokes(K, 1.6, 1.3))
  if (body) out.push(Kit.felt('c2', P.round(body, 0.35), { part: 'K' }))
  const [bx0, by0] = T([1.25, 9.25]), [bx1, by1] = T([22.75, 14.75]) // a ribbon across, a little past the burst
  out.push(Kit.felt('tint', P.rr(bx0, by0, bx1, by1, 1), { part: 'K', stitch: false, out: 0.45, shadeOp: 0.1, hiOp: 0.2 }))
  for (const p of (icon.paths || []).filter(isText)) {
    const L = subsOf(p.d).map(s => (s.closed ? [...s.pts, s.pts[0]] : s.pts).map(T)).filter(L => L.length)
    if (L.length) out.push(Kit.thread(L, { w: textW(Number(String(p.id).split(':')[2]) || 5), part: p.plate || 'A', role: 'ink', text: true }))
  }
  return out
}

export const LIVE = {
  'sale-sticker': sticker,
  stopwatch,
  'calendar-date': calendar, 'calendar-event': calendar, 'calendar-month': calendar,
  'calendar-range': calendar, 'calendar-tear': calendar, 'calendar-weekday': calendar,
  'bell-count': bell,
  'folder-label': folder,
  'mail-count': mail,
  'signal-bars': signalBars,
  'bar-values': barValues,
  'wifi-strength': wifi,
  'rating-stars': stars,
  'progress-ring': progress,
  'watch-time': watch,
  'battery-charging-level': charging,
  'battery-level': battery, 'battery-vertical': battery,
}
export const liveOf = icon => (icon && icon.params && LIVE[icon.name]) || null
export { freeText, splitText }
