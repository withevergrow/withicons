// forge/hand/liquid/dhak.mjs: the line dhak: a horizontal barrel drum (open head on the left, rounded belly on the
// right) laced across with an X of coloured glass, and a tuft of three leaves on top.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const fill = d => ({ subs: parsePath(d) })
const lines = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))
const BARREL = 'M5.25 11H18.5C21.25 13 21.25 19.5 18.5 21.5H5.25A2.25 5.25 0 0 1 5.25 11Z'
const HEAD = 'M7.5 16.25A2.25 5.25 0 1 1 3 16.25A2.25 5.25 0 1 1 7.5 16.25Z'
const LACE = 'M9.2 12.2L13.5 20.3M17.8 12.2L13.5 20.3M9.2 20.3L13.5 12.2M17.8 20.3L13.5 12.2'
// three leaves: strokes that fan apart from one base, so the tips stay separate pieces of glass
const LEAF = ['M14.9 8.6L12.4 3.7', 'M16.2 8.4L16.8 2.9', 'M17.5 9L21.3 6.2']

export default function render(icon) {
  return build({
    name: (icon && icon.name) || 'dhak', paths: [],
    lines: [...lines(BARREL, 'K'), ...lines(LACE, 'K'), ...LEAF.flatMap(d => lines(d, 'A'))],
    fills: [fill(BARREL)],
    cutouts: [fill(HEAD)],
  }) || []
}
