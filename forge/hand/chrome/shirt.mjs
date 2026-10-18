// forge/hand/chrome/shirt.mjs: the plain tee of the line version as ONE polished chrome body, sleeves and torso in a
// single shape with a shallow scooped neck. The generated drawing carved a collar cutout and ran the dark horizon across
// the sleeves and chest, so the lower half read as a separate dark blob; here the horizon is a soft, low band and the
// whole shirt keeps one continuous metallic gradient.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, col } from '../../styles/_chrome-core.mjs'

const S = 0.88, OX = -0.2, OY = -0.55
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const M0 = 0.7
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)

const TEE = 'M9.2 3.6L4.3 5.6Q3.6 5.9 3.3 6.6L1.9 10.3Q1.7 10.9 2.3 11.2L6 12.7V19.9Q6 21.6 7.7 21.6H16.3Q18 21.6 18 19.9V12.7L21.7 11.2Q22.3 10.9 22.1 10.3L20.7 6.6Q20.4 5.9 19.7 5.6L14.8 3.6Q14.3 5.9 12 5.9Q9.7 5.9 9.2 3.6Z'

export default function render() {
  const Kf = F.field()
  F.region(rings(TEE), M0, Kf)
  const Kb = F.open(Kf, 0.32)
  const Ls = layers({ T: {}, K: Kb, Af: null, Ab: null, S: null, sil: F.copy(Kb), txt: null, seam: null })
  // soften the horizon: no dark band, and the ground ramp starts from mid steel instead of gunmetal, so the shirt reads as one metal piece
  Ls.list = Ls.list.filter(L => !(typeof L.fill === 'string' && L.fill.includes('chrome-ink')))
  let out = emit(Ls, 'shirt', 0)
  const soften = o => { for (const n of o) if (n[0] === 'defs') for (const g of n[2]) {
    const st = g[2]
    if (String(st[0][1]['stop-color']).includes('chrome-c3')) { st[0][1]['stop-color'] = col('c1'); st[0][1].offset = 0.5 }
  } return o }
  soften(out)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = soften(emit(Ls, 'shirt', t))
  return out
}
