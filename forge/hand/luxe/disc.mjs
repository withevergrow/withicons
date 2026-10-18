// forge/hand/luxe/disc.mjs — a sapphire disc with a gold hub ring around a visible centre hole and two gold reflection arcs, upper left and lower right.
// Built with the Luxe recipe (_luxe-core build).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_luxe-core.mjs'

const G = {
  note: "a sapphire disc with a gold hub ring around a visible centre hole and two gold reflection arcs, upper left and lower right",
  paths: [
    {
      d: "M21.5 12 A9.5 9.5 0 1 1 2.5 12 A9.5 9.5 0 1 1 21.5 12 Z",
      plate: "K"
    },
    {
      d: "M15.1 12 A3.1 3.1 0 1 1 8.9 12 A3.1 3.1 0 1 1 15.1 12 Z",
      plate: "A"
    },
    {
      d: "M5.75 12 A6.75 6.75 0 0 1 10.25 5.48",
      plate: "A"
    },
    {
      d: "M18.52 13.75 A6.75 6.75 0 0 1 13.75 18.52",
      plate: "A"
    }
  ],
  fills: [
    "M21.5 12 A9.5 9.5 0 1 1 2.5 12 A9.5 9.5 0 1 1 21.5 12 Z",
    "M15.1 12 A3.1 3.1 0 1 1 8.9 12 A3.1 3.1 0 1 1 15.1 12 Z"
  ],
  cutouts: [
    "M13.4 12 A1.4 1.4 0 1 1 10.6 12 A1.4 1.4 0 1 1 13.4 12 Z"
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
