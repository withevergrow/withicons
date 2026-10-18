// forge/hand/gothic/kanban.mjs: a carved stone frame round a deep recess holding three tall gilded pills of
// different heights, each inlaid with a jewel glass core (ruby, sapphire, emerald); the generated board of stacked
// cards in lanes was too dense and no longer read as the three-pill kanban.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

const PILLS = [[7.5, 6.2, 18.2, 'c1'], [12, 6.2, 12.6, 'c2'], [16.5, 6.2, 15.6, 'c4']]
const pill = (cx, y0, y1, w) => g.rr(cx - w / 2, y0, cx + w / 2, y1, w / 2)

export default function render() {
  const outer = g.rr(2.6, 2.6, 21.4, 21.4, 2.4)
  const inner = g.shrink(outer, 1.4)
  const parts = [
    g.stone(g.rim(outer, 1.4)),
    g.recess(inner, { outline: 0, glow: 'c2', glowOp: 0.3 }),
  ]
  for (const [cx, y0, y1, role] of PILLS) {
    parts.push(g.gilt(pill(cx, y0, y1, 3.4), { thin: true, plate: 'A', glint: false }))
    parts.push(g.glass(pill(cx, y0 + 0.7, y1 - 0.7, 2), role, { outline: 0.2, glint: false, glow: 0.3, plate: 'A' }))
  }
  return paint(parts)
}
