// forge/hand/liquid/share-2.mjs — the system share sheet: an open-topped glass box whose sides rise around a coloured
// arrow climbing out through the gap. The generated drawing filled the box into one slab, so the arrow merged into
// it and read as upload; here the box stays a hollow outline with a wide open top, the shaft floats free of the floor
// and the arrowhead sits well above the rim. Same glass model and light as the generator (_liquid-core.mjs).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d), fillOnly: p.line === false }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.filter(p => !p.fillOnly).flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}

// centrelines (the glass grows round them)
const BOX = 'M8.6 10H7.2A2.2 2.2 0 0 0 5 12.2V18.8A2.2 2.2 0 0 0 7.2 21H16.8A2.2 2.2 0 0 0 19 18.8V12.2A2.2 2.2 0 0 0 16.8 10H15.4'
const SHAFT = 'M12 15.6V3.4'
const HEAD = 'M8.6 6.8L12 3.4L15.4 6.8'

export default function render(icon) {
  const name = (icon && icon.name) || 'share-2'
  return build(skeleton(name, [
    { d: BOX, plate: 'K' },
    { d: SHAFT, plate: 'A' },
    { d: HEAD, plate: 'A' },
  ]))
}
