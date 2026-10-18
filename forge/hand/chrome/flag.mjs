// forge/hand/chrome/flag.mjs — a polished chrome pennant on a sturdy gunmetal pole standing in front of its hoist edge.
// The generated flag's pole was a hairline pin that thinned to nothing at 16px, so the cloth floated; here the pole has
// the weight of the style's other gunmetal parts and stands in front, the cloth keeps the skeleton's double wave and
// the horizon rides the wave. Painted with the style's own layer recipe (_chrome-core layers/emit).
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

export default function render() {
  // the cloth: the skeleton's waving pennant, filled and inflated
  const cloth = 'M5.5 3.5C8 2.25 10.25 2.25 12.75 3.5C15.25 4.75 17.5 4.75 20 3.5V13.5C17.5 14.75 15.25 14.75 12.75 13.5C10.25 12.25 8 12.25 5.5 13.5Z'
  const Kf = F.strokes(lines(cloth), 2.55, M0)
  F.region(rings(cloth), M0, Kf)
  // the pole: gunmetal, in front of the cloth's hoist edge, with a parting seam
  const pole = F.strokes(lines('M4.75 3.75V21.25'), 2.1, M0)
  const gap = F.offset(F.copy(pole), -0.42)
  const seam = F.intersect(F.copy(gap), Kf)
  const K = F.open(minus(Kf, gap), 0.32)
  const A = F.open(pole, 0.32)
  const sil = F.copy(Kf); F.union(sil, pole)
  const Ls = layers({ T: {}, K, Af: A, Ab: null, S: null, sil, txt: null, seam })
  let out = emit(Ls, 'flag', 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, 'flag', t)
  return out
}
