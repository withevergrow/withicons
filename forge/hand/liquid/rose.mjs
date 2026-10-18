// forge/hand/liquid/rose.mjs: a layered rose cup in coloured glass (outer petals, inner bud), long clear stem, two leaves.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const lines = (d, plate, closed) => parsePath(d).map(s => ({ pts: s.pts, closed: closed ?? s.closed, plate }))
const fill = d => ({ subs: parsePath(d) })

const CUP = 'M5.5 7.5 C5.5 4.5 8.5 3 12 3 C15.5 3 18.5 4.5 18.5 7.5 C18.5 11 15.5 13 12 13 C8.5 13 5.5 11 5.5 7.5 Z'
const PETALS = 'M12 5.5 C10.5 5.5 9.75 7 10.75 8 C11.75 9 13.75 8.25 13.5 6.75 M8 6.5 C7.5 9.5 10 11 12 11 C14 11 16.5 9.5 16 6.5'
const STEM = 'M12 12.5 V21.5'
const LEAF_R = 'M12 17.5 C12.75 15.25 15 14.5 17 15 C16.25 17.25 14 18 12 17.5 Z'
const LEAF_L = 'M12 19.5 C11.25 17.75 9.25 17 7.5 17.5 C8.25 19.25 10.25 20 12 19.5 Z'

export default function render(icon) {
  return build({
    name: (icon && icon.name) || 'rose', paths: [],
    lines: [...lines(CUP, 'A'), ...lines(PETALS, 'K'), ...lines(STEM, 'K'), ...lines(LEAF_R, 'K'), ...lines(LEAF_L, 'K')],
    fills: [fill(CUP), fill(LEAF_R), fill(LEAF_L)],
    cutouts: [],
  }) || []
}
