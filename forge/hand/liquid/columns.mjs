// forge/hand/liquid/columns.mjs: a clear glass rounded frame with a header strip over two unequal coloured-glass
// column panels and a wide clear gutter, so it reads as a page layout (not a pause button) and the cells stay
// separate at 16px.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const lines = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))
const fill = d => ({ subs: parsePath(d) })
const rr = (x0, y0, x1, y1, r) => `M${x0 + r} ${y0} H${x1 - r} A${r} ${r} 0 0 1 ${x1} ${y0 + r} V${y1 - r} A${r} ${r} 0 0 1 ${x1 - r} ${y1} H${x0 + r} A${r} ${r} 0 0 1 ${x0} ${y1 - r} V${y0 + r} A${r} ${r} 0 0 1 ${x0 + r} ${y0} Z`

const FRAME = rr(3, 3, 21, 21, 2.6)
const HEAD = rr(5.25, 5.25, 18.75, 8.5, 1)
const LEFT = rr(5.25, 11, 11.75, 18.75, 1)
const RIGHT = rr(14.5, 11, 18.75, 18.75, 1)

export default function render(icon) {
  return build({
    name: (icon && icon.name) || 'columns', paths: [],
    lines: [...lines(FRAME, 'K'), ...lines(HEAD, 'S'), ...lines(LEFT, 'A'), ...lines(RIGHT, 'A')],
    fills: [fill(FRAME), fill(HEAD), fill(LEFT), fill(RIGHT)], cutouts: [],
  }) || []
}
