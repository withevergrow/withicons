// forge/hand/luxe/address-book.mjs — the sapphire address book with its three tab rings and a solid gold head-and-shoulders contact (the generated one drew a ring knob over a ring bust that read as a donut).
// Built with the Luxe recipe (_luxe-core build).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_luxe-core.mjs'

const G = {
  note: "the sapphire address book with its three tab rings and a solid gold head-and-shoulders contact (the generated one drew a ring knob over a ring bust that read as a donut)",
  paths: [
    {
      d: "M5.5 2.5 H16.5 A2 2 0 0 1 18.5 4.5 V19.5 A2 2 0 0 1 16.5 21.5 H5.5 A2 2 0 0 1 3.5 19.5 V4.5 A2 2 0 0 1 5.5 2.5 Z",
      plate: "K"
    },
    {
      d: "M18.5 7 H20.5 M18.5 12 H20.5 M18.5 17 H20.5",
      plate: "K"
    },
    {
      d: "M13.25 8.5 A2.25 2.25 0 1 1 8.75 8.5 A2.25 2.25 0 1 1 13.25 8.5 Z",
      plate: "A"
    },
    {
      d: "M7 18 V16.75 A2.75 2.75 0 0 1 9.75 14 H12.25 A2.75 2.75 0 0 1 15 16.75 V18 Z",
      plate: "A"
    }
  ],
  fills: [
    "M5.5 2.5 H16.5 A2 2 0 0 1 18.5 4.5 V19.5 A2 2 0 0 1 16.5 21.5 H5.5 A2 2 0 0 1 3.5 19.5 V4.5 A2 2 0 0 1 5.5 2.5 Z",
    "M13.25 8.5 A2.25 2.25 0 1 1 8.75 8.5 A2.25 2.25 0 1 1 13.25 8.5 Z",
    "M7 18 V16.75 A2.75 2.75 0 0 1 9.75 14 H12.25 A2.75 2.75 0 0 1 15 16.75 V18 Z"
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
