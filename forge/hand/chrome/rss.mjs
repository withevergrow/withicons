// forge/hand/chrome/rss.mjs — a fat polished chrome source bead with two broad gunmetal feed arcs around it. The
// generated rss kept the skeleton's pin-head dot (a speck with a star bigger than itself) and thin wire arcs striped
// by dark reflection bands, so it read broken and busy at 16px. Here the bead is a real chrome blob and the arcs are
// solid bands with room between them. Same model and paint as the generator (_chrome-core.mjs); only the geometry
// is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

const CX = 5.75, CY = 18.25
const disc = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`
// a quarter band about the source: outer radius ro, inner radius ri (closed, round-capped by the tube)
const band = (ri, ro) => `M${CX} ${CY - ro}A${ro} ${ro} 0 0 1 ${CX + ro} ${CY}H${CX + ri}A${ri} ${ri} 0 0 0 ${CX} ${CY - ri}Z`
const DOT = disc(CX, CY, 1.6)
const ARC1 = band(7, 7.75)
const ARC2 = band(12.75, 13.5)

function skeleton(name) {
  const paths = [
    { id: 'p0', d: DOT, plate: 'K' }, { id: 'p1', d: ARC1, plate: 'A' }, { id: 'p2', d: ARC2, plate: 'A' },
  ].map(p => ({ ...p, subs: parsePath(p.d) }))
  const fill = d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }
  return {
    name, paths, fills: [fill(DOT), fill(ARC1), fill(ARC2)], cutouts: [],
    lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))),
  }
}

export default function render(icon) {
  const name = (icon && icon.name) || 'rss'
  const Ls = layers(model(skeleton(name)))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 0)
}
