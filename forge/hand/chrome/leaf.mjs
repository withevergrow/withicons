// forge/hand/chrome/leaf.mjs: the line leaf in chrome, a plump pointed leaf with one diagonal midrib groove and a gunmetal
// stem running out of its bottom-left tip. The generated one lost the stem (it sat inside the cut midrib line), so the
// leaf read as a blob; here the midrib is a groove in the chrome and the stem is its own gunmetal piece (wm-a).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

const LEAF = 'M6 18 C3.8 10.5 9.5 4 20.5 3.5 C20.5 14.5 13.5 20.4 6 18 Z'
const STEM = 'M2.6 21.4 L6.8 17.2'
const RIB = 'M8 16 C10.6 13 13.4 10.4 16.4 7.8'

const prep = d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }
export default function render(icon) {
  const name = (icon && icon.name) || 'leaf'
  const paths = [[LEAF, 'K'], [STEM, 'A']].map(([d, plate], i) => ({ id: 'p' + i, d, plate, subs: parsePath(d) }))
  const lines = paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id })))
  const sk = { name, paths, lines, fills: [prep(LEAF)], cutouts: [{ d: RIB, subs: parsePath(RIB) }] }
  const Ls = layers(model(sk))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 0)
}
