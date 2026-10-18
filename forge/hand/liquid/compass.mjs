// forge/hand/liquid/compass.mjs: a clear glass disc with a long two-tone needle: the north half is a pink accent
// glass bead, the south half a deep blue glass, split at a clear pivot. The generated needle was one faint diamond.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const lines = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))
const rings = d => parsePath(d).map(s => s.pts)
const RING = 'M21.5 12A9.5 9.5 0 1 1 2.5 12A9.5 9.5 0 1 1 21.5 12Z'
const NORTH = 'M17 7 L13.75 13.75 L10.25 10.25 Z'
const SOUTH = 'M7 17 L10.25 10.25 L13.75 13.75 Z'

export default function render(icon) {
  return build({
    name: (icon && icon.name) || 'compass', paths: [],
    lines: [...lines(RING, 'K'), ...lines(NORTH, 'S'), ...lines(SOUTH, 'A')],
    fills: [{ set: rings(RING) }, { subs: parsePath(NORTH) }, { subs: parsePath(SOUTH) }], cutouts: [],
  }) || []
}
