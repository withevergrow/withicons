// forge/hand/coquette/loader.mjs — the common spinner: eight radial pill spokes round a clear centre, blush satin with
// the sweep fading behind the leading spoke, and one tiny red heart as the only accent; it replaces the ring of beads.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

const CX = 12, CY = 12, R0 = 5.9, R1 = 10.7, W = 2.5
// the leading spoke sits at 12 o'clock; the others trail counter-clockwise (the spin is clockwise)
const OP = [1, 1, 0.9, 0.78, 0.66, 0.55, 0.45, 0.38]
export default function render() {
  const parts = OP.map((op, i) => {
    const a = (-90 - i * 45) * Math.PI / 180, c = Math.cos(a), s = Math.sin(a)
    const f = k.seg(+(CX + R0 * c).toFixed(2), +(CY + R0 * s).toFixed(2), +(CX + R1 * c).toFixed(2), +(CY + R1 * s).toFixed(2), W)
    return k.body(f, { ow: 0.6, op, noShadow: i > 1 })
  })
  return paint([...parts, k.heart(CX, CY + 0.2, 3.6, 0, { plate: 'K' })])
}
