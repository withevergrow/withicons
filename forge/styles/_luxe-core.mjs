// LUXE core: the geometry behind forge/styles/luxe.mjs.
//
// Every icon becomes a small precious object, built back to front from stacked
// volumetric layers on signed distance fields (_luxe-field.mjs):
//
//   SHADOW   the whole silhouette cast down-right, in two soft steps
//   WALL     each part extruded along one depth vector (down, a little right): the
//            deep side wall you see below a thick lacquered slab. Holes show the
//            inner wall on their upper-left side, exactly as a real slab would
//   FACE     the part's top surface in its base colour, then
//            - a shade crescent along every edge that faces away from the light
//            - a tonal ramp: inset contours, each smaller and nudged toward the light,
//              stacked at low opacity so they read as one smooth gradient
//            - a lit chamfer on every edge facing the light, a cool rim light on the
//              edges facing away, and a crisp specular sickle in the upper-left
//   RECESS   cutouts and inner detail are engraved into the face: a dark well whose
//            floor catches the light below its shadowed upper-left lip
//
// Plates choose the material: K parts are jewel enamel (sapphire by default), A parts
// are polished gold, S parts (badges, slashes, modifiers) are ruby cabochons set in a
// gold bezel, cleared from everything below by a moat. A parts that sit inside the
// object's mass are gold inlays (painted over it); A parts outside it (a shackle,
// a handle) are gold pieces behind it.
//
// Light comes from the upper-left. Every colour is a role-named CSS variable.
import { parsePath, distToPolyline, pointInRing, area, simplify, arclen, resample } from '../kernel/geom.mjs'
import * as F from './_luxe-field.mjs'
import { tuneFor } from './_luxe-tune.mjs'
import { setOf } from '../kernel/bool.mjs'
import { ringsD } from './_luxe-path.mjs'
import { markIds as liveMarks } from './_luxe-live.mjs'

export const K = {
  SCALE: 0.9,            // drawing scale about the centre (room for depth and shadow)
  TX: -0.45, TY: -0.75,  // the drawing moves up-left so object + depth + shadow sit centred
  WK: 2.25,              // enamel tube width (K strokes)
  WA: 1.95,              // gold tube width (A strokes)
  WS: 1.95,              // S glyph width
  GAP: 0.38,             // parting groove around gold inlays
  MOAT: 0.62,            // moat around S overlays
  BEZEL: 0.42,           // gold bezel width around an S jewel
  DEPTH: 1.05,           // extrusion depth (u)
  DIR: [0.4, 0.92],      // extrusion direction (down, a little right)
  CUT: 1.25,             // engraved groove width (open cutouts, inner lines)
  REACH: 1.3,            // exact distance reach for erosion
  M: 0.6,                // field margin while building
  TOL: 0.03,             // simplification of the main face
  TOL2: 0.045,           // simplification of soft overlays
}

// ---------------------------------------------------------------------------
const P = { // palette role -> default
  ink: '#0B1033', c1: '#2039B4', c2: '#C0174F', c3: '#16206E', c4: '#7B4A12',
  tint: '#FFEFC4', accent: '#E3AE47', shadow: '#0A0B26', shine: '#FFFFFF', edge: '#9CC2FF',
}
export const PALETTE = P
export const col = r => `var(--with-luxe-${r}, ${P[r]})`

// materials: which roles paint each layer
const MAT = {
  enamel: { base: 'c1', dark: 'shadow', darkOp: 0.34, light: 'shine', lightOp: 0.075, steps: [[0.42, 0.24]], discs: [0.4, 0.24], wall: 'c3', rim: 'edge', rimOp: 0.75, chamfer: 'shine', chamferOp: 0.42, spec: 'shine', glaze: 0.16 },
  gold:   { base: 'accent', dark: 'c4', darkOp: 0.62, light: 'tint', lightOp: 0.24, steps: [[0.3, 0.16], [0.62, 0.36]], discs: [], wall: 'c4', rim: 'tint', rimOp: 0, chamfer: 'tint', chamferOp: 0.85, spec: 'shine', glaze: 0.22 },
  champagne: { base: 'tint', dark: 'accent', darkOp: 0.55, light: 'shine', lightOp: 0.3, steps: [[0.3, 0.16]], discs: [], wall: 'c4', rim: 'tint', rimOp: 0, chamfer: 'shine', chamferOp: 0.85, spec: 'shine', glaze: 0 },
  pearl:  { base: 'tint', dark: 'c4', darkOp: 0.28, light: 'shine', lightOp: 0.5, steps: [[0.25, 0.14]], discs: [0.3], wall: 'c4', rim: 'edge', rimOp: 0, chamfer: 'shine', chamferOp: 0.6, spec: 'shine', glaze: 0 },
  jewel:  { base: 'c2', dark: 'shadow', darkOp: 0.36, light: 'shine', lightOp: 0.1, steps: [[0.25, 0.14]], discs: [0.3], wall: 'c4', rim: 'edge', rimOp: 0.0, chamfer: 'shine', chamferOp: 0.3, spec: 'shine', glaze: 0.18 },
}

// ---------------------------------------------------------------------------
const tf = (p, T) => {
  const s = K.SCALE * (T.scale || 1)
  return [(p[0] - 12) * s + 12 + K.TX + (T.dx || 0), (p[1] - 12) * s + 12 + K.TY + (T.dy || 0)]
}
const fracInside = (pts, ring) => pts.length ? pts.filter(p => pointInRing(p, ring)).length / pts.length : 0
const polyArea = r => Math.abs(area(r))

// zero-length subpaths ("M12 16 L12 16") stroke as a round dot; the parser drops them
function dots(icon) {
  const out = []
  for (const p of icon.paths || []) {
    for (const chunk of String(p.d || '').split(/(?=[Mm])/)) {
      const m = chunk.match(/^M\s*(-?[\d.]+(?:e[-+]?\d+)?)[\s,]*(-?[\d.]+(?:e[-+]?\d+)?)/)
      if (!m || !/[LlHhVvCcSsQqTtAaZz]/.test(chunk)) continue
      let subs
      try { subs = parsePath(chunk) } catch { subs = [] }
      if (!subs.length) out.push({ pts: [[+m[1], +m[2]]], closed: false, plate: p.plate || 'K' })
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
const exact = Fd => F.any(Fd) ? F.redistance(Fd, F.contour(F.copy(Fd)).map(l => simplify(l, 0.006, true)), K.REACH) : Fd
const erode = (Fd, e) => F.offset(F.copy(Fd), e)
const empty = Fd => !F.any(Fd)

// ---------------------------------------------------------------------------
// MODEL: the icon split into material parts, as signed distance fields
// a per-icon redraw (or extra parts) from _luxe-tune.mjs, prepared like a skeleton
function prep(icon, T) {
  if (!T.redraw && !T.extra) return icon
  const R = T.redraw || {}
  const raw = {
    paths: [...(R.paths || icon.paths || []).map(p => ({ id: p.id, d: p.d, plate: p.plate || 'K' })), ...(T.extra || []).map((p, i) => ({ id: 'x' + i, d: p.d, plate: p.plate || 'S' }))],
    fills: R.fills ? R.fills.map(d => ({ d, subs: parsePath(d) })) : icon.fills,
    cutouts: R.cutouts ? R.cutouts.map(d => ({ d, subs: parsePath(d) })) : icon.cutouts,
  }
  const paths = raw.paths.map((p, i) => ({ ...p, id: p.id || 'p' + i, subs: parsePath(p.d) }))
  const fills = (raw.fills || []).map(f => f.set ? f : { ...f, set: setOf(f.subs.map(x => x.pts)) })
  return {
    name: icon.name, paths, fills, cutouts: raw.cutouts || [],
    lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))),
  }
}

export function model(icon0) {
  const T = tuneFor(icon0.name, icon0.params)
  const icon = prep(icon0, T)
  const all = [...(icon.lines || []), ...dots(icon)].filter(l => l.pts && l.pts.length)
    .map(l => ({ ...l, pts: l.pts.map(p => tf(p, T)) }))
  let markIds = new Set()
  let plateOf = l => (T.plate && T.plate[l.pathId]) || (T.remap && T.remap[l.plate]) || l.plate
  // Live marks (a die's pips, the marked day of a month: small closed gold loops on the face) are set as
  // pearls in gold bezels: a jewel that reads by light on the deep enamel at 24px (ruby and sapphire are
  // the same luminance, so a ruby mark would only show by hue)
  if (icon0.params) {
    const marks = liveMarks(icon)
    markIds = marks
    if (marks.size) { const base = plateOf; plateOf = l => marks.has(l.pathId) && !(T.plate && T.plate[l.pathId]) ? 'S' : base(l) }
  }
  const Kl = all.filter(l => plateOf(l) === 'K')
  let Al = all.filter(l => plateOf(l) === 'A')
  const Sl = all.filter(l => plateOf(l) === 'S')

  // fills: each belongs to the plate whose lines run closest to its edge
  const fills = { K: [], A: [], S: [] }
  for (const f of T.noFills ? [] : icon.fills || []) {
    const rings = (f.set && f.set.length ? f.set : (f.subs || []).map(s => s.pts)).filter(r => r && r.length > 2).map(r => r.map(p => tf(p, T)))
    if (!rings.length) continue
    const votes = { K: 0, A: 0, S: 0 }
    for (const r of rings) for (let i = 0; i < r.length; i += 3) {
      let best = Infinity, pl = 'K'
      // (a Live icon's letters never vote: its face must not turn to gold when the text grows wide)
      for (const l of all) { if (String(l.pathId || '').startsWith('text:')) continue; const d = distToPolyline(r[i], l.pts, l.closed); if (d < best) { best = d; pl = plateOf(l) } }
      votes[pl]++
    }
    const pl = T.fillPlate || (votes.S > votes.K + votes.A ? 'S' : votes.A > votes.K ? 'A' : 'K')
    fills[pl].push(rings)
  }

  // Live icons (forge/DYNAMIC.md) carry params: their stroke-font text and clock hands are
  // A lines the skeleton also knocks out as open cutouts
  const live = !!icon0.params
  // cutouts
  const cutArea = [], cutLine = []
  const cutouts = [...(icon.cutouts || []), ...(T.addCutouts || []).map(d => ({ d, subs: parsePath(d) }))]
  if (!T.noCutouts) for (const c of cutouts) {
    let subs = c.subs || []
    // live: a letter that ends where it starts (O, D, 0) is a line, not an area; only an explicit Z closes it
    if (live && typeof c.d === 'string') {
      const z = c.d.split(/(?=[Mm])/).filter(ch => /[LlHhVvCcSsQqTtAa]/.test(ch)).map(ch => /[Zz]/.test(ch))
      if (z.length === subs.length) subs = subs.map((s, i) => s.closed && !z[i] ? { ...s, closed: false, pts: [...s.pts, s.pts[0]] } : s)
    }
    for (const s of subs) {
      if (!s.pts || !s.pts.length) continue
      const pts = s.pts.map(p => tf(p, T))
      if (s.closed && pts.length > 2) cutArea.push(pts); else cutLine.push({ pts, closed: false })
    }
  }
  // an A line drawn along an open cutout: a short one is a slot (a keyhole) and the
  // engraving draws it; a long one (a ribbon, a strap, a seam) becomes a gold inlay.
  // Live: every one is text or a hand, a fine gold inlay set flush into the face
  const along = (l, c) => c.pts.every(p => distToPolyline(p, l.pts, l.closed) < 0.4) || l.pts.every(p => distToPolyline(p, c.pts) < 0.4)
  const dropCut = new Set(), textA = []
  Al = Al.filter(l => {
    const cs = cutLine.filter(c => along(l, c))
    if (!cs.length) return true
    if (!live && arclen(l.pts, l.closed) < 3.2 && !T.inlay) return false
    for (const c of cs) dropCut.add(c)
    if (live) { textA.push(l); return false }
    return true
  })
  for (let i = cutLine.length - 1; i >= 0; i--) if (dropCut.has(cutLine[i])) cutLine.splice(i, 1)

  const mass = F.field(K.M)
  for (const r of fills.K) F.region(r, K.M, mass)
  const dense = l => { const r = resample(l.pts, 0.25, l.closed).map(o => o.p); return r.length ? r : l.pts }
  const inMass = l => { const P = dense(l); return P.filter(p => at(mass, p) < -0.45).length / P.length }
  const depthIn = l => -Math.min(0, ...dense(l).map(p => at(mass, p)))

  // K lines lying inside the mass are inner detail: engraved, not fused away
  const inner = T.noEngrave ? [] : Kl.filter(l => fills.K.length && inMass(l) > 0.7 && !l.closed)
  const KlBody = Kl.filter(l => !inner.includes(l))

  // A parts inside the mass are gold inlays (front); the rest sit behind the object
  const front = [], back = []
  for (const l of Al) (T.aFront === true || (T.aFront !== false && (inMass(l) > 0.5 || depthIn(l) > 0.5)) ? front : back).push(l)
  // T.caps: every enamel bar wears a polished gold cap on its top end (the end that moves with a Live value)
  if (T.caps) fills.K.forEach((rings, i) => {
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity
    for (const r of rings) for (const [x, y] of r) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y) }
    if (y1 - y0 < 0.6) return
    const cx = (x0 + x1) / 2
    front.push({ pts: [[cx, y0 + 0.3], [cx, Math.min(y1, y0 + 0.7)]], closed: false, plate: 'A', pathId: 'cap' + i })
  })

  // S: outermost closed rings are badges (filled discs); the rest are glyphs
  const closedS = Sl.filter(l => l.closed && l.pts.length > 2)
  const badges = closedS.filter(l => !closedS.some(o => o !== l && polyArea(o.pts) > polyArea(l.pts) && fracInside(l.pts, o.pts) > 0.9))

  // live icons drawn without a frame (weather readings, a bare clock face, network
  // labels): their free lines are lettering, so they take the finer lettering weights
  const freeK = live && !fills.K.length && !T.wk
  // free Live text (no face under it: "21°" under a cloud, a gauge's reading): fine gold lettering outlined in
  // ink, seated shallow, so it reads on light and dark pages and its counters stay open at 24px
  const isTxt = l => String(l.pathId || '').startsWith('text:')
  const freeTxt = live ? [...(freeK ? KlBody : []), ...back].filter(isTxt) : []
  const KlB = freeTxt.length ? KlBody.filter(l => !freeTxt.includes(l)) : KlBody
  const backB = freeTxt.length ? back.filter(l => !freeTxt.includes(l)) : back
  const fTf = freeTxt.length ? freeTextField(freeTxt, K.M) : null
  const fK = freeK ? textField(KlB, K.M, 1.12) || F.field(K.M) : F.strokes(KlB, T.wk || K.WK, K.M)
  F.union(fK, mass)
  const fAf = F.strokes(front, T.wa || K.WA, K.M)
  // Live: a closed gold part on the face knocked out by its own cutout (a stopwatch's elapsed sweep) is solid
  // polished gold, not a gold outline round a dark well, so the value reads as a mass at 24px
  if (live) for (const l of front) {
    if (!l.closed || l.pts.length < 3 || polyArea(l.pts) < 5) continue // (a small ring is an eyelet: a hole)
    const k = cutArea.findIndex(r => r.length > 2 && r.every(p => distToPolyline(p, l.pts, true) < 0.35))
    if (k < 0) continue
    F.region([cutArea[k]], K.M, fAf)
    cutArea.splice(k, 1)
  }
  const fAb = live && !T.wa ? textField(backB, K.M, 1.1) || F.field(K.M) : F.strokes(backB, T.wa || K.WA, K.M)
  for (const r of fills.A) {
    // an A fill joins whichever A group it touches most
    const pts = r.flat()
    const nf = front.length ? pts.filter(p => front.some(l => distToPolyline(p, l.pts, l.closed) < 0.6)).length : 0
    const nb = back.length ? pts.filter(p => back.some(l => distToPolyline(p, l.pts, l.closed) < 0.6)).length : 0
    F.region(r, K.M, nf >= nb && front.length ? fAf : fAb)
  }
  // a glyph set inside a badge (a count, a plus) is engraved into the jewel in gold,
  // not fused into it
  const inBadge = Sl.filter(l => !badges.includes(l) && badges.some(b => fracInside(dense(l), b.pts) > 0.8))
  const MS = K.MOAT + 0.5
  const fS = F.strokes(Sl.filter(l => !badges.includes(l) && !inBadge.includes(l)), T.ws || K.WS, MS)
  const fP = F.field(MS)
  for (const b of badges) { const t = markIds.has(b.pathId) ? fP : fS; F.region([b.pts], MS, t); F.strokes([b], T.ws || K.WS, MS, t) }
  const hasP = F.any(fP)
  if (hasP) F.union(fS, fP)
  for (const r of fills.S) F.region(r, MS, fS)

  // engraving
  const rec = F.field(K.M)
  if (cutArea.length) F.region(cutArea, K.M, rec)
  if (cutLine.length) F.strokes(cutLine, T.cut || K.CUT, K.M, rec)
  if (inner.length) F.strokes(inner, T.cut || K.CUT, K.M, rec)

  // overlays clear moats through what lies below them
  const hasS = F.any(fS), hasAf = F.any(fAf)
  const moatS = hasS ? F.offset(F.copy(fS), -K.MOAT) : null
  const gapA = hasAf ? F.offset(F.copy(fAf), -K.GAP) : null
  let K0 = fK
  if (gapA) K0 = minus(K0, gapA)
  if (moatS) K0 = minus(K0, moatS)
  let Af = fAf, Ab = fAb
  if (moatS) { Af = minus(Af, moatS); Ab = minus(Ab, moatS) }
  // a hole cut clean through: closed cutouts that touch the outside of the mass keep it open
  const recIn = F.intersect(F.copy(rec), K0)

  // cutouts that fall inside a gold part (a wheel's hub) are engraved into the gold
  const recOf = P => {
    if (!F.any(P) || !F.any(rec)) return null
    const r = F.intersect(F.copy(rec), F.offset(F.copy(P), 0.3))
    const a = F.extent(r, 0).area
    return a > 0.3 && a < 0.6 * F.extent(P, 0).area ? exact(r) : null
  }
  // fine gold lettering: live text and hands on the face, glyphs inside a jewel
  // (a Live dot that is not a letter, a month's day, is a full gold stud: it must read as a mark at 24px)
  const isDot = l => !String(l.pathId || '').startsWith('text:') && arclen(l.pts, l.closed) < 0.6
  let fT = textField(textA.filter(l => !isDot(l)), K.M)
  const fSg = textField(inBadge, K.M, 0.82), dotsA = textA.filter(isDot)
  if (dotsA.length) { fT = fT || F.field(K.M); F.strokes(dotsA, 1.75, K.M, fT) }
  return {
    live, T, K0: exact(K0), Ab: exact(Ab), Af: exact(Af), S: exact(hasP ? minus(fS, fP) : fS), P: hasP ? exact(fP) : null, rec: exact(recIn), recAf: recOf(Af), recAb: recOf(Ab), hasS, hasAf,
    Tx: fT && exact(moatS ? minus(fT, moatS) : fT), Sg: fSg && exact(fSg), Tf: fTf && exact(fTf),
    sil: unionAll([fK, fAf, fAb, fS, ...(fTf ? [fTf] : [])]),
  }
}
// lettering is stroked by text row: a row with the font's large caps gets a fuller line,
// the small caps (and glyphs in a jewel) a finer one, so counters stay open
const WT_L = 1.6, WT_S = 1.3
function textField(lines, margin, k = 1) {
  if (!lines.length) return null
  const box = lines.map(l => { let a = Infinity, b = -Infinity; for (const p of l.pts) { if (p[1] < a) a = p[1]; if (p[1] > b) b = p[1] } return [a, b] })
  // rows: lines whose vertical spans overlap (transitively)
  const ord = lines.map((_, i) => i).sort((i, j) => box[i][0] - box[j][0])
  const row = new Array(lines.length), rows = []
  for (const i of ord) {
    const r = rows.at(-1)
    if (r && box[i][0] < r[1] - 0.2) { r[1] = Math.max(r[1], box[i][1]); row[i] = rows.length - 1 }
    else { rows.push([box[i][0], box[i][1]]); row[i] = rows.length - 1 }
  }
  const F0 = F.field(margin)
  lines.forEach((l, i) => {
    const h = (rows[row[i]][1] - rows[row[i]][0]) / K.SCALE
    F.strokes([l], (h > 5.9 ? WT_L : WT_S) * k, margin, F0)
  })
  return F0
}
// free lettering: a finer gold line (the ink outline around it carries the contrast)
function freeTextField(lines, margin) {
  const F0 = F.field(margin)
  for (const l of lines) F.strokes([l], (+String(l.pathId).split(':')[2] || 5) >= 6 ? 1.3 : 1.0, margin, F0)
  return F0
}
function unionAll(fs) { const u = F.copy(fs[0]); for (let i = 1; i < fs.length; i++) F.union(u, fs[i]); return u }

// ---------------------------------------------------------------------------
// PAINT
// one light pass of neighbour averaging: removes the marching-squares ripple, so the
// curve fit needs far fewer segments (keeps sharp corners within ~0.03u)
function smooth(r) {
  const n = r.length
  if (n < 5) return r
  return r.map((p, i) => {
    const a = r[(i - 1 + n) % n], b = r[(i + 1) % n]
    return [(a[0] + 2 * p[0] + b[0]) / 4, (a[1] + 2 * p[1] + b[1]) / 4]
  })
}
// trace quality per layer kind: [simplify tolerance, min area, decimals]
//   tier 0  full: every ramp step, sheen disc, rim light and glaze
//   tier 1  dense: one ramp step and one sheen disc per piece (the fine lights stay)
//   tier 2  lite: also no rim light or glaze, coarser fit
//   tier 3  dense (many small pieces): the ramp, sheen and fall-off go too; each piece keeps its
//           wall, face, shade, lit chamfer and specular, which is what reads at icon sizes
let BODY, FINE, SOFT, TIER = 0
const setQuality = tier => {
  TIER = tier
  BODY = tier > 1 ? [0.06, 0.06, 2] : [0.045, 0.05, 2]
  FINE = tier > 1 ? [0.06, 0.05, 2] : [0.045, 0.04, 2]
  SOFT = tier > 1 ? [0.11, 0.16, 1] : tier ? [0.09, 0.14, 1] : [0.075, 0.12, 1]
}
// size budget (CONTRACT: target < 6 KB): a dense icon is rebuilt in a lighter tier. The full
// paint's size predicts the first tier worth trying (tiers save roughly 10, 28 and 36 %), so
// a dense icon costs two paints rather than one per tier
const BUDGET = 5700, SAVE = [1, 0.9, 0.7, 0], LIVE_CAP = 15000
// Only a Live icon's body (its enamel and the gold behind it) counts toward the budget: the quality tier must
// not change with the value (a longer number, a moved mark or hand would otherwise repaint the whole object in
// another tier, and every edge would shift)
const TEXTN = new WeakSet()
const bytes = nodes => nodes.reduce((a, n) => a + (TEXTN.has(n) ? 0 : n[1].d.length + 60), 0)
export function build(icon) {
  const M = model(icon)
  // a Live icon paints in one fixed tier (dense: every light but the second ramp step and sheen disc), so its
  // look never jumps between tiers as the value changes; only a pathological drawing drops to lite
  if (M.live) {
    setQuality(1)
    const out = paint(M, Infinity)
    if (bytes(out) <= LIVE_CAP) return out
    setQuality(2)
    return paint(M, Infinity)
  }
  setQuality(0)
  const full = paint(M, Infinity), s0 = bytes(full)
  if (s0 <= BUDGET) return full
  for (let t = 1; t < 3; t++) {
    if (s0 * SAVE[t] > BUDGET) continue
    setQuality(t)
    try {
      const out = paint(M, BUDGET)
      if (bytes(out) <= BUDGET) return out
    } catch (e) { if (e !== OVER) throw e }
  }
  setQuality(3)
  return paint(M, Infinity)
}
const OVER = new Error('over budget')
// Motion parts (forge/MOTION.md, Parts choreography): every node is tagged with what it is.
// The cast shadow is wm-shadow; each piece (its groove, wall, face and recess) carries its
// skeleton plate (wm-k enamel, wm-a gold, wm-s ruby), but only when the icon has more than
// one plate (a lone K object stays untagged, which motion treats as wm-k); the specular
// sickle and glaze of the K enamel are wm-shine. Classes never count toward the size budget,
// so the paint (and its quality tier) is exactly what it was without them.
const PLATE = { K: 'wm-k', A: 'wm-a', S: 'wm-s' }
let LIVE = false
function paint(M, budget) {
  LIVE = !!M.live
  let used = 0
  const out = []
  let cls = null, shineCls = null, isText = false
  const add = (Fd, role, op = 1, q = BODY, shine = false) => {
    if (!Fd) return
    const d = ringsD(F.contour(Fd).filter(l => l.length > 2 && Math.abs(area(l)) >= q[1]).map(smooth), q[0], q[2])
    if (!d) return
    // contours keep a consistent winding (holes run the other way), so the default
    // nonzero fill rule is exact and the attribute can be left out
    const a = { d, fill: col(role) }
    if (op < 1) a['fill-opacity'] = String(Math.round(op * 1000) / 1000).replace(/^0./, '.')
    const c = shine && shineCls ? shineCls : cls
    if (c) a.class = c
    const node = ['path', a]
    out.push(node)
    if (isText) { TEXTN.add(node); return }
    used += d.length + 60
    if (used > budget) throw OVER
  }

  // cast shadow: two soft steps
  if (!M.T.noShadow) {
    const [dx, dy] = K.DIR
    cls = 'wm-shadow'
    isText = !!M.live
    add(F.offset(mv(M.sil, dx * (K.DEPTH + 0.6), dy * (K.DEPTH + 0.6)), -0.1), 'shadow', 0.2, SOFT)
  }

  const parts = []
  if (!empty(M.Ab)) parts.push([M.Ab, MAT.gold, M.recAb, false, { plate: 'A', body: true }])
  if (!empty(M.K0)) parts.push([M.K0, MAT.enamel, M.rec, false, { floor: M.T.recFloor, plate: 'K', matte: M.T.matte }])
  if (!empty(M.Af)) parts.push([M.Af, MAT.gold, M.recAf, false, { plate: 'A' }])
  // lettering: a shallow gold inlay seated in a dark groove (live text and hands: A lines)
  if (M.Tx && !empty(M.Tx)) parts.push([M.Tx, MAT.gold, null, false, { depth: 0.42, groove: 0.24, plate: 'A', text: true }])
  if (M.Tf && !empty(M.Tf)) parts.push([M.Tf, MAT.gold, null, false, { depth: 0.3, groove: 0.28, grooveOp: 1, small: true, plate: 'A', text: true }])
  if (M.hasS && !empty(M.S)) parts.push([M.S, MAT.gold, null, true, { plate: 'S' }])
  if (M.P) parts.push([M.P, MAT.gold, null, 'pearl', { plate: 'S' }])
  // (a Live count on a ruby jewel is champagne gold: the ruby is dark, the numerals must read by light at 24px)
  if (M.Sg && !empty(M.Sg)) parts.push([M.Sg, M.live ? MAT.champagne : MAT.gold, null, false, { depth: 0.3, groove: 0.2, small: true, plate: 'S', text: M.live }])
  const multi = parts.some(p => p[4].plate !== 'K')
  for (const [Fd, mat, rec, jewel, o = {}] of parts) {
    cls = multi ? PLATE[o.plate] : null
    isText = !!o.text || (M.live && o.plate !== 'K' && !o.body)
    shineCls = o.plate === 'K' ? 'wm-shine' : null
    if (o.groove) add(F.offset(F.copy(Fd), -o.groove), 'ink', o.grooveOp ?? 0.72, FINE)
    wall(Fd, mat, add, o.depth)
    if (jewel) {
      // a gold bezel with a ruby cabochon set into it
      face(Fd, mat, add, { bezel: true })
      const J = erode(Fd, K.BEZEL)
      if (!empty(J)) face(exact(J), jewel === 'pearl' ? MAT.pearl : MAT.jewel, add, { small: true })
    } else face(Fd, mat, add, { small: o.small, matte: o.matte, lite: M.live && o.text })
    if (rec && !empty(rec)) recess(rec, mat, add, o.floor)
  }
  return out
}

function wall(Fd, mat, add, depth = K.DEPTH) {
  const [dx, dy] = K.DIR
  const n = Math.max(1, Math.round(depth / F.H))
  const W = F.copy(Fd)
  let li = 0, lj = 0
  for (let k = 1; k <= n; k++) {
    const di = Math.round(k * F.H * dx / F.H), dj = Math.round(k * F.H * dy / F.H)
    if (di === li && dj === lj) continue
    F.union(W, F.shift(Fd, di, dj, 1)); li = di; lj = dj
  }
  add(W, mat.wall, 1, BODY)
}

function face(Fd, mat, add, o = {}) {
  add(Fd, mat.base, 1, BODY)
  const D = 0.7071
  // shade on edges facing away from the light
  add(minus(Fd, mv(Fd, -0.62 * D, -0.62 * D)), mat.dark, mat.darkOp, SOFT)
  if (!o.bezel) {
    // a broad fall-off away from each piece's hot spot: the body turns from the light
    // (not on lettering, o.lite: a stroke a pixel wide stays bright end to end, so it reads on the enamel)
    const hs = hotspot(Fd)
    if (TIER < 3 && !o.lite) add(F.intersect(hs.r(0.6), F.copy(Fd)), mat.dark, mat.darkOp * 0.5, SOFT)
    // tonal ramp: inset contours nudged toward the light...
    const inner = erode(Fd, 0.18)
    // (dense tier: the sheen alone carries an enamel piece's light, one step a gold one's)
    const steps = o.small ? [[0.25, 0.14]] : TIER > 2 && mat.discs.length ? [] : TIER ? mat.steps.slice(0, 1) : mat.steps
    for (const [e, s] of steps) {
      const L = F.intersect(mv(erode(Fd, e), -s * D, -s * D), inner)
      if (empty(L)) break
      add(L, mat.light, mat.lightOp, SOFT)
    }
    // ...and a curved sheen pooling round the hot spot
    for (const k of o.small ? [0.3] : TIER ? mat.discs.slice(0, 1) : mat.discs) {
      const L = F.intersect(hs.d(k), inner)
      if (empty(L)) break
      add(L, mat.light, mat.lightOp, SOFT)
    }
  }
  // lit chamfer on edges facing the light; cool rim light on the far edges
  add(minus(Fd, mv(Fd, 0.28 * D, 0.28 * D)), mat.chamfer, mat.chamferOp, FINE)
  // (a Live icon's rim light is a touch broader and full strength: its silhouette moves with the value and must
  // read on a dark page too)
  if (mat.rimOp > 0 && TIER < 2) add(minus(erode(Fd, 0.06), mv(Fd, -(LIVE ? 0.34 : 0.24) * D, -(LIVE ? 0.34 : 0.24) * D)), mat.rim, LIVE ? 1 : mat.rimOp, FINE)
  // specular: a crisp sickle just inside the lit edge, upper-left part of each piece
  if (!o.bezel && !o.matte) {
    // a broad glaze: the soft window reflection across the top of each piece
    if (mat.glaze && TIER < 2) {
      const G = erode(Fd, 0.32)
      if (!empty(G)) {
        const gl = F.intersect(minus(G, mv(G, 0.35, 1.25)), zone(Fd, 0.62))
        add(gl, mat.spec, mat.glaze, SOFT, true)
      }
    }
    const E = erode(Fd, o.small ? 0.28 : 0.42)
    if (!empty(E)) {
      const sk = minus(E, mv(E, 0.42 * D, 0.42 * D))
      F.intersect(sk, zone(Fd, 0.55))
      add(sk, mat.spec, 0.92, FINE, true)
    }
  }
}

// a recess: dark well, its floor lit below the shadowed upper-left lip
function recess(R, mat, add, floorRole) {
  const D = 0.7071
  add(R, 'ink', 1, BODY)
  const floor = F.intersect(mv(R, 0.4 * D, 0.4 * D), R)
  add(floor, floorRole || mat.wall, 1, FINE)
}

// per connected piece: a light hot spot up-left of its centre.
//   d(k): disc of radius k * size around it (negative inside)
//   r(k): everything further than k * size from it
const COMPS = new WeakMap()
const compsOf = Fd => { let c = COMPS.get(Fd); if (!c) { c = F.components(Fd, true); COMPS.set(Fd, c) } return c }
function hotspot(Fd) {
  const comps = compsOf(Fd).map(c => {
    const w = Math.max(0.5, c.x1 - c.x0), h = Math.max(0.5, c.y1 - c.y0)
    return { cells: c.cells, cx: c.x0 + 0.3 * w, cy: c.y0 + 0.28 * h, s: Math.hypot(w, h) }
  })
  // distance to the hot spot, in units of the piece size
  const R = F.field(9)
  for (const c of comps) for (const q of c.cells) {
    const i = q % F.N, j = (q - i) / F.N
    R[q] = Math.hypot(i * F.H - c.cx, j * F.H - c.cy) / c.s
  }
  const make = (k, sign) => {
    const Z = F.field(9)
    for (const c of comps) for (const q of c.cells) Z[q] = sign * (R[q] - k) * c.s
    return Z
  }
  return { d: k => make(k, 1), r: k => make(k, -1) }
}

// signed field: negative in the upper-left part of each connected piece of Fd
function zone(Fd, k) {
  const Z = F.field(9)
  for (const c of compsOf(Fd)) {
    const w = Math.max(0.5, c.x1 - c.x0), h = Math.max(0.5, c.y1 - c.y0)
    for (const q of c.cells) {
      const i = q % F.N, j = (q - i) / F.N
      // distance-like: positive beyond the diagonal cut at fraction k of the piece
      Z[q] = (((i * F.H - c.x0) + (j * F.H - c.y0)) - k * (w + h)) * 0.7071
    }
  }
  return Z
}

// ---------------------------------------------------------------------------
// output: compact relative path data (absolute M, relative l/h/v, minimal numbers)
const num = (v, dp) => {
  let s = (v / 10 ** dp).toFixed(dp)
  if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '')
  if (s === '-0') s = '0'
  return s.replace(/^(-?)0\./, '$1.')
}
const join = arr => arr.reduce((acc, s) => acc + (acc && !s.startsWith('-') && !/[a-z]$/i.test(acc) ? ' ' : '') + s, '')
export function loopsD(loops, dp = 2) {
  const k = 10 ** dp
  let d = ''
  for (const ring of loops) {
    const P = ring.map(p => [Math.round(p[0] * k), Math.round(p[1] * k)])
    const Q = P.filter((p, i) => i === 0 || p[0] !== P[i - 1][0] || p[1] !== P[i - 1][1])
    if (Q.length > 1 && Q[0][0] === Q.at(-1)[0] && Q[0][1] === Q.at(-1)[1]) Q.pop()
    if (Q.length < 3) continue
    let s = 'M' + join([num(Q[0][0], dp), num(Q[0][1], dp)])
    let last = 'M'
    for (let i = 1; i < Q.length; i++) {
      const dx = Q[i][0] - Q[i - 1][0], dy = Q[i][1] - Q[i - 1][1]
      let cmd, nums
      if (dy === 0) { cmd = 'h'; nums = [num(dx, dp)] }
      else if (dx === 0) { cmd = 'v'; nums = [num(dy, dp)] }
      else { cmd = 'l'; nums = [num(dx, dp), num(dy, dp)] }
      if (cmd === last) s += (nums[0].startsWith('-') ? '' : ' ') + join(nums)
      else s += cmd + join(nums)
      last = cmd
    }
    d += s + 'z'
  }
  return d
}
