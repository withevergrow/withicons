// forge/hand/liquid/school.mjs: a clear-glass schoolhouse with a pitched roof, a coloured flag on a mast at the
// peak, a dark door cutout and two separated windows.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const lines = (d, plate, closed) => parsePath(d).map(s => ({ pts: s.pts, closed: closed ?? s.closed, plate }))
const fill = d => ({ subs: parsePath(d) })

const HOUSE = 'M3 21 V12 L12 6.5 L21 12 V21 Z'
const MAST = 'M12 6.5 V2'
const FLAG = 'M12 2 H16.5 L15.25 3.5 L16.5 5 H12 Z'
const DOOR = 'M10.25 21 V17 A1.75 1.75 0 0 1 13.75 17 V21 Z'
const WIN = 'M5.5 14 H8 V16.5 H5.5 Z M16 14 H18.5 V16.5 H16 Z'

export default function render(icon) {
  return build({
    name: (icon && icon.name) || 'school', paths: [],
    lines: [...lines(HOUSE, 'K'), ...lines(MAST, 'K'), ...lines(FLAG, 'A')],
    fills: [fill(HOUSE), fill(FLAG)],
    cutouts: [{ subs: parsePath(DOOR) }, { subs: parsePath(WIN) }],
  }) || []
}
