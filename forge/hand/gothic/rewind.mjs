// forge/hand/gothic/rewind.mjs — two plain rounded left-pointing triangles side by side (the common rewind), each a ruby
// glass pane in a gilded bevelled frame with a small gold gem set in it; the generated shield plates with heavy gems
// read as heraldry, not as a rewind control.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

const tri = (x0, x1) => `M${x0} 12 A1.4 1.4 0 0 1 ${x0 + 0.5} 10.2 L${x1 - 2.2} 5.6 A1.5 1.5 0 0 1 ${x1} 6.9 L${x1} 17.1 A1.5 1.5 0 0 1 ${x1 - 2.2} 18.4 L${x0 + 0.5} 13.8 A1.4 1.4 0 0 1 ${x0} 12 Z`

const piece = (x0, x1) => [
  ...g.pane(g.path(tri(x0, x1)), 'c1', { frame: 1.3, tracery: 'none' }).map(p => p.m === 'stone' ? { ...p, m: 'gilt' } : p),
  g.glass(g.circle(x0 + (x1 - x0) * 0.58, 12, 1.3), 'c3', { outline: 0.25, glint: false, glow: 0.34 }),
]

export default function render(icon) {
  const parts = [...piece(2.6, 11.8), ...piece(12.2, 21.4)]
  return paint(enamel(parts.flat(Infinity).filter(Boolean), icon))
}
