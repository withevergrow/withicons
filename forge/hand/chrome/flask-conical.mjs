// forge/hand/chrome/flask-conical.mjs: an Erlenmeyer flask, a lipped neck widening to a broad rounded base, in polished
// chrome; gunmetal liquid sits in its lower belly (the moving part, parted from the glass by a seam) and one enamel
// bubble rises in the empty glass. The generated drawing stroked the outline into a squat banded shape; here the flask
// is one solid body so the chrome reflection runs over the whole cone. Painted with the style's own layer recipe.
import * as F from '../../styles/_chrome-field.mjs'
import { parsePath } from '../../kernel/geom.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

const S = 0.88, OX = -0.2, OY = -0.55, M0 = 0.7, MS = 1.15
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)
const disc = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`
const smooth = r => r.map((p, i) => { const a = r[(i - 1 + r.length) % r.length], b = r[(i + 1) % r.length]; return [(a[0] + 2 * p[0] + b[0]) / 4, (a[1] + 2 * p[1] + b[1]) / 4] })

const LIP = 'M7.5 2.5H16.5A1 1 0 0 1 17.5 3.5V3.75A1 1 0 0 1 16.5 4.75H7.5A1 1 0 0 1 6.5 3.75V3.5A1 1 0 0 1 7.5 2.5Z'
const BODY = 'M9.25 4H14.75V9L20 18A2 2 0 0 1 18.25 21.25H5.75A2 2 0 0 1 4 18L9.25 9Z'
// the liquid's surface, a gentle slosh; everything below it, inside the glass, is liquid
const SURFACE = 'M0 14.6Q6 13.2 12 14.6Q18 16 24 14.6V24H0Z'
const BUBBLE = disc(12, 10.6, 1.3)

export default function render(icon) {
  const name = (icon && icon.name) || 'flask-conical'
  const fK = F.region(rings(BODY), M0)
  F.region(rings(LIP), M0, fK)
  // liquid: the glass shrunk by a rim, cut at the surface
  const inner = F.offset(F.region(rings(BODY), 2.2), 1.05)
  const fA = F.intersect(inner, F.region(rings(SURFACE), M0))
  const gap = F.offset(F.copy(fA), -0.3)
  const seam = F.intersect(F.copy(gap), fK)
  const K0 = F.subtract(F.copy(fK), gap)
  const fS = F.region(rings(BUBBLE), MS)
  const sil = F.union(F.copy(fK), fS)
  const M = { T: {}, K: F.open(K0, 0.32), Af: F.open(F.copy(fA), 0.32), Ab: null, S: fS, sil, txt: null, seam }
  const Ls = layers(M)
  // the bubble is a flat enamel disc in a thin dark rim, not a jewel in a bezel
  const flat = F.contour(F.offset(F.copy(fS), 0.22)).filter(l => l.length > 2).map(smooth)
  const box = l => [Math.min(...l.map(p => p[0])), Math.min(...l.map(p => p[1])), Math.max(...l.map(p => p[0])), Math.max(...l.map(p => p[1]))]
  Ls.list = Ls.list.filter(L => !(L.cls === 'wm-s' && Array.isArray(L.fill) && L.fill[0] === 'bevel'))
  Ls.list = Ls.list.flatMap(L => L.cls === 'wm-s' && Array.isArray(L.fill) && L.fill[0] === 'enamel' ? flat.map(l => ({ ...L, loops: [l], fill: ['enamel', box(l)] })) : [L])
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  return out
}
