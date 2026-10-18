// forge/hand/liquid/smile-plus.mjs — the line design in glass: a clear blue face with two simple deep-glass dot eyes
// and a closed smile of violet glass, and a pink glass plus at the upper right. Generator recipe (_liquid-core.mjs
// build) with hand-drawn geometry. Face + eyes wm-k, smile wm-a, plus wm-s.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build, col, L } from '../../styles/_liquid-core.mjs'

const shape = d => setOf(parsePath(d, 0.04).map(s => s.pts))
const set = rings => rings.map(r => ({ pts: r, closed: true }))
const r2 = v => Math.round(v * 100) / 100
const tf = (x, y) => [r2((x - 12) * L.SCALE + 12 + L.TX), r2((y - 12) * L.SCALE + 12 + L.TY)]
const arc = (cx, cy, r, a0, a1, n = 16) => Array.from({ length: n + 1 }, (_, i) => { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)] })

const C = [10.5, 13.6]
const FACE = shape(`M${C[0] + 8.4} ${C[1]}A8.4 8.4 0 1 1 ${C[0] - 8.4} ${C[1]}A8.4 8.4 0 1 1 ${C[0] + 8.4} ${C[1]}Z`)
const SMILE = arc(10.5, 12.6, 4.6, 28, 152) // a closed smile under the eyes
const PLUS = [[[19.8, 2.4], [19.8, 6.8]], [[17.6, 4.6], [22, 4.6]]]
const EYES = [[7.7, 10.6], [13.3, 10.6]]

export default function render(icon) {
  const nodes = build({
    name: (icon && icon.name) || 'smile-plus', paths: [], cutouts: [],
    lines: [
      { pts: arc(C[0], C[1], 7, 0, 360, 36), closed: true, plate: 'K' },
      { pts: SMILE, closed: false, plate: 'A' },
      ...PLUS.map(pts => ({ pts, closed: false, plate: 'S' })),
    ],
    fills: [{ subs: set(FACE), set: FACE }],
  })
  EYES.forEach(([x, y]) => {
    const [px, py] = tf(x, y), rr = r2(1.2 * L.SCALE)
    nodes.push(['circle', { cx: px, cy: py, r: rr, fill: col('c3'), 'fill-opacity': 0.92, stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.22, class: 'wm-k' }])
    nodes.push(['circle', { cx: r2(px - rr * 0.38), cy: r2(py - rr * 0.38), r: r2(rr * 0.3), fill: col('shine'), 'fill-opacity': 0.75, class: 'wm-shine' }])
  })
  return nodes
}
