// forge/hand/chrome/siren.mjs — a rotating beacon: a wide enamel dome (the light itself) set in a chrome bezel on a low,
// broad chrome base, with three short enamel rays fanned out radially and a white lens
// reflection on the dome. The generated drawing made the dome chrome on a
// tall base with two near-vertical pink rays, which at 16px read as a blob with bunny ears; the coloured dome, wider and
// lower, and the radial rays clear of it make it read as a flashing light. Painted with the style's layer recipe.
import * as F from '../../styles/_chrome-field.mjs'
import { parsePath } from '../../kernel/geom.mjs'
import { layers, emit, col } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55, M0 = 0.7, MS = 1.15
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const subs = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => subs(d).map(s => s.pts)
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)

const DOME = 'M5.75 17.25V13.25A6.25 6.25 0 0 1 18.25 13.25V17.25Z'
const BASE = 'M5 16.75H19A1.75 1.75 0 0 1 20.75 18.5V19.75A1.75 1.75 0 0 1 19 21.5H5A1.75 1.75 0 0 1 3.25 19.75V18.5A1.75 1.75 0 0 1 5 16.75Z'
const LENS = 'M7.5 14.25A4.5 4.5 0 0 1 10.25 9.25'
const smooth = r => r.map((p, i) => { const a = r[(i - 1 + r.length) % r.length], b = r[(i + 1) % r.length]; return [(a[0] + 2 * p[0] + b[0]) / 4, (a[1] + 2 * p[1] + b[1]) / 4] })
const RAYS = 'M12 2V3.75M4.25 5.25L5.5 6.5M19.75 5.25L18.5 6.5'

export default function render(icon) {
  const name = (icon && icon.name) || 'siren'
  const fK = F.region(rings(BASE), M0)
  const fD = F.region(rings(DOME), MS)
  const fR = F.strokes(subs(RAYS), 2.2, MS)
  // the moat round the enamel dome cuts its seat into the base
  const K0 = F.subtract(F.copy(fK), F.offset(F.copy(fD), -0.55))
  const M = { T: {}, K: F.open(K0, 0.32), Af: null, Ab: null, S: fD, sil: F.union(F.copy(fK), fD), txt: null, seam: null }
  // the rays are painted as their own enamel pieces, so the dome keeps its own glossy top
  const R = { T: { noGlint: true }, K: null, Af: null, Ab: null, S: fR, sil: F.copy(fR), txt: null, seam: null }
  const L1 = layers(M), L2 = layers(R)
  for (const L of L2.list) if (!L.cls) L.cls = 'wm-s'
  // the lens: a white reflection curving up the left of the dome, so the enamel reads as a glass light
  const lens = { loops: F.contour(F.strokes(subs(LENS), 1.15, M0)).filter(l => l.length > 2).map(smooth), fill: col('shine'), cls: 'wm-shine', op: 0.8, q: 'sheen' }
  const Ls = { list: [...L1.list, lens, ...L2.list], glint: L1.glint }
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  return out
}
