// forge/hand/chrome/unlink.mjs: two separate chrome chain links, each a closed oval on the 45-degree axis, one up at the
// right and one down at the left (as in line), with a hot enamel break tick on each side of the gap between them. Earlier
// drafts split the link into two open U hooks, which read as horseshoes or question marks; closed ovals read as links at
// 16px, and the ticks carry the "broken" meaning. Hollow tubes, like link; no slab fill. Same model and paint as the
// generator (_chrome-core.mjs); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

const LINKS = [
  'M3.5 16.5L6.5 13.5A2.83 2.83 0 0 1 10.5 17.5L7.5 20.5A2.83 2.83 0 0 1 3.5 16.5Z',
  'M13.5 6.5L16.5 3.5A2.83 2.83 0 0 1 20.5 7.5L17.5 10.5A2.83 2.83 0 0 1 13.5 6.5Z',
]
// the break ticks, one off each link's inner end
const MARKS = ['M9 9L7 7', 'M15 15L17 17']

function skeleton(name) {
  const paths = [...LINKS.map(d => [d, 'K']), ...MARKS.map(d => [d, 'S'])]
    .map(([d, plate], i) => ({ id: 'p' + i, d, plate, subs: parsePath(d) }))
  return {
    name, paths, fills: [], cutouts: [],
    lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))),
  }
}

export default function render(icon) {
  const name = (icon && icon.name) || 'unlink'
  const Ls = layers(model(skeleton(name)))
  // each break mark gets its own enamel ramp (one shared ramp left the upper mark washed out in its glossy top)
  const list = []
  for (const L of Ls.list) {
    if (!Array.isArray(L.fill) || L.fill[0] !== 'enamel') { list.push(L); continue }
    for (const side of [l => l[0][1] < 12, l => l[0][1] >= 12]) {
      const loops = L.loops.filter(side)
      if (!loops.length) continue
      const xs = loops.flat().map(p => p[0]), ys = loops.flat().map(p => p[1])
      list.push({ ...L, loops, fill: ['enamel', [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]] })
    }
  }
  return emit({ ...Ls, list }, name, 0)
}
