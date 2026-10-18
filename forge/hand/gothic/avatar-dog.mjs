// forge/hand/gothic/avatar-dog.mjs: the dog avatar as a limestone head with a muzzle, two drooping gold-glass ears,
// dark grisaille eyes with a candle catch-light, a black nose and a leaded smile; the generated drawing flooded the
// face with blue glass so it lost its eyes and mouth.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

export default function render() {
  const HEAD = g.path('M12 5.5 C16 5.5 18.5 8.2 18.5 12 V14.5 C18.5 18.4 15.8 21 12 21 C8.2 21 5.5 18.4 5.5 14.5 V12 C5.5 8.2 8 5.5 12 5.5 Z')
  const EL = g.path('M8 7 C6 5.2 3 5.8 2.6 8.8 C2.3 11.6 2.7 14.6 4.1 15.6 C5.2 16.4 6.5 15.6 6.8 14 Z')
  const ER = g.flipX(EL)
  const MUZ = g.ellipse(12, 16.6, 3.6, 3)
  const parts = [
    g.glass(EL, 'c3', { tracery: 'none', glow: 0.2 }),
    g.glass(ER, 'c3', { tracery: 'none', glow: 0.2 }),
    g.stone(HEAD),
    g.stone(MUZ),
    g.recess(g.ellipse(9.2, 12, 0.95, 1.2), { plate: 'A', outline: 0.1 }),
    g.recess(g.ellipse(14.8, 12, 0.95, 1.2), { plate: 'A', outline: 0.1 }),
    g.shine(g.dot(9.5, 11.5, 0.3), { op: 0.95, plate: 'A' }),
    g.shine(g.dot(15.1, 11.5, 0.3), { op: 0.95, plate: 'A' }),
    g.iron(g.path('M10.2 15 H13.8 C13.8 16.3 13 17 12 17 C11 17 10.2 16.3 10.2 15 Z'), { outline: 0.2 }),
    g.lead([[[12, 17], [12, 18.2]], [[10.2, 19], [11.1, 19.5], [12, 18.2], [12.9, 19.5], [13.8, 19]]], { w: 0.6 }),
  ]
  return paint(parts.flat(Infinity).filter(Boolean))
}
