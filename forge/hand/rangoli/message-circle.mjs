// forge/hand/rangoli/message-circle.mjs — a round festive-glow speech bubble with a clear pointed tail at the lower
// left and one small Diwali twinkle in the free top-right corner. The generated drawing shrank the bubble inside a
// rangoli petal ring, so the tail vanished and the icon read as a sun or a flower.
// Recipe as the generator: depth lip (shadow 0.5), body c1 -> c2 radial glow from the upper left, rim shine (0.7),
// twinkle in accent (wm-deco, floats).
import { col } from '../../styles/_rangoli-core.mjs'
import { sparkle } from '../../styles/_rangoli-motifs.mjs'

const NAME = 'message-circle'
const id = n => `wg-rangoli-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]
const r2 = v => Math.round(v * 100) / 100

// bubble: circle (12.75, 11.25) r 9, tail tip near (2.9, 21.2); shifted down by dy for the lip
const bubble = (dy = 0) => {
  const y = v => r2(v + dy)
  return `M10.42 ${y(19.94)}A9 9 0 1 0 4.29 ${y(14.33)}C4.55 ${y(16.35)} 3.95 ${y(18.35)} 3.12 ${y(19.85)}` +
    `Q2.6 ${y(20.85)} 3.05 ${y(21.25)}Q3.45 ${y(21.6)} 4.35 ${y(21.3)}C6.3 ${y(20.7)} 8.45 ${y(20.15)} 10.42 ${y(19.94)}Z`
}

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 8.3, cy: 6.6, r: 23.2, gradientUnits: 'userSpaceOnUse' },
        [st(0, col('c1')), st(0.3, col('c1')), st(1, col('c2'))]],
    ]],
    ['path', { d: bubble(0.5), fill: col('shadow'), 'fill-opacity': 0.5, class: 'wm-shadow' }],
    ['path', { d: bubble(), fill: url(0), class: 'wm-k' }],
    // rim light: the crescent between the inset circle and the same circle nudged down-right
    ['path', { d: 'M18.97 5.45A8.5 8.5 0 1 0 6.95 17.47A8.5 8.5 0 0 1 18.97 5.45Z', fill: col('shine'), 'fill-opacity': 0.7, class: 'wm-shine' }],
    ['path', { d: sparkle(20.6, 3.4, 1.55), fill: col('accent'), class: 'wm-deco' }],
  ]
}
