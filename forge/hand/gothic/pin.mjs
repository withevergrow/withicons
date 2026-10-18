// forge/hand/gothic/pin.mjs — the common tilted pushpin: a gilded flat cap over a ruby-glass barrel and a broad gilded
// flange, the needle running to the lower left; the old upright cylinder read as a bobbin or a barrel.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

const f1 = v => Math.round(v * 100) / 100
// local frame: u along the pin from the needle point (lower left) to the cap (upper right), v across
const O = [3.4, 20.6], D = Math.SQRT1_2
const P = (u, v) => [f1(O[0] + (u + v) * D), f1(O[1] + (v - u) * D)]
const box = (u0, u1, h) => g.poly([P(u0, -h), P(u1, -h), P(u1, h), P(u0, h)])
const round = (F, r) => g.grow(g.shrink(F, r), r)

export default function render(icon) {
  const needle = g.poly([P(0, 0), P(10.6, -0.55), P(10.6, 0.55)])
  const flange = round(box(10.6, 12.6, 4.6), 0.55)
  const barrel = round(box(12.6, 16, 2.8), 0.35)
  const cap = round(box(16, 18.4, 3.7), 0.7)
  const parts = [
    g.stone(needle, { thin: true }),
    g.gilt(flange, { thin: true }),
    g.glass(barrel, 'c1', { outline: 0.4, glow: 0.3 }),
    g.gilt(cap, { thin: true }),
    g.shine(g.seg(...P(16.9, -2.4), ...P(16.9, 1.6), 0.5), { op: 0.7 }),
  ]
  return paint(parts)
}
