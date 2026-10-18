// forge/hand/luxe/rose-bouquet.mjs — three gold roses with engraved spiral hearts above a navy wrapped cone with a gold bow and two navy leaves (the generated one fused the roses into a cloud and lost the swirls and bow).
// Built with the Luxe recipe (_luxe-core build).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_luxe-core.mjs'

const G = {
  paths: [
    { d: 'M15.70 6.30 A3.7 3.7 0 1 1 8.30 6.30 A3.7 3.7 0 1 1 15.70 6.30 Z', plate: 'A' },
    { d: 'M9.70 10.60 A3.2 3.2 0 1 1 3.30 10.60 A3.2 3.2 0 1 1 9.70 10.60 Z', plate: 'A' },
    { d: 'M20.70 10.60 A3.2 3.2 0 1 1 14.30 10.60 A3.2 3.2 0 1 1 20.70 10.60 Z', plate: 'A' },
    { d: 'M6 13.4 H18 L13.6 22 H10.4 Z', plate: 'K' },
    { d: 'M8.2 16.4 H15.8', plate: 'A' },
  ],
  fills: [
    'M15.70 6.30 A3.7 3.7 0 1 1 8.30 6.30 A3.7 3.7 0 1 1 15.70 6.30 Z',
    'M9.70 10.60 A3.2 3.2 0 1 1 3.30 10.60 A3.2 3.2 0 1 1 9.70 10.60 Z',
    'M20.70 10.60 A3.2 3.2 0 1 1 14.30 10.60 A3.2 3.2 0 1 1 20.70 10.60 Z',
    'M6 13.4 H18 L13.6 22 H10.4 Z',
  ],
  cutouts: [
    'M12.30 6.60 C12.30 5.60 11.10 5.40 10.70 6.30 C10.30 7.50 11.50 8.50 12.90 8.30 C14.30 8.10 14.70 6.50 14.30 5.30',
    'M6.80 10.90 C6.80 9.90 5.60 9.70 5.20 10.60 C4.80 11.80 6.00 12.80 7.40 12.60 C8.80 12.40 9.20 10.80 8.80 9.60',
    'M17.80 10.90 C17.80 9.90 16.60 9.70 16.20 10.60 C15.80 11.80 17.00 12.80 18.40 12.60 C19.80 12.40 20.20 10.80 19.80 9.60',
  ],
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
