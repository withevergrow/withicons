// forge/hand/luxe/arrow-up-down.mjs — double-headed vertical arrow with solid gold arrowheads on a sapphire shaft.
// Built with the Luxe recipe (_luxe-core build) from a redrawn skeleton.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_luxe-core.mjs'

const G = {
  paths: [
    { d: "M12 9 V15", plate: "K" },
    { d: "M12 3.6 L16.4 8.6 H7.6 Z", plate: "A" },
    { d: "M12 20.4 L16.4 15.4 H7.6 Z", plate: "A" },
  ],
  fills: ["M12 3.6 L16.4 8.6 H7.6 Z", "M12 20.4 L16.4 15.4 H7.6 Z"],
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
