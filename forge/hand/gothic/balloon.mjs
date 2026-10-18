// forge/hand/gothic/balloon.mjs: a party balloon: a ruby glass envelope in a stone rim with a lit glint, a gilded knot
// and a curved gilt string that wanders down on the right (no rigid handle, so it no longer reads as a hand mirror).
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

const BODY = 'M12 16.4 C7.9 16.4 4.9 12.4 4.9 9.1 C4.9 5 8 2.3 12 2.3 C16 2.3 19.1 5 19.1 9.1 C19.1 12.4 16.1 16.4 12 16.4 Z'

export default function render() {
  const body = g.path(BODY)
  return paint([
    g.gilt(g.stroke('M12 17 C12 19.2 14.2 19 13.9 20.9 C13.7 21.8 13 22 13.2 22.8', 0.85), { thin: true, outline: 0.3, glint: false, plate: 'A' }),
    ...g.pane(body, 'c1', { frame: 1.1, tracery: 'none', glass: { dark: 0.3, glow: 0.2 } }),
    g.gilt(g.poly([[12, 15.7], [11, 17.4], [13, 17.4]]), { thin: true, outline: 0.3, glint: false }),
  ].flat(Infinity).filter(Boolean))
}
