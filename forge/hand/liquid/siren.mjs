// forge/hand/liquid/siren.mjs: a wide coloured glass beacon dome standing on a clear glass base, with three short accent
// rays fanned round it, painted with the style's own glass recipe. The generated dome was a narrow clear hood with a
// coloured curl inside it, so at 16px the light read as a blob with ears rather than a rotating beacon.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const lines = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))
const fill = d => ({ subs: parsePath(d) })

const DOME = 'M7 15.6 V12.4 A5 5 0 0 1 17 12.4 V15.6 Z'
const BASE = 'M5.75 19 H18.25 V20.6 H5.75 Z'
// rays on radii from the dome's centre (12 12.4)
const RAYS = ['M12 1.7 V3', 'M4.1 5.95 L5.25 6.9', 'M19.9 5.95 L18.75 6.9']

export default function render(icon) {
  return build({
    name: (icon && icon.name) || 'siren', paths: [],
    lines: [...lines(BASE, 'K'), ...lines(DOME, 'A'), ...RAYS.flatMap(d => lines(d, 'S'))],
    fills: [fill(BASE), fill(DOME)],
    cutouts: [],
  }) || []
}
