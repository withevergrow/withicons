// forge/hand/luxe/scissors.mjs — two distinct open ring handles and a clear X of navy and gold blades (the generated one filled the rings into balls and fused the blades).
// Built with the Luxe recipe (_luxe-core build).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_luxe-core.mjs'

const G = {
  paths: [
    {
      d: 'M9.2 6 A3.3 3.3 0 1 1 2.6 6 A3.3 3.3 0 1 1 9.2 6 Z M8.4 8.2 L20.5 17.2',
      plate: 'K'
    },
    {
      d: 'M9.2 18 A3.3 3.3 0 1 1 2.6 18 A3.3 3.3 0 1 1 9.2 18 Z M8.4 15.8 L20.5 6.8',
      plate: 'A'
    }
  ],
  fills: [],
  cutouts: []
}

function prep(name) {
  const paths = G.paths.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate, subs: parsePath(p.d) }))
  const fills = G.fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(x => x.pts)) } })
  const cutouts = G.cutouts.map(d => ({ d, subs: parsePath(d) }))
  const lines = paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id })))
  return { name, paths, fills, cutouts, lines }
}

export default function render(icon) {
  return build(prep(icon.name))
}
