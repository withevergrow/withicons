// forge/hand/luxe/turtle.mjs — sapphire turtle: domed shell with a gold hexagon scute, raised head with an eye, two stubby feet and a tail.
// Built with the Luxe recipe (_luxe-core build) from a redrawn skeleton.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_luxe-core.mjs'

const G = {
  "paths": [
    {
      "d": "M2.8 14 C2.8 8.8 6.2 5.2 10 5.2 C14 5.2 17.2 8.8 17.2 14 Z",
      "plate": "K"
    },
    {
      "d": "M8.6 8 H11.4 L12.9 10.5 L11.4 13 H8.6 L7.1 10.5 Z",
      "plate": "A"
    },
    {
      "d": "M15.6 11.4 C17 11.2 17.6 10.6 17.8 10",
      "plate": "K"
    },
    {
      "d": "M22 9.2 A2.6 2.6 0 1 1 16.8 9.2 A2.6 2.6 0 1 1 22 9.2 Z",
      "plate": "K"
    },
    {
      "d": "M3.9 13.6 H7.1 V16.4 Q7.1 17.2 6.3 17.2 H4.7 Q3.9 17.2 3.9 16.4 Z",
      "plate": "K"
    },
    {
      "d": "M12.9 13.6 H16.1 V16.4 Q16.1 17.2 15.3 17.2 H13.700000000000001 Q12.9 17.2 12.9 16.4 Z",
      "plate": "K"
    },
    {
      "d": "M3.2 12.4 L1.6 13.8",
      "plate": "K"
    }
  ],
  "fills": [
    "M2.8 14 C2.8 8.8 6.2 5.2 10 5.2 C14 5.2 17.2 8.8 17.2 14 Z",
    "M8.6 8 H11.4 L12.9 10.5 L11.4 13 H8.6 L7.1 10.5 Z",
    "M22 9.2 A2.6 2.6 0 1 1 16.8 9.2 A2.6 2.6 0 1 1 22 9.2 Z",
    "M3.9 13.6 H7.1 V16.4 Q7.1 17.2 6.3 17.2 H4.7 Q3.9 17.2 3.9 16.4 Z",
    "M12.9 13.6 H16.1 V16.4 Q16.1 17.2 15.3 17.2 H13.700000000000001 Q12.9 17.2 12.9 16.4 Z"
  ],
  "cutouts": [
    "M21.2 8.8 A0.6 0.6 0 1 1 20 8.8 A0.6 0.6 0 1 1 21.2 8.8 Z"
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
