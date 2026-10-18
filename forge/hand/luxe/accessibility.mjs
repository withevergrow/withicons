// forge/hand/luxe/accessibility.mjs — a sapphire disc with a gold universal-access figure inlaid on it: round head, outstretched arms, torso and two legs (the generated cutouts turned it into a bar over a chevron).
// Built with the Luxe recipe (_luxe-core build).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_luxe-core.mjs'

const G = {
  paths: [
    {
      d: 'M21.5 12 A9.5 9.5 0 1 1 2.5 12 A9.5 9.5 0 1 1 21.5 12 Z',
      plate: 'K'
    },
    {
      d: 'M12.9 6.6 A0.9 0.9 0 1 1 11.1 6.6 A0.9 0.9 0 1 1 12.9 6.6 Z',
      plate: 'A'
    },
    {
      d: 'M6.8 10.6 H17.2 M12 10.6 V14.4 M9.5 18.2 L12 14.4 L14.5 18.2',
      plate: 'A'
    }
  ],
  fills: [
    'M21.5 12 A9.5 9.5 0 1 1 2.5 12 A9.5 9.5 0 1 1 21.5 12 Z',
    'M12.9 6.6 A0.9 0.9 0 1 1 11.1 6.6 A0.9 0.9 0 1 1 12.9 6.6 Z'
  ],
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
