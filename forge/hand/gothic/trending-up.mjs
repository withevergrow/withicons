// forge/hand/gothic/trending-up.mjs: the common zigzag climbing to an up-right chevron arrowhead, built as gilded
// bar-iron: one broad zigzag stroke with a notched chevron head, ruby jewels set at the two turns and an emerald
// stud at the foot as the only gothic trim; the generated sword-and-crossguard arrow is gone.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

export default function render(icon) {
  const zig = g.stroke([[3.4, 17.4], [8.7, 12.1], [12.6, 16], [20.2, 8.4]], 2.5)
  const head = g.stroke([[14.6, 5.9], [20.3, 5.9], [20.3, 11.6]], 2.5)
  const parts = [
    g.gilt(zig, { plate: 'K' }),
    g.gilt(head, { plate: 'A' }),
    g.bead(8.7, 12.1, 1.05, 'c1'),
    g.bead(12.6, 16, 1.05, 'c1'),
  ]
  return paint(enamel(parts.flat(Infinity).filter(Boolean), icon))
}
