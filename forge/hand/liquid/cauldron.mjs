// forge/hand/liquid/cauldron.mjs: a round-bellied clear glass pot under a coloured glass rim lip, two short legs and
// two accent bubbles rising from the rim. The generated drawing read as a blob with loose beads on top.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const lines = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))
const fill = d => ({ subs: parsePath(d) })

const RIM = 'M5.6 8.6 H18.4 A1.6 1.6 0 0 1 18.4 11.8 H5.6 A1.6 1.6 0 0 1 5.6 8.6 Z'
const POT = 'M6.6 11.8 C3.4 13.6 3.8 18.6 7.6 19.8 C10.4 20.6 13.6 20.6 16.4 19.8 C20.2 18.6 20.6 13.6 17.4 11.8 Z'
const LEGS = 'M8.2 19.8 L7.4 21.4 M15.8 19.8 L16.6 21.4'
const B1 = 'M9.8 5.8 A1 1 0 1 1 7.8 5.8 A1 1 0 1 1 9.8 5.8 Z'
const B2 = 'M16 4 A1.4 1.4 0 1 1 13.2 4 A1.4 1.4 0 1 1 16 4 Z'

export default function render(icon) {
  return build({
    name: (icon && icon.name) || 'cauldron', paths: [],
    lines: [...lines(POT, 'K'), ...lines(LEGS, 'K'), ...lines(RIM, 'A'), ...lines(B1, 'S'), ...lines(B2, 'S')],
    fills: [fill(POT), fill(RIM), fill(B1), fill(B2)],
    cutouts: [],
  }) || []
}
