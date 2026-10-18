// forge/hand/chrome/trending-down.mjs — a fat chrome zigzag falling to the right into one solid gunmetal arrowhead
// (a rounded right-angle wedge) seated on its end with a dark parting seam; the mirror of chrome trending-up. The
// generated head was two thin gunmetal rods laid over the tube's end, which tangled with its rim and vanished at 16px;
// here the head is a filled wedge about twice the line's weight. Painted with the style's own layer recipe (_chrome-core).
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

// the line runs on into the head's middle; the head is a right-angle wedge with its corner at the skeleton's tip
const LINE = 'M2.75 6.5L8.5 12.25L12.5 8.25L17.75 13.5'
const HEAD = 'M14.75 17.25H20.75V11.25Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'trending-down'
  const Kf = F.strokes(lines(LINE), 3, M0)
  // the head: the wedge filled and thickened by a rim, so its corners come out round and its weight beats the line's
  const Af = F.strokes(lines(HEAD), 1.3, M0)
  F.region(rings(HEAD), M0, Af)
  const gap = F.offset(F.copy(Af), -0.42)
  const seam = F.intersect(F.copy(gap), Kf)
  const K = F.open(minus(Kf, gap), 0.32)
  const A = F.open(Af, 0.32)
  const sil = F.copy(Kf); F.union(sil, Af)
  const Ls = layers({ T: {}, K, Af: A, Ab: null, S: null, sil, txt: null, seam })
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  return out
}
