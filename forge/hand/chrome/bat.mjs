// forge/hand/chrome/bat.mjs: a bat in flight: two chrome wings with three scalloped points along the lower edge and a
// bright membrane, and a separate gunmetal head and body with pointed ears and glowing eyes, parted from the wings by
// a clear gap. The generated drawing fused wings and body into one dark blob; here the wing fingers and the eared head
// are what make it a bat.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, col } from '../../styles/_chrome-core.mjs'

const S = 0.88, OX = -0.2, OY = -0.55
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const M0 = 0.7
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)
const loopsOf = Fd => F.contour(F.copy(Fd)).filter(l => l.length > 2)

// right wing (mirrored for the left): shoulder, long arm to the tip, then three scallops back along the lower edge
const WING = 'M15.4 7.4Q18.4 2.6 23.8 2.8Q23.4 8.2 22.4 13.4Q20.6 10.8 19.2 13.8Q18.4 16.8 16.8 18.4Q16.4 15.2 15.4 14.4Z'
const mir = d => d.replace(/(-?\d+\.?\d*) (-?\d+\.?\d*)/g, (_, x, y) => `${+(24 - x).toFixed(2)} ${y}`)
const WINGS = WING + mir(WING)
// head with two pointed ears, tapering to a small body
const BODY = 'M8.6 1.2L11 4.2Q12 4 13 4.2L15.4 1.2L16 7.6Q16 10.4 14.2 11.6L13.4 16.2Q13 17.6 12 17.6Q11 17.6 10.6 16.2L9.8 11.6Q8 10.4 8 7.6Z'
const circ = (x, y, r) => `M${x + r} ${y}A${r} ${r} 0 1 1 ${x - r} ${y}A${r} ${r} 0 1 1 ${x + r} ${y}Z`
const EYES = circ(10.4, 7.4, 0.8) + circ(13.6, 7.4, 0.8)

export default function render() {
  const Kf = F.copy(F.field())
  F.region(rings(WINGS), M0, Kf)
  const Kb = F.open(Kf, 0.25)
  const Af = F.copy(F.field())
  F.region(rings(BODY), M0, Af)
  const gap = F.offset(F.copy(Kb), 0.3)
  const Ab = F.open(F.subtract(Af, gap), 0.2)
  const sil = F.copy(Kb); F.union(sil, Ab)
  const Ls = layers({ T: {}, K: Kb, Af: null, Ab, S: null, sil, txt: null, seam: null })
  const eyes = F.field(); F.region(rings(EYES), M0, eyes)
  Ls.list.push({ loops: loopsOf(eyes), fill: col('shine'), cls: 'wm-a', q: 'body' })
  let out = emit(Ls, 'bat', 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, 'bat', t)
  return out
}
