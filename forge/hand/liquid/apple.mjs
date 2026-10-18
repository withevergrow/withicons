// forge/hand/liquid/apple.mjs: a plump clear-glass apple with a sheen groove, a short stout stem and a broad leaf in
// coloured glass (wm-a) springing from the stem. The generated stem was a hairline-thin tube and the leaf a detached
// sliver, so at 16px the top of the apple dissolved and the fruit read as a plain blob.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const lines = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))
const fill = d => ({ subs: parsePath(d) })

const BODY = 'M12 10 C14.5 7.5 20 8 20 13.5 C20 18 17 21.5 14.5 21.5 C13.5 21.5 13 21 12 21 C11 21 10.5 21.5 9.5 21.5 C7 21.5 4 18 4 13.5 C4 8 9.5 7.5 12 10 Z'
const STEM = 'M12 9.5 C12 7.75 11.75 6.25 11 4.75'
const LEAF = 'M13 6 C13.25 3.75 15.25 2.5 18 2.75 C17.75 5 15.75 6.5 13 6 Z'
const SHEEN = 'M7.5 15 A4 4 0 0 1 9 11.75'

export default function render(icon) {
  return build({
    name: (icon && icon.name) || 'apple', paths: [],
    lines: [...lines(BODY, 'K'), ...lines(STEM, 'A'), ...lines(LEAF, 'A')],
    fills: [fill(BODY), fill(LEAF)],
    cutouts: [{ subs: parsePath(SHEEN) }],
  }) || []
}
