// forge/hand/gothic/calendar.mjs — the plain calendar leaf: a rounded limestone page with a ruby-glass header band,
// two gilded binder rings standing proud of the top edge, and an empty body; gothic colour and a gilt rule as trim only
// (the generated brick wall and stained-glass arches turned it into a chapel front).
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

export default function render(icon) {
  const page = g.rr(3, 4.4, 21, 21.4, 2.4)
  const rings = [8, 16].map(x => g.rr(x - 1.05, 2.2, x + 1.05, 7.2, 1.05))
  const parts = [
    g.stone(page),
    g.glass(g.path('M4.4 9.4 V7.4 A1.8 1.8 0 0 1 6.2 5.6 H17.8 A1.8 1.8 0 0 1 19.6 7.4 V9.4 Z'), 'c1', { outline: 0.34, tracery: 'none', glint: false }),
    ...rings.flatMap(r => [g.cut(g.grow(r, 0.6)), g.gilt(r, { outline: 0.32, thin: true, plate: 'A' })]),
    g.lead([[[5.6, 12.4], [18.4, 12.4]]], { role: 'edge', w: 0.3 }),
  ]
  return paint(enamel(parts.flat(Infinity).filter(Boolean), icon))
}
