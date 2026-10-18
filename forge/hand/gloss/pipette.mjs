// forge/hand/gloss/pipette.mjs — a glossy eyedropper on the diagonal: a tapering glass tube, a wide collar
// and a round rubber bulb, each its own vinyl shape with 1.4u of white between them.
// The generated drawing closed the whole dropper into one near-black blob. Same vinyl recipe as the generator
// (forge/styles/gloss.mjs models the masses); only the skeleton is drawn.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'
import gloss from '../../styles/gloss.mjs'

function prep(name, ring) {
  const F = [{ d: '', subs: [{ pts: ring, closed: true }], set: setOf([ring]) }]
  return { name, paths: [], fills: F, cutouts: [], lines: [], fillSet: F[0].set }
}
const f2 = v => Math.round(v * 100) / 100
// the dropper lies along the 45 degree axis, tip at the lower left; (u, v) = along the axis, across it
const P0 = [3, 21], D = [Math.SQRT1_2, -Math.SQRT1_2], N = [Math.SQRT1_2, Math.SQRT1_2]
const xy = (u, v) => [f2(P0[0] + D[0] * u + N[0] * v), f2(P0[1] + D[1] * u + N[1] * v)]
// a rounded block u0..u1, half-width hw0 at u0 and hw1 at u1, corner radius r (tapered sides allowed)
function block(u0, u1, hw0, hw1, r0, r1 = r0) {
  const pts = [], n = 8
  const arc = (cu, cv, r, a0) => { for (let i = 0; i <= n; i++) { const a = (a0 + 90 * i / n) * Math.PI / 180; pts.push(xy(cu + r * Math.cos(a), cv + r * Math.sin(a))) } }
  arc(u1 - r1, hw1 - r1, r1, 0)       // far end -> +v side
  arc(u0 + r0, hw0 - r0, r0, 90)      // +v side -> near end
  arc(u0 + r0, -hw0 + r0, r0, 180)    // near end -> -v side
  arc(u1 - r1, -hw1 + r1, r1, 270)    // -v side -> far end
  return pts
}
// a polygon in (u, v) with every corner rounded by up to r
function poly(vs, r) {
  const pts = [], n = vs.length
  for (let i = 0; i < n; i++) {
    const a = vs[(i + n - 1) % n], b = vs[i], c = vs[(i + 1) % n]
    const la = Math.hypot(a[0] - b[0], a[1] - b[1]), lc = Math.hypot(c[0] - b[0], c[1] - b[1]), k = Math.min(r, la / 2.2, lc / 2.2)
    const p = [b[0] + (a[0] - b[0]) * k / la, b[1] + (a[1] - b[1]) * k / la], q = [b[0] + (c[0] - b[0]) * k / lc, b[1] + (c[1] - b[1]) * k / lc]
    for (let j = 0; j <= 6; j++) { const t = j / 6, m = 1 - t; pts.push(xy(m * m * p[0] + 2 * m * t * b[0] + t * t * q[0], m * m * p[1] + 2 * m * t * b[1] + t * t * q[1])) }
  }
  return pts
}
export default function render(icon) {
  const name = (icon && icon.name) || 'pipette'
  const parts = [
    poly([[0, 0.3], [4.2, 1.8], [12, 1.8], [12, -1.8], [4.2, -1.8], [0, -0.3]], 0.9),   // the glass tube, drawn to its point
    block(13.2, 15.4, 3.5, 3.5, 1),               // the collar
    block(16.9, 23.6, 2.5, 2.5, 1.4, 2.5),                   // the rubber bulb
  ]
  return parts.flatMap(r => gloss.render(prep(name, r)).map(([t, a]) => [t, { ...a, class: 'wm-k' }]))
}
