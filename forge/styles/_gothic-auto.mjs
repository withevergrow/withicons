// GOTHIC automatic composer: any skeleton (all 500 icons, every Live icon, any future
// icon) rebuilt as stonework and stained glass.
//
//   K frame lines      carved stone tubes with block joints (the object's silhouette)
//   fills (mass)       stained glass, divided into panes by the inner lines; the biggest
//                      pane gets tracery (quarry diamonds and a quatrefoil medallion, or
//                      rose spokes in a round pane)
//   inner K / A lines  stone mullions (narrower stone set into the glass)
//   A lines outside    gilded metal (a shackle, a handle), painted behind the object
//   cutouts            small closed ones are deep recesses glowing from within; big closed
//                      ones are their own darker pane; open ones that are short are slots
//   S badges           a ruby roundel in a gilded bezel, cleared by a moat; S glyphs on it
//                      are stone; other S lines (a slash) are gilded bars with a moat
//   Live text          gilded lettering seated on the glass
import { parsePath, distToPolyline, pointInRing, area, arclen, resample } from '../kernel/geom.mjs'
import { setOf } from '../kernel/bool.mjs'
import * as F from './_gothic-field.mjs'
import { K as PK, minus, grow, erode, empty, exact, at, unionAll, inscribed, circlePts, mv } from './_gothic-paint.mjs'
import { tuneFor, LIVE_TEXTLESS, LETTERED_DEEP } from './_gothic-tune.mjs'
import { markIds, markGeo, isWellOf } from './_gothic-marks.mjs'

export const A = {
  SCALE: 0.92, TX: -0.2, TY: -0.32,
  WK: 2.0,     // stone frame tube
  WM: 1.2,     // mullion (inner stone)
  WA: 1.7,     // gilded metal (A outside the mass)
  WS: 1.6,     // S glyph
  WT: 1.15,    // live lettering
  MOAT: 0.65,
  SLOT: 1.25,  // open-cutout slot width
  M: 0.8,
}

const tfOf = T => p => {
  const s = A.SCALE * (T.scale || 1)
  return [(p[0] - 12) * s + 12 + A.TX + (T.dx || 0), (p[1] - 12) * s + 12 + A.TY + (T.dy || 0)]
}
const fracInside = (pts, ring) => pts.length ? pts.filter(p => pointInRing(p, ring)).length / pts.length : 0
const polyArea = r => Math.abs(area(r))

// zero-length subpaths stroke as a round dot; the parser drops them
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

// block joints across a stone tube: short ticks perpendicular to the centreline
function ticks(lines, w, step = 2.5) {
  const out = []
  for (const l of lines) {
    if (l.pts.length < 2) continue
    const L = arclen(l.pts, l.closed)
    if (L < 4.2) continue
    const n = Math.max(1, Math.round(L / step))
    const st = L / n
    const R = resample(l.pts, 0.1, l.closed)
    const P = R.map(o => o.p)
    // cumulative length
    const cum = [0]
    for (let i = 1; i < P.length; i++) cum.push(cum[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]))
    for (let k = l.closed ? 0 : 1; k < (l.closed ? n : n); k++) {
      const s = k * st + (l.closed ? st / 2 : 0)
      if (!l.closed && (s < 1.4 || s > L - 1.4)) continue
      let i = cum.findIndex(v => v >= s)
      if (i < 1) i = 1
      if (i >= P.length - 1) i = P.length - 2
      // skip corners: the direction must be steady around the tick
      const a = P[Math.max(0, i - 6)], b = P[Math.min(P.length - 1, i + 6)], m = P[i]
      const t1 = [m[0] - a[0], m[1] - a[1]], t2 = [b[0] - m[0], b[1] - m[1]]
      const l1 = Math.hypot(...t1) || 1, l2 = Math.hypot(...t2) || 1
      if ((t1[0] * t2[0] + t1[1] * t2[1]) / l1 / l2 < 0.92) continue
      const tx = (t1[0] / l1 + t2[0] / l2) / 2, ty = (t1[1] / l1 + t2[1] / l2) / 2, tl = Math.hypot(tx, ty) || 1
      const nx = -ty / tl, ny = tx / tl, h = w / 2 + 0.2
      out.push([[m[0] - nx * h, m[1] - ny * h], [m[0] + nx * h, m[1] + ny * h]])
    }
  }
  return out
}

// family colours: the main glass of the biggest pane and its companions
const CAT = {
  navigation: 'c2', arrows: 'c1', actions: 'c1', status: 'c1', media: 'c1', files: 'c2',
  communication: 'c2', users: 'c3', commerce: 'c3', time: 'c3', devices: 'c2', layout: 'c2',
  text: 'c2', maps: 'c4', development: 'c4', security: 'c1', charts: 'c4', weather: 'c2',
  objects: 'c3', food: 'c4', health: 'c1', education: 'c2', nature: 'c4', home: 'c3', travel: 'c4', sports: 'c1',
}
export const COMPANION = { c1: ['c2', 'c3', 'c4'], c2: ['c1', 'c3', 'c4'], c3: ['c1', 'c2', 'c4'], c4: ['c3', 'c1', 'c2'] }
export const MEDAL = { c1: 'c3', c2: 'c3', c3: 'c2', c4: 'c1' }
export const mainRole = icon => (tuneFor(icon.name).glass) || CAT[icon.category] || 'c2'

export function auto(icon0) {
  const T = tuneFor(icon0.name, icon0.params)
  const tf = tfOf(T)
  const live = !!icon0.params
  // Live marks (a die's pips, a month's marked day: small A loops in a well) are gilt bosses set with a jewel
  // of gold glass, so the value reads by light on the deep lettered glass; their loops and wells leave the scene
  const mIds = live ? markIds(icon0) : new Set(), marks = markGeo(icon0, mIds)
  const icon = marks.length ? {
    ...icon0,
    paths: icon0.paths.filter(p => !mIds.has(p.id)),
    lines: (icon0.lines || []).filter(l => !mIds.has(l.pathId)),
    cutouts: (icon0.cutouts || []).map(c => ({ ...c, subs: (c.subs || []).filter(q => !isWellOf(marks, q)) })).filter(c => c.subs.length),
  } : icon0
  const all = [...(icon.lines || []), ...dots(icon)].filter(l => l.pts && l.pts.length)
    .map(l => ({ ...l, pts: l.pts.map(tf) }))
  const plateOf = l => (T.plate && T.plate[l.pathId]) || l.plate || 'K'
  const Kl = all.filter(l => plateOf(l) === 'K')
  let Al = all.filter(l => plateOf(l) === 'A')
  const Sl = all.filter(l => plateOf(l) === 'S')

  // fills: each belongs to the plate whose lines run closest to its edge
  const fills = { K: [], A: [], S: [] }
  for (const f of T.noFills ? [] : icon.fills || []) {
    const rings = (f.set && f.set.length ? f.set : (f.subs || []).map(s => s.pts)).filter(r => r && r.length > 2).map(r => r.map(tf))
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

  // cutouts (live: a letter that ends where it starts is a line; only an explicit Z closes it)
  const cutArea = [], cutLine = []
  if (!T.noCutouts) for (const c of icon.cutouts || []) {
    let subs = c.subs || []
    if (live && typeof c.d === 'string') {
      const z = c.d.split(/(?=[Mm])/).filter(ch => /[LlHhVvCcSsQqTtAa]/.test(ch)).map(ch => /[Zz]/.test(ch))
      if (z.length === subs.length) subs = subs.map((s, i) => s.closed && !z[i] ? { ...s, closed: false, pts: [...s.pts, s.pts[0]] } : s)
    }
    for (const s of subs) {
      if (!s.pts || !s.pts.length) continue
      const pts = s.pts.map(tf)
      if (s.closed && pts.length > 2) cutArea.push(pts); else cutLine.push({ pts, closed: false })
    }
  }

  const mass = F.field(A.M)
  for (const r of fills.K) F.region(r, A.M, mass)
  const hasMass = F.any(mass)
  const dense = l => { const r = resample(l.pts, 0.25, l.closed).map(o => o.p); return r.length ? r : l.pts }
  const inMass = l => { const P = dense(l); return P.filter(p => at(mass, p) < -0.45).length / P.length }

  // lines along an open cutout: short ones are slots (recess), live ones are lettering
  const along = (l, c) => c.pts.every(p => distToPolyline(p, l.pts, l.closed) < 0.4) || l.pts.every(p => distToPolyline(p, c.pts) < 0.4)
  const slots = [], text = []
  const takeSlots = arr => arr.filter(l => {
    const cs = cutLine.filter(c => along(l, c))
    if (!cs.length) return true
    if (live && l.plate === 'A') { text.push(l); return false }
    if (arclen(l.pts, l.closed) < 3.2 && !T.inlay) { slots.push(l); return false }
    return true
  })
  Al = takeSlots(Al)
  let Kl2 = takeSlots(Kl)

  // Live lettering with no glass under it (a frameless clock, "4G+", the reading under a gauge):
  // it is set on a stone tablet of its own, gilt on glass, never left as loose stone letters
  const isText = l => String(l.pathId || '').startsWith('text:')
  const free = live ? [...Kl2, ...Al].filter(l => isText(l) && (!hasMass || inMass(l) < 0.5)) : []
  if (free.length) { Kl2 = Kl2.filter(l => !free.includes(l)); Al = Al.filter(l => !free.includes(l)) }

  // K lines inside the mass are mullions; the rest frame the object in stone
  const innerK = hasMass ? Kl2.filter(l => inMass(l) > 0.7) : []
  const frame = Kl2.filter(l => !innerK.includes(l))
  const innerA = [], backA = []
  for (const l of Al) (hasMass && (T.aInner === true || (T.aInner !== false && inMass(l) > 0.5)) ? innerA : backA).push(l)
  const mull = [...innerK, ...innerA]

  // S: outermost closed rings are badges; glyphs inside them; the rest are bars
  const closedS = Sl.filter(l => l.closed && l.pts.length > 2)
  const badges = closedS.filter(l => !closedS.some(o => o !== l && polyArea(o.pts) > polyArea(l.pts) && fracInside(l.pts, o.pts) > 0.9))
  const inBadge = Sl.filter(l => !badges.includes(l) && badges.some(b => fracInside(dense(l), b.pts) > 0.8))
  const bars = Sl.filter(l => !badges.includes(l) && !inBadge.includes(l))

  const wk = T.wk || A.WK
  const fFrame = F.strokes(frame, wk, A.M)
  const fMull = F.strokes(mull, T.wm || A.WM, A.M)
  const fBack = F.strokes(backA, T.wa || A.WA, A.M)
  for (const r of fills.A) F.region(r, A.M, fBack)

  // glass panes: the mass minus the mullions (and their leads), split by big cutouts
  // Live lettering is gilt: it needs a deep glass under it, and no tracery competing with it
  // (a Live icon that writes a value is lettered whatever its current text, even none: its glass must not
  // change with the value)
  const lettered = live && (text.length > 0 || !LIVE_TEXTLESS.has(icon.name))
  let role = T.glass || mainRole(icon)
  if (lettered && role === 'c3') role = 'c2'
  const comp = COMPANION[role]
  const parts = []
  const panes = []
  if (hasMass) {
    let G = minus(mass, grow(fMull, PK.OL * 0.6))
    const bigCut = cutArea.filter(r => polyArea(r) >= 7)
    const smallCut = cutArea.filter(r => polyArea(r) < 7)
    const cutF = bigCut.length ? F.region(bigCut, A.M) : null
    if (cutF) {
      // the pane inside a big cutout is set apart by its own lead line
      const edge = minus(grow(cutF, PK.OL * 0.5), erode(cutF, PK.OL * 0.5))
      G = minus(G, edge)
    }
    G = exact(G)
    const comps = F.components(G, true).filter(c => c.area > 0.35).sort((a, b) => b.area - a.area)
    let ci = 0
    comps.forEach((c, k) => {
      const P = F.field(1)
      for (const q of c.cells) P[q] = G[q]
      // a cell that is ink in G but not in this component stays outside
      const cx = (c.x0 + c.x1) / 2, cy = (c.y0 + c.y1) / 2
      const inCut = cutF && at(cutF, [cx, cy]) < 0 && c.area < 0.9 * comps[0].area
      let r = k === 0 ? role : inCut ? comp[0] : comp[(ci++) % comp.length]
      if (lettered && r === 'c3') r = role === 'c1' ? 'c2' : 'c1'
      // lettered glass is smoked deep, so the gilt lettering reads by light on it at 24px, in light and dark pages
      panes.push({ m: 'glass', F: P, role: r, plate: 'K', batch: 'panes', deep: inCut ? 0.22 : lettered ? LETTERED_DEEP : 0, glow: lettered ? 0.08 : undefined, glint: lettered ? false : undefined, tracery: lettered ? 'none' : k === 0 ? (T.tracery || (live ? 'none' : 'auto')) : 'none', medal: MEDAL[r] })
    })
    // the biggest pane's tracery: rose spokes in a round pane, quarry and medallion otherwise
    if (panes.length) {
      const p0 = panes[0], i0 = inscribed(p0.F) || { r: 0, area: 0 }
      const rIn = i0.r, ar = i0.area
      if (p0.tracery === 'auto') p0.tracery = rIn < 1.3 ? 'none' : (ar / (Math.PI * rIn * rIn) < 1.75 && rIn > 2.7) ? 'rose' : rIn < 2.3 ? 'none' : 'quarry'
      // a pane already drawn into by the skeleton's inner lines keeps plain quarries
      if (mull.length || T.medallion === false) p0.medallion = false
      for (const p of panes.slice(1)) {
        const ip = inscribed(p.F)
        if (!lettered && !live && !mull.length && ip && ip.r > 2.6) p.tracery = 'medallion'
      }
    }
    if (smallCut.length) panes.push({ m: 'recess', F: F.region(smallCut, A.M), plate: 'K', glow: 'c3', glowOp: 0.6 })
  }

  // paint order: gilded parts behind, glass, stone frame, mullions, slots, lettering, S
  if (F.any(fBack)) parts.push({ m: 'gilt', F: fBack, plate: 'A' })
  parts.push(...panes)
  if (F.any(fFrame)) parts.push({ m: 'stone', F: fFrame, plate: 'K', ticks: T.noTicks ? null : ticks(frame, wk) })
  if (F.any(fMull)) parts.push({ m: 'stone', F: minus(fMull, erode(fFrame, 0.2)), plate: innerA.length && !innerK.length ? 'A' : 'K', thin: true })
  if (slots.length) parts.push({ m: 'recess', F: F.strokes(slots, A.SLOT, A.M), plate: 'A', outline: 0.3 })
  if (text.length) {
    // lettering; a Live dot that is not a letter (a month's day) is a full gilt stud, so it reads as a mark
    const isDot = l => !String(l.pathId || '').startsWith('text:') && arclen(l.pts, l.closed) < 0.6
    const fT = F.strokes(text.filter(l => !isDot(l)), T.wt || A.WT, A.M)
    const dts = text.filter(isDot)
    if (dts.length) F.strokes(dts, 1.7, A.M, fT)
    parts.push({ m: 'gilt', F: fT, plate: 'A', outline: 0.3, thin: true, glint: false, text: true, letter: true })
  }

  if (badges.length || bars.length || fills.S.length) {
    const fS = F.field(A.M)
    for (const b of badges) { F.region([b.pts], A.M, fS); F.strokes([b], A.WS, A.M, fS) }
    for (const r of fills.S) F.region(r, A.M, fS)
    const fBars = F.strokes(bars, T.ws || A.WS, A.M)
    const ALL = unionAll([fS, fBars])
    parts.push({ m: 'cut', F: grow(exact(ALL), A.MOAT + PK.OL) })
    if (F.any(fBars)) parts.push({ m: 'gilt', F: fBars, plate: 'S' })
    if (F.any(fS)) {
      parts.push({ m: 'gilt', F: fS, plate: 'S', glint: false })
      const J = erode(exact(fS), 0.55)
      // (a Live badge carries a value: smoked, no glint, so its numerals read edge to edge)
      if (!empty(J)) parts.push({ m: 'glass', F: J, role: T.badge || (role === 'c1' ? 'c2' : 'c1'), plate: 'S', outline: 0.25, tracery: 'none', ...(live ? { glint: false, glow: 0.1, deep: 0.3 } : {}) })
      if (inBadge.length) parts.push({ m: 'stone', F: F.strokes(inBadge, 1.3, A.M), plate: 'S', thin: true, outline: 0.3, text: live })
    }
  }
  if (marks.length) {
    const sc = Math.hypot(...[0, 1].map(k => tf([1, 0])[k] - tf([0, 0])[k]))
    for (const m of marks) {
      const [x, y] = tf([m.cx, m.cy]), R = (m.r + 0.85) * sc
      parts.push({ m: 'gilt', F: F.region([circlePts(x, y, R).slice(0, -1)], A.M), plate: 'A', glint: false, thin: true })
      parts.push({ m: 'glass', F: F.region([circlePts(x, y, R * 0.55).slice(0, -1)], A.M), role: 'c3', plate: 'A', outline: 0.2, tracery: 'none', glow: 0.35, glint: false })
    }
  }
  if (free.length) parts.push(...tablet(free, T.tablet || (role === 'c3' ? 'c2' : role === 'c2' ? 'c4' : role)))
  // what the Live dressing (_gothic-live.mjs) needs to know about the composition
  if (live) {
    let mb = null
    for (const r of fills.K) for (const ring of r) for (const [x, y] of ring) {
      if (!mb) mb = { x0: x, y0: y, x1: x, y1: y }
      else { if (x < mb.x0) mb.x0 = x; if (y < mb.y0) mb.y0 = y; if (x > mb.x1) mb.x1 = x; if (y > mb.y1) mb.y1 = y }
    }
    parts.meta = { mass: hasMass ? mass : null, box: mb, text, free, role, lettered }
  }
  return parts
}

// a stone tablet behind free lettering: text bbox padded, kept on the canvas; the lettering is
// scaled down (about its centre) when the tablet would not fit
const bboxOf = ls => {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (const l of ls) for (const [x, y] of l.pts) { if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y }
  return { x0, y0, x1, y1 }
}
export function tablet(lines, role = 'c4', o = {}) {
  const PX = o.px ?? 1.55, PY = o.py ?? 1.35, LO = 2.1, HI = 21.6
  let b = bboxOf(lines)
  const cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2
  const k = Math.min(1, (HI - LO - 2 * PX) / Math.max(0.1, b.x1 - b.x0), (HI - LO - 2 * PY) / Math.max(0.1, b.y1 - b.y0))
  // the scaled text, moved back inside the live area
  let ls = lines.map(l => ({ ...l, pts: l.pts.map(([x, y]) => [cx + (x - cx) * k, cy + (y - cy) * k]) }))
  b = bboxOf(ls)
  const dx = Math.max(0, LO + PX - b.x0) - Math.max(0, b.x1 + PX - HI), dy = Math.max(0, LO + PY - b.y0) - Math.max(0, b.y1 + PY - HI)
  if (dx || dy) { ls = ls.map(l => ({ ...l, pts: l.pts.map(([x, y]) => [x + dx, y + dy]) })); b = bboxOf(ls) }
  const T0 = { x0: b.x0 - PX, y0: b.y0 - PY, x1: b.x1 + PX, y1: b.y1 + PY }
  const r = Math.min(1.6, (T0.y1 - T0.y0) / 3)
  const pts = []
  const corner = (x, y, a0) => { for (let i = 0; i <= 6; i++) { const a = (a0 + 15 * i) * Math.PI / 180; pts.push([x + r * Math.cos(a), y + r * Math.sin(a)]) } }
  corner(T0.x0 + r, T0.y0 + r, 180); corner(T0.x1 - r, T0.y0 + r, 270); corner(T0.x1 - r, T0.y1 - r, 0); corner(T0.x0 + r, T0.y1 - r, 90)
  const slab = F.region([pts], A.M)
  const fw = o.frame ?? 1.05
  const cap = Math.max(...ls.map(l => +String(l.pathId).split(':')[2] || 5))
  const w = Math.max(1.1, Math.min(1.4, cap * k * 0.2))
  if (o.glass) return [
    { m: 'stone', F: minus(slab, erode(exact(slab), fw)), plate: 'K' },
    { m: 'glass', F: erode(exact(slab), fw), role, plate: 'K', tracery: 'none', dark: 0.38, glow: 0.08, deep: LETTERED_DEEP, glint: false },
    { m: 'gilt', F: F.strokes(ls, w, A.M), plate: 'A', outline: 0.3, thin: true, glint: false, text: true, letter: true },
  ]
  // an inscription: a limestone tablet with the reading cut into it, each letter a dark incised groove whose
  // lower lip catches the gilt light. (The tablet exists only for its text, so it is as pale as the page:
  // the reading, not the stone, carries the contrast.)
  const L = F.strokes(ls, w, A.M)
  return [
    { m: 'stone', F: slab, plate: 'K', ashlar: null },
    { m: 'paint', F: minus(mv(L, 0.12, 0.2), L), role: 'accent', op: 0.9, plate: 'A', text: true },
    { m: 'recess', F: L, plate: 'A', outline: 0, text: true },
  ]
}
