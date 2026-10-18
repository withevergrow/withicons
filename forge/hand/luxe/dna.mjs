// forge/hand/luxe/dna.mjs — DNA double helix: two gilded ribbons crossing, with sapphire rungs between.
// Built with the Luxe recipe (_luxe-core build) from a redrawn skeleton.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_luxe-core.mjs'

const G = {
  paths: [
    { d: "M6.6 2.5 C6.6 7.5 17.4 7 17.4 12 C17.4 17 6.6 16.5 6.6 21.5", plate: "A" },
    { d: "M17.4 2.5 C17.4 7.5 6.6 7 6.6 12 C6.6 17 17.4 16.5 17.4 21.5", plate: "A" },
    { d: "M9.4 4.6 H14.6 M10.6 8.4 H13.4 M10.6 15.6 H13.4 M9.4 19.4 H14.6", plate: "K" },
  ],
  fills: [],
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
