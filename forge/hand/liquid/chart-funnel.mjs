// forge/hand/liquid/chart-funnel.mjs: three separate glass bars that narrow step by step (the middle one coloured
// glass) above a short stem, so it reads as a funnel rather than a stacked button.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const lines = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))
const fill = d => ({ subs: parsePath(d) })

const BARS = [
  ['M4.6 5 H19.4 L18.6 6.4 H5.4 Z', 'K'],
  ['M7 10.4 H17 L16.2 11.4 H7.8 Z', 'A'],
  ['M9.4 15.5 H14.6 L14.1 16.1 H9.9 Z', 'K'],
  ['M12 19.4 V20.8', 'K'],
]

export default function render(icon) {
  return build({
    name: (icon && icon.name) || 'chart-funnel', paths: [],
    lines: BARS.flatMap(([d, p]) => lines(d, p)),
    fills: BARS.slice(0, 3).map(([d]) => fill(d)),
    cutouts: [],
  }) || []
}
