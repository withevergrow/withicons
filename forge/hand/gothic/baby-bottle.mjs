// forge/hand/gothic/baby-bottle.mjs: the feeding bottle simplified to four clear parts: an amber glass teat, a stone
// collar ring, a plain sapphire glass body in a stone frame and three gilded graduation bars; the generated drawing
// was crowded with tracery and ashlar so the silhouette blurred at 24px.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

export default function render() {
  const BODY = g.path('M7.8 9.6 H16.2 V19.5 A2.2 2.2 0 0 1 14 21.7 H10 A2.2 2.2 0 0 1 7.8 19.5 Z')
  const TEAT = g.path('M9.4 7 C10.9 6.4 10.9 5 10.9 3.9 A1.1 1.1 0 0 1 13.1 3.9 C13.1 5 13.1 6.4 14.6 7 Z')
  const COLLAR = g.rr(6.6, 6.6, 17.4, 9.8, 1.2)
  const parts = [
    g.glass(TEAT, 'c3', { tracery: 'none', glow: 0.3 }),
    ...g.pane(BODY, 'c2', { frame: 1.1, tracery: 'none', glass: { glow: 0.3 } }),
    g.stone(COLLAR),
    g.gilt(g.seg(9.4, 13, 11.8, 13, 0.8), { thin: true, glint: false, plate: 'A', outline: 0.25 }),
    g.gilt(g.seg(9.4, 15.8, 11, 15.8, 0.8), { thin: true, glint: false, plate: 'A', outline: 0.25 }),
    g.gilt(g.seg(9.4, 18.6, 11.8, 18.6, 0.8), { thin: true, glint: false, plate: 'A', outline: 0.25 }),
  ]
  return paint(parts.flat(Infinity).filter(Boolean))
}
