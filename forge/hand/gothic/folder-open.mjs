// forge/hand/gothic/folder-open.mjs — the line design's open folder: a tabbed back and a slanted front flap swung
// forward. Back in carved stone, flap in gold glass inside a gilded rim; trim only, no ashlar wall or gem emblem.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

const BACK = 'M5 3.8 H9.3 L11.3 6 H17 A2.2 2.2 0 0 1 19.2 8.2 V13 H4 L3 18.4 V5.8 A2 2 0 0 1 5 3.8 Z'
const FLAP = 'M5 20.4 L7.1 12.9 A1.6 1.6 0 0 1 8.7 11.6 H20 A1.5 1.5 0 0 1 21.5 13.4 L19.8 19 A2 2 0 0 1 17.9 20.4 Z'

export default function render(icon) {
  const back = g.path(BACK), flap = g.path(FLAP)
  const parts = [
    g.stone(g.union(back, g.path('M5 20.4 A2 2 0 0 1 3 18.4 V5.8 A2 2 0 0 1 5 3.8 H9.3 L11.3 6 H17 A2.2 2.2 0 0 1 19.2 8.2 V14 H8 Z')), { plate: 'K' }),
    g.cut(g.grow(flap, 0.5)),
    g.gilt(flap, { plate: 'A', glint: false }),
    g.glass(g.shrink(flap, 1.2), 'c1', { plate: 'A', tracery: 'none', glow: 0.3, outline: 0.2 }),
    g.lead([[[9.8, 14.9], [19.2, 14.9]]], { w: 0.28, plate: 'A' }),
  ]
  return paint(enamel(parts.flat(Infinity).filter(Boolean), icon))
}
