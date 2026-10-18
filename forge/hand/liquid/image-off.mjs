// forge/hand/liquid/image-off.mjs: the clear glass picture frame with its coloured mountain ridge and sun inlaid, struck
// through by a slim accent glass slash that cuts a clean moat across both. The generated slash was thick and its
// moat swallowed the mountain, leaving a muddy interior.
import { parsePath } from '../../kernel/geom.mjs'
import { build, L } from '../../styles/_liquid-core.mjs'

const lines = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))
const fill = d => ({ subs: parsePath(d) })
const mark = (x, y, plate) => ({ pts: [[x, y], [x + 0.02, y]], closed: false, plate })

// frame, inset so the glass lines grow it back to 2.4..21.6 x 3.6..20.4
const FRAME = 'M6.1 5.1 H17.9 A2.4 2.4 0 0 1 20.3 7.5 V16.5 A2.4 2.4 0 0 1 17.9 18.9 H6.1 A2.4 2.4 0 0 1 3.7 16.5 V7.5 A2.4 2.4 0 0 1 6.1 5.1 Z'
const RIDGE = 'M4.4 17.2 L8.6 12.8 L12.2 16.4 L14.6 14 L19.4 18.2'
const SUN = 'M18.4 8.4 A1.7 1.7 0 1 1 15 8.4 A1.7 1.7 0 1 1 18.4 8.4 Z'
const SLASH = 'M3.6 3.4 L20.4 20.6'

export default function render(icon) {
  // a slimmer accent slash with a wider clean moat (restored after the build, so no other icon is touched)
  const keep = { WS: L.WS, MOAT: L.MOAT }
  L.WS = 1.6; L.MOAT = 0.7
  try { return build({
    name: (icon && icon.name) || 'image-off', paths: [],
    lines: [...lines(FRAME, 'K'), ...lines(RIDGE, 'A'), mark(16.7, 8.4, 'A'), ...lines(SLASH, 'S')],
    fills: [fill(FRAME), fill(SUN)],
    cutouts: [],
  }) || [] } finally { L.WS = keep.WS; L.MOAT = keep.MOAT }
}
