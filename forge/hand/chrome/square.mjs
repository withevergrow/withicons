// forge/hand/chrome/square.mjs — one fat polished chrome rounded-square frame with an open centre: the generated plate
// carried a heavy inner bevel and an inset box that made it a button; here it is a single clean beveled outline that
// matches the line square. Same model and paint as the generator (_chrome-core.mjs); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

const S = 0.88, OX = -0.2, OY = -0.55, M0 = 0.7
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)
const out = (M, name) => { const Ls = layers(M); let o = emit(Ls, name, 0); for (let t = 1; t < 3 && size(o) > 8000; t++) o = emit(Ls, name, t); return o }

const SQ = 'M6.4 3.2H17.6A3.2 3.2 0 0 1 20.8 6.4V17.6A3.2 3.2 0 0 1 17.6 20.8H6.4A3.2 3.2 0 0 1 3.2 17.6V6.4A3.2 3.2 0 0 1 6.4 3.2Z'
export default function render() {
  const K = F.strokes(lines(SQ), 3.3, M0)
  return out({ T: {}, K: F.open(K, 0.32), Af: null, Ab: null, S: null, sil: F.copy(K), txt: null, seam: null }, 'square')
}
