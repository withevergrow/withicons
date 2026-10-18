// forge/hand/chrome/edit.mjs: the line drawing's pencil-in-an-open-square, with the pencil set apart from the frame so it
// cannot melt into the metal (a hollow frame leaves it on paper). The frame is a chrome tube open at the top-right corner; the pencil lies across that
// opening on the same diagonal as line, parted from the slab by a dark seam: a chrome barrel, a gunmetal tip cone and a
// hot-pink eraser band (the style's enamel) at the blunt end. The generated drawing painted the pencil as one more patch
// of the same grey, so it read as a smudge. Same model and paint as the generator (_chrome-core.mjs).
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

const S = 0.88, OX = -0.2, OY = -0.55
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const M0 = 0.7
const minus = (A, B) => F.subtract(F.copy(A), B)
const grow = (A, e) => F.offset(F.copy(A), -e)

// pencil axis: tip (9,15) towards the cap centre (18.9,5.1); s along it, t across it
const R2 = Math.SQRT1_2
const at = (s, t) => [9 + (s + t) * R2, 15 + (t - s) * R2]
const slab = (s0, s1) => [[at(s0, -7), at(s1, -7), at(s1, 7), at(s0, 7)].map(tf)]

export default function render(icon) {
  const name = (icon && icon.name) || 'edit'
  // the frame: a chrome tube open at the top-right corner
  const frame = 'M10.5 5 H5 A2 2 0 0 0 3 7 V19 A2 2 0 0 0 5 21 H17 A2 2 0 0 0 19 19 V13.5'
  const fF = F.strokes(lines(frame), 2.8, M0)


  // the pencil, one blunt-capped barrel on the skeleton's diagonal
  const pen = 'M9 15 L10.06 10.4 L17.13 3.33 A2.5 2.5 0 0 1 20.67 6.87 L13.6 13.94 Z'
  const fP = F.region(rings(pen), M0)
  F.union(fP, F.strokes(lines(pen), 1.1, M0))
  const tip = F.intersect(F.copy(fP), F.region(slab(-4, 4.4), M0))
  const eras = F.intersect(F.copy(fP), F.region(slab(13.4, 20), M0))
  const gTip = grow(tip, 0.42), gEra = grow(eras, 0.42)

  // frame is parted from the whole pencil by a dark seam
  const gP = grow(fP, 0.45)
  let K = minus(fF, gP)
  const barrel = minus(minus(fP, gTip), gEra)
  F.union(K, barrel)
  K = F.open(K, 0.32)
  const seam = minus(F.intersect(F.copy(gP), fF), fP)
  F.union(seam, minus(F.intersect(F.copy(gTip), fP), tip))
  F.union(seam, minus(F.intersect(F.copy(gEra), fP), eras))
  const sil = F.copy(fF); F.union(sil, fP)
  const Ls = layers({ T: {}, K, Af: F.open(tip, 0.3), Ab: null, S: eras, sil, txt: null, seam })
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 0)
}
