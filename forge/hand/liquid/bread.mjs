// forge/hand/liquid/bread.mjs: a long low loaf of clear glass on a flat base, its crown cut by three clean diagonal
// score slots.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const rings = d => parsePath(d).map(s => s.pts)
function capsule(a, b, r, n = 8) {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), out = []
  for (let i = 0; i <= n; i++) { const t = ang + Math.PI / 2 + Math.PI * i / n; out.push([a[0] + r * Math.cos(t), a[1] + r * Math.sin(t)]) }
  for (let i = 0; i <= n; i++) { const t = ang - Math.PI / 2 + Math.PI * i / n; out.push([b[0] + r * Math.cos(t), b[1] + r * Math.sin(t)]) }
  return out
}
const LOAF = 'M3.2 18.5 H20.8 A1.2 1.2 0 0 0 22 17.3 V13.5 C22 9.6 18.4 7.5 12 7.5 C5.6 7.5 2 9.6 2 13.5 V17.3 A1.2 1.2 0 0 0 3.2 18.5 Z'
const CUTS = [[[5.6, 13.6], [7.8, 10.2]], [[10.4, 13.6], [12.6, 9.4]], [[15.2, 13.6], [17.4, 10.2]]]

export default function render(icon) {
  const name = (icon && icon.name) || 'bread'
  return build({
    name, paths: [],
    lines: [{ pts: rings(LOAF)[0], closed: true, plate: 'K' }],
    fills: [{ set: rings(LOAF) }],
    cutouts: CUTS.map(([a, b]) => ({ subs: [{ pts: capsule(a, b, 0.5), closed: true }] })),
  })
}
