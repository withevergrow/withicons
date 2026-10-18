// forge/hand/chrome/search.mjs — a chrome magnifying glass: a fat polished chrome rim round a clear open lens (the hole
// runs clean through, with one short chrome glint curved inside it) and a thick gunmetal handle running out behind the
// rim. The generated lens was a solid chrome disc with a stray arc groove and a hairline handle; an open glass with a
// bold handle is what reads as "search" at 16px. Same placement and paint as the generator (_chrome-core.mjs).
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55, M0 = 0.7
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const reg = (d, into = null) => F.region(rings(d), M0, into)
const minus = (A, B) => F.subtract(F.copy(A), B)
const disc = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)

const CX = 10, CY = 10
const GLINT = 'M6.4 11A3.7 3.7 0 0 1 9.4 6.5'
const HANDLE = 'M15.4 15.4L20.6 20.6'

export default function render(icon) {
  const name = (icon && icon.name) || 'search'
  const rim = minus(reg(disc(CX, CY, 7.6)), reg(disc(CX, CY, 4.6)))
  const glint = F.strokes(lines(GLINT), 1.35, M0)
  const K = F.open(F.union(rim, glint), 0.3)
  const Ab = F.open(F.strokes(lines(HANDLE), 3.3, M0), 0.3)
  const sil = F.union(F.copy(K), Ab)
  // the lens stays open: no shadow inside the glass
  const Ls = layers({ T: { noGlint: true }, K, Af: null, Ab, S: null, sil, txt: null, seam: null })
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  return out
}
