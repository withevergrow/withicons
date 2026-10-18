// forge/hand/chrome/hospital.mjs — a polished chrome hospital: a tall, plain chrome tower standing in front of two low
// gunmetal wings, a bold enamel medical cross in a chrome bezel high on the tower, and a gunmetal door set in on a dark
// seam at its foot. The generated drawing cut the tower edges, the cross outline and the door as grooves through one
// chrome slab, so highlights, grooves and horizon fought each other and the cross and door blurred at 16px; here each
// part is one clean mass and the cross is the coloured signal. Same placement and paint as the generator.
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
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)

const TOWER = 'M6.5 21.5V5.25A2.25 2.25 0 0 1 8.75 3H15.25A2.25 2.25 0 0 1 17.5 5.25V21.5Z'
const WINGS = 'M2.25 21.5V13.25A2.25 2.25 0 0 1 4.5 11H19.5A2.25 2.25 0 0 1 21.75 13.25V21.5Z'
const CROSS = 'M10.85 5H13.15V7.35H15.5V9.65H13.15V12H10.85V9.65H8.5V7.35H10.85Z'
const DOOR = 'M9.75 21.5V17.25A1.25 1.25 0 0 1 11 16H13A1.25 1.25 0 0 1 14.25 17.25V21.5Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'hospital'
  const fK = reg(TOWER)
  // the door: gunmetal in front, on a parting seam cut into the tower
  const door = reg(DOOR)
  const g = grow(door, 0.42)
  // the cross: an enamel jewel, its moat a dark seam in the tower
  const fS0 = reg(CROSS, MS), fS = F.open(F.copy(fS0), 0.25)
  const moat = grow(fS0, 0.55)
  const cut = F.union(F.copy(g), moat)
  const K = F.open(minus(fK, cut), 0.32)
  const seam = F.intersect(F.copy(cut), fK)
  const Af = F.open(F.intersect(door, fK), 0.2)
  // the wings stand behind the tower
  const Ab = F.open(reg(WINGS), 0.32)
  const sil = F.copy(fK); F.union(sil, reg(WINGS))
  const Ls = layers({ T: {}, K, Af, Ab, S: fS, sil, txt: null, seam })
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  return out
}
