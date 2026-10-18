// forge/hand/liquid/fast-forward.mjs: two plump, softly rounded liquid-glass play triangles (the style's own optics),
// the chasing back one in deep coloured glass and the leading front one in clear glass with a firmer tint and ink edge.
// The generated triangles were thin-walled and so pale that at 16px they dissolved into two faint outlines.
import { build } from '../../styles/_liquid-core.mjs'

// a rounded triangle ring: corners a, b, c (skeleton units) filleted with radius r
function roundTri(pts, r, n = 8) {
  const out = []
  for (let i = 0; i < 3; i++) {
    const p = pts[i], a = pts[(i + 2) % 3], b = pts[(i + 1) % 3]
    const ua = norm([a[0] - p[0], a[1] - p[1]]), ub = norm([b[0] - p[0], b[1] - p[1]])
    const half = Math.acos(Math.max(-1, Math.min(1, ua[0] * ub[0] + ua[1] * ub[1]))) / 2
    const t = r / Math.tan(half), dc = r / Math.sin(half)
    const bis = norm([ua[0] + ub[0], ua[1] + ub[1]])
    const c = [p[0] + bis[0] * dc, p[1] + bis[1] * dc]
    const s = [p[0] + ua[0] * t, p[1] + ua[1] * t], e = [p[0] + ub[0] * t, p[1] + ub[1] * t]
    let a0 = Math.atan2(s[1] - c[1], s[0] - c[0]), a1 = Math.atan2(e[1] - c[1], e[0] - c[0])
    let da = a1 - a0
    while (da > Math.PI) da -= 2 * Math.PI
    while (da < -Math.PI) da += 2 * Math.PI
    for (let k = 0; k <= n; k++) { const t2 = a0 + da * k / n; out.push([c[0] + r * Math.cos(t2), c[1] + r * Math.sin(t2)]) }
  }
  return out
}
const norm = v => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }

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

export default function render(icon) {
  const name = (icon && icon.name) || 'fast-forward'
  const back = roundTri([[2.25, 5], [2.25, 19], [11.25, 12]], 1.6)
  const front = roundTri([[12.75, 5], [12.75, 19], [21.75, 12]], 1.6)
  const ico = {
    name,
    paths: [],
    lines: [
      { pts: back, closed: true, plate: 'A' },
      { pts: front, closed: true, plate: 'K' },
    ],
    fills: [{ set: [back] }, { set: [front] }],
    cutouts: [],
  }
  const nodes = build(ico)
  if (!nodes) return null
  return tune(nodes, name, { k: [0.3, 0.55, 0.82], a: [0.6, 1], ink: 0.48 })
}
