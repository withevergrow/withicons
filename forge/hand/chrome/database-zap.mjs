// forge/hand/chrome/database-zap.mjs — the chrome database barrel (a full cylinder: oval lid groove, one band groove,
// rounded base, exactly like the style's database) with a fat hot-pink enamel bolt set over its lower right in a moat.
// The generated drawing broke the barrel into a lid, a short right stub and a gunmetal sliver that ended at the bolt,
// so the stack read as an E with a bolt beside it. Same model and paint as the generator (_chrome-core.mjs); only the
// geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

// a skeleton in the shape model() expects: parts [{ d, plate, fill }], cutouts [d]
function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)

// the barrel: lid ellipse over straight sides and a rounded base
const BARREL = 'M3.75 5.5A8.25 3 0 0 1 20.25 5.5V18.25A8.25 3 0 0 1 3.75 18.25Z'
// grooves: the lid's front rim and one band round the middle, run past the sides so they cut clean through
const GROOVES = ['M2.25 5.5H3.75A8.25 3 0 0 0 20.25 5.5H21.75', 'M2.25 11.75H3.75A8.25 3 0 0 0 20.25 11.75H21.75']
// the bolt: a fat zigzag over the lower right, its tip tucked inside the base line
const BOLT = 'M18.75 11L14.25 17.25H17.4L16.75 21.75L21.75 15.5H18.5L18.75 11Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'database-zap'
  const M = model(skeleton(name, [
    { d: BARREL, plate: 'K', fill: true },
    { d: BOLT, plate: 'S', fill: true },
  ], GROOVES))
  // the bolt's moat leaves a speck of barrel between it and the band groove: drop specks
  for (const c of F.components(M.K, true)) if (c.area < 1) for (const q of c.cells) M.K[q] = 0.3
  const Ls = layers(M)
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 9000; t++) out = emit(Ls, name, t)
  return out
}
