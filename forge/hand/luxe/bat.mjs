// forge/hand/luxe/bat.mjs — gold scalloped wings spread either side of a navy eared body with engraved eyes (the generated one fused the wings into a butterfly and the head into a knot).
// Built with the Luxe recipe (_luxe-core build).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_luxe-core.mjs'

const G = {
  paths: [
    {
      d: 'M10.2 9.4 C8 8.2 4.8 6.4 1.2 3.9 C0.9 7.6 1.3 10.8 2.4 13.8 C3.4 12.3 4.6 11.8 5.4 12.1 C5.6 13 5.8 14 6 14.6 C6.6 13 7.4 12.4 8.3 12.5 C8.5 13.4 8.9 14.4 9.3 15.4 Z',
      plate: 'A'
    },
    {
      d: 'M 13.8 9.4C 16 8.2 19.2 6.4 22.8 3.9C 23.1 7.6 22.7 10.8 21.6 13.8C 20.6 12.3 19.4 11.8 18.6 12.1C 18.4 13 18.2 14 18 14.6C 17.4 13 16.6 12.4 15.7 12.5C 15.5 13.4 15.1 14.4 14.7 15.4Z',
      plate: 'A'
    },
    {
      d: 'M9.9 4.6 L11.3 6.9 H12.7 L14.1 4.6 V13.8 C14.1 15.7 13.2 17 12 17 C10.8 17 9.9 15.7 9.9 13.8 Z',
      plate: 'K'
    }
  ],
  fills: [
    'M10.2 9.4 C8 8.2 4.8 6.4 1.2 3.9 C0.9 7.6 1.3 10.8 2.4 13.8 C3.4 12.3 4.6 11.8 5.4 12.1 C5.6 13 5.8 14 6 14.6 C6.6 13 7.4 12.4 8.3 12.5 C8.5 13.4 8.9 14.4 9.3 15.4 Z',
    'M 13.8 9.4C 16 8.2 19.2 6.4 22.8 3.9C 23.1 7.6 22.7 10.8 21.6 13.8C 20.6 12.3 19.4 11.8 18.6 12.1C 18.4 13 18.2 14 18 14.6C 17.4 13 16.6 12.4 15.7 12.5C 15.5 13.4 15.1 14.4 14.7 15.4Z',
    'M9.9 4.6 L11.3 6.9 H12.7 L14.1 4.6 V13.8 C14.1 15.7 13.2 17 12 17 C10.8 17 9.9 15.7 9.9 13.8 Z'
  ],
  cutouts: [
    'M11.6 10 A0.5 0.5 0 1 1 10.6 10 A0.5 0.5 0 1 1 11.6 10 Z',
    'M13.4 10 A0.5 0.5 0 1 1 12.4 10 A0.5 0.5 0 1 1 13.4 10 Z'
  ]
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
