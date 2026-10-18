// forge/hand/pastel/repeat-1.mjs — the pastel repeat-one: two heavier lavender loop arrows (w 3, compact heads) that
// open a taller hole, and a much larger lit peach numeral 1 (S) centred in it, so the count still reads at 16px
// where the generated small flat 1 vanished inside the thin loop.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

const head = (x, y, dir, h = 3.75) => { const k = +(h * Math.SQRT1_2).toFixed(2); return [[x - dir * k, y - k], [x, y], [x - dir * k, y + k]] }

export default function render(icon) {
  const { stroke, bar, seg2, join } = Prim
  const w = 3
  return compose([
    ['lavender@K',
      join(stroke('M4 11.5 V9 A3.5 3.5 0 0 1 7.5 5.5 H20', w), bar(head(20, 5.5, 1), w)),
      join(stroke('M20 12.5 V15 A3.5 3.5 0 0 1 16.5 18.5 H4', w), bar(head(4, 18.5, -1), w))],
    ['peach@S', join(seg2(12.75, 9.5, 12.75, 14.5, 2.75), seg2(10.25, 10.85, 12.75, 9.5, 2.75))],
  ], icon)
}
