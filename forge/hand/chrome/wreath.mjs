// forge/hand/chrome/wreath.mjs — a bumpy leafy wreath (a ring of overlapping lobes round an open centre), three pink
// berries and a pink bow at the foot. The generated ring was smooth and read as a washer.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { K, layers, emit } from '../../styles/_chrome-core.mjs'

// exact geometry, no inflation: each part is drawn at its final size, fields compose the chrome pieces, the shared
// chrome paint (_chrome-core layers) does the rest
const disc = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`
const minus = (A, B) => F.subtract(F.copy(A), B)
const any = f => F.any(f)
const reg = (...ds) => { const f = F.field(K.M); for (const d of ds) for (const s of parsePath(d)) if (s.pts.length > 2) F.region([s.pts], K.M, f); return f }
const line = (w, ...ds) => { const f = F.field(K.M); for (const d of ds) for (const s of parsePath(d)) F.strokes([{ pts: s.pts, closed: false }], w, K.M, f); return f }
const pill = (w, a, b) => F.strokes([{ pts: [a, b], closed: false }], w, K.M)
const un = (...fs) => { const o = F.field(K.M); for (const f of fs) if (f) F.union(o, f); return o }
function make(name, { k, cut, hole, a, aCut, s }) {
  let K0 = k, sil = k
  if (cut) K0 = minus(K0, cut)
  if (hole) { K0 = minus(K0, hole); sil = minus(sil, hole) }
  let Af = a ? (aCut ? minus(a, aCut) : a) : null, seam = null
  if (a) { const g = F.offset(F.copy(a), -K.GAP); seam = F.intersect(F.copy(g), K0); K0 = minus(K0, g) }
  let S = s || null
  if (S) { const m = F.offset(F.copy(S), -K.MOAT); K0 = minus(K0, m); if (Af) Af = minus(Af, m); if (seam) seam = minus(seam, m) }
  const rd = f => (f && any(f)) ? F.open(f, K.ROUND) : f
  sil = un(sil, a, s)
  const M = { T: {}, K: rd(K0), Af: rd(Af), Ab: null, S, sil, txt: null, seam: seam && any(seam) ? seam : null }
  return emit(layers(M), name, 0)
}
const at = (R, deg) => { const t = deg * Math.PI / 180; return [+(12 + R * Math.cos(t)).toFixed(2), +(10.2 + R * Math.sin(t)).toFixed(2)] }
export default function render(icon) {
  const name = (icon && icon.name) || 'wreath'
  const lobes = Array.from({ length: 10 }, (_, i) => { const [x, y] = at(6.7, i * 36 - 90); return disc(x, y, 2.6) })
  return make(name, {
    k: reg(disc(12, 10.2, 6.7), ...lobes),
    hole: reg(disc(12, 10.2, 3.6)),
    s: un(...[-135, -30, 20].map(g => { const [x, y] = at(6.7, g); return reg(disc(x, y, 1.5)) }),
      reg('M11.5 19.6L6 17.4V21.8Z', 'M12.5 19.6L18 17.4V21.8Z', disc(12, 19.6, 1.1))),
  })
}
