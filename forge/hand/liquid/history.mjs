// forge/hand/liquid/history.mjs: a ring of clear glass that runs counter-clockwise and ends in a solid arrowhead on the
// left, open at the lower left, with two crisp coloured clock hands inlaid in its face. The generated icon filled the
// dial and left a pink dot, so the arrow and the hands melted into one muddy disc.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const r2 = v => Math.round(v * 100) / 100
const lines = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))
const fill = d => ({ subs: parsePath(d) })

const C = [13.2, 12.4], R = 8
const pt = a => [C[0] + R * Math.cos(a * Math.PI / 180), C[1] + R * Math.sin(a * Math.PI / 180)]
const S0 = pt(128), E0 = pt(186)
// the ring: from the lower left, round the bottom, right and top, down to the arrowhead at the left
const RING = `M${r2(S0[0])} ${r2(S0[1])}A${R} ${R} 0 1 0 ${r2(E0[0])} ${r2(E0[1])}`
// the arrowhead at the ring's end, pointing down along the ring (inset by the glass growth)
const HEAD = `M${r2(E0[0] - 2.1)} ${r2(E0[1] - 0.3)}L${r2(E0[0] + 2.1)} ${r2(E0[1] - 0.3)}L${r2(E0[0])} ${r2(E0[1] + 2.5)}Z`
const HANDS = `M${C[0]} ${C[1] - 3.4}V${C[1]}L${C[0] + 2.4} ${C[1] + 1.7}`

export default function render(icon) {
  return build({
    name: (icon && icon.name) || 'history', paths: [],
    lines: [...lines(RING, 'K'), ...lines(HEAD, 'K'), ...lines(HANDS, 'A')],
    fills: [fill(HEAD)],
    cutouts: [],
  }) || []
}
