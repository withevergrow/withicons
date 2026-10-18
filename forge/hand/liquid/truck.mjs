// forge/hand/liquid/truck.mjs: one clear-glass body (cargo box and cab fused, no gap) with a see-through cab window and a
// door seam, and two plain accent glass wheels, one ring and one hub each. The old version split box and cab into two
// differently weighted pieces and double-ringed the wheels, which turned to noise at 16px.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const lines = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))
const fill = d => ({ subs: parsePath(d) })

const SHELL = 'M4.5 18 H3.5 A1.5 1.5 0 0 1 2 16.5 V7 A2 2 0 0 1 4 5 H13 A2 2 0 0 1 15 7 V9.5 H17.5 L22 14 V16.5 A1.5 1.5 0 0 1 20.5 18 H20 M8.5 18 H16'
const MASS = 'M2 7 A2 2 0 0 1 4 5 H13 A2 2 0 0 1 15 7 V9.5 H17.5 L22 14 V18 H21.5 A3.5 3.5 0 0 0 14.5 18 H10 A3.5 3.5 0 0 0 3 18 H2 Z'
const WINDOW = 'M16.5 11 H17.4 L19.4 13.3 H16.5 Z'
const SEAM = 'M15 11 V13.5'
const WHEEL_L = 'M8.5 18 A2 2 0 1 1 4.5 18 A2 2 0 1 1 8.5 18 Z'
const WHEEL_R = 'M20 18 A2 2 0 1 1 16 18 A2 2 0 1 1 20 18 Z'
const HUB_L = 'M6.5 18 h.1 v.1 Z'
const HUB_R = 'M18 18 h.1 v.1 Z'

export default function render(icon) {
  return build({
    name: (icon && icon.name) || 'truck', paths: [],
    lines: [...lines(SHELL, 'K'), ...lines(SEAM, 'K'), ...lines(WHEEL_L, 'A'), ...lines(WHEEL_R, 'A'), ...lines(HUB_L, 'A'), ...lines(HUB_R, 'A')],
    fills: [fill(MASS), fill(WHEEL_L), fill(WHEEL_R)],
    cutouts: [{ subs: parsePath(WINDOW) }],
  }) || []
}
