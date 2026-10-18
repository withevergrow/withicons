// forge/hand/luxe/id-card.mjs — sapphire ID card with a gold head-and-shoulders portrait inlay and gold text lines.
// Built with the Luxe recipe (_luxe-core build) from a redrawn skeleton.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_luxe-core.mjs'

const G = {
  paths: [
    { d: "M4 4 H20 A2 2 0 0 1 22 6 V18 A2 2 0 0 1 20 20 H4 A2 2 0 0 1 2 18 V6 A2 2 0 0 1 4 4 Z", plate: "K" },
    { d: "M9.6 9.4 A1.6 1.6 0 1 1 6.4 9.4 A1.6 1.6 0 1 1 9.6 9.4 Z", plate: "A" },
    { d: "M5.2 16.6 C5.2 14.6 6.4 13.6 8 13.6 C9.6 13.6 10.8 14.6 10.8 16.6 Z", plate: "A" },
    { d: "M14.5 9.5 H18.5", plate: "A" },
    { d: "M14.5 14 H17.5", plate: "A" },
  ],
  fills: [
    "M4 4 H20 A2 2 0 0 1 22 6 V18 A2 2 0 0 1 20 20 H4 A2 2 0 0 1 2 18 V6 A2 2 0 0 1 4 4 Z",
    "M9.6 9.4 A1.6 1.6 0 1 1 6.4 9.4 A1.6 1.6 0 1 1 9.6 9.4 Z",
    "M5.2 16.6 C5.2 14.6 6.4 13.6 8 13.6 C9.6 13.6 10.8 14.6 10.8 16.6 Z",
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
