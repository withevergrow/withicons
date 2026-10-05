// ANIME auto — renders ANY skeleton (static icons, live icons, future icons) in the style.
//
// The skeleton is read like an anime layout sheet:
//   fills            -> cel surfaces: K mass in the main colour, A parts in the second colour
//   closed cutouts   -> inset panels (screens, doors, lenses): glossy ink glass on devices and media,
//                       cream elsewhere, with glass bars
//   S plate          -> badges (coral / green discs with a white glyph), slashes (coral tubes in a moat)
//   centrelines      -> on or inside the mass: brush ink line art (tapered free ends)
//                       outside the mass: coloured tubes with an ink outline (arrows, handles, steam)
//   small loops      -> beads: little gold / pink surfaces with a dot of shine
//   free live text   -> cream manga lettering with an ink outline
// plus at most one sparkle (and its mini dot) in a free corner.
import { parsePath, arclen, bbox, pointInRing, distToPolyline, rng } from '../kernel/geom.mjs'
import * as K from './_anime-kit.mjs'
import * as P from './_anime-prim.mjs'
const resample = P.resamplePts
import { cast } from './_anime-tune.mjs'
import * as FF from './_anime-field.mjs'
import { splitText, textInfo } from './_live-text.mjs'
import { LIVE, TEXT_W, FREE_TEXT, inkText } from './_anime-live.mjs'

const polyArea = r => { let a = 0; for (let i = 0; i < r.length; i++) { const p = r[i], q = r[(i + 1) % r.length]; a += p[0] * q[1] - q[0] * p[1] } return Math.abs(a / 2) }
const inSet = (p, rings) => rings.reduce((a, r) => pointInRing(p, r) ? !a : a, false)
const distSet = (p, rings) => rings.reduce((m, r) => Math.min(m, distToPolyline(p, r, true)), Infinity)
// field probes: fast distance / inside queries on the 0.1u grid
const sampler = G => p => {
  const i = Math.max(0, Math.min(FF.N - 1, Math.round(p[0] / FF.H))), j = Math.max(0, Math.min(FF.N - 1, Math.round(p[1] / FF.H)))
  return G[j * FF.N + i]
}
const lineProbe = (lines, reach) => sampler(FF.strokes(lines.map(l => ({ pts: l.pts, closed: l.closed })), 0, reach))
const fracIn = (pts, ring) => pts.length ? pts.filter(p => pointInRing(p, ring)).length / pts.length : 0

const LIVE_FACE = new Set(['timer-ring'])

export function auto(icon, opt = {}) {
  const { icon: ic, free } = splitText(icon)
  // live icons borrow the colours (and, for the big families, the drawing) of their static sibling
  const spec = icon.params && LIVE[icon.name] ? LIVE[icon.name](icon.params || {}, icon) : null
  const col = { ...cast(icon), ...(spec && spec.col) }
  const R = rng('anime:' + (icon.name || ''))

  // ---- read
  const items = []
  for (const p of ic.paths || []) for (const s of p.subs || []) {
    if (!s.pts || !s.pts.length) continue
    const closed = !!s.closed && s.pts.length > 2
    items.push({ pts: s.pts, closed, plate: p.plate || 'K', text: !!textInfo(p), ch: textInfo(p)?.ch, cap: textInfo(p)?.cap, len: arclen(s.pts, closed) })
  }
  const fills = (ic.fills || []).map(f => ({ rings: (f.set && f.set.length ? f.set : (f.subs || []).map(s => s.pts)).filter(r => r && r.length > 2) })).filter(f => f.rings.length)
  const cuts = []
  // a closed glyph (D O 0) is also knocked out of its field; that is lettering, never an inset panel
  const keyOf = pts => pts.length + ':' + pts[0].map(v => v.toFixed(2)).join(',')
  const glyphKeys = new Set((icon.paths || []).filter(p => textInfo(p)).flatMap(p => (p.subs || []).filter(s => s.pts && s.pts.length).map(s => keyOf(s.pts))))
  for (const c of ic.cutouts || []) {
    const rings = (c.subs || []).filter(s => s.closed && s.pts.length > 2 && !glyphKeys.has(keyOf(s.pts))).map(s => s.pts)
    if (rings.length) cuts.push(rings)
  }

  // ---- fit: scale about the centre so the outline and a sparkle have room
  const all = [...items.flatMap(i => i.pts), ...fills.flatMap(f => f.rings.flat())]
  const b = all.length ? bbox(all) : { x0: 2, y0: 2, x1: 22, y1: 22 }
  const reach = 1.55
  let s = opt.scale ?? 0.9
  for (const [v, lo] of [[b.x0, true], [b.y0, true], [b.x1, false], [b.y1, false]]) {
    const d = v - 12
    if (lo && d < 0) s = Math.min(s, (12 - 0.6 - reach) / -d)
    if (!lo && d > 0) s = Math.min(s, (24 - 0.6 - reach - 12) / d)
  }
  s = Math.max(0.7, s)
  const T = p => [12 + (p[0] - 12) * s, 12 + (p[1] - 12) * s]
  const X = pts => pts.map(T)
  for (const it of items) it.pts = X(it.pts)
  // live lettering knows its fitted cap height (textW(): a small cap with a counter is cut a hair lighter)
  for (const it of items) if (it.text) it.capS = it.cap * s
  for (const f of fills) f.rings = f.rings.map(X)
  for (let i = 0; i < cuts.length; i++) cuts[i] = cuts[i].map(X)

  // ---- a live family drawn by hand (_anime-live.mjs): it gets the fitted skeleton and draws it itself
  if (spec && spec.draw) {
    const freeL = free.flatMap(g => { try { return parsePath(g.d).map(sp => ({ pts: X(sp.pts), closed: !!sp.closed, cap: g.cap, ch: g.ch, capS: g.cap * s })) } catch { return [] } })
    const ctx = {
      s, T, X, S: sh => P.scale(sh, s, s, 12, 12), params: icon.params || {}, col,
      fills: fills.map(f => f.rings), cuts,
      lines: items.filter(i => !i.text), texts: items.filter(i => i.text), free: freeL,
    }
    try { const ops = spec.draw(ctx); if (ops && ops.length) return ops } catch (e) {
      if (typeof process !== 'undefined' && process.env && process.env.ANIME_DEBUG) console.error('[anime] live ' + icon.name + ' threw:', e)
    }
  }

  // ---- S plate: badges, glyphs, slashes
  const sig = items.filter(i => i.plate === 'S' && !i.text)
  const base = items.filter(i => !sig.includes(i))
  const closedS = sig.filter(l => l.closed)
  const badges = closedS.filter(l => !closedS.some(o => o !== l && polyArea(o.pts) > polyArea(l.pts) && fracIn(l.pts, o.pts) > 0.9))
  const inBadge = g => badges.find(bd => bd !== g && fracIn(g.pts, bd.pts) > 0.5)
  const straight = l => l.pts.length >= 2 && l.pts.every(p => distToPolyline(p, [l.pts[0], l.pts.at(-1)]) <= 0.08)
  const slashes = sig.filter(l => !l.closed && straight(l) && l.len >= 8 && !inBadge(l))
  const glyphs = sig.filter(l => !badges.includes(l) && !slashes.includes(l))

  // ---- fills -> plates
  const probes = new Map()
  const near = (pts, lines, tol) => {
    if (!lines.length) return 0
    const key = lines
    if (!probes.has(key)) probes.set(key, lineProbe(lines, 0.8))
    const pr = probes.get(key)
    const Q = pts.filter((_, i) => i % 2 === 0)
    return Q.filter(p => pr(p) < tol).length / Math.max(1, Q.length)
  }
  const aL = base.filter(l => l.plate === 'A'), kL = base.filter(l => l.plate === 'K')
  const surfs = []
  for (const f of fills) {
    const pts = f.rings.flat()
    if (sig.length && near(pts, sig, 0.5) > 0.5) { f.plate = 'S'; continue } // a badge fill: drawn with the badge
    const a = near(pts, aL, 0.5), k = near(pts, kL, 0.5)
    f.plate = a > 0.6 && a > k ? 'A' : 'K'
    f.area = f.rings.reduce((m, r) => m + polyArea(r), 0)
    surfs.push(f)
  }
  // K first (largest first), then A; keeps the author's order within a plate
  const order = [...surfs.filter(f => f.plate === 'K'), ...surfs.filter(f => f.plate === 'A')]
  const mass = order.flatMap(f => f.rings)
  const massF = mass.length ? sampler(FF.region(mass, 1.6)) : () => 1.6
  const mIn = p => massF(p) < 0, mDist = p => Math.abs(massF(p))

  // small closed loops that are not filled become beads
  const isBead = l => { if (!l.closed || l.text) return false; const bb = bbox(l.pts); return Math.max(bb.w, bb.h) <= 2.9 }   // a letter's bowl (B D O) is never a bead
  const beads = base.filter(isBead)
  const lines = base.filter(l => !beads.includes(l))

  // ---- lines: inside / on the mass -> ink; outside -> tubes
  const panels = cuts.filter(rings => {
    const bb = bbox(rings.flat())
    return bb.w > 1.6 && bb.h > 1.6 && (!mass.length || rings.flat().filter(p => mIn(p) || mDist(p) < 0.6).length > rings.flat().length * 0.92)
  })
  // cutouts that run out of the mass are knockouts that shape it (gaps between wifi arcs, slots): cut them
  const knock = cuts.filter(rs => !panels.includes(rs) && mass.length && rs.flat().some(p => mIn(p)))
  if (knock.length) for (const f of order) f.rings = P.cut(f.rings, knock.flat())
  const inks = [], tubesBack = [], tubesFront = []
  for (const l of lines) {
    if (l.text) { inks.push(l); continue }
    if (!mass.length) { tubesFront.push(l); continue }
    const d = l.len > 0.3 ? resample(l.pts, 0.25, l.closed) : l.pts
    const outside = d.filter(p => !mIn(p) && mDist(p) > 1.0).length / d.length
    if (outside < 0.45) { inks.push(l); continue }
    const crosses = d.filter(p => mIn(p) && mDist(p) > 0.6).length / d.length > 0.2
    ;(crosses ? tubesFront : tubesBack).push(l)
  }

  // ---- compose the ops
  const ops = []
  const roleOf = plate => plate === 'A' ? col.second : col.main
  const big = order.length ? Math.max(...order.map(f => f.area)) : 0
  const tubeRole = pl => pl === 'A' && mass.length ? col.second : col.tube
  // tubes that only touch the mass tuck behind it
  for (const pl of ['K', 'A']) {
    const ls = tubesBack.filter(l => l.plate === pl)
    if (ls.length) ops.push(K.tube(ls, tubeRole(pl), { part: pl === 'A' ? 'a' : 'k' }))
  }
  // a live icon that letters a value on its face (a timer's count): the long shine streak would cross the figures
  // (white on white: a counter opens into it), so its face takes the small dot of shine instead
  const liveFace = !!icon.params && LIVE_FACE.has(icon.name)
  order.forEach((f, i) => {
    const role = roleOf(f.plate)
    // second and later K masses that sit on the first take the second colour when they are small
    const r2 = f.plate === 'K' && i > 0 && f.area < big * 0.35 ? col.second : role
    if (f.rings.length) ops.push(K.surf(f.rings, r2, { part: f.plate === 'A' ? 'a' : 'k', shine: f.area > 5 && !liveFace ? 'streak' : 'dot', rim: f.area > 90 }))
  })
  // panels from closed cutouts
  for (const rings of panels) {
    const pts = rings.flat()
    const a = near(pts, aL, 0.6) > 0.5
    const glass = col.panel === 'ink'
    const outer = rings.filter(r => !rings.some(o => o !== r && fracIn(r, o) > 0.9))
    const holes = rings.filter(r => !outer.includes(r))
    ops.push(K.surf(outer, col.panel, { part: a ? 'a' : 'k', inset: true, ol: 0.38, olShift: 0.5, shine: glass && !holes.length ? 'glass' : 'none', shade: glass ? 0 : 1 }))
    // a ring-shaped cutout (a lens): the hole is the glass, with a star glint
    if (holes.length) ops.push(K.surf(holes, glass ? 'c1' : col.second, { part: a ? 'a' : 'k', inset: true, ol: 0, shine: 'glint', shineSize: 0.8 }))
  }
  // ink line art (K, then A). Runs that trace a surface's edge are dropped: the surface's own
  // outline (thin on the lit side, heavy on the shadow side) is the line art there.
  const edges = [...mass, ...panels.flat()]
  const edgeP = edges.length ? lineProbe(edges.map(r => ({ pts: r, closed: true })), 0.6) : null
  const art = inks.filter(l => !l.text).flatMap(l => offEdge(l, edgeP))
  for (const pl of ['K', 'A']) {
    const ls = art.filter(l => l.plate === pl)
    // a live icon's A line art is its reading (a needle, a hand): drawn a weight heavier than detail
    if (ls.length) ops.push(K.ink(ls, { part: pl === 'A' ? 'a' : 'k', ...(icon.params && pl === 'A' ? { w: 1.15 } : {}) }))
  }
  for (const pl of ['K', 'A']) {
    const ls = tubesFront.filter(l => l.plate === pl)
    if (ls.length) ops.push(K.tube(ls, tubeRole(pl), { part: pl === 'A' ? 'a' : 'k' }))
  }
  // beads
  for (const l of beads) {
    const c = centroid(l.pts), bb = bbox(l.pts)
    // a bead never sits on lettering (a tag's eyelet above its word): it shrinks to keep 0.5u clear of it
    const tPts = items.filter(i => i.text).flatMap(i => i.pts)
    const tGap = tPts.length ? Math.min(...tPts.map(q => Math.hypot(q[0] - c[0], q[1] - c[1]))) - TEXT_W / 2 - 0.55 : Infinity
    const r = Math.max(0.7, Math.min(Math.max(1.1, Math.max(bb.w, bb.h) / 2 + 0.8), tGap))
    const onMass = mass.length && mIn(c)
    ops.push(K.surf(P.circle(c[0], c[1], r), onMass ? (col.main === 'c3' ? 'c2' : 'c3') : col.second, { part: l.plate === 'A' ? 'a' : 'k', shine: 'dot', ol: 0.45, olShift: 0.6 }))
  }
  // badges, glyphs, slashes (S)
  for (const bd of badges) {
    ops.push(K.moat(bd.pts.length > 2 ? [bd.pts] : [], 0.75))
    // a live count badge is matte: its shine dot would sit on the figures and blur them at 24px
    ops.push(K.surf([bd.pts], col.badge, { part: 's', shine: icon.params ? 'none' : 'dot', ol: 0.5 }))
  }
  const gIn = glyphs.filter(g => inBadge(g)), gOut = glyphs.filter(g => !inBadge(g))
  if (gIn.length) ops.push(K.ink(gIn, { part: 's', role: 'tint', w: 1.3, taper: false, shift: 0 }))
  if (gOut.length) ops.push(K.tube(gOut, col.badge, { part: 's', w: 1.45 }))
  if (slashes.length) {
    ops.push(K.moat(P.stroke(slashes.map(l => ({ pts: l.pts, closed: false })), 1.5 + 2 * 0.5), 0.7))
    ops.push(K.tube(slashes, 'accent', { part: 's', w: 1.5 }))
  }
  // live text printed on a field: ink on the body, and navy ink on a coral count badge too (cream on coral is too
  // soft at 24px: a 5 -> 9 change barely shows)
  const texts = inks.filter(l => l.text)
  const onBadge = l => badges.some(bd => fracIn(l.pts, bd.pts) > 0.5)
  const tB = texts.filter(onBadge), tK = texts.filter(l => !onBadge(l))
  // the field under the lettering decides its colour: navy on light fields (cream, gold, pink, green), white on the
  // mid and dark ones (sky, coral, violet, navy glass)
  const fieldRole = pt => {
    for (const rings of [...panels].reverse()) if (inSet(pt, rings)) return col.panel
    let r = null
    order.forEach((f, i) => { if (f.rings.length && inSet(pt, f.rings)) r = f.plate === 'K' && i > 0 && f.area < big * 0.35 ? col.second : roleOf(f.plate) })
    return r
  }
  if (tK.length) {
    const c = centroid(tK.flatMap(l => l.pts))
    const role = ['c1', 'accent', 'shadow', 'ink'].includes(fieldRole(c)) ? 'shine' : 'ink'
    ops.push(...inkText(tK, { part: 'a', role }))
  }
  if (tB.length) ops.push(...inkText(tB, { part: 's', role: 'ink' }))
  // free live text
  if (free.length) {
    const L = free.flatMap(g => { try { return parsePath(g.d).map(sp => ({ pts: X(sp.pts), closed: !!sp.closed, ch: g.ch, capS: g.cap * s })) } catch { return [] } })
    // solid lettering at the font's weight (TEXT_W, _anime-live.mjs; an outlined cream letter closes its counters),
    // in coral: the one anime colour that holds the same contrast on a light page and a dark one (navy ink vanishes
    // on dark, cream vanishes on light)
    if (L.length) ops.push(...inkText(L, { part: 'a', role: FREE_TEXT }))
  }
  // one sparkle in a free corner (not on dense layout / text glyph icons, and not on every icon)
  const quiet = ['layout', 'text'].includes(icon.category) || !!icon.params
  // only on things that are glossy or magical by nature: elsewhere a sparkle reads as "new / AI / magic"
  const magic = /(^|-)(gem|diamond|star|stars|sparkle|sparkles|wand|magic|trophy|crown|coin|coins|medal|award|ring|crystal)(-|$)/.test(String(icon.name || ''))
  if (!quiet && magic && R() < 0.8) ops.push(K.sparkle({ r: 2.3, min: 1.4 }))
  return ops
}

function centroid(pts) { let x = 0, y = 0; for (const p of pts) { x += p[0]; y += p[1] } return [x / pts.length, y / pts.length] }

// the parts of a line that do not run along an edge of the given rings
function offEdge(l, probe) {
  if (!probe) return [l]
  const pts = l.len > 0.3 ? resample(l.pts, 0.25, l.closed) : l.pts
  const on = pts.map(p => probe(p) < 0.4)
  if (!on.some(Boolean)) return [l]
  const runs = []
  let cur = []
  const n = pts.length
  // for a closed line start at an on-edge point so runs do not wrap
  const start = l.closed ? Math.max(0, on.indexOf(true)) : 0
  for (let k = 0; k < n; k++) {
    const i = (start + k) % n
    if (!on[i]) cur.push(pts[i])
    else { if (cur.length) runs.push(cur); cur = [] }
  }
  if (cur.length) runs.push(cur)
  return runs.filter(r => r.length > 1 && arclen(r) >= 0.7).map(r => ({ ...l, pts: r, closed: false, len: arclen(r) }))
}
