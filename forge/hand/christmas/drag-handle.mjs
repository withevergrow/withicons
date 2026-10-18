// forge/hand/christmas/drag-handle.mjs — six identical cranberry grip dots on a clean 2 x 3 grid, each with the same
// outline and soft light, and nothing else on them. The generated drawing tinted the dots red and white inconsistently
// and capped the top pair with snow, which read as two ornaments over four dots.
import { C, num } from '../../styles/_christmas-core.mjs'

const N = 'drag-handle'
const id = n => `wg-christmas-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const R = 2.15
const disc = (cx, cy) => `M${num(cx - R)} ${num(cy)}a${R} ${R} 0 1 0 ${num(2 * R)} 0a${R} ${R} 0 1 0 ${num(-2 * R)} 0z`
const AT = [[8.5, 4.75], [15.5, 4.75], [8.5, 12], [15.5, 12], [8.5, 19.25], [15.5, 19.25]]

export default function render() {
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 0, y1: 0, x2: 0.6, y2: 1 },
        [st(0, C.shine, 0.4), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
    ]],
    ['path', { d: AT.map(([x, y]) => disc(x, y)).join(''), fill: C.c1, stroke: C.ink, 'stroke-width': 0.6, class: 'wm-k' }],
    ...AT.map(([x, y]) => ['path', { d: disc(x, y), fill: url(0), class: 'wm-shine' }]),
    ['path', { d: AT.map(([x, y]) => `M${num(x - 1.05)} ${num(y - 0.6)}A1.25 1.25 0 0 1 ${num(x - 0.35)} ${num(y - 1.1)}`).join(''), fill: 'none', stroke: C.shine, 'stroke-width': 0.6, 'stroke-linecap': 'round', 'stroke-opacity': 0.7, class: 'wm-shine' }],
  ]
}
