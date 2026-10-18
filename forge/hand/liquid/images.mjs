// forge/hand/liquid/images.mjs — a stack of photos in clear liquid glass: a thick front print with a violet glass
// landscape (two peaks and a sun bead) inlaid in it, and the back print's corner as a separate glass tube with clear
// air between them. The generated drawing ran the front frame tight against the back one and laid the sun ring over a
// thin mountain tube cut through the slab, so the layers muddied into one knot at 16px; here the front print is a
// little smaller, the back frame clears it by a full gap, and the scene is two calm coloured inlays.
// Same model and light as the generator (_liquid-core.mjs); only the geometry is drawn here.
// Motion: frames wm-k, the scene (mountain + sun) wm-a, zooming about (9, 18) like the spec.
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

// the front print (K, one thick slab) and the back print's corner (K, a tube clear of the front by a gap)
const FRONT = rr(2, 9, 17.5, 21, 2)
const BACK = 'M6.5 4.5H19.5A2 2 0 0 1 21.5 6.5V16.5'
// the scene (A): two peaks on a level foot and a sun bead (glass grows 1.15u around these outlines)
const PEAKS = 'M4.75 18.5L8 14.75L10.5 17.25L12.25 15.5L15 18.5Z'
const SUN = 'M15.25 12A1 1 0 1 1 13.25 12A1 1 0 1 1 15.25 12Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'images'
  return build(skeleton(name, [
    { d: FRONT, plate: 'K', fill: true },
    { d: BACK, plate: 'K' },
    { d: PEAKS, plate: 'A', fill: true },
    { d: SUN, plate: 'A', fill: true },
  ]))
}
