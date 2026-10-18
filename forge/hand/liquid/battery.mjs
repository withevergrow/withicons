// forge/hand/liquid/battery.mjs — a solid slab of clear liquid glass with its terminal nub fused on, and two large
// violet charge cells inlaid in it. The generated battery cut the whole inside of the case away (the skeleton's inner
// outline), leaving a thin pale frame with two tiny pills that vanished on a light background at 16px; here the case
// is one thick glass body like calendar or clock and the cells are big coloured inlays. Same model and light as the
// generator (_liquid-core.mjs); only the geometry is drawn here.
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

// Outlines are centrelines: the model strokes every part as a tube (K 2.6u, A 2.3u) around its fill.
// the case (K): body plus the terminal nub, fused into one piece of glass
const CASE = rr(2, 6, 19, 18, 2.2)
const NUB = 'M21.1 10.5V13.5'
// three charge cells (A): the battery half full, as in every other style
const CELLS = rr(4.9, 9.6, 5.5, 14.4, 0.3) + rr(8.9, 9.6, 9.5, 14.4, 0.3) + rr(12.9, 9.6, 13.5, 14.4, 0.3)

export default function render(icon) {
  const name = (icon && icon.name) || 'battery'
  return build(skeleton(name, [
    { d: CASE, plate: 'K', fill: true },
    { d: NUB, plate: 'K' },
    { d: CELLS, plate: 'A', fill: true },
  ]))
}
