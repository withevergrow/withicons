// forge/hand/liquid/bug.mjs: a beetle as a separate coloured-glass head over an oval clear-glass body split by a
// centre line, with three slim legs a side and two antennae standing clear of the body.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const rings = d => parsePath(d).map(s => s.pts)
const circle = (cx, cy, r, n = 24) => Array.from({ length: n }, (_, i) => [cx + r * Math.cos(2 * Math.PI * i / n), cy + r * Math.sin(2 * Math.PI * i / n)])
// a capsule ring from a to b with radius r
function capsule(a, b, r, n = 10) {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), out = []
  for (let i = 0; i <= n; i++) { const t = ang + Math.PI / 2 + Math.PI * i / n; out.push([a[0] + r * Math.cos(t), a[1] + r * Math.sin(t)]) }
  for (let i = 0; i <= n; i++) { const t = ang - Math.PI / 2 + Math.PI * i / n; out.push([b[0] + r * Math.cos(t), b[1] + r * Math.sin(t)]) }
  return out
}
const box = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const cut = (pts, closed = true) => ({ subs: [{ pts, closed }] })
const cutD = d => ({ subs: parsePath(d) })

const LEGS = [[[7.6, 11], [4.4, 9.4]], [[7.2, 14.2], [3.6, 14.2]], [[7.6, 17.4], [4.4, 19.4]],
  [[16.4, 11], [19.6, 9.4]], [[16.8, 14.2], [20.4, 14.2]], [[16.4, 17.4], [19.6, 19.4]]]
const ANT = [[[10.8, 5], [9, 2.6]], [[13.2, 5], [15, 2.6]]]
const ellipse = (cx, cy, rx, ry, n = 36) => Array.from({ length: n }, (_, i) => [cx + rx * Math.cos(2 * Math.PI * i / n), cy + ry * Math.sin(2 * Math.PI * i / n)])

export default function render(icon) {
  const name = (icon && icon.name) || 'bug'
  return build({
    name, paths: [], lines: [{ pts: circle(12, 6.4, 2.2), closed: true, plate: 'A' }, { pts: ellipse(12, 14.4, 4.6, 6), closed: true, plate: 'K' }],
    fills: [{ set: [ellipse(12, 14.4, 4.6, 6)] }, { set: [circle(12, 6.4, 2.3)] },
      ...[...LEGS, ...ANT].map(([a, b]) => ({ set: [capsule(a, b, 0.6)] }))],
    cutouts: [cut([[12, 10.2], [12, 19.6]], false)],
  })
}
