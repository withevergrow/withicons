// forge/hand/gothic/chart-bar.mjs — three plain glass bars of rising and falling height, each in a carved stone
// frame with clear air between them, standing on a stone baseline inside the live area (A); the generated drawing
// turned them into pointed gem crystals.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

const col = (x0, top, x1) => g.rr(x0, top, x1, 20, [1.5, 1.5, 0, 0])
const F = { frame: 1.3, tracery: 'none' }

export default function render(icon) {
  const parts = [
    ...g.pane(col(3.4, 11.5, 7.6), 'c4', F),
    ...g.pane(col(9.9, 3.5, 14.1), 'c3', F),
    ...g.pane(col(16.4, 8, 20.6), 'c4', F),
    g.stone(g.rr(3, 19.4, 21, 21.6, 0.8), { thin: true, plate: 'A' }),
  ]
  return paint(enamel(parts, icon))
}
