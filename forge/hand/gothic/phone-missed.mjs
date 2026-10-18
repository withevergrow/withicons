// forge/hand/gothic/phone-missed.mjs — the ruby handset of the phone family with a larger, heavier gilded X set in
// its own moat in the free top-right corner, so the "missed" mark reads clearly at 16px.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

const HANDSET = 'M5.4 2.8 L8.6 2.7 C9.6 2.7 10.3 3.4 10.4 4.3 L10.8 7.6 C10.9 8.5 10.3 9.3 9.4 9.6 L8.2 10 C9.4 12.6 11.6 14.8 14.2 16 L14.6 14.8 C14.9 13.9 15.7 13.3 16.6 13.4 L19.8 13.8 C20.7 13.9 21.4 14.6 21.4 15.5 L21.3 18.6 C21.3 20.2 20 21.5 18.4 21.4 C9.6 20.8 3.2 14.4 2.6 5.6 C2.5 4 3.8 2.8 5.4 2.8 Z'

export default function render(icon) {
  const x = g.union(g.seg(14, 3, 20.8, 9.8, 2.3), g.seg(20.8, 3, 14, 9.8, 2.3))
  const parts = [
    ...g.pane(g.path(HANDSET), 'c1', { frame: 1.35, tracery: [[[3, 10.6], [9.6, 8.4]], [[13.6, 14.8], [15.8, 21.4]]], glass: { dark: 0.35 } }),
    g.cut(g.grow(x, 0.9)),
    g.gilt(x, { plate: 'S' }),
  ]
  return paint(enamel(parts.flat(Infinity).filter(Boolean), icon))
}
