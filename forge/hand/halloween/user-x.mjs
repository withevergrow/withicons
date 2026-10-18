// forge/hand/halloween/user-x.mjs — a candle-lit pumpkin person (head and shoulders) with a big chunky slime-green X
// at the upper right, in the style's halo, drop shadow, midnight outline and top-left shine. The generated X was small
// and thin and a spider dangling above it fought it for attention; the ornament is gone and the X is bigger and bolder.
// Roles: person c1 -> c2, X c4, outline ink, halo accent, shine shine, shadow shadow.
// Motion: person wm-k, X wm-s (the spec wiggles parts.S about [19, 10], the X's centre).
import { C } from '../../styles/_halloween-palettes.mjs'

const NAME = 'user-x'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

const head = (dx, dy) => { const x = 8.5 + dx, y = 7.5 + dy; return `M${r(x - 4.6)} ${r(y)}a4.6 4.6 0 1 0 9.2 0a4.6 4.6 0 1 0 -9.2 0Z` }
const body = (dx, dy) => {
  const p = (x, y) => `${r(x + dx)} ${r(y + dy)}`
  return `M${p(1.25, 20.75)}V${r(19.5 + dy)}A5.25 5.25 0 0 1 ${p(6.5, 14.25)}H${r(10.5 + dx)}A5.25 5.25 0 0 1 ${p(15.75, 19.5)}` +
    `V${r(20.75 + dy)}A1 1 0 0 1 ${p(14.75, 21.75)}H${r(2.25 + dx)}A1 1 0 0 1 ${p(1.25, 20.75)}Z`
}
const r = v => Math.round(v * 100) / 100
// X: arms 2.4u wide with round ends, centre (19, 10), half-span 2.3
const X = 'M19 8.3L20.45 6.85A1.2 1.2 0 0 1 22.15 8.55L20.7 10L22.15 11.45A1.2 1.2 0 0 1 20.45 13.15L19 11.7L17.55 13.15' +
  'A1.2 1.2 0 0 1 15.85 11.45L17.3 10L15.85 8.55A1.2 1.2 0 0 1 17.55 6.85Z'
const X_SH = 'M19.15 9.15L20.6 7.7A1.2 1.2 0 0 1 22.3 9.4L20.85 10.85L22.3 12.3A1.2 1.2 0 0 1 20.6 14L19.15 12.55L17.7 14' +
  'A1.2 1.2 0 0 1 16 12.3L17.45 10.85L16 9.4A1.2 1.2 0 0 1 17.7 7.7Z'

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 8.5, cy: 13.84, r: 12.44, fx: 6.18, fy: 8.94, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['radialGradient', { id: id(2), cx: 11.75, cy: 12.8, r: 12, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: head(0.15, 0.85) + body(0.15, 0.85), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: head(0, 0) + body(0, 0), fill: url(0), ...INK, class: 'wm-k' }],
    // crescent shine on the head, a stroke of it over the shoulder
    ['path', { d: 'M11.83 5.32A3.98 3.98 0 1 0 5.67 10.3A3.98 3.98 0 0 1 11.83 5.32Z', fill: C.shine, 'fill-opacity': 0.55, class: 'wm-shine' }],
    ['path', { d: 'M2.22 18.74A4.35 4.35 0 0 1 6.5 15.15H9', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.8, class: 'wm-shine' }],
    ['path', { d: X_SH, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-s' }],
    ['path', { d: X, fill: C.c4, ...INK, class: 'wm-s' }],
    ['path', { d: 'M16.75 8.25L17.6 9.1', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.6, 'stroke-width': 0.5, class: 'wm-s' }],
  ]
}
