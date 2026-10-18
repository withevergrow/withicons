// forge/hand/luxe/motorcycle.mjs — motorcycle: sapphire ring tyres, a gold tank-and-seat body, fork, handlebar and swingarm.
// Built with the Luxe recipe (_luxe-core build) from a redrawn skeleton.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_luxe-core.mjs'

const G = {
  "paths": [
    {
      "d": "M8.8 11.4 H14.4 L13.8 15 H9.6 Z",
      "plate": "K"
    },
    {
      "d": "M3.6 10 H9 L10.4 8 H14.6 L13.8 11 H8.2 L7 11.4 H3.6 Z",
      "plate": "A"
    },
    {
      "d": "M19.2 14.8 L16 8.4 L13.8 7",
      "plate": "A"
    },
    {
      "d": "M7.3 17.4 A2.7 2.7 0 1 1 1.8999999999999995 17.4 A2.7 2.7 0 1 1 7.3 17.4 Z",
      "plate": "K"
    },
    {
      "d": "M22.099999999999998 17.4 A2.7 2.7 0 1 1 16.7 17.4 A2.7 2.7 0 1 1 22.099999999999998 17.4 Z",
      "plate": "K"
    }
  ],
  "fills": [
    "M8.8 11.4 H14.4 L13.8 15 H9.6 Z",
    "M3.6 10 H9 L10.4 8 H14.6 L13.8 11 H8.2 L7 11.4 H3.6 Z",
    "M7.3 17.4 A2.7 2.7 0 1 1 1.8999999999999995 17.4 A2.7 2.7 0 1 1 7.3 17.4 Z",
    "M22.099999999999998 17.4 A2.7 2.7 0 1 1 16.7 17.4 A2.7 2.7 0 1 1 22.099999999999998 17.4 Z"
  ],
  "cutouts": [
    "M5.699999999999999 17.4 A1.1 1.1 0 1 1 3.4999999999999996 17.4 A1.1 1.1 0 1 1 5.699999999999999 17.4 Z",
    "M20.5 17.4 A1.1 1.1 0 1 1 18.299999999999997 17.4 A1.1 1.1 0 1 1 20.5 17.4 Z"
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
  return build(prep('motorcycle-hand'))
}
