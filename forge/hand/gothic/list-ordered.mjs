// forge/hand/gothic/list-ordered.mjs: two rows, each a ruby glass tile in a stone frame carrying a gilded numeral
// (1, 2) beside one stone bar; the generated three-row version added a middle gem and lost the numeral-and-bar pairing.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

const tile = (y) => g.rr(2.2, y, 10.4, y + 8.2, 1.4)
const bar = (y) => g.rr(12.2, y - 1.5, 21.6, y + 1.5, 1.1)

export default function render() {
  const one = g.union(g.stroke([[4.7, 6.3], [6.5, 5.1], [6.5, 9.9]], 1.35), g.seg(4.9, 9.95, 8.1, 9.95, 1.2))
  const two = g.union(g.stroke('M4.7 16.5 C4.9 15.3 5.6 14.8 6.5 14.8 C7.7 14.8 8.3 15.5 8.3 16.5 C8.3 17.4 7.8 17.9 7.1 18.5 L4.7 20.4', 1.35), g.seg(4.7, 20.4, 8.4, 20.4, 1.25))
  return paint([
    g.stone(g.union(bar(7), bar(17))),
    ...g.pane(tile(2.9), 'c1', { frame: 1.1, tracery: 'none', plate: 'A', glass: { outline: 0.2, glint: false, dark: 0.3 } }),
    ...g.pane(tile(12.9), 'c1', { frame: 1.1, tracery: 'none', plate: 'A', glass: { outline: 0.2, glint: false, dark: 0.3 } }),
    g.gilt(g.union(one, two), { plate: 'A', thin: true, outline: 0.3, glint: false }),
  ])
}
