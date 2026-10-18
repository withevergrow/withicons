// forge/hand/chrome/ambulance.mjs — a polished chrome ambulance van: one tall body with a slanted windscreen dropping
// to a short bonnet, a clear window punched in the cab, a bold enamel medical cross in a chrome bezel on the box side,
// and two big gunmetal wheels with hubs set in on dark seams below a lifted sill. The generated drawing cut the cross,
// the window outline and the wheel arches as grooves through the body and sank small wheels into it, so the lower half
// was a tangle of rims and highlights; here every part is one clean mass. Same placement and paint as the generator.
// The windscreen is one straight slope with rounded joins (r 0.75) at the roof and at the bonnet, dropped to y 10.5
// for a clear cab step, and the window's slanted edge runs parallel to it 1.25u inside so a full chrome frame survives.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55, M0 = 0.7, MS = 1.15
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const reg = (d, m = M0, into = null) => F.region(rings(d), m, into)
const minus = (A, B) => F.subtract(F.copy(A), B)
const grow = (A, e) => F.offset(F.copy(A), -e)
const disc = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)

const BODY = 'M1.75 6.5A2.25 2.25 0 0 1 4 4.25H15.1A0.75 0.75 0 0 1 15.72 4.58L19.53 10.17A0.75 0.75 0 0 0 20.15 10.5H20.25A2 2 0 0 1 22.25 12.5V15.5A1.75 1.75 0 0 1 20.5 17.25H3.5A1.75 1.75 0 0 1 1.75 15.5Z'
const WINDOW = 'M14.25 5.75H15L17.25 9H14.25Z'
const CROSS = 'M6.6 6.5H8.9V8.85H11.25V11.15H8.9V13.5H6.6V11.15H4.25V8.85H6.6Z'
const WHEELS = [[6.5, 18.25], [17.75, 18.25]]

export default function render(icon) {
  const name = (icon && icon.name) || 'ambulance'
  const fK = reg(BODY)
  F.subtract(fK, reg(WINDOW))
  // the wheels stand in front, each on a parting seam cut into the body
  const wheels = reg(WHEELS.map(([x, y]) => disc(x, y, 2.5)).join(''))
  const g = grow(wheels, 0.42)
  // the cross: an enamel jewel, its moat a dark seam in the body
  const fS0 = reg(CROSS, MS), fS = F.open(F.copy(fS0), 0.25)
  const cut = F.union(F.copy(g), grow(fS0, 0.55))
  const K = F.open(minus(fK, cut), 0.32)
  const seam = F.intersect(F.copy(cut), fK)
  const Af = F.open(minus(wheels, reg(WHEELS.map(([x, y]) => disc(x, y, 0.85)).join(''))), 0.2)
  const sil = F.copy(fK); F.union(sil, Af)
  const Ls = layers({ T: {}, K, Af, Ab: null, S: fS, sil, txt: null, seam })
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  return out
}
