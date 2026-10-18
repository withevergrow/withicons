// forge/hand/chrome/ticket.mjs — a polished chrome admission ticket with deep side notches, its gunmetal stub cut
// clean off the chrome body by a real tear gap, the three perforation holes biting round notches into both edges.
// The generated drawing left three pea-sized holes floating on one undivided chrome slab, and a hairline seam still
// vanished on white; a true gap plus the darker stub splits ticket and stub in both themes, at 24 and 16px.
// Same placement, model and paint as the generator (_chrome-core.mjs).
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55, M0 = 0.7
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const reg = d => F.region(rings(d), M0)
const minus = (A, B) => F.subtract(F.copy(A), B)
const disc = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)

const BODY = 'M3.25 4.25H20.75A2.25 2.25 0 0 1 23 6.5V9.25A2.75 2.75 0 0 0 23 14.75V17.5A2.25 2.25 0 0 1 20.75 19.75H3.25A2.25 2.25 0 0 1 1 17.5V14.75A2.75 2.75 0 0 0 1 9.25V6.5A2.25 2.25 0 0 1 3.25 4.25Z'
const X = 16.25, GAP = 0.6
const LEFT = `M0 2H${X - GAP}V22H0Z`
const RIGHT = `M${X + GAP} 2H24V22H${X + GAP}Z`
const HOLES = [8, 12, 16].map(y => disc(X, y, 1.1)).join('')

export default function render(icon) {
  const name = (icon && icon.name) || 'ticket'
  const body = reg(BODY), holes = reg(HOLES)
  const punched = minus(body, holes)
  // the chrome body (K) and the gunmetal stub (A: the tear line pulses), parted by a real gap
  const K = F.open(F.intersect(F.copy(punched), reg(LEFT)), 0.32)
  const Af = F.open(F.intersect(F.copy(punched), reg(RIGHT)), 0.32)
  const sil = F.copy(K); F.union(sil, Af)
  const Ls = layers({ T: {}, K, Af, Ab: null, S: null, sil, txt: null, seam: null })
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  return out
}
