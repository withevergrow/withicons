// forge/hand/halloween/file.mjs — a candle-lit pumpkin-orange page with a witch-purple dog-ear casting a small shadow, in
// the midnight outline. Replaces the generated drawing, a bone-white page that washed out on light backgrounds.
// Roles: page c1 -> c2, dog-ear c3 -> edge, outline ink, halo accent, shine shine, shadows shadow.
// Motion: page and dog-ear wm-k (the icon floats as one loose sheet).
import { C } from '../../styles/_halloween-palettes.mjs'
import { num } from '../../styles/_halloween-core.mjs'

const NAME = 'file'
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

const PAGE = 'M6.9 1.8H14.2L19.7 7.3V19.6A2.6 2.6 0 0 1 17.1 22.2H6.9A2.6 2.6 0 0 1 4.3 19.6V4.4A2.6 2.6 0 0 1 6.9 1.8Z'
const FOLD = 'M14.2 1.8V5.6A1.7 1.7 0 0 0 15.9 7.3H19.7Z'

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13.6, r: 13.4, fx: 9.4, fy: 8.2, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['linearGradient', { id: id(1), x1: 14.2, y1: 7.3, x2: 17.4, y2: 3.6, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.edge), st(1, C.c3)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 13, r: 12, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: shift(PAGE, 0.15, 0.85), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: PAGE, fill: url(0), ...INK, class: 'wm-k' }],
    // shine down the lit left edge and along the top
    ['path', { d: 'M5.5 17.6V4.85A1.55 1.55 0 0 1 7.05 3.3H12.2', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.8, class: 'wm-shine' }],
    // the dog-ear and the little shadow it casts on the page
    ['path', { d: shift(FOLD, -0.5, 0.65), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: FOLD, fill: url(1), ...INK, class: 'wm-k' }],
  ]
}
