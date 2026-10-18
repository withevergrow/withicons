// forge/hand/halloween/bus.mjs - a pumpkin-orange bus: dark windshield band, headlights, bumper and two wheels

const NAME = 'bus'
import { C } from '../../styles/_halloween-palettes.mjs'

const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const R = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
const SH = { fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }

const BODY = 'M6.5 3H17.5A2.5 2.5 0 0 1 20 5.5V16A2 2 0 0 1 18 18H6A2 2 0 0 1 4 16V5.5A2.5 2.5 0 0 1 6.5 3Z'
const BODY_SH = 'M6.65 3.85H17.65A2.5 2.5 0 0 1 20.15 6.35V16.85A2 2 0 0 1 18.15 18.85H6.15A2 2 0 0 1 4.15 16.85V6.35A2.5 2.5 0 0 1 6.65 3.85Z'

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13.5, r: 13.6, fx: 8.8, fy: 8.4, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['radialGradient', { id: id(1), cx: 12, cy: 13.7, r: 14.5, fx: 8.5, fy: 8.9, gradientUnits: 'userSpaceOnUse' }, [st(0, C.shadow), st(0.45, C.shadow), st(1, C.ink)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.6, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.36), st(0.55, C.accent, 0.16), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['rect', { x: 6.15, y: 17.35, width: 3.2, height: 4, rx: 1.1, ...SH }],
    ['rect', { x: 14.95, y: 17.35, width: 3.2, height: 4, rx: 1.1, ...SH }],
    ['rect', { x: 6, y: 16.5, width: 3.2, height: 4, rx: 1.1, fill: url(1), ...INK, class: 'wm-k' }],
    ['rect', { x: 14.8, y: 16.5, width: 3.2, height: 4, rx: 1.1, fill: url(1), ...INK, class: 'wm-k' }],
    ['path', { d: BODY_SH, ...SH }],
    ['path', { d: BODY, fill: url(0), ...INK, class: 'wm-k' }],
    ['rect', { x: 5.7, y: 5.6, width: 12.6, height: 5.4, rx: 1, fill: url(1), ...INK, class: 'wm-k' }],
    ['path', { d: 'M9 4.3H15', ...R, stroke: C.ink, 'stroke-width': 0.9, class: 'wm-k' }],
    ['path', { d: 'M4.4 15.7H19.6', ...R, stroke: C.ink, 'stroke-width': 0.72, class: 'wm-k' }],
    ['circle', { cx: 7.6, cy: 13.4, r: 1.15, fill: C.tint, ...INK, class: 'wm-a' }],
    ['circle', { cx: 16.4, cy: 13.4, r: 1.15, fill: C.tint, ...INK, class: 'wm-a' }],
    ['path', { d: 'M10.5 13.4H13.5', ...R, stroke: C.ink, 'stroke-width': 0.9, class: 'wm-k' }],
    ['path', { d: 'M6.8 6.6H8.6', ...R, stroke: C.shine, 'stroke-opacity': 0.5, 'stroke-width': 0.5, class: 'wm-shine' }],
    ['path', { d: 'M4.8 6A1.8 1.8 0 0 1 6.5 3.8H12', ...R, stroke: C.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.6, class: 'wm-shine' }],
  ]
}
