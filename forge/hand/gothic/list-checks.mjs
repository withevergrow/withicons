// forge/hand/gothic/list-checks.mjs — three plain carved stone lintels with two gilded checks inlaid with
// emerald enamel beside the first and last; the generated drawing added a ruby quatrefoil stud and a pointed
// glass inlay that competed with the checks.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

const H = 2.8
const bar = (x0, y, x1) => g.rr(x0, y - H / 2, x1, y + H / 2, 1)
const CHECKS = [[[2.5, 6.2], [4.7, 8.4], [8.4, 4.1]], [[2.5, 18.2], [4.7, 20.4], [8.4, 16.1]]]

export default function render(icon) {
  const parts = [
    g.stone(g.union(bar(11.2, 6, 21.4), bar(11.2, 12, 21.4), bar(11.2, 18, 21.4))),
    g.gilt(g.stroke(CHECKS, 2.5), { plate: 'A' }),
    g.glass(g.stroke(CHECKS, 0.95), 'c4', { outline: 0.2, glint: false, glow: 0.32, plate: 'A' }),
  ]
  return paint(enamel(parts, icon))
}
