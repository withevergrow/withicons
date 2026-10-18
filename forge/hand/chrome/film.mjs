// forge/hand/chrome/film.mjs — a polished chrome film strip: one rounded chrome frame, four clean sprocket holes
// punched through along the top and the bottom, and a single gunmetal picture frame set in the middle on a dark seam.
// The generated strip kept every divider line as its own gunmetal bar, so the frame shattered into a busy ladder of
// small pieces (worst on dark); here the metaphor is reduced to the three things that say "film" at 16px.
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
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)
// a rounded rectangle path
const rr = (x0, y0, x1, y1, r) =>
  `M${x0 + r} ${y0}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`

export default function render() {
  const body = rr(2, 4, 22, 20, 2)
  const Kf = F.strokes(lines(body), 2.55, M0)
  F.region(rings(body), M0, Kf)
  // sprocket holes, punched clean through
  const holes = F.field(M0)
  for (const x of [3.25, 8.25, 13.25, 18.25]) for (const y of [5, 17]) F.region(rings(rr(x, y, x + 2.5, y + 2, 0.6)), M0, holes)
  // the picture frame: a gunmetal panel in front, cleared from the chrome by a dark seam
  const Af = F.region(rings(rr(4.25, 9.5, 19.75, 14.5, 1)), M0)
  const gap = F.offset(F.copy(Af), -0.42)
  const seam = F.intersect(F.copy(gap), Kf)
  const K = F.open(minus(minus(Kf, holes), gap), 0.32)
  const A = F.open(Af, 0.32)
  const sil = minus(Kf, holes)
  const Ls = layers({ T: {}, K, Af: A, Ab: null, S: null, sil, txt: null, seam })
  let out = emit(Ls, 'film', 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, 'film', t)
  return out
}
