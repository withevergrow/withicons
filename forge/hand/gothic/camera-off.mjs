// forge/hand/gothic/camera-off.mjs: the whole camera intact (stone body, sapphire rose lens, gilt shutter stud)
// with one gilded slash laid across it, no moat cut around the slash.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { cut as sub } from '../../styles/_gothic-prim.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'
const out = (parts, icon) => paint(enamel(parts.flat(Infinity).filter(Boolean), icon))

export default function render(icon) {
  const body = g.path('M4 6.5 H7.5 L9 4 H15 L16.5 6.5 H20 A2 2 0 0 1 22 8.5 V18.5 A2 2 0 0 1 20 20.5 H4 A2 2 0 0 1 2 18.5 V8.5 A2 2 0 0 1 4 6.5 Z')
  const lens = g.circle(12, 13.5, 4.1)
  return out([
    g.stone(sub(body, lens)),
    g.gilt(g.ring(12, 13.5, 3.6, 1), { thin: true, glint: false }),
    g.glass(g.circle(12, 13.5, 3.05), 'c2', { tracery: 'rose', n: 8, plate: 'A' }),
    g.gilt(g.circle(18.6, 9.3, 0.9), { thin: true, glint: false }),
    g.gilt(g.seg(3.6, 4.2, 20.4, 21, 1.6), { plate: 'S', thin: true }),
  ], icon)
}
