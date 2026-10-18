// forge/hand/luxe/radar.mjs — a sapphire radar scope: one bold engraved range ring, a gold hub, a gold sweep arm and one gold blip in the outer band.
// Built with the Luxe recipe (_luxe-core build).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_luxe-core.mjs'

const G = {
  note: "a sapphire radar scope: one bold engraved range ring, a gold sweep arm from the hub and one gold blip in the outer band",
  paths: [
    { d: "M21.5 12 A9.5 9.5 0 1 1 2.5 12 A9.5 9.5 0 1 1 21.5 12 Z", plate: "K" },
    { d: "M17.25 12 A5.25 5.25 0 0 1 6.75 12", plate: "K" },
    { d: "M6.75 12 A5.25 5.25 0 0 1 17.25 12", plate: "K" },
    { d: "M14.25 9.75 L18 6", plate: "A" },
    { d: "M12.4 12 A0.4 0.4 0 1 1 11.6 12 A0.4 0.4 0 1 1 12.4 12 Z", plate: "A" },
    { d: "M7.1 17.5 A0.4 0.4 0 1 1 6.3 17.5 A0.4 0.4 0 1 1 7.1 17.5 Z", plate: "A" }
  ],
  fills: [
    "M21.5 12 A9.5 9.5 0 1 1 2.5 12 A9.5 9.5 0 1 1 21.5 12 Z"
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
