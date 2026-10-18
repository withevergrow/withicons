// forge/hand/liquid/power.mjs — the power symbol as two thick tubes of clear liquid glass: an open ring with a wide
// gap at the top and a thick upright stem standing in it, well clear of the ring's rounded ends. The generated power
// filled the whole ring into a disc (the skeleton's fill) and cut the symbol in as a thin groove, so it read as a
// round button and the symbol drowned in pale glass at 16px. Same model and light as the generator
// (_liquid-core.mjs); only the geometry is drawn here.
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
const r2 = n => Math.round(n * 100) / 100

// Outlines are centrelines: the model strokes every K part as a 2.6u tube around its fill, so a thin band here
// grows into a tube about 3.2u wide (heavier than the 2.6u tubes of an unfilled line).
// ring: centre (12, 12.75), centreline radius 8.3, open 48 degrees either side of the top
const CX = 12, CY = 12.75, R = 8.3, HW = 0.35, OPEN = 48 * Math.PI / 180
function ringD() {
  const pt = (r, a) => [r2(CX + r * Math.sin(a)), r2(CY - r * Math.cos(a))]
  const [ox0, oy0] = pt(R + HW, OPEN), [ox1, oy1] = pt(R + HW, -OPEN)
  const [ix0, iy0] = pt(R - HW, -OPEN), [ix1, iy1] = pt(R - HW, OPEN)
  // outer arc clockwise the long way round, round cap, inner arc back, round cap
  return `M${ox0} ${oy0}A${R + HW} ${R + HW} 0 1 1 ${ox1} ${oy1}A${HW} ${HW} 0 0 1 ${ix0} ${iy0}` +
    `A${R - HW} ${R - HW} 0 1 0 ${ix1} ${iy1}A${HW} ${HW} 0 0 1 ${ox0} ${oy0}Z`
}
// the stem: a fat rounded bar from above the ring down to its centre
const STEM = `M${CX - HW} ${3.4 + HW}A${HW} ${HW} 0 0 1 ${CX + HW} ${3.4 + HW}V${11.8 - HW}A${HW} ${HW} 0 0 1 ${CX - HW} ${11.8 - HW}Z`

export default function render(icon) {
  const name = (icon && icon.name) || 'power'
  return build(skeleton(name, [
    { d: ringD(), plate: 'K', fill: true },
    { d: STEM, plate: 'K', fill: true },
  ]))
}
