// forge/hand/halloween/file-x.mjs — the candle-lit pumpkin page of `file` (witch-purple dog-ear, midnight outline) with a
// bold raised witch-purple X across its belly. Replaces the generated drawing, whose X was a thin carved slit that faded at
// 16px while a spider in the corner competed with it.
// Roles: page c1 -> c2, dog-ear and X c3 -> edge, outline ink, halo accent, shine shine, shadows shadow.
// Motion: page wm-k (floats / shakes), the X wm-a.
import { C } from '../../styles/_halloween-palettes.mjs'

const NAME = 'file-x'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

const PAGE = 'M6.9 1.8H14.2L19.7 7.3V19.6A2.6 2.6 0 0 1 17.1 22.2H6.9A2.6 2.6 0 0 1 4.3 19.6V4.4A2.6 2.6 0 0 1 6.9 1.8Z'
const PAGE_SH = 'M7.05 2.65H14.35L19.85 8.15V20.45A2.6 2.6 0 0 1 17.25 23.05H7.05A2.6 2.6 0 0 1 4.45 20.45V5.25A2.6 2.6 0 0 1 7.05 2.65Z'
const FOLD = 'M14.2 1.8V5.6A1.7 1.7 0 0 0 15.9 7.3H19.7Z'
const FOLD_SH = 'M13.7 2.45V6.25A1.7 1.7 0 0 0 15.4 7.95H19.2Z'
const X = 'M9.2 11.4L14.8 17M14.8 11.4L9.2 17'
const X_SH = 'M9.35 12.25L14.95 17.85M14.95 12.25L9.35 17.85'

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13.6, r: 13.4, fx: 9.4, fy: 8.2, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['linearGradient', { id: id(1), x1: 9.2, y1: 11.4, x2: 14.8, y2: 17, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.c3), st(1, C.edge)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 13, r: 12, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
      ['linearGradient', { id: id(3), x1: 14.2, y1: 7.3, x2: 17.4, y2: 3.6, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.edge), st(1, C.c3)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: PAGE_SH, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: PAGE, fill: url(0), ...INK, class: 'wm-k' }],
    // shine down the lit left edge and along the top
    ['path', { d: 'M5.5 17.6V4.85A1.55 1.55 0 0 1 7.05 3.3H12.2', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.8, class: 'wm-shine' }],
    // the dog-ear and the little shadow it casts on the page
    ['path', { d: FOLD_SH, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: FOLD, fill: url(3), ...INK, class: 'wm-k' }],
    // the X: a soft drop on the page, the ink rim, the witch-purple stroke, a glint on the lit arm
    ['path', { d: X_SH, ...ROUND, stroke: C.shadow, 'stroke-opacity': 0.3, 'stroke-width': 2.9, class: 'wm-shadow' }],
    ['path', { d: X, ...ROUND, stroke: C.ink, 'stroke-width': 3.02, class: 'wm-a' }],
    ['path', { d: X, ...ROUND, stroke: url(1), 'stroke-width': 1.58, class: 'wm-a' }],
    ['path', { d: 'M9.55 11.3L11.1 12.85', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.5, 'stroke-width': 0.42, class: 'wm-shine' }],
  ]
}
