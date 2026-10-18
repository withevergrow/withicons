// forge/hand/chrome/reply-all.mjs — reply-all as one fat polished chrome tail with two heavy gunmetal arrowheads leading
// left. The generated drawing used thin pale tubes whose outer chevron washed out on white and whose inner chevron melted
// into the tail; here the tail is a thicker chrome bar and both heads are darker, chunkier gunmetal set off by a seam,
// so the double arrow keeps its contrast at 24 and 16px. Painted with the style's own layer recipe (_chrome-core).
import * as F from '../../styles/_chrome-field.mjs'
import { parsePath } from '../../kernel/geom.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55, M0 = 0.7
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const polys = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)

const TAIL = 'M9.5 9.5H13.25A7.25 7.25 0 0 1 20.5 16.75V19.5'
const HEAD = 'M14 4.25L8.75 9.5L14 14.75'
const BACK = 'M8 4.25L2.75 9.5L8 14.75'

export default function render(icon) {
  const name = (icon && icon.name) || 'reply-all'
  const fK = F.strokes(polys(TAIL), 3.05, M0)
  const fA = F.strokes([...polys(HEAD), ...polys(BACK)], 2.75, M0)
  // the heads sit in front of the tail: a parting seam round them, dark in the chrome
  const gap = F.offset(F.copy(fA), -0.42)
  const K0 = F.subtract(F.copy(fK), gap)
  const seam = F.intersect(F.copy(gap), fK)
  const sil = F.union(F.copy(fK), fA)
  const M = { T: {}, K: F.open(K0, 0.32), Af: F.open(F.copy(fA), 0.32), Ab: null, S: null, sil, txt: null, seam }
  const Ls = layers(M)
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  return out
}
