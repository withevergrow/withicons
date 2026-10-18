// forge/hand/luxe/tombstone.mjs — a rounded sapphire headstone set on a plinth, with a polished gold cross inlay
// instead of the two bars (which read as an equals sign) and without the gold grass stubs (which read as handles).
// Built with the Luxe recipe (_luxe-core build).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_luxe-core.mjs'

const G = {
  paths: [
    { d: 'M6 19.5 V9.5 A6 6 0 0 1 18 9.5 V19.5', plate: 'K' },
    { d: 'M4 19.5 H20 A1 1 0 0 1 20 21.5 H4 A1 1 0 0 1 4 19.5 Z', plate: 'K' },
    { d: 'M12 7.25 V15.75 M9.25 10.25 H14.75', plate: 'A' },
  ],
  fills: [
    'M6 19.5 V9.5 A6 6 0 0 1 18 9.5 V19.5 Z',
    'M4 19.5 H20 A1 1 0 0 1 20 21.5 H4 A1 1 0 0 1 4 19.5 Z',
  ],
  cutouts: [],
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
