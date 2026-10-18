// forge/hand/liquid/meh.mjs: a clear liquid-glass disc (the style's own optics) with a light neutral face in deep
// glass ink: two small round dot eyes and one thin straight mouth, so it reads as meh (not a plug socket) at 16-24px.
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

const RING = 'M21.5 12A9.5 9.5 0 1 1 2.5 12A9.5 9.5 0 1 1 21.5 12Z'
// eyes: small round dots; mouth: a thin straight line (lighter detail weight like smile/laugh)
const EYE_L = [[9, 9.5], [9, 9.5]], EYE_R = [[15, 9.5], [15, 9.5]]
const MOUTH = [[8.8, 15.25], [15.2, 15.25]]

export default function render(icon) {
  const name = (icon && icon.name) || 'meh'
  const ico = {
    name,
    paths: [],
    lines: [
      ...lines(RING, 'K'),
    ],
    fills: [
      { set: rings(RING) },
    ],
    cutouts: [],
  }
  const nodes = build(ico)
  if (!nodes) return null
  const out = tune(nodes, name, { k: [0.2, 0.44, 0.7], a: [0.62, 1], ink: 0.42 })
  // the face, drawn light: two small round dot eyes and one thin straight mouth in deep coloured glass
  const g = 'var(--with-liquid-c3, #1C3F9E)'
  out.push(['circle', { cx: 9, cy: 9.5, r: 1.2, fill: g, stroke: 'currentColor', 'stroke-opacity': 0.42, 'stroke-width': 0.22, class: 'wm-a' }])
  out.push(['circle', { cx: 15, cy: 9.5, r: 1.2, fill: g, stroke: 'currentColor', 'stroke-opacity': 0.42, 'stroke-width': 0.22, class: 'wm-a' }])
  out.push(['line', { x1: 8.8, y1: 15.25, x2: 15.2, y2: 15.25, stroke: g, 'stroke-width': 1.4, 'stroke-linecap': 'round', class: 'wm-a' }])
  return out
}
