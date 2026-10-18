// forge/hand/gothic/wrap-text.mjs — two carved stone text lintels (the long one channelled with sapphire glass) and a
// gilded line (A) that runs out, turns down round a half-round and comes back under a crisp open chevron head; the
// generated drawing ended the return in a barbed ogival head with a ruby trefoil and a knobbed tail that blurred at 16px.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

const H = 2.6
const bar = (x0, y, x1) => g.rr(x0, y - H / 2, x1, y + H / 2, 1)

export default function render(icon) {
  const parts = [
    g.stone(g.union(bar(2.6, 4.4, 21.4), bar(2.6, 18.6, 8.6))),
    g.glass(g.rr(4.1, 3.9, 19.9, 4.9, 0.5), 'c2', { outline: 0.24, glint: false, glow: 0.34 }),
    g.gilt(g.union(
      g.stroke('M3.8 11.4 H17.1 A3.6 3.6 0 0 1 17.1 18.6 H12.6', 2.5),
      g.stroke([[15.2, 16], [12.6, 18.6], [15.2, 21.2]], 2.5),
    ), { plate: 'A' }),
    g.glass(g.stroke('M5 11.4 H17.1 A3.6 3.6 0 0 1 17.1 18.6 H14.6', 1), 'c2', { outline: 0.2, glint: false, glow: 0.32, plate: 'A' }),
  ]
  return paint(enamel(parts, icon))
}
