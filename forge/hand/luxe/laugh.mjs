// forge/hand/luxe/laugh.mjs — a sapphire face with slim gold happy-arc eyes (the generated eyes were stubby gold
// domes over deep walls that read as goggles) and one big open gold-rimmed grin, so the laugh reads first at 16px.
// Built with the Luxe recipe (_luxe-core build).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_luxe-core.mjs'

const G = {
  paths: [
    { d: 'M21.5 12 A9.5 9.5 0 1 1 2.5 12 A9.5 9.5 0 1 1 21.5 12 Z', plate: 'K' },
    { d: 'M7.25 9.75 A2 2 0 0 1 10.75 9.75', plate: 'A' },
    { d: 'M13.25 9.75 A2 2 0 0 1 16.75 9.75', plate: 'A' },
    { d: 'M7.5 13 H16.5 A4.5 4.5 0 0 1 7.5 13 Z', plate: 'A' },
  ],
  fills: ['M21.5 12 A9.5 9.5 0 1 1 2.5 12 A9.5 9.5 0 1 1 21.5 12 Z'],
  cutouts: ['M7.5 13 H16.5 A4.5 4.5 0 0 1 7.5 13 Z'],
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
