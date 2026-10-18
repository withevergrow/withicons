// forge/hand/gothic/trending-down.mjs: a stone-cased ruby-glazed zigzag falling to a bold gilded chevron arrowhead,
// standing on a carved stone footing like the bar-chart; broad tubes, big jewels at the turns and real mass replace
// the earlier hairline zigzag so it holds at 16px and beside the heavy siblings.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

export default function render(icon) {
  const pts = [[3.6, 4.6], [8.7, 9.7], [12.6, 5.8], [19.6, 12.8]]
  const case_ = g.stroke(pts, 3.6)
  const core = g.stroke(pts, 1.7)
  const head = g.stroke([[14.2, 13.2], [19.8, 13.2], [19.8, 7.6]], 3.2)
  const parts = [
    g.stone(g.seg(3.4, 19.8, 20.6, 19.8, 2.4), { plate: 'deco' }),
    g.stone(case_, { plate: 'K' }),
    g.glass(core, 'c1', { plate: 'K', outline: 0.2, glint: false }),
    g.gilt(head, { plate: 'A' }),
    g.bead(8.7, 9.7, 1.45, 'c3'),
    g.bead(12.6, 5.8, 1.45, 'c3'),
  ]
  return paint(enamel(parts.flat(Infinity).filter(Boolean), icon))
}
