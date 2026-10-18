// forge/hand/chrome/tablet.mjs — a broad chrome tablet slab, clearly wider than the phone, with a big screen window
// in an even bezel and a round home button window cut through the chin. The generated slab kept the phone's proportions and
// its home bar, so in chrome it read as a smartphone. Same model and paint as the generator (_chrome-core.mjs); only
// the geometry is drawn here.
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

const SLAB = 'M5.5 2.5H18.5A2.5 2.5 0 0 1 21 5V19A2.5 2.5 0 0 1 18.5 21.5H5.5A2.5 2.5 0 0 1 3 19V5A2.5 2.5 0 0 1 5.5 2.5Z'
const SCREEN = 'M6.25 4.75H17.75A1 1 0 0 1 18.75 5.75V15.5A1 1 0 0 1 17.75 16.5H6.25A1 1 0 0 1 5.25 15.5V5.75A1 1 0 0 1 6.25 4.75Z'
// the home button: a round window cut through the chin
const HOME = 'M13.1 19.15A1.1 1.1 0 1 1 10.9 19.15A1.1 1.1 0 1 1 13.1 19.15Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'tablet'
  const Ls = layers(model(skeleton(name, [
    { d: SLAB, plate: 'K', fill: true },
  ], [SCREEN, HOME])))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 0)
}
