// BRUTAL core: the geometry behind forge/styles/brutal.mjs.
//
// Everything is modelled on signed distance fields (_brutal-field.mjs), so offsets,
// round joins, moats and the hard shadow are exact and robust on any skeleton:
//   INK     every centreline stroked thick and round (the ink role, currentColor)
//   COLOUR  the object's mass in flat saturated fields: the main body c1, regions
//           bounded by secondary (A) parts and closed cutouts (a door, a keyhole,
//           a pupil) c2, other big separate fields (a calendar header, a second
//           page) c3 / accent. Colour tucks under the ink, so there are no seams
//   SHADOW  the whole silhouette again, solid ink, pushed down-right: the hard
//           neo-brutalist offset shadow (no blur, real geometry)
//   BADGES  S-plate badges are stuck on top: a c4 disc with its own ink rim and its
//           own little hard shadow, cleared from the object by a moat
//   LINES   line-only glyphs (arrows, chevrons, checks) become fat ink tubes with a
//           c1 core when they have room, else the ink line with a c1 offset echo
import { parsePath, simplify, area, pointInRing, distToPolyline, resample } from '../kernel/geom.mjs'
import * as F from './_brutal-field.mjs'
import { textInfo } from './_live-text.mjs'
import { tune } from './_brutal-tune.mjs'

export const K = {
  W: 2.2,           // ink weight
  TEXT_W: 1.75,     // live-icon text weight
  SHIFT: -0.6,      // the drawing moves up-left so drawing + shadow sit centred
  OFF: 1.25,        // hard shadow offset (u, down-right)
  BOFF: 0.95,       // a badge's own shadow offset
  GAP_S: 0.8,       // moat around S-plate overlays
  BADGE_GLYPH: 0.85, // ink weight of a glyph on a badge disc (x W)
  BADGE_TOOTH: 0.45, // a toothed badge (a gear) grows by this much of the ink weight
  TUCK: 0.3,        // colour runs this far under the ink
  CUT_NEAR: 2.6,    // an open cutout that hugs the ink is already drawn by the ink
  CUT_LINE: 1.5,    // open cutouts far from the ink knock out a line this wide
  MIN_FILL: 4,      // visible colour (u^2) below which an icon counts as line-only
  HOLE: 10,         // enclosed holes smaller than this (u^2) are solid in the shadow
  A_SHARE: 0.55,    // a colour field whose rim is mostly A ink takes c2
  SPLIT: 0.14,      // a separate field this big (share of all colour) takes its own colour
  SPLIT_MIN: 3.5,   // ...and at least this big (u^2)
  SLIT: 2.4,
  HELD: 0.45,        // share of a colour field's rim that must be ink        // closed cutouts thinner than this (and long) are parting slits
  TUBE: 4.3,        // line-only tube: outer width
  CORE: 1.9,        // ...and its colour core
  TUBE_GAP: 5.0,    // tubes need distinct lines at least this far apart
  TOL: 0.035, TOL_C: 0.05,
}

const polyArea = r => Math.abs(area(r))
const fracInside = (pts, ring) => pts.length ? pts.filter(p => pointInRing(p, ring)).length / pts.length : 0
function solidity(pts) {
  const P = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const lo = [], hi = []
  for (const p of P) { while (lo.length > 1 && cr(lo.at(-2), lo.at(-1), p) <= 0) lo.pop(); lo.push(p) }
  for (const p of P.reverse()) { while (hi.length > 1 && cr(hi.at(-2), hi.at(-1), p) <= 0) hi.pop(); hi.push(p) }
  const ha = polyArea(lo.slice(0, -1).concat(hi.slice(0, -1)))
  return ha > 0 ? polyArea(pts) / ha : 1
}
const mv = pts => pts.map(p => [p[0] + K.SHIFT, p[1] + K.SHIFT])

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

// do two strokes run close and roughly parallel somewhere (a menu's bars, a list)?
// Strokes that meet at a joint (an arrowhead on its shaft) are fine as long as they
// open out at a decent angle: near a joint the gap must grow at least GROW per unit.
function crowded(lines, gapMin) {
  const GROW = 0.45
  const S = lines.map(l => {
    const r = l.pts.length > 1 ? resample(l.pts, 0.4, l.closed).map(o => o.p) : l.pts
    return r.length ? r : l.pts
  })
  for (let i = 0; i < lines.length; i++) for (let j = 0; j < lines.length; j++) {
    if (i === j) continue
    const b = lines[j]
    const joints = S[i].filter(p => distToPolyline(p, b.pts, b.closed) < 0.35)
    for (const p of S[i]) {
      const d = distToPolyline(p, b.pts, b.closed)
      if (d >= gapMin || d < 0.35) continue
      let s = Infinity
      for (const q of joints) s = Math.min(s, Math.hypot(p[0] - q[0], p[1] - q[1]))
      if (d < GROW * s) return true
    }
  }
  return false
}

// cells of a field -> per-cell component label (-1 = none)
function labels(Fd, comps) {
  const lab = new Int32Array(Fd.length).fill(-1)
  comps.forEach((c, i) => { for (const q of c.cells) lab[q] = i })
  return lab
}
// a copy of Fd that keeps only the cells whose label passes keep()
function only(Fd, lab, keep) {
  const G = F.copy(Fd)
  for (let k = 0; k < G.length; k++) if (G[k] < 0 && !keep(lab[k])) G[k] = F.H
  return G
}

// -------------------------------------------------------------------------------
export function build(icon) {
  const T = tune(icon.name)
  const W = T.w || K.W
  const lines = [...(icon.lines || []), ...dots(icon)]
    .filter(l => l.pts && l.pts.length)
    .map(l => ({ ...l, pts: mv(l.pts) }))
  const caps = new Map()
  for (const p of icon.paths || []) { const t = textInfo(p); if (t) caps.set(p.id, t.cap) }
  const isTxt = l => caps.has(l.pathId)
  const tlines = lines.filter(isTxt)
  const base = lines.filter(l => l.plate !== 'S' && !isTxt(l))
  const sig = lines.filter(l => l.plate === 'S' && !isTxt(l))

  // --- S plate: outermost closed rings are badges; everything else is a glyph
  const closedS = sig.filter(l => l.closed && l.pts.length > 2)
  const badges = closedS.filter(l => !closedS.some(o => o !== l && polyArea(o.pts) > polyArea(l.pts) && fracInside(l.pts, o.pts) > 0.9))
  const inBadge = g => badges.some(b => b !== g && fracInside(g.pts, b.pts) > 0.5)
  const freeS = sig.filter(l => !badges.includes(l) && !inBadge(l))
  const bGlyph = sig.filter(l => !badges.includes(l) && inBadge(l))
  const tBadge = badges.length ? tlines.filter(l => inBadge(l)) : []
  const tFree = tlines.filter(l => !tBadge.includes(l))

  const fills = (icon.fills || []).filter(f => f.set && f.set.length).map(f => f.set.map(mv))
  const onBadge = rings => {
    const pts = rings.flat()
    return badges.some(b => pts.filter(p => distToPolyline(p, b.pts, true) < 0.6).length / pts.length > 0.6)
  }
  const baseFills = fills.filter(r => !onBadge(r))

  // --- INK, by plate (the A ink tells which colour fields are secondary parts)
  const kLines = base.filter(l => l.plate !== 'A'), aLines = base.filter(l => l.plate === 'A')
  const inkK = F.strokes(kLines, W, 1.2)
  const inkA = F.strokes(aLines, W, 1.2)
  const ink = F.union(F.copy(inkK), inkA)
  if (tFree.length) F.strokes(tFree, K.TEXT_W, 1.2, ink)

  // --- FILL and the detail regions (closed cutouts, closed A rings)
  const fill = F.field(1.2)
  for (const rings of baseFills) F.region(rings, 1.2, fill)
  const cutLine = []
  let DC = null, DA = null, slits = null
  for (const c of icon.cutouts || []) {
    const rings = []
    for (const s of c.subs || []) {
      if (!s.pts || !s.pts.length) continue
      const pts = mv(s.pts)
      if (s.closed && pts.length > 2) { if (!badges.some(b => fracInside(pts, b.pts) > 0.9)) rings.push(pts); continue }
      const nearInk = pts.filter(p => base.some(l => distToPolyline(p, l.pts, l.closed) < K.CUT_NEAR)).length / pts.length
      if (nearInk <= 0.5) cutLine.push({ pts, closed: false })
    }
    const ar = Math.abs(rings.reduce((a, r) => a + area(r), 0))
    if (!rings.length || ar < 0.8) continue
    // a slit (thin and long: Solid's parting line between two strokes) knocks out; a real opening colours
    const own = F.region(rings, 1.2)
    let r = 0
    for (let k = 0; k < own.length; k++) if (-own[k] > r) r = -own[k]
    if (2 * r < K.SLIT && ar > 2 * (2 * r) ** 2) { (slits ||= F.field(1.2)); F.union(slits, own); continue }
    DC = DC ? F.union(DC, own) : own
  }
  for (const l of aLines) if (l.closed && l.pts.length > 2 && polyArea(l.pts) >= 1.5) DA = F.region([l.pts], 1.2, DA || F.field(1.2))
  if (cutLine.length) F.subtract(fill, F.strokes(cutLine, K.CUT_LINE, 1.2))
  if (slits) F.subtract(fill, slits)
  // a cutout colours only inside the mass; a closed A ring colours wherever it is
  if (DC) F.intersect(DC, fill)
  let D = DC && DA ? F.union(DC, DA) : DC || DA
  // cutouts that only carve the mass into thick strokes (wifi's fan into arcs) are Solid's business:
  // when the mass minus every cutout is mostly ink, the icon is line work
  if (D && !T.fill) {
    const knock = F.subtract(F.subtract(F.copy(fill), D), ink)
    if (F.extent(knock, 0.6).area < K.MIN_FILL) {
      // ...unless what the cutouts leave is a real coloured field (a battery's cell)
      const thick = F.offset(F.subtract(F.copy(D), ink), 0.9)
      if (F.extent(thick, 0.3).area < 2) { F.subtract(fill, D); D = null }
    }
  }

  // before the moat: fields split only by a slash or a badge keep one colour
  const pre = { ink: F.copy(ink), mass: D ? F.union(F.copy(fill), D) : F.copy(fill) }

  // --- S overlays: clear a moat through everything below
  let disc = null, moat = null
  if (badges.length || freeS.length) {
    moat = F.field(1.2)
    for (const b of badges) { F.region([b.pts], 1.2, moat); F.strokes([b], W + 2 * K.GAP_S, 1.2, moat) }
    if (freeS.length) F.strokes(freeS, W + 2 * K.GAP_S, 1.2, moat)
    F.subtract(ink, moat); F.subtract(inkK, moat); F.subtract(inkA, moat)
    F.subtract(fill, moat)
    if (D) F.subtract(D, moat)
    if (badges.length) {
      disc = F.field(2)
      for (const b of badges) { F.region([b.pts], 2, disc); F.strokes([b], solidity(b.pts) < 0.93 ? W * K.BADGE_TOOTH : W, 2, disc) }
    }
  }

  const under = F.offset(F.copy(ink), K.TUCK)
  // closed A rings outside the mass still colour (a pupil, a wheel hub, a lens)
  const mass = D ? F.union(F.copy(fill), D) : fill
  const visAll = F.subtract(F.copy(mass), ink)
  // slivers (a fill poking out past the ink) do not count as colour
  const ext = F.extent(F.offset(visAll, 0.45), 0.3)
  const out = { ink, inkS: null, shadow: null, fields: [], echo: null, tube: null, badge: null, bshadow: null }

  // line-only glyphs
  const lineWork = () => {
    const solo = base.filter(l => l.pts.length > 1 || l.closed)
    if (!T.echo && solo.length && !tFree.length && (T.tube || !crowded(solo, K.TUBE_GAP))) {
      const outer = F.strokes(base, W + (T.tube || K.TUBE) - K.W, 1.2)
      const core = F.strokes(base, K.CORE + (T.tube ? T.tube - K.TUBE : 0), 1.2)
      if (D) F.union(outer, F.offset(F.copy(D), -0.9))
      if (moat) { F.subtract(outer, moat); F.subtract(core, moat) }
      out.ink = outer
      out.fields.push({ c: 'c1', f: core })
      out.shadow = outer
      out.tube = true
    } else {
      out.echo = ink
    }
  }
  if (!disc && ext.area < K.MIN_FILL && !T.fill) lineWork()
  else {
    // colour fields: details (D) in c2; the rest split into connected fields
    const col = F.subtract(F.copy(mass), under)
    let colD = null
    if (D) { colD = F.intersect(F.copy(col), D); F.subtract(col, D) }
    const pcol = F.subtract(pre.mass, F.offset(F.copy(pre.ink), K.TUCK))
    if (D) F.subtract(pcol, D)
    const comps = F.components(pcol, true).filter(c => c.area > 0.02)
    const lab = labels(pcol, comps)
    const total = comps.reduce((s, c) => s + c.area, 0) || 1
    // rim test: which ink plate borders each field
    const aShare = new Float32Array(comps.length), tot = new Float32Array(comps.length)
    if (aLines.length) for (let k = 0; k < col.length; k++) {
      const c = lab[k]
      if (c < 0 || pcol[k] < -0.35) continue
      const a = inkA[k], kk = inkK[k]
      if (Math.min(a, kk) > 0.7) continue
      tot[c]++
      if (a < kk) aShare[c]++
    }
    const colour = new Array(comps.length).fill('c1')
    // a sliver field (nothing thicker than ~1u) is a fill poking out past the ink: drop it
    const core = new Float32Array(comps.length)
    for (let k = 0; k < pcol.length; k++) if (lab[k] >= 0 && pcol[k] < -0.75) core[lab[k]]++
    // ...and so is a field the ink does not hold: brutal colour always sits inside an outline
    const rim = new Float32Array(comps.length), rimInk = new Float32Array(comps.length)
    for (let k = 0; k < pcol.length; k++) {
      const c = lab[k]
      if (c < 0 || pcol[k] < -0.2) continue
      rim[c]++
      if (pre.ink[k] < 0.9 || (moat && moat[k] < 0.9)) rimInk[c]++
    }
    comps.forEach((c, i) => { if ((!(T.keep && c.area > 6) && core[i] * F.H * F.H < Math.max(0.12, 0.2 * c.area)) || (!T.open && rim[i] > 10 && rimInk[i] / rim[i] < K.HELD)) colour[i] = null })
    comps.forEach((c, i) => { if (colour[i] && tot[i] > 4 && aShare[i] / tot[i] > K.A_SHARE) colour[i] = 'c2' })
    const order = comps.map((c, i) => i).filter(i => colour[i] === 'c1').sort((p, q) => comps[q].area - comps[p].area)
    const extra = T.extra || ['c3', 'accent']
    let x = 0
    for (const i of order.slice(1)) {
      if (T.mono || freeS.length) break
      if (comps[i].area >= Math.max(K.SPLIT * total, K.SPLIT_MIN)) colour[i] = extra[x++ % extra.length]
    }
    if (T.swap) for (let i = 0; i < colour.length; i++) colour[i] = T.swap[colour[i]] || colour[i]
    for (const c of ['c1', 'c3', 'accent', 'c2', 'c4']) {
      let f = comps.some((_, i) => colour[i] === c) ? only(col, lab, l => l >= 0 && colour[l] === c) : null
      if (c === (T.detail || 'c2') && colD) {
        // a detail speck (a cutout the ink nearly closes) stays ink
        const dc = F.components(colD, true)
        for (const d of dc) { let deep = 0; for (const q of d.cells) if (colD[q] < -0.6) deep++; if (deep * F.H * F.H < 0.15) for (const q of d.cells) colD[q] = F.H }
        f = f ? F.union(f, colD) : colD
      }
      if (f) out.fields.push({ c, f })
    }
    // every field dropped (a Solid-style mass carved into bars): it is line work after all
    if (!disc && !T.fill && !out.fields.length) { lineWork(); return finish() }
    // the hard shadow: the whole silhouette (without dropped fields), small holes filled
    const kept = colour.some(c => !c) ? only(mass, lab, l => l < 0 || !!colour[l]) : mass
    const sil = F.union(F.copy(ink), kept)
    out.shadow = F.fillHoles(sil, K.HOLE)
  }

  return finish()
  function finish() {
  // badges and free S glyphs on top
  if (disc) {
    const bInk = F.strokes(badges, W, 1.2)
    if (bGlyph.length) F.strokes(bGlyph, W * K.BADGE_GLYPH, 1.2, bInk)
    if (tBadge.length) F.strokes(tBadge, K.TEXT_W, 1.2, bInk)
    const bsil = F.union(F.copy(disc), bInk)
    out.bshadow = bsil
    out.badge = F.subtract(F.copy(disc), F.offset(F.copy(bInk), K.TUCK))
    out.inkS = bInk
  }
  if (freeS.length) {
    const sInk = F.strokes(freeS, W, 1.2)
    out.inkS = out.inkS ? F.union(out.inkS, sInk) : sInk
  }
  if (tBadge.length && !disc) out.ink = F.strokes(tBadge, K.TEXT_W, 1.2, out.ink)
  return out
  }
}

// -------------------------------------------------------------------------------
// output: compact relative path data (absolute M, relative l/h/v, minimal numbers)
const num = (v, dp) => {
  let s = (v / 10 ** dp).toFixed(dp)
  if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '')
  if (s === '-0') s = '0'
  return s.replace(/^(-?)0\./, '$1.')
}
const join = arr => arr.reduce((acc, s) => acc + (acc && !s.startsWith('-') && !/[a-z]$/i.test(acc) ? ' ' : '') + s, '')
export function loopsD(loops, dp = 2, dx = 0, dy = 0) {
  const k = 10 ** dp
  let d = ''
  for (const ring of loops) {
    const P = ring.map(p => [Math.round((p[0] + dx) * k), Math.round((p[1] + dy) * k)])
    const Q = P.filter((p, i) => i === 0 || p[0] !== P[i - 1][0] || p[1] !== P[i - 1][1])
    if (Q.length > 1 && Q[0][0] === Q.at(-1)[0] && Q[0][1] === Q.at(-1)[1]) Q.pop()
    if (Q.length < 3) continue
    let s = 'M' + join([num(Q[0][0], dp), num(Q[0][1], dp)])
    let last = 'M'
    for (let i = 1; i < Q.length; i++) {
      const ex = Q[i][0] - Q[i - 1][0], ey = Q[i][1] - Q[i - 1][1]
      let cmd, nums
      if (ey === 0) { cmd = 'h'; nums = [num(ex, dp)] }
      else if (ex === 0) { cmd = 'v'; nums = [num(ey, dp)] }
      else { cmd = 'l'; nums = [num(ex, dp), num(ey, dp)] }
      if (cmd === last) s += (nums[0].startsWith('-') ? '' : ' ') + join(nums)
      else s += cmd + join(nums)
      last = cmd
    }
    d += s + 'z'
  }
  return d
}
export const trace = (Fd, tol, minArea) => F.trace(Fd, tol, minArea)
export { simplify }
