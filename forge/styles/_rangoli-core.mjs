// RANGOLI core: the geometry behind forge/styles/rangoli.mjs.
//
// A brand-grade Indian festival icon: one clean, confident object plus ONE festival motif chosen for it.
//
//   MOTIF-BACK  a rangoli petal ring behind round bodies, or a lotus base behind vessels           wm-deco
//   LIP         a thin deep lip under the body (a touch of depth, never a cast shadow)            wm-shadow
//   BACK        A parts outside the body (handles, shackles, a second object) in the second
//               gradient (c3 -> c4), parted from the body                                          wm-a
//   BODY        the K mass (fills + K strokes) in the festive glow gradient (c1 -> c2, a radial
//               light from the upper left, like diya light); inner detail is knocked out crisp   wm-k
//   PANES       big closed cutouts (screens, pages, windows) as light tint panes, detail in ink    wm-k
//   FRONT       A parts straddling the body (a clapper, a lid) in the second gradient              wm-a
//   SHINE       one soft highlight crescent on the body's upper left                               wm-shine
//   BADGE       S plates as accent discs / bars with light glyphs, moated                          wm-s
//   MOTIF-FRONT the corner marigold / flame / sparkles / Holi speckle, or the inlaid toran or
//               paisley                                                                            wm-deco
// Motif choice: _rangoli-tune.mjs. Motif geometry: _rangoli-motifs.mjs. Palettes: _rangoli-palettes.mjs.
// Every colour is var(--with-rangoli-<role>, #hex). One defs node first, ids wg-rangoli-<icon>-<n>.
import { parsePath, distToPolyline, pointInRing, area, resample, simplify } from '../kernel/geom.mjs'
import * as F from './_rangoli-field.mjs'
import { ringsD } from './_rangoli-path.mjs'
import { DEFAULT } from './_rangoli-palettes.mjs'
import { tuneFor } from './_rangoli-tune.mjs'
import * as M from './_rangoli-motifs.mjs'
import { isPerson, partFields, personTones } from './_rangoli-people.mjs'
import { fillParts } from './_people.mjs'

export const PALETTE = DEFAULT
export const col = r => `var(--with-rangoli-${r}, ${PALETTE[r]})`

const C = {
  WK: 2.0, WL: 2.3, WA: 2.0, WD: 1.3, WS: 2.0, WG: 1.4, WT: 1.15,
  PART: 0.6,    // gap between the body and A parts in front of it
  MOAT: 0.7,    // clearance around badges and corner motifs
  LIP: 0.5,     // depth lip
  M: 1.4, TOL: 0.025, FIT: 0.045,
}

const at = (Fd, p) => {
  const i = Math.round(p[0] / F.H), j = Math.round(p[1] / F.H)
  if (i < 0 || j < 0 || i >= F.N || j >= F.N) return 1
  return Fd[j * F.N + i]
}
const exact = (Fd, reach = C.M) => F.any(Fd) ? F.redistance(Fd, F.contour(F.copy(Fd)).map(l => simplify(l, 0.015, true)), reach) : F.field(reach)
const grow = (Fd, r) => F.offset(exact(Fd, r + 0.4), -r)
const shrink = (Fd, r) => F.offset(exact(Fd, r + 0.4), r)
const minus = (A, B) => F.subtract(F.copy(A), B)
const and = (A, B) => F.intersect(F.copy(A), B)
const or = (...L) => { const G = F.field(C.M); for (const x of L) if (x) F.union(G, x); return G }
const empty = Fd => !Fd || !F.any(Fd)
const polyArea = r => Math.abs(area(r))
const dense = l => { const r = l.pts.length > 1 ? resample(l.pts, 0.25, l.closed).map(o => o.p) : l.pts; return r.length ? r : l.pts }
const frac = (l, test) => { const P = dense(l); return P.length ? P.filter(test).length / P.length : 0 }
const f2 = n => Math.round(n * 100) / 100
const areaOf = Fd => F.extent(Fd, 99).area
function bboxOf(Fd) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (let j = 0; j < F.N; j++) for (let i = 0; i < F.N; i++) if (Fd[j * F.N + i] < 0) {
    const x = i * F.H, y = j * F.H
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y
  }
  return x0 === Infinity ? null : [x0, y0, x1, y1]
}
const discField = (x, y, r, into) => F.region([circ(x, y, r)], C.M, into || F.field(C.M))
const circ = (x, y, r, n = 40) => Array.from({ length: n }, (_, i) => [x + r * Math.cos(i * Math.PI * 2 / n), y + r * Math.sin(i * Math.PI * 2 / n)])

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

// the icon as plain geometry (so ring / lotus layouts can scale it)
function geomOf(icon) {
  return {
    lines: [...(icon.lines || []), ...dots(icon)].filter(l => l.pts && l.pts.length),
    fills: (icon.fills || []).map(f => (f.set && f.set.length ? f.set : (f.subs || []).map(s => s.pts)).filter(r => r && r.length > 2)).filter(r => r.length),
    cuts: (icon.cutouts || []).flatMap(c => (c.subs || []).filter(s => s.pts && s.pts.length).map(s => ({ pts: s.pts, closed: s.closed }))),
  }
}
function xform(G, s, ax, ay, bx, by) {
  const T = p => [bx + (p[0] - ax) * s, by + (p[1] - ay) * s]
  return {
    lines: G.lines.map(l => ({ ...l, pts: l.pts.map(T) })),
    fills: G.fills.map(f => f.map(r => r.map(T))),
    cuts: G.cuts.map(c => ({ ...c, pts: c.pts.map(T) })),
  }
}
function gbox(G) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  const eat = p => { if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0]; if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1] }
  for (const l of G.lines) l.pts.forEach(eat)
  for (const f of G.fills) f.forEach(r => r.forEach(eat))
  return x0 === Infinity ? [2, 2, 22, 22] : [x0, y0, x1, y1]
}

// ---------------------------------------------------------------------------
// planes: body, back, front, badge, panes, ink detail
function planes(G, isTxt) {
  F.setClip(null)
  const all = G.lines
  const Kl = all.filter(l => l.plate !== 'A' && l.plate !== 'S')
  const Al = all.filter(l => l.plate === 'A')
  const Sl = all.filter(l => l.plate === 'S')
  const hasFills = G.fills.length > 0

  const fills = { K: [], A: [], S: [] }
  for (const rings of G.fills) {
    const votes = { K: 0, A: 0, S: 0 }
    for (const r of rings) for (let i = 0; i < r.length; i += 3) {
      let best = Infinity, pl = 'K'
      for (const l of all) { if (isTxt(l)) continue; const d = distToPolyline(r[i], l.pts, l.closed); if (d < best) { best = d; pl = l.plate === 'A' || l.plate === 'S' ? l.plate : 'K' } }
      votes[pl]++
    }
    fills[votes.S > votes.K + votes.A ? 'S' : votes.A > votes.K ? 'A' : 'K'].push(rings)
  }
  const fillK = F.field(C.M)
  for (const r of fills.K) F.region(r, C.M, fillK)
  const knock = F.field(C.M), knockSet = new Set()
  for (const s of G.cuts) {
    if (!s.closed || s.pts.length < 3 || !hasFills) continue
    const dn = resample(s.pts, 0.3, true).map(o => o.p)
    const inside = dn.filter(p => at(fillK, p) < 1.0).length / (dn.length || 1)
    if (inside <= 0.85) { F.region([s.pts], C.M, knock); knockSet.add(s) }
  }
  const hasKnock = F.any(knock)
  if (hasKnock) F.subtract(fillK, knock)

  // a tiny closed loop paints as a dot; a big self-crossing loop (infinity: its lobes cancel to ~0 signed area) stays a line
  const span = l => { let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity; for (const [x, y] of l.pts) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y } return Math.max(x1 - x0, y1 - y0) }
  const dotLoop = l => l.closed && l.pts.length > 2 && polyArea(l.pts) < 6 && !(span(l) >= 6 && polyArea(l.pts) < 1.5)
  const inner = hasFills ? Kl.filter(l => l.pts.length > 1 && !dotLoop(l) && frac(l, p => at(fillK, p) < -1.1) > 0.6) : []
  const KlBody = Kl.filter(l => !inner.includes(l))
  let body = F.strokes(KlBody, hasFills ? C.WK : C.WL, C.M)
  for (const l of KlBody) if (dotLoop(l)) F.region([l.pts], C.M, body)
  F.union(body, fillK)
  if (hasKnock) F.subtract(body, knock)
  const bodyX = exact(body)

  const hidden = l => { const g = F.strokes([l], C.WA, 0.3); const a = areaOf(g); return a ? areaOf(and(g, bodyX)) / a : 0 }
  const Ain = [], Aback = [], Afront = []
  for (const l of Al) {
    if (!hasFills) { Aback.push(l); continue }
    const fin = frac(l, p => at(bodyX, p) < -0.35)
    const endsIn = l.closed || [l.pts[0], l.pts.at(-1)].every(p => at(bodyX, p) < 0.3)
    if (fin > 0.6 && endsIn) Ain.push(l)
    else if (fin > 0.22 || hidden(l) > 0.4) Afront.push(l)
    else Aback.push(l)
  }
  const back = F.strokes(Aback, hasFills ? C.WA : C.WL, C.M)
  for (const l of Aback) if (dotLoop(l)) F.region([l.pts], C.M, back)
  for (const r of fills.A) F.region(r, C.M, back)
  let front = F.strokes(Afront, C.WA, C.M)
  for (const l of Afront) if (dotLoop(l)) F.region([l.pts], C.M, front)

  // S: closed outer rings are discs, the rest bars; glyphs inside discs are light
  const closedS = Sl.filter(l => l.closed && l.pts.length > 2 && polyArea(l.pts) > 5)
  const discs = closedS.filter(l => !closedS.some(o => o !== l && polyArea(o.pts) > polyArea(l.pts) && l.pts.every(p => pointInRing(p, o.pts))))
  const disc = F.field(C.M)
  for (const d of discs) F.region([d.pts], C.M, disc)
  for (const r of fills.S) F.region(r, C.M, disc)
  const discX = empty(disc) ? null : exact(disc)
  const glyphL = Sl.filter(l => !discs.includes(l))
  const inDisc = discX ? glyphL.filter(l => frac(l, p => at(discX, p) < -0.3) > 0.7) : []
  const bars = glyphL.filter(l => !inDisc.includes(l))
  const sAll = or(disc, F.strokes(bars, C.WS, C.M))
  const glyph = F.strokes(inDisc.filter(l => !isTxt(l)), C.WG, C.M)
  F.strokes(inDisc.filter(isTxt), C.WT, C.M, glyph)
  if (discX) F.intersect(glyph, F.offset(F.copy(discX), 0.5))
  const hasS = !empty(sAll)

  // cutouts: big closed ones inside the body are panes, the rest knocked-out detail
  const panes = F.field(C.M), cutLines = [], cutAreas = []
  for (const s of G.cuts) {
    if (knockSet.has(s)) continue
    if (s.closed && s.pts.length > 2) {
      const a = polyArea(s.pts)
      const inside = s.pts.filter(p => at(bodyX, p) < 0.2).length / s.pts.length
      if (a >= 7 && inside > 0.85) F.region([s.pts], C.M, panes)
      else if (inside > 0.6) cutAreas.push(s.pts)
    } else cutLines.push({ pts: s.pts, closed: false })
  }
  const panesIn = and(panes, bodyX)
  // detail lines: inner K walls, A inside the body, open cutouts, small closed cutouts
  const detail = F.strokes([...inner, ...cutLines, ...Ain.filter(l => !isTxt(l))], C.WD, C.M)
  F.strokes(Ain.filter(isTxt), C.WT, C.M, detail)
  for (const l of Ain) if (l.closed && !isTxt(l) && polyArea(l.pts) < 5) F.region([l.pts], C.M, detail)
  for (const r of cutAreas) F.region([r], C.M, detail)
  // a detail line along a pane's border is drawn by the pane itself
  let onPane = null
  if (!empty(panesIn)) {
    const ring = minus(grow(panesIn, 0.9), shrink(panesIn, 0.9))
    F.subtract(detail, ring)
    onPane = and(detail, shrink(panesIn, 0.05))
    F.subtract(detail, panesIn)
  }
  return { body, back, front, sAll, glyph, hasS, panes: panesIn, detail, onPane, hasFills }
}

// ---------------------------------------------------------------------------
export function build(icon) {
  const isTxt = l => String(l.pathId || '').startsWith('text:')
  const name = String(icon.name || 'icon').replace(/[^a-z0-9-]/gi, '')
  let T = tuneFor(icon)
  let G = geomOf(icon)
  const live = !!icon.params
  if (live && T.motif !== 'none') T = { motif: 'none' }
  const box0 = gbox(G)
  const bw = box0[2] - box0[0], bh = box0[3] - box0[1]
  const nDetail = G.lines.length + G.cuts.length
  // shape facts
  const mainFill = G.fills.map(f => ({ f, a: f.reduce((s, r) => s + polyArea(r), 0) })).sort((a, b) => b.a - a.a)[0]
  const roundness = mainFill ? mainFill.a / (Math.PI * bw * bh / 4) : 0
  const perim = mainFill ? mainFill.f.reduce((s, r) => s + r.reduce((a, p, i) => a + Math.hypot(p[0] - r[(i + 1) % r.length][0], p[1] - r[(i + 1) % r.length][1]), 0), 0) : 0
  const isRound = bw >= 13 && Math.abs(bw - bh) < 1.6 && roundness > 0.86 && roundness < 1.08 && perim < Math.PI * (bw + bh) / 2 * 1.12 && nDetail <= 8
  let kind = T.motif
  if (kind === 'auto') kind = isRound ? 'ring' : (T.fallback || 'marigold')
  if (nDetail > 14 && (kind === 'ring' || kind === 'lotus')) kind = T.fallback || 'marigold'

  // layouts that make room for a motif behind
  let ringAt = null, lotusAt = null
  if (kind === 'ring') {
    const s = T.scale || (Math.max(bw, bh) > 17 ? 0.74 : Math.max(bw, bh) > 14 ? 0.82 : 0.95)
    const cx = (box0[0] + box0[2]) / 2, cy = (box0[1] + box0[3]) / 2
    G = xform(G, s, cx, cy, 12, 12)
    ringAt = { x: 12, y: 12, r: Math.max(bw, bh) * s / 2 }
  } else if (kind === 'lotus') {
    // the object sits in the lotus: scaled, its foot lifted to y 19.6, the lotus opening below it
    const s = T.scale || Math.min(0.84, 15.5 / Math.max(bh, 1), 15 / Math.max(bw, 1))
    const cx = (box0[0] + box0[2]) / 2
    G = xform(G, s, cx, box0[3], 12, 19.4)
    const b = gbox(G)
    lotusAt = { x: 12, y: 21.4, w: b[2] - b[0], top: b[1] }
  }

  const P = planes(G, isTxt)
  let { body, back, front, sAll, glyph, hasS, panes, detail, onPane, hasFills } = P

  // clearances: A in front parts from the body; badges get a moat
  if (!empty(front)) body = minus(body, grow(front, C.PART))
  const moat = hasS ? grow(sAll, C.MOAT) : null
  if (moat) { body = minus(body, moat); back = minus(back, moat); front = minus(front, moat); panes = minus(panes, moat) }
  // knock the detail out of the body (and out of A planes it crosses)
  if (!empty(detail)) { body = minus(body, detail); front = minus(front, detail) }

  // people avatars (_rangoli-people.mjs): the drawn planes split into skin / hair / headwear / clothing / gear pieces,
  // the face's knocked-out features (eyes, mouth, hairline) set in ink
  let person = null
  if (!live && isPerson(icon)) {
    try {
      const pf = partFields(icon, or(body, back, front), F)
      if (pf && pf.skin && !empty(pf.skin)) {
        const face = F.field(C.M)
        F.region(G.fills[0] || [], C.M, face)
        const eyes = F.field(C.M)
        for (const c of G.cuts) if (c.closed && c.pts.length > 2 && polyArea(c.pts) <= 3) F.region([c.pts], C.M, eyes)
        const feat = and(or(detail, eyes), face)
        person = { t: personTones(icon), pf, feat: empty(feat) ? null : feat }
        body = pf.skin
      }
    } catch { person = null }
  }

  // ---- corner / inlay motifs (decided on the drawn planes)
  const deco = []      // [d, roleOrFill, extra]
  const decoBack = []
  const occ = or(body, back, front, sAll)
  const bodyArea = areaOf(body) || 1
  const rnd = seedOf(name)
  let occX = null
  const pickFree = (r, prefer, maxR = r, avoid = null) => {
    // best spot with clearance to everything drawn, inside the 24 box
    const X = occX || (occX = exact(occ, 4.5))
    let best = null
    for (let y = 2 + r; y <= 22 - r + 1e-6; y += 0.5) for (let x = 2 + r; x <= 22 - r + 1e-6; x += 0.5) {
      let d = at(X, [x, y]); if (d < 0) continue
      if (avoid) d = Math.min(d, Math.hypot(x - avoid.x, y - avoid.y) - avoid.r)
      const edge = Math.min(x - 1.6, 22.4 - x, y - 1.6, 22.4 - y)
      const room = Math.min(d - C.MOAT, edge)
      const bias = prefer ? -0.05 * Math.hypot(x - prefer[0], y - prefer[1]) : 0
      const sc = Math.min(room, maxR) + bias
      if (!best || sc > best.sc) best = { x, y, room, sc }
    }
    return best && best.room >= r ? { x: best.x, y: best.y, r: Math.min(maxR, best.room) } : null
  }
  // a forced corner: cut a moat into the planes if that costs little
  const forceCorner = (x, y, r) => {
    if (T.moat === false) return null
    const cut = discField(x, y, r + C.MOAT)
    const lost = areaOf(and(body, cut))
    if (lost > bodyArea * 0.1) return null
    body = minus(body, cut); back = minus(back, cut); front = minus(front, cut); panes = minus(panes, cut)
    if (onPane) onPane = minus(onPane, cut)
    return { x, y, r }
  }
  const corner = (r, maxR, prefer) => {
    if (T.at) return forceCorner(T.at[0], T.at[1], T.r || r) || null
    return pickFree(r, prefer, maxR) || (hasS ? null : forceCorner(prefer[0] - 0.2, prefer[1] + 0.2, r))
  }

  let motifAt = null
  if (kind === 'marigold') {
    const p = corner(2.4, 3.1, [18.6, 5.4])
    if (p) {
      const [o, i, h] = M.marigold(p.x, p.y, p.r)
      deco.push([o, col('accent')], [i, 'url(#G2)'], [h, col('shadow')])
      motifAt = p
    }
  } else if (kind === 'sparkle') {
    const p = corner(2.0, 3.0, [18.5, 5.5])
    if (p) {
      deco.push([M.sparkle(p.x, p.y, p.r * 1.05), col('accent')])
      // a second, smaller twinkle where there is room
      const q = pickFree(1.0, [5.5, 18.5], 1.3, { x: p.x, y: p.y, r: p.r + 0.6 })
      if (q && Math.hypot(q.x - p.x, q.y - p.y) > 4) deco.push([M.sparkle(q.x, q.y, q.r), col('c3')])
      motifAt = p
    }
  } else if (kind === 'flame') {
    const p = corner(1.9, 2.6, [18.5, 5])
    if (p) {
      const h = p.r * 2.1
      const [o, i] = M.flame(p.x, p.y + h * 0.5, h)
      deco.push([o, 'url(#G2)'], [i, col('accent')])
      motifAt = p
    }
  } else if (kind === 'speckle') {
    const p = corner(1.7, 2.4, [18.5, 5.5])
    if (p) {
      // a gulal burst: one big dot and a spray of smaller ones fanning away from the body
      const roles = ['c3', 'accent', 'c4', 'c1', 'c3', 'c2']
      deco.push([M.disc(p.x, p.y, p.r * 0.62), col('c3')])
      const away = Math.atan2(p.y - 12, p.x - 12)
      const n = 5
      for (let k = 0; k < n; k++) {
        const a = away + (k - (n - 1) / 2) * 0.62 + (rnd() - 0.5) * 0.2
        const dist = p.r * (1.05 + 0.25 * (k % 2)) + 0.3
        const x = p.x + Math.cos(a) * dist, y = p.y + Math.sin(a) * dist
        if (x < 1.3 || x > 22.7 || y < 1.3 || y > 22.7) continue
        if (at(occ, [x, y]) < 0.45) continue
        deco.push([M.disc(x, y, 0.32 + 0.22 * ((k * 7) % 3) / 2), col(roles[(k + 1) % roles.length])])
      }
      motifAt = p
    }
  } else if (kind === 'toran') {
    const t = toranRow(body, detail, panes)
    if (t) {
      for (let k = 0; k < t.xs.length; k++) {
        const x = t.xs[k]
        if (k % 2 === 0) deco.push([M.leaf(x, t.y, t.L, t.w), 'url(#G2)'])
        else deco.push([M.disc(x, t.y + t.L * 0.3, t.w * 0.78), col('shine')])
      }
      motifAt = t
    } else kind = 'none'
  } else if (kind === 'paisley') {
    const d = deepest(body, detail, panes, 2.2)
    if (d) {
      const r = Math.min(2.0, d.depth * 0.55)
      const [o, eye] = M.paisley(d.x - r * 0.15, d.y + r * 0.6, r, 0.35)
      deco.push([o, 'url(#G2)'], [eye, col('shine')])
      motifAt = d
    }
  }
  if (ringAt) {
    const R = ringAt.r
    const rIn = Math.max(R - 0.6, 3), rOut = Math.min(11.2, R + 3.0)
    const n = R > 7.2 ? 12 : 10
    const [petals, bindus] = M.petalRing(12, 12, rIn, rOut, n)
    decoBack.push([petals, 'url(#G2)'], [bindus, col('accent')])
  }
  if (lotusAt) {
    const s = Math.min(1.12, Math.max(0.85, (lotusAt.w + 5) / 13))
    const [side, mid] = M.lotus(lotusAt.x, lotusAt.y, s)
    decoBack.push([side, col('c4')], [mid, 'url(#G2)'])
  }

  // ---- paint
  const defs = []
  const gid = n => `wg-rangoli-${name}-${n}`
  const used = new Map()
  const grad = (key, make) => { if (!used.has(key)) { const id = gid(used.size); used.set(key, id); defs.push(make(id)) } return `url(#${used.get(key)})` }
  const bb = bboxOf(body) || [3, 3, 21, 21]
  const G1 = () => grad('body', id => ['radialGradient', { id, cx: f2(bb[0] + (bb[2] - bb[0]) * 0.28), cy: f2(bb[1] + (bb[3] - bb[1]) * 0.22), r: f2(Math.max(4, Math.hypot(bb[2] - bb[0], bb[3] - bb[1]) * 0.9)), gradientUnits: 'userSpaceOnUse' }, [
    ['stop', { offset: 0, 'stop-color': col('c1') }], ['stop', { offset: 0.3, 'stop-color': col('c1') }], ['stop', { offset: 1, 'stop-color': col('c2') }]]])
  const G2 = () => grad('second', id => ['linearGradient', { id, x1: 4, y1: 3, x2: 20, y2: 21, gradientUnits: 'userSpaceOnUse' }, [
    ['stop', { offset: 0, 'stop-color': col('c3') }], ['stop', { offset: 1, 'stop-color': col('c4') }]]])
  // fire: flames and sparks take a gold (accent) -> c1 gradient instead of the second hue
  const G3 = () => grad('fire', id => ['linearGradient', { id, x1: 0, y1: 21, x2: 0, y2: 3, gradientUnits: 'userSpaceOnUse' }, [
    ['stop', { offset: 0, 'stop-color': col('accent') }], ['stop', { offset: 0.5, 'stop-color': col('accent') }], ['stop', { offset: 1, 'stop-color': col('c1') }]]])
  const AF = () => T.fire ? G3() : G2()
  const recs = []
  const put = (Fd, fill, cls, extra = {}) => { if (!empty(Fd)) recs.push({ Fd, a: { fill, ...extra, class: cls } }) }
  const raw = []
  const motifNode = (list, cls) => list.forEach(([d, f, extra]) => raw.push({ d, a: { fill: f === 'url(#G2)' ? G2() : f, ...(extra || {}), class: cls } }))

  // back motif first (drawn under everything)
  const backMotifs = []
  decoBack.forEach(([d, f]) => backMotifs.push({ d, a: { fill: f === 'url(#G2)' ? G2() : f, class: 'wm-deco' } }))
  // lip
  if (hasFills && C.LIP > 0) {
    const lip = minus(F.shift(person ? or(body, back, front) : body, 0, Math.round(C.LIP / F.H), 1), or(body, back, front))
    if (areaOf(lip) > 0.3) put(lip, person ? col('ink') : col('shadow'), 'wm-shadow', { 'fill-opacity': person ? 0.3 : 0.5 })
  }
  if (person) {
    const pv = r => `var(--with-rangoli-${r}, ${person.t[r]})`
    const sb = bb
    const SK = grad('skin', id => ['radialGradient', { id, cx: f2(sb[0] + (sb[2] - sb[0]) * 0.34), cy: f2(sb[1] + (sb[3] - sb[1]) * 0.26), r: f2(Math.max(4, Math.hypot(sb[2] - sb[0], sb[3] - sb[1]) * 0.85)), gradientUnits: 'userSpaceOnUse' }, [
      ['stop', { offset: 0, 'stop-color': pv('tint') }], ['stop', { offset: 0.24, 'stop-color': pv('c1') }], ['stop', { offset: 0.66, 'stop-color': pv('c1') }], ['stop', { offset: 1, 'stop-color': pv('shadow') }]]])
    const hairF = person.pf.hair
    const hb = (hairF && bboxOf(hairF)) || [4, 2, 20, 12]
    const HG = () => grad('hair', id => ['linearGradient', { id, x1: f2(hb[0]), y1: f2(hb[1]), x2: f2(hb[2]), y2: f2(hb[3]), gradientUnits: 'userSpaceOnUse' }, [
      ['stop', { offset: 0, 'stop-color': pv('c2') }], ['stop', { offset: 1, 'stop-color': pv('c3') }]]])
    // paint order: skin first (palette-map and the skin-tone picker read c1 as the face)
    put(body, SK, 'wm-k')
    if (person.feat) put(person.feat, col('ink'), 'wm-k')
    for (const part of ['hair', 'wear', 'cloth', 'gear']) {
      const Fd = person.pf[part]
      if (Fd && !empty(Fd)) put(Fd, part === 'hair' ? HG() : part === 'wear' ? pv('c2') : part === 'cloth' ? pv('c4') : col('accent'), 'wm-a')
    }
  } else {
  if (!empty(back)) put(back, AF(), 'wm-a')
  put(body, G1(), 'wm-k')
  put(panes, col('tint'), 'wm-k')
  if (onPane) put(onPane, col('ink'), 'wm-k')
  if (!empty(front)) put(front, AF(), 'wm-a')
  }
  // shine: a fine rim light just inside the body's upper-left edge (broad bodies only)
  if (hasFills) {
    const inner = shrink(body, 0.5)
    if (areaOf(inner) > 8) {
      const k = Math.round(0.42 / F.H)
      const rim = minus(inner, F.shift(inner, k, k, 1))
      F.subtract(rim, or(grow(panes, 0.35), grow(detail, 0.35)))
      const band = F.field(1)
      const w = bb[2] - bb[0] + 1e-6, h = bb[3] - bb[1] + 1e-6
      for (let j = 0; j < F.N; j++) for (let i = 0; i < F.N; i++) band[j * F.N + i] = ((i * F.H - bb[0]) / w + (j * F.H - bb[1]) / h - 0.62) * 4
      F.intersect(rim, band)
      if (areaOf(rim) > 0.5) put(rim, col('shine'), 'wm-shine', { 'fill-opacity': 0.7 })
    }
  }
  if (hasS) { put(sAll, person ? `var(--with-rangoli-c4, ${person.t.c4})` : col('c4'), 'wm-s'); put(glyph, col('shine'), 'wm-s') }
  // people: a catch-light in each eye (closed, small cutouts in the upper face), so the eyes read on deep skin too
  if (person && person.feat) {
    const fb = bboxOf(body) || [6, 4, 18, 17]
    let cl = ''
    for (const c of G.cuts) {
      if (!c.closed || c.pts.length < 3 || polyArea(c.pts) > 3) continue
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
      for (const [x, y] of c.pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) }
      const w = x1 - x0, h = y1 - y0
      if (w < 0.5 || h < 0.5 || w > h * 1.8 || h > w * 2.2 || (y0 + y1) / 2 > (fb[1] + fb[3]) / 2 + 1) continue
      cl += M.disc(x0 + w * 0.64, y0 + h * 0.34, Math.max(0.17, Math.min(w, h) * 0.2))
    }
    if (cl) raw.push({ d: cl, a: { fill: col('shine'), class: 'wm-shine' } })
  }
  motifNode(deco, 'wm-deco')
  void motifAt

  // trace
  const out = []
  for (const m of backMotifs) out.push(['path', { d: m.d, ...m.a }])
  let ds = recs.map(r => trace(r.Fd, 1))
  if (ds.reduce((n, d) => n + d.length, 0) > 5200) ds = recs.map(r => trace(r.Fd, 2.2))
  recs.forEach((r, i) => { if (ds[i]) out.push(['path', { d: ds[i], ...r.a }]) })
  for (const m of raw) out.push(['path', { d: m.d, ...m.a }])
  if (!out.length) return []
  const usedIds = new Set(out.map(n => String(n[1].fill).match(/^url\(#(.+)\)$/)).filter(Boolean).map(m => m[1]))
  const liveDefs = defs.filter(g => usedIds.has(g[1].id))
  return liveDefs.length ? [['defs', {}, liveDefs], ...out] : out
}

const trace = (Fd, coarse) => empty(Fd) ? '' : ringsD(F.trace(F.copy(Fd), C.TOL * coarse, 0.2), C.FIT * coarse)

function seedOf(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) }
  return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 10000) / 10000 }
}

// the deepest plain point of the body (away from edges, detail and panes)
function deepest(body, detail, panes, min) {
  const plain = minus(body, or(grow(detail, 0.1), grow(panes, 0.1)))
  if (empty(plain)) return null
  const X = exact(plain, 4.5)
  const B = bboxOf(plain), cx = (B[0] + B[2]) / 2, cy = (B[1] + B[3]) / 2
  let best = null
  for (let j = 0; j < F.N; j += 2) for (let i = 0; i < F.N; i += 2) {
    const v = X[j * F.N + i]
    if (v > -min) continue
    const sc = v + 0.12 * Math.hypot(i * F.H - cx, j * F.H - cy)
    if (!best || sc < best.sc) best = { sc, v, x: i * F.H, y: j * F.H }
  }
  return best ? { x: best.x, y: best.y, depth: -best.v } : null
}

// toran: hanging leaves under the body's top edge, where the body is plain for a wide run
function toranRow(body, detail, panes) {
  const X = exact(minus(body, or(grow(detail, 0.25), grow(panes, 0.25))), 4)
  const B = bboxOf(body)
  if (!B) return null
  const L = 2.3, w = 0.62
  for (let y = B[1] + 0.9; y <= B[1] + Math.max(5, (B[3] - B[1]) * 0.5); y += 0.25) {
    // plain run along this row where a leaf fits (leaf top at y, bottom at y + L)
    const ok = x => at(X, [x, y]) < -0.25 && at(X, [x, y + L]) < -0.35 && at(X, [x + w, y + L * 0.3]) < -0.2 && at(X, [x - w, y + L * 0.3]) < -0.2
    let run = null, bestRun = null
    for (let x = B[0]; x <= B[2] + 0.01; x += 0.1) {
      if (ok(x)) { if (!run) run = [x, x]; else run[1] = x }
      else { if (run && (!bestRun || run[1] - run[0] > bestRun[1] - bestRun[0])) bestRun = run; run = null }
    }
    if (run && (!bestRun || run[1] - run[0] > bestRun[1] - bestRun[0])) bestRun = run
    const want = Math.min(8, (B[2] - B[0]) * 0.55)
    if (bestRun && bestRun[1] - bestRun[0] >= 4.2 && (bestRun[1] - bestRun[0] >= want || y + 0.25 > B[1] + Math.max(5, (B[3] - B[1]) * 0.5))) {
      const span = bestRun[1] - bestRun[0], step = 1.55
      const n = Math.max(3, Math.floor(span / step) + 1) | 1
      const x0 = (bestRun[0] + bestRun[1]) / 2 - (n - 1) * step / 2
      const xs = Array.from({ length: n }, (_, k) => x0 + k * step).filter(x => x >= bestRun[0] - 0.01 && x <= bestRun[1] + 0.01)
      if (xs.length >= 3) return { xs, y: y - 0.05, L, w }
    }
  }
  return null
}
