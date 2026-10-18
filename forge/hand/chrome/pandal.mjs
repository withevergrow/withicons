// forge/hand/chrome/pandal.mjs — a festival pandal: a peaked chrome roof, two slim posts, a scalloped gunmetal valance
// hanging from the eaves and a pink diamond pendant. The generated drawing read as a Greek temple.
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
export default function render(icon) {
  const name = (icon && icon.name) || 'pandal'
  const val = 'M6.6 7.4H17.4V9.8A1.9 2.5 0 0 1 13.8 9.8A1.8 2.5 0 0 1 10.2 9.8A1.8 2.5 0 0 1 6.6 9.8Z'
  return make(name, {
    k: reg('M1.4 8.8L12 1.6L22.6 8.8Z', 'M4.2 8H6.6V21H4.2Z', 'M17.4 8H19.8V21H17.4Z'),
    a: reg(val),
    s: reg('M12 14.6L14.2 17.4L12 20.2L9.8 17.4Z'),
  })
}
