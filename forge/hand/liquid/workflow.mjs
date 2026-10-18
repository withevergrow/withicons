// forge/hand/liquid/workflow.mjs: two distinct clear-glass rounded-square nodes (top left, bottom right) linked by one
// slim coloured-glass elbow connector that stops short of each node, leaving a clear gap. The generated drawing welded
// a thick elbow onto the nodes, so the pair read as a bone or a boot. Same model and paint as the generator
// (_liquid-core.mjs build); only the geometry is drawn here. Motion: nodes wm-k, connector the A part (wm-a).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, erode } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const fill = set => ({ d: '', subs: set.map(r => ({ pts: r, closed: true })), set })
const ringsOf = d => parsePath(d, 0.15).map(s => s.pts)
const rrect = (x0, y0, x1, y1, r) =>
  `M${x0 + r} ${y0}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`

function skeleton(name) {
  const a = setOf(ringsOf(rrect(2.2, 2.2, 10.6, 10.6, 2.8)))
  const b = setOf(ringsOf(rrect(13.4, 13.4, 21.8, 21.8, 2.8)))
  // the connector: down from node A, round the corner, across to node B, both ends clear of the nodes
  const wire = parsePath('M6.4 12.7V15.6A2 2 0 0 0 8.4 17.6H11.9', 0.1)[0].pts
  return {
    name, paths: [], cutouts: [],
    fills: [fill(a), fill(b)],
    lines: [
      ...erode(a, 1.32).map(r => ({ pts: r, closed: true, plate: 'K' })),
      ...erode(b, 1.32).map(r => ({ pts: r, closed: true, plate: 'K' })),
      { pts: wire, closed: false, plate: 'A' },
    ],
  }
}

export default function render(icon) {
  const out = build(skeleton((icon && icon.name) || 'workflow'))
  if (!out) return null
  const defs = out[0] && out[0][0] === 'defs' ? out[0][2] : []
  const g0 = defs.find(g => /-0$/.test(g[1].id))
  if (g0) g0[2] = g0[2].map((s, i) => ['stop', { ...s[1], 'stop-opacity': [0.28, 0.5, 0.76][i] }])
  const g1 = defs.find(g => /-1$/.test(g[1].id))
  if (g1) g1[2] = g1[2].map((s, i) => ['stop', { ...s[1], 'stop-opacity': i === 0 ? 0.5 : 0.88 }])
  return out
}
