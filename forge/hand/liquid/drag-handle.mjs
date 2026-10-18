// forge/hand/liquid/drag-handle.mjs: the six-dot grip as six full, round coloured-glass beads. The generated dots were tiny
// pale blobs (each a stroked 1.75u circle) that carried no tint and vanished at 16px. Each bead is now a 3.4u disc of
// coloured glass (A, wm-a) in a 2 x 3 grid with a clear gap between neighbours, so the lens, refraction band and rim
// light all show and the grip reads at a glance. Same glass recipe as the generator (_liquid-core.mjs build).
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const ring = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`

function skeleton(name, parts) {
  const lines = [], fills = []
  for (const p of parts) {
    const subs = parsePath(p.d)
    for (const s of subs) lines.push({ pts: s.pts, closed: s.closed, plate: p.plate })
    fills.push({ subs })
  }
  return { name, paths: [], lines, fills, cutouts: [] }
}

const XS = [8.6, 15.4], YS = [5.1, 12, 18.9]
const BEADS = []
for (const y of YS) for (const x of XS) BEADS.push({ d: ring(x, y, 1.05), plate: 'A' })

export default function render(icon) {
  const name = (icon && icon.name) || 'drag-handle'
  const nodes = build(skeleton(name, BEADS)) || []
  // flat density: the coloured gradient normally runs along the light's diagonal, which left the top row pale and the
  // bottom row dense; the grip needs six beads of one weight
  const flat = { 1: [0.62, 0.8], 2: [0.5, 0.85] }
  for (const n of nodes) if (n[0] === 'defs') for (const g of n[2]) {
    if (g[1].id === `wg-liquid-${name}-4`) g[2][0][1]['stop-opacity'] = 0.45
    for (const k of [1, 2]) if (g[1].id === `wg-liquid-${name}-${k}`) g[2].forEach((s, i) => { s[1]['stop-opacity'] = flat[k][i] })
  }
  return nodes
}
