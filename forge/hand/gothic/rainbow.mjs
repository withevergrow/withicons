// forge/hand/gothic/rainbow.mjs — the rainbow as an open arch of three broad stained-glass bands (ruby, gold,
// sapphire) leaded together and cut into voussoirs, its feet on two small stone springers; the generated drawing
// filled the arch with stone and set it on a sill, so its thin bands read as a dome or a hat.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

const CX = 12, CY = 18.2
const RAD = Math.PI / 180
// the upper half of the ring between radii r0 and r1
const band = (r0, r1) => g.inter(g.ring(CX, CY, (r0 + r1) / 2, r1 - r0), g.rect(0, 0, 24, CY))
// radial leads across a band at angles (deg up from the left foot)
const spokes = (r0, r1, as) => as.map(a => {
  const c = Math.cos((180 + a) * RAD), s = Math.sin((180 + a) * RAD)
  return [[CX + r0 * c, CY + r0 * s], [CX + r1 * c, CY + r1 * s]]
})

export default function render() {
  const parts = [
    g.glass(band(7.1, 9.6), 'c1', { outline: 0.42, tracery: spokes(6.9, 9.9, [45, 90, 135]), glow: 0.24 }),
    g.glass(band(4.7, 7.1), 'c3', { outline: 0.42, tracery: spokes(4.5, 7.3, [60, 120]), glint: false }),
    g.glass(band(2.4, 4.7), 'c2', { outline: 0.42, tracery: spokes(2.2, 4.9, [90]), glint: false, plate: 'A' }),
    g.stone(g.union(g.rr(2, 17.9, 9.8, 20.3, 0.8), g.rr(14.2, 17.9, 22, 20.3, 0.8)), { thin: true }),
  ]
  return paint(parts.flat(Infinity).filter(Boolean))
}
