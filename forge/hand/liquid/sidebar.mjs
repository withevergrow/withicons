// forge/hand/liquid/sidebar.mjs: a clear-glass window with a narrow tinted left panel in coloured glass and a
// clear divider between them.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const lines = (d, plate, closed) => parsePath(d).map(s => ({ pts: s.pts, closed: closed ?? s.closed, plate }))
const fill = d => ({ subs: parsePath(d) })

const FRAME = 'M5 3 H19 A2 2 0 0 1 21 5 V19 A2 2 0 0 1 19 21 H5 A2 2 0 0 1 3 19 V5 A2 2 0 0 1 5 3 Z'
const PANEL = 'M4.75 4.75 H8.75 V19.25 H4.75 Z'
const DIV = 'M10 3 V21'

export default function render(icon) {
  return build({
    name: (icon && icon.name) || 'sidebar', paths: [],
    lines: [...lines(FRAME, 'K'), ...lines(DIV, 'K'), ...lines(PANEL, 'A')],
    fills: [fill(FRAME), fill(PANEL)], cutouts: [],
  }) || []
}
