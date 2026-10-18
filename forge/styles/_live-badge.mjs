// Live-icon COUNT BADGES for outline styles (forge/DYNAMIC.md, forge/dynamic/_parts-counts.mjs).
//
// A count icon's badge is one closed path with the id "badge:<kind>" (plate S) plus the glyphs of its number
// (plate S text). Filled styles already show it as a solid disc with the number knocked out (fills + cutouts).
// An outline style would stroke it as a thin ring with a stroked number crammed inside: at 24px that reads as a
// coin, not a notification. Every UI draws notification badges SOLID, so outline styles do too:
//
//   takeBadge(icon)                 -> { icon, badge } | null   icon = the same prepared icon without the badge
//                                      outline, its glyphs, its fill and its cutouts; badge = { d, glyphs: [pts] }
//   badgeNodes(badge, { grow, knock, paint, cls })
//                                   -> [['path', {...}]] the badge as ONE filled region: the outline grown by `grow`
//                                      (half the style's stroke, so the footprint matches the stroked outline) minus
//                                      the number stroked at `knock` with round caps
//   withSolidBadge(render, opts)    -> render(icon) that draws the rest of the icon with `render` and appends the
//                                      solid badge (no-op for icons without a badge: every static icon)
// Deterministic; kernel booleans only.
import { parsePath, polyD } from '../kernel/geom.mjs'
import { unionSets } from '../kernel/bool.mjs'
import * as F from './_solid-field.mjs'

const isBadge = p => /^badge:/u.test(p?.id || '')
const isGlyph = p => /^text:/u.test(p?.id || '')

function ringOf(d) {
  const subs = parsePath(d, 0.1)
  return subs.length ? subs[0].pts : null
}
function inside([x, y], ring) {
  let c = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j]
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c
  }
  return c
}
const allIn = (subs, ring) => subs.every(s => s.pts.every(p => inside(p, ring)))

export function takeBadge(icon) {
  const b = (icon?.paths || []).find(isBadge)
  if (!b) return null
  const ring = ringOf(b.d)
  if (!ring) return null
  const glyphs = icon.paths.filter(p => p.plate === 'S' && isGlyph(p) && allIn(p.subs || parsePath(p.d), ring))
  const drop = new Set([b, ...glyphs].map(p => p.id))
  const fills = (icon.fills || []).filter(f => f.d !== b.d)
  const cutouts = (icon.cutouts || []).filter(c => !allIn(c.subs || parsePath(c.d), ring))
  const rest = {
    ...icon,
    paths: icon.paths.filter(p => !drop.has(p.id)),
    lines: (icon.lines || []).filter(l => !drop.has(l.pathId)),
    fills, cutouts,
    fillSet: fills.length ? unionSets(fills.map(f => f.set)) : [],
  }
  // (a glyph sub the parser marks closed, a D or an O drawn as one stroke, keeps its closing segment: knocked out
  // open it would print as a D with a gap in its corner)
  return { icon: rest, badge: { d: b.d, ring, glyphs: glyphs.flatMap(g => (g.subs || parsePath(g.d)).map(s => s.closed && s.pts.length > 2 ? [...s.pts, s.pts[0]] : s.pts)) } }
}

export function badgeNodes(badge, { grow = 0.875, knock = 1.35, paint = 'currentColor', cls = 'wm-s' } = {}) {
  // signed-distance field (the one Solid knocks its badges out with): robust at the font's cusps and joins
  F.setClip(null)
  const disc = F.union(F.region([badge.ring]), F.strokes([{ pts: badge.ring, closed: true }], grow * 2))
  if (badge.glyphs.length) F.subtract(disc, F.strokes(badge.glyphs.map(pts => ({ pts, closed: false })), knock))
  const d = F.trace(disc, 0.03).map(l => polyD(l, true)).join('')
  return d ? [['path', { d, fill: paint, stroke: 'none', 'fill-rule': 'evenodd', ...(cls ? { class: cls } : {}) }]] : []
}

// Live SOLID MARKS (path id "solid:<name>": an earned rating star, a half star's filled half): outline styles fill
// them instead of stroking their outline, with the stroked footprint (outline grown by `grow`)
// ("fill:<name>" marks are filled to their exact outline, no stroke grow: small shapes set close together, like a
// row of rating stars, keep their gaps)
export function takeSolids(icon) {
  const sol = (icon?.paths || []).filter(p => /^(solid|fill):/u.test(p.id || ''))
  if (!sol.length) return null
  const drop = new Set(sol.map(p => p.id))
  const rest = { ...icon, paths: icon.paths.filter(p => !drop.has(p.id)), lines: (icon.lines || []).filter(l => !drop.has(l.pathId)) }
  return { icon: rest, solids: sol }
}
export function solidNodes(solids, { grow = 0.875, paint = 'currentColor' } = {}) {
  const out = []
  for (const p of solids) {
    F.setClip(null)
    const subs = (p.subs || parsePath(p.d)).filter(s => s.pts.length > 2)
    if (!subs.length) continue
    const g = /^fill:/u.test(p.id || '') ? 0.2 : grow
    const G = F.union(F.region(subs.map(s => s.pts)), F.strokes(subs.map(s => ({ pts: s.pts, closed: true })), g * 2))
    const d = F.trace(G, 0.03).map(l => polyD(l, true)).join('')
    const cls = p.plate === 'A' ? 'wm-a' : p.plate === 'S' ? 'wm-s' : null
    if (d) out.push(['path', { d, fill: paint, stroke: 'none', ...(cls ? { class: cls } : {}) }])
  }
  return out
}

export function withSolidBadge(render, opts = {}) {
  return icon => {
    const o = typeof opts === 'function' ? opts(icon) : opts
    const s = takeSolids(icon)
    const base = s ? s.icon : icon
    const t = takeBadge(base)
    const nodes = t ? [...render(t.icon), ...badgeNodes(t.badge, o)] : render(base)
    return s ? [...nodes, ...solidNodes(s.solids, { grow: o.grow ?? 0.875, paint: o.solidPaint || 'currentColor' })] : nodes
  }
}

// Live LEVEL SLABS (a battery's charge bar, _parts-power.mjs slab()): one open sub of axis-aligned rows that line
// styles stroke into a solid bar; the skeleton also leaves the bar standing as an island in the hollowed body
// (cutouts). A style that paints islands as their own fill draws the bar twice (a grille of etched rows over it):
// such a style takes the slab paths out and lets the island be the bar.
export const isSlab = p => {
  const s = (p?.subs || [])
  if (p?.plate !== 'A' || s.length !== 1 || s[0].closed || s[0].pts.length < 6) return false
  const q = s[0].pts
  return q.every((a, i) => i === 0 || Math.abs(a[0] - q[i - 1][0]) < 1e-6 || Math.abs(a[1] - q[i - 1][1]) < 1e-6)
}
export function dropSlabs(icon) {
  if (!icon?.params) return icon
  const drop = new Set((icon.paths || []).filter(isSlab).map(p => p.id))
  if (!drop.size) return icon
  return { ...icon, paths: icon.paths.filter(p => !drop.has(p.id)), lines: (icon.lines || []).filter(l => !drop.has(l.pathId)) }
}
// ...or swaps each slab for a closed rounded bar outline over the slab's ink box (a style that paints a closed part
// ring as its own coloured part: the charge in the part colour, no rows)
export function slabsToBars(icon, grow = 0.875) {
  if (!icon?.params) return icon
  let hit = false
  const paths = (icon.paths || []).map(p => {
    if (!isSlab(p)) return p
    hit = true
    const q = p.subs[0].pts, xs = q.map(a => a[0]), ys = q.map(a => a[1])
    const x0 = Math.min(...xs) - grow, x1 = Math.max(...xs) + grow, y0 = Math.min(...ys) - grow, y1 = Math.max(...ys) + grow
    const r = Math.min(0.75, (x1 - x0) / 2, (y1 - y0) / 2), f = v => Math.round(v * 100) / 100
    const d = `M${f(x0 + r)} ${f(y0)} H${f(x1 - r)} A${r} ${r} 0 0 1 ${f(x1)} ${f(y0 + r)} V${f(y1 - r)} A${r} ${r} 0 0 1 ${f(x1 - r)} ${f(y1)} H${f(x0 + r)} A${r} ${r} 0 0 1 ${f(x0)} ${f(y1 - r)} V${f(y0 + r)} A${r} ${r} 0 0 1 ${f(x0 + r)} ${f(y0)} Z`
    return { ...p, d, subs: parsePath(d) }
  })
  if (!hit) return icon
  return { ...icon, paths, lines: paths.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))) }
}
// ...or takes them out and returns their ink boxes, for a style that paints the charge itself:
//   slabBars(icon) -> { icon, bars: [{ x0, y0, x1, y1 }] }   (bars: the bar's ink box; r 0.75 reads right)
export function slabBars(icon, grow = 0.875) {
  const bars = []
  for (const p of icon?.params ? icon.paths || [] : []) {
    if (!isSlab(p)) continue
    const q = p.subs[0].pts, xs = q.map(a => a[0]), ys = q.map(a => a[1])
    bars.push({ x0: Math.min(...xs) - grow, x1: Math.max(...xs) + grow, y0: Math.min(...ys) - grow, y1: Math.max(...ys) + grow })
  }
  return { icon: bars.length ? dropSlabs(icon) : icon, bars }
}
export const barD = (b, T = p => p, r = 0.75) => {
  const f = v => Math.round(v * 100) / 100, P = (x, y) => T([x, y]).map(f).join(' ')
  const k = T([1, 0])[0] - T([0, 0])[0], R = f(r * k)
  return `M${P(b.x0 + r, b.y0)} L${P(b.x1 - r, b.y0)} A${R} ${R} 0 0 1 ${P(b.x1, b.y0 + r)} L${P(b.x1, b.y1 - r)} A${R} ${R} 0 0 1 ${P(b.x1 - r, b.y1)} L${P(b.x0 + r, b.y1)} A${R} ${R} 0 0 1 ${P(b.x0, b.y1 - r)} L${P(b.x0, b.y0 + r)} A${R} ${R} 0 0 1 ${P(b.x0 + r, b.y0)} Z`
}
