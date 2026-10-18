// forge/hand/halloween/accessibility.mjs — a candle-lit pumpkin disc carrying a bold raised witch-purple access figure
// (round head, open arms, two legs), in the midnight outline. Replaces the generated drawing, where the figure was a thin
// carved slit tangled with pumpkin ribs and a crescent moon peeked over the rim.
// Roles: disc c1 -> c2, figure c3 -> edge, outline ink, halo accent, shine shine, shadows shadow.
// Motion: disc wm-k (pulses), figure wm-a (pulses about 12,12).
import { C } from '../../styles/_halloween-palettes.mjs'

const NAME = 'accessibility'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

const BODY = 'M7 10.7H17M12 10.7V14M9.5 17.7L12 14L14.5 17.7'
const BODY_SH = 'M7.15 11.55H17.15M12.15 11.55V14.85M9.65 18.55L12.15 14.85L14.65 18.55'

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13.5, r: 13.6, fx: 8.8, fy: 8.4, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['linearGradient', { id: id(1), x1: 8, y1: 5, x2: 15, y2: 18, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.c3), st(0.55, C.c3), st(1, C.edge)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.6, r: 12, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['circle', { cx: 12.15, cy: 12.85, r: 9.6, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['circle', { cx: 12, cy: 12, r: 9.6, fill: url(0), ...INK, class: 'wm-k' }],
    // the lit upper-left shoulder of the disc
    ['path', { d: 'M3.75 10.1A8.5 8.5 0 0 1 10.1 3.75', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.8, class: 'wm-shine' }],
    // the figure: its drop on the disc, the ink rim, the witch-purple body, the head
    ['path', { d: BODY_SH, ...ROUND, stroke: C.shadow, 'stroke-opacity': 0.3, 'stroke-width': 3, class: 'wm-shadow' }],
    ['circle', { cx: 12.15, cy: 7.25, r: 1.6, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: BODY, ...ROUND, stroke: C.ink, 'stroke-width': 3.12, class: 'wm-a' }],
    ['path', { d: BODY, ...ROUND, stroke: url(1), 'stroke-width': 1.68, class: 'wm-a' }],
    ['circle', { cx: 12, cy: 6.4, r: 1.6, fill: url(1), ...INK, class: 'wm-a' }],
    ['path', { d: 'M11.05 6.2A0.95 0.95 0 0 1 11.8 5.45', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.4, class: 'wm-shine' }],
    ['path', { d: 'M7.5 10.45H10.4', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.45, 'stroke-width': 0.4, class: 'wm-shine' }],
  ]
}
