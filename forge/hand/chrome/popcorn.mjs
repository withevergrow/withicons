// forge/hand/chrome/popcorn.mjs — a chrome popcorn box: a tapering polished chrome tub with two wide enamel stripes
// inlaid in it (red and white in spirit, pink on the default palette) and a big puffy cloud of kernels heaped over the
// rim, parted from the tub by a dark seam. The generated box had two deep grooves that read as a grille or bars; two
// inlaid stripes and a fat bumpy cloud read as a popcorn box. Painted with the style's own layer recipe (_chrome-core).
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55, M0 = 0.7
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const reg = (d, into = null, m = M0) => F.region(rings(d), m, into)
const minus = (A, B) => F.subtract(F.copy(A), B)
const grow = (A, e) => F.offset(F.copy(A), -e)
const disc = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)

// the tub: a wide mouth tapering to a narrow, rounded foot
const TUB = 'M4 9.8H20L18 20.2A1.7 1.7 0 0 1 16.3 21.6H7.7A1.7 1.7 0 0 1 6 20.2Z'
// two stripes following the taper, running the whole height of the tub (clipped to it below)
const band = (f0, f1) => `M${4 + 16 * f0} 9H${4 + 16 * f1}L${6.6 + 11.2 * f1} 22.5H${6.6 + 11.2 * f0}Z`
const STRIPES = [band(0.16, 0.42), band(0.58, 0.84)]
// the cloud: four plump kernels over a filled base that sits on the rim
const CLOUD = [disc(6.6, 8.9, 3.1), disc(9.6, 5.9, 3.5), disc(14.6, 5.7, 3.5), disc(17.5, 8.8, 3.1), disc(12.1, 8.3, 3.7),
  'M6.6 8.6H17.5V11.4H6.6Z']

export default function render(icon) {
  const name = (icon && icon.name) || 'popcorn'
  const cloud = reg(CLOUD[0]); for (const c of CLOUD.slice(1)) reg(c, cloud)
  const tub = reg(TUB)
  const gc = grow(cloud, 0.42)
  // the tub is parted from the cloud on a dark seam; the cloud is the front piece, in the same chrome
  const seam = F.intersect(F.copy(gc), tub)
  const round = x => F.open(F.copy(x), 0.32)
  const Kt = round(minus(tub, gc))
  const body = reg(TUB, null, 1.8), clip = grow(body, -0.45)
  const stripes = F.intersect(reg(STRIPES[0], null, 1.8), clip); F.union(stripes, F.intersect(reg(STRIPES[1], null, 1.8), clip))
  const sil = F.union(F.copy(tub), cloud)
  // the tub and its stripes are the body (wm-k); the cloud of kernels in front is the moving part (parts.A bounces it)
  const Lt = layers({ T: { noGlint: true }, K: Kt, Af: null, Ab: null, S: stripes, sil, txt: null, seam })
  const Lc = layers({ T: {}, K: round(cloud), Af: null, Ab: null, S: null, sil, txt: null, seam: null })
  const list = [
    ...Lt.list.map(l => ({ ...l, cls: l.cls === 'wm-shadow' || l.cls === 'wm-shine' ? l.cls : 'wm-k' })),
    ...Lc.list.filter(l => l.cls !== 'wm-shadow').map(l => ({ ...l, cls: l.cls || 'wm-a' })),
  ]
  const Ls = { list, glint: Lc.glint }
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 9000; t++) out = emit(Ls, name, t)
  return out
}
