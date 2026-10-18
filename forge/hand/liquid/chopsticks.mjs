// forge/hand/liquid/chopsticks.mjs — a glass rice bowl with a pair of chopsticks held up at a clear angle.
// The generated sticks were two faint slivers of c2 glass that blended into the bowl's rim. Here they are long, parallel
// rods of denser coloured glass (the gradient is lifted so they hold against the page), set well above the bowl and
// leaning at about 50 degrees, with a visible gap between the rods and between the tips and the rim. The bowl keeps
// the skeleton's silhouette. The rods are the A part (wm-a). Same glass recipe as the generator (_liquid-core.mjs
// build); only the pieces, the rod stroke and the tint density change.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build, L } from '../../styles/_liquid-core.mjs'

const BOWL = 'M3 14.5H21C21 17.6 18.6 19.7 15 20.2L15.5 21.5H8.5L9 20.2C5.4 19.7 3 17.6 3 14.5Z'
const RODS = ['M9.2 11.4L16.4 2.8', 'M12.9 11.9L20.7 3.4']

export default function render(icon) {
  const name = (icon && icon.name) || 'chopsticks'
  const paths = [{ id: 'p0', d: BOWL, plate: 'K' }, ...RODS.map((d, i) => ({ id: 'p' + (i + 1), d, plate: 'A' }))]
    .map(p => ({ ...p, subs: parsePath(p.d) }))
  const subs = parsePath(BOWL)
  const sk = {
    name, paths, cutouts: [],
    lines: paths.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fills: [{ d: BOWL, subs, set: setOf(subs.map(s => s.pts)) }],
  }
  const wa = L.WA
  let nodes
  try { L.WA = 1.9; nodes = build(sk) } finally { L.WA = wa }
  // denser coloured glass and a firmer hairline for the rods
  for (const n of nodes) {
    if (n[0] === 'defs') for (const g of n[2]) {
      if (g[1].id === `wg-liquid-${name}-1`) g[2].forEach((s, i) => { s[1]['stop-opacity'] = [0.62, 0.92][i] })
    } else if (n[1].class === 'wm-a' && n[1].stroke === 'currentColor') n[1]['stroke-opacity'] = 0.55
  }
  return nodes
}
