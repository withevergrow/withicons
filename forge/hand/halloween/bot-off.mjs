// forge/hand/halloween/bot-off.mjs - a pumpkin robot head (antenna, two eyes, side ears) crossed by a thin witch-purple slash

const NAME = 'bot-off'
import { C } from '../../styles/_halloween-palettes.mjs'

const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const R = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
const SH = { fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13.5, r: 13.6, fx: 8.8, fy: 8.4, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.6, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.36), st(0.55, C.accent, 0.16), st(1, C.accent, 0)]],
      ['linearGradient', { id: id(3), x1: 4, y1: 4, x2: 20, y2: 20, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c3), st(0.55, C.c3), st(1, C.edge)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['rect', { x: 4.15, y: 8.85, width: 15.7, height: 11, rx: 3, ...SH }],
    ['path', { d: 'M12 8V5.4', ...R, stroke: C.ink, 'stroke-width': 1.2, class: 'wm-k' }],
    ['circle', { cx: 12, cy: 4.3, r: 1.4, fill: url(3), ...INK, class: 'wm-a' }],
    ['rect', { x: 1.9, y: 11.3, width: 2.4, height: 4.4, rx: 1, fill: url(3), ...INK, class: 'wm-k' }],
    ['rect', { x: 19.7, y: 11.3, width: 2.4, height: 4.4, rx: 1, fill: url(3), ...INK, class: 'wm-k' }],
    ['rect', { x: 4, y: 8, width: 16, height: 11, rx: 3, fill: url(0), ...INK, class: 'wm-k' }],
    ['circle', { cx: 8.8, cy: 12.8, r: 1.6, fill: C.ink, class: 'wm-a' }],
    ['circle', { cx: 15.2, cy: 12.8, r: 1.6, fill: C.ink, class: 'wm-a' }],
    ['path', { d: 'M9.8 16.3H14.2', ...R, stroke: C.ink, 'stroke-width': 0.9, class: 'wm-k' }],
    ['path', { d: 'M4.8 10.8A2.3 2.3 0 0 1 7 8.8H11', ...R, stroke: C.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.6, class: 'wm-shine' }],
    ['path', { d: 'M4.15 4.85L20.15 20.85', ...R, stroke: C.shadow, 'stroke-opacity': 0.3, 'stroke-width': 2.6, class: 'wm-shadow' }],
    ['path', { d: 'M4 4L20 20', ...R, stroke: C.ink, 'stroke-width': 2.6, class: 'wm-s' }],
    ['path', { d: 'M4 4L20 20', ...R, stroke: url(3), 'stroke-width': 1.2, class: 'wm-s' }],
  ]
}
