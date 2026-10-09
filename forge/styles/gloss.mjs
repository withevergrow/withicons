// GLOSS — creative. Inflated, glossy, pillowy: soft vinyl / clay rendered in
// ONE flat colour. The icon is modelled on a signed distance field: strokes and
// fills are fused into one rounded mass, and specular highlights are carved out
// of it as real holes, all lit by one light from the upper-left.
import { snowmanFor } from './_line-snowman.mjs'
import { N, NN, H, X0, gx, segsOf, distField, evenOddMask, maxFilter, sample, contours, ringsToD } from './_gloss-field.mjs'
import { resample, pointInRing } from '../kernel/geom.mjs'
import { splitText, textNodes } from './_live-text.mjs'

// ---- constants (one light, one width, one inset for every icon) -----------
const R = 1.35            // tube radius  (stroke 2.7u)
const RC = 0.55           // closing radius: inner corners rounded
const CW = 1.6            // open-cutout groove width
const TW = 1.75           // live text groove width (the stroke font's weight)
const BORE_ICONS = new Set(['thermometer-level'])
const LABEL_BAND = { 'file-type': [9, 18], 'folder-label': [9, 18] }   // live label faces: their lettering rows (y range, u)   // live icons whose A column sits in a filled bore (see boreGrooves)
const MOAT = 0.75         // clearance carved around S-plate overlays (badges, slashes)
const LIGHT = (() => { const x = -0.55, y = -0.835, l = Math.hypot(x, y); return [x / l, y / l] })()
const BAND = 4.1          // distance fields are exact up to this far from an edge
const CUT_BAND = 4.2      // cutouts only matter this close

// tube streaks
const T_DEPTH = 0.82      // streak centre depth from the lit edge (0.53u from the centreline)
const T_HALF = 0.3       // streak half-width
const T_MIN = 1.6         // shortest streak kept
const T_TRIM = 0.45       // streaks stop this far short of where they could run
const T_MAX = 6.5         // longest streak
// mass beans
const RO = 3.3            // opening radius: a region this deep is a mass; beans ignore smaller bumps
const RIM = 0.5           // minimum body left between any highlight and an edge
const RMIN = 0.1          // tip radius of every tapered highlight
const BTIP = 0.16         // tip radius of a bean
const DOT_GAP = 0.45      // gap between a bean tip and its glint dot
const STEP = 0.1

const sstep = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t) }
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const ci = v => Math.max(1, Math.min(N - 2, Math.round((v - X0) / H)))

export default {
  name: 'gloss',
  title: 'Gloss',
  kind: 'creative',
  description: 'Inflated, glossy and pillowy: soft-vinyl forms with carved specular highlights, in one flat colour.',
  strokeWidth: false,
  root: { fill: 'currentColor' },
  render(full) {
    full = snowmanFor('gloss', full)
    // Live icons: free text (no frame behind it) would inflate into blobs; it is drawn as a crisp round stroke at
    // the weight the stroke font is spaced for (heavier closes the counters of 0 4 6 8 9 % at 24px)
    const { icon, free } = splitText(full)
    const text = textNodes(free, { 'stroke-width': 1.75 })
    let B = null
    try { B = body(icon) } catch { return text }
    if (!B) return text
    let S = B.depth
    try {
      const hl = highlights(B)
      S = new Float32Array(NN)
      // a specular streak never runs through lettering: it would read as a stroke of the letter
      // (nor puts a glint in a counter): no highlight within 0.9u of a glyph stroke or inside a glyph's box
      const T = B.textD, clear = TW / 2 + 0.9, TB = B.textBoxes || []
      const inBox = k => { const x = gx(k % N), y = gx((k - k % N) / N); return TB.some(b => x > b[0] && x < b[2] && y > b[1] && y < b[3]) }
      for (let k = 0; k < NN; k++) S[k] = T && (T[k] < clear || (T[k] < 2.2 && inBox(k))) ? B.depth[k] : Math.min(B.depth[k], hl[k])
    } catch { /* never throw: fall back to the unlit body */ }
    const rings = contours(S, 0)
    let parts = null
    try { parts = plateParts(icon, B, S, rings) } catch { parts = null }
    if (parts) return [...parts, ...text]
    const path = ringsToD(rings)
    return [...(path ? [['path', { d: path, 'fill-rule': 'evenodd' }]] : []), ...text]
  },
}

// ---------------------------------------------------------------------------
// MOTION PARTS (forge/MOTION.md "Parts choreography"). The inflated mass is one field, so plates that touch
// fuse into one blob. Every separate blob whose skeleton is a single plate (an S badge behind its moat, a
// detached A part) becomes its own path tagged wm-k / wm-a / wm-s; a blob mixing plates counts as K.
// Separate blobs never overlap, so the split paints the same shapes (only anti-aliased pixels shared across a
// sub-pixel gap composite a shade differently). Returns null when nothing splits.
// (The carved highlights are holes in the mass, so there is no separate wm-shine node.)
function plateParts(icon, B, S, rings) {
  const lines = (icon.lines || []).filter(l => l.pts && l.pts.length)
  const platesIn = new Set(lines.map(l => l.plate || 'K'))
  if (platesIn.size < 2) return null
  const lab = labelsOf(B.depth)
  const seen = new Map()     // depth blob -> Set of plates
  const mark = (x, y, pl) => {
    const i0 = ci(x), j0 = ci(y)
    let bk = -1, bv = 0
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const k = (j0 + dy) * N + i0 + dx; if (k >= 0 && k < NN && B.depth[k] > bv) { bv = B.depth[k]; bk = k } }
    if (bk < 0 || lab[bk] < 0) return
    if (!seen.has(lab[bk])) seen.set(lab[bk], new Set())
    seen.get(lab[bk]).add(pl)
  }
  for (const l of lines) for (const p of resample(l.pts, 0.5, l.closed)) mark(p.p[0], p.p[1], l.plate || 'K')
  // fills: a fill traced by an A or S path belongs to that plate, any other fill to the body
  const byPl = {}
  for (const l of lines) if (l.plate === 'A' || l.plate === 'S') (byPl[l.plate] ||= []).push(l)
  const dPl = Object.entries(byPl).map(([pl, ls]) => [pl, distField(segsOf(ls), 1)])
  for (const f of icon.fills || []) {
    const rs = (f.set && f.set.length ? f.set : (f.subs || []).map(q => q.pts)).filter(r => r && r.length > 2)
    const pts = rs.flat()
    if (!pts.length) continue
    let pl = 'K'
    for (const [p, dF] of dPl) if (pts.filter(q => sample(dF, q[0], q[1]) < 0.35).length / pts.length > 0.5) { pl = p; break }
    for (const q of pts) mark(q[0], q[1], pl)
  }
  const plateOf = b => { const ps = seen.get(b); return ps && ps.size === 1 ? [...ps][0] : 'K' }
  const groups = { K: [], A: [], S: [] }
  for (const r of rings) {
    // the blob this ring bounds: the deepest body cell beside its first point
    const i0 = ci(r[0][0]), j0 = ci(r[0][1])
    let bk = -1, bv = 0
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const k = (j0 + dy) * N + i0 + dx; if (k >= 0 && k < NN && S[k] > bv) { bv = S[k]; bk = k } }
    const pl = bk >= 0 && lab[bk] >= 0 ? plateOf(lab[bk]) : 'K'
    groups[pl === 'A' || pl === 'S' ? pl : 'K'].push(r)
  }
  if ((groups.K.length > 0) + (groups.A.length > 0) + (groups.S.length > 0) < 2) return null
  const out = []
  for (const pl of ['K', 'A', 'S']) {
    const d = groups[pl].length ? ringsToD(groups[pl]) : ''
    if (d) out.push(['path', { d, 'fill-rule': 'evenodd', class: 'wm-' + pl.toLowerCase() }])
  }
  return out.length > 1 ? out : null
}

// ---------------------------------------------------------------------------
// BODY: union of round strokes and fills, closed (dilate→erode) so inner
// corners are generously rounded, then S-plate moats and cutouts.
function body(icon) {
  // lettering knocked out of a mass (the free text was split off before) is carved as a groove below, never
  // added as mass: its strokes would bridge the field's closing into stray bars between letters
  const cSegs = segsOf((icon.cutouts || []).flatMap(c => (c.subs || []).filter(s => s.pts && s.pts.length).map(s => ({ pts: s.pts, closed: !!s.closed }))))
  const onCut = q => cSegs.some(([ax, ay, bx, by]) => { const ex = bx - ax, ey = by - ay, L2 = ex * ex + ey * ey, px = q[0] - ax, py = q[1] - ay; const t = L2 > 1e-12 ? Math.max(0, Math.min(1, (px * ex + py * ey) / L2)) : 0; return Math.hypot(px - ex * t, py - ey * t) < 0.06 })
  const isGlyph = l => typeof l.pathId === 'string' && l.pathId.startsWith('text:') && cSegs.length > 0 && l.pts.every(onCut)
  const lines = (icon.lines || []).filter(l => l.pts && l.pts.length && !isGlyph(l))
  const baseLines = lines.filter(l => l.plate !== 'S')
  const sLines = lines.filter(l => l.plate === 'S')

  // fills that trace an S path belong to the overlay
  const dS = sLines.length ? distField(segsOf(sLines), 1) : null
  const fillsBase = [], fillsS = []
  for (const f of icon.fills || []) {
    const rings = (f.set && f.set.length ? f.set : (f.subs || []).map(s => s.pts)).filter(r => r && r.length > 2)
    if (!rings.length) continue
    let onS = 0, tot = 0
    if (dS) for (const r of rings) for (const p of r) { tot++; if (sample(dS, p[0], p[1]) < 0.35) onS++ }
    ;(tot && onS / tot > 0.5 ? fillsS : fillsBase).push(rings)
  }

  const base = closedUnion(baseLines, fillsBase)
  const over = closedUnion(sLines, fillsS)
  if (!base && !over) return null
  let depth = base || new Float32Array(NN).fill(-BAND)
  if (over) {
    const dO = over
    for (let k = 0; k < NN; k++) depth[k] = Math.max(Math.min(depth[k], -dO[k] - MOAT), dO[k])
  }
  const shape = Float32Array.from(depth)     // before cutouts: beans follow the silhouette

  // Live text knocked out of a mass is a groove at the font's weight, never a region: a closed glyph (D O 0)
  // cut as a region would take its counter with it (a solid hole where the letter should be)
  // (a cutout sub is lettering when every point lies on a glyph centreline: generators may split a glyph's knock-out
  // at other points than the glyph path itself)
  const gSegs = segsOf((icon.paths || []).filter(p => typeof p.id === 'string' && p.id.startsWith('text:')).flatMap(p => (p.subs || []).filter(s => s.pts && s.pts.length).map(s => ({ pts: s.pts, closed: !!s.closed }))))
  const onGlyph = q => gSegs.some(([ax, ay, bx, by]) => { const ex = bx - ax, ey = by - ay, L2 = ex * ex + ey * ey, px = q[0] - ax, py = q[1] - ay; const t = L2 > 1e-12 ? Math.max(0, Math.min(1, (px * ex + py * ey) / L2)) : 0; return Math.hypot(px - ex * t, py - ey * t) < 0.06 })
  const glyph = { has: pts => gSegs.length > 0 && pts.every(onGlyph) }
  const cutClosed = [], cutOpen = [], cutText = []
  for (const c of icon.cutouts || []) for (const s of c.subs || []) {
    if (!s.pts || !s.pts.length) continue
    if (glyph.has(s.pts)) cutText.push({ pts: s.pts, closed: !!s.closed })
    // a label face's lettering band holds lettering only: a knock-out there that is not a glyph of this word is a
    // stray piece of one (never carve it as a groove of its own)
    else if (icon.params && LABEL_BAND[icon.name] && s.pts.every(q => q[1] > LABEL_BAND[icon.name][0] && q[1] < LABEL_BAND[icon.name][1])) continue
    else if (s.closed && s.pts.length > 2) cutClosed.push(s.pts); else cutOpen.push({ pts: s.pts, closed: false })
  }
  // Live level columns (a thermometer's mercury): an A line inside a filled stem would vanish into the mass. The
  // empty part of the bore beyond its end is carved as a groove, so the column reads as the black left standing.
  if (icon.params && BORE_ICONS.has(icon.name)) for (const g of boreGrooves(baseLines, fillsBase)) cutOpen.push(g)
  let textD = null
  if (cutText.length) {
    const dt = exactDist(segsOf(cutText), 2.2)
    textD = dt
    for (let k = 0; k < NN; k++) { if (dt[k] >= 2.2) continue; const v = dt[k] - TW / 2; if (v < depth[k]) depth[k] = v }
  }
  if (cutClosed.length) {
    const m = evenOddMask(cutClosed)
    const df = distField(segsOf(cutClosed.map(pts => ({ pts, closed: true }))), CUT_BAND)
    for (let k = 0; k < NN; k++) { if (!m[k] && df[k] >= CUT_BAND) continue; const v = m[k] ? -df[k] : df[k]; if (v < depth[k]) depth[k] = v }
  }
  if (cutOpen.length) {
    const dc = distField(segsOf(cutOpen), CUT_BAND)
    for (let k = 0; k < NN; k++) { if (dc[k] >= CUT_BAND) continue; const v = dc[k] - CW / 2; if (v < depth[k]) depth[k] = v }
  }
  // the column itself runs in a channel: the stem is carved around it and the mercury left standing as a rod, so a
  // column that fills the whole bore still reads as a moving part (not as the solid stem)
  if (icon.params && BORE_ICONS.has(icon.name)) {
    const rods = boreRods(baseLines, fillsBase)
    if (rods.length) {
      const dc = exactDist(segsOf(rods), 2.2)
      for (let k = 0; k < NN; k++) { if (dc[k] >= 2.2) continue; const v = dc[k] - 1.15; if (v < depth[k]) depth[k] = v }
      for (let k = 0; k < NN; k++) { if (dc[k] >= 2.2) continue; const v = 0.5 - dc[k]; if (v > depth[k]) depth[k] = v }
    }
  }
  const textBoxes = cutText.length ? (icon.paths || []).filter(p => typeof p.id === 'string' && p.id.startsWith('text:')).map(p => {
    const P = (p.subs || []).flatMap(s => s.pts || [])
    return P.length ? [Math.min(...P.map(q => q[0])) - 0.3, Math.min(...P.map(q => q[1])) - 0.3, Math.max(...P.map(q => q[0])) + 0.3, Math.max(...P.map(q => q[1])) + 0.3] : null
  }).filter(Boolean) : null
  return { depth, shape, lines, textD, textBoxes }
}

// exact unsigned distance to segments within band (glyph grooves: the propagated distField can leak a sliver into
// a small counter, which reads as a broken letter)
function exactDist(segs, band) {
  const f = new Float32Array(NN).fill(band)
  for (const [ax, ay, bx, by] of segs) {
    const i0 = ci(Math.min(ax, bx) - band), i1 = ci(Math.max(ax, bx) + band), j0 = ci(Math.min(ay, by) - band), j1 = ci(Math.max(ay, by) + band)
    const ex = bx - ax, ey = by - ay, L2 = ex * ex + ey * ey
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
      const px = gx(i) - ax, py = gx(j) - ay
      let t = L2 > 1e-12 ? (px * ex + py * ey) / L2 : 0; t = t < 0 ? 0 : t > 1 ? 1 : t
      const d = Math.hypot(px - ex * t, py - ey * t), k = j * N + i
      if (d < f[k]) f[k] = d
    }
  }
  return f
}

// straight open A lines inside a fill: the stretch of fill beyond the line's far end (>= 1.1u from the fill's
// edge), less a 1u gap, as an open groove polyline
export function boreGrooves(lines, fills) {
  const out = []
  const rings = fills.flat()
  if (!rings.length) return out
  const inside = p => rings.reduce((a, r) => pointInRing(p, r) ? !a : a, false)
  const edge = segsOf(rings.map(pts => ({ pts, closed: true })))
  const dEdge = edge.length ? distField(edge, 3) : null
  for (const l of lines) {
    if (l.plate !== 'A' || l.closed || l.pts.length < 2) continue
    const a = l.pts[0], b = l.pts[l.pts.length - 1], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 2 || !l.pts.every(p => inside(p))) continue
    const u = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    if (l.pts.some(p => Math.abs((p[0] - a[0]) * u[1] - (p[1] - a[1]) * u[0]) > 0.05)) continue // straight only
    let t = 1.0, last = null
    for (; t < 24; t += 0.1) {
      const q = [b[0] + u[0] * t, b[1] + u[1] * t]
      if (!inside(q) || (dEdge && sample(dEdge, q[0], q[1]) < 1.1)) break
      last = q
    }
    const s0 = [b[0] + u[0] * 1.0, b[1] + u[1] * 1.0]
    if (last && Math.hypot(last[0] - s0[0], last[1] - s0[1]) >= 0.4) out.push({ pts: [s0, last], closed: false })
  }
  return out
}

// the part of a live level column (a straight A line inside a fill) that runs in the narrow stem (not the bulb)
function boreRods(lines, fills) {
  const out = []
  const rings = fills.flat()
  if (!rings.length) return out
  const inside = p => rings.reduce((a, r) => pointInRing(p, r) ? !a : a, false)
  const edge = segsOf(rings.map(pts => ({ pts, closed: true })))
  const dEdge = edge.length ? distField(edge, 4) : null
  if (!dEdge) return out
  for (const l of lines) {
    if (l.plate !== 'A' || l.closed || l.pts.length !== 2) continue
    const [a, b] = l.pts, L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 2 || !inside(a) || !inside(b)) continue
    let s0 = null, s1 = null
    for (let t = 0; t <= L; t += 0.1) {
      const q = [a[0] + (b[0] - a[0]) * t / L, a[1] + (b[1] - a[1]) * t / L]
      if (sample(dEdge, q[0], q[1]) < 2.6) { if (!s0) s0 = q; s1 = q }
    }
    if (s0 && s1 && Math.hypot(s1[0] - s0[0], s1[1] - s0[1]) >= 0.5) out.push({ pts: [s0, s1], closed: false })
  }
  return out
}

// approximate SDF (inside positive) of round strokes ∪ fills, exact outside
function primitive(lines, fillRings) {
  if (!lines.length && !fillRings.length) return null
  const band = R + RC + 0.4
  const P = new Float32Array(NN).fill(-band)
  if (lines.length) {
    const dl = distField(segsOf(lines), band)
    for (let k = 0; k < NN; k++) P[k] = R - dl[k]
  }
  if (fillRings.length) {
    const m = new Uint8Array(NN)
    for (const rings of fillRings) evenOddMask(rings, m)
    const df = distField(segsOf(fillRings.flat().map(pts => ({ pts, closed: true }))), RC + 0.45)
    for (let k = 0; k < NN; k++) { const v = m[k] ? band : -df[k] * (df[k] >= RC + 0.45 ? 9 : 1); if (v > P[k]) P[k] = v }
  }
  return P
}

// Close each connected part separately: inner corners round off, but separate
// parts that merely come close (a slider knob and the next rail) never fuse.
function closedUnion(lines, fills) {
  const P = primitive(lines, fills)
  if (!P) return null
  const lab = new Int32Array(NN).fill(-1), stack = []
  let nc = 0
  for (let k = 0; k < NN; k++) {
    if (lab[k] >= 0 || P[k] <= 0) continue
    lab[k] = nc; stack.push(k)
    while (stack.length) {
      const c = stack.pop(), i = c % N
      for (const q of [i > 0 ? c - 1 : -1, i < N - 1 ? c + 1 : -1, c - N, c + N]) {
        if (q < 0 || q >= NN || lab[q] >= 0 || P[q] <= 0) continue
        lab[q] = nc; stack.push(q)
      }
    }
    nc++
  }
  if (nc <= 1) return closeField(P)
  // union-find over components touched by the same primitive
  const par = Array.from({ length: nc }, (_, i) => i)
  const find = a => { while (par[a] !== a) a = par[a] = par[par[a]]; return a }
  const labelsOf = pts => {
    const out = new Set()
    for (let q = 0; q < pts.length; q += 3) {
      const i = ci(pts[q][0]), j = ci(pts[q][1])
      let bk = -1, bv = 0
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const k = (j + dy) * N + i + dx; if (k >= 0 && k < NN && P[k] > bv) { bv = P[k]; bk = k } }
      if (bk >= 0 && lab[bk] >= 0) out.add(lab[bk])
    }
    return [...out]
  }
  const prims = [...lines.map(l => ({ l, ls: labelsOf(l.pts) })), ...fills.map(f => ({ f, ls: labelsOf(f.flat()) }))]
  for (const p of prims) if (!p.ls.length) p.ls = [0]
  for (const p of prims) for (let q = 1; q < p.ls.length; q++) par[find(p.ls[q])] = find(p.ls[0])
  const groups = new Map()
  for (const p of prims) {
    if (!p.ls.length) continue
    const g = find(p.ls[0])
    if (!groups.has(g)) groups.set(g, { lines: [], fills: [] })
    if (p.l) groups.get(g).lines.push(p.l); else groups.get(g).fills.push(p.f)
  }
  if (groups.size <= 1) return closeField(P)
  let out = null
  for (const g of groups.values()) {
    const c = closeField(primitive(g.lines, g.fills))
    if (!out) out = c; else for (let k = 0; k < NN; k++) if (c[k] > out[k]) out[k] = c[k]
  }
  return out
}

// morphological closing by RC; returns the exact signed distance of the result
function closeField(P) {
  const rings = contours(P, -RC)
  const D = distField(segsOf(rings.map(pts => ({ pts: thin(pts), closed: true }))), BAND)
  const out = new Float32Array(NN)
  for (let k = 0; k < NN; k++) out[k] = P[k] > -RC ? D[k] - RC : -D[k] - RC
  return out
}
function thin(pts) {
  const out = [pts[0]]
  for (let i = 1; i < pts.length; i++) {
    const a = out[out.length - 1], b = pts[i]
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) > 0.18 || i === pts.length - 1) out.push(b)
  }
  return out
}

// ---------------------------------------------------------------------------
// HIGHLIGHTS: a field that is negative inside every carved highlight.
function highlights(B) {
  const d = B.depth
  const hl = new Float32Array(NN).fill(9)
  const T = maxFilter(d, 28)            // local thickness: tubes ~R, masses larger
  const dots = []
  const blob = labelsOf(B.shape), runs = [], near = new Uint8Array(NN)
  const open = opened(B.shape)     // the big form: bumps thinner than 2*RO removed
  const lit = open ? beans(open, d, hl, dots, blob, near) : new Set()
  streaks(B, d, T, hl, runs, near)
  streakDots(runs, blob, lit, d, dots)
  const rim = rimLight(B.shape, open, d, T)
  pruneSmall(rim, d, 0.45)
  for (let k = 0; k < NN; k++) if (rim[k] < hl[k]) hl[k] = rim[k]
  pruneSmall(hl, d, 0.25)
  for (const [x, y, r] of dots) splat(x, y, r, d, hl)
  glintEveryBlob(d, hl)
  return hl
}

// reflected light: a hairline just inside the shadow-side silhouette of masses
const RIM_D = 0.5, RIM_HALF = 0.15
function rimLight(shape, open, d, T) {
  if (!open) return new Float32Array(NN).fill(9)
  const hl = new Float32Array(NN).fill(9)
  for (let j = 1; j < N - 1; j++) for (let i = 1; i < N - 1; i++) {
    const k = j * N + i
    const sv = shape[k]
    // only on the smooth big form: never on teeth, scallops or other small bumps
    if (sv < 0.2 || sv > 0.9 || d[k] < 0.25 || T[k] < RO - 0.3 || open[k] < sv - 0.08) continue
    let ox = shape[k - 1] - shape[k + 1], oy = shape[k - N] - shape[k + N]
    const ol = Math.hypot(ox, oy); if (ol < 1e-6) continue
    const f = (ox * LIGHT[0] + oy * LIGHT[1]) / ol
    const g = sstep(0.3, 0.8, -f)
    if (g <= 0) continue
    const v = Math.abs(sv - RIM_D) - RIM_HALF * g + 0.02
    if (v < hl[k]) hl[k] = v
  }
  return hl
}

// carve a disc (clipped so a RIM of body always remains)
function splat(x, y, r, d, hl) {
  const pad = r + 0.25
  const i0 = ci(x - pad), i1 = ci(x + pad), j0 = ci(y - pad), j1 = ci(y + pad)
  for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
    const k = j * N + i
    const v = Math.max(Math.hypot(gx(i) - x, gx(j) - y) - r, RIM - d[k])
    if (v < hl[k]) hl[k] = v
  }
}
const sweep = (cen, wid, d, hl) => cen.forEach((p, q) => splat(p[0], p[1], wid[q], d, hl))

// ---- tube streaks: one per lit run of every stroke -------------------------------
function streaks(B, d, T, hl, runs, near) {
  const off = R - T_DEPTH
  for (const l of B.lines) {
    if (l.pts.length < 2) continue
    const pts = resample(l.pts, STEP, l.closed).map(o => o.p)
    if (l.closed && pts.length > 2 && Math.hypot(pts[0][0] - pts.at(-1)[0], pts[0][1] - pts.at(-1)[1]) < STEP * 0.5) pts.pop()
    const n = pts.length
    if (n < 4) continue
    const at = k => l.closed ? pts[(k % n + n) % n] : pts[Math.max(0, Math.min(n - 1, k))]
    const info = pts.map((p, k) => {
      const a = at(k - 2), b = at(k + 2)
      let tx = b[0] - a[0], ty = b[1] - a[1]; const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl
      const nx = -ty, ny = tx, fd = nx * LIGHT[0] + ny * LIGHT[1]
      const s = fd >= 0 ? 1 : -1, f = Math.abs(fd)
      const c = [p[0] + nx * s * off, p[1] + ny * s * off]
      const ok = f >= 0.1
        && Math.abs(sample(d, c[0], c[1]) - T_DEPTH) < 0.13
        && sample(d, p[0] + nx * s * (R + 0.15), p[1] + ny * s * (R + 0.15)) < 0
        && sample(T, c[0], c[1]) < RO - 0.3
        && !near[ci(c[1]) * N + ci(c[0])]
      return { c, f, s, ok }
    })
    // contiguous valid runs with a consistent lit side
    let start = 0
    if (l.closed) { start = info.findIndex(v => !v.ok); if (start < 0) start = 0 }
    let run = []
    const flush = () => {
      if (run.length) emitStreak(run, d, hl, runs)
      run = []
    }
    for (let q = 0; q < n; q++) {
      const v = info[(start + q) % n]
      if (!v.ok || (run.length && run[run.length - 1].s !== v.s)) flush()
      if (v.ok) run.push(v)
    }
    flush()
  }
}
function emitStreak(run, d, hl, runs) {
  const L = (run.length - 1) * STEP
  if (L < T_MIN + 2 * T_TRIM) return
  let a = Math.round(T_TRIM / STEP), b = run.length - 1 - a
  // long runs get a glint, not an inline: T_MAX long, set in from the lit end
  const avail = b - a, mx = Math.round(T_MAX / STEP)
  if (avail > mx) {
    const qa = run[a].c[0] * LIGHT[0] + run[a].c[1] * LIGHT[1], qb = run[b].c[0] * LIGHT[0] + run[b].c[1] * LIGHT[1]
    const o = Math.min(Math.round(0.15 * avail), avail - mx)
    if (qa >= qb) { a += o; b = a + mx } else { b -= o; a = b - mx }
  }
  const len = (b - a) * STEP
  const cen = [], wid = []
  for (let q = a; q <= b; q++) {
    const u = (q - a) / Math.max(1, b - a)
    const g = 0.45 + 0.55 * sstep(0.1, 0.6, run[q].f)
    cen.push(run[q].c)
    wid.push(RMIN + (T_HALF * g - RMIN) * Math.pow(Math.sin(Math.PI * u), 0.45))
  }
  // light smoothing of the centre so junction wobble never shows
  const sm = cen.map((p, q) => {
    let sx = 0, sy = 0, c = 0
    for (let r = -3; r <= 3; r++) { const o = cen[Math.max(0, Math.min(cen.length - 1, q + r))]; sx += o[0]; sy += o[1]; c++ }
    return [sx / c, sy / c]
  })
  sweep(sm, wid, d, hl)
  runs.push({ sm, len, score: len * wid.reduce((a, b) => a + b, 0) / wid.length })
}

// a glint dot continuing the best streak of every blob that has no bean
function streakDots(runs, blob, lit, d, dots) {
  const best = new Map()
  for (const r of runs) {
    const m = r.sm[r.sm.length >> 1], b = blob[ci(m[1]) * N + ci(m[0])]
    if (b < 0 || lit.has(b)) continue
    if (!best.has(b) || r.score > best.get(b).score) best.set(b, r)
  }
  const PD = [LIGHT[1], -LIGHT[0]]
  for (const r of best.values()) {
    if (r.len < 3) continue
    const P = r.sm, n = P.length
    const ends = [[P[0], P[Math.min(n - 1, 5)]], [P[n - 1], P[Math.max(0, n - 6)]]]
    ends.sort((a, b) => (b[0][0] * PD[0] + b[0][1] * PD[1]) - (a[0][0] * PD[0] + a[0][1] * PD[1]))
    const rd = T_HALF * 0.95, gap = DOT_GAP * 0.8 + rd + RMIN
    for (const [e, nb] of ends) {
      let tx = e[0] - nb[0], ty = e[1] - nb[1]; const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl
      const x = e[0] + tx * gap, y = e[1] + ty * gap, dv = sample(d, x, y)
      if (dv < T_DEPTH - 0.12 || dv > T_DEPTH + 0.3) continue
      dots.push([x, y, rd])
      break
    }
  }
}

// ---- mass beans: one crescent per mass on its best-lit stretch of silhouette ------
function beans(shape, d, hl, dots, blobOf, near) {
  const { lab, comps } = cores(shape)
  const cands = []
  const byLevel = new Map()
  for (const c of comps) {
    if (c.area < 0.04) continue
    const rEst = Math.sqrt(c.area / Math.PI) + RO
    c.depth0 = Math.round(clamp(0.26 * rEst, 1.3, 1.95) * 20) / 20
    c.halfLen = clamp(0.6 * rEst, 1.8, 4.2)
    c.halfW = clamp(0.14 * rEst, 0.4, 0.85)
    if (!byLevel.has(c.depth0)) byLevel.set(c.depth0, [])
    byLevel.get(c.depth0).push(c)
  }
  for (const [lvl, cs] of byLevel) {
    const L = levelRings(shape, lvl, p => owner(shape, lab, ci(p[0]), ci(p[1])), d)
    for (const c of cs) { const b = placeBean(c, L.rings, L.info, L.hole, d, hl, dots, near); if (b) cands.push({ ...b, blob: blobOf[c.seed] }) }
  }
  // one bean per separate blob: the best-lit core wins
  const best = new Map()
  for (const b of cands) if (!best.has(b.blob) || b.score > best.get(b.blob).score) best.set(b.blob, b)
  // A mass whose smoothed form is hollowed out by cutouts (ban, target, film,
  // monitor, battery ...) has no window at bean depth. Give it a slimmer bean
  // on the real body instead, at half its real thickness.
  const miss = new Map()
  for (const c of comps) {
    const b = blobOf[c.seed]
    if (c.area < 1 || best.has(b) || c.depth0 === undefined) continue
    if (!miss.has(b) || c.area > miss.get(b).area) miss.set(b, c)
  }
  if (miss.size) {
    const mx = new Map()
    for (let k = 0; k < NN; k++) { const b = blobOf[k]; if (b >= 0 && miss.has(b) && d[k] > (mx.get(b) || 0)) mx.set(b, d[k]) }
    for (const [b, c] of miss) {
      const md = mx.get(b) || 0
      if (md < 1.75) continue
      const lvl = Math.round(clamp(0.5 * md, 0.8, 1.5) * 20) / 20
      const c2 = { ...c, depth0: lvl, halfLen: clamp(c.halfLen, 1.8, 3.4), halfW: clamp(0.3 * md, 0.34, 0.6) }
      const L = levelRings(d, lvl, p => blobOf[ci(p[1]) * N + ci(p[0])] === b ? c.id : -1, d)
      const r = placeBean(c2, L.rings, L.info, L.hole, d, hl, dots, near)
      if (r) best.set(b, r)
    }
  }
  for (const [b, v] of [...best]) if (v.draw() === false) best.delete(b)
  return new Set(best.keys())
}
// iso-contours of a field at one level, resampled, with per-point lighting info
function levelRings(F, lvl, own, d) {
  const raw = contours(F, lvl).filter(r => r.length > 8)
  const rings = raw.map(r => {
    const s = resample(r, STEP, true).map(o => o.p)
    if (s.length > 2 && Math.hypot(s[0][0] - s.at(-1)[0], s[0][1] - s.at(-1)[1]) < STEP * 0.5) s.pop()
    return s.length >= 3 ? s : r
  })
  const hole = raw.map((r, i) => raw.reduce((acc, o, j) => j !== i && pointInRing(r[0], o) ? !acc : acc, false))
  const info = rings.map(r => {
    const sm = smoothRing(r, 12)
    return r.map((p, k) => {
      const a = sm[(k - 3 + r.length) % r.length], b = sm[(k + 3) % r.length]
      let tx = b[0] - a[0], ty = b[1] - a[1]; const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl
      // outward = the side where the field decreases
      let nx = -ty, ny = tx
      if (sample(F, p[0] + nx * 0.2, p[1] + ny * 0.2) > sample(F, p[0] - nx * 0.2, p[1] - ny * 0.2)) { nx = -nx; ny = -ny }
      return { f: nx * LIGHT[0] + ny * LIGHT[1], own: own(p), q: p[0] * LIGHT[0] + p[1] * LIGHT[1], sm: sm[k], dt: sample(d, sm[k][0], sm[k][1]) }
    })
  })
  return { rings, info, hole }
}
function labelsOf(f) {
  const lab = new Int32Array(NN).fill(-1), stack = []
  let id = 0
  for (let k = 0; k < NN; k++) {
    if (lab[k] >= 0 || f[k] <= 0) continue
    lab[k] = id; stack.push(k)
    while (stack.length) {
      const c = stack.pop(), i = c % N
      for (const q of [i > 0 ? c - 1 : -1, i < N - 1 ? c + 1 : -1, c - N, c + N]) {
        if (q < 0 || q >= NN || lab[q] >= 0 || f[q] <= 0) continue
        lab[q] = id; stack.push(q)
      }
    }
    id++
  }
  return lab
}
// morphological opening by RO as a distance field: bumps thinner than 2*RO
// (gear teeth, scallops, lids, handles) vanish, so beans follow the big form
function opened(shape) {
  const rings = contours(shape, RO)
  if (!rings.length) return null
  const dE = distField(segsOf(rings.map(pts => ({ pts: thin(pts), closed: true }))), RO + 0.3)
  const g = new Float32Array(NN)
  for (let k = 0; k < NN; k++) g[k] = shape[k] >= RO ? shape[k] : RO - dE[k]
  return g
}
function smoothRing(r, S) {
  const n = r.length
  return r.map((_, k) => {
    let sx = 0, sy = 0
    for (let q = -S; q <= S; q++) { const p = r[(k + q + n * 8) % n]; sx += p[0]; sy += p[1] }
    return [sx / (2 * S + 1), sy / (2 * S + 1)]
  })
}

function cores(shape) {
  const lab = new Int32Array(NN).fill(-1)
  const comps = [], stack = []
  for (let k = 0; k < NN; k++) {
    if (shape[k] < RO || lab[k] >= 0) continue
    const id = comps.length
    let n = 0
    lab[k] = id; stack.push(k)
    while (stack.length) {
      const c = stack.pop(); n++
      const i = c % N
      for (const q of [i > 0 ? c - 1 : -1, i < N - 1 ? c + 1 : -1, c - N, c + N]) {
        if (q < 0 || q >= NN || lab[q] >= 0 || shape[q] < RO) continue
        lab[q] = id; stack.push(q)
      }
    }
    comps.push({ id, seed: k, area: n * H * H })
  }
  return { lab, comps }
}

// walk up the depth gradient to a core; return its label
function owner(d, lab, i, j) {
  let x = i, y = j
  for (let s = 0; s < 60; s++) {
    const k = y * N + x
    if (lab[k] >= 0) return lab[k]
    let bk = k, bv = d[k]
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      if (x + dx < 0 || x + dx >= N || y + dy < 0 || y + dy >= N) continue
      const q = (y + dy) * N + (x + dx)
      if (d[q] > bv) { bv = d[q]; bk = q }
    }
    if (bk === k) return -1
    x = bk % N; y = (bk - x) / N
  }
  return -1
}

function placeBean(c, rings, info, hole, d, hl, dots, near) {
  const M = Math.round(2 * c.halfLen / STEP)
  let best = -Infinity, bR = -1, bS = 0, bM = 0
  rings.forEach((r, ri) => {
    const inf = info[ri], n = inf.length
    const wHole = hole[ri] ? 0.55 : 1
    // a window is usable only where this mass owns the contour and the real
    // body (after cutouts) is as deep as the smoothed form says
    const bad = inf.map(v => v.own !== c.id || v.dt < c.depth0 - 0.2)
    const sc = inf.map(v => wHole * Math.max(0, v.f - 0.4))
    const badPre = new Int32Array(2 * n + 1)
    for (let q = 0; q < 2 * n; q++) badPre[q + 1] = badPre[q] + (bad[q % n] ? 1 : 0)
    for (const frac of [1, 0.72, 0.5]) {
      const m = Math.min(Math.round(M * frac), Math.floor(n * 0.4))
      if (m < 14) continue
      for (let i = 0; i < n; i++) {
        if (badPre[i + m] - badPre[i]) continue
        let sum = 0, ws = 0
        for (let k = 0; k < m; k++) { const w = 1 - 0.6 * Math.abs(2 * k / (m - 1) - 1); sum += sc[(i + k) % n] * w; ws += w }
        sum /= ws
        if (sum < 0.12) continue
        sum += 0.015 * inf[(i + (m >> 1)) % n].q + 0.15 * m / M
        if (sum > best) { best = sum; bR = ri; bS = i; bM = m }
      }
    }
  })
  if (bR < 0) return null
  return { score: best, draw: () => drawBean(c, info[bR], bS, bM, M, d, hl, dots, near) }
}
function drawBean(c, inf, bS, bM, M, d, hl, dots, near) {
  const n = inf.length
  // the bean is a clean parabolic arc fitted to the chosen stretch of contour
  const win = []
  for (let k = 0; k < bM; k++) win.push(inf[(bS + k) % n].sm)
  const { at, L } = fitCurve(win)
  const cen = [], wid = []
  const hw = c.halfW * Math.sqrt(bM / M)
  for (let k = 0; k < bM; k++) {
    cen.push(at(L * k / (bM - 1)))
    wid.push(BTIP + (hw - BTIP) * Math.pow(Math.sin(Math.PI * k / (bM - 1)), 0.5))
  }
  // a bean mostly clipped away by the safety rim is not drawn at all: streaks take over
  const shown = cen.filter((p, q) => sample(d, p[0], p[1]) > RIM + 0.5 * wid[q]).length / cen.length
  if (shown < 0.5) return false
  sweep(cen, wid, d, hl)
  // no tube streak may run alongside a bean
  for (let q = 0; q < cen.length; q += 3) {
    const r = 1.9 + hw, i0 = ci(cen[q][0] - r), i1 = ci(cen[q][0] + r), j0 = ci(cen[q][1] - r), j1 = ci(cen[q][1] + r)
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) if (Math.hypot(gx(i) - cen[q][0], gx(j) - cen[q][1]) < r) near[j * N + i] = 1
  }
  // glint dot continuing the arc beyond the end that lies further toward the lower-left
  const PD = [LIGHT[1], -LIGHT[0]]
  const a = cen[0], b = cen[bM - 1]
  const rdot = clamp(0.8 * hw, 0.3, 0.46)
  const gap = DOT_GAP + rdot + BTIP
  const us = (a[0] * PD[0] + a[1] * PD[1]) > (b[0] * PD[0] + b[1] * PD[1]) ? [-gap, L + gap] : [L + gap, -gap]
  for (const u of us) {
    const p = at(u)
    if (sample(d, p[0], p[1]) < rdot + RIM + 0.1) continue
    dots.push([p[0], p[1], rdot])
    break
  }
  return true
}

// least-squares parabola through a stretch of points, in the frame of its chord
function fitCurve(pts) {
  const o = pts[0], z = pts[pts.length - 1]
  let ex = z[0] - o[0], ey = z[1] - o[1]
  const L = Math.hypot(ex, ey) || 1e-6
  ex /= L; ey /= L
  const nx = -ey, ny = ex
  let s0 = 0, s1 = 0, s2 = 0, s3 = 0, s4 = 0, t0 = 0, t1 = 0, t2 = 0
  for (const p of pts) {
    const dx = p[0] - o[0], dy = p[1] - o[1], u = dx * ex + dy * ey, v = dx * nx + dy * ny, u2 = u * u
    s0++; s1 += u; s2 += u2; s3 += u2 * u; s4 += u2 * u2; t0 += v; t1 += u * v; t2 += u2 * v
  }
  const M = [[s4, s3, s2, t2], [s3, s2, s1, t1], [s2, s1, s0, t0]]
  for (let c = 0; c < 3; c++) {
    let piv = c
    for (let r = c + 1; r < 3; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r
    ;[M[c], M[piv]] = [M[piv], M[c]]
    const pv = M[c][c] || 1e-12
    for (let r = 0; r < 3; r++) if (r !== c) { const f = M[r][c] / pv; for (let q = c; q < 4; q++) M[r][q] -= f * M[c][q] }
  }
  let A = M[0][3] / (M[0][0] || 1e-12), B = M[1][3] / (M[1][1] || 1e-12), C = M[2][3] / (M[2][2] || 1e-12)
  if (!isFinite(A + B + C)) { A = 0; B = 0; C = 0 }
  // keep the arc gentle: sagitta at most a quarter of the chord
  const sag = Math.abs(A) * L * L / 4
  if (sag > 0.25 * L) { const s = 0.25 * L / sag; A *= s; B *= s }
  const at = u => { const v = A * u * u + B * u + C; return [o[0] + ex * u + nx * v, o[1] + ey * u + ny * v] }
  return { at, L }
}

function pruneSmall(hl, d, minArea) {
  const seen = new Uint8Array(NN), stack = []
  for (let k = 0; k < NN; k++) {
    if (seen[k] || !(hl[k] < 0 && d[k] > 0)) continue
    const list = []
    seen[k] = 1; stack.push(k)
    while (stack.length) {
      const c = stack.pop(); list.push(c)
      const i = c % N
      for (const q of [i > 0 ? c - 1 : -1, i < N - 1 ? c + 1 : -1, c - N, c + N]) {
        if (q < 0 || q >= NN || seen[q] || !(hl[q] < 0 && d[q] > 0)) continue
        seen[q] = 1; stack.push(q)
      }
    }
    if (list.length * H * H < minArea) for (const c of list) hl[c] = 9
  }
}

// every separate blob (dots, beads, short dashes) gets at least a glint
function glintEveryBlob(d, hl) {
  const lab = new Int32Array(NN).fill(-1), stack = []
  const PD = [LIGHT[1], -LIGHT[0]]
  let id = 0
  for (let k = 0; k < NN; k++) {
    if (lab[k] >= 0 || d[k] <= 0) continue
    let lit = false, maxD = 0, cx = 0, cy = 0
    const cells = []
    lab[k] = id; stack.push(k)
    while (stack.length) {
      const c = stack.pop()
      cells.push(c)
      if (hl[c] < 0) lit = true
      if (d[c] > maxD) { maxD = d[c]; cx = gx(c % N); cy = gx((c - c % N) / N) }
      const i = c % N
      for (const q of [i > 0 ? c - 1 : -1, i < N - 1 ? c + 1 : -1, c - N, c + N]) {
        if (q < 0 || q >= NN || lab[q] >= 0 || d[q] <= 0) continue
        lab[q] = id; stack.push(q)
      }
    }
    id++
    if (lit || maxD < 0.8) continue
    // a bead-sized shine: a short curved pill toward the light, plus a pin-prick
    const dd = clamp(0.5 * maxD, 0.8, 1.25)
    let best = -Infinity, ax = 0, ay = 0
    for (const c of cells) {
      if (Math.abs(d[c] - dd) > 0.07) continue
      const x = gx(c % N), y = gx((c - c % N) / N), q = x * LIGHT[0] + y * LIGHT[1]
      if (q > best) { best = q; ax = x; ay = y }
    }
    if (best === -Infinity) continue
    let ix = cx - ax, iy = cy - ay; const il = Math.hypot(ix, iy) || 1; ix /= il; iy /= il
    const r = clamp(0.16 * maxD + 0.05, 0.26, 0.38), hlen = clamp(0.35 * maxD, 0.3, 0.75), kap = 0.3 / Math.max(1, maxD)
    for (let t = -hlen; t <= hlen + 1e-9; t += 0.05) {
      const w = r * (1 - 0.45 * (t / hlen) ** 2)
      splat(ax + PD[0] * t + ix * kap * t * t, ay + PD[1] * t + iy * kap * t * t, w, d, hl)
    }
    if (maxD >= 1.8) {
      const t = hlen + 0.3 + 0.17 + 0.1
      splat(ax + PD[0] * t + ix * (kap * t * t), ay + PD[1] * t + iy * (kap * t * t), 0.17, d, hl)
    }
  }
}
