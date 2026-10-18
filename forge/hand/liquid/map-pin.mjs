// forge/hand/liquid/map-pin.mjs — the teardrop pin in clear glass with one solid accent glass bead (the style's S bead) in a
// clean see-through socket. The generator nested a hole edge, a gap and a hollow pale ring (three thin concentric
// rims that smeared into a pale blob at 16px); one filled accent bead (wm-s) in a moat is a single high-contrast eye
// that holds at every size. Same model and paint as the generator (_liquid-core.mjs build); only geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const r3 = v => Math.round(v * 1000) / 1000
const circle = (cx, cy, r, n = 32) => Array.from({ length: n }, (_, i) => [r3(cx + r * Math.cos(2 * Math.PI * i / n)), r3(cy + r * Math.sin(2 * Math.PI * i / n))])
function skeleton(name, parts, cuts = []) {
  return {
    name, paths: [],
    lines: parts.map((p, i) => ({ pts: p.pts, closed: true, plate: p.plate || 'K', pathId: 'p' + i })),
    fills: parts.map(p => ({ subs: [{ pts: p.pts, closed: true }], set: [p.pts] })),
    cutouts: cuts.map(pts => ({ subs: [{ pts, closed: true }] })),
  }
}

// the skeleton's teardrop (its K outline stroke grows it by 1.3u, exactly like the generated pin)
const PIN = 'M19.5 10 C19.5 14.5 15.5 18.5 12 21.5 C8.5 18.5 4.5 14.5 4.5 10 A7.5 7.5 0 0 1 19.5 10 Z'
const C = [12, 10]

export default function render(icon) {
  const name = (icon && icon.name) || 'map-pin'
  const pin = parsePath(PIN)[0].pts
  return build(skeleton(name, [
    { pts: pin },
    // the bead: r 1.6 + the S outline 1.1 = 2.7, in a 3.6 socket (a ~0.95u see-through moat)
    { pts: circle(C[0], C[1], 1.6, 24), plate: 'S' },
  ], [circle(C[0], C[1], 3.6)]))
}
