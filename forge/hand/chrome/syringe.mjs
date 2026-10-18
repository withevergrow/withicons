// forge/hand/chrome/syringe.mjs — a polished chrome syringe on the diagonal: a wide barrel with three graduation marks
// cut into it, a broad finger flange, a tapered hub, and in gunmetal the fine needle and the plunger rod with its thumb
// pad. The generated drawing had a short, narrow barrel crossed by a bar, which read as a dagger with its hilt; here the
// barrel is fat and long, the flange and thumb pad are two distinct crossbars, and the needle tapers out of a hub.
// Same placement and paint as the generator (_chrome-core.mjs); the geometry is laid out along the syringe's axis.
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55, M0 = 0.7
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)

// axis frame: u runs from the needle tip (lower left) toward the thumb pad (upper right), v across it
const TIP = [3.75, 20.25], R2 = Math.SQRT1_2
const at = (u, v) => tf([TIP[0] + (u + v) * R2, TIP[1] + (v - u) * R2])
// a box across the axis: u0..u1 long, hw half wide
const box = (u0, u1, hw) => [at(u0, -hw), at(u1, -hw), at(u1, hw), at(u0, hw)]
const line = (u0, v0, u1, v1) => ({ pts: [at(u0, v0), at(u1, v1)], closed: false })

export default function render(icon) {
  const name = (icon && icon.name) || 'syringe'
  // chrome: the hub tapering into the barrel, the barrel, the flange
  const fK = F.region([[at(4.25, -0.9), at(6.5, -1.6), at(6.5, 1.6), at(4.25, 0.9)]], M0)
  F.region([box(6, 14.75, 3.25)], M0, fK)
  F.region([box(14.25, 16, 5.5)], M0, fK)
  // graduation marks cut into the barrel, clear of its edges
  const marks = F.strokes([8.5, 10.5, 12.5].map(u => line(u, -1.9, u, -0.4)), 0.5, M0)
  const K = F.open(F.subtract(fK, marks), 0.3)
  // gunmetal behind it: the needle and the plunger rod with its thumb pad
  const Ab = F.strokes([line(0, 0, 5, 0)], 1.2, M0)
  F.region([box(15.5, 19.75, 0.95)], M0, Ab)
  F.region([box(19.5, 21.25, 3.25)], M0, Ab)
  const AbR = F.open(Ab, 0.2)
  const sil = F.union(F.copy(fK), AbR)
  const Ls = layers({ T: {}, K, Af: null, Ab: AbR, S: null, sil, txt: null, seam: null })
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  return out
}
