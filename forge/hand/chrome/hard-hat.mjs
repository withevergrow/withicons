// forge/hand/chrome/hard-hat.mjs — a polished chrome safety helmet: a full dome, a wide brim split clean off it by an open
// seam, and a solid gunmetal ridge running over the crown, standing a little proud of the dome. The generated drawing
// fused dome and brim into one bell with only a faint groove, and its ridge was a hollow loop with two slits that read
// as vents, so at 24 and 16px it looked like a bell or a cloud. Painted with the style's own layer recipe (_chrome-core).
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const M0 = 0.7
const minus = (A, B) => F.subtract(F.copy(A), B)
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)

const DOME = 'M3.75 15.5A8.25 8.25 0 0 1 20.25 15.5Z'
const BRIM = 'M3.25 16.5H20.75A2 2 0 0 1 22.75 18.5A2 2 0 0 1 20.75 20.5H3.25A2 2 0 0 1 1.25 18.5A2 2 0 0 1 3.25 16.5Z'
// the crown ridge: a gunmetal band over the top of the dome, rising just above its outline
const RIDGE = 'M10.6 15.5V7.65A1.4 1.4 0 0 1 12 6.25A1.4 1.4 0 0 1 13.4 7.65V15.5Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'hard-hat'
  const Kf = F.region(rings(DOME), M0)
  F.region(rings(BRIM), M0, Kf)
  const Af = F.region(rings(RIDGE), M0)
  // the parting gap round the ridge: a dark seam in the dome, not a hole through it
  const g = F.offset(F.copy(Af), -0.42)
  const seam = F.intersect(F.copy(g), Kf)
  const K = F.open(minus(Kf, g), 0.32)
  const A = F.open(F.copy(Af), 0.32)
  const sil = F.copy(Kf); F.union(sil, Af)
  const Ls = layers({ T: {}, K, Af: A, Ab: null, S: null, sil, txt: null, seam })
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  return out
}
