// SOFT 3D model: the skeleton read as parts (adapted from the retired iso style's model).
//   mass (fills + K strokes, or the strokes of a pure-line glyph), wells (small cutouts), screens (big closed cutouts),
//   raised parts (A inside the mass), ground parts (A outside it), S (badges, slashes), text, covers (hijab / hood frames).
import { ribbon, parsePath, distToPolyline, pointInRing, area, simplify, circle, resample } from '../kernel/geom.mjs'
import { hasText, textInfo, glyphLines, openText, textWeight } from './_live-text.mjs'
import { dilate, erode, setOf, unionSets, differenceSets, intersectSets, normalize, roundStrokeSet, strokeSet } from '../kernel/bool.mjs'

export const K = {
  WK: 2.0,         // stroke width of K strokes added to fills
  WL: 3.0,         // bar width of pure-line glyphs
  WA: 2.0,         // A stroke width
  WC: 1.6,         // open cutout groove width
  TOL: 0.035,
  SCREEN: 10,      // closed cutouts at least this big (u^2) become screens / label panels
  FILLA: 45,       // closed A/S paths smaller than this are solid (a pupil, a dot); larger ones are rings
  ALT: 0.09,       // diagonal bias above which the alternate orientation is used
}

// ---------------------------------------------------------------------------
// helpers
const isNum = v => typeof v === 'number' && isFinite(v)
export const ringArea = r => Math.abs(area(r))
export const cleanSet = set => (set || []).filter(r => r && r.length > 2 && ringArea(r) > 0.02)
// balanced union: pairs, then pairs of pairs (much faster than a running union for many parts)
export const U = sets => {
  let L = sets.filter(s => s && s.length)
  if (!L.length) return []
  while (L.length > 1) {
    const nx = []
    for (let i = 0; i < L.length; i += 2) nx.push(i + 1 < L.length ? UU(L[i], L[i + 1]) : L[i])
    L = nx
  }
  return cleanSet(L[0])
}
// polybool can fail on near-degenerate input: retry once on a nudged grid, then degrade
const nudge = (set, e) => set.map(r => r.map(p => [Math.round(p[0] / 0.002) * 0.002 + e, Math.round(p[1] / 0.002) * 0.002 - e * 0.7]))
const lean = set => set.map(r => r.length > 24 ? simplify(r, 0.03, true) : r).filter(r => r.length > 2)
function safe(op, sets, fallback) {
  sets = sets.map(lean)
  try { return op(sets) } catch { /* retry */ }
  try { return op(sets.map((st, i) => nudge(st, i ? 0.0013 : 0))) } catch { /* degrade */ }
  return fallback()
}
const UU = (a, b) => safe(([x, y]) => unionSets([x, y]), [a, b], () => [...a, ...b])
export const D_ = (a, b) => cleanSet(safe(([x, y]) => differenceSets(x, y), [a, b], () => a))
export const I_ = (a, b) => cleanSet(safe(([x, y]) => intersectSets(x, y), [a, b], () => []))
export const N_ = ring => { try { return normalize(ring) } catch { return [ring] } }
export const SO = rings => { try { return setOf(rings) } catch { return rings } }
export const mapSet = (set, f) => set.map(r => r.map(f))
export const shiftSet = (set, dx, dy) => set.map(r => r.map(p => [p[0] + dx, p[1] + dy]))

// zero-length subpaths ("M12 16 L12 16") stroke as a round dot; the parser drops them
function dots(paths) {
  const out = []
  for (const p of paths || []) {
    for (const chunk of String(p.d || '').split(/(?=[Mm])/)) {
      const m = chunk.match(/^M\s*(-?[\d.]+(?:e[-+]?\d+)?)[\s,]*(-?[\d.]+(?:e[-+]?\d+)?)/)
      if (!m) continue
      let subs
      try { subs = parsePath(chunk) } catch { subs = [] }
      if (!subs.length || subs.every(s => s.pts.length < 2)) out.push({ pts: [[+m[1], +m[2]]], plate: p.plate || 'K' })
    }
  }
  return out
}

// a round-capped stroke as one outline (side, end cap, other side, start cap), normalised once
export function capsule(pts, w) {
  const rb = ribbon(pts, () => w, null, false), n = pts.length, r = w / 2
  const Lp = rb.outer.slice(0, n), Rp = rb.outer.slice(n).reverse()
  const cap = (c, from, steps) => {
    const a0 = Math.atan2(from[1] - c[1], from[0] - c[0]), out = []
    for (let i = 1; i < steps; i++) { const a = a0 - Math.PI * i / steps; out.push([c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)]) }
    return out
  }
  const st = Math.max(6, Math.ceil(Math.PI * r / 0.25))
  // orientation of the cap arcs: sweep from the L side to the R side around the end point
  const e = pts[n - 1], s0 = pts[0]
  let ce = cap(e, Lp[n - 1], st), cs = cap(s0, Rp[0], st)
  const mid = ce[ce.length >> 1], tdir = [e[0] - pts[n - 2][0], e[1] - pts[n - 2][1]]
  if ((mid[0] - e[0]) * tdir[0] + (mid[1] - e[1]) * tdir[1] < 0) { // wrong way round: mirror the sweep
    const capR = (c, from) => { const a0 = Math.atan2(from[1] - c[1], from[0] - c[0]), out = []; for (let i = 1; i < st; i++) { const a = a0 + Math.PI * i / st; out.push([c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)]) } return out }
    ce = capR(e, Lp[n - 1]); cs = capR(s0, Rp[0])
  }
  const ring = [...Lp, ...ce, ...Rp.slice().reverse(), ...cs]
  try { return cleanSet(N_(ring)) } catch { return cleanSet(roundStrokeSet(pts, w, false)) }
}

export function strokeOf(sub, w) {
  const pts = sub.pts && sub.pts.length > 4 ? simplify(sub.pts, 0.022, !!sub.closed) : sub.pts
  if (!pts || !pts.length) return []
  if (pts.length === 1) return N_(circle(pts[0][0], pts[0][1], w / 2, 0.25))
  try {
    if (sub.closed) {
      // a self-crossing ring (an infinity sign) can lose half its band: stroke it as a closed-up open line instead
      const st = cleanSet(strokeSet(pts, w, true)), a = bboxOf([[pts]]), b = bboxOf([st])
      if (b && a && b[2] - b[0] > (a[2] - a[0]) * 0.9 && b[3] - b[1] > (a[3] - a[1]) * 0.9) return st
      return capsule([...pts, pts[0], pts[1]], w)
    }
    return capsule(pts, w)
  } catch { return [] }
}
// a path's own region: its closed subpaths filled + every centreline stroked
export function pathSet(subs, w, fillClosed, within = null) {
  const parts = []
  for (const s of subs) {
    // a closed outline whose inside is already mass: only its outer edge matters (cheaper than the ring)
    if (within && s.closed && s.pts.length > 2 && insideFrac(s.pts.filter((_, i) => i % 4 === 0), within) > 0.6) {
      try { const rb = ribbon(simplify(s.pts, 0.022, true), () => w, null, true); parts.push(N_(rb.outer)); continue } catch { /* stroke below */ }
    }
    if (fillClosed && s.closed && s.pts.length > 2 && Math.abs(area(s.pts)) < K.FILLA) parts.push(N_(simplify(s.pts, 0.022, true)))
    parts.push(strokeOf(s, w))
  }
  return U(parts)
}

export const insideFrac = (pts, set) => {
  if (!pts.length || !set.length) return 0
  let n = 0
  for (const p of pts) { let inn = false; for (const r of set) if (pointInRing(p, r)) inn = !inn; if (inn) n++ }
  return n / pts.length
}
export const rs = (pts, closed) => pts.length > 1 ? resample(pts, 0.5, closed).map(o => o.p) : pts
const samplePts = subs => subs.flatMap(s => rs(s.pts, s.closed))

const segIntersect = (a, b) => {
  const d = (p, q, r) => (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0])
  return d(a[0], a[1], b[0]) * d(a[0], a[1], b[1]) < 0 && d(b[0], b[1], a[0]) * d(b[0], b[1], a[1]) < 0
}

// ---------------------------------------------------------------------------
// MODEL
export function model(icon0, opts = {}) {
  // Live icons: the text comes out of the skeleton and is set as raised letters that face the viewer
  let icon = icon0, text = null
  if (hasText(icon0)) {
    try {
      const op = openText(icon0)
      const gl = glyphLines(icon0)
      const ids = new Set((icon0.paths || []).filter(p => textInfo(p)).map(p => p.id))
      icon = { ...op, paths: (op.paths || []).filter(p => !ids.has(p.id)), lines: (op.lines || []).filter(l => !ids.has(l.pathId)),
        cutouts: (op.cutouts || []).map(c => ({ ...c, subs: (c.subs || []).filter(q => !q.glyph) })).filter(c => c.subs.length) }
      const tset = U(gl.map(l => strokeOf({ pts: l.pts, closed: false }, textWeight(l.cap) * 0.85)))
      const tb = bboxOf([tset])
      // the centrelines too: the renderer strokes letters (a stroke keeps every counter of P, R, B, 0, 8 open)
      if (tb) text = { set: tset, center: [(tb[0] + tb[2]) / 2, (tb[1] + tb[3]) / 2], text: true, lines: gl.map(l => ({ pts: l.pts, w: textWeight(l.cap) * 0.85 })) }
    } catch { icon = icon0; text = null }
  }
  const paths = (icon.paths || []).filter(p => p && p.subs)
  const hasFill = (icon.fills || []).length > 0
  const dotList = dots(icon.paths)
  const byPlate = pl => paths.filter(p => (p.plate || 'K') === pl)
  const dotSet = (pl, w) => U(dotList.filter(d => d.plate === pl).map(d => N_(circle(d.pts[0][0], d.pts[0][1], w / 2, 0.25))))

  let mass, ground = [], raised = []
  const S = U([...byPlate('S').map(p => pathSet(p.subs, K.WA, true)), dotSet('S', K.WA + 0.3)])

  if (hasFill) {
    const fset = (icon.fillSet && icon.fillSet.length ? icon.fillSet : U(icon.fills.map(f => f.set))).map(r => simplify(r, 0.022, true))
    mass = opts.onlyFill ? U([fset]) : U([fset, ...byPlate('K').map(p => pathSet(p.subs, K.WK, false, fset)), dotSet('K', K.WK + 0.3)])
    for (const p of byPlate('A')) {
      const set = pathSet(p.subs, K.WA, true)
      if (!set.length) continue
      const f = insideFrac(samplePts(p.subs), mass)
      if (f > 0.55) raised.push({ set, subs: p.subs })
      else ground.push(set)
    }
    const ad = dotSet('A', K.WA + 0.3)
    if (ad.length) raised.push({ set: ad, subs: [] })
  } else {
    // pure-line glyph: every K and A stroke is one extruded bar
    mass = U([...[...byPlate('K'), ...byPlate('A')].map(p => pathSet(p.subs, K.WL, false)), dotSet('K', K.WL + 0.4), dotSet('A', K.WL + 0.4)])
  }

  // cutouts -> wells, except where a raised plate sits on them
  const raisedSubs = raised.flatMap(r => r.subs)
  const nearRaised = pts => raisedSubs.length && pts.every(p => raisedSubs.some(s => s.pts.length > 1 ? distToPolyline(p, s.pts, s.closed) < 1.1 : Math.hypot(s.pts[0][0] - p[0], s.pts[0][1] - p[1]) < 1.1))
  const cuts = [], screens = [], closedCuts = []
  for (const c of icon.cutouts || []) {
    const rings = [] // closed subpaths of one cutout nest even-odd (a ring = two circles)
    for (const s of c.subs || []) {
      if (!s.pts || s.pts.length < 2) continue
      if (nearRaised(rs(s.pts, s.closed))) continue
      if (s.closed && s.pts.length > 2) rings.push(simplify(s.pts, 0.022, true))
      else cuts.push(strokeOf(s, K.WC))
    }
    if (!rings.length) continue
    const set = cleanSet(SO(rings))
    const ar = set.reduce((a, r) => a + ringArea(r), 0)
    // a big, simple, compact window (one ring, no hole, filling most of its box) is glass; rings and odd shapes are grooves
    const bx = bboxOf([set]), fillRatio = bx ? ar / Math.max(0.01, (bx[2] - bx[0]) * (bx[3] - bx[1])) : 0
    if (ar >= K.SCREEN && set.length === 1 && fillRatio > 0.55) screens.push(set)
    else { cuts.push(set); closedCuts.push(set) }
  }
  let wells = cuts.length ? I_(U(cuts), mass) : []
  const screen = screens.length ? I_(U(screens), mass) : []

  // ground A blocks abut the slab; S floats, so the slab keeps its shape under it
  ground = ground.length ? [D_(U(ground), mass)].filter(g => g.length) : []
  const raisedSet = U(raised.map(r => I_(r.set, mass)))

  // symbols inlaid on the slab (a +, an x; a lone minus) keep their own axes, like a badge
  const straight = r => r.subs.length === 1 && !r.subs[0].closed && r.subs[0].pts.length === 2
  const parts = []
  const used = new Set()
  raised.forEach((r, i) => {
    const lone = raised.length === 1 && r.subs.length === 1 && !r.subs[0].closed && r.subs[0].pts.length <= 4
    if (used.has(i) || !(straight(r) || lone)) return
    const grp = [i]
    if (!lone) raised.forEach((q, j) => { if (j !== i && !used.has(j) && straight(q) && grp.some(g => segIntersect(raised[g].subs[0].pts, q.subs[0].pts))) grp.push(j) })
    if (grp.length < 2 && raised.length > 1) return
    const pts = grp.flatMap(g => raised[g].subs[0].pts), bx = bboxOf([[pts]])
    if (!bx || Math.max(bx[2] - bx[0], bx[3] - bx[1]) > 8.5) return
    grp.forEach(g => used.add(g))
    parts.push({ set: U(grp.map(g => I_(raised[g].set, mass))), center: [(bx[0] + bx[2]) / 2, (bx[1] + bx[3]) / 2] })
  })
  // every other raised part is its own piece (its own material, its own node for motion); many small ones share one
  const rest = raised.filter((_, i) => !used.has(i))
  const own = rest.slice(0, 3), more = rest.slice(3)
  own.forEach(r => parts.push({ set: I_(r.set, mass), center: null }))
  if (more.length) parts.push({ set: U(more.map(r => I_(r.set, mass))), center: null })
  if (text) { parts.push(text); text.inside = insideFrac([text.center], mass) > 0 }
  // a covering (a hijab, a hood): a fill authored as a frame, an outer ring with the face as its nested hole
  const cover = []
  for (const f of icon.fills || []) {
    const rings = (f.subs || []).filter(q => q.closed && q.pts && q.pts.length > 2).map(q => simplify(q.pts, 0.022, true))
    if (rings.length < 2) continue
    if (!rings.some((r, i) => rings.some((o, j) => j !== i && Math.abs(area(o)) > Math.abs(area(r)) && r.every(p => pointInRing(p, o))))) continue
    const set = cleanSet(SO(rings))
    if (set.length) cover.push(set)
  }
  return { mass, wells, screen, closed: closedCuts.length ? I_(U(closedCuts), mass) : [], ground: ground.length ? U(ground) : [], raised: raisedSet, parts: parts.filter(p => p.set.length), S, textInside: !!(text && text.inside), cover: cover.length ? I_(U(cover), mass) : [] }
}
export function bboxOf(sets) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (const s of sets) for (const r of s) for (const p of r) {
    if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0]
    if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]
  }
  return isFinite(x0) ? [x0, y0, x1, y1] : null
}

// ---------------------------------------------------------------------------
// EXTRUDE: visible wall strips of a set's rings
// ring nesting depth (even = outer, odd = hole)
export function depths(set) {
  return set.map((r, i) => {
    const p = r[0]; let d = 0
    for (let j = 0; j < set.length; j++) if (j !== i && pointInRing(p, set[j])) d++
    return d
  })
}
