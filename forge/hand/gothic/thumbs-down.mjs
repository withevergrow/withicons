// forge/hand/gothic/thumbs-down.mjs — the common blocky thumbs-down: a ruby glass cuff on the left, a carved stone hand
// with its thumb pointing down on the right; the generated finger-row fist read as a hand, not as a thumbs-down.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

export default function render(icon) {
  const hand = 'M7 14 L9.97 20.22 A2.25 2.25 0 0 0 14.25 19.12 L14 15 H18.5 C19.9 15 20.9 13.7 20.6 12.3 L19.2 4.9 C19 3.8 18.1 3 17 3 H7 Z'
  const cuff = g.rr(2, 3, 7.6, 14, 1.6)
  const parts = [
    g.stone(g.path(hand)),
    ...g.pane(cuff, 'c1', { frame: 1.05, tracery: 'none', plate: 'A' }),
    g.glass(g.circle(4.8, 8.5, 0.9), 'c3', { outline: 0.2, glint: false, glow: 0.3, plate: 'A' }),
  ]
  return paint(enamel(parts.flat(Infinity).filter(Boolean), icon))
}
