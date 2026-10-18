// forge/hand/liquid/wheat.mjs: the ear of wheat as seven plump clear-glass grains, three angled pairs and a tip
// grain, each a separate bead with its own rim light, on a coloured-glass stalk (wm-a). The generated ear was narrow
// grain outlines fused by the thick glass tube and scored by vein cut-outs, so the head read as a pale ribbed spike at
// 16px; the wider beads keep a clear chevron of grains and the tint is lifted a step so it holds on white.
import { build } from '../../styles/_liquid-core.mjs'

const r2 = v => Math.round(v * 100) / 100
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

// a grain: a teardrop from its base (bx, by) along angle ang (degrees from straight up, + leans right),
// len long and wid wide, fullest just below its middle and drawn to a soft point at the tip
function grain(bx, by, ang, len, wid, n = 28) {
  const a = ang * Math.PI / 180, u = [Math.sin(a), -Math.cos(a)], v = [Math.cos(a), Math.sin(a)]
  const ring = [], spine = []
  for (let i = 0; i < n; i++) {
    const th = 2 * Math.PI * i / n
    const t = (1 - Math.cos(th)) / 2                     // 0 at the base, 1 at the tip
    const w = (wid / 2) * Math.sin(th) * (1 - 0.35 * t)  // narrower toward the tip
    const p = t * len
    ring.push([r2(bx + u[0] * p + v[0] * w), r2(by + u[1] * p + v[1] * w)])
  }
  // a narrow closed spine inside the grain carries the K plate (the glass tube stays inside the outline)
  const s0 = len * 0.35, s1 = len * 0.62, sw = 0.25
  for (const [p, w] of [[s0, 0], [(s0 + s1) / 2, sw], [s1, 0], [(s0 + s1) / 2, -sw]]) spine.push([r2(bx + u[0] * p + v[0] * w), r2(by + u[1] * p + v[1] * w)])
  return { ring, spine }
}

const LEN = 5.5, WID = 3.9
const GRAINS = [
  grain(11.35, 18.1, -38, LEN, WID), grain(12.65, 18.1, 38, LEN, WID),
  grain(11.35, 13.6, -36, LEN, WID), grain(12.65, 13.6, 36, LEN, WID),
  grain(11.4, 9.2, -32, LEN * 0.95, WID * 0.95), grain(12.6, 9.2, 32, LEN * 0.95, WID * 0.95),
  grain(12, 7.6, 0, 5.4, 3.4),
]
const STALK = [[12, 22.25], [12, 17.75]]

export default function render(icon) {
  const name = (icon && icon.name) || 'wheat'
  const nodes = build({
    name, paths: [],
    lines: [...GRAINS.map(g => ({ pts: g.spine, closed: true, plate: 'K' })), { pts: STALK, closed: false, plate: 'A' }],
    fills: GRAINS.map(g => ({ set: [g.ring] })),
    cutouts: [],
  })
  if (!nodes) return null
  return tune(nodes, name, { k: [0.26, 0.5, 0.78], a: [0.66, 1], ink: 0.45 })
}
