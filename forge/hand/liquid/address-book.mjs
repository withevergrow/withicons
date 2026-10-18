// forge/hand/liquid/address-book.mjs — a ring-bound contacts book of clear glass: a tall rounded cover with three index
// tabs on its right edge, and on the cover a violet-glass head circle over rounded shoulders (the line version's
// person-on-cover). The generated drawing hollowed head and shoulders out of the cover and read as a concentric
// lens; here the person is a solid coloured glass bust. Painted with the style's own glass recipe (_liquid-core
// build); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

function model(name, paths, fills) {
  const P = paths.map(([d, plate], i) => ({ id: `p${i}`, d, plate, subs: parsePath(d) }))
  return {
    name, paths: P, cutouts: [],
    fills: fills.map(d => ({ d, subs: parsePath(d) })),
    lines: P.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
  }
}

const COVER = 'M5.5 2.5H16.5A2 2 0 0 1 18.5 4.5V19.5A2 2 0 0 1 16.5 21.5H5.5A2 2 0 0 1 3.5 19.5V4.5A2 2 0 0 1 5.5 2.5Z'
const TABS = 'M18.5 7H20.5M18.5 12H20.5M18.5 17H20.5'
const HEAD = 'M13 8.5A2 2 0 1 1 9 8.5A2 2 0 1 1 13 8.5Z'
const BUST = 'M7.5 17.5V16.5A2 2 0 0 1 9.5 14.5H12.5A2 2 0 0 1 14.5 16.5V17.5Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'address-book'
  const nodes = build(model(name, [[COVER, 'K'], [TABS, 'K'], [HEAD, 'A'], [BUST, 'A']], [COVER, HEAD, BUST]))
  if (!nodes) return null
  return nodes
}
