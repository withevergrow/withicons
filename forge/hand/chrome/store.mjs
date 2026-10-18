// forge/hand/chrome/store.mjs — a polished chrome storefront: a three-panel scalloped awning (chrome, gunmetal, chrome)
// over a plain chrome facade whose scalloped top follows the awning, with a tall gunmetal door set in on a dark seam.
// The generated drawing ran gunmetal stripe rods through slots in the awning and cut a groove under the scallops, so
// the awning broke into fang-like slivers and the door melted into the facade at 16px; here every part is one clean
// mass. Same placement and paint as the generator (_chrome-core.mjs); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55, M0 = 0.7
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const reg = (d, into = null, m = M0) => F.region(rings(d), m, into)
const minus = (A, B) => F.subtract(F.copy(A), B)
const grow = (A, e) => F.offset(F.copy(A), -e)
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)

const AWNING = 'M5.75 2.5H18.25L21.75 8.75A3.25 2.5 0 0 1 15.25 8.75A3.25 2.5 0 0 1 8.75 8.75A3.25 2.5 0 0 1 2.25 8.75Z'
const MID = 'M10 2.5H14L15.25 8.75A3.25 2.5 0 0 1 8.75 8.75Z'
const FACADE = 'M3.75 9.5H20.25V19.25A2.25 2.25 0 0 1 18 21.5H6A2.25 2.25 0 0 1 3.75 19.25Z'
const DOOR = 'M9.5 21.5V16.75A1.75 1.75 0 0 1 11.25 15H12.75A1.75 1.75 0 0 1 14.5 16.75V21.5Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'store'
  const awning = reg(AWNING, null, 1.6)
  // the facade tucks under the awning: its top follows the scallops a clear gap below them
  const fK = reg(FACADE); F.subtract(fK, grow(awning, 0.85)); F.union(fK, awning)
  // gunmetal parts set into the chrome: the awning's middle panel and the door, each on a parting seam
  const Af = F.offset(reg(MID), 0.15); reg(DOOR, Af)
  const g = grow(Af, 0.42)
  const K = F.open(minus(fK, g), 0.32)
  const seam = F.intersect(F.copy(g), fK)
  const sil = F.copy(fK)
  const Ls = layers({ T: {}, K, Af: F.open(F.intersect(Af, fK), 0.2), Ab: null, S: null, sil, txt: null, seam })
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  return out
}
