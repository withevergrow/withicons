// forge/hand/liquid/rainbow.mjs: three separate heavy glass bands in rainbow order, an accent (warm pink) bead band
// outside, a clear blue glass band in the middle and a coloured violet band inside, with open gaps between them, painted
// with the style's own glass recipe and a deeper tint. The generated rainbow was one pale glass dome with three hairline
// grooves, so the bands never separated and at 16px it read as a dome or a bridge rather than a rainbow.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const lines = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))
const arc = r => `M${12 - r} ${CY}A${r} ${r} 0 0 1 ${12 + r} ${CY}`
const CY = 18.5

// deeper clear glass (0), deeper coloured glass (1), a firmer hairline and a fuller accent bead
function tune(nodes, name, { k, a, ink, s }) {
  const defs = nodes[0] && nodes[0][0] === 'defs' ? nodes[0][2] : []
  const set = (n, ops) => {
    const g = defs.find(x => x[1].id === `wg-liquid-${name}-${n}`)
    if (g) g[2].forEach((st, i) => { if (ops[i] !== undefined) st[1]['stop-opacity'] = ops[i] })
  }
  set(0, k); set(1, a)
  for (const n of nodes) {
    const at = n[1]
    if (!at) continue
    if (at['stroke-opacity'] === 0.3) at['stroke-opacity'] = ink
    if (String(at.fill).includes('liquid-accent') && at['fill-opacity'] === 0.75) at['fill-opacity'] = s
  }
  return nodes
}

export default function render(icon) {
  const name = (icon && icon.name) || 'rainbow'
  const nodes = build({
    name, paths: [],
    // band centrelines; each band is the plate's own tube (S 2.2u, K 2.6u, A 2.3u), S clears a moat round itself
    lines: [...lines(arc(9.45), 'S'), ...lines(arc(6.05), 'K'), ...lines(arc(2.85), 'A')],
    fills: [],
    cutouts: [],
  })
  if (!nodes) return null
  return tune(nodes, name, { k: [0.24, 0.48, 0.74], a: [0.5, 0.92], ink: 0.45, s: 0.9 })
}
