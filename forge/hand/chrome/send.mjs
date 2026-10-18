// forge/hand/chrome/send.mjs — a chrome paper plane folded in two facets: the big upper wing in bright chrome in front,
// the lower fold in darker gunmetal (plate A) behind it, so the wing's own edge is the crease and the plane reads
// two-tone. The generator laid a pale pill along the fold, which read as a stray bar on a flat grey dart; here there is
// no groove at all, and the wing's tail keeps a full body at 16px. Same model and paint as the generator
// (_chrome-core.mjs); only the geometry is drawn here.
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

const WING = 'M21 3 L3 10.5 L10.5 13.5 Z'
// the fold's outer edges carry extra vertices so its fill sides with plate A, not the wing it shares an edge with
const FOLD = 'M21 3 L19.25 7.38 L17.5 11.75 L15.75 16.13 L14 20.5 L13.13 18.75 L12.25 17 L11.38 15.25 L10.5 13.5 Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'send'
  const Ls = layers(model(skeleton(name, [
    { d: WING, plate: 'K', fill: true },
    { d: FOLD, plate: 'A', fill: true },
  ])))
  // one rigid plane: the motion moves it whole, so every piece is body
  for (const L of Ls.list) if (!L.cls || L.cls === 'wm-a') L.cls = 'wm-k'
  return emit(Ls, name, 0)
}
