// forge/hand/halloween/alpana.mjs — the alpana floor motif: five candle-orange swirl arms that curl out of a
// witch-purple centre ring (an ink-outlined tube each), with one purple dot in every gap.
// Roles: arms tint -> c1 -> c2 in the midnight outline, ring c3 -> edge, centre dot accent, halo accent, shine on the ring.
// Motion: the whole motif wm-k, the ring wm-a (spin), the dots wm-deco.
import { C } from '../../styles/_halloween-palettes.mjs'
import { num } from '../../styles/_halloween-core.mjs'

const NAME = 'alpana'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
function shift(d, dx, dy) {
  return d.replace(/([MC])([^MC]*)/g, (_, c, args) => {
    const v = args.trim().split(/[\s,]+/).map(Number)
    return c + v.map((x, i) => num(i % 2 ? x + dy : x + dx)).join(' ')
  })
}

// the five swirl arms (same spirals as the line design), each starting at the centre ring
const ARMS = [
  'M12 9.07C10.88 7.5 10.88 5.48 12.23 4.35C13.58 3.22 15.83 3.67 16.05 5.48C16.27 7.05 14.7 7.95 13.8 7.05',
  'M14.79 11.09C15.93 9.54 17.85 8.92 19.35 9.85C20.84 10.79 21.11 13.07 19.45 13.84C18.03 14.53 16.69 13.32 17.26 12.18',
  'M13.72 14.37C15.55 14.98 16.74 16.62 16.31 18.32C15.88 20.03 13.8 20.99 12.56 19.66C11.46 18.51 12.2 16.86 13.45 17.06',
  'M10.28 14.37C10.26 16.3 9.07 17.93 7.32 18.05C5.56 18.17 4.01 16.49 4.89 14.89C5.64 13.49 7.44 13.69 7.63 14.95',
  'M9.21 11.09C7.37 11.67 5.45 11.05 4.8 9.42C4.14 7.78 5.26 5.78 7.05 6.13C8.61 6.41 8.98 8.18 7.85 8.76',
].join('')
const DOTS = [[19.5, 6.2], [19.7, 17.6], [9.6, 21.1], [2.9, 12.4], [8.7, 3]]

export default function render() {
  const out = [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 12, r: 10, fx: 9, fy: 8, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.tint), st(0.35, C.c1), st(1, C.c2)]],
      ['radialGradient', { id: id(1), cx: 11, cy: 11, r: 4, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c3), st(1, C.edge)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.6, r: 12, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: shift(ARMS, 0.15, 0.85), ...ROUND, stroke: C.shadow, 'stroke-opacity': 0.3, 'stroke-width': 2.7, class: 'wm-shadow' }],
    ['path', { d: ARMS, ...ROUND, stroke: C.ink, 'stroke-width': 2.7, class: 'wm-k' }],
    ['path', { d: ARMS, ...ROUND, stroke: url(0), 'stroke-width': 1.4, class: 'wm-k' }],
  ]
  for (const [x, y] of DOTS) out.push(['circle', { cx: x, cy: y, r: 1, fill: C.c3, ...INK, class: 'wm-deco' }])
  out.push(
    ['circle', { cx: 12, cy: 12, r: 3.1, fill: url(1), ...INK, class: 'wm-a' }],
    ['circle', { cx: 12, cy: 12, r: 1.2, fill: C.accent, ...INK, class: 'wm-a' }],
    ['path', { d: 'M9.9 11.1A2.3 2.3 0 0 1 11.1 9.9', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.6, 'stroke-width': 0.5, class: 'wm-shine' }],
  )
  return out
}
