// forge/hand/gothic/shopping-basket.mjs — the line design's tapered basket: one arched gilt handle, a stone rim bar and a
// tapering gold glass body in a stone frame with three dark vertical slots; the generated drawing was a woven wicker basket
// with two upright handles.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

export default function render(icon) {
  const BODY = g.path('M4.2 10.4 L5.6 19.3 A2 2 0 0 0 7.6 21 H16.4 A2 2 0 0 0 18.4 19.3 L19.8 10.4 Z')
  const parts = [
    g.gilt(g.stroke('M6.6 10 A5.4 6.4 0 0 1 17.4 10', 1.9), { plate: 'A' }),
    ...g.pane(BODY, 'c3', { frame: 1.2, tracery: 'none' }),
    ...[8, 12, 16].map(x => g.recess(g.rr(x - 0.8, 13.2, x + 0.8, 18, 0.8), {})),
    g.stone(g.rr(2.4, 8.8, 21.6, 11.6, 1.2)),
  ]
  return paint(parts.flat(Infinity).filter(Boolean))
}
