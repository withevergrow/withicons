// forge/hand/gothic/map.mjs — the line design's three-panel zigzag folded map: each panel its own glass pane in a stone
// frame (so the shared folds read as stone creases), emerald flanks round a gold middle, a gilded route ending on a ruby
// jewel as the only trim; the old leaded window with a medallion is gone.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

export default function render(icon) {
  const L = g.path('M3 6 L9 3.5 V18 L3 20.5 Z')
  const M = g.path('M9 3.5 L15 6 V20.5 L9 18 Z')
  const R = g.path('M15 6 L21 3.5 V18 L15 20.5 Z')
  const parts = [
    ...g.pane(L, 'c4', { frame: 1.15, tracery: 'none' }),
    ...g.pane(R, 'c4', { frame: 1.15, tracery: 'none' }),
    ...g.pane(M, 'c3', { frame: 1.15, tracery: 'none' }),
    g.gilt(g.stroke('M10.9 16 C14.2 14.6 9.9 12 13 9.3', 0.95), { thin: true, outline: 0.3, glint: false, plate: 'A' }),
    ...g.bead(17.9, 10.6, 1.15, 'c1', { plate: 'A' }),
  ]
  return paint(enamel(parts.flat(Infinity).filter(Boolean), icon))
}
