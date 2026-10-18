// forge/hand/chrome/mehndi-hand.mjs — a chunky open palm: four fat fingers of different length and a thumb in polished
// chrome, split by dark finger grooves, with a gunmetal henna flower inlaid at the centre of the palm.
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
const petals = (cx, cy, R, r) => { const ds = []; for (let i = 0; i < 6; i++) { const t = i * Math.PI / 3 - Math.PI / 2; ds.push(disc(+(cx + R * Math.cos(t)).toFixed(2), +(cy + R * Math.sin(t)).toFixed(2), r)) } return ds }
export default function render(icon) {
  const name = (icon && icon.name) || 'mehndi-hand'
  const fing = [[6.5, 7.6], [10.2, 4.4], [13.9, 5.2], [17.6, 8.4]]
  return make(name, {
    k: un(reg('M4.9 12H19.2V16.4C19.2 19.4 17 21.2 14.4 21.2H9.8C7.1 21.2 4.9 19.4 4.9 16.4Z'),
      ...fing.map(([x, t]) => pill(3.2, [x, t + 1.6], [x, 13])), pill(3.3, [3.4, 11.8], [6.4, 16.6])),
    a: reg(...petals(12, 16.6, 2.2, 1.3), disc(12, 16.6, 1.5)),
    aCut: reg(disc(12, 16.6, 0.7)),
  })
}
