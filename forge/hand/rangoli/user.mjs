// forge/hand/rangoli/user.mjs — a festive-glow person bust (round head over rounded shoulders) with only a small
// marigold tucked in the top-right corner. The generated drawing pressed a big flower against the head and shoulder,
// so the silhouette read as a head with an ornament; here the silhouette leads.
// Recipe as the generator: depth lip (shadow 0.5), body c1 -> c2 radial glow from the upper left, head shine (0.7).
import { col } from '../../styles/_rangoli-core.mjs'
import { marigold } from '../../styles/_rangoli-motifs.mjs'

const NAME = 'user'
const id = n => `wg-rangoli-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]
const r2 = v => Math.round(v * 100) / 100

const figure = (dy = 0) => {
  const y = v => r2(v + dy)
  return `M7 ${y(7.5)}A5 5 0 1 0 17 ${y(7.5)}A5 5 0 1 0 7 ${y(7.5)}Z` +
    `M3 ${y(19.5)}A5.5 5.5 0 0 1 8.5 ${y(14)}H15.5A5.5 5.5 0 0 1 21 ${y(19.5)}V${y(20.75)}Q21 ${y(22)} 19.75 ${y(22)}` +
    `H4.25Q3 ${y(22)} 3 ${y(20.75)}Z`
}

export default function render() {
  const [outer, inner, heart] = marigold(19.5, 4.4, 1.9)
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 8.04, cy: 6.79, r: 23.6, gradientUnits: 'userSpaceOnUse' },
        [st(0, col('c1')), st(0.3, col('c1')), st(1, col('c2'))]],
      ['linearGradient', { id: id(1), x1: 4, y1: 3, x2: 20, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, col('c3')), st(1, col('c4'))]],
    ]],
    ['path', { d: figure(0.5), fill: col('shadow'), 'fill-opacity': 0.5, class: 'wm-shadow' }],
    ['path', { d: figure(), fill: url(0), class: 'wm-k' }],
    // rim light on the head's upper left, and a short one along the left shoulder
    ['path', { d: 'M15.39 4.54A4.5 4.5 0 1 0 9.03 10.89A4.5 4.5 0 0 1 15.39 4.54Z' +
      'M3.5 19.4A5 5 0 0 1 8.5 14.5H11.5L11.1 14.92H8.55A4.6 4.6 0 0 0 3.92 19.1Z', fill: col('shine'), 'fill-opacity': 0.7, class: 'wm-shine' }],
    ['path', { d: outer, fill: col('accent'), class: 'wm-deco' }],
    ['path', { d: inner, fill: url(1), class: 'wm-deco' }],
    ['path', { d: heart, fill: col('shadow'), class: 'wm-deco' }],
  ]
}
