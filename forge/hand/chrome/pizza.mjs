// forge/hand/chrome/pizza.mjs — a chrome pizza wedge with its crust as a fat rolled gunmetal rim along the arc and three
// enamel pepperoni on the slice. The generated drawing cut an inner arc and a ringed centre dot through the wedge, which
// read as a Wi-Fi or radio sign; here the wedge stays one solid shape, the crust is its outer edge, and the toppings are
// three plain discs spread over the slice, so it reads as a slice of pizza at 24 and 16px. Painted with the style's own layer recipe.
import * as F from '../../styles/_chrome-field.mjs'
import { parsePath } from '../../kernel/geom.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55, M0 = 0.7, MS = 1.15
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const subs = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => subs(d).map(s => s.pts)
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)
const smooth = r => r.map((p, i) => { const a = r[(i - 1 + r.length) % r.length], b = r[(i + 1) % r.length]; return [(a[0] + 2 * p[0] + b[0]) / 4, (a[1] + 2 * p[1] + b[1]) / 4] })
const disc = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`

const WEDGE = 'M3.25 20.75L9 3.25A13.5 13.5 0 0 1 20.75 15Z'
const CRUST = 'M9 3.25A13.5 13.5 0 0 1 20.75 15'
const PEPPERONI = [disc(10.5, 10, 1.7), disc(14.75, 13.75, 1.7), disc(8.75, 15.75, 1.7)]

export default function render(icon) {
  const name = (icon && icon.name) || 'pizza'
  const fK = F.region(rings(WEDGE), M0)
  const fA = F.strokes(subs(CRUST), 2.8, M0)
  const fS = F.field(MS)
  for (const d of PEPPERONI) F.region(rings(d), MS, fS)
  // the crust sits in front of the slice (a dark parting seam); the toppings lie on the slice itself
  const gap = F.offset(F.copy(fA), -0.42)
  const seam = F.intersect(F.copy(gap), fK)
  const K0 = F.subtract(F.copy(fK), gap)
  const sil = F.union(F.union(F.copy(fK), fA), fS)
  const M = { T: {}, K: F.open(K0, 0.32), Af: F.open(F.copy(fA), 0.32), Ab: null, S: fS, sil, txt: null, seam }
  const Ls = layers(M)
  // a topping is a flat enamel disc in a thin dark rim, not a jewel in a chrome bezel (a bezel made each one a ring)
  const flat = F.contour(F.offset(F.copy(fS), 0.22)).filter(l => l.length > 2).map(smooth)
  Ls.list = Ls.list.filter(L => !(L.cls === 'wm-s' && Array.isArray(L.fill) && L.fill[0] === 'bevel'))
  // (and each disc gets its own glossy ramp, so the top one is not washed white by the others' span)
  const box = l => [Math.min(...l.map(p => p[0])), Math.min(...l.map(p => p[1])), Math.max(...l.map(p => p[0])), Math.max(...l.map(p => p[1]))]
  Ls.list = Ls.list.flatMap(L => L.cls === 'wm-s' && Array.isArray(L.fill) && L.fill[0] === 'enamel' ? flat.map(l => ({ ...L, loops: [l], fill: ['enamel', box(l)] })) : [L])
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  return out
}
