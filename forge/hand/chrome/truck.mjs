// forge/hand/chrome/truck.mjs — a polished chrome delivery truck: a tall cargo box and a lower cab with a slanted
// windscreen, parted by a slot above the chassis, a clear window punched in the cab, and two big gunmetal wheels with
// hubs set in on dark seams. The generated drawing fused box and cab into one slab, with small wheels whose seams and
// hub holes tangled into a muddy band along the bottom at 24 and 16px. Same placement and paint as the generator.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55, M0 = 0.7
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const reg = (d, into = null) => F.region(rings(d), M0, into)
const minus = (A, B) => F.subtract(F.copy(A), B)
const grow = (A, e) => F.offset(F.copy(A), -e)
const disc = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)

const BOX = 'M1.5 6.5A2 2 0 0 1 3.5 4.5H12.25A2 2 0 0 1 14.25 6.5V16.75H3A1.5 1.5 0 0 1 1.5 15.25Z'
const CAB = 'M15.25 8.75H18.25A1.5 1.5 0 0 1 19.4 9.29L22.4 12.85A1.5 1.5 0 0 1 22.75 13.82V15.25A1.5 1.5 0 0 1 21.25 16.75H15.25Z'
const CHASSIS = 'M13.5 14.5H16V16.75H13.5Z'
const WINDOW = 'M16.75 10.5H17.9A0.75 0.75 0 0 1 18.47 10.77L20.5 13.25H16.75Z'
const WHEELS = [[6, 18], [18.5, 18]]

export default function render(icon) {
  const name = (icon && icon.name) || 'truck'
  const fK = reg(BOX); reg(CAB, fK); reg(CHASSIS, fK)
  F.subtract(fK, reg(WINDOW))
  // the wheels stand in front, each on a parting seam cut into the body
  const wheels = reg(WHEELS.map(([x, y]) => disc(x, y, 2.4)).join(''))
  const g = grow(wheels, 0.42)
  const K = F.open(minus(fK, g), 0.32)
  const seam = F.intersect(F.copy(g), fK)
  const Af = F.open(minus(wheels, reg(WHEELS.map(([x, y]) => disc(x, y, 0.8)).join(''))), 0.2)
  const sil = F.copy(fK); F.union(sil, Af)
  const Ls = layers({ T: {}, K, Af, Ab: null, S: null, sil, txt: null, seam })
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  return out
}
