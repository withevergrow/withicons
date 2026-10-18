// forge/hand/liquid/stop.mjs: the stop control as the common stop button: a rounded square of clear glass with a solid
// coloured-glass rounded square inlaid in a hairline moat. (An earlier octagon read as a road sign, not the media stop.)
// The inner block is the A part (wm-a); denser tints than the generator so the glass holds on white at 16px.
// Same model and paint as the generator (_liquid-core.mjs build); only the geometry is drawn.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, erode } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const fill = set => ({ d: '', subs: set.map(r => ({ pts: r, closed: true })), set })
// a rounded square from its corner arcs
const rsq = (x0, y0, x1, y1, r) => setOf(parsePath(`M${x0 + r} ${y0}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`, 0.04).map(s => s.pts))

function skeleton(name) {
  const outer = rsq(3.2, 3.2, 20.8, 20.8, 4.6)
  const inner = rsq(8.2, 8.2, 15.8, 15.8, 2.2)
  return {
    name, paths: [], cutouts: [],
    fills: [fill(outer), fill(inner)],
    lines: [
      ...erode(outer, 1.32).map(r => ({ pts: r, closed: true, plate: 'K' })),
      ...erode(inner, 1.15).map(r => ({ pts: r, closed: true, plate: 'A' })),
    ],
  }
}

export default function render(icon) {
  const out = build(skeleton((icon && icon.name) || 'stop'))
  if (!out) return null
  const defs = out[0] && out[0][0] === 'defs' ? out[0][2] : []
  const g0 = defs.find(g => /-0$/.test(g[1].id))
  if (g0) g0[2] = g0[2].map((s, i) => ['stop', { ...s[1], 'stop-opacity': [0.24, 0.44, 0.7][i] }])
  const g1 = defs.find(g => /-1$/.test(g[1].id))
  if (g1) g1[2] = g1[2].map((s, i) => ['stop', { ...s[1], 'stop-opacity': i === 0 ? 0.55 : 0.9 }])
  return out
}
