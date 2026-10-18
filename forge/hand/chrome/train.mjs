// forge/hand/chrome/train.mjs: a train seen from the front. A polished chrome cab with a rounded roof, two big gunmetal
// windscreen panes set in it (parted from the body by a seam, with a chrome pillar between), two round enamel
// headlights on the nose and two short sloped rails under it. The generated drawing cut one zipper-like groove down the
// middle; here the face reads as a front-on train. Painted with the style's own layer recipe.
import * as F from '../../styles/_chrome-field.mjs'
import { parsePath } from '../../kernel/geom.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

const S = 0.88, OX = -0.2, OY = -0.55, M0 = 0.7, MS = 1.15
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const subs = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => subs(d).map(s => s.pts)
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)
const disc = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`
const smooth = r => r.map((p, i) => { const a = r[(i - 1 + r.length) % r.length], b = r[(i + 1) % r.length]; return [(a[0] + 2 * p[0] + b[0]) / 4, (a[1] + 2 * p[1] + b[1]) / 4] })

// the cab: a rounded roof, a square-ish chin
const BODY = 'M8.5 2.25H15.5A4.75 4.75 0 0 1 20.25 7V16A2.25 2.25 0 0 1 18 18.25H6A2.25 2.25 0 0 1 3.75 16V7A4.75 4.75 0 0 1 8.5 2.25Z'
// two windscreen panes, a pillar between
const PANE_L = 'M5.6 10V7.6A2.6 2.6 0 0 1 8.2 5H11.2V10Z'
const PANE_R = 'M12.8 5H15.8A2.6 2.6 0 0 1 18.4 7.6V10H12.8Z'
const RAIL = ['M7.75 18L5.5 21.5', 'M16.25 18L18.5 21.5']
const LIGHTS = [disc(7.9, 14, 1.5), disc(16.1, 14, 1.5)]

export default function render(icon) {
  const name = (icon && icon.name) || 'train'
  const fK = F.region(rings(BODY), M0)
  F.strokes(RAIL.flatMap(d => subs(d)), 2.3, M0, fK)
  const fAf = F.field(M0)
  for (const d of [PANE_L, PANE_R]) F.region(rings(d), M0, fAf)
  const fS = F.field(MS)
  for (const d of LIGHTS) F.region(rings(d), MS, fS)
  // the panes sit in front of the body, parted by a seam
  const gap = F.offset(F.copy(fAf), -0.36)
  const seam = F.intersect(F.copy(gap), fK)
  const K0 = F.subtract(F.copy(fK), gap)
  const sil = F.union(F.union(F.copy(fK), fAf), F.copy(fS))
  const M = { T: {}, K: F.open(K0, 0.32), Af: F.open(F.copy(fAf), 0.32), Ab: null, S: fS, sil, txt: null, seam }
  const Ls = layers(M)
  // the headlights are flat enamel discs in a thin dark rim, not jewels in a bezel (a bezel made each one a ring)
  const flat = F.contour(F.offset(F.copy(fS), 0.22)).filter(l => l.length > 2).map(smooth)
  const box = l => [Math.min(...l.map(p => p[0])), Math.min(...l.map(p => p[1])), Math.max(...l.map(p => p[0])), Math.max(...l.map(p => p[1]))]
  Ls.list = Ls.list.filter(L => !(L.cls === 'wm-s' && Array.isArray(L.fill) && L.fill[0] === 'bevel'))
  Ls.list = Ls.list.flatMap(L => L.cls === 'wm-s' && Array.isArray(L.fill) && L.fill[0] === 'enamel' ? flat.map(l => ({ ...L, loops: [l], fill: ['enamel', box(l)] })) : [L])
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 9000; t++) out = emit(Ls, name, t)
  return out
}
