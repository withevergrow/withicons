// forge/hand/valentine/align-right.mjs — four plump pink bars flush right with a small floating heart tucked well clear
// in the free space left of the second bar; the generated heart sat on the second bar's left end and blurred the stagger.
import { C, heartD } from '../../styles/_valentine-core.mjs'

const G = 'url(#wg-valentine-align-right-0)'
// [x0, x1, centre y], bars 2u thick with round ends
const BARS = [[2, 22, 4.5], [8.5, 22, 9.5], [2, 22, 14.5], [8.5, 22, 19.5]]
const bar = ([x0, x1, y]) => `M${x0 + 1} ${y - 1}H${x1 - 1}A1 1 0 0 1 ${x1 - 1} ${y + 1}H${x0 + 1}A1 1 0 0 1 ${x0 + 1} ${y - 1}Z`
const BODY = BARS.map(bar).join('')
// shade band along the lower inner edge of each bar
const SHADE = BARS.map(([x0, x1, y]) => `M${x0 + 1.4} ${y + 0.35}H${x1 - 1}A0.7 0.7 0 0 1 ${x1 - 1.55} ${y + 0.75}H${x0 + 1.4}Z`).join('')
// a short highlight dash at the top-left of each bar
const SHINE = BARS.map(([x0, , y]) => `M${x0 + 1.1} ${y - 0.3}H${x0 + 2.6}`).join('')

export default function render() {
  return [
    ['defs', {}, [
      ['linearGradient', { id: 'wg-valentine-align-right-0', x1: 10, y1: 3.5, x2: 14, y2: 20.5, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C.c1 }],
        ['stop', { offset: 0.4, 'stop-color': C.c1 }],
        ['stop', { offset: 1, 'stop-color': C.c2 }],
      ]],
    ]],
    ['path', { d: BODY, fill: 'none', stroke: C.c4, 'stroke-width': 1.82, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: heartD(4.6, 9.6, 1.25), fill: C.c2, stroke: C.ink, 'stroke-width': 0.45, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: BODY, fill: G, stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: SHADE, fill: C.shadow, 'fill-opacity': 0.5, class: 'wm-shadow' }],
    ['path', { d: SHINE, fill: 'none', stroke: C.shine, 'stroke-width': 0.6, 'stroke-linecap': 'round', 'stroke-opacity': 0.9, class: 'wm-shine' }],
  ]
}
