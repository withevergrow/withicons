// forge/hand/gothic/sort.mjs: a plain chunky gilt shaft with a broad ruby-glazed head falling beside three stone
// bars of shrinking length glazed in sapphire; no pommel or collar, so the arrow no longer reads as a sword.
// Head and bars stay inside the 2..21.5 live area (the cast shadow included); bar frames are 1.0u so stone shows at 16px.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

const bar = (x0, y, x1) => g.pane(g.rr(x0, y - 1.55, x1, y + 1.55, 0.95), 'c2', { frame: 1.0, tracery: 'none', glass: { glint: false, glow: 0.28 } })

export default function render() {
  const head = g.poly([[2.4, 14.2], [9.6, 14.2], [6, 21]])
  return paint([
    ...bar(12.4, 5, 20.9), ...bar(12.4, 12, 18.4), ...bar(12.4, 19, 16.1),
    g.gilt(g.seg(6, 3.4, 6, 15, 3), { plate: 'A' }),
    g.glass(g.seg(6, 4.4, 6, 14.6, 1.05), 'c2', { plate: 'A', outline: 0.2, glint: false, glow: 0.24 }),
    g.gilt(head, { plate: 'A' }),
    g.glass(g.shrink(head, 1.2), 'c1', { plate: 'A', outline: 0.25, glint: false, glow: 0.3 }),
  ])
}
