// forge/hand/liquid/circle-dot.mjs: a clear glass ring around a solid coloured-glass bead, with a real open gap between
// them. The generated drawing was a flat concentric target with a pale centre; here the ring is a thick glass tube
// (a disc with a clear hole) and the dot is a distinctly darker, solid disc, as in the line version.
import { build } from '../../styles/_liquid-core.mjs'

const r2 = v => Math.round(v * 100) / 100
const circle = (cx, cy, r, n = 40, dir = 1) => Array.from({ length: n }, (_, i) => { const t = dir * 2 * Math.PI * i / n; return [r2(cx + r * Math.cos(t)), r2(cy + r * Math.sin(t))] })

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

export default function render(icon) {
  const name = (icon && icon.name) || 'circle-dot'
  const outer = circle(12, 12, 9.5), hole = circle(12, 12, 6.2), dot = circle(12, 12, 3.6, 28)
  const nodes = build({
    name, paths: [],
    lines: [
      { pts: outer, closed: true, plate: 'K' }, { pts: hole, closed: true, plate: 'K' },
      { pts: dot, closed: true, plate: 'A' },
    ],
    fills: [{ subs: [{ pts: outer, closed: true }], set: [outer] }, { set: [dot] }],
    cutouts: [{ subs: [{ pts: hole, closed: true }] }],
  })
  if (!nodes) return null
  return tune(nodes, name, { k: [0.2, 0.44, 0.7], a: [0.62, 1], ink: 0.42 })
}
