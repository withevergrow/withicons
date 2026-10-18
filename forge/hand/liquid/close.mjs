// forge/hand/liquid/close.mjs: one bold coloured-glass X (a single closed outline: two heavy arms with round ends and
// sharp crossing notches) in the deeper A glass. The generated X was two thin pale tubes that vanished at 16px.
import { build } from '../../styles/_liquid-core.mjs'

const r2 = v => Math.round(v * 100) / 100
const H = 1.75, C = 12, E = 5.6, D = H * Math.SQRT2
const ENDS = [[C - E, C - E, 225], [C + E, C - E, 315], [C + E, C + E, 45], [C - E, C + E, 135]]
const NOTCH = [[C, C - D], [C + D, C], [C, C + D], [C - D, C]]   // after TL, TR, BR, BL (clockwise)

function outline() {
  const pts = [], n = 10
  ENDS.forEach(([x, y, deg], k) => {
    for (let i = 0; i <= n; i++) {
      const t = (deg - 90 + 180 * i / n) * Math.PI / 180
      pts.push([r2(x + H * Math.cos(t)), r2(y + H * Math.sin(t))])
    }
    pts.push(NOTCH[k].map(r2))
  })
  return pts
}

function tune(nodes, name, { a, ink }) {
  const defs = nodes[0] && nodes[0][0] === 'defs' ? nodes[0][2] : []
  const g = defs.find(x => x[1].id === `wg-liquid-${name}-1`)
  if (g) g[2].forEach((s, i) => { if (a[i] !== undefined) s[1]['stop-opacity'] = a[i] })
  for (const n of nodes) if (n[1] && n[1]['stroke-opacity'] === 0.3) n[1]['stroke-opacity'] = ink
  return nodes
}

export default function render(icon) {
  const name = (icon && icon.name) || 'close'
  const o = outline()
  const nodes = build({
    name, paths: [],
    lines: [{ pts: o, closed: true, plate: 'A' }],
    fills: [{ subs: [{ pts: o, closed: true }], set: [o] }],
    cutouts: [],
  })
  if (!nodes) return null
  return tune(nodes, name, { a: [0.7, 1], ink: 0.45 })
}
