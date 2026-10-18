// forge/hand/halloween/gallery-horizontal.mjs — a large candle-lit pumpkin slide (bone moon over two purple peaks, so it
// reads as a picture) with two slim witch-purple neighbours tucked behind it, only their outer edges peeking out, so the
// whole reads as a carousel rather than three separate bars. Midnight outline, halo, drop shadow and shine like the siblings.
// Roles: slide c1 -> c2, peaks and neighbours c3 -> edge, moon tint, outline ink, halo accent, shine shine, shadows shadow.
// Motion: slide wm-k (nudges left), neighbours wm-a (nudge after it).
import { C } from '../../styles/_halloween-palettes.mjs'

const NAME = 'gallery-horizontal'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

// the slide: x 5..19, y 4.4..19.6, corners 2.4
const CARD = (dx = 0, dy = 0) => `M${7.4 + dx} ${4.4 + dy}H${16.6 + dx}A2.4 2.4 0 0 1 ${19 + dx} ${6.8 + dy}V${17.2 + dy}A2.4 2.4 0 0 1 ${16.6 + dx} ${19.6 + dy}H${7.4 + dx}A2.4 2.4 0 0 1 ${5 + dx} ${17.2 + dy}V${6.8 + dy}A2.4 2.4 0 0 1 ${7.4 + dx} ${4.4 + dy}Z`
const PEAKS_TOP = 'M5 17L9.4 11.3L12.4 15L14.9 12.3L19 16.9'
const PEAKS = PEAKS_TOP + 'V17.2A2.4 2.4 0 0 1 16.6 19.6H7.4A2.4 2.4 0 0 1 5 17.2Z'
// neighbours: x 2..8 (left), 16..22 (right), y 6.6..17.4, hidden behind the slide
const SIDE = x => ({ x, y: 6.6, width: 6, height: 10.8, rx: 2 })

export default function render() {
  const side = x => [
    ['rect', { ...SIDE(x + 0.15), y: 7.45, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['rect', { ...SIDE(x), fill: url(1), ...INK, class: 'wm-a' }],
  ]
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 12.4, r: 11, fx: 9.6, fy: 7.4, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 6.6, x2: 0, y2: 19.6, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.c3), st(0.5, C.c3), st(1, C.edge)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.6, r: 12, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    // the neighbours peeking out behind the slide
    ...side(2), ...side(16),
    ['path', { d: 'M3.1 8.4V10.6', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.45, 'stroke-width': 0.5, class: 'wm-shine' }],
    // the slide: drop, body, moon, peaks, outline
    ['path', { d: CARD(0.15, 0.85), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: CARD(), fill: url(0), class: 'wm-k' }],
    ['circle', { cx: 15.6, cy: 8.6, r: 1.7, fill: C.tint, ...INK, 'stroke-width': 0.6, class: 'wm-k' }],
    ['path', { d: PEAKS, fill: url(1), class: 'wm-k' }],
    ['path', { d: PEAKS_TOP, ...ROUND, ...INK, class: 'wm-k' }],
    ['path', { d: 'M9.4 12.6L7.5 15M14.9 13.6L13.7 15', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.4, 'stroke-width': 0.5, class: 'wm-shine' }],
    ['path', { d: CARD(), fill: 'none', ...INK, class: 'wm-k' }],
    ['path', { d: 'M6.15 12V7A1.55 1.55 0 0 1 7.7 5.55H11', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.8, class: 'wm-shine' }],
  ]
}
