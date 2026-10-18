// forge/hand/chrome/ruler.mjs — a fat diagonal chrome ruler with three bold notched edge ticks (long, short, long).
// The generated ruler cut its ticks as grooves running along the edge, which read as a looped coil or a paperclip.
// Same model and paint as the generator (_chrome-core.mjs); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

// a skeleton in the shape model() expects: parts [{ d, plate, fill }], cutouts [d]
function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}

const BODY = 'M3 16L16 3A1.41 1.41 0 0 1 18 3L21 6A1.41 1.41 0 0 1 21 8L8 21A1.41 1.41 0 0 1 6 21L3 18A1.41 1.41 0 0 1 3 16Z'
// a tick: u runs along the ruler (x - y), v across it (x + y); it starts a little inside the upper-left edge
const tick = (u, v0, v1) => `M${(u + v0) / 2} ${(v0 - u) / 2}L${(u + v1) / 2} ${(v1 - u) / 2}`
const PARTS = [{ d: BODY, plate: 'K', fill: true }]
const CUTS = [tick(-7, 18.4, 22.6), tick(-0.5, 18.4, 20.6), tick(6, 18.4, 22.6)]

export default function render(icon) {
  const name = (icon && icon.name) || 'ruler'
  const Ls = layers(model(skeleton(name, PARTS, CUTS)))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 0)
}
