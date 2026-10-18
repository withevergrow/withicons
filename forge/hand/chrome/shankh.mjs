// forge/hand/chrome/shankh.mjs — a conch: a plump polished shell with a pointed spire tip, two gunmetal whorl bands and a
// ridged mouthpiece flange on the right, set off from the body by a dark parting groove.
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
  const name = (icon && icon.name) || 'shankh'
  // a conch lying diagonally: spire tip up-left, plump whorl body, flared lip on the right around a dark mouth
  // drawn level (spire left, mouth right) then turned DEG about the centre
  const DEG = 36, c = Math.cos(DEG * Math.PI / 180), sn = Math.sin(DEG * Math.PI / 180), OX = 0.3, OY = -0.3
  const f2 = v => (Math.round(v * 100) / 100)
  const rp = str => str.replace(/(-?[\d.]+) (-?[\d.]+)/g, (_, x, y) => {
    const dx = +x - 12, dy = +y - 12
    return f2(12 + OX + dx * c - dy * sn) + ' ' + f2(12 + OY + dx * sn + dy * c)
  })
  const ell = (cx, cy, rx, ry) => { const k = 0.5523
    return `M${cx + rx} ${cy}C${cx + rx} ${cy + ry * k} ${cx + rx * k} ${cy + ry} ${cx} ${cy + ry}C${cx - rx * k} ${cy + ry} ${cx - rx} ${cy + ry * k} ${cx - rx} ${cy}C${cx - rx} ${cy - ry * k} ${cx - rx * k} ${cy - ry} ${cx} ${cy - ry}C${cx + rx * k} ${cy - ry} ${cx + rx} ${cy - ry * k} ${cx + rx} ${cy}Z` }
  const tip = 'M1.2 12C2.8 11.2 4 10.6 5.2 10.2L5.2 13.8C4 13.4 2.8 12.8 1.2 12Z'
  const parts = [tip, ell(4.6, 12, 1.6, 1.9), ell(7.4, 12, 2.6, 3.4), ell(12.8, 12, 6.6, 6.4), ell(19.2, 12, 3, 5.8)]
  return make(name, {
    k: reg(...parts.map(rp)),
    a: un(reg(rp(ell(19.8, 12, 1.7, 3.8))), line(0.9, rp('M12.6 6.4C11.4 9.4 11.4 14.6 12.6 17.6'))),
  })
}
