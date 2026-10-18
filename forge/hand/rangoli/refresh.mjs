// forge/hand/rangoli/refresh.mjs: two orange arcs chasing each other round a circle, each ending in a solid rounded
// c3 -> c4 arrowhead that points along the arc, so it reads as refresh and not as a broken ring (the generated drawing
// ended the arcs in square corner blocks). Motion: arrowheads wm-a, arcs wm-k.
import { col } from '../../styles/_rangoli-core.mjs'

const NAME = 'refresh'
const id = n => `wg-rangoli-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]
const r2 = v => Math.round(v * 100) / 100
const C = 12, R = 7.6
const d2r = d => d * Math.PI / 180
const at = a => [C + R * Math.cos(a), C + R * Math.sin(a)]

// arc from angle a0 to a1 (degrees, clockwise on screen)
function arc(a0, a1) {
  const [x0, y0] = at(d2r(a0)), [x1, y1] = at(d2r(a1))
  return `M${r2(x0)} ${r2(y0)}A${R} ${R} 0 0 1 ${r2(x1)} ${r2(y1)}`
}
// triangular head sitting on the arc end, pointing along the clockwise tangent
function head(a1) {
  const a = d2r(a1), [x, y] = at(a)
  const t = [-Math.sin(a), Math.cos(a)], n = [Math.cos(a), Math.sin(a)]
  const P = (u, v) => `${r2(x + t[0] * u + n[0] * v)} ${r2(y + t[1] * u + n[1] * v)}`
  return `M${P(3.9, 0)}L${P(-0.4, 3)}L${P(-0.4, -3)}Z`
}

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 7.8, cy: 6.7, r: 24.2, gradientUnits: 'userSpaceOnUse' },
        [st(0, col('c1')), st(0.3, col('c1')), st(1, col('c2'))]],
      ['linearGradient', { id: id(1), x1: 4, y1: 3, x2: 20, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, col('c3')), st(1, col('c4'))]],
    ]],
    ['path', { d: arc(180, 308) + arc(0, 128), stroke: url(0), 'stroke-width': 2.7, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: head(308) + head(128), fill: url(1), stroke: url(1), 'stroke-width': 1.3, 'stroke-linejoin': 'round', class: 'wm-a' }],
  ]
}
