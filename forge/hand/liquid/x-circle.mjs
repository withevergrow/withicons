// forge/hand/liquid/x-circle.mjs: a clear liquid-glass disc (the style's own optics) with a bold coloured-glass X,
// two heavy round-ended bars inlaid in the disc and tinted deeper, so the "no / error" mark carries at 16px.
// The generated X was a thin pale inlay on a pale disc, so at small sizes the icon read as a blank glass button.
import { build } from '../../styles/_liquid-core.mjs'
import { parsePath } from '../../kernel/geom.mjs'

const lines = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))
const rings = d => parsePath(d).map(s => s.pts)
// a capsule ring from a to b with radius r (skeleton units)
function capsule(a, b, r, n = 12) {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), out = []
  for (let i = 0; i <= n; i++) { const t = ang - Math.PI / 2 - Math.PI * i / n; out.push([a[0] + r * Math.cos(t), a[1] + r * Math.sin(t)]) }
  for (let i = 0; i <= n; i++) { const t = ang + Math.PI / 2 - Math.PI * i / n; out.push([b[0] + r * Math.cos(t), b[1] + r * Math.sin(t)]) }
  return out
}

// a stronger tint on the clear glass (0), a deeper coloured glass (1) and a firmer ink hairline
function tune(nodes, name, { k, a, ink }) {
  const defs = nodes[0] && nodes[0][0] === 'defs' ? nodes[0][2] : []
  const set = (n, ops) => {
    const g = defs.find(x => x[1].id === `wg-liquid-${name}-${n}`)
    if (g) g[2].forEach((s, i) => { if (ops[i] !== undefined) s[1]['stop-opacity'] = ops[i] })
  }
  set(0, k); set(1, a)
  for (const n of nodes) if (n[1] && n[1]['stroke-opacity'] === 0.3) n[1]['stroke-opacity'] = ink
  return nodes
}

const RING = 'M21.5 12A9.5 9.5 0 1 1 2.5 12A9.5 9.5 0 1 1 21.5 12Z'
const A1 = [8.5, 8.5], B1 = [15.5, 15.5], A2 = [15.5, 8.5], B2 = [8.5, 15.5]

export default function render(icon) {
  const name = (icon && icon.name) || 'x-circle'
  const ico = {
    name,
    paths: [],
    lines: [
      ...lines(RING, 'K'),
      { pts: [A1, B1], closed: false, plate: 'A' },
      { pts: [A2, B2], closed: false, plate: 'A' },
    ],
    fills: [{ set: rings(RING) }, { set: [capsule(A1, B1, 1.5)] }, { set: [capsule(A2, B2, 1.5)] }],
    cutouts: [],
  }
  const nodes = build(ico)
  if (!nodes) return null
  return tune(nodes, name, { k: [0.2, 0.44, 0.7], a: [0.62, 1], ink: 0.42 })
}
