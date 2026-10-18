// forge/hand/liquid/utensils.mjs — fork and knife redrawn for liquid glass: the fork head is drawn as a filled
// shape with three slim tines and open gaps (stroked tines fused into one paddle at the style's thick weight), and
// the knife (wm-a) gets a broad blade on a round handle. Painted by the style's own engine.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

// fork head: three tines (1.8 wide, 1.8 apart) on a rounded yoke that narrows into the handle
const HEAD = 'M3 3.2 A0.9 0.9 0 0 1 4.8 3.2 V7.5 H6.6 V3.2 A0.9 0.9 0 0 1 8.4 3.2 V7.5 H10.2 V3.2 A0.9 0.9 0 0 1 12 3.2 '
  + 'V8.25 C12 10.5 10.5 11.75 8.75 12.25 H6.25 C4.5 11.75 3 10.5 3 8.25 Z'
const BLADE = 'M19.5 2.5 C16.25 3.5 14.25 7 14.25 11.25 V13 A1.5 1.5 0 0 0 15.75 14.5 H19.5 Z'
const PATHS = [
  ['M7.5 9.5 V21', 'K'],              // fork handle
  ['M19.25 3.5 V14.5', 'A'],          // knife spine
  ['M18 14.5 V21', 'A'],              // knife handle
]
const FILLS = [HEAD, BLADE]

export default function render(icon) {
  return build(glass(icon && icon.name || 'utensils'))
}

function glass(name) {
  const paths = PATHS.map(([d, plate], i) => ({ id: 'p' + i, d, plate, subs: parsePath(d) }))
  return {
    name, paths,
    lines: paths.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fills: FILLS.map(d => ({ d, subs: parsePath(d), set: [] })),
    cutouts: [],
  }
}
