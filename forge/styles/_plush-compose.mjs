// PLUSH compose: a list of PIECES (from _plush-kit.mjs) -> IconNodes.
//
// A piece is one of
//   { kind: 'felt',   role, F, part?, stitch?, seam?, shade?, hi?, line? }  a stuffed felt panel
//   { kind: 'flat',   role, F, part?, op? }                                 flat colour (a French knot, a button hole)
//   { kind: 'thread', role, lines: [[x, y], ...][], w, part?, op? }         embroidery (round-capped thread)
//   { kind: 'cut',    F }                                                   knocks F out of every piece painted before it
// painted bottom to top. Every felt panel is built from the same layers, so a page of
// icons reads as one toy box:
//
//   ground   one soft drop shadow under the whole object (wm-shadow)
//   outline  the panel grown by OUT, in ink: the dark piping round every panel
//   base     the felt colour
//   shade    a crescent along the lower-right inside edge (shadow, low opacity): the stuffing
//   hi       a soft crescent along the upper-left, inset (shine): the fleece catching light
//   stitch   a running stitch: dashes on a loop inset STITCH from the edge, or along the seam
//            polyline of a tube; light thread on dark felt, dark thread on light felt
//
// Motion (forge/MOTION.md, Parts choreography): every node carries its piece's part:
// wm-k / wm-a / wm-s when the composition has more than one plate, wm-deco for pieces that
// lie wholly off the object, wm-shadow for the ground, wm-shine for the K panels' highlight.
// A piece without an explicit part is measured against the skeleton (raw 24-grid coords).
import * as F from './_plush-field.mjs'
import { simplify, distToPolyline, pointInRing } from '../kernel/geom.mjs'

// role -> default colour (CSS variable --with-plush-<role>)
export const PALETTE = {
  ink: '#4A2C3D',     // piping and embroidery: a deep plum-brown thread
  c1: '#F4695E',      // tomato felt
  c2: '#FFC53D',      // sunflower felt
  c3: '#4C9FE6',      // sky felt
  c4: '#4FBF8A',      // mint felt
  accent: '#FF8DB4',  // bubblegum felt (hearts, patches, cheeks)
  tint: '#FFF0D9',    // cream felt (patches, inner panels)
  shadow: '#3A1E46',  // fabric shade (always at low opacity)
  shine: '#FFFFFF',   // fleece highlight (low opacity)
  edge: '#FFF9F0',    // light stitching thread
}
export const ROLES = Object.keys(PALETTE)
export const paint = role => `var(--with-plush-${role}, ${PALETTE[role] || PALETTE.c1})`
// felts on which light thread would vanish: they take dark thread
export const LIGHT = new Set(['c2', 'tint', 'accent', 'edge', 'shine'])

export const K = {
  OUT: 0.62,            // ink piping width
  SHADE: [0.85, 1.0],   // shade: the panel minus itself moved up-left by this
  SHADE_OP: 0.17,
  PINCH: 0.5, PINCH_OP: 0.13, // seam pinch band
  HI_IN: 0.6,           // highlight inset
  HI: [1.0, 1.25],      // highlight: the inset panel minus itself moved down-right by this (x depth)
  HI_OP: 0.34,
  STITCH: 0.95,         // stitch loop inset from the felt edge
  DASH: 0.78, PERIOD: 1.42, SW: 0.42, // running stitch
  GROUND: [0.3, 0.75],  // drop shadow offset
  GROUND_OP: 0.16,
  TOL: 0.035,           // outline simplification
  TOL2: 0.08,           // soft layers
}

const area = r => { let a = 0; for (let i = 0; i < r.length; i++) { const p = r[i], q = r[(i + 1) % r.length]; a += p[0] * q[1] - q[0] * p[1] } return a / 2 }
const n2 = v => { const s = (Math.round(v * 100) / 100).toString(); return s.replace(/^0\./, '.').replace(/^-0\./, '-.') }
const nums = a => { let s = '', dot = false; for (const v of a) { const t = n2(v); if (s && !t.startsWith('-') && !(t.startsWith('.') && dot)) s += ' '; s += t; dot = t.includes('.') } return s }
// compact polygon writer: M abs, l rel, z
export function ringsD(rings, tol = K.TOL, minArea = 0.05, q = 100) {
  let d = ''
  for (const r0 of rings) {
    if (r0.length < 3 || Math.abs(area(r0)) < minArea) continue
    const r = simplify(r0, tol, true)
    if (r.length < 3) continue
    const R = r.map(p => [Math.round(p[0] * q), Math.round(p[1] * q)])
    const rel = []
    for (let k = 1; k < R.length; k++) {
      const dx = R[k][0] - R[k - 1][0], dy = R[k][1] - R[k - 1][1]
      if (dx || dy) rel.push(dx / q, dy / q)
    }
    if (rel.length < 4) continue
    d += 'M' + nums([R[0][0] / q, R[0][1] / q]) + 'l' + nums(rel) + 'z'
  }
  return d
}
// open polylines: M abs, l rel
export function linesD(lines, q = 100) {
  let d = ''
  for (const P of lines) {
    if (!P || !P.length) continue
    const R = P.map(p => [Math.round(p[0] * q), Math.round(p[1] * q)])
    const rel = []
    for (let k = 1; k < R.length; k++) {
      const dx = R[k][0] - R[k - 1][0], dy = R[k][1] - R[k - 1][1]
      if (dx || dy) rel.push(dx / q, dy / q)
    }
    if (!rel.length) rel.push(0, 0)
    d += 'M' + nums([R[0][0] / q, R[0][1] / q]) + 'l' + nums(rel)
  }
  return d
}
const traceD = (G, tol, minArea = 0.08, q = 100) => ringsD(F.trace(G, tol, minArea), tol, minArea, q)

// running stitch along a polyline: n even dashes, each a short straight segment
const plen = P => { let L = 0; for (let i = 1; i < P.length; i++) L += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); return L }
function pointAt(P, cum, s) {
  let i = 1
  while (i < P.length - 1 && cum[i] < s) i++
  const a = P[i - 1], b = P[i], t = (s - cum[i - 1]) / Math.max(1e-9, cum[i] - cum[i - 1])
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
}
export function dashes(P, closed, o = {}) {
  const per = o.period || K.PERIOD, dash = o.dash || K.DASH, trim = o.trim || 0
  const Q = closed ? [...P, P[0]] : P
  const cum = [0]
  for (let i = 1; i < Q.length; i++) cum.push(cum[i - 1] + Math.hypot(Q[i][0] - Q[i - 1][0], Q[i][1] - Q[i - 1][1]))
  const L = cum.at(-1) - 2 * trim
  if (L < dash) return []
  const n = Math.max(1, Math.round((closed ? L : L + per - dash) / per))
  const step = closed ? L / n : n > 1 ? (L - dash) / (n - 1) : 0
  const out = []
  for (let k = 0; k < n; k++) {
    const s0 = closed ? trim + k * step + (step - dash) / 2 : (n > 1 ? trim + k * step : trim + (L - dash) / 2)
    out.push([pointAt(Q, cum, s0), pointAt(Q, cum, s0 + dash)])
  }
  return out
}

// ---------------------------------------------------------------------------
// parts: measured against the skeleton when a piece does not say
const FOOT = 1.75, DECO_MAX = 0.12, PLATE_MIN = 0.6
export function judge(icon) {
  const lines = (icon && icon.lines || []).filter(l => l.pts && l.pts.length)
  if (!lines.length) return null
  const rings = [...(icon.fills || []).flatMap(f => f.set || [])].filter(r => r && r.length > 2)
  const plated = lines.some(l => l.plate === 'A' || l.plate === 'S')
  return samples => {
    if (!samples.length) return { plate: 'K', on: 1 }
    let on = 0
    const votes = { K: 0, A: 0, S: 0 }
    for (const p of samples) {
      let best = Infinity, pl = 'K'
      for (const l of lines) { const d = distToPolyline(p, l.pts, l.closed); if (d < best) { best = d; pl = l.plate || 'K' } }
      if (best < FOOT || rings.some(r => pointInRing(p, r))) on++
      if (plated) votes[pl]++
    }
    const n = samples.length
    return { plate: votes.A / n > PLATE_MIN ? 'A' : votes.S / n > PLATE_MIN ? 'S' : 'K', on: on / n }
  }
}
export function samplesOf(pc) {
  const out = []
  if (pc.kind === 'thread') { for (const P of pc.lines) for (let i = 0; i < P.length; i += 2) out.push(P[i]); return out }
  const G = pc.F, s = 5 // every 0.5u
  for (let j = 0; j < F.N; j += s) for (let i = 0; i < F.N; i += s) if (G[j * F.N + i] < 0) out.push([i * F.H, j * F.H])
  if (out.length < 6) for (let j = 0; j < F.N; j += 2) for (let i = 0; i < F.N; i += 2) if (G[j * F.N + i] < 0) out.push([i * F.H, j * F.H])
  return out
}

// ---------------------------------------------------------------------------
export function compose(pieces, icon = null) {
  // 1. flatten, apply cuts
  const flat = [pieces].flat(Infinity).filter(p => p && typeof p === 'object' && p.kind)
  const list = []
  for (const pc of flat) {
    if (pc.kind === 'cut') {
      if (!pc.F) continue
      for (const q of list) {
        if (q.F) F.subtract(q.F, pc.F)
        if (q.kind === 'thread') q.lines = q.lines.flatMap(P => runsOut(P, pc.F))
      }
      continue
    }
    if (pc.kind === 'thread') { if (pc.lines && pc.lines.length) list.push({ ...pc, lines: pc.lines.filter(P => P && P.length) }); continue }
    if (!pc.F || !PALETTE[pc.role]) continue
    list.push({ ...pc, F: F.copy(pc.F) })
  }
  // 2. parts
  const J = list.some(p => !p.part) ? judge(icon) : null
  if (J) {
    const meas = list.map(p => p.part ? null : J(samplesOf(p)))
    const object = meas.some(m => m && m.on >= 0.5) || list.some(p => p.part && p.part !== 'deco')
    list.forEach((p, k) => { if (!p.part) p.part = object && meas[k].on < DECO_MAX ? 'deco' : meas[k].plate })
  }
  for (const p of list) if (!p.part) p.part = 'K'
  // plates are classed when there is more than one, or when the only plate is not K (an all-A Live readout)
  const plates = new Set(list.filter(p => p.part !== 'deco').map(p => p.part))
  const multi = plates.size > 1 || (plates.size === 1 && !plates.has('K'))
  const cls = p => p === 'deco' ? 'wm-deco' : multi ? 'wm-' + p.toLowerCase() : null
  const attrs = (a, c) => (c ? { ...a, class: c } : a)

  const out = []
  // 3. ground shadow under every object felt panel
  const felts = list.filter(p => p.kind === 'felt' && F.any(p.F))
  for (const p of felts) { p.E = F.exact(p.F, 1.45); p.deep = F.depthOf(p.E) }
  const obj = felts.filter(p => p.part !== 'deco' && p.ground !== false)
  if (obj.length) {
    const G = F.field(3)
    for (const p of obj) { const o = F.offset(F.copy(p.E), -(p.out ?? K.OUT)); F.union(G, o) }
    const S = F.move(G, K.GROUND[0], K.GROUND[1], 3)
    F.subtract(S, G) // only the visible part: keeps the path small and the ground off the felt
    const d = traceD(S, K.TOL2, 0.15, 10)
    if (d) out.push(['path', { d, fill: paint('shadow'), 'fill-opacity': K.GROUND_OP, class: 'wm-shadow' }])
  }
  // 4. every piece
  for (const p of list) {
    const c = cls(p.part)
    if (p.kind === 'thread') {
      const lines = p.lines.filter(P => P.length > 0)
      const d = linesD(lines.map(P => P.length > 2 ? simplify(P, 0.02, false) : P))
      if (!d) continue
      const a = { d, fill: 'none', stroke: paint(p.role || 'ink'), 'stroke-width': +(p.w || 1).toFixed(2), 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
      if (p.op !== undefined && p.op < 1) a['stroke-opacity'] = p.op
      out.push(['path', attrs(a, c)])
      continue
    }
    if (p.kind === 'flat') {
      const d = traceD(p.F, K.TOL, 0.02)
      if (!d) continue
      const a = { d, fill: paint(p.role) }
      if (p.op !== undefined && p.op < 1) a['fill-opacity'] = p.op
      out.push(['path', attrs(a, c)])
      continue
    }
    if (!p.E) continue
    const E = p.E
    const deep = p.deep
    // outline
    if (p.line !== false) {
      const d = traceD(F.offset(F.copy(E), -(p.out ?? K.OUT)), K.TOL)
      if (d) out.push(['path', attrs({ d, fill: paint(p.lineRole || 'ink') }, c)])
    }
    const base = traceD(F.copy(E), K.TOL)
    if (!base) continue
    out.push(['path', attrs({ d: base, fill: paint(p.role) }, c)])
    // pinch: a thin darker band just inside the whole edge, where the seam pulls the felt in
    if (p.pinch !== false && deep > 1.2) {
      const S = F.copy(E)
      F.subtract(S, F.offset(F.copy(E), K.PINCH))
      const d = traceD(S, K.TOL2, 0.12, 10)
      if (d) out.push(['path', attrs({ d, fill: paint('shadow'), 'fill-opacity': K.PINCH_OP }, c)])
    }
    // shade: the panel minus itself shifted toward the light (lower-right crescent)
    if (p.shade !== false && deep > 0.55) {
      const k = Math.max(0.75, Math.min(1.5, deep / 2.2))
      const sh = p.shadeOff || [K.SHADE[0] * k, K.SHADE[1] * k]
      const S = F.copy(E)
      F.subtract(S, F.move(E, -sh[0], -sh[1], 3))
      const d = traceD(S, K.TOL2, 0.12, 10)
      if (d) out.push(['path', attrs({ d, fill: paint('shadow'), 'fill-opacity': p.shadeOp ?? K.SHADE_OP }, c)])
    }
    // highlight: the puffed-up top-left of the stuffing, inset from the seam
    if (p.hi !== false && deep > 1.05) {
      const inset = Math.min(K.HI_IN, deep * 0.35)
      const I = F.offset(F.copy(E), inset)
      const k = Math.max(0.55, Math.min(3, deep / 1.35))
      const hi = p.hiOff || [K.HI[0] * k, K.HI[1] * k]
      F.subtract(I, F.move(E, hi[0], hi[1], 3))
      const d = traceD(I, K.TOL2, 0.15, 10)
      if (d) out.push(['path', attrs({ d, fill: paint('shine'), 'fill-opacity': p.hiOp ?? K.HI_OP }, p.part === 'K' || !multi ? (c && c !== 'wm-k' ? c : 'wm-shine') : c)])
    }
    // stitches
    const st = p.stitch === undefined ? 'auto' : p.stitch
    if (st !== false) {
      const segs = []
      const inside = q => F.sampleAt(E, q[0], q[1]) < -0.45
      if (p.seam && p.seam.length && (st === 'seam' || st === 'auto')) {
        for (const P of p.seam) for (const sgm of dashes(P, false, { trim: p.trim ?? 0.9 })) if (inside(sgm[0]) && inside(sgm[1])) segs.push(sgm)
      } else if (deep > (p.stitchMin ?? 1.55)) {
        const inset = p.inset ?? Math.min(K.STITCH, deep * 0.5)
        const loops = F.trace(F.offset(F.copy(E), inset), 0.03, 1.2)
        for (const L of loops) if (plen(L) > 3) for (const sgm of dashes(L, true)) segs.push(sgm)
      }
      if (segs.length) {
        const dark = LIGHT.has(p.role)
        const role = p.threadRole || (dark ? 'ink' : 'edge')
        const a = { d: linesD(segs, 10), fill: 'none', stroke: paint(role), 'stroke-width': p.sw || K.SW, 'stroke-linecap': 'round' }
        const op = p.threadOp ?? (role === 'ink' ? 0.5 : 0.92)
        if (op < 1) a['stroke-opacity'] = op
        out.push(['path', attrs(a, c)])
      }
    }
  }
  return out
}

// the parts of polyline P that lie outside field G (with a hair of clearance)
function runsOut(P, G) {
  const out = []
  let cur = []
  const D = []
  for (let i = 0; i < P.length; i++) {
    if (i) {
      const a = P[i - 1], b = P[i], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.2))
      for (let k = 1; k <= n; k++) D.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n])
    } else D.push(P[0])
  }
  for (const q of D) {
    if (F.sampleAt(G, q[0], q[1]) > 0.1) cur.push(q)
    else { if (cur.length) out.push(cur); cur = [] }
  }
  if (cur.length) out.push(cur)
  return out.filter(r => r.length > 1 || P.length === 1)
}
