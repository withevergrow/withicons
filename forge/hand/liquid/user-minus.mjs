// forge/hand/liquid/user-minus.mjs — a clear glass person with a fat accent-glass minus pill beside the head. The
// generated minus was a thin 2u dash in the same pink as the figure's warm edge fringe, so at 16px it melted into the
// shoulders; here the pill is half as thick again, set clear of the figure, and the figure's fringe is calmed so the
// accent bead is the only warm note. Painted with the style's own glass recipe (_liquid-core build); only the
// geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build, col } from '../../styles/_liquid-core.mjs'

// a skeleton-shaped model in 24-grid coordinates, as forge/lib/load.mjs prepares it
function model(name, paths, fills) {
  const P = paths.map(([d, plate], i) => ({ id: `p${i}`, d, plate, subs: parsePath(d) }))
  return {
    name, paths: P, cutouts: [],
    fills: fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }),
    lines: P.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
  }
}

const HEAD = 'M12.25 7.5A3.75 3.75 0 1 1 4.75 7.5A3.75 3.75 0 1 1 12.25 7.5Z'
const BODY = 'M2 21V19.5A4.5 4.5 0 0 1 6.5 15H10.5A4.5 4.5 0 0 1 15 19.5V21'
// the minus: a 3.4u pill (stroke core + fill), centred on the skeleton's bar at y 10
const MINUS = 'M16.75 10H21.25'
const PILL = 'M17.2 8.3H20.8A1.7 1.7 0 0 1 20.8 11.7H17.2A1.7 1.7 0 0 1 17.2 8.3Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'user-minus'
  const nodes = build(model(name, [[HEAD, 'K'], [BODY, 'K'], [MINUS, 'S']], [HEAD, BODY + 'Z', PILL]))
  if (!nodes) return null
  const c4 = col('c4')
  return nodes.map(n => {
    if (n[0] === 'defs') return n
    const a = n[1]
    // the figure's warm dispersion fringe steps back (the accent bead carries the warm colour)
    if (a.class === 'wm-k' && a.fill === c4) return [n[0], { ...a, 'fill-opacity': 0.3 }]
    // the badge glass reads a touch denser, with a firmer hairline
    if (a.class === 'wm-s' && a['fill-opacity'] === 0.75) return [n[0], { ...a, 'fill-opacity': 0.9, 'stroke-opacity': 0.45 }]
    return n
  })
}
