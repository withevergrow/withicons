// forge/hand/chrome/video-call.mjs — a chrome camera body with a gunmetal lens wedge, the caller knocked clean through
// it as a head and shoulders. The generator ringed the person with a gunmetal tube inside a groove, so the face was a
// knot of dark outlines and reflections; plain holes keep one calm chrome body that reads at 16px. Same model and
// paint as the generator (_chrome-core.mjs); only the geometry is drawn here.
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

const BODY = 'M4 5 H13.5 A2 2 0 0 1 15.5 7 V17 A2 2 0 0 1 13.5 19 H4 A2 2 0 0 1 2 17 V7 A2 2 0 0 1 4 5 Z'
const LENS = 'M16 10.5 L21.5 7.5 V16.5 L16 13.5 Z'
const HEAD = 'M11.25 10 A2.5 2.5 0 1 1 6.25 10 A2.5 2.5 0 1 1 11.25 10 Z'
const SHOULDERS = 'M4.25 19 V18.25 A3 3 0 0 1 7.25 15.25 H10.25 A3 3 0 0 1 13.25 18.25 V19 Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'video-call'
  const Ls = layers(model(skeleton(name, [
    { d: BODY, plate: 'K', fill: true },
    { d: LENS, plate: 'A', fill: true },
  ], [HEAD, SHOULDERS])))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 0)
}
