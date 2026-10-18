// forge/hand/halloween/egg.mjs — a whole egg, tapered to a narrow crown and a full round base, in candle-lit cream with
// a firm midnight outline, a warm shaded belly on the dark side and a soft shine streak on the lit shoulder.
// Replaces the generated drawing, where the highlight was an outlined orange cutout that read as a seed or a bean in
// the shell and the near-even oval with a thin outline looked like a bean at 16px.
// Roles: shell shine -> tint -> accent, belly shade accent/c1, outline ink, halo accent, shine shine, shadow shadow.
// Motion: shell wm-k (wiggles about 12,21.5 as a whole), highlight wm-shine, halo wm-deco.
import { C } from '../../styles/_halloween-palettes.mjs'

const NAME = 'egg'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

// tapered crown, widest below the middle, full base
const SHELL = 'M12 2.25C15 2.25 18.75 8 18.75 13.75C18.75 18.6 15.75 21.75 12 21.75C8.25 21.75 5.25 18.6 5.25 13.75' +
  'C5.25 8 9 2.25 12 2.25Z'
const SHELL_SH = 'M12.15 3.1C15.15 3.1 18.9 8.85 18.9 14.6C18.9 19.45 15.9 22.6 12.15 22.6C8.4 22.6 5.4 19.45 5.4 14.6' +
  'C5.4 8.85 9.15 3.1 12.15 3.1Z'
// the shaded belly on the far side: a crescent hugging the lower right of the shell
const BELLY = 'M18.3 10.4C18.6 11.5 18.75 12.6 18.75 13.75C18.75 18.6 15.75 21.75 12 21.75C9.6 21.75 7.55 20.45 6.4 18.3' +
  'C7.8 19.8 9.6 20.6 11.6 20.6C15 20.6 17.6 17.9 17.6 14.2C17.6 12.85 17.95 11.6 18.3 10.4Z'

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13.6, r: 11.6, fx: 11.2, fy: 9.4, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine), st(0.22, C.shine), st(0.62, C.tint), st(1, C.accent)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 13, r: 12, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent, 0.16), st(0.55, C.accent, 0.06), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: SHELL_SH, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: SHELL, fill: url(0), class: 'wm-k' }],
    ['path', { d: BELLY, fill: C.c3, 'fill-opacity': 0.55, class: 'wm-k' }],
    ['path', { d: SHELL, fill: 'none', stroke: C.ink, 'stroke-width': 1.4, 'stroke-linejoin': 'round', class: 'wm-k' }],
    // spooky crack across the shoulder and speckles
    ['path', { d: 'M12.6 9.2L13.9 11L13 12.4L14.6 14.1L13.8 15.6', ...ROUND, stroke: C.ink, 'stroke-width': 1.1, class: 'wm-k' }],
    ['circle', { cx: 9.2, cy: 16.4, r: 0.75, fill: C.c1, class: 'wm-deco' }],
    ['circle', { cx: 11.4, cy: 18.6, r: 0.55, fill: C.c2, class: 'wm-deco' }],
    ['circle', { cx: 16.2, cy: 11.2, r: 0.5, fill: C.c1, class: 'wm-deco' }],
    ['circle', { cx: 7.9, cy: 14.2, r: 0.45, fill: C.c2, class: 'wm-deco' }],
    // shine: a long streak down the lit shoulder and a dot above it
    ['path', { d: 'M7.35 12.9C7.35 10.5 8.15 8.1 9.45 6.3', ...ROUND, stroke: C.shine, 'stroke-width': 1.1, class: 'wm-shine' }],
    ['path', { d: 'M10.05 4.75A0.55 0.55 0 1 1 11.15 4.75A0.55 0.55 0 1 1 10.05 4.75Z', fill: C.shine, class: 'wm-shine' }],
  ]
}
