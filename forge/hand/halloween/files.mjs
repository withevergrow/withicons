// forge/hand/halloween/files.mjs — two stacked pages: a witch-purple sheet behind, a candle-lit pumpkin-orange page in front
// with a purple dog-ear, all in the midnight outline (the same page as halloween/file). Replaces the generated drawing,
// a near-black page whose dark dog-ear vanished and a loose orange bracket behind it, which read as a dark square at 16px.
// Roles: front page c1 -> c2, back page c3 -> edge, dog-ear c3 -> edge, outline ink, halo accent, shine shine, shadows shadow.
// Motion: both pages wm-k (the stack floats as one).
import { C } from '../../styles/_halloween-palettes.mjs'
import { num } from '../../styles/_halloween-core.mjs'

const NAME = 'files'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

function shift(d, dx, dy) {
  return d.replace(/([MLHVCQAZ])([^MLHVCQAZ]*)/g, (_, c, args) => {
    const v = args.trim() ? args.trim().split(/[\s,]+/).map(Number) : []
    const o = v.map((x, i) => {
      if (c === 'H') return x + dx
      if (c === 'V') return x + dy
      if (c === 'A') return i % 7 === 5 ? x + dx : i % 7 === 6 ? x + dy : x
      return i % 2 ? x + dy : x + dx
    })
    return c + o.map(num).join(' ')
  })
}

const BACK = 'M5 1.8H13A2.4 2.4 0 0 1 15.4 4.2V15.6A2.4 2.4 0 0 1 13 18H5A2.4 2.4 0 0 1 2.6 15.6V4.2A2.4 2.4 0 0 1 5 1.8Z'
const FRONT = 'M8.6 5.4H16L21.4 10.8V19.8A2.4 2.4 0 0 1 19 22.2H8.6A2.4 2.4 0 0 1 6.2 19.8V7.8A2.4 2.4 0 0 1 8.6 5.4Z'
const FOLD = 'M16 5.4V9.2A1.6 1.6 0 0 0 17.6 10.8H21.4Z'

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 13.8, cy: 15.2, r: 11.6, fx: 11.4, fy: 10.4, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['radialGradient', { id: id(1), cx: 9, cy: 10.6, r: 11.2, fx: 6.6, fy: 6, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.c3), st(0.45, C.c3), st(1, C.edge)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 13, r: 12, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
      ['linearGradient', { id: id(3), x1: 16, y1: 10.8, x2: 19, y2: 7.4, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.edge), st(1, C.c3)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: shift(BACK, 0.15, 0.85) + shift(FRONT, 0.15, 0.85), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    // the sheet behind
    ['path', { d: BACK, fill: url(1), ...INK, class: 'wm-k' }],
    ['path', { d: 'M3.75 14.6V4.55A1.45 1.45 0 0 1 5.2 3.1H11.2', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.45, 'stroke-width': 0.75, class: 'wm-shine' }],
    // the page in front casts a soft shade on the sheet
    ['path', { d: shift(FRONT, -0.55, -0.45), fill: C.shadow, 'fill-opacity': 0.28, class: 'wm-shadow' }],
    ['path', { d: FRONT, fill: url(0), ...INK, class: 'wm-k' }],
    ['path', { d: 'M7.4 18.9V8.15A1.35 1.35 0 0 1 8.75 6.8H13.6', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.8, class: 'wm-shine' }],
    // dog-ear and its shadow
    ['path', { d: shift(FOLD, -0.5, 0.65), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: FOLD, fill: url(3), ...INK, class: 'wm-k' }],
  ]
}
