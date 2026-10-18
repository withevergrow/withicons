// forge/hand/chrome/lucky-coin.mjs — an old Chinese coin in polished chrome, tilted back a touch so the thickness
// shows: a fat chrome face with a clean rounded-square hole punched through, and a gunmetal edge band peeking out
// below it. No inner rings or tick marks (those read as a camera crosshair); the visible rim thickness plus the
// square hole say "coin". Painted with the style's own layer recipe (_chrome-core layers/emit).
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const M0 = 0.7
const ell = (cx, cy, rx, ry) => `M${cx + rx} ${cy}A${rx} ${ry} 0 1 1 ${cx - rx} ${cy}A${rx} ${ry} 0 1 1 ${cx + rx} ${cy}Z`
const rr = (x0, y0, x1, y1, r) =>
  `M${x0 + r} ${y0}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`

export default function render(icon) {
  const name = (icon && icon.name) || 'lucky-coin'
  const FACE = [12, 10.7, 10.2, 8.9], EDGE_DY = 2.1
  const HOLE = rr(8.7, 7.9, 15.3, 13.5, 0.9)
  const hole = () => F.region(rings(HOLE), M0)
  const Kf = F.region(rings(ell(...FACE)), M0)
  const K = F.open(F.subtract(F.copy(Kf), hole()), 0.32)
  const Ab = F.region(rings(ell(FACE[0], FACE[1] + EDGE_DY, FACE[2], FACE[3])), M0)
  F.subtract(Ab, hole())
  const sil = F.copy(Ab); F.union(sil, Kf); F.subtract(sil, hole())
  const Ls = layers({ T: {}, K, Af: null, Ab: F.open(Ab, 0.32), S: null, sil, txt: null, seam: null })
  return emit(Ls, name, 0)
}
