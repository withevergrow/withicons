// forge/hand/gothic/sun.mjs — the sun as a gold rose window ringed by eight slender gilt rays standing clear of it;
// the generated drawing (a dense 16-point spiky wheel touching the disc) swallowed the disc and read as a cog at 16px.
// The rose is r 5.1 (frame 1.2) and the rays start at r 7.5, so the feet stand clear of the frame; cardinal tips stop at
// r 9.4 and diagonal tips at r 9.6, keeping every tip inside 2.6..21.4 with an even ring.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

const f1 = v => Math.round(v * 100) / 100
const RAD = Math.PI / 180
// a slender lozenge ray along angle a: blunt foot at r0 (width w), sharp tip at r1
function ray(a, r0, r1, w) {
  const c = Math.cos(a * RAD), s = Math.sin(a * RAD)
  const P = (r, t) => [f1(12 + r * c - t * s), f1(12 + r * s + t * c)]
  const k = r0 + (r1 - r0) * 0.3
  return g.poly([P(r0, -w * 0.32), P(k, -w / 2), P(r1, 0), P(k, w / 2), P(r0, w * 0.32)])
}

export default function render() {
  const rays = Array.from({ length: 8 }, (_, i) => i % 2 ? ray(i * 45, 7.5, 9.6, 1.45) : ray(i * 45, 7.5, 9.4, 1.55))
  const parts = [
    g.gilt(g.union(...rays), { plate: 'A' }),
    ...g.rose(12, 12, 5.1, 'c3', { n: 8, frame: 1.2, medal: 'c1' }),
  ]
  return paint(parts.flat(Infinity).filter(Boolean))
}
