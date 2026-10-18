// forge/hand/liquid/circle-chevron-right.mjs: a clear glass disc with ONE bold coloured-glass chevron inlaid in it.
// The generated chevron was a hollow tube cut out of the disc, so it read as a blob; here it is a single solid stroke
// (round caps, round outer joint, mitred inner joint) in the deeper A glass, so the arrow survives at 16px.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const lines = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))
const rings = d => parsePath(d).map(s => s.pts)
const r2 = v => Math.round(v * 100) / 100
const RING = 'M21.5 12A9.5 9.5 0 1 1 2.5 12A9.5 9.5 0 1 1 21.5 12Z'
const PTS = [[9.8, 7.8], [14.2, 12], [9.8, 16.2]]
const H = 1.5

const unit = (a, b) => { const l = Math.hypot(b[0] - a[0], b[1] - a[1]); return [(b[0] - a[0]) / l, (b[1] - a[1]) / l] }
const add = (p, v, s) => [p[0] + v[0] * s, p[1] + v[1] * s]
const ang = v => Math.atan2(v[1], v[0])
function arc(c, t0, t1, n) { const o = []; for (let i = 1; i < n; i++) { const q = t0 + (t1 - t0) * i / n; o.push([c[0] + H * Math.cos(q), c[1] + H * Math.sin(q)]) } return o }

function outline() {
  const [A, B, C] = PTS
  const d1 = unit(A, B), d2 = unit(B, C)
  const n1 = [-d1[1], d1[0]], n2 = [-d2[1], d2[0]]   // left normals (y down) = outside of the V
  const m1 = [-n1[0], -n1[1]], m2 = [-n2[0], -n2[1]]
  // inner mitre of the two inside edges (the chevron is symmetric about y = B.y)
  const inner = [B[0] - H * Math.SQRT2, B[1]]
  const a1 = ang(n1), a2 = ang(n2), a3 = ang(m2), a4 = ang(m1)
  const sw = (a, b, s) => { let d = b - a; while (s > 0 && d <= 0) d += 2 * Math.PI; while (s < 0 && d >= 0) d -= 2 * Math.PI; return a + d }
  const pts = [add(A, n1, H), add(B, n1, H)]
  pts.push(...arc(B, a1, sw(a1, a2, -1), 6))
  pts.push(add(B, n2, H), add(C, n2, H))
  pts.push(...arc(C, a2, sw(a2, a3, -1), 10))
  pts.push(add(C, m2, H), inner, add(A, m1, H))
  pts.push(...arc(A, a4, sw(a4, a1, -1), 10))
  return pts.map(([x, y]) => [r2(x), r2(y)])
}

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
  const name = (icon && icon.name) || 'circle-chevron-right'
  const o = outline()
  const nodes = build({
    name, paths: [],
    lines: [...lines(RING, 'K'), { pts: PTS, closed: false, plate: 'A' }],
    fills: [{ set: rings(RING) }, { set: [o] }],
    cutouts: [],
  })
  if (!nodes) return null
  return tune(nodes, name, { k: [0.2, 0.44, 0.7], a: [0.62, 1], ink: 0.42 })
}
