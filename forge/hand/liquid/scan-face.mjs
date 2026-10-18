// forge/hand/liquid/scan-face.mjs: four clear-glass scan corners well apart from a minimal face: two dot eyes, one smile.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const lines = (d, plate, closed) => parsePath(d).map(s => ({ pts: s.pts, closed: closed ?? s.closed, plate }))
const fill = d => ({ subs: parsePath(d) })

const CORNERS = 'M3 8 V5.5 A2.5 2.5 0 0 1 5.5 3 H8 M16 3 H18.5 A2.5 2.5 0 0 1 21 5.5 V8 M21 16 V18.5 A2.5 2.5 0 0 1 18.5 21 H16 M8 21 H5.5 A2.5 2.5 0 0 1 3 18.5 V16'
const EYES = 'M8.2 9.5 A0.9 0.9 0 1 1 10 9.5 A0.9 0.9 0 1 1 8.2 9.5 Z M14 9.5 A0.9 0.9 0 1 1 15.8 9.5 A0.9 0.9 0 1 1 14 9.5 Z'
const SMILE = 'M8.5 14.5 C10.5 16.5 13.5 16.5 15.5 14.5'

export default function render(icon) {
  return build({
    name: (icon && icon.name) || 'scan-face', paths: [],
    lines: [...lines(CORNERS, 'K'), ...lines(SMILE, 'A'), ...lines(EYES, 'A', true)],
    fills: [fill(EYES)], cutouts: [],
  }) || []
}
