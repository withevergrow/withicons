// forge/hand/chrome/rose.mjs: a large chrome rose bloom (three petal tips on top) with a spiral groove cut into it, a gunmetal stem and a separate gunmetal leaf.
// Same model and paint as the generator (_chrome-core.mjs); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const circ = (x, y, r) => `M${x + r} ${y}A${r} ${r} 0 1 1 ${x - r} ${y}A${r} ${r} 0 1 1 ${x + r} ${y}Z`
const BLOOM = 'M5.6 4.2Q8.6 5.4 12 2.8Q15.4 5.4 18.4 4.2L18.4 9Q18.4 14.6 12 14.6Q5.6 14.6 5.6 9Z'
const SPIRAL = 'M12 9Q13.2 9 13.1 10.1Q12.9 11.4 11.6 11.3Q9.6 11.1 9.7 9.3Q9.9 6.9 12.4 6.8Q15.4 6.8 15.6 9.8Q15.6 12.6 12.6 13'
const STEM = 'M12 15.4V21.6'
const LEAF = 'M13.9 18.6Q15.6 15.4 19.4 15.4Q18.8 19 13.9 18.6Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'rose'
  const Ls = layers(model(skeleton(name, [{ d: BLOOM, plate: 'K', fill: true }, { d: SPIRAL, plate: 'K' }, { d: STEM, plate: 'A' }, { d: LEAF, plate: 'A', fill: true }], [])))
  return emit(Ls, name, 0)
}
