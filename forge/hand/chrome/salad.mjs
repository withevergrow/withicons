// forge/hand/chrome/salad.mjs: a footed chrome bowl in front, three gunmetal leaves fanned behind its rim and a bright
// chrome half-egg with an enamel yolk set between them. The generated version melted the greens into a grey heap and the
// yolk into a pink disc; here the leaves keep their own tips, the egg its dome. Two passes of the style's own layer
// recipe (back: leaves, egg, yolk; front: the bowl), joined into one icon with the gradient ids renumbered.
import * as F from '../../styles/_chrome-field.mjs'
import { parsePath } from '../../kernel/geom.mjs'
import { layers, emit, col } from '../../styles/_chrome-core.mjs'

const S = 0.88, OX = -0.2, OY = -0.55, M0 = 0.7, MS = 1.15
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)
const ell = (cx, cy, rx, ry) => `M${cx + rx} ${cy}A${rx} ${ry} 0 1 1 ${cx - rx} ${cy}A${rx} ${ry} 0 1 1 ${cx + rx} ${cy}Z`

const BOWL = 'M2.75 12.5H21.25C21 17.6 18 19.75 14.5 19.75H9.5C6 19.75 3 17.6 2.75 12.5Z'
const FOOT = 'M8.75 19.5H15.25V21.5A.75.75 0 0 1 14.5 22.25H9.5A.75.75 0 0 1 8.75 21.5Z'
const LEAF_L = 'M10.5 13.5C4 13.25 2 9 2.5 4.75C8.75 5 12.5 8.5 10.5 13.5Z'
const LEAF_M = 'M8.5 12.5C7.75 8 8.75 4.5 11.75 2.25C14.5 5 14.75 9.5 13.25 13.5Z'
const EGG = ell(16.4, 10.6, 3.7, 3.2)
const YOLK = ell(16.4, 10.1, 1.5, 1.5)

function join(a, b) {
  const da = a[0] && a[0][0] === 'defs' ? a[0][2] : [], db = b[0] && b[0][0] === 'defs' ? b[0][2] : []
  const na = da.length
  const re = id => id.replace(/-(\d+)$/, (_, n) => '-' + (+n + na))
  const fix = n => n[0] === 'defs' ? n : [n[0], n[1] && typeof n[1].fill === 'string' ? { ...n[1], fill: n[1].fill.replace(/url\(#([^)]+)\)/, (_, id) => `url(#${re(id)})`) } : n[1]]
  const defs = [...da, ...db.map(g => ['linearGradient', { ...g[1], id: re(g[1].id) }, g[2]])]
  const rest = [...a.filter(n => n[0] !== 'defs'), ...b.filter(n => n[0] !== 'defs').map(fix)]
  return defs.length ? [['defs', {}, defs], ...rest] : rest
}

export default function render(icon) {
  const name = (icon && icon.name) || 'salad'
  // back: leaves (gunmetal), egg (chrome), yolk (enamel)
  // two leaves, the upright one parted from the leaning one by a thin gap
  const fL = F.region(rings(LEAF_L), M0), fM = F.region(rings(LEAF_M), M0)
  const fAb = F.union(F.subtract(F.copy(fL), F.offset(F.copy(fM), -0.12)), fM)
  const fK = F.region(rings(EGG), M0)
  const fS = F.region(rings(YOLK), MS)
  const K0 = F.copy(fK)
  const Ab = F.subtract(F.copy(fAb), F.offset(F.copy(fK), -0.4))
  const sil = F.union(F.union(F.copy(fK), fAb), F.copy(fS))
  const back = layers({ T: {}, K: F.open(K0, 0.32), Af: null, Ab: F.open(Ab, 0.32), S: fS, sil, txt: null, seam: null })
  back.glint = null
  // the egg white is bright all through: no dark horizon across it
  back.list = back.list.filter(L => !(L.cls === 'wm-k' && ((Array.isArray(L.fill) && L.fill[0] === 'ground') || L.fill === col('ink'))))
  // the yolk is a flat enamel disc in a thin dark rim lying on the egg, not a jewel in a bezel
  const smooth = r => r.map((p, i) => { const a = r[(i - 1 + r.length) % r.length], b = r[(i + 1) % r.length]; return [(a[0] + 2 * p[0] + b[0]) / 4, (a[1] + 2 * p[1] + b[1]) / 4] })
  const flat = F.contour(F.offset(F.copy(fS), 0.22)).filter(l => l.length > 2).map(smooth)
  const box = l => [Math.min(...l.map(p => p[0])), Math.min(...l.map(p => p[1])), Math.max(...l.map(p => p[0])), Math.max(...l.map(p => p[1]))]
  back.list = back.list.filter(L => !(L.cls === 'wm-s' && Array.isArray(L.fill) && L.fill[0] === 'bevel'))
  back.list = back.list.flatMap(L => L.cls === 'wm-s' && Array.isArray(L.fill) && L.fill[0] === 'enamel' ? flat.map(l => ({ ...L, loops: [l], fill: ['enamel', box(l)] })) : [L])
  for (const L of back.list) if (!L.cls) L.cls = 'wm-k'
  // front: the bowl on its foot
  const fB = F.region(rings(BOWL), M0)
  F.region(rings(FOOT), M0, fB)
  const front = layers({ T: {}, K: F.open(F.copy(fB), 0.32), Af: null, Ab: null, S: null, sil: F.copy(fB), txt: null, seam: null })
  for (const L of front.list) if (!L.cls) L.cls = 'wm-k'
  let tier = 0, out = join(emit(back, name, tier), emit(front, name, tier))
  for (tier = 1; tier < 3 && size(out) > 9000; tier++) out = join(emit(back, name, tier), emit(front, name, tier))
  return out
}
