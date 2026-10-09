// LIQUID core: the geometry behind forge/styles/liquid.mjs.
//
// Every icon becomes a clear, thick, refractive glass object (2025 "Liquid Glass").
// The drawing is grown into glass pieces on signed distance fields (_liquid-field.mjs):
//   K  clear glass with a faint c1 tint          (the object)
//   A  coloured glass (c2), parted from K by a hairline gap   (the moving / secondary part)
//   S  an accent glass bead, cleared by a moat               (badges, slashes)
// and every piece is painted back to front as
//   shadow    a soft, light cast shadow (down)                         wm-shadow
//   caustic   coloured light focused through the glass onto the ground wm-shadow
//   body      mostly transparent: a tint -> c1 gradient and an ink hairline
//   refract   the dark refraction band inside the bottom-right edges
//   glint     the bottom-right inner rim light (light passing through)  wm-shine
//   lens      a soft bright lensing highlight inside the body          wm-shine
//   rim       the crisp white specular rim on the top-left edges        wm-shine
import { parsePath, distToPolyline, pointInRing, area, simplify, arclen, resample } from '../kernel/geom.mjs'
import * as F from './_liquid-field.mjs'
import { ringsD } from './_liquid-path.mjs'

export const L = {
  SCALE: 0.88, TX: -0.2, TY: -0.5,
  WK: 2.6, WA: 2.3, WS: 2.2,
  GAP: 0.42, MOAT: 0.55, CUT: 1.25, INNER: 1.1,
  M: 0.7, REACH: 1.6,
}

const P = {
  ink: '#1A2440', c1: '#4A9DFF', c2: '#A77BFF', c3: '#1C3F9E', c4: '#FF7EC1',
  tint: '#EAF6FF', accent: '#FF5F8F', shadow: '#0C1A3A', shine: '#FFFFFF', edge: '#B9E6FF',
}
export const PALETTE = P
export const col = r => `var(--with-liquid-${r}, ${P[r]})`

const tf = p => [(p[0] - 12) * L.SCALE + 12 + L.TX, (p[1] - 12) * L.SCALE + 12 + L.TY]
const polyArea = r => Math.abs(area(r))
const fracInside = (pts, ring) => pts.length ? pts.filter(p => pointInRing(p, ring)).length / pts.length : 0

// zero-length subpaths ("M12 16 L12 16") stroke as a round dot; the parser drops them
function dots(icon) {
  const out = []
  for (const p of icon.paths || []) {
    for (const chunk of String(p.d || '').split(/(?=[Mm])/)) {
      const m = chunk.match(/^M\s*(-?[\d.]+(?:e[-+]?\d+)?)[\s,]*(-?[\d.]+(?:e[-+]?\d+)?)/)
      if (!m || !/[LlHhVvCcSsQqTtAaZz]/.test(chunk)) continue
      let subs
      try { subs = parsePath(chunk) } catch { subs = [] }
      if (!subs.length) out.push({ pts: [[+m[1], +m[2]]], closed: false, plate: p.plate || 'K', pathId: p.id })
    }
  }
  return out
}

const at = (Fd, p) => {
  const i = Math.round(p[0] / F.H), j = Math.round(p[1] / F.H)
  if (i < 0 || j < 0 || i >= F.N || j >= F.N) return 1
  return Fd[j * F.N + i]
}
const mv = (Fd, dx, dy) => F.shift(Fd, Math.round(dx / F.H), Math.round(dy / F.H), 1)
const minus = (A, B) => F.subtract(F.copy(A), B)
const exact = Fd => F.any(Fd) ? F.redistance(Fd, F.contour(F.copy(Fd)).map(l => simplify(l, 0.006, true)), L.REACH) : Fd
const grow = (Fd, e) => F.offset(F.copy(Fd), -e)
const shrink = (Fd, e) => F.offset(F.copy(Fd), e)
const unionAll = fs => { const u = F.copy(fs[0]); for (let i = 1; i < fs.length; i++) F.union(u, fs[i]); return u }

// ---------------------------------------------------------------------------
// MODEL: the icon split into glass pieces (signed distance fields)
export function model(icon) {
  const all = [...(icon.lines || []), ...dots(icon)].filter(l => l.pts && l.pts.length)
    .map(l => ({ ...l, pts: l.pts.map(tf) }))
  const Kl = all.filter(l => l.plate !== 'A' && l.plate !== 'S')
  let Al = all.filter(l => l.plate === 'A')
  const Sl = all.filter(l => l.plate === 'S')

  // fills belong to the plate whose lines run closest to their edge
  const fills = { K: [], A: [], S: [] }
  for (const f of icon.fills || []) {
    const rings = (f.set && f.set.length ? f.set : (f.subs || []).map(s => s.pts)).filter(r => r && r.length > 2).map(r => r.map(tf))
    if (!rings.length) continue
    const votes = { K: 0, A: 0, S: 0 }
    for (const r of rings) for (let i = 0; i < r.length; i += 3) {
      let best = Infinity, pl = 'K'
      for (const l of all) { const d = distToPolyline(r[i], l.pts, l.closed); if (d < best) { best = d; pl = l.plate === 'A' || l.plate === 'S' ? l.plate : 'K' } }
      votes[pl]++
    }
    fills[votes.S > votes.K + votes.A ? 'S' : votes.A > votes.K ? 'A' : 'K'].push(rings)
  }

  // cutouts
  const cutArea = [], cutLine = []
  for (const c of icon.cutouts || []) for (const s of c.subs || []) {
    if (!s.pts || !s.pts.length) continue
    const pts = s.pts.map(tf)
    if (s.closed && pts.length > 2) cutArea.push(pts); else cutLine.push({ pts, closed: false })
  }

  const mass = F.field(L.M)
  for (const r of fills.K) F.region(r, L.M, mass)
  const dense = l => { const r = resample(l.pts, 0.25, l.closed).map(o => o.p); return r.length ? r : l.pts }
  const inMass = l => { const D = dense(l); return D.filter(p => at(mass, p) < -0.45).length / D.length }

  // K lines lying inside the mass are inner detail: grooves cut through the glass
  const inner = Kl.filter(l => fills.K.length && !l.closed && inMass(l) > 0.7)
  const KlBody = Kl.filter(l => !inner.includes(l))

  const fK = F.strokes(KlBody, L.WK, L.M)
  F.union(fK, mass)
  // cut through: closed cutouts, open cutouts and inner detail
  const rec = F.field(L.M)
  if (cutArea.length) F.region(cutArea, L.M, rec)
  if (cutLine.length) F.strokes(cutLine, L.CUT, L.M, rec)
  if (inner.length) F.strokes(inner, L.INNER, L.M, rec)
  let K0 = minus(fK, rec)

  // A: coloured glass. Inlays (inside the mass) sit in a moat cut in K; parts outside it (a shackle,
  // a handle, a crossing blade) simply overlap the clear glass, as one glass piece laid over another
  const fA = F.strokes(Al, L.WA, L.M)
  for (const r of fills.A) F.region(r, L.M, fA)
  let A0 = fA
  if (F.any(fA)) {
    const inl = Al.length ? Al.filter(l => inMass(l) > 0.5).length / Al.length : 0
    if (inl >= 0.5) K0 = minus(K0, grow(fA, L.GAP))
    // holes in an A fill (a scissor ring, an anchor's eye) are cut through the coloured glass too
    const cutA = cutArea.filter(r => fills.A.some(rings => rings.some(q => fracInside(r, q) > 0.8)))
    if (cutA.length) A0 = minus(fA, F.region(cutA, L.M))
  }

  // S: outermost closed rings are bead discs; everything below clears a moat
  const closedS = Sl.filter(l => l.closed && l.pts.length > 2)
  const badges = closedS.filter(l => !closedS.some(o => o !== l && polyArea(o.pts) > polyArea(l.pts) && fracInside(l.pts, o.pts) > 0.9))
  const inBadge = Sl.filter(l => !badges.includes(l) && badges.some(b => fracInside(dense(l), b.pts) > 0.8))
  const fS = F.strokes(Sl.filter(l => !badges.includes(l) && !inBadge.includes(l)), L.WS, L.M + L.MOAT)
  for (const b of badges) { F.region([b.pts], L.M + L.MOAT, fS); F.strokes([b], L.WS, L.M + L.MOAT, fS) }
  for (const r of fills.S) F.region(r, L.M + L.MOAT, fS)
  let S0 = fS
  if (F.any(fS)) {
    const moat = grow(fS, L.MOAT)
    K0 = minus(K0, moat); A0 = minus(A0, moat)
    if (inBadge.length) S0 = minus(fS, F.strokes(inBadge, 1.0, L.M))
  }
  const pieces = [['K', exact(K0)], ['A', exact(A0)], ['S', exact(S0)]].filter(([, f]) => F.any(f))
  return { pieces }
}

// ---------------------------------------------------------------------------
// PAINT
function smooth(r) {
  const n = r.length
  if (n < 5) return r
  return r.map((p, i) => {
    const a = r[(i - 1 + n) % n], b = r[(i + 1) % n]
    return [(a[0] + 2 * p[0] + b[0]) / 4, (a[1] + 2 * p[1] + b[1]) / 4]
  })
}
// a layer's traced loops are cached (CACHE, per build), so a repaint in a lighter tier only refits the curves
let CACHE = null
const dOf = (key, make, tol = 0.045, minA = 0.05, dp = 2, soft = false) => {
  let loops = CACHE && CACHE.get(key)
  if (!loops) {
    const Fd = make()
    loops = F.any(Fd) ? F.trace(F.copy(Fd), 0.012, minA).map(smooth) : []
    if (CACHE) CACHE.set(key, loops)
  }
  if (!loops.length) return ''
  return ringsD(loops, tol * (TIER ? 1.6 : 1), TIER && soft ? 1 : dp)
}
const bboxOf = Fd => {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (let j = 0; j < F.N; j++) for (let i = 0; i < F.N; i++) if (Fd[j * F.N + i] < 0) {
    const x = i * F.H, y = j * F.H
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y
  }
  return x0 === Infinity ? [3, 3, 21, 21] : [x0, y0, x1, y1]
}
const r2 = v => Math.round(v * 100) / 100
const stop = (offset, role, op) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (id, x1, y1, x2, y2, stops) => ['linearGradient', { id, x1: r2(x1), y1: r2(y1), x2: r2(x2), y2: r2(y2), gradientUnits: 'userSpaceOnUse' }, stops]
const rad = (id, cx, cy, r, stops) => ['radialGradient', { id, cx: r2(cx), cy: r2(cy), r: r2(r), gradientUnits: 'userSpaceOnUse' }, stops]

// crescent of Fd on the side facing away from (dx, dy): Fd minus Fd moved by (dx, dy)
const crescent = (Fd, dx, dy) => minus(Fd, mv(Fd, dx, dy))

// size budget (CONTRACT: target < 8 KB): a dense icon is repainted with coarser curve fits
// (tier 1), and the densest also lose the dispersion fringe (tier 2)
const BUDGET = 8600
const bytes = nodes => nodes.reduce((a, n) => a + (n[1].d ? n[1].d.length + 70 : 1800), 0)
export function build(icon) {
  const M = model(icon)
  if (!M.pieces.length) return null
  CACHE = new Map()
  try {
    let out = paint(icon, M, 0)
    // (tier 1 saves about a fifth: a paint far over budget goes straight to tier 2)
    const b = bytes(out)
    if (b > BUDGET) out = paint(icon, M, b > BUDGET * 1.25 ? 2 : 1)
    if (TIER === 1 && bytes(out) > BUDGET) out = paint(icon, M, 2)
    return out
  } finally { CACHE = null }
}

let TIER = 0
function paint(icon, M, tier) {
  TIER = tier
  const U = M.U || (M.U = unionAll(M.pieces.map(p => p[1])))
  const [x0, y0, x1, y1] = M.box || (M.box = bboxOf(U))
  const w = Math.max(1, x1 - x0), h = Math.max(1, y1 - y0)
  const id = n => `wg-liquid-${icon.name || 'icon'}-${n}`
  const url = n => `url(#${id(n)})`

  // gradients (shared across pieces, only the ones used), along the light's diagonal over the object's box
  const has = pl => M.pieces.some(p => p[0] === pl)
  const G = []
  const diag = (n, stops) => G.push(lin(id(n), x0, y0, x1, y1, stops))
  // 0 clear glass (K): barely tinted at the top-left, the c1 tint gathering toward the bottom-right
  diag(0, [stop(0, 'c1', 0.14), stop(0.6, 'c1', 0.36), stop(1, 'c1', 0.62)])
  // 1 coloured glass (A)
  if (has('A')) diag(1, [stop(0, 'c2', 0.3), stop(1, 'c2', 0.75)])
  // 2 refraction: the thick edge bends the light, so a band inside every edge darkens (deep at the bottom-right)
  diag(2, [stop(0, 'c3', 0.36), stop(1, 'c3', 0.95)])
  // 3 specular rim: bright white at the top-left, falling off
  G.push(lin(id(3), x0 + w * 0.2, y0 + h * 0.2, x1, y1, [stop(0, 'shine', 1), stop(1, 'shine', 0.15)]))
  // 4 lens: a soft bright pool inside the body, upper-left of centre
  G.push(rad(id(4), x0 + w * 0.34, y0 + h * 0.3, Math.max(w, h) * 0.5, [stop(0, 'shine', 0.8), stop(1, 'shine', 0)]))
  // 5 the ground: a soft shadow warmed by the caustic, the coloured light the glass focuses below it
  G.push(lin(id(5), x0, y0 + h * 0.4, x0 + w * 0.3, y1 + 1.6, [stop(0, 'shadow', 0.1), stop(1, 'c4', 0.32)]))

  const out = [['defs', {}, G]]
  out.push(['path', { d: dOf('ground', () => grow(mv(U, 0.25, 1.05), 0.2), 0.09, 0.2, 1), fill: url(5), class: 'wm-shadow' }])
  // each piece is a whole glass object, painted K first so an A part laid over it (a shackle's foot, a
  // calendar's ring, a crossing blade) shows the clear glass through its own. Motion parts (forge/MOTION.md):
  // with more than one plate, every node of an A / S piece carries wm-a / wm-s (its lights move with it);
  // K's optics are untagged (= wm-k), its lens, inner rim light and specular rim wm-shine
  const multi = M.pieces.length > 1
  const body = { K: { fill: url(0) }, A: { fill: url(1) }, S: { fill: col('accent'), 'fill-opacity': 0.75 } }
  for (const [pl, Fd] of M.pieces) {
    const cls = shine => pl === 'K' ? (shine ? 'wm-shine' : multi ? 'wm-k' : undefined) : pl === 'A' ? 'wm-a' : 'wm-s'
    const k = n => n + pl
    // the body: clear glass with an ink hairline
    out.push(['path', { d: dOf(k('body'), () => Fd), ...body[pl], stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.22, class: cls(false) }])
    // refraction band (one contour stroked across the band: the stroke of the 0.25u inset at 0.5u width covers
    // exactly the 0.5u band inside the edge, at half the bytes of a filled ring)
    out.push(['path', { d: dOf(k('band'), () => shrink(Fd, 0.25), 0.05, 0.05, 2, true), stroke: url(2), 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: cls(false) }])
    // the lens highlight
    out.push(['path', { d: dOf(k('lens'), () => shrink(mv(Fd, -0.15, -0.15), 0.62), 0.08, 0.12, 1), fill: url(4), class: cls(true) }])
    // chromatic dispersion: a warm fringe just inside the bottom-right edge
    if (tier < 2) out.push(['path', { d: dOf(k('fringe'), () => crescent(shrink(Fd, 0.12), -0.3, -0.3), 0.05, 0.03, 2, true), fill: col('c4'), 'fill-opacity': 0.6, class: cls(false) }])
    // inner rim light at the bottom-right (light passing through the glass)
    out.push(['path', { d: dOf(k('glint'), () => crescent(shrink(Fd, 0.4), -0.27, -0.27), 0.05, 0.03, 2, true), fill: col('edge'), 'fill-opacity': 0.85, class: cls(true) }])
    // the crisp specular rim along the top-left edges
    out.push(['path', { d: dOf(k('rim'), () => crescent(Fd, 0.32, 0.32), 0.04, 0.02), fill: url(3), class: cls(true) }])
  }
  return out.filter(n => n[0] === 'defs' || (n[1].d && n[1].d.length > 1))
}
