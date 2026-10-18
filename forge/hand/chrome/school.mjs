// forge/hand/chrome/school.mjs — a polished chrome schoolhouse: a gabled main block with overhanging eaves and a round
// window in the gable, standing in front of two low gunmetal wings, a chrome flagpole rising from the ridge with a
// gunmetal pennant, and an arched gunmetal door set in on a dark seam. The generated drawing ran grooves up the wing
// joints and around the door through one chrome slab, so the arch muddied and the mass read like a backpack; here the
// pitched roof and the flag give it a building silhouette and every part is one clean mass. The eaves land on the wing
// roof (both at y 14.25) so no sliver opens between them, the pole is part of the roof
// mass and rises out of the ridge on smooth concave fillets, so the apex has no nick or wedge, and the gable window keeps 2u of chrome to the roof slopes and 1.25u to the eave line;
// the horizon and dark ground keep a clear field round it (txt) so the wall's dark band no longer runs into its ring.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55, M0 = 0.7
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const subs = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => subs(d).map(s => s.pts)
const reg = (d, into = null) => F.region(rings(d), M0, into)
const minus = (A, B) => F.subtract(F.copy(A), B)
const grow = (A, e) => F.offset(F.copy(A), -e)
const disc = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)

const MAIN = 'M5.5 14.25L10.25 9.5Q11.25 8.5 11.25 7.5V2.75A0.75 0.75 0 0 1 12.75 2.75V7.5Q12.75 8.5 13.75 9.5L18.5 14.25H17.25V21.5H6.75V14.25Z'
const WINGS = 'M2.5 21.5V16.25A2 2 0 0 1 4.5 14.25H19.5A2 2 0 0 1 21.5 16.25V21.5Z'
const FLAG = 'M12 1.75L17.25 3.75L12 5.75Z'
const DOOR = 'M10 21.5V18.25A2 2 0 0 1 14 18.25V21.5Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'school'
  const fK = reg(MAIN)
  F.subtract(fK, reg(disc(12, 12, 1)))
  // the door: gunmetal in front, on a parting seam cut into the main block
  const door = reg(DOOR)
  const g = grow(door, 0.42)
  const K = F.open(minus(fK, g), 0.3)
  const seam = F.intersect(F.copy(g), fK)
  const Af = F.open(F.intersect(door, fK), 0.2)
  // behind it: the wings and the pennant on the pole
  const Ab = reg(WINGS); reg(FLAG, Ab)
  const AbR = F.open(Ab, 0.3)
  const sil = F.copy(fK); F.union(sil, AbR)
  const Ls = layers({ T: {}, K, Af, Ab: AbR, S: null, sil, txt: reg(disc(12, 12, 2.1)), seam })
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  return out
}
