// forge/hand/gothic/avatar-tiger.mjs: the tiger avatar as a wide amber-glass head with round ears, black grisaille
// stripes (a forehead crown and three on each cheek), a pale limestone muzzle, a ruby nose and bright eyes; the
// generated drawing was a tan bear with a blue face.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

const stripe = (d, w) => ({ m: 'paint', role: 'ink', F: g.stroke(d, w), plate: 'K' })

export default function render() {
  const HEAD = g.ellipse(12, 13.7, 8, 6.9)
  const EL = g.circle(6.3, 7.4, 2.7)
  const ER = g.circle(17.7, 7.4, 2.7)
  const MUZ = g.ellipse(12, 17.3, 3.7, 2.7)
  const parts = [
    g.glass(EL, 'c3', { tracery: 'none', glow: 0.2 }),
    g.glass(ER, 'c3', { tracery: 'none', glow: 0.2 }),
    g.stone(g.circle(6.4, 7.7, 1.2), { thin: true, outline: 0.2 }),
    g.stone(g.circle(17.6, 7.7, 1.2), { thin: true, outline: 0.2 }),
    g.glass(HEAD, 'c3', { tracery: 'none', glow: 0.25 }),
    stripe('M12 7.4 V10.6', 1.1),
    stripe('M8.9 7.9 L9.9 10.2', 0.95),
    stripe('M15.1 7.9 L14.1 10.2', 0.95),
    stripe('M4.2 12.8 L7 13.6', 0.95),
    stripe('M4.6 15.6 L7.3 15.8', 0.95),
    stripe('M19.8 12.8 L17 13.6', 0.95),
    stripe('M19.4 15.6 L16.7 15.8', 0.95),
    g.stone(MUZ),
    g.recess(g.ellipse(9, 12.5, 0.95, 1.15), { plate: 'A', outline: 0.1 }),
    g.recess(g.ellipse(15, 12.5, 0.95, 1.15), { plate: 'A', outline: 0.1 }),
    g.shine(g.dot(9.3, 12, 0.3), { op: 0.95, plate: 'A' }),
    g.shine(g.dot(15.3, 12, 0.3), { op: 0.95, plate: 'A' }),
    g.glass(g.path('M10.4 15.2 H13.6 L12 17 Z'), 'c1', { tracery: 'none', outline: 0.25, glint: false }),
    g.lead([[[12, 17], [12, 18.1]], [[10.4, 19.1], [11.2, 19.4], [12, 18.1], [12.8, 19.4], [13.6, 19.1]]], { w: 0.55 }),
  ]
  return paint(parts.flat(Infinity).filter(Boolean))
}
