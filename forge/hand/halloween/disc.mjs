// forge/hand/halloween/disc.mjs — a witch-purple disc with an open centre hole ringed in bright candle orange,
// two groove arcs and one shine wedge. No moon.
import { C } from '../../styles/_halloween-palettes.mjs'

const NAME = 'disc'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

const HOLE = 'M10.6 12A1.4 1.4 0 1 1 13.4 12A1.4 1.4 0 1 1 10.6 12Z'
const DISC = 'M2.4 12A9.6 9.6 0 1 0 21.6 12A9.6 9.6 0 1 0 2.4 12Z' + HOLE

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13.5, r: 13.6, fx: 8.6, fy: 8.2, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.c3), st(0.45, C.c3), st(1, C.edge)]],
      ['radialGradient', { id: id(1), cx: 12, cy: 12, r: 3.6, gradientUnits: 'userSpaceOnUse' }, [st(0, C.tint), st(0.5, C.accent), st(1, C.c1)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.6, r: 12, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: 'M2.55 12.85A9.6 9.6 0 1 0 21.75 12.85A9.6 9.6 0 1 0 2.55 12.85ZM10.75 12.85A1.4 1.4 0 1 1 13.55 12.85A1.4 1.4 0 1 1 10.75 12.85Z', fill: C.shadow, 'fill-opacity': 0.3, 'fill-rule': 'evenodd', class: 'wm-shadow' }],
    ['path', { d: DISC, fill: url(0), 'fill-rule': 'evenodd', ...INK, class: 'wm-k' }],
    ['path', { d: 'M18.6 9.4A7 7 0 0 1 17.2 17M6.4 15.8A7 7 0 0 1 8.6 5.9', ...ROUND, stroke: C.ink, 'stroke-opacity': 0.5, 'stroke-width': 0.55, class: 'wm-k' }],
    ['path', { d: 'M8.7 12A3.3 3.3 0 1 0 15.3 12A3.3 3.3 0 1 0 8.7 12Z' + HOLE, fill: url(1), 'fill-rule': 'evenodd', ...INK, class: 'wm-k' }],
    ['path', { d: 'M4.9 9.1A7.6 7.6 0 0 1 9.1 4.9L10.3 8.6A3.8 3.8 0 0 0 8.6 10.3Z', fill: C.shine, 'fill-opacity': 0.5, class: 'wm-shine' }],
  ]
}
