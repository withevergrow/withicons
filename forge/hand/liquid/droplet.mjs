// forge/hand/liquid/droplet.mjs: a clear-glass drop with a short sheen arc hugging the lower-left of the bowl.
// The generated sheen was a tall curved slot that read as a phone handset; this one is shorter and follows the rim.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const lines = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))
const fill = d => ({ subs: parsePath(d) })

const BODY = 'M12 2.5 C14.5 6 19 10 19 14.5 A7 7 0 0 1 5 14.5 C5 10 9.5 6 12 2.5 Z'
const SHEEN = 'M8.25 15.25 A3.75 3.75 0 0 0 9.75 17.5'

export default function render(icon) {
  return build({
    name: (icon && icon.name) || 'droplet', paths: [],
    lines: lines(BODY, 'K'),
    fills: [fill(BODY)],
    cutouts: [{ subs: parsePath(SHEEN) }],
  }) || []
}
