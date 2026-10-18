// forge/hand/liquid/pin.mjs — a pushpin in clear glass built from three plain masses on the 45° axis (a broad cap, a
// tapering neck, a wide flange) over a separate coloured glass needle (wm-a) that tapers to a clear point. The generator
// grew the skeleton's thin outline into one lumpy puzzle-piece blob with a thin rod, which read as a vague shape at
// 16px; the stepped cap-neck-flange profile and the wedge needle say "pushpin" at a glance. Same model and paint as
// the generator (_liquid-core.mjs build); only the geometry is drawn here.
import { build } from '../../styles/_liquid-core.mjs'

const r3 = v => Math.round(v * 1000) / 1000
function skeleton(name, parts) {
  return {
    name, paths: [], cutouts: [],
    lines: parts.map((p, i) => ({ pts: p.pts, closed: true, plate: p.plate || 'K', pathId: 'p' + i })),
    fills: parts.map(p => ({ subs: [{ pts: p.pts, closed: true }], set: [p.pts] })),
  }
}

// s runs down the pin's axis from the cap's top (17.5, 6.5) toward the needle's point, q across it.
// Every polygon is the drawn piece shrunk by its outline stroke (K 1.3, A 1.15).
const S = Math.SQRT1_2, O = [17.5, 6.5]
const pt = (s, q) => [r3(O[0] + (q - s) * S), r3(O[1] + (s + q) * S)]
const quad = (s0, q0, s1, q1) => [pt(s0, -q0), pt(s1, -q1), pt(s1, q1), pt(s0, q0)]

export default function render(icon) {
  const name = (icon && icon.name) || 'pin'
  return build(skeleton(name, [
    // cap: s -0.5..4.5, 9.2u across
    { pts: quad(0.8, 3.3, 3.2, 3.3) },
    // neck: widening a little toward the flange (4.8u -> 5.8u across)
    { pts: quad(3.2, 1.1, 9.3, 1.6) },
    // flange: s 8..11.2, 13.2u across
    { pts: quad(9.3, 5.3, 9.9, 5.3) },
    // needle: from a 0.4u seam under the flange to its point at s 19.95 (3.9u wide at the root)
    { pts: [pt(12.75, -0.8), pt(18.8, 0), pt(12.75, 0.8)], plate: 'A' },
  ]))
}
