// forge/hand/halloween/camera-off.mjs - a midnight camera with its pumpkin lens and viewfinder bump, crossed by a thin witch-purple slash

const NAME = 'camera-off'
import { C } from '../../styles/_halloween-palettes.mjs'

const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const R = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
const SH = { fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }

const BODY = 'M5 5.5H8L9.3 3.5H14.7L16 5.5H19A2 2 0 0 1 21 7.5V17.5A2 2 0 0 1 19 19.5H5A2 2 0 0 1 3 17.5V7.5A2 2 0 0 1 5 5.5Z'
const BODY_SH = 'M5.15 6.35H8.15L9.45 4.35H14.85L16.15 6.35H19.15A2 2 0 0 1 21.15 8.35V18.35A2 2 0 0 1 19.15 20.35H5.15A2 2 0 0 1 3.15 18.35V8.35A2 2 0 0 1 5.15 6.35Z'

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13.5, r: 13.6, fx: 8.8, fy: 8.4, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['radialGradient', { id: id(1), cx: 12, cy: 13.7, r: 14.5, fx: 8.5, fy: 8.9, gradientUnits: 'userSpaceOnUse' }, [st(0, C.shadow), st(0.45, C.shadow), st(1, C.ink)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.6, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.36), st(0.55, C.accent, 0.16), st(1, C.accent, 0)]],
      ['linearGradient', { id: id(3), x1: 4, y1: 4, x2: 20, y2: 20, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c3), st(0.55, C.c3), st(1, C.edge)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: BODY_SH, ...SH }],
    ['path', { d: BODY, fill: url(1), stroke: C.edge, 'stroke-width': 0.72, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['circle', { cx: 12, cy: 12.5, r: 3.8, fill: url(0), ...INK, class: 'wm-a' }],
    ['circle', { cx: 12, cy: 12.5, r: 1.9, fill: C.ink, class: 'wm-a' }],
    ['circle', { cx: 18.2, cy: 8.2, r: 0.7, fill: C.accent, class: 'wm-k' }],
    ['path', { d: 'M3.8 8A1.5 1.5 0 0 1 5 6.3H8.4', ...R, stroke: C.shine, 'stroke-opacity': 0.4, 'stroke-width': 0.5, class: 'wm-shine' }],
    ['path', { d: 'M9.9 11.2A2.4 2.4 0 0 1 11.6 10', ...R, stroke: C.shine, 'stroke-opacity': 0.6, 'stroke-width': 0.5, class: 'wm-shine' }],
    ['path', { d: 'M4.15 4.85L20.15 20.85', ...R, stroke: C.shadow, 'stroke-opacity': 0.3, 'stroke-width': 2.6, class: 'wm-shadow' }],
    ['path', { d: 'M4 4L20 20', ...R, stroke: C.ink, 'stroke-width': 2.6, class: 'wm-s' }],
    ['path', { d: 'M4 4L20 20', ...R, stroke: url(3), 'stroke-width': 1.2, class: 'wm-s' }],
  ]
}
