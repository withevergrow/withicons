// forge/hand/liquid/crayon.mjs — a wax crayon on the 45° diagonal: a solid coloured-glass cone tip (wm-a) with a blunt
// rounded point, a clear-glass wrapper and two coloured-glass wrapper bands near its ends. The generator kept the cone
// inside the pale body, so only two faint stripes said "crayon" and the shape read as a generic pencil or bullet; the
// coloured wax tip and the bands framing a clear wrapper give the crayon its own read at 16px. Same model and paint as
// the generator (_liquid-core.mjs build); only the geometry is drawn here.
import { build, L } from '../../styles/_liquid-core.mjs'

const r3 = v => Math.round(v * 1000) / 1000
// geometry is written in the style's frame (what is seen on the 24 grid) and mapped back to the skeleton frame
const pre = p => [r3((p[0] - 12 - L.TX) / L.SCALE + 12), r3((p[1] - 12 - L.TY) / L.SCALE + 12)]
function skeleton(name, parts) {
  const ps = parts.map(p => ({ ...p, pts: p.pts.map(pre) }))
  return {
    name, paths: [], cutouts: [],
    lines: ps.map((p, i) => ({ pts: p.pts, closed: !p.open, plate: p.plate || 'K', pathId: 'p' + i })),
    fills: ps.filter(p => !p.open).map(p => ({ subs: [{ pts: p.pts, closed: true }], set: [p.pts] })),
  }
}

// u runs from the tip's point (bottom-left, 4.4 19.6) up the crayon toward the top-right, v across it
const S = Math.SQRT1_2, O = [4.4, 19.6]
const pt = (u, v) => [O[0] + (u + v) * S, O[1] + (v - u) * S]
// every polygon is the drawn piece shrunk by its outline tube (K 1.3, A 1.15)
const band = u => ({ pts: [pt(u, -2.35), pt(u, 2.35)], open: true, plate: 'A' })

export default function render(icon) {
  const name = (icon && icon.name) || 'crayon'
  return build(skeleton(name, [
    // wrapper: u 5.9..22, 6.8u across
    { pts: [pt(7.2, -2.1), pt(20.7, -2.1), pt(20.7, 2.1), pt(7.2, 2.1)] },
    // wax tip: a short blunt cone, a 3.5u rounded end widening to nearly the wrapper's width at u 5.5
    { pts: [pt(1.15, -0.6), pt(2.2, -0.95), pt(4.35, -1.85), pt(4.35, 1.85), pt(2.2, 0.95), pt(1.15, 0.6)], plate: 'A' },
    // the wrapper's two bands
    band(10.2),
    band(17.6),
  ]))
}
