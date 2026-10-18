// forge/hand/halloween/donut.mjs — a candle-lit ring donut with a clearly open centre hole, a wavy witch-purple icing
// cap over the top half and four short sprinkle dashes.
import { C } from '../../styles/_halloween-palettes.mjs'

const NAME = 'donut'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

const RING = 'M2.6 12.5A9.4 8.6 0 1 0 21.4 12.5A9.4 8.6 0 1 0 2.6 12.5ZM9.4 12.4A2.6 2.2 0 1 1 14.6 12.4A2.6 2.2 0 1 1 9.4 12.4Z'
const RING_SH = 'M2.75 13.35A9.4 8.6 0 1 0 21.55 13.35A9.4 8.6 0 1 0 2.75 13.35ZM9.55 13.25A2.6 2.2 0 1 1 14.75 13.25A2.6 2.2 0 1 1 9.55 13.25Z'
const ICING = 'M3.3 11.8C3.7 7.3 7.5 4.6 12 4.6C16.5 4.6 20.3 7.3 20.7 11.8C20 13.6 19 12.4 18.3 13.5C17.5 14.6 16.4 13 15.5 13.7C15 13.2 14.8 12.8 14.6 12.4A2.6 2.2 0 1 0 9.4 12.4C9.2 13.2 8.6 14.4 7.8 13.5C7 12.6 6.2 14.6 5.4 13.5C4.7 12.5 3.9 13.5 3.3 11.8Z'

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13, r: 11, fx: 9, fy: 9, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.tint), st(0.45, C.accent), st(1, C.c2)]],
      ['radialGradient', { id: id(1), cx: 12, cy: 10, r: 9, fx: 9, fy: 6.5, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.c3), st(0.55, C.c3), st(1, C.edge)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.6, r: 12, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: RING_SH, fill: C.shadow, 'fill-opacity': 0.3, 'fill-rule': 'evenodd', class: 'wm-shadow' }],
    ['path', { d: RING, fill: url(0), 'fill-rule': 'evenodd', ...INK, class: 'wm-k' }],
    ['path', { d: ICING, fill: url(1), ...INK, class: 'wm-a' }],
    ['path', { d: 'M7 8.2L8.3 7.4M15.7 7.2L17 8M18.1 10.3L18.8 11.3M5.5 10.9L6.3 9.9', ...ROUND, stroke: C.c1, 'stroke-width': 1.1, class: 'wm-deco' }],
    ['path', { d: 'M11.4 6.6L12.7 6.7', ...ROUND, stroke: C.c4, 'stroke-width': 1.1, class: 'wm-deco' }],
    ['path', { d: 'M5.3 8.4C6.3 6.8 7.9 5.8 9.9 5.4', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.6, class: 'wm-shine' }],
  ]
}
