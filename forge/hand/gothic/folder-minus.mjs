// forge/hand/gothic/folder-minus.mjs — the line design's plain tabbed folder as one gold stained-glass pane in a stone
// frame, with a single centred minus bar: a gilded bezel round a ruby glass bar; the brick-wall back and red badge are gone.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

export default function render(icon) {
  const FOLDER = g.path('M3 7 A2 2 0 0 1 5 5 H9 L11 7 H19 A2 2 0 0 1 21 9 V18 A2 2 0 0 1 19 20 H5 A2 2 0 0 1 3 18 Z')
  const bar = g.rr(7.8, 12.4, 16.2, 15.6, 1.6)
  const parts = [
    ...g.pane(FOLDER, 'c3', { frame: 1.5, tracery: 'none', glass: { dark: 0.3 } }),
    g.stone(g.seg(11.4, 7.1, 19, 7.1, 0.5), { thin: true, plate: 'K', outline: 0 }),
    g.gilt(bar, { plate: 'A', thin: true, glint: false, outline: 0.3 }),
    g.glass(g.shrink(bar, 0.55), 'c1', { plate: 'A', outline: 0.2, glint: false }),
  ]
  return paint(enamel(parts.flat(Infinity).filter(Boolean), icon))
}
