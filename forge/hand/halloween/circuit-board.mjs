// forge/hand/halloween/circuit-board.mjs - the line circuit board in Halloween colours: a witch-purple rounded board with two glowing
// pumpkin traces, each ending in a pad ring: one stepping down-right from the top-left pad to the bottom edge, one stepping up from the
// bottom-right pad to the top edge. No chip. Replaces the generated chip-and-three-pads drawing.
// Roles: board c3 -> edge, traces c1 -> c2 over an ink casing, pad holes ink, outline ink, halo accent, shine shine, shadow shadow.
// Motion: board wm-k, traces and pads wm-a, halo wm-deco.
import { C } from '../../styles/_halloween-palettes.mjs'

const NAME = 'circuit-board'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const R = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

const BOARD = 'M5 3H19A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3Z'
const BOARD_SH = 'M5.15 3.85H19.15A2 2 0 0 1 21.15 5.85V19.85A2 2 0 0 1 19.15 21.85H5.15A2 2 0 0 1 3.15 19.85V5.85A2 2 0 0 1 5.15 3.85Z'
const T1 = 'M8 9.5V13.5L11 16.5V21'
const T2 = 'M16 14.5V10.5L13 7.5V3'
const pad = (cx, cy) => [
  ['circle', { cx, cy, r: 2.1, fill: url(1), ...INK, class: 'wm-a' }],
  ['circle', { cx, cy, r: 0.8, fill: C.ink, class: 'wm-a' }],
]

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13.5, r: 13.6, fx: 8.8, fy: 8.4, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c3), st(0.45, C.c3), st(1, C.edge)]],
      ['radialGradient', { id: id(1), cx: 12, cy: 12.5, r: 13, fx: 8, fy: 8, gradientUnits: 'userSpaceOnUse' }, [st(0, C.tint), st(0.35, C.c1), st(1, C.c2)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.6, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: BOARD_SH, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: BOARD, fill: url(0), ...INK, class: 'wm-k' }],
    // traces: ink casing, then the glowing pumpkin core
    ['path', { d: T1, ...R, 'stroke-linecap': 'butt', stroke: C.ink, 'stroke-width': 2.6, class: 'wm-a' }],
    ['path', { d: T2, ...R, 'stroke-linecap': 'butt', stroke: C.ink, 'stroke-width': 2.6, class: 'wm-a' }],
    ['path', { d: T1, ...R, 'stroke-linecap': 'butt', stroke: C.c1, 'stroke-width': 1.3, class: 'wm-a' }],
    ['path', { d: T2, ...R, 'stroke-linecap': 'butt', stroke: C.c1, 'stroke-width': 1.3, class: 'wm-a' }],
    // board rim over the trace ends
    ['path', { d: BOARD, fill: 'none', ...INK, class: 'wm-k' }],
    ...pad(8, 8),
    ...pad(16, 16),
    ['path', { d: 'M4.2 18.2V5.6A1.4 1.4 0 0 1 5.6 4.2H9.5', ...R, stroke: C.shine, 'stroke-opacity': 0.5, 'stroke-width': 0.6, class: 'wm-shine' }],
  ]
}
