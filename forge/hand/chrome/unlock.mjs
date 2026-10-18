// forge/hand/chrome/unlock.mjs — a chrome padlock whose gunmetal shackle (the same metal as chrome lock's) is lifted
// right off the case: a fatter tube rising from the left post and arching over to a free end cut short on the arc,
// with a wide gap of air between it and the case. The generated shackle was a thin tube that only tipped a little to the side,
// so it read faint and nearly closed at 24 and 16px. Painted with the style's own layer recipe (_chrome-core).
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const M0 = 0.7
const minus = (A, B) => F.subtract(F.copy(A), B)
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)

const BODY = 'M6 11H18A2 2 0 0 1 20 13V19A2 2 0 0 1 18 21H6A2 2 0 0 1 4 19V13A2 2 0 0 1 6 11Z'
// left post up from behind the case, over the top, the free end cut off on the arc 28 degrees above level at
// (15.75, 4.75): no right leg at all, so with its round cap it stops about 3.7u above the case top and the opening
// reads in silhouette at 16px, unmistakably apart from chrome lock's closed loop
const SHACKLE = 'M7.75 11.5V6.75A4.25 4.25 0 0 1 15.75 4.75'
const KEYHOLE = 'M12 15V17'

export default function render(icon) {
  const name = (icon && icon.name) || 'unlock'
  const Kf = F.strokes(lines(BODY), 2.55, M0)
  F.region(rings(BODY), M0, Kf)
  const rec = F.strokes(lines(KEYHOLE), 1.15, M0)
  const K = F.open(minus(Kf, rec), 0.32)
  // the shackle: gunmetal, behind the case, a touch heavier than the generator's 2.25 tube
  const Ab = F.open(F.strokes(lines(SHACKLE), 2.6, M0), 0.32)
  const sil = F.copy(Kf); F.union(sil, Ab); F.subtract(sil, rec)
  const Ls = layers({ T: {}, K, Af: null, Ab, S: null, sil, txt: null, seam: null })
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  return out
}
