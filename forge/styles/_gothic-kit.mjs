// GOTHIC kit: the style's vocabulary, passed to every redraw as `g`.
//
//   g.<shape>(...)      every primitive of _gothic-prim.mjs (fields: circle, rr, lancet, foil,
//                       crenel, spire, gear, star, stroke, seg, ring, arc, path, union, cut ...)
//   g.<material>(F, o)  scene parts: stone glass gilt iron recess lead shine cut deco
//   g.<family>(...)     composed pieces: pane, rose, window, badge, glyph, slash, finial,
//                       spear fleur corbel (terminals for open strokes), bead boss (jewels),
//                       pinnacle, studs, curl, auto
//
// Parts are plain objects { m, F, plate, ... } painted in order by _gothic-paint.mjs.
// Every part takes o.plate ('K' default, 'A', 'S', 'deco') for motion tagging.
import * as P from './_gothic-prim.mjs'
import { auto as autoParts, mainRole, COMPANION, MEDAL } from './_gothic-auto.mjs'
import { circlePts } from './_gothic-paint.mjs'

const o0 = o => o || {}

// ---- materials --------------------------------------------------------------
// stone: carved limestone. o.ashlar {h, w, x, y0, y1} lays mortar courses on a slab,
// o.ticks [[p,q],...] cuts block joints across a tube, o.thin for mullions, o.role to recolour
const stone = (F, o) => ({ m: 'stone', F, plate: 'K', ...o0(o) })
// glass: stained glass of role (c1 ruby, c2 sapphire, c3 gold, c4 emerald).
// o.tracery 'quarry' | 'rose' | 'lancet' | 'medallion' | 'none' | [polylines];
// o.medal role of the medallion; o.n spokes (rose); o.s lattice pitch; o.at {c:[x,y], r}
// fixes the tracery centre; o.glow / o.dark / o.deep tune the light; o.glint false
const glass = (F, role = 'c2', o) => ({ m: 'glass', F, role, plate: 'K', tracery: 'none', medal: MEDAL[role] || 'c3', ...o0(o) })
const gilt = (F, o) => ({ m: 'gilt', F, plate: 'K', ...o0(o) })
const iron = (F, o) => ({ m: 'iron', F, plate: 'K', ...o0(o) })
// a deep opening; o.glow role lights it from within (a candle behind a door)
const recess = (F, o) => ({ m: 'recess', F, plate: 'K', ...o0(o) })
// free lead lines: polylines (o.w width, o.role colour)
const lead = (lines, o) => ({ m: 'lead', lines, plate: 'K', ...o0(o) })
// a flat highlight (wm-shine), o.op
const shine = (F, o) => ({ m: 'shine', F, plate: 'K', ...o0(o) })
// knock F out of every part painted before it (moats)
const cut = F => ({ m: 'cut', F })
// mark parts (or a list) as decoration: still while the object moves, no cast shadow
const deco = (...parts) => parts.flat(Infinity).filter(Boolean).map(p => ({ ...p, plate: 'deco' }))
// mark parts as ground: architecture the object sits in (belfry, niche, arcade); it stays
// still while the object moves (tagged wm-shadow) but still casts its shadow
const ground = (...parts) => parts.flat(Infinity).filter(Boolean).map(p => p.m === 'cut' ? p : { ...p, plate: 'ground' })
// re-plate parts (or a list)
const plate = (pl, ...parts) => parts.flat(Infinity).filter(Boolean).map(p => p.m === 'cut' ? p : { ...p, plate: pl })

// ---- composed pieces ----------------------------------------------------------
// a shape glazed inside its own stone frame of width w: [stone rim, glass]
function pane(F, role = 'c2', o = {}) {
  const w = o.frame ?? 1.5
  const inner = P.shrink(F, w)
  const out = []
  if (o.ashlar || o.ticks) out.push(stone(P.rim(F, w), { plate: o.plate, ashlar: o.ashlar, ticks: o.ticks }))
  else out.push(stone(P.rim(F, w), { plate: o.plate }))
  if (!P.isEmpty(inner)) out.push(glass(inner, role, { tracery: o.tracery || 'quarry', plate: o.plate, ...o.glass }))
  return out
}
// a pointed lancet window: stone surround, glass with lancet bars or a medallion
const window = (x0, top, x1, bottom, role = 'c2', o = {}) => pane(P.lancet(x0, top, x1, bottom, o.k ?? 1), role, { frame: o.frame ?? 1.2, tracery: o.tracery || 'none', plate: o.plate, glass: o.glass })
// a rose window: stone ring, glass with n spokes round a medallion of role medal
function rose(cx, cy, r, role = 'c2', o = {}) {
  const w = o.frame ?? Math.max(0.9, r * 0.22)
  return [
    stone(P.ring(cx, cy, r - w / 2, w), { plate: o.plate }),
    glass(P.circle(cx, cy, r - w + 0.05), role, { tracery: 'rose', n: o.n || (r > 5 ? 12 : 8), medal: o.medal || MEDAL[role], at: { c: [cx, cy], r: r - w }, plate: o.plate, rot: o.rot }),
  ]
}
// a glyph as a field: plus minus x check bang dot
function glyph(kind, cx, cy, s = 1, w = 1.5) {
  const L = s * 2.4
  switch (kind) {
    case 'plus': return P.union(P.seg(cx - L, cy, cx + L, cy, w), P.seg(cx, cy - L, cx, cy + L, w))
    case 'minus': return P.seg(cx - L, cy, cx + L, cy, w)
    case 'x': { const d = L * 0.75; return P.union(P.seg(cx - d, cy - d, cx + d, cy + d, w), P.seg(cx - d, cy + d, cx + d, cy - d, w)) }
    case 'check': return P.stroke([[cx - L * 0.95, cy + 0.05 * s], [cx - L * 0.3, cy + L * 0.65], [cx + L * 0.95, cy - L * 0.6]], w)
    case 'bang': return P.union(P.seg(cx, cy - L, cx, cy + L * 0.25, w), P.dot(cx, cy + L * 0.95, w * 0.55))
    default: return P.dot(cx, cy, L * 0.5)
  }
}
// a badge (S): moat, gilded bezel, ruby (or role) roundel, a stone glyph
function badge(kind, cx = 17.5, cy = 17.5, r = 4.25, role = 'c1', o = {}) {
  const disc = P.circle(cx, cy, r)
  return [
    cut(P.grow(disc, o.moat ?? 1.05)),
    gilt(disc, { plate: 'S', glint: false }),
    glass(P.shrink(disc, 0.75), role, { plate: 'S', outline: 0.25 }),
    kind ? stone(glyph(kind, cx, cy, r / 4.25, 1.35), { plate: 'S', thin: true, outline: 0.3 }) : null,
  ].filter(Boolean)
}
// the "-off" slash: a gilded bar with a moat
function slash(x0 = 3.5, y0 = 3.5, x1 = 20.5, y1 = 20.5, w = 1.8) {
  const b = P.seg(x0, y0, x1, y1, w)
  return [cut(P.grow(b, 1.05)), gilt(b, { plate: 'S', thin: true })]
}
// a fleur finial (three gilded lobes on a stalk) standing on (cx, y), size s
function finial(cx, y, s = 1, o = {}) {
  const F = P.union(
    P.seg(cx, y, cx, y - 1.6 * s, 0.9 * s),
    P.circle(cx, y - 2.5 * s, 0.85 * s),
    P.circle(cx - 0.95 * s, y - 1.75 * s, 0.6 * s),
    P.circle(cx + 0.95 * s, y - 1.75 * s, 0.6 * s),
  )
  return gilt(F, { thin: true, outline: 0.35, ...o })
}
// a pinnacle: a slender spire with a ball finial
function pinnacle(cx, base, top, w = 2.4, o = {}) {
  return [stone(P.union(P.spire(cx, base, top + 0.8, w), P.circle(cx, top + 0.6, w * 0.28)), { thin: true, ...o })]
}
// gilded studs (rivets) at points
const studs = (pts, r = 0.55, o) => gilt(P.union(...pts.map(([x, y]) => P.circle(x, y, r))), { thin: true, outline: 0.3, glint: false, ...o0(o) })
// a wrought-iron curl (scroll): a spiral of turns t from (cx, cy) radius r, direction dir (1 cw, -1 ccw)
function curlPts(cx, cy, r, a0 = 0, turns = 1.1, dir = 1) {
  const pts = []
  const n = Math.ceil(turns * 40)
  for (let k = 0; k <= n; k++) {
    const t = k / n, a = (a0 + dir * t * turns * 360) * Math.PI / 180, q = r * (1 - 0.72 * t)
    pts.push([cx + q * Math.cos(a), cy + q * Math.sin(a)])
  }
  return pts
}
const curl = (cx, cy, r, a0, turns, dir, w = 0.9, o) => gilt(P.stroke(curlPts(cx, cy, r, a0, turns, dir), w), { thin: true, outline: 0.32, glint: false, ...o0(o) })

// ---- architectural terminals and jewels (for open strokes: arrows, chevrons, bars, lists) ----
const RAD = Math.PI / 180
const rot = (x, y, a) => ([u, v]) => [x + u * Math.cos(a * RAD) - v * Math.sin(a * RAD), y + u * Math.sin(a * RAD) + v * Math.cos(a * RAD)]
// an ogee spear head with its base centred on (x, y), pointing at angle a (deg, 0 = east), size s
// (s 1: 4u long, 2.9u wide): the sides swell, then run concave into a sharp point
function spear(x, y, a = 0, s = 1) {
  const T = rot(x, y, a), pts = []
  // half-width: full at the base, swelling, then a concave run into the point (an ogee)
  for (let k = 0; k <= 16; k++) { const t = k / 16, w = 1.15 * s * Math.pow(1 - t, 1.6) * (1 + 3 * t); pts.push([t * 4 * s, -w]) }
  const side = pts.slice(0, -1)
  return P.poly([...side, [4 * s, 0], ...side.reverse().map(([u, v]) => [u, -v])].map(T))
}
// a fleur (trefoil) terminal: three lobes on (x, y) facing angle a, size s (s 1: 3u across)
function fleur(x, y, a = 0, s = 1) {
  const T = rot(x, y, a)
  return P.union(P.circle(...T([1.2 * s, 0]), 0.82 * s), P.circle(...T([0.15 * s, -0.95 * s]), 0.68 * s), P.circle(...T([0.15 * s, 0.95 * s]), 0.68 * s), P.circle(...T([0, 0]), 0.7 * s))
}
// a stone corbel: a block stepping out of a wall at (x, y) towards angle a, size s
function corbel(x, y, a = 0, s = 1) {
  const T = rot(x, y, a)
  return P.poly([[0, -1.4 * s], [1.3 * s, -1.4 * s], [1.3 * s, -0.4 * s], [0.7 * s, 0.6 * s], [0, 1.1 * s]].map(T))
}
// a jewel: a glass cabochon of role in a gilt bezel (studs that carry colour)
const bead = (cx, cy, r = 1, role = 'c1', o = {}) => [
  gilt(P.circle(cx, cy, r), { thin: true, glint: false, outline: 0.32, plate: o.plate }),
  glass(P.circle(cx, cy, Math.max(0.35, r - 0.42)), role, { outline: 0.18, glow: 0.3, glint: false, plate: o.plate }),
]
// a quatrefoil boss of gilt with a glass heart (list bullets, terminals, centres)
const boss = (cx, cy, r = 1.5, role = 'c1', o = {}) => [
  gilt(foilF4(cx, cy, r), { thin: true, glint: false, outline: 0.32, plate: o.plate }),
  glass(P.circle(cx, cy, r * 0.42), role, { outline: 0.18, glow: 0.3, glint: false, plate: o.plate }),
]
const foilF4 = (cx, cy, r) => P.foil(cx, cy, r, 4, -45)

// the automatic composition of this icon (to extend rather than replace it)
const auto = icon => autoParts(icon)

export const G = Object.freeze({
  ...P,
  stone, glass, gilt, iron, recess, lead, shine, cut, deco, ground, plate,
  pane, window, rose, glyph, badge, slash, finial, pinnacle, studs, curl, curlPts, auto,
  spear, fleur, corbel, bead, boss,
  circlePts, mainRole, COMPANION, MEDAL,
})
