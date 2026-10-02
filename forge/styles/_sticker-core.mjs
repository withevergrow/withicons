// STICKER core — builds the layered die-cut sticker for one prepared icon.
//
// Layers, bottom to top:
//   shadow   the die-cut, nudged down-right, at low opacity
//   edge     the die-cut: art silhouette dilated by BORDER and closed (puffy,
//            no inner holes), paper white with a currentColor hairline
//   fills    the author's fills in candy colours (K mass primary, A parts accent),
//            closed cutouts become printed panels (doors, screens, lenses)
//   tubes    lines that live outside the mass (handles, rays, arrows, menu bars)
//            become fat candy tubes with an ink outline
//   ink      every other centreline, bold, round
//   shine    one glossy dash + dot on the top-left of the biggest colour area
//   signals  badges, slashes and modifiers: mini stickers with their own paper rim
//   sparkle  1-2 four-point sparkles (sometimes a heart or star) in free corners
import { parsePath, simplify, area, pointInRing, distToPolyline, arclen, bbox, rng, fmt, resample, V } from '../kernel/geom.mjs'
import * as F from './_sticker-field.mjs'
import { subpaths, emit, raw, tp, splineD, sparkleD, heartD, starD } from './_sticker-path.mjs'
import { colours, signalColour, VAR, EDGE, INK, SHINE, SHADOW } from './_sticker-tune.mjs'

export const K = {
  SCALE: 0.84,            // art scale about the centre
  SHIFT: [-0.25, -0.35],  // optical centring of sticker + shadow
  INK: 1.5,               // ink line width (final units)
  TUBE: 2.0,              // candy tube core
  TUBE_O: 0.55,           // tube ink outline (each side)
  BORDER: 1.4,            // die-cut paper beyond the art
  CLOSE: 1.4,             // closing radius: the die-cut ignores notches narrower than this
  SHADOW: [0.55, 0.8],    // drop-shadow offset
  SHADOW_OP: 0.22,
  HAIR: 0.32, HAIR_OP: 0.3,
  HALO: 0.75,             // paper rim around badges, slashes and modifiers
  OUT: 1.1, 
  DOT: 2.7,               // closed shapes this small (art units) become candy dots
  DOT_O: 0.5,             // ...with this much ink ring               // a line point this far outside every fill is "outside the mass"
  BOX: [0.35, 23.65],     // everything (die-cut, shadow, sparkles) stays inside
}
const LIGHT = (() => { const x = -0.55, y = -0.835, l = Math.hypot(x, y); return [x / l, y / l] })()

const polyArea = r => Math.abs(area(r))
const fracInside = (pts, ring) => pts.length ? pts.filter(p => pointInRing(p, ring)).length / pts.length : 0
const inSet = (p, rings) => rings.reduce((a, r) => pointInRing(p, r) ? !a : a, false)
const distSet = (p, rings) => rings.reduce((m, r) => Math.min(m, distToPolyline(p, r, true)), Infinity)
const densify = (pts, step = 0.25, closed = false) => {
  if (pts.length < 2) return pts.slice()
  const P = closed ? [...pts, pts[0]] : pts, out = []
  for (let i = 0; i + 1 < P.length; i++) {
    const a = P[i], b = P[i + 1], n = Math.max(1, Math.ceil(V.dist(a, b) / step))
    for (let k = 0; k < n; k++) out.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n])
  }
  if (!closed) out.push(P.at(-1))
  return out
}
const straight = (pts, tol = 0.05) => pts.length >= 2 && pts.every(p => distToPolyline(p, [pts[0], pts.at(-1)]) <= tol)
const sampleBi = (G, x, y) => {
  const fx = x / F.H, fy = y / F.H
  const i = Math.max(0, Math.min(F.N - 2, Math.floor(fx))), j = Math.max(0, Math.min(F.N - 2, Math.floor(fy)))
  const u = fx - i, v = fy - j, k = j * F.N + i
  return (G[k] * (1 - u) + G[k + 1] * u) * (1 - v) + (G[k + F.N] * (1 - u) + G[k + F.N + 1] * u) * v
}

// ---------------------------------------------------------------------------
// 1. read the icon: subpaths with plates, flattened points, fills, cutouts
function read(icon) {
  const items = []
  for (const [pi, p] of (icon.paths || []).entries()) {
    const plate = p.plate || 'K'
    for (const sp of subpaths(p.d)) {
      let pts = []
      try { const s = parsePath(raw(sp)); pts = s.length ? s[0].pts : [] } catch { pts = [] }
      const m = sp.cmds[0]
      if (!pts.length || (pts.length === 1)) pts = [[m[1], m[2]]]
      const closed = sp.closed && pts.length > 2
      items.push({ sp, pts, closed, plate, pi, len: arclen(pts, closed) })
    }
  }
  const fills = (icon.fills || []).map((f, fi) => {
    const rings = (f.set && f.set.length ? f.set : (f.subs || []).map(s => s.pts)).filter(r => r && r.length > 2)
    return { d: f.d, rings, subs: subpaths(f.d), fi }
  }).filter(f => f.rings.length)
  // closed cutout subpaths, grouped per cutout (an annulus stays one even-odd set)
  const cutSets = []
  for (const [ci, c] of (icon.cutouts || []).entries()) {
    const set = []
    set.ci = ci
    for (const sp of subpaths(c.d)) {
      if (!sp.closed) continue
      let pts = []
      try { const q = parsePath(raw(sp)); pts = q.length ? q[0].pts : [] } catch { pts = [] }
      if (pts.length > 2) set.push({ sp, pts })
    }
    if (set.length) cutSets.push(set)
  }
  const cutouts = cutSets.flatMap(c => c.map(x => x.pts))
  return { items, fills, cutouts, cutSets }
}

// ---------------------------------------------------------------------------
export function build(icon) {
  const { items, fills, cutouts, cutSets } = read(icon)
  const col = colours(icon)
  const name = String(icon.name || '')
  const R = rng('sticker:' + name)

  // --- signals (S plate): badges, slashes, glyphs
  const sig = items.filter(l => l.plate === 'S')
  const base0 = items.filter(l => l.plate !== 'S')
  // small closed shapes (wheels, dots, pupils) are printed as candy dots with an ink ring
  const isDot = l => { if (!l.closed) return false; const b = bbox(l.pts); return Math.max(b.w, b.h) <= K.DOT }
  const dots = base0.filter(isDot)
  const base = base0.filter(l => !dots.includes(l))
  const dotBoxes = dots.map(l => { const b = bbox(l.pts); return [b.x0 - 0.6, b.y0 - 0.6, b.x1 + 0.6, b.y1 + 0.6] })
  const inDot = r => dotBoxes.some(b => r.every(p => p[0] >= b[0] && p[0] <= b[2] && p[1] >= b[1] && p[1] <= b[3]))
  const closedS = sig.filter(l => l.closed)
  const badges = closedS.filter(l => !closedS.some(o => o !== l && polyArea(o.pts) > polyArea(l.pts) && fracInside(l.pts, o.pts) > 0.9))
  const badgeOf = g => badges.find(b => b !== g && fracInside(g.pts, b.pts) > 0.5)
  const slashes = sig.filter(l => !l.closed && straight(l.pts) && l.len >= 8 && !badgeOf(l))
  const glyphs = sig.filter(l => !badges.includes(l) && !slashes.includes(l))
  const freeGlyphs = glyphs.filter(g => !badgeOf(g))

  // --- fills: S fills belong to an overlay; A fills follow an A centreline
  const near = (pts, lines, tol) => {
    if (!lines.length) return 0
    const P = pts.filter((_, i) => i % 2 === 0)
    return P.filter(p => lines.some(l => distToPolyline(p, l.pts, l.closed) < tol)).length / Math.max(1, P.length)
  }
  const sLines = sig, aLines = base.filter(l => l.plate === 'A'), kLines = base.filter(l => l.plate === 'K')
  const baseFills = []
  for (const f of col.tune.noFill ? [] : fills) {
    if (f.rings.every(inDot)) continue
    const pts = f.rings.flat()
    if (sLines.length && near(pts, sLines, 0.45) > 0.5) continue
    const a = near(pts, aLines, 0.45), k = near(pts, kLines, 0.45)
    baseFills.push({ ...f, plate: a > 0.6 && a > k ? 'A' : 'K' })
  }
  const fillRings = baseFills.flatMap(f => f.rings)

  // --- tubes: lines that live outside the mass
  // (with a mass present, a closed outline or a line inside one is drawn, not a tube:
  //  a table's grid, a frame around unfilled paper)
  const tubes = [], inks = []
  const loops = base.filter(l => l.closed && l.pts.length > 2)
  const tubeIdx = col.tune.tubePaths || []
  for (const l of base) {
    if (!baseFills.length || col.tune.tubes) { tubes.push(l); continue }
    if (tubeIdx.includes(l.pi)) { l.over = true; tubes.push(l); continue }
    if (l.closed) { inks.push(l); continue }
    const d = densify(l.pts, 0.25, l.closed)
    if (loops.some(o => o !== l && d.filter(p => pointInRing(p, o.pts) || distToPolyline(p, o.pts, true) < 0.3).length / d.length > 0.6)) { inks.push(l); continue }
    const out = d.filter(p => !inSet(p, fillRings) && distSet(p, fillRings) > K.OUT).length / d.length
    if (out < 0.5) { inks.push(l); continue }
    // a tube that only touches the mass tucks behind it; one that crosses it lies on top
    l.over = d.filter(p => inSet(p, fillRings) && distSet(p, fillRings) > 0.4).length / d.length > 0.2
    tubes.push(l)
  }

  // --- fit: the die-cut and its shadow stay inside the box
  const hwInk = K.INK / 2, hwTube = K.TUBE / 2 + K.TUBE_O, hwHalo = hwTube + K.HALO
  const reach = []
  for (const l of inks) for (const p of l.pts) reach.push([p, hwInk])
  for (const l of tubes) for (const p of l.pts) reach.push([p, hwTube])
  for (const l of sig) for (const p of l.pts) reach.push([p, l.closed ? hwInk + K.HALO : hwHalo])
  for (const r of fillRings) for (const p of r) reach.push([p, 0])
  for (const l of dots) for (const p of l.pts) reach.push([p, hwInk])
  let s = K.SCALE
  const [lo, hi] = K.BOX
  for (const [p, hw] of reach) for (let ax = 0; ax < 2; ax++) {
    const o = K.SHIFT[ax], sh = K.SHADOW[ax], v = p[ax] - 12
    if (v > 0.01) s = Math.min(s, (hi - 12 - o - hw - K.BORDER - sh) / v)
    else if (v < -0.01) s = Math.min(s, (12 + o - hw - K.BORDER - lo) / -v)
  }
  s = Math.max(0.6, s)
  const T = { s, ox: K.SHIFT[0], oy: K.SHIFT[1] }
  const X = pts => pts.map(p => tp(T, p))
  const xl = l => ({ pts: X(l.pts), closed: l.closed })

  // --- the art silhouette as a distance field (final units)
  const RE = K.BORDER + K.CLOSE + 0.3
  const art = F.field(RE)
  if (inks.length) F.strokes(inks.map(xl), K.INK, RE, art)
  if (tubes.length) F.strokes(tubes.map(xl), K.TUBE + 2 * K.TUBE_O, RE, art)
  for (const f of baseFills) F.region(f.rings.map(X), RE, art)
  if (dots.length) { F.strokes(dots.map(xl), K.INK, RE, art); for (const l of dots) F.region([X(l.pts)], RE, art) }
  for (const b of badges) { F.region([X(b.pts)], RE, art); F.strokes([xl(b)], K.INK + 2 * K.HALO, RE, art) }
  const sOpen = [...freeGlyphs, ...slashes]
  if (sOpen.length) F.strokes(sOpen.map(xl), K.TUBE + 2 * K.TUBE_O + 2 * K.HALO, RE, art)

  // --- die-cut = closing of the dilated silhouette, outer rings only
  const g = Float32Array.from(art)
  F.offset(g, -(K.BORDER + K.CLOSE))
  const l1 = F.contour(g).map(l => simplify(l, 0.004, true)).filter(l => l.length > 2)
  if (!l1.length) return null
  const g2 = F.redistance(g, l1, K.CLOSE + 0.4)
  F.offset(g2, K.CLOSE)
  let rings = F.trace(g2, 0.004, 0.5)
  rings = rings.filter((r, i) => !rings.some((o, j) => j !== i && polyArea(o) > polyArea(r) && pointInRing(r[0], o)))
  const cut = rings.map(r => simplify(r, 0.08, true)).filter(r => r.length > 2)
  if (!cut.length) return null

  // --- decorations need the occupied area before we emit anything
  const shadowRings = cut.map(r => r.map(p => [p[0] + K.SHADOW[0], p[1] + K.SHADOW[1]]))
  const decos = sparkles(cut, shadowRings, R, col)

  const nodes = []
  const cutD = cut.map(r => splineD(r)).join('')
  const shD = cut.map(r => splineD(r.map(p => [p[0] + K.SHADOW[0], p[1] + K.SHADOW[1]]))).join('')
  nodes.push(['path', { d: shD, fill: SHADOW, 'fill-opacity': K.SHADOW_OP }])
  nodes.push(['path', { d: cutD, fill: EDGE, stroke: 'currentColor', 'stroke-opacity': K.HAIR_OP, 'stroke-width': K.HAIR }])

  // --- tubes that tuck behind the mass
  const C = n => VAR(n)
  const tubeCol = col.tune.tube || (baseFills.length ? col.accent : col.primary)
  const tubeNodes = list => {
    if (!list.length) return
    const d = emit(list.map(l => l.sp), T)
    nodes.push(['path', { d, stroke: INK, 'stroke-width': fmt(K.TUBE + 2 * K.TUBE_O) }])
    nodes.push(['path', { d, stroke: C(tubeCol), 'stroke-width': K.TUBE }])
  }
  tubeNodes(tubes.filter(l => !l.over && baseFills.length))
  // --- fills
  const fc = col.tune.fillColours || {}
  const fcOf = f => fc[f.fi] === 'ink' ? INK : fc[f.fi] ? C(fc[f.fi]) : C(f.plate === 'A' && !col.tune.mono ? col.accent : col.primary)
  const tyres = baseFills.filter(f => fc[f.fi] !== undefined)
  for (const f of baseFills) nodes.push(['path', { d: emit(f.subs, T), fill: fcOf(f), 'fill-rule': 'evenodd' }])
  // a recoloured fill (a wheel) prints its closed cutouts as hubs
  const hubSets = tyres.length && col.tune.hub ? cutSets.filter(set => set.every(x => tyres.some(f => fracInside(x.pts, f.rings[0]) > 0.9))) : []
  if (hubSets.length) nodes.push(['path', { d: emit(hubSets.flat().map(x => x.sp), T), fill: col.tune.hub === 'ink' ? INK : C(col.tune.hub), 'fill-rule': 'evenodd' }])
  // closed cutouts inside the mass: printed panels (or paper, when they are only a gap)
  if (baseFills.length && cutSets.length) {
    const panels = [], gaps = [], tinted = {}
    const pc = col.tune.panelColours || {}
    const inkF = inks.length ? F.strokes(inks.map(xl), K.INK + 0.8, 0.6) : null
    for (const set of cutSets) {
      if (hubSets.includes(set)) continue
      if (pc[set.ci]) { (tinted[pc[set.ci]] ||= []).push(...set.map(x => x.sp)); continue }
      const pts = set.flatMap(x => x.pts)
      const inside = pts.filter(p => inSet(p, fillRings) || distSet(p, fillRings) < 0.6).length / pts.length
      if (inside < 0.6) continue
      const fr = F.region(set.map(x => X(x.pts)), 1.2)
      let mn = 0, nIn = 0, nInk = 0
      for (let k = 0; k < fr.length; k++) if (fr[k] < 0) { if (fr[k] < mn) mn = fr[k]; nIn++; if (inkF && inkF[k] < 0) nInk++ }
      // a cutout that only knocks a line out of the mass (Solid's job) is already ink here
      if (nIn && nInk / nIn > 0.6) continue
      if (col.tune.panel === 'none') continue
      ;(-mn >= 0.62 && col.tune.panel !== 'paper' ? panels : gaps).push(...set.map(x => x.sp))
    }
    if (panels.length) nodes.push(['path', { d: emit(panels, T), fill: C(col.accent), 'fill-rule': 'evenodd' }])
    if (gaps.length) nodes.push(['path', { d: emit(gaps, T), fill: EDGE, 'fill-rule': 'evenodd' }])
    for (const [c, sps] of Object.entries(tinted)) nodes.push(['path', { d: emit(sps, T), fill: c === 'paper' ? EDGE : C(c), 'fill-rule': 'evenodd' }])
  }
  // --- tubes on top (all of them when there is no mass)
  tubeNodes(tubes.filter(l => l.over || !baseFills.length))
  // --- dots: ink disc, then a candy disc inside it
  if (dots.length) {
    const d = emit(dots.map(l => l.sp), T), c = C(baseFills.length || tubes.length ? (baseFills.length ? col.accent : tubeCol) : col.primary)
    nodes.push(['path', { d, fill: INK, stroke: INK, 'stroke-width': K.INK }])
    nodes.push(['path', { d, fill: c, stroke: c, 'stroke-width': fmt(K.INK - 2 * K.DOT_O) }])
  }
  // --- ink
  if (inks.length) nodes.push(['path', { d: emit(inks.map(l => l.sp), T), stroke: INK, 'stroke-width': K.INK }])

  // --- shine
  if (!col.tune.noShine) {
    try {
      const sh = shine(baseFills.filter(f => fc[f.fi] !== 'ink'), tubes, inks, cutouts, sig, X, xl)
      if (sh) nodes.push(['path', { d: sh.d, stroke: SHINE, 'stroke-width': fmt(sh.w), 'stroke-opacity': 0.92 }])
    } catch { /* a missing shine is fine */ }
  }

  // --- signals: mini stickers on top
  let sc = signalColour(name, col.accent)
  if (sc === col.primary) sc = col.accent
  for (const b of badges) {
    const d = emit([b.sp], T)
    nodes.push(['path', { d, fill: EDGE, stroke: EDGE, 'stroke-width': fmt(K.INK + 2 * K.HALO) }])
    nodes.push(['path', { d, fill: C(sc), stroke: INK, 'stroke-width': K.INK }])
    const gl = glyphs.filter(gg => badgeOf(gg) === b)
    if (gl.length) nodes.push(['path', { d: emit(gl.map(x => x.sp), T), stroke: INK, 'stroke-width': fmt(K.INK * 0.9) }])
  }
  if (sOpen.length) {
    const d = emit(sOpen.map(l => l.sp), T)
    nodes.push(['path', { d, stroke: EDGE, 'stroke-width': fmt(K.TUBE + 2 * K.TUBE_O + 2 * K.HALO) }])
    nodes.push(['path', { d, stroke: INK, 'stroke-width': fmt(K.TUBE + 2 * K.TUBE_O) }])
    nodes.push(['path', { d, stroke: C(sc), 'stroke-width': K.TUBE }])
  }

  // --- sparkles
  for (const dc of decos) nodes.push(['path', { d: dc.d, fill: C(dc.c) }])
  return nodes
}

// ---------------------------------------------------------------------------
// SHINE: a glossy dash (+ dot) along the lit, top-left inside of the biggest colour area
function shine(baseFills, tubes, inks, cutouts, sig, X, xl) {
  const onTube = !baseFills.length
  const hw = onTube ? 0.32 : 0.5
  const M = 1.4
  let Cf
  if (!onTube) {
    Cf = F.field(M)
    const primary = baseFills.filter(f => f.plate === 'K')
    for (const f of (primary.length ? primary : baseFills)) F.region(f.rings.map(X), M, Cf)
  } else {
    Cf = F.strokes(tubes.map(xl), K.TUBE, M)
  }
  // keep clear of ink, tubes, panels and overlays
  const block = F.field(M)
  if (inks.length) F.strokes(inks.map(xl), K.INK + 0.5, M, block)
  if (!onTube && tubes.length) F.strokes(tubes.map(xl), K.TUBE + 2 * K.TUBE_O + 0.5, M, block)
  if (!onTube && cutouts.length) { const c = F.region(cutouts.map(X), M); F.offset(c, -0.25); F.union(block, c) }
  if (sig.length) F.strokes(sig.map(xl), K.TUBE + 2 * K.TUBE_O + 2 * K.HALO + 0.4, M, block)
  const Fo = Float32Array.from(Cf)  // the colour area itself: its outer edge is what catches the light
  F.subtract(Cf, block)
  const lvl = hw + 0.14
  const reachT = onTube ? lvl + 0.9 : lvl + K.INK + 0.7
  const G = Float32Array.from(Cf)
  F.offset(G, lvl)
  const rings = F.contour(G).filter(r => r.length > 6)
  if (!rings.length) return null
  // the biggest colour area wins: score each ring by its enclosed area and light
  let best = null
  for (const r0 of rings) {
    const a = polyArea(r0)
    if (a < 0.4) continue
    const r = resample(r0, 0.1, true).map(o => o.p)
    if (r.length > 2 && V.dist(r[0], r.at(-1)) < 0.05) r.pop()
    const n = r.length
    if (n < 12) continue
    const S = 6
    const info = r.map((p, k) => {
      const a1 = r[(k - S + n) % n], b1 = r[(k + S) % n]
      let tx = b1[0] - a1[0], ty = b1[1] - a1[1]; const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl
      let nx = -ty, ny = tx
      // outward = where the colour field increases (leaving the colour)
      if (sampleBi(Cf, p[0] + nx * 0.25, p[1] + ny * 0.25) < sampleBi(Cf, p[0] - nx * 0.25, p[1] - ny * 0.25)) { nx = -nx; ny = -ny }
      const ex = sampleBi(Fo, p[0] + LIGHT[0] * reachT, p[1] + LIGHT[1] * reachT) > -0.3
      return { p, f: nx * LIGHT[0] + ny * LIGHT[1], ex }
    })
    const Lh = onTube ? Math.min(2.6, 0.3 * n * 0.1) : Math.max(1.2, Math.min(3.6, 0.5 * Math.sqrt(a) + 0.4))
    const m = Math.max(8, Math.min(Math.round(Lh / 0.1), Math.floor(n * 0.35)))
    for (let i = 0; i < n; i += 2) {
      let sum = 0, mnf = 1, ne = 0
      for (let k = 0; k < m; k++) { const v = info[(i + k) % n]; sum += v.f; if (v.f < mnf) mnf = v.f; if (v.ex) ne++ }
      if (mnf < 0.15) continue
      const mean = sum / m - (ne < 0.7 * m ? 0.6 : 0)
      const c = info[(i + (m >> 1)) % n].p
      const score = mean + 0.12 * Math.log(1 + a) + 0.02 * (c[0] * LIGHT[0] + c[1] * LIGHT[1])
      if (!best || score > best.score) best = { score, i, m, info, n }
    }
  }
  if (!best) return null
  const { i, m, info, n } = best
  const pts = []
  for (let k = 0; k < m; k++) pts.push(info[(i + k) % n].p)
  // smooth the run
  const sm = pts.map((p, q) => {
    let sx = 0, sy = 0, c = 0
    for (let r = -4; r <= 4; r++) { const o = pts[Math.max(0, Math.min(pts.length - 1, q + r))]; sx += o[0]; sy += o[1]; c++ }
    return [sx / c, sy / c]
  })
  const dash = simplify(sm, 0.03)
  let d = 'M' + dash.map(p => fmt(p[0]) + ' ' + fmt(p[1])).join('L')
  // the dot continues the arc past the end that lies toward the lower-left
  const PD = [LIGHT[1], -LIGHT[0]]
  const e0 = info[i % n].p, e1 = info[(i + m - 1) % n].p
  const firstIsLow = (e0[0] * PD[0] + e0[1] * PD[1]) > (e1[0] * PD[0] + e1[1] * PD[1])
  const gap = Math.round((2 * hw + 0.45) / 0.1)
  const q = firstIsLow ? (i - gap + n * 4) % n : (i + m - 1 + gap) % n
  const dot = info[q]
  if (dot && dot.f > -0.1 && m + gap < n * 0.7) d += 'M' + fmt(dot.p[0]) + ' ' + fmt(dot.p[1]) + 'h.01'
  return { d: d.replace(/ -/g, '-'), w: 2 * hw }
}

// ---------------------------------------------------------------------------
// SPARKLES: up to two in the free corners, never touching the sticker or its shadow
function sparkles(cut, shadowRings, R, col) {
  const [lo, hi] = K.BOX
  const GAP = 0.55, STEP = 0.32, REACH = 2.6
  // distance to the sticker and its shadow (union of two region fields)
  const occ = F.region(cut, REACH)
  F.region(shadowRings, REACH, occ)
  const cands = []
  for (let y = lo + 0.8; y <= hi - 0.8; y += STEP) for (let x = lo + 0.8; x <= hi - 0.8; x += STEP) {
    const p = [x, y]
    const dOcc = sampleBi(occ, x, y)
    if (dOcc <= GAP + 0.85) continue
    const dBox = Math.min(x - lo, hi - x, y - lo, hi - y)
    const r = Math.min(dOcc - GAP, dBox - 0.1)
    if (r < 0.85) continue
    cands.push({ p, r })
  }
  if (!cands.length) return []
  const quad = p => (p[0] > 12 ? 1 : 0) + (p[1] > 12 ? 2 : 0) // 0 TL, 1 TR, 2 BL, 3 BR
  const pref = [0.25, 0.6, 0.35, 0]
  const RMAX = 1.85
  let first = null
  for (const c of cands) {
    const r = Math.min(c.r, RMAX)
    const sc = r + pref[quad(c.p)]
    if (!first || sc > first.sc) first = { ...c, r, sc }
  }
  const out = []
  const t = col.tune
  const roll = R()
  const kind = t.deco || (roll < 0.14 ? 'heart' : roll < 0.26 ? 'star' : 'sparkle')
  const decoD = (k, p, r) => k === 'heart' ? heartD(p[0], p[1] + 0.05 * r, r * 0.92) : k === 'star' ? starD(p[0], p[1] + 0.08 * r, r * 1.02) : sparkleD(p[0], p[1], r, 0.2)
  const nMax = t.sparkles ?? 2
  if (nMax < 1) return out
  out.push({ d: decoD(kind, first.p, first.r), c: kind === 'heart' ? 'bubblegum' : kind === 'star' ? 'lemon' : col.spark })
  if (nMax < 2) return out
  let second = null
  for (const c of cands) {
    if (V.dist(c.p, first.p) < first.r + 4.5) continue
    const r = Math.min(c.r, Math.max(1.0, first.r * 0.66))
    if (r < 0.95) continue
    const sc = r + (quad(c.p) !== quad(first.p) ? 0.3 : 0) + 0.04 * V.dist(c.p, first.p)
    if (!second || sc > second.sc) second = { ...c, r, sc }
  }
  if (second) out.push({ d: sparkleD(second.p[0], second.p[1], second.r, 0.22), c: col.spark })
  return out
}
