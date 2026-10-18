// forge/hand/liquid/brain-circuit.mjs: a brain of two clear-glass lobes parted by a straight fissure, a couple of
// grooves per lobe, and three coloured-glass circuit traces on the right ending in separate accent node dots.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const rings = d => parsePath(d).map(s => s.pts)
const circle = (cx, cy, r, n = 20) => Array.from({ length: n }, (_, i) => [cx + r * Math.cos(2 * Math.PI * i / n), cy + r * Math.sin(2 * Math.PI * i / n)])
function capsule(a, b, r, n = 8) {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), out = []
  for (let i = 0; i <= n; i++) { const t = ang + Math.PI / 2 + Math.PI * i / n; out.push([a[0] + r * Math.cos(t), a[1] + r * Math.sin(t)]) }
  for (let i = 0; i <= n; i++) { const t = ang - Math.PI / 2 + Math.PI * i / n; out.push([b[0] + r * Math.cos(t), b[1] + r * Math.sin(t)]) }
  return out
}
// left lobe; the right lobe mirrors it about x = 9.6
const L = [[9.1, 4.4], [7, 3.6, 5.1, 4.6, 4.9, 6.6], [3.1, 7.2, 2.4, 9.4, 3.3, 11.1], [2.2, 12.8, 2.7, 15, 4.5, 15.8], [4.8, 18, 6.8, 19.8, 9.1, 19.2]]
const lobe = m => {
  const X = x => (m ? 19.2 - x : x).toFixed(2)
  const [s, ...cs] = L
  return `M${X(s[0])} ${s[1]} ` + cs.map(c => `C${X(c[0])} ${c[1]} ${X(c[2])} ${c[3]} ${X(c[4])} ${c[5]}`).join(' ') + ' Z'
}
const GROOVE = m => { const X = x => (m ? 19.2 - x : x).toFixed(2); return [capsule([+X(3.6), 12], [+X(6.4), 12], 0.4)] }
const TRACES = [[6.5, 16.2, 18.4], [12, 17, 18.4], [17.5, 16, 18.4]]

export default function render(icon) {
  const name = (icon && icon.name) || 'brain-circuit'
  const lobes = [lobe(false), lobe(true)]
  return build({
    name, paths: [],
    lines: [...lobes.map(d => ({ pts: rings(d)[0], closed: true, plate: 'K' })), ...TRACES.map(([y, x0, x1]) => ({ pts: [[x0, y], [x1, y]], closed: false, plate: 'A' })), ...TRACES.map(([y, , x1]) => ({ pts: circle(x1 + 2.6, y, 1), closed: true, plate: 'S' }))],
    fills: [...lobes.map(d => ({ set: rings(d) })), ...TRACES.map(([y, x0, x1]) => ({ set: [capsule([x0, y], [x1, y], 0.5)] })), ...TRACES.map(([y, , x1]) => ({ set: [circle(x1 + 2.6, y, 1)] }))],
    cutouts: [capsule([9.6, 4.6], [9.6, 19], 0.45), ...GROOVE(false), ...GROOVE(true)].map(pts => ({ subs: [{ pts, closed: true }] })),
  })
}
