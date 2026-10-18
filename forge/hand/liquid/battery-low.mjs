// forge/hand/liquid/battery-low.mjs — a slab of clear liquid glass for the case, a small violet terminal cap on its
// right and a single short warning-red cell inlaid at the left end: the battery is nearly empty. The earlier hand
// drawing fused the nub into the case (a bulge that made the whole thing a pill) and filled the left end with a fat
// red lozenge; here the case is a plain rounded rectangle, the cap is its own piece of coloured glass and the low
// cell is a narrow bar, so it reads as a battery with one bar left at 16px. Same model and light as the generator
// (_liquid-core.mjs); only the geometry is drawn.
// Motion: case wm-k, cap and cell wm-a (the spec fills / blinks parts.A).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

// a skeleton in the shape the liquid model expects: parts [{ d, plate, fill }], cutouts [d]
function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const rr = (x0, y0, x1, y1, r) => `M${x0 + r} ${y0}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`

// the case (K): a plain rounded rectangle
const CASE = rr(1.6, 7.6, 19, 16.4, 2.2)
// the terminal cap (A): a small tab on the right, its own coloured glass
const CAP = rr(20.4, 10.4, 22, 13.6, 0.8)
// the last cell (S): a narrow warning bar at the left end
const CELL = rr(4, 10, 6.6, 14, 1.1)

// denser glass: the clear tint a step deeper and a firmer hairline, so the case holds on white;
// the cell is retagged wm-a for the spec's parts.A
function firm(nodes, name) {
  const g0 = `wg-liquid-${name}-0`
  const deeper = { [g0]: [0.24, 0.5, 0.76] }
  return nodes.map(n => {
    if (n[0] === 'defs') {
      return ['defs', {}, n[2].map(g => deeper[g[1].id]
        ? [g[0], g[1], g[2].map((s, i) => ['stop', { ...s[1], 'stop-opacity': deeper[g[1].id][i] }])]
        : g)]
    }
    let a = n[1]
    if (a['stroke-width'] === 0.22) a = { ...a, 'stroke-opacity': 0.45, 'stroke-width': 0.26 }
    if (a.class === 'wm-s') a = { ...a, class: 'wm-a' }
    if (a.class === 'wm-a' && a['fill-opacity'] === 0.75) a = { ...a, 'fill-opacity': 0.9 }
    return [n[0], a]
  })
}

export default function render(icon) {
  const name = (icon && icon.name) || 'battery-low'
  const nodes = build(skeleton(name, [
    { d: CASE, plate: 'K', fill: true },
    { d: CAP, plate: 'A', fill: true },
    { d: CELL, plate: 'S', fill: true },
  ]))
  return nodes ? firm(nodes, name) : null
}
