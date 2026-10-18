// forge/hand/chrome/turtle.mjs: a turtle in side view. A tall chrome dome of a shell spanning the grid, a gunmetal hexagon
// scute set into its crown (parted by a seam) with four grooves running out to the rim, so the shell reads as a plate
// pattern; behind it in gunmetal the head on a neck at the right with an eye, four long, well-parted legs and a tail.
// Painted with the style's own layer recipe.
import * as F from '../../styles/_chrome-field.mjs'
import { parsePath } from '../../kernel/geom.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

const S = 0.88, OX = -0.2, OY = -0.55, M0 = 0.7
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const subs = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => subs(d).map(s => s.pts)
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)
const disc = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`

// the dome, flat underneath at y=14
const SHELL = 'M2.2 14.2C2.2 7.4 5.5 3.6 10.2 3.6C14.9 3.6 18.2 7.4 18.2 14.2Z'
// the hexagon scute on its crown, and the seams from its points out to the rim
const HEX = 'M8.6 6.5H11.8L13.1 8.8L11.8 11.1H8.6L7.3 8.8Z'
const SEAMS = ['M7.3 8.8L4.6 9.1', 'M13.1 8.8L15.8 9.1', 'M8.6 11.1L6.8 12.5', 'M11.8 11.1L13.6 12.5']
// behind the shell: head and neck at the right, four legs, a tail at the left
const HEAD = disc(20.5, 9.6, 2.6)
const NECK = 'M16.4 14.4C16.6 12 17.6 10.6 19 9.8L21 12.4C20 13.4 19.2 14 18.2 14.5Z'
const LEGS = [3.2, 7.2, 11.2, 15.2].map(x => `M${x} 12.5H${x + 2.2}V16.2A1.1 1.1 0 0 1 ${x} 16.2Z`)
const TAIL = 'M3.2 11.8L0.3 14.2Q0.4 15.1 1.3 15.1L3.4 14.4Z'
const EYE = disc(21.2, 9, 0.6)

export default function render(icon) {
  const name = (icon && icon.name) || 'turtle'
  const fK = F.region(rings(SHELL), M0)
  const fAb = F.field(M0)
  for (const d of [HEAD, NECK, TAIL, ...LEGS]) F.region(rings(d), M0, fAb)
  const eye = F.region(rings(EYE), M0)
  F.subtract(fAb, eye)
  // the hexagon sits in front of the shell, parted by a seam
  const fAf = F.region(rings(HEX), M0)
  const gap = F.offset(F.copy(fAf), -0.4)
  const seam = F.intersect(F.copy(gap), fK)
  const K0 = F.subtract(F.copy(fK), gap)
  // grooves from the hexagon to the rim, cut clean through the chrome
  const grooves = F.field(M0)
  for (const d of SEAMS) F.strokes(subs(d), 0.7, M0, grooves)
  F.subtract(K0, grooves)
  const Ab = fAb
  const sil = F.union(F.union(F.copy(fK), fAb), F.copy(fAf))
  const M = { T: {}, K: F.open(K0, 0.32), Af: F.open(F.copy(fAf), 0.32), Ab: F.open(Ab, 0.32), S: null, sil, txt: null, seam }
  const Ls = layers(M)
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 9000; t++) out = emit(Ls, name, t)
  return out
}
