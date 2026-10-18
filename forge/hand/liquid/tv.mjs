// forge/hand/liquid/tv.mjs — a clear glass TV with violet rabbit ears: two splayed rods rising from a small domed
// base on the cabinet, each tipped with a bead. The generated antenna met in a sharp point above the case and read
// as a down chevron at 16px; here the rods start apart on a dome, so it reads as an aerial. Same model and light as
// the generator (_liquid-core.mjs); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

// a skeleton in the shape the liquid model expects: parts [{ d, plate, fill }], cutouts [d]
function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => ({ d: p.d, subs: parsePath(p.d) }))
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}

const disc = (x, y, r) => `M${x - r} ${y}A${r} ${r} 0 1 0 ${x + r} ${y}A${r} ${r} 0 1 0 ${x - r} ${y}Z`
const CASE = 'M4.5 8H19.5A2.5 2.5 0 0 1 22 10.5V18A2.5 2.5 0 0 1 19.5 20.5H4.5A2.5 2.5 0 0 1 2 18V10.5A2.5 2.5 0 0 1 4.5 8Z'
const SCREEN = 'M5.5 10.5H18.5A1 1 0 0 1 19.5 11.5V17A1 1 0 0 1 18.5 18H5.5A1 1 0 0 1 4.5 17V11.5A1 1 0 0 1 5.5 10.5Z'
const DOME = 'M10 8A2 2 0 0 1 14 8Z'
const RODS = 'M11.25 6.75L7.25 3M12.75 6.75L16.75 3'
const TIPS = disc(6.75, 2.5, 0.6) + disc(17.25, 2.5, 0.6)

export default function render(icon) {
  const name = (icon && icon.name) || 'tv'
  return build(skeleton(name, [
    { d: CASE, plate: 'K', fill: true },
    { d: DOME, plate: 'A', fill: true },
    { d: RODS, plate: 'A' },
    { d: TIPS, plate: 'A', fill: true },
  ], [SCREEN]))
}
