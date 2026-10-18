// forge/hand/gothic/map-pin-check.mjs — a plain ruby-glass map pin in a limestone frame with a bold gilded check
// on its face; the generated drawing leaded the pin like a spider web, which hid the check.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

export default function render() {
  const pin = g.path('M19.8 9.8 C19.8 14.6 15.7 18.6 12 21.7 C8.3 18.6 4.2 14.6 4.2 9.8 A7.8 7.8 0 0 1 19.8 9.8 Z')
  const parts = [
    ...g.pane(pin, 'c1', { frame: 1.5, tracery: 'none', glass: { glow: 0.3 } }),
    g.cut(g.grow(g.stroke([[8.3, 10.1], [11, 12.8], [15.9, 7.4]], 2), 0.6)),
    g.gilt(g.stroke([[8.3, 10.1], [11, 12.8], [15.9, 7.4]], 2), { plate: 'A', glint: false }),
  ]
  return paint(parts.flat(Infinity).filter(Boolean))
}
