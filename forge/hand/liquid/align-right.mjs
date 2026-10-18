// forge/hand/liquid/align-right.mjs — four right-flush glass bars, drawn as plump 3.2u pills instead of the generator's
// thin 2.3u tubes, with the clear-glass tint deepened a step. The generated bars were so slim and pale that on white
// they washed out to hairlines at 16px; these hold their shape and colour on light and dark. Same model and light
// as the generator (_liquid-core.mjs); only the geometry and the body tint are set here.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

// a skeleton in the shape the liquid model expects: parts [{ d, plate, fill, line }] (line: false = mass only, not tubed: a tubed outline would swell
// the bars into each other, and a centreline inside the mass is read as a groove)
function skeleton(name, parts) {
  const paths = parts.filter(p => p.line !== false).map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => ({ d: p.d, subs: parsePath(p.d) }))
  return { name, paths, fills, cutouts: [], lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}

// a horizontal pill from x0 to x1 centred on y, T thick
const T = 3.2
const pill = (x0, x1, y) => { const r = T / 2; return `M${x0 + r} ${y - r}H${x1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y + r}H${x0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y - r}Z` }
const ROWS = [4.5, 9.5, 14.5, 19.5]
const BARS = [[3,21],[9,21],[3,21],[9,21]]

// the clear glass carries a little more c1 than on a big slab, so slim bars keep their colour on white
const DEEP = [0.3, 0.52, 0.78]
function deepen(nodes, name) {
  const body = `wg-liquid-${name}-0`
  return nodes.map(n => n[0] !== 'defs' ? n : ['defs', n[1], n[2].map(g => g[1].id !== body ? g
    : [g[0], g[1], g[2].map((st, i) => ['stop', { ...st[1], 'stop-opacity': DEEP[i] ?? st[1]['stop-opacity'] }])])])
}

export default function render(icon) {
  const name = (icon && icon.name) || 'align-right'
  return deepen(build(skeleton(name, BARS.map(([a, b], i) => ({ d: pill(a, b, ROWS[i]), plate: 'K', fill: true, line: false })))), name)
}
