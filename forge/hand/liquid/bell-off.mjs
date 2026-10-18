// forge/hand/liquid/bell-off.mjs: one whole clear glass bell with its clapper, struck through by a broad accent glass bar
// that cuts its own moat (as shield-off). The generated slash was a thin pink bead over a pale split bell.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const lines = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))
const fill = d => ({ subs: parsePath(d) })

const BELL = 'M12 3.4 C8.4 3.4 6 6.1 6 9.8 V14 L4.2 17.2 H19.8 L18 14 V9.8 C18 6.1 15.6 3.4 12 3.4 Z'
const CLAPPER = 'M13.4 19.4 A1.4 1.4 0 1 1 10.6 19.4 A1.4 1.4 0 1 1 13.4 19.4 Z'
const SLASH = 'M3.4 3.4 L20.6 20.6'
const BAR = 'M4.5 2.3 L21.7 19.5 A1.55 1.55 0 0 1 19.5 21.7 L2.3 4.5 A1.55 1.55 0 0 1 4.5 2.3 Z'

export default function render(icon) {
  return build({
    name: (icon && icon.name) || 'bell-off', paths: [],
    lines: [...lines(BELL, 'K'), ...lines(CLAPPER, 'A'), ...lines(SLASH, 'S')],
    fills: [fill(BELL), fill(CLAPPER), fill(BAR)],
    cutouts: [],
  }) || []
}
