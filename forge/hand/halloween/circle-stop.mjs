// forge/hand/halloween/circle-stop.mjs — a candle-lit pumpkin disc with a big raised witch-purple stop square in its
// centre, in the midnight outline. Replaces the generated midnight disc, which sank into dark backgrounds and showed the
// square only as a small glowing hole (so the A part could not pulse on its own).
// Roles: disc c1 -> c2, square c3 -> edge, outline ink, halo accent, shine shine, shadows shadow.
// Motion: disc wm-k (pulses), square wm-a (pulses about 12,12).
import { C } from '../../styles/_halloween-palettes.mjs'

const NAME = 'circle-stop'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13.5, r: 13.6, fx: 8.8, fy: 8.4, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['linearGradient', { id: id(1), x1: 8.2, y1: 8.2, x2: 15.8, y2: 15.8, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.c3), st(0.5, C.c3), st(1, C.edge)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.6, r: 12, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['circle', { cx: 12.15, cy: 12.85, r: 9.6, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['circle', { cx: 12, cy: 12, r: 9.6, fill: url(0), ...INK, class: 'wm-k' }],
    // the lit upper-left shoulder of the disc
    ['path', { d: 'M3.75 10.1A8.5 8.5 0 0 1 10.1 3.75', fill: 'none', stroke: C.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.8, 'stroke-linecap': 'round', class: 'wm-shine' }],
    // the stop square: its drop on the disc, the tile, a glint along its top edge
    ['rect', { x: 8.35, y: 9.05, width: 7.6, height: 7.6, rx: 1.7, fill: C.shadow, 'fill-opacity': 0.32, class: 'wm-shadow' }],
    ['rect', { x: 8.2, y: 8.2, width: 7.6, height: 7.6, rx: 1.7, fill: url(1), ...INK, class: 'wm-a' }],
    ['path', { d: 'M9.3 12.4V10.2A0.9 0.9 0 0 1 10.2 9.3H12.6', fill: 'none', stroke: C.shine, 'stroke-opacity': 0.5, 'stroke-width': 0.55, 'stroke-linecap': 'round', class: 'wm-shine' }],
  ]
}
