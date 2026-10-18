// forge/hand/liquid/stamp.mjs: a rubber stamp built the way people draw one: a round coloured-glass knob on a short
// neck that flares out into a wide clear-glass block, and a thin clear-glass ink line beneath it. The generated stamp
// had a lumpy blob for a handle and a fat pink bar for the impression that out-shouted the stamp itself; here the knob,
// the neck and the flared head each read, and the impression is a slim clear bar (no accent bead). Painted with the
// style's own glass recipe (_liquid-core build); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const lines = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))
const fill = d => ({ d, subs: parsePath(d) })

// head: a neck (3.6u wide) that flares through two concave curves into a 17u block with rounded feet
const HEAD = 'M10.2 8.2H13.8V10.6C13.8 11.6 14.6 12 15.9 12H18.6A2.4 2.4 0 0 1 21 14.4V16.6A0.9 0.9 0 0 1 20.1 17.5H3.9A0.9 0.9 0 0 1 3 16.6V14.4A2.4 2.4 0 0 1 5.4 12H8.1C9.4 12 10.2 11.6 10.2 10.6Z'
// the knob: a round bead of coloured glass sitting on the neck
const KNOB = 'M12 2.1A3.3 3.3 0 1 1 12 8.7A3.3 3.3 0 1 1 12 2.1Z'
// the impression: a slim bar of clear glass under the head
const BAR = 'M4.6 19.9H19.4A0.7 0.7 0 0 1 20.1 20.6V20.9A0.7 0.7 0 0 1 19.4 21.6H4.6A0.7 0.7 0 0 1 3.9 20.9V20.6A0.7 0.7 0 0 1 4.6 19.9Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'stamp'
  const nodes = build({
    name,
    paths: [],
    lines: [
      ...lines('M6 14.6H6.4V15H6Z', 'K'), ...lines('M11.8 14.6H12.2V15H11.8Z', 'K'), ...lines('M17.6 14.6H18V15H17.6Z', 'K'),
      ...lines('M10.3 5.4A1.7 1.7 0 1 0 13.7 5.4A1.7 1.7 0 1 0 10.3 5.4Z', 'A'),
    ],
    fills: [fill(HEAD), fill(BAR), fill(KNOB)],
    cutouts: [],
  })
  if (!nodes) return null
  // deeper coloured glass for the knob (it sits at the top-left, where the recipe's gradient is faintest)
  const g1 = nodes[0][2].find(g => g[1].id === `wg-liquid-${name}-1`)
  if (g1) g1[2].forEach((st, i) => { st[1]['stop-opacity'] = [0.55, 0.95][i] })
  return nodes
}
