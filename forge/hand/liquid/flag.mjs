// forge/hand/liquid/flag.mjs: the flag as a thick liquid-glass object built with the style's own optics, a waving
// cloth of clear glass with a stronger tint and ink edge, on a heavier coloured-glass pole that reaches above the cloth.
// The generated flag was nearly white at 16px: a thin pale cloth on a hairline pole with no edge to hold the shape.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

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

const CLOTH = 'M5.5 3.75C8 2.5 10.5 2.5 13 3.75C15.5 5 18 5 20.5 3.75V14C18 15.25 15.5 15.25 13 14C10.5 12.75 8 12.75 5.5 14Z'
const POLE = 'M4.75 21.25V2.75'

export default function render(icon) {
  const name = (icon && icon.name) || 'flag'
  const ico = {
    name,
    paths: [],
    lines: [...lines(CLOTH, 'K'), ...lines(POLE, 'A')],
    fills: [{ set: rings(CLOTH) }, { set: [capsule([4.75, 2.9], [4.75, 21.1], 1.4)] }],
    cutouts: [],
  }
  const nodes = build(ico)
  if (!nodes) return null
  return tune(nodes, name, { k: [0.3, 0.55, 0.82], a: [0.55, 0.95], ink: 0.5 })
}
