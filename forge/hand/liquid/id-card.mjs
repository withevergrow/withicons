// forge/hand/liquid/id-card.mjs: a thick clear glass card with a solid violet-glass portrait (round head over a domed
// shoulders bust) on the left and two violet pill bars on the right. The generated portrait was a ring-and-blob tangle
// of hollow tubes; here the head and the bust are two plain solid inlays and the bars plain pills.
// Same glass recipe as the generator (_liquid-core build); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

function prep(name, paths, fills = []) {
  const lines = paths.flatMap(([d, plate]) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate })))
  return {
    name, lines, paths: [], cutouts: [],
    fills: fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }),
  }
}
const CARD = 'M4 4 H20 A2 2 0 0 1 22 6 V18 A2 2 0 0 1 20 20 H4 A2 2 0 0 1 2 18 V6 A2 2 0 0 1 4 4 Z'
const HEAD = 'M9.4 9.4 A0.9 0.9 0 1 1 7.6 9.4 A0.9 0.9 0 1 1 9.4 9.4 Z'
const BUST = 'M6.5 17.9 V17.5 A2 2 0 0 1 8.5 15.5 A2 2 0 0 1 10.5 17.5 V17.9 Z'
const BARS = ['M14.6 9.2 H18.4', 'M14.6 13.2 H17']

export default function render(icon) {
  const name = (icon && icon.name) || 'id-card'
  const nodes = build(prep(name, [[CARD, 'K'], [HEAD, 'A'], [BUST, 'A'], ...BARS.map(d => [d, 'A'])], [CARD, HEAD]))
  for (const n of nodes) if (n[0] !== 'defs' && n[1].stroke === 'currentColor') { n[1]['stroke-opacity'] = 0.42 }
  return nodes
}
