// forge/hand/chrome/images.mjs — two stacked chrome picture frames: a back frame peeking out up and to the right,
// parted from the front frame by a clean dark channel, and in the front frame a bold gunmetal sun and a two-peak
// mountain. The generated drawing lost the back frame and muddied the scene; here both frames are solid chrome slabs and
// the scene is two crisp gunmetal inlays. Painted with the style's own layer recipe (_chrome-core layers/emit).
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const M0 = 0.7
const f = v => Math.round(v * 100) / 100
const disc = (cx, cy, r) => `M${f(cx + r)} ${cy}A${r} ${r} 0 1 1 ${f(cx - r)} ${cy}A${r} ${r} 0 1 1 ${f(cx + r)} ${cy}Z`
const rr = (x0, y0, x1, y1, r) =>
  `M${x0 + r} ${y0}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`
const minus = (A, B) => F.subtract(F.copy(A), B)

export default function render(icon) {
  const name = (icon && icon.name) || 'images'
  const front = F.region(rings(rr(2.2, 8, 18.2, 21.8, 2.2)), 1.4)
  const back = F.region(rings(rr(5.8, 2.2, 21.8, 16, 2.2)), M0)
  // a dark channel between the frames, where the front one overlaps the back one
  const Kf = minus(back, F.offset(F.copy(front), -0.85))
  F.union(Kf, front)
  // the scene: a sun and a two-peak mountain, gunmetal, cleared from the chrome by a seam
  const Af = F.region(rings(disc(13.9, 12.5, 1.9)), M0)
  F.region(rings('M4.6 19.4L8.6 13.4C8.9 12.9 9.5 12.9 9.8 13.4L11.2 15.6L12.3 14.1C12.6 13.7 13.2 13.7 13.5 14.1L16 19.4Z'), M0, Af)
  const gap = F.offset(F.copy(Af), -0.42)
  const seam = F.intersect(F.copy(gap), Kf)
  const K = F.open(minus(Kf, gap), 0.32)
  const A = F.open(Af, 0.32)
  const Ls = layers({ T: {}, K, Af: A, Ab: null, S: null, sil: F.copy(Kf), txt: null, seam })
  return emit(Ls, name, 0)
}
