// forge/hand/chrome/hexagon.mjs — one fat polished chrome hexagon ring with an open centre: the generated drawing's faint inner ring is gone, so the shape reads at 16px.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const M0 = 0.7
const disc = (r, x = 12, y = 12) => `M${x + r} ${y}A${r} ${r} 0 1 1 ${x - r} ${y}A${r} ${r} 0 1 1 ${x + r} ${y}Z`
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)
const out = (M, name) => { const Ls = layers(M); let o = emit(Ls, name, 0); for (let t = 1; t < 3 && size(o) > 8000; t++) o = emit(Ls, name, t); return o }

const HEX = 'M12 2.6L20.2 7.3V16.7L12 21.4L3.8 16.7V7.3Z'
export default function render() {
  const K = F.strokes(lines(HEX), 3.1, M0)
  return out({ T: {}, K: F.open(K, 0.32), Af: null, Ab: null, S: null, sil: F.copy(K), txt: null, seam: null }, 'hexagon')
}
