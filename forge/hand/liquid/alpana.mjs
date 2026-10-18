// forge/hand/liquid/alpana.mjs: the line alpana as glass: five curling swirls (open C-curls, each its own tube of clear
// glass) pinwheeled around a coloured centre disc, with a coloured bead tucked between every pair of swirls. The
// generated swirls were tight spirals that closed up into one lumpy mass; here every curl keeps its own open eye.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const r2 = v => Math.round(v * 100) / 100
const fill = d => ({ subs: parsePath(d) })
const disc = (x, y, r) => `M${r2(x - r)} ${r2(y)}A${r} ${r} 0 1 0 ${r2(x + r)} ${r2(y)}A${r} ${r} 0 1 0 ${r2(x - r)} ${r2(y)}Z`

const N = 5, DIST = 7.7, R0 = 2.7, R1 = 2.3
function swirl(i) {
  const th = -Math.PI / 2 + i * 2 * Math.PI / N
  const cx = 12 + Math.cos(th) * DIST, cy = 12 + Math.sin(th) * DIST
  const pts = []
  const a0 = th + Math.PI + 0.55, sweep = 4.9, steps = 24
  for (let k = 0; k <= steps; k++) {
    const t = k / steps, a = a0 + sweep * t, r = R0 + (R1 - R0) * t
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r])
  }
  return { pts, closed: false, plate: 'K' }
}
const BEADS = Array.from({ length: N }, (_, i) => {
  const th = -Math.PI / 2 + (i + 0.5) * 2 * Math.PI / N
  return [12 + Math.cos(th) * 10.3, 12 + Math.sin(th) * 10.3]
})

export default function render(icon) {
  const centre = disc(12, 12, 2.1)
  const dots = BEADS.map(([x, y]) => disc(x, y, 0.8))
  return build({
    name: (icon && icon.name) || 'alpana', paths: [],
    lines: [...Array.from({ length: N }, (_, i) => swirl(i)),
      ...[centre, ...dots].flatMap(d => parsePath(d).map(s => ({ pts: s.pts, closed: true, plate: 'A' })))],
    fills: [centre, ...dots].map(fill),
    cutouts: [],
  }) || []
}
