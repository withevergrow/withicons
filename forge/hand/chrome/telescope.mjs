// forge/hand/chrome/telescope.mjs — one continuous polished chrome tube (slim eyepiece stepping up to a wide barrel,
// two fine dark band seams), resting on a gunmetal hub and a splayed gunmetal tripod set behind it. The generated
// drawing cut the tube into two loose chunks with a wide groove and fused the hub into the eyepiece, so at 16px it
// read as scraps over a wishbone; here the tube is one object, the mount a second metal behind it. Painted with the
// style's own layer recipe (_chrome-core layers/emit) on its own field engine.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, col } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const M0 = 0.7
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)
const loopsOf = Fd => F.contour(F.copy(Fd)).filter(l => l.length > 2)

// the tube, drawn along its axis (rise 1 in 2), as centrelines the chrome tube inflates
const TUBE = 'M4.78 11.05L11.04 7.92L10.63 7.12L16.45 4.21L17.7 6.71L11.89 9.62L11.48 8.82L5.22 11.95Z'
// band seams across the barrel
const SEAMS = 'M10.9 5.64L13.23 10.29M14.93 3.63L17.25 8.28'
// hub and tripod legs (gunmetal, behind the tube)
const HUB = 'M13 12.5A1 1 0 1 1 11 12.5A1 1 0 1 1 13 12.5Z'
const LEGS = 'M12 13L7 21M12 13L17 21'

export default function render() {
  const Kf = F.strokes(lines(TUBE), 2.55, M0)
  F.region(rings(TUBE), M0, Kf)
  const Kb = F.open(Kf, 0.32)
  const Af = F.strokes(lines(LEGS + HUB), 2.25, M0)
  F.region(rings(HUB), M0, Af)
  const Ab = F.open(F.subtract(Af, F.offset(F.copy(Kb), -0.05)), 0.2)
  const sil = F.copy(Kb); F.union(sil, Ab)

  const Ls = layers({ T: {}, K: Kb, Af: null, Ab, S: null, sil, txt: null, seam: null })
  // band seams: a fine dark groove with a bright lip beside it, inside the chrome's bevel
  const face = F.offset(F.copy(Kb), 0.35)
  const seam = F.intersect(F.strokes(lines(SEAMS), 0.5, M0), face)
  const lip = F.intersect(F.shift(F.strokes(lines(SEAMS), 0.32, M0), 4, 2, 1), face)
  Ls.list.push(
    { loops: loopsOf(seam), fill: col('ink'), cls: 'wm-k', q: 'body' },
    { loops: loopsOf(lip), fill: col('shine'), cls: 'wm-k', op: 0.8, q: 'body' },
  )
  let out = emit(Ls, 'telescope', 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, 'telescope', t)
  return out
}
