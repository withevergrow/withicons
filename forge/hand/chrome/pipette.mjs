// forge/hand/chrome/pipette.mjs — a slanted chrome eyedropper: a tapering glass tube with a flared collar, a gunmetal
// rubber bulb set clear of the collar by a dark parting seam, and a pink drop
// of liquid under the tip. The generated dropper fused bulb and tube into one slanted lump. Same paint as the
// generator (_chrome-core.mjs); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

const S = 0.88, OX = -0.2, OY = -0.55, M0 = 0.7, GAP = 0.42, MOAT = 0.55
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const rings = d => parsePath(d).filter(s => s.pts.length > 2).map(s => s.pts.map(tf))
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const reg = (d, m = M0) => F.region(rings(d), m)
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)

// the dropper's own frame: u along the axis from the tip toward the bulb, v across it; the axis rises to the upper right
const TX = 5.7, TY = 17.6, R = Math.SQRT1_2
const pt = (u, v) => `${(TX + (u + v) * R).toFixed(2)} ${(TY + (v - u) * R).toFixed(2)}`
const poly = (...c) => 'M' + c.map(([u, v]) => pt(u, v)).join('L') + 'Z'
const cub = (...c) => c.map(([u, v]) => pt(u, v)).join(' ')

// tube: a slim glass taper with a round tip, widening to the collar; the collar flares wider
const TUBE = `M${pt(0.9, -1.0)}L${pt(9.4, -2.4)}L${pt(9.4, 2.4)}L${pt(0.9, 1.0)}C${cub([0.1, 0.9], [0.1, -0.9], [0.9, -1.0])}Z`
const COLLAR = poly([8.6, -3.7], [12.2, -3.7], [12.2, 3.7], [8.6, 3.7])
// bulb: a rounded rubber ball-end, bulging in the middle, set over the end of the collar
const BULB = `M${pt(11.8, -2.6)}C${cub([14, -3.6], [17, -3.6], [18.6, -2.6])}C${cub([20.2, -1.7], [20.2, 1.7], [18.6, 2.6])}C${cub([17, 3.6], [14, 3.6], [11.8, 2.6])}Z`
// the drop: a teardrop hanging under the tip
const DROP = 'M3.9 19.4C4.8 20.7 5.9 21.4 5.9 22.4C5.9 23.4 5 24 3.9 24C2.8 24 1.9 23.4 1.9 22.4C1.9 21.4 3 20.7 3.9 19.4Z'

export default function render() {
  const body = F.union(reg(TUBE), reg(COLLAR))
  const fA = reg(BULB)
  const fS = reg(DROP, MOAT + 0.6)
  const g = F.offset(F.copy(fA), -GAP)
  const moat = F.offset(F.copy(fS), -MOAT)
  let K0 = F.copy(body)
  K0 = F.subtract(K0, g)
  const seam = F.subtract(F.intersect(F.copy(g), body), moat)
  K0 = F.subtract(K0, moat)
  const Af = F.subtract(F.copy(fA), moat)
  const sil = F.copy(body); F.union(sil, fA); F.union(sil, fS)
  const M = { T: {}, K: F.open(K0, 0.32), Af: F.open(Af, 0.32), Ab: null, S: fS, sil, txt: null, seam }
  const Ls = layers(M)
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  let o = emit(Ls, 'pipette', 0)
  for (let t = 1; t < 3 && size(o) > 8000; t++) o = emit(Ls, 'pipette', t)
  return o
}
