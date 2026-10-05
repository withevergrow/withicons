// RETRO core — the geometry behind forge/styles/retro.mjs.
//
// Everything is modelled on signed distance fields (_retro-field.mjs) so offsets,
// round joins, moats and the hard shadow are exact and robust on any skeleton:
//   INK     every centreline stroked chunky and round (currentColor)
//   FILL    the object's mass minus its cutouts
//   STRIPES the visible fill cut into 1-4 horizontal sunset bands, the gaps
//           between them widening toward the bottom like a 70s sunset. Gaps keep
//           clear of flat inner details (a mouth, text lines) and close where
//           they would graze one, so those details stay crisp at 16-24px
//   BADGE   S-plate badges: a solid disc of the horizon colour, cleared by a moat;
//           a toothed badge (a gear) keeps its teeth and its hub hole, and an
//           empty round one (a magnifier lens) gets a sunlit mustard centre
//   SHADOW  the whole silhouette pushed down-right, minus itself: a hard print shadow
//   ECHO    line-only glyphs get a palette-coloured offset copy of the line instead
import { parsePath, simplify, area, pointInRing, distToPolyline } from '../kernel/geom.mjs'
import * as F from './_retro-field.mjs'
import { tune } from './_retro-tune.mjs'
import { textInfo, textStroke } from './_live-text.mjs'

export const K = {
  W: 2.35,          // ink weight
  TEXT_W: 1.75,     // live-icon text weight, large caps (the line weight: counters stay open at 24px)
  TEXT_W_S: 1.75,   // ...small caps (a touch heavier: they are thinner on screen)
  TEXT_HALO: 0.5,   // clean paper kept around free text (no shadow / echo against the glyphs)
  SHIFT: -0.45,     // the drawing moves up-left so drawing + shadow sit centred
  OFF: 12,          // shadow offset in field samples (12 x 0.08 = 0.96u down-right)
  ECHO: 12,         // line-only echo offset (samples)
  GAP_S: 0.85,      // moat around S-plate overlays
  BADGE_RIM: 0,
  BADGE_GLYPH: 0.8,   // ink weight of a glyph on a badge disc
  LENS_RING: 1.0,     // teal ring width inside an empty round badge
  BADGE_TOOTH: 0.45,  // a toothed badge (a gear) grows by this much of the ink weight
  TUCK: 0.35,       // colour runs this far under the ink (no anti-alias seams)
  CUT_LINE: 1.5,    // open cutouts knock out a line this wide
  MIN_FILL: 7,      // visible fill area (u^2) below which an icon counts as line-only
  BAND_MIN: 2.0,    // thinnest stripe
  GAPS: [0.5, 0.62, 0.74], // stripe gaps, top to bottom
  WEIGHTS: [1.18, 1.0, 0.9, 0.82], // stripe heights, top to bottom
  HOLE: 10,         // enclosed holes smaller than this (u^2) take no shadow
  SLIVER: 1.7,      // a band may not leave a piece of an object thinner than this...
  PIECE: 3.0,       // ...or smaller than this (u^2)
  CUT_NEAR: 2.6,    // a cutout that hugs the ink is Solid's business: Retro keeps the colour
  TOL: 0.035,       // ink simplification
  TOL_C: 0.05,      // colour simplification
  EDGE_COST: 0.35,  // stripe-gap penalty per u^2 of flat inner detail (RUN+ long) it runs behind
  RUN: 4.0,         // horizontal ink runs this long count as a flat detail
  BRIDGE: 0.45,     // a gap closes where an inner detail edge is this close above or below
  FEWER: 1.2,       // one band fewer when that saves more than this...
  FEWER_OK: 0.3,    // ...and leaves every gap clear (costs less than this)
}

// stripe colours per band count (indices into the palette 1..4, top to bottom)
const ORDER = { 1: [2], 2: [1, 3], 3: [1, 2, 3], 4: [1, 2, 3, 4] }

const snap = y => Math.round(y * 10) / 10
const polyArea = r => Math.abs(area(r))
const fracInside = (pts, ring) => pts.length ? pts.filter(p => pointInRing(p, ring)).length / pts.length : 0
// area over convex-hull area: 1 for a disc, lower for a gear or a star
function solidity(pts) {
  const P = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const lo = [], hi = []
  for (const p of P) { while (lo.length > 1 && cr(lo.at(-2), lo.at(-1), p) <= 0) lo.pop(); lo.push(p) }
  for (const p of P.reverse()) { while (hi.length > 1 && cr(hi.at(-2), hi.at(-1), p) <= 0) hi.pop(); hi.push(p) }
  const hull = lo.slice(0, -1).concat(hi.slice(0, -1))
  const ha = polyArea(hull)
  return ha > 0 ? polyArea(pts) / ha : 1
}
const mv = pts => pts.map(p => [p[0] + K.SHIFT, p[1] + K.SHIFT])

// zero-length subpaths ("M12 16 L12 16") stroke as a round dot; the parser drops them
function dots(icon) {
  const out = []
  for (const p of icon.paths || []) {
    for (const chunk of String(p.d || '').split(/(?=[Mm])/)) {
      const m = chunk.match(/^M\s*(-?[\d.]+(?:e[-+]?\d+)?)[\s,]*(-?[\d.]+(?:e[-+]?\d+)?)/)
      if (!m || !/[LlHhVvCcSsQqTtAaZz]/.test(chunk)) continue // a bare moveto draws nothing
      let subs
      try { subs = parsePath(chunk) } catch { subs = [] }
      if (!subs.length) out.push({ pts: [[+m[1], +m[2]]], closed: false, plate: p.plate || 'K' })
    }
  }
  return out
}

// -------------------------------------------------------------------------------
export function build(icon) {
  const T = tune(icon.name)
  const W = T.w || K.W
  const lines = [...(icon.lines || []), ...dots(icon)]
    .filter(l => l.pts && l.pts.length)
    .map(l => ({ ...l, pts: mv(l.pts) }))
  // Live-icon text (forge/DYNAMIC.md) is lettered, not inflated: glyphs keep the stroke font's own weight (their
  // counters stay open at 24px), take no print shadow or echo, and on a badge they are cream on the teal disc
  const caps = new Map()
  for (const p of icon.paths || []) { const t = textInfo(p); if (t) caps.set(p.id, t.cap) }
  const isTxt = l => caps.has(l.pathId)
  const tlines = lines.filter(isTxt)
  const base = lines.filter(l => l.plate !== 'S' && !isTxt(l))
  const sig = lines.filter(l => l.plate === 'S' && !isTxt(l))
  const textW = l => caps.get(l.pathId) >= 6 ? K.TEXT_W : K.TEXT_W_S
  const strokeText = (ls, Fd, grow = 0) => {
    const by = new Map()
    for (const l of ls) { const w = textW(l) + grow; by.set(w, [...(by.get(w) || []), l]) }
    for (const [w, g] of by) F.strokes(g, w, 1.2, Fd)
    return Fd
  }

  // --- S plate: outermost closed rings are badges; everything else is a glyph
  const closedS = sig.filter(l => l.closed && l.pts.length > 2)
  const badges = closedS.filter(l => !closedS.some(o => o !== l && polyArea(o.pts) > polyArea(l.pts) && fracInside(l.pts, o.pts) > 0.9))
  const inBadge = g => badges.some(b => b !== g && fracInside(g.pts, b.pts) > 0.5)
  const freeS = sig.filter(l => !badges.includes(l) && !inBadge(l))
  const tBadge = badges.length ? tlines.filter(l => inBadge(l)) : []
  const tFree = tlines.filter(l => !tBadge.includes(l))
  const tFreeS = tFree.filter(l => l.plate === 'S')

  // --- fills: those that trace a badge belong to it
  const fills = (icon.fills || []).filter(f => f.set && f.set.length).map(f => f.set.map(mv))
  const onBadge = rings => {
    const pts = rings.flat()
    return badges.some(b => pts.filter(p => distToPolyline(p, b.pts, true) < 0.6).length / pts.length > 0.6)
  }
  const baseFills = fills.filter(r => !onBadge(r))

  // --- INK (base plates). On a live label face the details drawn on it (a calendar's day marks, a key's symbol)
  // are lettered like its text, in the fixed dark brown: currentColor turns light in dark themes and would vanish
  // into the mustard
  let letterBase = []
  if (icon.params && T.label && baseFills.length) {
    const pre = F.field(1.2)
    for (const rings of baseFills) F.region(rings, 1.2, pre)
    const at = p => { const i = Math.round(p[0] / F.H), j = Math.round(p[1] / F.H); return i < 0 || j < 0 || i >= F.N || j >= F.N ? 1 : pre[j * F.N + i] }
    letterBase = base.filter(l => l.pts.filter(p => at(p) < -0.6).length > 0.8 * l.pts.length)
  }
  const ink = F.strokes(letterBase.length ? base.filter(l => !letterBase.includes(l)) : base, W, 1.2)
  // --- FILL
  const fill = F.field(1.2)
  for (const rings of baseFills) F.region(rings, 1.2, fill)
  const cutArea = [], cutLine = [], cutBadge = []
  for (const c of icon.cutouts || []) for (const s of c.subs || []) {
    if (!s.pts || !s.pts.length) continue
    const pts = mv(s.pts)
    // a closed cutout inside a badge (a gear's hub) is knocked out of the badge disc
    if (s.closed && pts.length > 2 && badges.some(b => fracInside(pts, b.pts) > 0.9)) { cutBadge.push(pts); continue }
    // Solid carves its detail out of the mass; in an outline style the ink already
    // draws that detail, so only cutouts that stand clear of the ink stay holes
    const nearInk = pts.filter(p => base.some(l => distToPolyline(p, l.pts, l.closed) < K.CUT_NEAR) || tlines.some(l => distToPolyline(p, l.pts, l.closed) < K.CUT_NEAR)).length / pts.length
    if (nearInk > (s.closed ? 0.8 : 0.5)) continue
    if (s.closed && s.pts.length > 2) cutArea.push(pts); else cutLine.push({ pts, closed: false })
  }
  if (cutArea.length) F.subtract(fill, F.region(cutArea, 1.2))
  if (cutLine.length) F.subtract(fill, F.strokes(cutLine, K.CUT_LINE, 1.2))

  // --- S overlays: clear a moat through everything below, then lay them on top
  let badgeFill = null, lens = null, sMoat = null
  if (badges.length || freeS.length || tFreeS.length) {
    const moat = F.field(1.2)
    for (const b of badges) { F.region([b.pts], 1.2, moat); F.strokes([b], W + 2 * K.GAP_S, 1.2, moat) }
    if (freeS.length) F.strokes(freeS, W + 2 * K.GAP_S, 1.2, moat)
    if (tFreeS.length) strokeText(tFreeS, moat, 2 * K.GAP_S)
    F.subtract(ink, moat)
    F.subtract(fill, moat)
    sMoat = moat
    if (badges.length) {
      // a badge is a teal disc out to the ring's outer edge, rimmed with a lighter ink ring
      const disc = F.field(2)
      // a round badge reaches the ring's outer edge; a toothed one (a gear) grows less, so its teeth stay open
      for (const b of badges) { F.region([b.pts], 2, disc); F.strokes([b], solidity(b.pts) < 0.93 ? W * K.BADGE_TOOTH : W, 2, disc) }
      if (cutBadge.length) F.subtract(disc, F.region(cutBadge, 1.2))
      // an empty round badge (a magnifier's lens) is a teal ring around a sunlit centre
      // (a live icon's badge holds a value, even when it is empty for a moment: it stays a teal disc)
      const empty = icon.params ? [] : badges.filter(b => solidity(b.pts) >= 0.93 && ![...sig, ...tlines].some(g => g !== b && fracInside(g.pts, b.pts) > 0.5))
      if (empty.length) lens = F.offset(F.region(empty.map(b => b.pts), 2), K.LENS_RING)
      const rim = F.intersect(F.copy(disc), F.offset(F.copy(disc), K.BADGE_RIM).map(v => -v))
      if (K.BADGE_RIM > 0) F.union(ink, rim)
      badgeFill = disc
    }
  }
  const glyphs = sig.filter(l => !badges.includes(l))
  if (glyphs.length) F.strokes(glyphs, badges.length ? W * K.BADGE_GLYPH : W, 1.2, ink)

  // --- silhouette and visible colour
  const sil = F.copy(ink)
  F.union(sil, fill)
  if (badgeFill) F.union(sil, badgeFill)
  const under = F.offset(F.copy(ink), K.TUCK)        // ink, eroded: colour tucks beneath it
  const vis = F.subtract(F.copy(fill), ink)          // what the eye actually sees of the fill
  const ext = F.extent(vis, 0.6)
  const lineOnly = T.echo === true || (T.echo !== false && !badgeFill && ext.area < K.MIN_FILL)

  // moat: the S overlays' cleared region (negative inside); retro.mjs uses it to tag S ink as its own node
  const out = { ink, stripes: [], badge: null, lens: null, shadow: null, echo: null, moat: sMoat, btext: null, ftext: null }
  // free text that sits on the face (most of each glyph inside the fill)
  const atF = p => { const i = Math.round(p[0] / F.H), j = Math.round(p[1] / F.H); return i < 0 || j < 0 || i >= F.N || j >= F.N ? 1 : fill[j * F.N + i] }
  const tFill = tFree.filter(l => l.pts.filter(p => atF(p) < 0).length > 0.6 * l.pts.length)

  if (!lineOnly) {
    const col = F.subtract(F.copy(fill), under)
    // inner details: the strokes that sit inside the mass (a mouth, text lines, a dash)
    const at = (Fd, p) => Fd[Math.round(p[1] / F.H) * F.N + Math.round(p[0] / F.H)]
    const inner = [...base, ...glyphs, ...tFree].filter(l => {
      const pts = l.pts.filter(p => p[0] > 0 && p[1] > 0 && p[0] < 24 && p[1] < 24)
      return pts.length && pts.filter(p => at(fill, p) < -0.4).length / l.pts.length > 0.6
    })
    const detail = inner.length ? F.strokes(inner, inner === glyphs ? W * K.BADGE_GLYPH : W, 1.2) : null
    // a face that carries text is a plain mustard label (stripes behind letters grey them out at 24px, and their gaps
    // would shift with every value; a live icon that letters its face keeps it plain at every value, T.label): the letters go on it in a fixed dark brown that reads in light and dark themes
    out.stripes = (tFill.length || (icon.params && T.label)) ? [{ c: 1, f: col }] : bands(col, ext, T, F.components(vis).filter(c => c.area > 0.8), detail && inkRuns(detail))
  }
  if (badgeFill) out.badge = F.subtract(badgeFill, under)
  if (lens) out.lens = lens

  if (lineOnly && !T.noEcho) {
    // the doubled retro line: the ink again, offset, in a palette colour
    const e = F.shift(ink, K.ECHO, K.ECHO, 1.2)
    out.echo = F.subtract(e, under)
    if (ext.area > 0.5) F.subtract(out.echo, fill) // tiny fills (dots) stay clean
  } else {
    // small enclosed holes (a door, a glint, a keyhole) stay clean: the shadow falls on the ground
    const solidSil = F.fillHoles(F.copy(sil), K.HOLE)
    const s = F.shift(solidSil, K.OFF, K.OFF, 1.2)
    out.shadow = F.subtract(s, F.offset(solidSil, 0.25))
  }
  // text goes on last, with a clean halo through the shadow / echo around it
  const tOut = tFree.filter(l => !tFill.includes(l))
  if (tFill.length) out.ftext = strokeText(tFill, F.field(1.2))
  if (letterBase.length) out.ftext = F.strokes(letterBase, W, 1.2, out.ftext || F.field(1.2))
  if (tOut.length) {
    const tink = strokeText(tOut, F.field(1.2))
    const halo = F.offset(F.copy(tink), -K.TEXT_HALO)
    if (out.shadow) F.subtract(out.shadow, halo)
    if (out.echo) F.subtract(out.echo, halo)
    F.union(out.ink, tink)
  }
  if (tBadge.length) out.btext = strokeText(tBadge, F.field(1.2))
  return out
}

// per sample row: total length (u) of the long horizontal runs of inner-detail ink
// (a mouth, a text line, a dash). Short runs (dots, eyes, vertical or diagonal
// strokes) do not count: a gap may pass behind those freely.
// Also returns those runs as a mask field.
function inkRuns(D) {
  const E = new Float32Array(F.N), N = F.N, MIN = Math.round(K.RUN / F.H), M = F.field(1)
  for (let j = 0; j < N; j++) {
    let run = 0
    for (let i = 0; i <= N; i++) {
      if (i < N && D[j * N + i] < 0) run++
      else {
        if (run >= MIN) { E[j] += run * F.H; M.fill(-1, j * N + i - run, j * N + i) }
        run = 0
      }
    }
  }
  return { rows: E, mask: M }
}

// cut the visible colour into horizontal sunset bands.
// Gap positions are chosen together (dynamic programming over 0.16u steps): bands
// keep close to their sunset proportions, no gap may shave a thin sliver off a
// separate part (a head, a lid, a wheel), and no gap may run along the edge of an
// inner detail (a mouth, a text line, a dash): at 16-24px a gap next to an ink edge
// greys it out. A gap moves into a clear stretch instead, or the icon takes one
// band fewer when no clear stretch exists.
function bands(col, ext, T, comps = [], flat = null) {
  const edges = flat && flat.rows
  const one = () => [{ c: (T.order || ORDER[1])[0], f: col }]
  if (!isFinite(ext.y0) || ext.y1 - ext.y0 < 0.4) return one()
  const top = ext.y0 - 0.05, bot = ext.y1 + 0.05, h = bot - top
  let n = T.bands || (h >= 12 ? 4 : h >= 8.5 ? 3 : h >= 4.6 ? 2 : 1)
  while (n > 1) {
    const g = K.GAPS.slice(0, n - 1).reduce((a, b) => a + b, 0)
    const ws = K.WEIGHTS.slice(0, n), sw = ws.reduce((a, b) => a + b, 0)
    if ((h - g) * Math.min(...ws) / sw >= K.BAND_MIN) break
    n--
  }
  if (n === 1) return one()

  // the biggest parts, with cumulative area per row
  const C = comps.slice().sort((p, q) => q.area - p.area).slice(0, 16).map(c => {
    const cum = new Float32Array(F.N + 1)
    for (let j = 0; j < F.N; j++) cum[j + 1] = cum[j] + c.rows[j]
    return { ...c, cum, w: Math.sqrt(c.area) }
  })
  // cumulative flat-detail ink per row
  const ecum = new Float32Array(F.N + 1)
  if (edges) for (let j = 0; j < F.N; j++) ecum[j + 1] = ecum[j] + edges[j]
  const rowAt = y => Math.max(0, Math.min(F.N, Math.round(y / F.H)))
  const STEP = 0.16, P = []
  for (let y = top + 1.2; y <= bot - 1.2; y += STEP) P.push(y)
  if (!P.length) return one()

  const solve = n => {
    const gaps = K.GAPS.slice(0, n - 1), ws = K.WEIGHTS.slice(0, n)
    const avail = h - gaps.reduce((a, b) => a + b, 0), sw = ws.reduce((a, b) => a + b, 0)
    const nom = ws.map(w => avail * w / sw)
    const bandCost = (i, y0, y1) => {
      let cost = 2.2 * ((y1 - y0 - nom[i]) / nom[i]) ** 2
      const j0 = rowAt(y0), j1 = rowAt(y1)
      for (const c of C) {
        if (y1 <= c.y0 || y0 >= c.y1) continue
        const pa = c.cum[j1] - c.cum[j0]
        if (pa < 0.05 || pa > c.area - 0.05) continue // whole, or untouched
        const ph = Math.min(y1, c.y1) - Math.max(y0, c.y0)
        if (ph < K.SLIVER) cost += c.w * (1 + K.SLIVER - ph)
        if (pa < K.PIECE) cost += c.w * (1 + (K.PIECE - pa) / K.PIECE)
      }
      return cost
    }
    // a gap [y, y + g] behind a flat inner detail (one that only grazes it is bridged below)
    const gapCost = (y, g) => K.EDGE_COST * (ecum[rowAt(y + g)] - ecum[rowAt(y)])
    // dp[i][p]: best cost with gap i starting at P[p]
    let prev = P.map(y => ({ c: bandCost(0, top, y) + gapCost(y, gaps[0]), from: -1 }))
    const hist = [prev]
    for (let i = 1; i < n - 1; i++) {
      const cur = P.map(y => {
        let best = { c: Infinity, from: -1 }
        for (let q = 0; q < P.length; q++) {
          if (!isFinite(prev[q].c)) continue
          const s0 = P[q] + gaps[i - 1]
          if (y - s0 < 1.2) continue
          const c = prev[q].c + bandCost(i, s0, y)
          if (c < best.c) best = { c, from: q }
        }
        if (isFinite(best.c)) best.c += gapCost(y, gaps[i])
        return best
      })
      hist.push(cur); prev = cur
    }
    let bp = -1, bc = Infinity
    P.forEach((y, p) => {
      if (!isFinite(prev[p].c)) return
      const s0 = y + gaps[n - 2]
      if (bot - s0 < 1.2) return
      const c = prev[p].c + bandCost(n - 1, s0, bot)
      if (c < bc) { bc = c; bp = p }
    })
    if (bp < 0) return null
    const tops = []
    for (let i = n - 2, p = bp; i >= 0; i--) { tops.unshift(P[p]); p = hist[i][p].from }
    return { n, cost: bc, tops, gaps }
  }

  let best = solve(n)
  // too many gaps for the clear stretches: one band fewer (never below two)
  if (!T.bands && n > 2 && (!best || best.cost > K.FEWER)) {
    const alt = solve(n - 1)
    if (alt && alt.cost < K.FEWER_OK && (!best || alt.cost + K.FEWER < best.cost)) best = alt
  }
  if (!best) return one()
  const order = T.order || ORDER[best.n]
  // band edges sit on the 0.1u output grid, so they stay dead level after rounding
  const ys = []
  for (let i = 0; i < best.n; i++) ys.push([i === 0 ? -1 : snap(best.tops[i - 1] + best.gaps[i - 1]), i === best.n - 1 ? 25 : snap(best.tops[i])])
  // a gap stops short of a flat inner detail it would still run along: there the two bands
  // meet head on (split at the gap's middle), so no light line greys out the ink edge
  const bridge = flat ? F.vdilate(flat.mask, K.BRIDGE) : null
  return ys.map(([y0, y1], i) => {
    const f = F.clipBand(F.copy(col), y0, y1)
    if (bridge) {
      if (i > 0) F.union(f, F.clipBand(F.intersect(F.copy(col), bridge), (ys[i - 1][1] + y0) / 2, y0 + 0.02))
      if (i < best.n - 1) F.union(f, F.clipBand(F.intersect(F.copy(col), bridge), y1 - 0.02, (y1 + ys[i + 1][0]) / 2))
    }
    return { c: order[i], f }
  })
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

export const trace = (Fd, tol, minArea) => F.trace(Fd, tol, minArea)
