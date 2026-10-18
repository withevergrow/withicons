// forge/hand/chrome/lasso.mjs — a fat chrome rope loop with a trailing tail, and a large gunmetal pointer arrow
// reaching into the loop from below. The generated drawing had a thin loop and a tiny arrow lost in the chrome; here the
// rope is a thick tube round a wide open centre and the pointer is a big solid inlay set in its own dark seam.
// Painted with the style's own layer recipe (_chrome-core layers/emit).
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

export default function render(icon) {
  const name = (icon && icon.name) || 'lasso'
  // the loop: a wide ellipse of thick rope, and the tail curling away from its lower left
  const Kf = F.strokes(lines('M20.2 8.6A8.4 5.2 0 1 1 3.4 8.6A8.4 5.2 0 1 1 20.2 8.6Z'), 3, M0)
  F.strokes(lines('M5.9 12.4C4.2 14.4 2.8 16.4 3.4 18.6C4 20.6 6.6 21.1 8.2 19.6'), 2.7, M0, Kf)
  // the pointer: a big gunmetal arrow, its tip inside the loop
  const Af = F.region(rings('M12.4 10.4L12.4 21L15.2 18.4L17.4 22.4L19.7 21.2L17.5 17.3L21.2 17.1Z'), M0)
  const gap = F.offset(F.copy(Af), -0.42)
  const seam = F.intersect(F.copy(gap), Kf)
  const K = F.open(minus(Kf, gap), 0.32)
  const A = F.open(Af, 0.32)
  const sil = F.copy(Kf); F.union(sil, Af)
  const Ls = layers({ T: {}, K, Af: A, Ab: null, S: null, sil, txt: null, seam })
  return emit(Ls, name, 0)
}
