// forge/hand/liquid/info-circle.mjs: a clear liquid-glass disc (the style's own optics) with a bold coloured-glass
// "i": a heavy stem with a short top serif and a round dot, inlaid in the disc and tinted deeper so it carries at 16px.
// The generated i was a thin pale inlay that faded into the pale disc, reading as a faint smudge at small sizes.
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
const disc = (cx, cy, r, n = 28) => Array.from({ length: n }, (_, i) => [cx + r * Math.cos(2 * Math.PI * i / n), cy + r * Math.sin(2 * Math.PI * i / n)])

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

export default function render(icon) {
  const name = (icon && icon.name) || 'info-circle'
  const stem = capsule([12.25, 11.75], [12.25, 16.9], 1.5)
  const serif = capsule([10.4, 11.4], [12.25, 11.4], 1.1)
  const dot = disc(12.25, 6.4, 1.7)
  const ico = {
    name,
    paths: [],
    lines: [
      ...lines(RING, 'K'),
      { pts: [[12.25, 11.75], [12.25, 16.9]], closed: false, plate: 'A' },
      { pts: [[10.4, 11.4], [12.25, 11.4]], closed: false, plate: 'A' },
      { pts: [[12.25, 6.4]], closed: false, plate: 'A' },
    ],
    fills: [{ set: rings(RING) }, { set: [stem] }, { set: [serif] }, { set: [dot] }],
    cutouts: [],
  }
  const nodes = build(ico)
  if (!nodes) return null
  return tune(nodes, name, { k: [0.2, 0.44, 0.7], a: [0.62, 1], ink: 0.42 })
}
