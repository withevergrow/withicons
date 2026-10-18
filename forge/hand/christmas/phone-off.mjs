// christmas/phone-off: the cranberry handset cut in two by a clean gap, with a slim cream slash (ink-outlined) running through the gap; no snow cap under the slash.
import { C } from '../../styles/_christmas-core.mjs'

const N = 'phone-off'
const id = k => `wg-christmas-${N}-${k}`, url = k => `url(#${id(k)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const K = { stroke: C.ink, 'stroke-linejoin': 'round' }
const EAR = 'M6.78 8.75L7.23 9.63L7.72 10.42L8.26 11.17L8.88 11.92L6.72 14.08L5.98 13.24L5.3 12.38L4.7 11.52L4.12 10.58L3.6 9.61L3.13 8.62L2.72 7.59L2.37 6.55L2.11 5.6L1.91 4.69L1.96 4.18L2.11 3.69L2.4 3.19L2.74 2.81L3.2 2.47L3.73 2.25L4.29 2.15L7.48 2.14L9.22 7.01Z'
const MOUTH = 'M19.54 17.22L19.54 14.2L14.72 12.48L14.5 12.7L12.93 14.9L12.51 14.69L10.2 17L10.95 17.47L11.76 17.92L12.59 18.33L13.44 18.71L14.31 19.04L15.19 19.33L16.08 19.57L16.99 19.77L17.5 19.72L17.99 19.57L18.39 19.35L18.79 19.02L19.12 18.63L19.33 18.22L19.49 17.73Z'
const SLASH = 'M4.6 19.4L19.4 4.6'
const star = (x, y) => ['path', { d: `M${x} ${y - 1.55}Q${x + 0.34} ${y - 0.34} ${x + 1.55} ${y}Q${x + 0.34} ${y + 0.34} ${x} ${y + 1.55}Q${x - 0.34} ${y + 0.34} ${x - 1.55} ${y}Q${x - 0.34} ${y - 0.34} ${x} ${y - 1.55}z`, fill: C.accent, ...K, 'stroke-width': 0.28, class: 'wm-deco' }]

export default function render() {
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 3, y1: 3, x2: 17, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
    ]],
    ['path', { d: EAR, fill: C.c1, ...K, 'stroke-width': 0.6, class: 'wm-k' }],
    ['path', { d: MOUTH, fill: C.c1, ...K, 'stroke-width': 0.6, class: 'wm-k' }],
    ['path', { d: EAR + MOUTH, fill: url(0), class: 'wm-shine' }],
    ['path', { d: SLASH, fill: 'none', stroke: C.ink, 'stroke-width': 2.5, 'stroke-linecap': 'round', class: 'wm-s' }],
    ['path', { d: SLASH, fill: 'none', stroke: C.c4, 'stroke-width': 1.4, 'stroke-linecap': 'round', class: 'wm-s' }],
  ]
}
