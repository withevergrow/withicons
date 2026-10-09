// CHROME core: the geometry and paint behind forge/styles/chrome.mjs.
//
// Liquid metal / Y2K chrome. Every icon becomes a polished, inflated chrome object:
//
//   MODEL   the line drawing is stroked fat (an inflated tube) and fused with its fills on a
//           signed distance field (_chrome-field.mjs); convex corners are rounded, cutouts and
//           inner detail lines are cut clean through. A parts become separate pieces in a second
//           metal (gunmetal), cleared from the body by a parting gap; S parts (badges, slashes,
//           modifiers) become enamel jewels in a chrome bezel, cleared from everything by a moat.
//   PAINT   back to front, per piece:
//           SHADOW  the whole silhouette cast softly down
//           EDGE    the full piece in a dark steel edge (role shadow)
//           BEVEL   the piece inset a little, in a light bevel ramp (the lighter inner rim, role edge)
//           CORE    the piece inset more, in the chrome reflection ramp: bright sky at the top, a
//                   sharp dark horizon band just above the middle, a warm ground reflection below,
//                   a bright bounce light at the bottom edge
//           SHEEN   a crisp white sickle along the upper-left edges of the core
//           GLINT   one four-point specular star on the main piece
//
// The ramps are linear gradients (Rich styles, forge/CONTRACT.md): one defs node first, ids
// wg-chrome-<icon>-<n>, userSpaceOnUse, every stop a role variable --with-chrome-<role>.
import { parsePath, distToPolyline, pointInRing, area, simplify, resample } from '../kernel/geom.mjs'
import { setOf } from '../kernel/bool.mjs'
import * as F from './_chrome-field.mjs'
import { ringsD } from './_chrome-path.mjs'
import { tuneFor } from './_chrome-tune.mjs'
import { splitText, glyphLines, isGlyphSub, shiftD, glyphWeight } from './_live-text.mjs'

export const K = {
  SCALE: 0.88, TX: -0.2, TY: -0.55,  // drawing scale about the centre, moved up for the shadow
  WK: 2.55,             // inflated chrome tube (K strokes), output units
  WL: 2.9,              // chrome tube of a pure line drawing (no K fills)
  WA: 2.25,             // gunmetal tube (A strokes)
  WS: 2.15,             // S glyph width
  GAP: 0.42,            // parting gap around front A pieces
  MOAT: 0.55,           // moat around S jewels
  CUT: 1.15,            // grooves cut through (open cutouts, inner lines)
  ROUND: 0.32,          // convex corner rounding (inflation)
  EDGE: 0.2,            // dark outer edge width
  BEVEL: 0.5,           // where the core starts (edge + light bevel)
  M: 0.7, REACH: 1.6,
}

// palette role -> default (silver chrome, gunmetal A, hot-pink enamel S)
const P = {
  ink: '#10131B', c1: '#8794AA', c2: '#5E6A82', c3: '#3E4556', c4: '#CDB9A4',
  tint: '#DCE5F2', accent: '#FF3E9E', shadow: '#1A1E2A', shine: '#FFFFFF', edge: '#F4F7FC',
}
export const PALETTE = P
export const col = r => `var(--with-chrome-${r}, ${P[r]})`

// ---------------------------------------------------------------------------
const polyArea = r => Math.abs(area(r))
const fracInside = (pts, ring) => pts.length ? pts.filter(p => pointInRing(p, ring)).length / pts.length : 0
const at = (Fd, p) => {
  const i = Math.round(p[0] / F.H), j = Math.round(p[1] / F.H)
  if (i < 0 || j < 0 || i >= F.N || j >= F.N) return 1
  return Fd[j * F.N + i]
}
const minus = (A, B) => F.subtract(F.copy(A), B)
const exact = Fd => F.any(Fd) ? F.redistance(Fd, F.contour(F.copy(Fd)).map(l => simplify(l, 0.006, true)), K.REACH) : Fd
const inset = (Fd, e) => F.offset(F.copy(Fd), e)
const empty = Fd => !Fd || !F.any(Fd)
const mv = (Fd, dx, dy) => F.shift(Fd, Math.round(dx / F.H), Math.round(dy / F.H), 1)

// scale and offset of the drawing: smaller and lifted, leaving room for the shadow. A Live icon keeps closer
// to its skeleton (its parts are dense, and its values must sit where the generator put them)
const place = (icon, T) => icon.params
  ? [0.93 * (T.scale || 1), -0.1 + (T.dx || 0), -0.35 + (T.dy || 0)]
  : [K.SCALE * (T.scale || 1), K.TX + (T.dx || 0), K.TY + (T.dy || 0)]

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

// a per-icon redraw (or extra parts) from _chrome-tune.mjs, prepared like a skeleton
function prep(icon, T) {
  if (!T.redraw && !T.extra) return icon
  const R = T.redraw || {}
  const paths = [...(R.paths || icon.paths || []).map(p => ({ id: p.id, d: p.d, plate: p.plate || 'K' })),
    ...(T.extra || []).map((p, i) => ({ id: 'x' + i, d: p.d, plate: p.plate || 'S' }))]
    .map((p, i) => ({ ...p, id: p.id || 'p' + i, subs: parsePath(p.d) }))
  const fills = R.fills ? R.fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }) : icon.fills
  const cutouts = R.cutouts ? R.cutouts.map(d => ({ d, subs: parsePath(d) })) : icon.cutouts
  return { ...icon, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}

// ---------------------------------------------------------------------------
// MODEL
export function model(icon0, opts = {}) {
  const T = tuneFor(icon0.name, icon0.params)
  const icon = prep(icon0, T)
  const [s, ox, oy] = place(icon0, T)
  const tf = p => [(p[0] - 12) * s + 12 + ox, (p[1] - 12) * s + 12 + oy]
  const all = [...(icon.lines || []), ...dots(icon)].filter(l => l.pts && l.pts.length)
    .map(l => ({ ...l, pts: l.pts.map(tf) }))
  const plateOf = l => (T.plate && T.plate[l.pathId]) || (T.remap && T.remap[l.plate]) || l.plate || 'K'
  const isTxt = l => String(l.pathId || '').startsWith('text:')
  const Kl = all.filter(l => plateOf(l) === 'K')
  let Al = all.filter(l => plateOf(l) === 'A')
  const Sl = all.filter(l => plateOf(l) === 'S')

  // fills: each belongs to the plate whose lines run closest to its edge
  const fills = { K: [], A: [], S: [] }
  for (const f of T.noFills ? [] : icon.fills || []) {
    const rings = (f.set && f.set.length ? f.set : (f.subs || []).map(x => x.pts)).filter(r => r && r.length > 2).map(r => r.map(tf))
    if (!rings.length) continue
    const votes = { K: 0, A: 0, S: 0 }
    for (const r of rings) for (let i = 0; i < r.length; i += 3) {
      let best = Infinity, pl = 'K'
      for (const l of all) { if (isTxt(l)) continue; const d = distToPolyline(r[i], l.pts, l.closed); if (d < best) { best = d; pl = plateOf(l) } }
      votes[pl]++
    }
    const pl = T.fillPlate || (votes.S > votes.K + votes.A ? 'S' : votes.A > votes.K ? 'A' : 'K')
    fills[pl].push(rings)
  }

  // cutouts: areas and grooves, cut clean through
  const cutArea = [], cutLine = []
  if (!T.noCutouts) for (const c of [...(icon.cutouts || []), ...(T.addCutouts || []).map(d => ({ d, subs: parsePath(d) }))]) {
    for (const x of c.subs || []) {
      if (!x.pts || !x.pts.length) continue
      const pts = x.pts.map(tf)
      if (x.closed && pts.length > 2) cutArea.push(pts); else cutLine.push({ pts, closed: false })
    }
  }

  const mass = F.field(1.6)
  for (const r of fills.K) F.region(r, 1.6, mass)
  const dense = l => { const r = resample(l.pts, 0.25, l.closed).map(o => o.p); return r.length ? r : l.pts }
  const inMass = l => { const Pp = dense(l); return Pp.filter(p => at(mass, p) < -0.45).length / Pp.length }

  // K lines lying inside the mass are inner detail: grooves, not fused away
  // (a line is detail only well inside the mass: a bar's own centreline is the bar)
  const deep = l => { const Pp = dense(l); return Pp.filter(p => at(mass, p) < -1.25).length / Pp.length }
  // (but a line running beside a cutout is a body stroke the cutouts carve out, like a wifi arc)
  const byCut = l => { const Pp = dense(l); return cutArea.length && Pp.filter(p => cutArea.some(r => distToPolyline(p, r, true) < 1.8)).length > 0.5 * Pp.length }
  const inner = T.noEngrave || !fills.K.length ? [] : Kl.filter(l => !l.closed && inMass(l) > 0.7 && deep(l) > 0.6 && !byCut(l))
  const KlBody = Kl.filter(l => !inner.includes(l))
  // an A line along an open cutout is a slot: the groove draws it
  const along = (l, c) => c.pts.every(p => distToPolyline(p, l.pts, l.closed) < 0.4) || l.pts.every(p => distToPolyline(p, c.pts) < 0.4)
  // (Live: every such line is a value, a hand or a range bar: it stays a solid gunmetal inlay set in its groove)
  const live = !!icon0.params
  if (live) {
    const drop = new Set()
    for (const l of Al) for (const c of cutLine) if (along(l, c)) drop.add(c)
    for (let i = cutLine.length - 1; i >= 0; i--) if (drop.has(cutLine[i])) cutLine.splice(i, 1)
  } else Al = Al.filter(l => !cutLine.some(c => along(l, c)) || isTxt(l))

  // A pieces inside the mass sit in front (cleared by a gap); the rest sit behind the body
  const front = [], back = []
  for (const l of Al) ((T.aFront === true || (T.aFront !== false && inMass(l) > 0.5)) ? front : back).push(l)

  // S: outermost closed rings are badges (filled jewels); the rest are glyphs
  const closedS = Sl.filter(l => l.closed && l.pts.length > 2)
  const badges = closedS.filter(l => !closedS.some(o => o !== l && polyArea(o.pts) > polyArea(l.pts) && fracInside(l.pts, o.pts) > 0.9))
  const inBadge = Sl.filter(l => !badges.includes(l) && badges.some(b => fracInside(dense(l), b.pts) > 0.8))

  // a pure line drawing (an arrow, a check) is inflated further: it has no mass of its own
  const wk = T.wk || (fills.K.length ? K.WK : K.WL), wa = T.wa || K.WA, ws = T.ws || K.WS
  const fK = F.strokes(KlBody.filter(l => !isTxt(l)), wk, K.M)
  const txtK = KlBody.filter(isTxt)
  if (txtK.length) F.strokes(txtK, 1.5, K.M, fK)
  F.union(fK, mass)
  const fAf = F.strokes(front, live ? Math.min(wa, 1.75) : wa, K.M)
  // Live: a closed part on the face knocked out by its own cutout (a marked day, a range end) is a solid stud
  if (live) for (const l of [...front, ...Kl.filter(l => l.closed && polyArea(l.pts) < 6 && inMass(l) > 0.9)]) {
    if (!l.closed || l.pts.length < 3) continue
    const k = cutArea.findIndex(r => r.length > 2 && r.every(p => distToPolyline(p, l.pts, true) < 0.35))
    if (k >= 0) { F.region([cutArea[k]], K.M, fAf); cutArea.splice(k, 1) }
  }
  const fAb = F.strokes(back.filter(l => !isTxt(l)), wa, K.M)
  const txtA = back.filter(isTxt)
  if (txtA.length) F.strokes(txtA, 1.45, K.M, fAb)
  for (const r of fills.A) {
    const pts = r.flat()
    const nf = front.length ? pts.filter(p => front.some(l => distToPolyline(p, l.pts, l.closed) < 0.6)).length : 0
    const nb = back.length ? pts.filter(p => back.some(l => distToPolyline(p, l.pts, l.closed) < 0.6)).length : 0
    F.region(r, K.M, nf >= nb && front.length ? fAf : fAb)
  }
  const MS = K.MOAT + 0.6
  const fS = F.strokes(Sl.filter(l => !badges.includes(l) && !inBadge.includes(l)), ws, MS)
  for (const b of badges) { F.region([b.pts], MS, fS); F.strokes([b], ws, MS, fS) }
  for (const r of fills.S) F.region(r, MS, fS)
  // glyphs inside a badge are cut into the jewel
  const recS = inBadge.length ? F.strokes(inBadge, 1.15, K.M) : null

  // grooves and holes
  const rec = F.field(K.M)
  if (cutArea.length) F.region(cutArea, K.M, rec)
  if (cutLine.length) F.strokes(cutLine, T.cut || K.CUT, K.M, rec)
  if (inner.length) F.strokes(inner, T.cut || K.CUT, K.M, rec)

  const hasS = F.any(fS)
  const moatS = hasS ? inset(fS, -K.MOAT) : null
  let K0 = minus(fK, rec)
  // the parting gap round a front A piece is a dark seam in the body, not a hole through it
  let seam = null
  if (F.any(fAf)) { const g = inset(fAf, -(live ? 0.3 : K.GAP)); K0 = minus(K0, g); seam = minus(F.intersect(F.copy(g), fK), rec); if (moatS) seam = minus(seam, moatS) }
  if (moatS) K0 = minus(K0, moatS)
  let Af = minus(fAf, rec), Ab = fAb
  if (moatS) { Af = minus(Af, moatS); Ab = minus(Ab, moatS) }
  let S0 = hasS ? exact(fS) : null
  if (S0 && recS) S0 = exact(minus(S0, recS))
  // inflation: convex corners rounded, specks gone
  const round = Fd => empty(Fd) ? Fd : F.open(Fd, T.round ?? K.ROUND)
  const sil = F.copy(fK); F.union(sil, fAf); F.union(sil, fAb); if (hasS) F.union(sil, fS)
  F.subtract(sil, minus(rec, inset(fAf, 0)))
  // printed text keeps a clear field: the horizon and the dark ground stay out from under it
  const txt = opts.glyphs && opts.glyphs.length ? F.strokes(opts.glyphs.map(l => ({ ...l, pts: l.pts.map(tf) })), 3.2, K.M) : null
  return { T, K: round(K0), Af: round(Af), Ab: round(Ab), S: S0, sil, txt, seam }
}

// ---------------------------------------------------------------------------
// PAINT
function smooth(r) {
  const n = r.length
  if (n < 5) return r
  return r.map((p, i) => { const a = r[(i - 1 + n) % n], b = r[(i + 1) % n]; return [(a[0] + 2 * p[0] + b[0]) / 4, (a[1] + 2 * p[1] + b[1]) / 4] })
}

// ink bounds of a field: [x0, y0, x1, y1]
function bounds(Fd) {
  let x0 = 99, y0 = 99, x1 = -99, y1 = -99
  for (let j = 0; j < F.N; j++) for (let i = 0; i < F.N; i++) if (Fd[j * F.N + i] < 0) {
    const x = i * F.H, y = j * F.H
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y
  }
  return x1 < x0 ? null : [x0, y0, x1, y1]
}
const r2 = v => Math.round(v * 100) / 100
const stop = (o, role, op) => ['stop', op == null ? { offset: o, 'stop-color': col(role) } : { offset: o, 'stop-color': col(role), 'stop-opacity': op }]
// a vertical ramp over a box, tilted a little (the horizon leans down to the right)
function ramp(id, b, stops, tilt = 0.12) {
  const [x0, y0, x1, y1] = b, cx = r2((x0 + x1) / 2), h = Math.max(0.6, y1 - y0)
  return ['linearGradient', { id, x1: tilt ? r2(cx - tilt * h) : 0, y1: r2(y0), x2: tilt ? r2(cx + tilt * h) : 0, y2: r2(y0 + h), gradientUnits: 'userSpaceOnUse' }, stops]
}
const RAMPS = {
  // blob layers: sky ramp, ground ramp (laid under a curved horizon)
  sky: [stop(0, 'shine'), stop(0.24, 'tint'), stop(0.5, 'c1'), stop(1, 'c4')],
  ground: [stop(0.56, 'c3'), stop(0.84, 'c4'), stop(1, 'shine')],
  metalSky: [stop(0, 'tint'), stop(0.5, 'c2'), stop(1, 'c1')],
  metalGround: [stop(0.56, 'c3'), stop(0.86, 'c2'), stop(1, 'tint')],
  // the bevel: a lighter, softer copy of the same world
  bevel: [stop(0, 'edge'), stop(0.42, 'tint'), stop(0.56, 'c1'), stop(0.78, 'c4'), stop(1, 'edge')],
  // free lettering
  letter: [stop(0, 'shine'), stop(0.45, 'tint'), stop(0.5, 'c3'), stop(0.62, 'c1'), stop(1, 'shine')],
  // enamel jewel (S): a glossy top over the colour
  enamel: [stop(0, 'shine'), stop(0.38, 'accent'), stop(1, 'accent')],
}

const PLATE = { K: 'wm-k', A: 'wm-a', S: 'wm-s' }
// LAYERS of the paint, back to front: { loops, fill (a colour, or [ramp, box] for a gradient), cls, op, q }
// The fields are built once; each size tier only refits the traced loops.
export function layers(M) {
  const out = []
  const add = (Fd, fill, cls, op, q = 'body') => {
    if (empty(Fd)) return
    const loops = F.contour(F.copy(Fd)).filter(l => l.length > 2 && Math.abs(area(l)) >= 0.04).map(smooth)
    if (loops.length) out.push({ loops, fill, cls, op, q })
  }
  // shadow, only outside the silhouette: a hole stays a clean hole
  const sb = M.sil, solidSil = solidOf(sb)
  add(minus(inset(mv(sb, 0.2, 0.75), -0.05), solidSil), col('shadow'), 'wm-shadow', 0.2, 'soft')

  const parts = []
  if (!empty(M.Ab)) parts.push(['A', M.Ab, 'metal'])
  if (!empty(M.K)) parts.push(['K', M.K, 'chrome'])
  if (!empty(M.Af)) parts.push(['A', M.Af, 'metal'])
  if (!empty(M.S)) parts.push(['S', M.S, 'enamel'])
  const multi = new Set(parts.map(p => p[0])).size > 1
  const clear = Fd => M.txt ? minus(Fd, M.txt) : Fd
  // the bevel ramp spans the whole object so every piece shares one
  const all = bounds(M.sil) || [3, 3, 21, 21]
  const main = parts.find(p => p[0] === 'K') || parts[0]
  for (const [pl, Fd, kind] of parts) {
    const cls = multi ? PLATE[pl] : null
    if (pl === 'A' && Fd === M.Af && M.seam) add(M.seam, col('shadow'), 'wm-k')
    add(Fd, col('shadow'), cls)
    add(inset(Fd, K.EDGE), ['bevel', all], cls)
    if (kind === 'enamel') {
      // a chrome bezel round the jewel, the enamel inside
      const J = inset(Fd, K.BEVEL + 0.05), bj = bounds(J)
      if (bj) add(J, ['enamel', bj], cls)
      continue
    }
    const C = core(Fd)
    if (empty(C)) continue
    // the reflection. A blob (a body, a disc) gets a smooth sky ramp over its own span, then a ground ramp
    // and a sharp horizon laid at fractions of each column's height blended with the blob's box, so the
    // horizon curves with the surface. A thin tube (an arc, a bent wire) carries its whole world along
    // itself, column by column, in flat bands.
    const P = pieces(C), L = LAYERS[kind]
    for (const g of P.blobs) {
      add(g.F, [L.sky, g.b], cls)
      add(clear(band(g.F, g.runs, 0.5, 1)), [L.ground, g.b], cls)
      add(clear(band(g.F, g.runs, 0.47, 0.565)), col('ink'), cls)
    }
    if (P.tube) {
      add(P.tube.F, col(L.tube), cls)
      for (const [lo, hi, role, op] of L.bands) add(clear(band(P.tube.F, P.tube.runs, lo, hi)), col(role), cls, op)
    }
    // sheen: a white sickle along the upper-left edges of the core
    add(minus(C, mv(C, 0.3, 0.42)), col('shine'), 'wm-shine', 0.85, pl === main[0] ? 'sheen' : 'sheen2')
  }
  // glint: one four-point star on the main piece, near its upper-left
  let glint = null
  if (main && !M.T.noGlint) {
    const g = glintAt(inset(main[1], 0.9)) || glintAt(inset(main[1], 0.6))
    if (g) {
      const [x, y] = g, r = M.T.glint || 1.7, w = 0.3
      const f = v => r2(v)
      const d = `M${f(x)} ${f(y - r)}Q${f(x + w)} ${f(y - w)} ${f(x + r)} ${f(y)}Q${f(x + w)} ${f(y + w)} ${f(x)} ${f(y + r)}Q${f(x - w)} ${f(y + w)} ${f(x - r)} ${f(y)}Q${f(x - w)} ${f(y - w)} ${f(x)} ${f(y - r)}Z`
      glint = ['path', { d, fill: col('shine'), class: 'wm-shine' }]
    }
  }
  return { list: out, glint }
}
// trace quality per tier and layer kind: [fit tolerance, min ring area, decimals]; null drops the layer
const QUALITY = [
  { body: [0.04, 0.04, 2], soft: [0.08, 0.1, 1], sheen: [0.04, 0.04, 2], sheen2: [0.04, 0.04, 2] },
  { body: [0.055, 0.08, 2], soft: [0.1, 0.15, 1], sheen: [0.055, 0.2, 2], sheen2: [0.055, 0.25, 2] },
  { body: [0.07, 0.12, 2], soft: [0.12, 0.2, 1], sheen: [0.07, 0.3, 2], sheen2: null },
]
export function emit(Ls, name, tier = 0) {
  const defs = [], out = [], ids = new Map()
  const Qt = QUALITY[tier]
  for (const L of Ls.list) {
    const q = Qt[L.q]
    if (!q) continue
    const d = ringsD(L.loops.filter(l => Math.abs(area(l)) >= q[1]), q[0], q[2])
    if (!d) continue
    let fill = L.fill
    if (Array.isArray(fill)) {
      // one gradient per (ramp, box): pieces that share a box share it
      const key = fill[0] + fill[1].map(r2).join(',')
      if (!ids.has(key)) { const id = `wg-chrome-${name}-${ids.size}`; ids.set(key, id); defs.push(ramp(id, fill[1], RAMPS[fill[0]], 0)) }
      fill = `url(#${ids.get(key)})`
    }
    const a = { d, fill }
    if (L.op != null && L.op < 1) a['fill-opacity'] = L.op
    if (L.cls) a.class = L.cls
    out.push(['path', a])
  }
  if (Ls.glint) out.push(Ls.glint)
  return defs.length ? [['defs', {}, defs], ...out] : out
}
export const paint = (M, name, tier = 0) => emit(layers(M), name, tier)
// per kind: the blob ramps, and the tube colour and bands [lo, hi, role, opacity]
const LAYERS = {
  chrome: { sky: 'sky', ground: 'ground', tube: 'tint', bands: [[0, 0.2, 'shine', 0.9], [0.47, 1, 'c4'], [0.47, 0.62, 'ink'], [0.86, 1, 'shine', 0.75]] },
  metal: { sky: 'metalSky', ground: 'metalGround', tube: 'c2', bands: [[0, 0.22, 'tint', 0.8], [0.47, 1, 'c2'], [0.47, 0.62, 'ink'], [0.86, 1, 'tint', 0.7]] },
}
const BLEND = 0.55
// split a piece (holes filled, so a lens hole never bends the horizon) into thin tubes and blob groups
// (blobs whose vertical spans mostly overlap share one group and one pair of ramps)
function pieces(Fd) {
  const N = F.N, NN = N * N, H = F.H, Fh = solidOf(Fd)
  const cs = F.components(Fh, true).filter(c => c.area > 0.01).sort((a, b) => b.area - a.area)
  const own = new Int32Array(NN).fill(-1), groups = []
  let tube = null
  cs.forEach(c => {
    // a speck never gets ramps of its own: it joins the largest blob
    if (c.area < 0.6 && groups.length) { const g = groups[0]; g.cs.push(c); return }
    const colc = new Map()
    for (const q of c.cells) { const i = q % N; colc.set(i, (colc.get(i) || 0) + 1) }
    let run = 0
    for (const v of colc.values()) if (v > run) run = v
    run *= H
    const y0 = c.y0, y1 = c.y1 + H, h = y1 - y0
    if (run < 2.4 && run < 0.6 * h) { tube = tube || { cs: [], w: 1 }; tube.cs.push(c); c.g = tube; return }
    let g = groups.find(o => Math.min(o.y1, y1) - Math.max(o.y0, y0) > 0.7 * Math.min(o.y1 - o.y0, h))
    if (!g) { g = { cs: [], y0, y1, x0: c.x0, x1: c.x1 + H, w: BLEND }; groups.push(g) }
    g.cs.push(c); g.y0 = Math.min(g.y0, y0); g.y1 = Math.max(g.y1, y1); g.x0 = Math.min(g.x0, c.x0); g.x1 = Math.max(g.x1, c.x1 + H)
    c.g = g
  })
  const all = [...groups, ...(tube ? [tube] : [])]
  all.forEach((g, gi) => { for (const c of g.cs) for (const q of c.cells) own[q] = gi })
  for (const [gi, g] of all.entries()) {
    const G = F.copy(Fd)
    if (all.length > 1) for (let q = 0; q < NN; q++) if (own[q] >= 0 && own[q] !== gi) G[q] = 1
    g.F = G; g.b = [g.x0, g.y0, g.x1, g.y1]
    // column runs: top and bottom edge, and the span of the connected piece they belong to
    g.runs = []
    for (const c of g.cs) {
      const cy0 = c.y0, cy1 = c.y1 + H
      const byCol = new Map()
      for (const q of c.cells) { const i = q % N, j = (q - i) / N; const r = byCol.get(i); if (!r) byCol.set(i, [j, j]); else { if (j < r[0]) r[0] = j; if (j > r[1]) r[1] = j } }
      for (const [i, [a, b]] of byCol) {
        const va = a > 0 ? Fh[(a - 1) * N + i] : H, vb = b < N - 1 ? Fh[(b + 1) * N + i] : H
        const top = (a - 1) * H + H * va / (va - Fh[a * N + i])
        const bot = b * H + H * Fh[b * N + i] / (Fh[b * N + i] - vb)
        g.runs.push({ i, a, b, top, bot, c: { y0: g.w === 1 ? cy0 : g.y0, y1: g.w === 1 ? cy1 : g.y1, w: g.w } })
      }
    }
  }
  return { blobs: groups, tube }
}
// the part of a field between fractions lo..hi of its local height (0 top, 1 bottom)
function band(Fd, runs, lo, hi) {
  const N = F.N, H = F.H, G = F.field(1)
  for (let q = 0; q < G.length; q++) if (!(Fd[q] < 0)) G[q] = Fd[q] < 0.05 ? 0.05 : Fd[q]
  for (const { i, a, b, top, bot, c } of runs) {
    const L = bot - top, hb = c.y1 - c.y0, w = c.w
    const ylo = (top + lo * L) * w + (c.y0 + lo * hb) * (1 - w), yhi = (top + hi * L) * w + (c.y0 + hi * hb) * (1 - w)
    for (let k = a; k <= b; k++) {
      const y = k * H
      let v = Fd[k * N + i]
      if (lo > 0) v = Math.max(v, ylo - y)
      if (hi < 1) v = Math.max(v, y - yhi)
      G[k * N + i] = v
    }
  }
  return G
}
// the chrome core: the piece inset past its bevel; a slender piece the full inset would erase keeps a
// thinner bevel instead (a wifi arc between two cutouts must still be chrome, not just rim)
function core(Fd) {
  const C = inset(Fd, K.BEVEL), C2 = inset(Fd, 0.3)
  let lost = false
  const cs = F.components(C2, true)
  for (const c of cs) if (!c.cells.some(q => C[q] < 0)) { lost = true; c.lost = true }
  if (!lost) return C
  for (const c of cs) if (c.lost) for (const q of c.cells) C[q] = C2[q]
  // (and the ring of cells just outside it, so its contour interpolates on its own field)
  const N = F.N
  for (const c of cs) if (c.lost) for (const q of c.cells) for (const o of [q - 1, q + 1, q - N, q + N]) if (C2[o] >= 0) C[o] = C2[o]
  return C
}
// the field with every hole filled (cells not reachable from the border through paper become ink)
let STK = null
function solidOf(Fd) {
  const N = F.N, NN = N * N, out = F.copy(Fd), seen = new Uint8Array(NN)
  if (!STK) STK = new Int32Array(NN)
  let sp = 0
  const push = q => { if (!seen[q] && !(Fd[q] < 0)) { seen[q] = 1; STK[sp++] = q } }
  for (let i = 0; i < N; i++) { push(i); push((N - 1) * N + i); push(i * N); push(i * N + N - 1) }
  while (sp) {
    const q = STK[--sp], i = q % N
    if (i > 0) push(q - 1); if (i < N - 1) push(q + 1); if (q >= N) push(q - N); if (q < NN - N) push(q + N)
  }
  for (let q = 0; q < NN; q++) if (!seen[q] && !(out[q] < 0)) out[q] = -1
  return out
}
// the upper-left-most point inside a field
function glintAt(Fd) {
  let best = null, bv = Infinity
  for (let j = 0; j < F.N; j += 2) for (let i = 0; i < F.N; i += 2) if (Fd[j * F.N + i] < 0) {
    const x = i * F.H, y = j * F.H, v = x * 0.8 + y
    if (v < bv) { bv = v; best = [x, y] }
  }
  return best
}

// size budget (CONTRACT: target < 8 KB): a dense icon repaints in a lighter tier
const BUDGET = 8000
const sizeOf = nodes => nodes.reduce((a, n) => a + (n[0] === 'defs' ? n[2].reduce((b, g) => b + 110 + g[2].length * 58, 0) : n[1].d.length + 70), 0)
export function build(icon0) {
  const { icon, letters, glyphs } = liveSplit(icon0)
  const M = model(icon, { glyphs })
  const name = String(icon.name || 'icon').replace(/[^a-z0-9-]/gi, '-')
  const Ls = layers(M)
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && sizeOf(out) > BUDGET; t++) out = emit(Ls, name, t)
  if (!letters.length) return out
  const L = lettering(letters, M.T, name, out[0] && out[0][0] === 'defs' ? out[0][2].length : 0, icon)
  if (L.grad) { if (out[0] && out[0][0] === 'defs') out[0] = ['defs', {}, [...out[0][2], L.grad]]; else out.unshift(['defs', {}, [L.grad]]) }
  return [...out, ...L.nodes]
}

// Live icons (forge/DYNAMIC.md): text set inside a frame is not cut as grooves (a fat chrome groove closes
// every counter); the body stays whole and the value is printed on it: ink letters with a light halo, so they
// read across the bright sky and the dark horizon alike. Text on an enamel jewel is printed in white.
// Free text (no frame under it: a weather reading) stays in the model as fine chrome tubes.
function liveSplit(icon) {
  if (!icon.params) return { icon, letters: [] }
  const { inside, free } = splitText(icon)
  if (!inside.length && !free.length) return { icon, letters: [] }
  for (const g of free) g.free = true
  const ids = new Set([...inside, ...free].map(g => g.id))
  const gl = glyphLines(icon).filter(l => ids.has(l.pathId))
  const cutouts = (icon.cutouts || []).map(c => ({ ...c, subs: (c.subs || []).filter(x => !isGlyphSub(x, gl)) }))
  const insideIds = new Set(inside.filter(g => g.plate !== 'S').map(g => g.id))
  return {
    icon: { ...icon, paths: icon.paths.filter(p => !ids.has(p.id)), lines: (icon.lines || []).filter(l => !ids.has(l.pathId)), cutouts },
    letters: [...inside, ...free], glyphs: gl.filter(l => insideIds.has(l.pathId)),
  }
}
function lettering(letters, T, name, n, icon) {
  const [s, dx, dy] = place(icon, T)
  const halo = [], ink = []
  const base = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  // free text is chrome lettering: a dark outline under a stroke in one chrome ramp over the whole reading
  const fr = letters.filter(g => g.free)
  let grad = null, url = null
  if (fr.length) {
    const y0 = Math.min(...fr.map(g => g.box.y0)), y1 = Math.max(...fr.map(g => g.box.y1))
    const id = `wg-chrome-${name}-${n}`
    grad = ramp(id, [0, (y0 - 12) * s + 12 + dy - 0.6, 0, (y1 - 12) * s + 12 + dy + 0.6], RAMPS.letter, 0)
    url = `url(#${id})`
  }
  for (const g of letters) {
    const d = shiftD(g.d, dx, dy, s), w = r2(glyphWeight(g) * s * 0.8), cls = PLATE[g.plate] || 'wm-k'
    if (g.free) {
      const wf = r2(glyphWeight(g) * s * 1.05)
      halo.push(['path', { d, ...base, stroke: col('shadow'), 'stroke-width': r2(wf + 0.7), class: cls }])
      ink.push(['path', { d, ...base, stroke: url, 'stroke-width': wf, class: cls }])
      continue
    }
    if (g.plate === 'S') { ink.push(['path', { d, ...base, stroke: col('shine'), 'stroke-width': w, class: cls }]); continue }
    halo.push(['path', { d, ...base, stroke: col('edge'), 'stroke-width': r2(w + 0.8), class: cls }])
    ink.push(['path', { d, ...base, stroke: col('ink'), 'stroke-width': w, class: cls }])
  }
  return { grad, nodes: [...halo, ...ink] }
}
