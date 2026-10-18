// forge/hand/liquid/baby.mjs: the line baby face in liquid glass: a round head with two ear bumps, one curl of
// coloured glass on top, two dot eyes and a small smile cut through the clear body.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const fill = d => ({ subs: parsePath(d) })
const lines = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))
const HEAD = 'M20 13A8 8 0 1 1 4 13A8 8 0 1 1 20 13Z'
const EARL = 'M4.25 11.25A1.9 1.9 0 0 0 4.25 14.75Z'
const EARR = 'M19.75 11.25A1.9 1.9 0 0 1 19.75 14.75Z'
const dot = (x, y) => `M${x + 1} ${y}A1 1 0 1 1 ${x - 1} ${y}A1 1 0 1 1 ${x + 1} ${y}Z`

export default function render(icon) {
  return build({
    name: (icon && icon.name) || 'baby', paths: [],
    lines: [...lines(HEAD, 'K'), ...lines(EARL, 'K'), ...lines(EARR, 'K'), ...lines('M12.3 4.2C14 4.8 14 7.6 12 7.6', 'A')],
    fills: [fill(HEAD), fill(EARL), fill(EARR)],
    cutouts: [fill(dot(9, 13)), fill(dot(15, 13)), fill('M10 16.4A2.5 2.5 0 0 0 14 16.4')],
  }) || []
}
