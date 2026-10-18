// forge/hand/liquid/ruler.mjs: the common diagonal ruler as one rounded bar of clear glass (20 x 7.6u on the 45-degree
// diagonal) with graduation marks cut through its upper-left edge: long, short, long, short. The marks are slots through
// the glass (closed cutouts), so they keep a crisp rim and read as scale ticks, not the loops the generator produced.
// Same model and paint as the generator (_liquid-core.mjs build); only the geometry is drawn.
import { build } from '../../styles/_liquid-core.mjs'

const r3 = v => Math.round(v * 1000) / 1000
const S = Math.SQRT1_2, C = [12.4, 11.6], L = 20, W = 7.8
const pt = (u, v) => [r3(C[0] + (u + v) * S), r3(C[1] + (v - u) * S)]
const dOf = pts => 'M' + pts.map(p => p.join(' ')).join('L') + 'Z'
const E = 1.3 // half of the K outline stroke

export default function render(icon) {
  const name = (icon && icon.name) || 'ruler'
  const body = [pt(-L / 2 + E, -W / 2 + E), pt(L / 2 - E, -W / 2 + E), pt(L / 2 - E, W / 2 - E), pt(-L / 2 + E, W / 2 - E)]
  // graduation slots: 1.3u wide, starting 1.1u inside the upper-left edge, alternately 3.4u and 2.1u deep
  const ticks = [-6.2, -2.07, 2.07, 6.2].map((u, i) => {
    const v0 = -W / 2 + 1.2, v1 = v0 + (i % 2 ? 2.1 : 3.4), h = 0.65
    return dOf([pt(u - h, v0), pt(u + h, v0), pt(u + h, v1), pt(u - h, v1)])
  })
  return build({
    name, paths: [],
    cutouts: ticks.map(d => ({ d, subs: [{ pts: d.slice(1, -1).split('L').map(s => s.split(' ').map(Number)), closed: true }] })),
    lines: [{ pts: body, closed: true, plate: 'K', pathId: 'p0' }],
    fills: [{ subs: [{ pts: body, closed: true }], set: [body] }],
  })
}
