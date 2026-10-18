// forge/hand/gothic/gallery-horizontal.mjs — a carousel, not a chapel window: one dominant picture slide (stone frame,
// sapphire sky, emerald hill, gold sun jewel) between two glass slivers of the neighbouring slides, no pointed arch.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

export default function render(icon) {
  const slide = g.rr(7, 3.2, 17, 20.8, 1.9)
  const inner = g.shrink(slide, 1.4)
  const hill = g.path('M6 17.2 C8 14.6 9.4 13.4 10.8 13.4 C12.4 13.4 14.2 15.6 18 19.4 V22 H6 Z')
  const sliver = (x0, x1, r) => g.pane(g.rr(x0, 6.4, x1, 17.6, r), 'c2', { plate: 'A', frame: 0.9, tracery: [[[0, 12], [24, 12]]], glass: { glint: false, dark: 0.32 } })
  const parts = [
    ...sliver(2.2, 5.3, [0.7, 1.3, 1.3, 0.7]),
    ...sliver(18.7, 21.8, [1.3, 0.7, 0.7, 1.3]),
    g.stone(g.rim(slide, 1.4)),
    g.glass(inner, 'c2', { tracery: 'none', glow: 0.22 }),
    g.glass(g.inter(hill, inner), 'c4', { outline: 0.38, tracery: [[[8, 22], [14, 13]], [[11, 22], [16.6, 15.8]], [[8.4, 16], [13.6, 21]]], glint: false }),
    ...g.bead(13.4, 8.2, 1.75, 'c3'),
  ]
  return paint(enamel(parts.flat(Infinity).filter(Boolean), icon))
}
