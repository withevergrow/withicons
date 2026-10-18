// forge/hand/liquid/ambulance.mjs: a clear-glass van with a see-through cab window, a bold medical cross as an accent
// glass bead on the box, and two solid coloured-glass wheels set in the arches. The generated van carried an L-shaped
// window stroke, a cross cut as a groove and ringed wheels, so cab, cross and wheels blurred into one busy slab.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const lines = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))
const fill = d => ({ subs: parsePath(d) })

const SHELL = 'M4.5 18 H3.5 A1.5 1.5 0 0 1 2 16.5 V6 A2 2 0 0 1 4 4 H14 L18.5 10 H20 A2 2 0 0 1 22 12 V16.5 A1.5 1.5 0 0 1 20.5 18 H20 M8.5 18 H16'
const MASS = 'M2 6 A2 2 0 0 1 4 4 H14 L18.5 10 H20 A2 2 0 0 1 22 12 V18 H21.5 A3.5 3.5 0 0 0 14.5 18 H10 A3.5 3.5 0 0 0 3 18 H2 Z'
const WINDOW = 'M14.75 6.25 L17 9.5 H14.75 Z'
const CROSS = 'M7.5 7.75 V13.25 M4.75 10.5 H10.25'
const WHEEL_L = 'M8.5 18 A2 2 0 1 1 4.5 18 A2 2 0 1 1 8.5 18 Z'
const WHEEL_R = 'M20 18 A2 2 0 1 1 16 18 A2 2 0 1 1 20 18 Z'

export default function render(icon) {
  return build({
    name: (icon && icon.name) || 'ambulance', paths: [],
    lines: [...lines(SHELL, 'K'), ...lines(CROSS, 'S'), ...lines(WHEEL_L, 'A'), ...lines(WHEEL_R, 'A')],
    fills: [fill(MASS), fill(WHEEL_L), fill(WHEEL_R)],
    cutouts: [{ subs: parsePath(WINDOW) }],
  }) || []
}
