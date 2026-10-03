// PLUSH auto: the automatic stuffed-toy maker for any skeleton (all 500 icons before their
// redraw, every Live icon, any future icon). The skeleton becomes felt panels:
//
//   BODY     K fills + the K outline as a fat round tube, concave corners filleted: one
//            stuffed panel in the scheme's main felt, piped, shaded, running-stitched
//   PART     A outlines as stuffed tubes in the second felt; parts that hang outside the
//            body (a shackle, a clapper, a handle) sit BEHIND it, parts on it sit in front
//   PATCH    closed cutouts and enclosed inner shapes: appliqué patches sewn onto the body
//   THREAD   interior detail lines and open cutouts: embroidery in the dark thread
//   KNOT     dots: French knots on felt, little stuffed balls off it
//   BADGE    S plate: a moat, then a felt disc (or tube) with an embroidered glyph
//   TEXT     Live-icon text: embroidered, never inflated
//
// The skeleton is drawn at 0.88 scale (lifted 0.3u) so piping and the ground shadow fit.
import { parsePath, distToPolyline, area as polyArea } from '../kernel/geom.mjs'
import * as F from './_plush-field.mjs'
import * as P from './_plush-prim.mjs'
import * as Kit from './_plush-kit.mjs'
import { schemeOf, TUNE } from './_plush-tune.mjs'
import { LIGHT } from './_plush-compose.mjs'
import { splitText, textStroke } from './_live-text.mjs'

export const A = {
  S: 0.88, DY: -0.3,  // drawing transform about (12, 12)
  TW: 2.5,            // outline tube of a filled body
  TG: 3.0,            // tube of a pure line glyph (arrows, chevrons, menu)
  TA: 2.4,            // A part tube
  TI: 1.15,           // embroidery thread
  DEEP: 0.95,         // a centreline this deep inside the fills is interior detail
  MOAT: 1.0,
}
const M = 1.3 // field margin while building (fields are re-distanced before any offset)
const T = ([x, y]) => [(x - 12) * A.S + 12, (y - 12) * A.S + 12 + A.DY]
const subsOf = d => { try { return parsePath(d) } catch { return [] } }
const densify = (pts, step = 0.3, closed = false) => {
  const Q = closed ? [...pts, pts[0]] : pts, out = [Q[0]]
  for (let i = 1; i < Q.length; i++) {
    const a = Q[i - 1], b = Q[i], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step))
    for (let k = 1; k <= n; k++) out.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n])
  }
  return out
}
// zero-length subpaths ("M12 16 L12 16") draw a dot; the parser drops them
function dotsOf(p) {
  const out = []
  for (const chunk of String(p.d || '').split(/(?=[Mm])/)) {
    const m = chunk.match(/^M\s*(-?[\d.]+(?:e[-+]?\d+)?)[\s,]*(-?[\d.]+(?:e[-+]?\d+)?)/)
    if (!m || !/[LlHhVvCcSsQqTtAaZz]/.test(chunk)) continue
    if (!subsOf(chunk).length) out.push([+m[1], +m[2]])
  }
  return out
}
// embroidery thread that shows on the felt under it: light thread on dark felt, ink on light felt
function threadOn(pieces, pts) {
  const votes = { ink: 0, edge: 0 }
  for (let i = 0; i < pts.length; i += Math.max(1, Math.floor(pts.length / 8))) {
    const q = pts[i]
    for (let k = pieces.length - 1; k >= 0; k--) {
      const pc = pieces[k]
      if (pc.kind !== 'felt' || !pc.F || F.sampleAt(pc.F, q[0], q[1]) >= 0) continue
      votes[LIGHT.has(pc.role) ? 'ink' : 'edge']++
      break
    }
  }
  return votes.edge > votes.ink ? 'edge' : 'ink'
}
// lines whose centrelines touch (within 0.6u) belong to one group
function groupLines(ls) {
  const n = ls.length, parent = ls.map((_, i) => i)
  const find = i => parent[i] === i ? i : (parent[i] = find(parent[i]))
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    if (find(i) === find(j)) continue
    if (lineDist(ls[i], ls[j], 0.6) < 0.6) parent[find(i)] = find(j)
  }
  const by = new Map()
  ls.forEach((l, i) => { const r = find(i); if (!by.has(r)) by.set(r, []); by.get(r).push(l) })
  return [...by.values()]
}
const boxOf = l => l.box || (l.box = (() => { let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity; for (const [x, y] of l.pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) } return [x0, y0, x1, y1] })())
const sparse = l => l.sp || (l.sp = densify(l.pts, 0.45, l.closed))
function lineDist(a, b, cap = Infinity) {
  const A = boxOf(a), B = boxOf(b)
  const gap = Math.max(A[0] - B[2], B[0] - A[2], A[1] - B[3], B[1] - A[3], 0)
  if (gap >= cap) return gap
  let d = Infinity
  for (const q of sparse(a)) { const v = distToPolyline(q, b.pts, b.closed); if (v < d) d = v }
  for (const q of sparse(b)) { const v = distToPolyline(q, a.pts, a.closed); if (v < d) d = v }
  return d
}
// fills and lines that touch (within 0.6u) are one body
function groupItems(items) {
  const n = items.length, parent = items.map((_, i) => i)
  const find = i => parent[i] === i ? i : (parent[i] = find(parent[i]))
  const box = it => { let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity; for (const l of it.lines) for (const [x, y] of l.pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) } return [x0, y0, x1, y1] }
  const B = items.map(box)
  const inside = (a, b) => b.fill && a.lines.some(l => l.pts.some(q => b.fill.some(r => pointIn(q, r))))
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    if (find(i) === find(j)) continue
    const a = B[i], b = B[j]
    if (a[0] > b[2] + 0.6 || b[0] > a[2] + 0.6 || a[1] > b[3] + 0.6 || b[1] > a[3] + 0.6) continue
    if (inside(items[i], items[j]) || inside(items[j], items[i]) || groupDist(items[i].lines, items[j].lines, 0.6) < 0.6) parent[find(i)] = find(j)
  }
  const by = new Map()
  items.forEach((it, i) => { const r = find(i); if (!by.has(r)) by.set(r, []); by.get(r).push(it) })
  return [...by.values()]
}
function pointIn(p, ring) {
  let c = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i], b = ring[j]
    if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < (b[0] - a[0]) * (p[1] - a[1]) / (b[1] - a[1]) + a[0]) c = !c
  }
  return c
}
function groupDist(A, B, cap = Infinity) {
  let d = cap
  for (const a of A) for (const b of B) { const v = lineDist(a, b, d); if (v < d) d = v }
  return d
}
const fracOf = (pts, test) => pts.length ? pts.filter(test).length / pts.length : 0

export function build(icon) {
  const name = String(icon.name || '')
  const TU = TUNE[name] || {}
  const sc = schemeOf(name, icon.category)
  const live = !!icon.params
  let free = []
  try { const s = splitText(icon); free = s.free || [] } catch { free = [] }
  const freeIds = new Set(free.map(g => g.id))
  const drop = new Set(TU.drop || []), inkIdx = new Set(TU.ink || [])

  // ---- read the skeleton (transformed)
  const lines = [], dots = []
  ;(icon.paths || []).forEach((p, pi) => {
    if (drop.has(pi) || freeIds.has(p.id)) return
    const text = typeof p.id === 'string' && p.id.startsWith('text:')
    if (text) return // text set into a frame is knocked out by the cutouts: embroidered from there
    for (const s of subsOf(p.d)) if (s.pts.length) lines.push({ pts: s.pts.map(T), closed: !!s.closed && s.pts.length > 2, plate: p.plate || 'K', ink: inkIdx.has(pi) })
    for (const q of dotsOf(p)) dots.push({ p: T(q), plate: p.plate || 'K' })
  })
  const fills = (icon.fills || []).map(f => subsOf(f.d).filter(s => s.pts.length > 2).map(s => s.pts.map(T))).filter(r => r.length)
  // Live-icon text set into a frame (a badge count, a calendar day): embroidered from its own glyph
  // paths after every felt panel, so a badge never covers it and its moat never eats it
  const insideText = (icon.paths || []).filter(p => typeof p.id === 'string' && p.id.startsWith('text:') && !freeIds.has(p.id))
  const textL = insideText.map(p => ({ plate: p.plate || 'K', cap: Number(String(p.id).split(':')[2]) || 5, L: subsOf(p.d).map(s => (s.closed ? [...s.pts, s.pts[0]] : s.pts).map(T)).filter(L => L.length) }))
  const textPts = textL.flatMap(t => t.L)
  const isText = s => textPts.length && s.pts.every(q => textPts.some(L => distToPolyline(q, L, false) < 0.12))
  const cutSubs = (icon.cutouts || []).map(c => {
    let subs = subsOf(c.d)
    if (live && typeof c.d === 'string') {
      // a stroke-font letter that ends where it starts is a line, not an area: only an explicit Z closes
      const z = c.d.split(/(?=[Mm])/).filter(ch => /[LlHhVvCcSsQqTtAa]/.test(ch)).map(ch => /[Zz]/.test(ch))
      if (z.length === subs.length) subs = subs.map((s, i) => s.closed && !z[i] ? { ...s, closed: false, pts: [...s.pts, s.pts[0]] } : s)
    }
    return subs.map(s => ({ pts: s.pts.map(T), closed: !!s.closed && s.pts.length > 2 })).filter(s => !isText(s))
  })
  const hasFill = fills.length > 0
  let fillF = F.field(3)
  for (const rings of fills) F.union(fillF, F.region(rings, M))

  // ---- classify lines
  for (const l of lines) {
    l.S = densify(l.pts, 0.3, l.closed)
    l.deep = hasFill ? fracOf(l.S, q => F.sampleAt(fillF, q[0], q[1]) < -A.DEEP) : 0
    l.out = hasFill ? fracOf(l.S, q => F.sampleAt(fillF, q[0], q[1]) > 0.3) : 1
    l.inner = l.ink || (hasFill && l.deep > 0.7)
  }
  // closed cutouts: appliqué patch regions (one per cutout, even-odd)
  const patches = []
  for (const subs of cutSubs) {
    const rings = subs.filter(s => s.closed).map(s => s.pts)
    if (!rings.length) continue
    patches.push({ F: F.region(rings, M), rings, plate: 'K' })
  }
  // inner closed lines enclose a patch of their own unless a cutout already covers them
  const inPatch = l => patches.some(pt => fracOf(l.S, q => F.sampleAt(pt.F, q[0], q[1]) < 0.45) > 0.8)
  for (const l of lines) {
    if (!l.inner) continue
    if (inPatch(l)) { l.absorbed = true; for (const pt of patches) if (fracOf(l.S, q => F.sampleAt(pt.F, q[0], q[1]) < 0.45) > 0.8 && l.plate !== 'K') pt.plate = l.plate; continue }
    if (l.closed && Math.abs(polyArea(l.pts)) >= 3 && !l.ink) { patches.push({ F: F.region([l.pts], M), rings: [l.pts], plate: l.plate, own: true }); l.absorbed = true }
  }
  // S lines and fills
  const sLines = lines.filter(l => l.plate === 'S')
  const base = lines.filter(l => l.plate !== 'S')
  const fillPlate = fills.map(rings => {
    const pts = rings.flatMap(r => densify(r, 0.5, true))
    const v = { K: 0, A: 0, S: 0 }
    for (const q of pts) {
      let best = 0.8, pl = null
      for (const l of lines) { if (l.inner) continue; const d = distToPolyline(q, l.pts, l.closed); if (d < best) { best = d; pl = l.plate } }
      if (pl) v[pl]++
    }
    return v.S > v.K && v.S >= v.A ? 'S' : v.A > v.K * 1.5 ? 'A' : 'K'
  })
  const fieldOfFills = pl => {
    const G = F.field(3)
    fills.forEach((r, i) => { if (fillPlate[i] === pl) F.union(G, F.region(r, M)) })
    return G
  }

  const pieces = []
  const glyphOnly = !hasFill
  const tw = TU.tw || (glyphOnly ? (live ? 2.4 : A.TG) : A.TW)

  // ---- BODY (K) and PARTS (A)
  const kEdge = base.filter(l => l.plate === 'K' && !l.inner)
  const aEdge = base.filter(l => l.plate === 'A' && !l.inner)
  if (glyphOnly) {
    // a pure line glyph: each connected run of lines is one stuffed tube panel; runs that
    // stand apart (the bars of a menu, the waves of wifi) stay separate panels, and the tube
    // slims down so neighbours never fuse
    const all = [...kEdge, ...aEdge]
    const groups = groupLines(all)
    let sep = Infinity
    for (let i = 0; i < groups.length; i++) for (let j = i + 1; j < groups.length; j++) sep = Math.min(sep, groupDist(groups[i], groups[j], Math.min(sep, 4.5)))
    const g = TU.tw || Math.max(1.9, Math.min(tw, sep - 1.45))
    // a run that mixes plates (an arrow's shaft K and head A) is sewn from two pieces, the A piece
    // on top, so the motion can still move the head
    const panel = (ls, plate) => {
      const G = F.strokes(ls.map(l => ({ pts: l.pts, closed: l.closed })), g, M)
      pieces.push(Kit.felt(sc.main, P.fillet(G, 0.5), { part: plate, seam: g >= 2.5 ? ls.map(l => l.closed ? [...l.pts, l.pts[0]] : l.pts) : null, stitch: g >= 2.5 ? 'seam' : false }))
    }
    for (const G0 of groups) {
      const k = G0.filter(l => l.plate !== 'A'), a = G0.filter(l => l.plate === 'A')
      if (k.length) panel(k, 'K')
      if (a.length) panel(a, 'A')
    }
  } else {
    const behind = aEdge.filter(l => l.out > 0.6)
    const front = aEdge.filter(l => l.out <= 0.6)
    if (behind.length) {
      const G = F.strokes(behind.map(l => ({ pts: l.pts, closed: l.closed })), A.TA, M)
      pieces.push(Kit.felt(sc.part, G, { part: 'A', seam: behind.map(l => l.closed ? [...l.pts, l.pts[0]] : l.pts) }))
    }
    // the body: K fills and K outline tubes. Separate bodies (rating stars, a grid of tiles)
    // stay separate panels, and their tubes slim down so they never fuse.
    const items = []
    fills.forEach((r, i) => { if (fillPlate[i] === 'K') items.push({ fill: r, lines: r.map(q => ({ pts: q, closed: true })) }) })
    for (const l of kEdge) items.push({ line: l, lines: [{ pts: l.pts, closed: l.closed, S: l.S }] })
    const groups = groupItems(items)
    let sep = Infinity
    if (groups.length > 1) for (let i = 0; i < groups.length; i++) for (let j = i + 1; j < groups.length; j++) sep = Math.min(sep, groupDist(groups[i].flatMap(it => it.lines), groups[j].flatMap(it => it.lines), Math.min(sep, 4)))
    const twk = groups.length > 1 ? Math.max(1.3, Math.min(tw, sep - 1.3)) : tw
    const body = F.field(3)
    for (const g of groups) {
      const G = F.field(3)
      for (const it of g) if (it.fill) F.union(G, F.region(it.fill, M))
      const ls = g.filter(it => it.line).map(it => ({ pts: it.line.pts, closed: it.line.closed }))
      if (ls.length) F.union(G, F.strokes(ls, twk, M))
      if (!F.any(G)) continue
      F.union(body, G)
      pieces.push(Kit.felt(sc.main, P.fillet(G, groups.length > 1 ? 0.4 : 0.75), { part: 'K' }))
    }
    // patches
    const host = F.offset(F.exact(body, 2), 0.35)
    for (const pt of patches) {
      const G = F.intersect(F.copy(pt.F), host)
      if (!F.any(G)) continue
      const deep = -F.minOf(G)
      if (deep < 0.5) { pieces.push(Kit.flat('ink', G, { part: pt.plate, op: 0.85 })); continue }
      pieces.push(Kit.felt(pt.own && pt.plate === 'A' ? sc.part : sc.patch, G, { part: pt.plate, out: 0.5, stitchMin: 1.35, inset: 0.7, shadeOp: 0.14 }))
    }
    // A fills and front A lines
    const aF = fieldOfFills('A')
    if (front.length) F.union(aF, F.strokes(front.map(l => ({ pts: l.pts, closed: l.closed })), A.TA, M))
    if (F.any(aF)) pieces.push(Kit.felt(sc.part, aF, { part: 'A', seam: front.length && !fills.some((_, i) => fillPlate[i] === 'A') ? front.map(l => l.closed ? [...l.pts, l.pts[0]] : l.pts) : null }))
  }
  // ---- THREADS: interior lines, open cutouts
  const drawn = []
  for (const l of base) {
    if (!l.inner || l.absorbed) continue
    pieces.push(Kit.thread(l.closed ? [...l.pts, l.pts[0]] : l.pts, { w: A.TI, part: l.plate, role: threadOn(pieces, l.pts) }))
    drawn.push(l)
  }
  const near = (q, ls, d) => ls.some(l => distToPolyline(q, l.pts, l.closed) < d)
  for (const subs of cutSubs) for (const s of subs) {
    if (s.closed) continue
    const S = densify(s.pts, 0.3)
    if (fracOf(S, q => near(q, drawn, 0.6)) > 0.5) continue
    if (fracOf(S, q => near(q, kEdge.concat(aEdge), 0.5)) > 0.5) continue
    // only the stretch that lies on felt
    const runs = []
    let cur = []
    for (const q of S) { if (F.sampleAt(fillF, q[0], q[1]) < -0.35) cur.push(q); else { if (cur.length > 1) runs.push(cur); cur = [] } }
    if (cur.length > 1) runs.push(cur)
    if (runs.length) pieces.push(Kit.thread(runs, { w: A.TI, part: 'K', role: threadOn(pieces, runs.flat()) }))
  }
  // ---- KNOTS
  for (const d of dots) {
    if (d.plate === 'S') continue
    const onFelt = hasFill && F.sampleAt(fillF, d.p[0], d.p[1]) < -0.2
    if (onFelt) pieces.push(Kit.knot(d.p[0], d.p[1], 0.95, 'ink', { part: d.plate }))
    else pieces.push(Kit.felt(sc.main, P.circle(d.p[0], d.p[1], tw / 2 + 0.25), { part: d.plate, stitch: false }))
  }
  // ---- BADGE (S)
  if (sLines.length || fillPlate.includes('S')) {
    const closedS = sLines.filter(l => l.closed)
    const outer = closedS.filter(l => !closedS.some(o => o !== l && Math.abs(polyArea(o.pts)) > Math.abs(polyArea(l.pts)) && fracOf(l.pts, q => F.sampleAt(F.region([o.pts], 1), q[0], q[1]) < 0) > 0.9))
    const discF = F.field(3)
    for (const o of outer) F.union(discF, F.region([o.pts], M))
    F.union(discF, fieldOfFills('S'))
    const inDisc = l => F.any(discF) && fracOf(l.S, q => F.sampleAt(discF, q[0], q[1]) < -0.4) > 0.6
    const glyphs = sLines.filter(l => !outer.includes(l) && inDisc(l))
    const tubes = sLines.filter(l => !outer.includes(l) && !inDisc(l))
    const sMass = F.copy(discF)
    if (outer.length) F.union(sMass, F.strokes(outer.map(l => ({ pts: l.pts, closed: true })), A.TA, M))
    const tubeF = tubes.length ? F.strokes(tubes.map(l => ({ pts: l.pts, closed: l.closed })), A.TA, M) : null
    const all = tubeF ? F.union(F.copy(sMass), tubeF) : sMass
    if (F.any(all)) {
      pieces.push(Kit.moat(all, A.MOAT))
      if (F.any(sMass)) pieces.push(Kit.felt(sc.badge, sMass, { part: 'S', inset: 0.7 }))
      if (tubeF) pieces.push(Kit.felt(sc.badge, tubeF, { part: 'S', seam: tubes.map(l => l.pts), stitch: false }))
      if (glyphs.length) pieces.push(Kit.thread(glyphs.map(l => l.closed ? [...l.pts, l.pts[0]] : l.pts), { w: 1.3, role: sc.badge === 'c2' ? 'ink' : 'edge', part: 'S' }))
    }
    for (const d of dots) if (d.plate === 'S') pieces.push(Kit.knot(d.p[0], d.p[1], 0.8, 'edge', { part: 'S' }))
  }
  // ---- TEXT (Live icons)
  // set into a frame: embroidered on the felt under it (light thread on dark felt, ink on light)
  for (const t of textL) {
    if (!t.L.length) continue
    pieces.push(Kit.thread(t.L, { w: textW(t.cap), part: t.plate, role: threadOn(pieces, t.L.flat()), text: true }))
  }
  // free (nothing behind it on the page): a cream felt label sewn on, the text embroidered in ink,
  // so a readout never stands ink-on-page (it would vanish in dark mode)
  pieces.push(...freeText(free))
  return pieces
}
const textW = cap => { try { return textStroke(cap, 1.6) * A.S } catch { return 1.4 } }
export function freeText(free, o = {}) {
  const gl = free.map(g => {
    const L = subsOf(g.d).map(s => (s.closed ? [...s.pts, s.pts[0]] : s.pts).map(T)).filter(L => L.length)
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
    for (const L0 of L) for (const [x, y] of L0) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) }
    return { g, L, box: [x0, y0, x1, y1] }
  }).filter(t => t.L.length)
  if (!gl.length) return []
  // one label per block of text: letters of a word (gap < 3.4u) and stacked rows (gap < 2.4u) share it
  const parent = gl.map((_, i) => i)
  const find = i => parent[i] === i ? i : (parent[i] = find(parent[i]))
  for (let i = 0; i < gl.length; i++) for (let j = i + 1; j < gl.length; j++) {
    const a = gl[i].box, b = gl[j].box
    const gx = Math.max(a[0] - b[2], b[0] - a[2]), gy = Math.max(a[1] - b[3], b[1] - a[3])
    if ((gy < 0 && gx < 3.4) || (gx < 0 && gy < 2.4) || (gx < 1.2 && gy < 1.2)) parent[find(i)] = find(j)
  }
  const blocks = new Map()
  gl.forEach((t, i) => { const r = find(i); if (!blocks.has(r)) blocks.set(r, []); blocks.get(r).push(t) })
  const out = []
  for (const B of blocks.values()) {
    const plate = B[0].g.plate || 'K'
    const w = Math.max(...B.map(t => textW(t.g.cap)))
    const x0 = Math.min(...B.map(t => t.box[0])) - w / 2 - (o.padX ?? 0.85), x1 = Math.max(...B.map(t => t.box[2])) + w / 2 + (o.padX ?? 0.85)
    const y0 = Math.min(...B.map(t => t.box[1])) - w / 2 - (o.padY ?? 0.7), y1 = Math.max(...B.map(t => t.box[3])) + w / 2 + (o.padY ?? 0.7)
    const label = P.rr(Math.max(0.9, x0), Math.max(0.9, y0), Math.min(23.1, x1), Math.min(23.1, y1), Math.min(1.6, (y1 - y0) / 2))
    out.push(Kit.felt(o.role || 'tint', label, { part: plate, stitch: false, out: 0.5, shadeOp: 0.12, hiOp: 0.28 }))
    for (const t of B) out.push(Kit.thread(t.L, { w: textW(t.g.cap), part: plate, role: o.ink || 'ink' }))
  }
  return out
}
export { T, subsOf }
