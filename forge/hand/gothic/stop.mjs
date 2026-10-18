// forge/hand/gothic/stop.mjs — a framed rounded square (stone frame, ruby glass) with the plain stop square in gilded
// metal at its heart; the generated clover/cross motif made it read as a button with a medal, not "stop".
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

export default function render(icon) {
  const parts = [
    ...g.pane(g.rr(3.4, 3.4, 20.6, 20.6, 3), 'c1', { frame: 1.5, tracery: 'none' }),
    g.gilt(g.rr(8, 8, 16, 16, 1.1), { glint: false, outline: 0.3 }),
    g.shine(g.rr(8.6, 8.6, 12.6, 9.4, 0.4), { op: 0.7 }),
  ]
  return paint(enamel(parts.flat(Infinity).filter(Boolean), icon))
}
