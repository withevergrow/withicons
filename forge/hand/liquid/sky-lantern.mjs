// forge/hand/liquid/sky-lantern.mjs: the hexagonal akash kandil in glass: a clear hexagon body with a coloured centre rib, a coloured hook on top and three coloured tassels below. The generated drawing was a tapered box; this keeps the line design.
// Same glass model and light as the generator (_liquid-core.mjs); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

// a prepared skeleton for the liquid model: parts [{ d, plate, fill }]
function skeleton(name, parts) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  return { name, paths, fills, cutouts: [], lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}

const HEX = 'M12 4L18.6 8V13.4L12 17.2L5.4 13.4V8Z'

export default function render(icon) {
  return build(skeleton((icon && icon.name) || 'sky-lantern', [
    { d: HEX, plate: 'K', fill: true },
    { d: 'M12 6.6V15.4', plate: 'A' },
    { d: 'M12 2.2V3.2', plate: 'A' },
    { d: 'M8.8 19L8.4 21.4', plate: 'A' },
    { d: 'M12 19.4V21.8', plate: 'A' },
    { d: 'M15.2 19L15.6 21.4', plate: 'A' },
  ]))
}
