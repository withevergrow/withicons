// forge/hand/liquid/pizza.mjs — the slice redrawn for liquid glass: a clear-glass wedge whose outer edge is a fat
// coloured-glass crust (wm-a) and three accent pepperoni beads, so the wedge stays the main shape and nothing reads
// as the old inner arc plus centre dot (a Wi-Fi / RSS sign). Painted by the style's own engine.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const WEDGE = 'M3.5 20.5 L8.75 4.33 A17 17 0 0 1 19.67 15.25 Z'
const dot = (x, y, r = 0.4) => `M${x + r} ${y} A${r} ${r} 0 1 1 ${x - r} ${y} A${r} ${r} 0 1 1 ${x + r} ${y} Z`
const PATHS = [
  [WEDGE, 'K'],
  ['M8.55 4.85 A16.5 16.5 0 0 1 19.15 15.45', 'A'],
  [dot(9.75, 10.75), 'S'],
  [dot(13.25, 14.25), 'S'],
  [dot(7.75, 16.25), 'S'],
]
const FILLS = [WEDGE]

export default function render(icon) {
  return build(glass(icon && icon.name || 'pizza'))
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
