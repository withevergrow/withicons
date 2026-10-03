// COQUETTE auto: dresses ANY skeleton (all 500, Live icons, any future icon) in the
// coquette finish. The skeleton is read by plate:
//
//   K  the object: fills + K strokes fused into one blush satin body. K lines lying
//      inside the mass are fine wine-berry detail. Pure line glyphs (arrows, checks)
//      become a plump blush satin ribbon.
//   A  closed A rings inside the mass are rose satin panels (a door, a screen); open A
//      lines inside are fine detail; A lines outside the mass are delicate GOLD (a
//      shackle, a handle, a chain), set behind the body.
//   S  badges are ribbon-red satin discs with cream glyphs; slashes and other modifiers
//      are ribbon-red bands, parted from the body by a moat.
//   cutouts  closed ones are cream inner panels; open ones are fine detail.
//   dots     every dot (zero-length subpath, tiny ring) is a PEARL.
//
// Then ONE ornament: the satin bow, tied on the object's upper corner (or on the tail
// of a line glyph). Placement is automatic and can be tuned in _coquette-tune.mjs.
import { parsePath, distToPolyline, pointInRing, area as ringArea, arclen, resample, bbox } from '../kernel/geom.mjs'
import * as F from './_coquette-field.mjs'
import { exact, erode, measure } from './_coquette-paint.mjs'
import * as K from './_coquette-kit.mjs'
import { tuneFor } from './_coquette-tune.mjs'

export const A = {
  SCALE: 0.86, TX: -0.15, TY: 0.45, // the object sits a touch low: room for the bow and the shadow
  WK: 2.05,     // K stroke width fused into the body
  WL: 3.0,      // ribbon width of a pure line glyph
  WA: 2.3,      // gold A tube
  WD: 1.05,     // fine detail line
  WS: 2.1,      // S band
  MOAT: 0.7,
  BOW: 0.95,    // bow scale
}

const fracIn = (pts, ring) => pts.length ? pts.filter(p => pointInRing(p, ring)).length / pts.length : 0

// zero-length subpaths ("M12 16 L12 16") stroke as a round dot; the parser drops them
function dots(icon) {
  const out = []
  for (const p of icon.paths || []) {
    for (const chunk of String(p.d || '').split(/(?=[Mm])/)) {
      const m = chunk.match(/^M\s*(-?[\d.]+(?:e[-+]?\d+)?)[\s,]*(-?[\d.]+(?:e[-+]?\d+)?)/)
      if (!m || !/[LlHhVvCcSsQqTtAaZz]/.test(chunk)) continue
      let subs
      try { subs = parsePath(chunk) } catch { subs = [] }
      if (!subs.length || subs.every(s => arclen(s.pts, s.closed) < 0.3)) out.push({ pts: [[+m[1], +m[2]]], closed: false, plate: p.plate || 'K', dot: true, pathId: p.id })
    }
  }
  return out
}

export function skeleton(icon, T = {}) {
  const s = A.SCALE * (T.scale || 1), tx = A.TX + (T.dx || 0), ty = A.TY + (T.dy || 0)
  const tf = p => [(p[0] - 12) * s + 12 + tx, (p[1] - 12) * s + 12 + ty]
  const lines = [...(icon.lines || []).filter(l => l.pts && l.pts.length && arclen(l.pts, l.closed) >= 0.3), ...dots(icon)]
    .map(l => ({ ...l, pts: l.pts.map(tf) }))
  const fills = (icon.fills || []).map(f => (f.set && f.set.length ? f.set : (f.subs || []).map(x => x.pts)).filter(r => r && r.length > 2).map(r => r.map(tf))).filter(r => r.length)
  const cutouts = (icon.cutouts || []).flatMap(c => (c.subs || []).map(x => ({ pts: x.pts.map(tf), closed: x.closed && x.pts.length > 2, d: c.d })))
  return { lines, fills, cutouts, s, tf }
}

// is a closed ring a small round dot (a pearl)?
const isPearl = l => {
  if (!l.closed || l.pts.length < 3) return false
  const b = bbox(l.pts)
  return Math.max(b.w, b.h) <= 3.1 && Math.min(b.w, b.h) / Math.max(b.w, b.h) > 0.7
}

// Live-icon text (forge/DYNAMIC.md): every glyph path of the stroke font has the id
// 'text:<char>:<cap>:<n>'. Coquette writes it as a FINE wine-berry line (never a satin
// tube): on the object's own surface when it sits inside it, in cream on a red badge, and
// on a cream label plate when it floats free (a clock face, a gauge value, "4G+").
const isText = l => typeof l.pathId === 'string' && l.pathId.startsWith('text:')
const capOf = l => { const m = String(l.pathId).match(/^text:.:(\d+(?:\.\d+)?):/su); return m ? +m[1] : 5 }
const clampN = (v, a, b) => Math.max(a, Math.min(b, v))

export function auto(icon, opts = {}) {
  const T = { ...tuneFor(icon.name, icon.params), ...opts }
  const live = !!icon.params
  const sk = skeleton(icon, T)
  const plateOf = l => (T.remap && T.remap[l.plate]) || l.plate || 'K'
  const textL = sk.lines.filter(isText)
  const all = sk.lines.filter(l => !isText(l))
  const dotL = all.filter(l => l.dot || isPearl(l))
  const lines = all.filter(l => !dotL.includes(l))
  const Kl = lines.filter(l => plateOf(l) === 'K')
  let Al = lines.filter(l => plateOf(l) === 'A')
  const Sl = lines.filter(l => plateOf(l) === 'S')
  // the text's knock-out cutouts are redrawn as the text itself
  const nearText = c => textL.length && c.pts.every(p => textL.some(l => distToPolyline(p, l.pts, l.closed) < 0.45))
  const cutouts = sk.cutouts.filter(c => !nearText(c))

  // fills belong to the plate whose lines run closest to their edge
  const fillsBy = { K: [], A: [], S: [] }
  for (const rings of T.noFills ? [] : sk.fills) {
    const votes = { K: 0, A: 0, S: 0 }
    for (const r of rings) for (let i = 0; i < r.length; i += 3) {
      let best = Infinity, pl = 'K'
      for (const l of lines) { const d = distToPolyline(r[i], l.pts, l.closed); if (d < best) { best = d; pl = plateOf(l) } }
      votes[pl]++
    }
    fillsBy[T.fillPlate || (votes.S > votes.K + votes.A ? 'S' : votes.A > votes.K ? 'A' : 'K')].push(rings)
  }
  if (!fillsBy.K.length && fillsBy.A.length && !Kl.length) { fillsBy.K = fillsBy.A; fillsBy.A = [] }

  const mass = F.field(2.4)
  for (const r of fillsBy.K) F.region(r, 2.4, mass)
  const hasMass = F.any(mass)
  const sample = (f, p) => { const i = Math.round(p[0] / F.H), j = Math.round(p[1] / F.H); return i < 0 || j < 0 || i >= F.N || j >= F.N ? 9 : f[j * F.N + i] }
  const at = p => sample(mass, p)
  const dense = l => { const r = resample(l.pts, 0.3, l.closed).map(o => o.p); return r.length ? r : l.pts }
  const inMass = l => { const P = dense(l); return P.filter(p => at(p) < -0.5).length / P.length }

  // ---- K
  const innerK = hasMass ? Kl.filter(l => inMass(l) > 0.7) : []
  const bodyK = Kl.filter(l => !innerK.includes(l))
  let bodyF
  const glyph = !hasMass
  if (glyph) bodyF = F.strokes(bodyK, T.wl || A.WL, 2.4)
  else { bodyF = F.strokes(bodyK, T.wk || A.WK, 2.4); F.union(bodyF, mass) }

  // ---- S: badges and modifiers
  const closedS = Sl.filter(l => l.closed && l.pts.length > 2)
  const badges = closedS.filter(l => !closedS.some(o => o !== l && Math.abs(ringArea(o.pts)) > Math.abs(ringArea(l.pts)) && fracIn(l.pts, o.pts) > 0.9))
  const inBadge = l => badges.some(b => b !== l && fracIn(l.pts, b.pts) > 0.8)
  const glyphS = Sl.filter(l => !badges.includes(l) && inBadge(l))
  const bandS = Sl.filter(l => !badges.includes(l) && !glyphS.includes(l))
  const badgeF = badges.length ? (() => { const f = F.strokes(badges, A.WS, 2.4); for (const b of badges) F.region([b.pts], 2.4, f); for (const r of fillsBy.S) F.region(r, 2.4, f); return f })() : null
  const bandF = bandS.length ? F.strokes(bandS, A.WS, 2.4) : null

  // ---- text: by glyph, on the badge, on the object, or free on a cream label plate
  const glyphs = new Map()
  for (const l of textL) { const g = glyphs.get(l.pathId) || []; g.push(l); glyphs.set(l.pathId, g) }
  const tIn = [], tBadge = [], tFree = []
  const mid = ls => { const b = bbox(ls.flatMap(l => l.pts)); return [(b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2] }
  for (const ls of glyphs.values()) {
    const c = mid(ls)
    if (badgeF && sample(badgeF, c) < -0.2) tBadge.push(...ls)
    else if (hasMass && sample(bodyF, c) < -0.3) tIn.push(...ls)
    else tFree.push(...ls)
  }
  const tw = ls => clampN(0.18 * Math.min(...ls.map(capOf)) * sk.s + 0.35, 1.0, 1.3)
  // free text rows merge into label plates (a two-row clock face is one plate)
  let plateF = null
  const plates = []
  if (tFree.length) {
    const w = tw(tFree), pad = w / 2 + 1.3, padX = pad + 0.2
    // fit: text too wide for a plate on the canvas shrinks a little (never below 0.75) and
    // slides inside, so the plate keeps an even margin round it
    {
      const B = bbox(tFree.flatMap(l => l.pts)), maxW = 22.6 - 2 * padX
      const q = B.w > maxW ? Math.max(0.75, maxW / B.w) : 1, cx = (B.x0 + B.x1) / 2, cy = (B.y0 + B.y1) / 2
      const hw = B.w * q / 2
      const dx = Math.max(0, 0.7 + padX - (cx - hw)) - Math.max(0, cx + hw + padX - 23.3)
      if (q < 1 || Math.abs(dx) > 1e-6) for (let i = 0; i < tFree.length; i++) tFree[i] = { ...tFree[i], pts: tFree[i].pts.map(([x, y]) => [cx + (x - cx) * q + dx, cy + (y - cy) * q]) }
    }
    const boxes = [...new Set(tFree.map(l => l.pathId))].map(id => bbox(tFree.filter(l => l.pathId === id).flatMap(l => l.pts))).map(b => [b.x0, b.y0, b.x1, b.y1])
    let merged = true
    while (merged) {
      merged = false
      for (let i = 0; i < boxes.length && !merged; i++) for (let j = i + 1; j < boxes.length && !merged; j++) {
        const a = boxes[i], b = boxes[j]
        if (a[0] - 3 < b[2] && b[0] - 3 < a[2] && a[1] - 3 < b[3] && b[1] - 3 < a[3]) {
          boxes[i] = [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[2], b[2]), Math.max(a[3], b[3])]
          boxes.splice(j, 1); merged = true
        }
      }
    }
    for (const b of boxes) {
      const x0 = Math.max(0.7, b[0] - padX), x1 = Math.min(23.3, b[2] + padX)
      const y0 = Math.max(0.7, b[1] - pad), y1 = Math.min(23.3, b[3] + pad)
      plates.push({ box: [x0, y0, x1, y1], f: K.rr(x0, y0, x1, y1, Math.min(2.2, (y1 - y0) / 2, (x1 - x0) / 2)) })
    }
    plateF = K.union(plates.map(p => p.f))
  }

  const sAll = K.union(badgeF, bandF)
  const hasS = F.any(sAll)
  const plateGap = plateF ? K.grow(plateF, 0.6) : null

  // ---- A
  const panels = Al.filter(l => l.closed && l.pts.length > 2 && hasMass && inMass(l) > 0.5)
  const openA = Al.filter(l => !panels.includes(l))
  const innerA = openA.filter(l => hasMass && inMass(l) > 0.5)
  const outerA = openA.filter(l => !innerA.includes(l))

  const parts = []
  if (T.under) parts.push(...[].concat(T.under(K, { icon, sk, params: icon.params || null }) || []))
  const unplate = f => plateGap ? K.cut(f, plateGap) : f
  const moat = f => unplate(hasS ? K.moat(f, sAll, A.MOAT) : f)
  // gold parts outside the body sit behind it
  if (outerA.length) {
    const g = F.strokes(outerA, glyph ? (T.wl || A.WL) * 0.85 : (T.wa || A.WA), 2.4)
    for (const r of fillsBy.A) F.region(r, 2.4, g)
    parts.push(glyph ? K.rose(moat(g), { plate: 'A' }) : K.gold(moat(g), { plate: 'A' }))
  }
  // body (with inner detail engraved as fine lines)
  const openCut = cutouts.filter(c => !c.closed)
  const detailF = innerK.length || openCut.length
    ? (() => {
      const f = F.strokes([...innerK], A.WD, 2.4)
      for (const c of openCut) F.strokes([c], A.WD, 2.4, f)
      return f
    })() : null
  parts.push(K.body(moat(bodyF), { mat: T.mat || 'blush', detail: detailF && F.any(detailF) ? detailF : null, plate: 'K' }))
  // cream inner panels (closed cutouts)
  const cutC = cutouts.filter(c => c.closed)
  if (cutC.length) {
    const f = F.field(2.4)
    for (const c of cutC) F.region([c.pts], 2.4, f)
    const g = K.inter(f, erode(exact(bodyF), 0.5))
    parts.push(K.cream(moat(g), { plate: 'K', ow: 0.75 }))
  }
  // rose panels (closed A rings in the mass) and A fills
  if (panels.length || fillsBy.A.length) {
    const f = F.strokes(panels, A.WD + 0.2, 2.4)
    for (const l of panels) F.region([l.pts], 2.4, f)
    for (const r of fillsBy.A) F.region(r, 2.4, f)
    parts.push(K.rose(moat(f), { plate: 'A', ow: 0.8 }))
  }
  if (innerA.length) parts.push(K.ink(moat(F.strokes(innerA, A.WD + 0.1, 2.4)), 0, { plate: 'A' }))
  if (tIn.length) parts.push(K.ink(F.strokes(tIn, tw(tIn), 2.4), 0, { plate: 'A' }))
  // S on top
  if (badgeF) {
    parts.push(K.satin(unplate(badgeF), { plate: 'S' }))
    if (glyphS.length) parts.push(K.fill(F.strokes(glyphS, 1.3, 2.4), 'edge', { plate: 'S' }))
    if (tBadge.length) parts.push(K.fill(F.strokes(tBadge, tw(tBadge), 2.4), 'edge', { plate: 'S' }))
  }
  if (bandF) parts.push(K.satin(unplate(bandF), { plate: 'S', ow: 0.7 }))
  // pearls for dots (Live icons: a little bigger, so a row of them never reads as specks)
  if (dotL.length) {
    const byPlate = {}
    for (const l of dotL) {
      const b = bbox(l.pts), c = [(b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2]
      const r = l.dot ? (live ? 1.35 : 1.2) : Math.max(1.1, Math.max(b.w, b.h) / 2 + 0.6)
      const pl = plateOf(l)
      const f = T.dotShape === 'star' ? K.star(c[0], c[1], r * 1.55, r * 0.72, 0.35) : K.disc(c[0], c[1], r)
      ;(byPlate[pl] = byPlate[pl] || []).push(f)
    }
    for (const [pl, fs] of Object.entries(byPlate)) {
      const f = moat(K.union(fs))
      parts.push(T.dotShape === 'star' ? K.body(f, { plate: pl, op: 0.6, ow: 0.45, noShadow: true }) : { f, mat: 'pearl', plate: pl, ow: live ? 0.42 : 0.5 })
    }
  }
  // free text on its cream label plate
  if (plates.length) {
    parts.push(K.cream(plateF, { plate: 'A', ow: 0.5, sheenBias: -1 }))
    parts.push(K.ink(F.strokes(tFree, tw(tFree), 2.4), 0, { plate: 'A' }))
  }

  // ---- the ornament (one, attached): a bow on the object's corner, a little heart
  // clasp, or (free text only) a tiny bow tied on the label plate
  const orn = T.orn !== undefined ? T.orn : live ? (hasMass ? 'bow' : plates.length ? 'plate' : null) : 'bow'
  if (T.bow !== false && orn) {
    const b = orn === 'plate' ? null : bowSpot(icon, sk, { glyph, bodyF, Kl: bodyK, avoid: [...Al, ...Sl, ...dotL, ...textL], T })
    const s0 = live ? 0.6 : null
    if (orn === 'heart' && b && !b.heart) parts.push(K.heart(b.x - Math.sign(b.rot) * 0.3, b.y + 0.5, 5.2, b.rot * 0.6, { plate: 'K' }))
    else if (orn === 'plate' || (b && b.heart && plates.length)) {
      const p = plates.slice().sort((u, v) => (u.box[1] - v.box[1]) || (u.box[0] - v.box[0]))[0]
      if (p) parts.push(...K.bow(Math.max(2.1, p.box[0] + 0.25), Math.max(1.9, p.box[1] + 0.15), 0.38, -20))
    } else if (b && !b.heart) parts.push(...K.bow(b.x, b.y, T.bow && T.bow.s ? b.s : s0 || b.s, b.rot))
  }
  if (T.extra) parts.push(...[].concat(T.extra(K, { icon, sk, params: icon.params || null }) || []))
  return parts
}

// where to tie the bow
function bowSpot(icon, sk, { glyph, bodyF, Kl, avoid, T }) {
  const s = (T.bow && T.bow.s) || A.BOW
  if (T.bow && typeof T.bow === 'object' && T.bow.x != null) return { x: T.bow.x, y: T.bow.y, s, rot: T.bow.rot || 0 }
  const clamp = (x, y) => ({ x: Math.min(23 - 4.9 * s, Math.max(1 + 4.9 * s, x)), y: Math.min(23 - 4.9 * s, Math.max(1 + 3.9 * s, y)) })
  if (glyph) {
    // an arrow: tie it on the tail of a long straight shaft
    const L = [...Kl].sort((a, b) => arclen(b.pts, b.closed) - arclen(a.pts, a.closed))[0]
    if (!L) return null
    const straight = !L.closed && L.pts.length >= 2 && (() => {
      const a = L.pts[0], b = L.pts[L.pts.length - 1], len = Math.hypot(b[0] - a[0], b[1] - a[1])
      return len >= 8.5 && arclen(L.pts) < len * 1.05
    })()
    const heads = Kl.filter(l => l !== L)
    // the tail is the end of the shaft far from any arrowhead
    if (straight && heads.length) {
      const a = L.pts[0], b = L.pts[L.pts.length - 1]
      const near = p => Math.min(...heads.map(l => distToPolyline(p, l.pts, l.closed)))
      const p = near(a) >= near(b) ? a : b
      if (near(p) > 3) return { ...clamp(p[0], p[1]), s: s * 0.78, rot: 0 }
    }
    return { heart: true } // no free-floating crumb: the caller decides (usually nothing)
  }
  const E = exact(bodyF)
  const { box } = measure(E)
  const corners = T.corner === 'tl' ? ['tl'] : T.corner === 'tr' ? ['tr'] : ['tr', 'tl']
  let best = null
  for (const c of corners) {
    const target = c === 'tr' ? [box[2], box[1]] : [box[0], box[1]]
    // the edge point nearest the corner
    let bp = null, bd = Infinity
    for (let j = 0; j < F.N; j += 2) for (let i = 0; i < F.N; i += 2) {
      const v = E[j * F.N + i]
      if (v < -0.35 && v > -0.95) { const x = i * F.H, y = j * F.H, dd = Math.hypot(x - target[0], y - target[1]); if (dd < bd) { bd = dd; bp = [x, y] } }
    }
    if (!bp) continue
    let pen = 0
    for (const l of avoid) for (const p of l.pts) if (Math.hypot(p[0] - bp[0], p[1] - bp[1]) < 3.5) pen++
    const score = pen + (c === 'tr' ? 0 : 0.5) + bd * 0.4
    if (!best || score < best.score) best = { score, c, p: bp }
  }
  if (!best) return null
  const rot = best.c === 'tr' ? 18 : -18
  return { ...clamp(best.p[0], best.p[1]), s, rot }
}

// the emptiest corner of the canvas (for a small heart): its centre, or null when no
// corner has `need` units of clearance from the drawing (lines counted at their width)
export function freeCorner(lines, need = 2.3) {
  let best = null
  for (const [x, y] of [[19.4, 4.6], [4.6, 4.6], [19.4, 19.2], [4.6, 19.2], [19.8, 12], [12, 4.2]]) {
    let c = Infinity
    for (const l of lines) c = Math.min(c, distToPolyline([x, y], l.pts, l.closed) - 1.6)
    if (c >= need && (!best || c > best.c + 0.6)) best = { c, p: [x, y] }
  }
  return best ? best.p : null
}
