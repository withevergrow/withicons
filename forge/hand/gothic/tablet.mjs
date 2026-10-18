// forge/hand/gothic/tablet.mjs: a carved stone tablet case with a plain upright sapphire glass screen and a gilded
// home pill below it; the generated drawing cut the screen into a cathedral window and lost the plain tablet shape.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

export default function render() {
  return paint([
    g.stone(g.rr(3.6, 2.2, 20.4, 21.8, 2.2)),
    g.glass(g.rr(5.6, 4.2, 18.4, 16.8, 0.9), 'c2', { tracery: 'none', outline: 0.4, deep: 0.5, dark: 0.3, glow: 0.18 }),
    g.gilt(g.rr(9.6, 18.5, 14.4, 20.1, 0.8), { thin: true, plate: 'A' }),
  ])
}
