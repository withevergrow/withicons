// forge/hand/halloween/avatar-person-wheelchair.mjs - a seated pumpkin-orange figure in a bold witch-purple wheelchair:
// big wheel, seat, backrest with push handle, front caster.

const NAME = 'avatar-person-wheelchair'
import { C } from '../../styles/_halloween-palettes.mjs'

const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const R = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
const SH = { fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }

const CHAIR = 'M4.6 7.4H6L6.8 13.2H14'
const BODY = 'M9.4 8V13H14.2L16 18.4'
const ARM = 'M9.6 10.3L13 11'

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13.5, r: 13.6, fx: 8.8, fy: 8.4, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.6, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.36), st(0.55, C.accent, 0.16), st(1, C.accent, 0)]],
      ['linearGradient', { id: id(3), x1: 5, y1: 7, x2: 16, y2: 21, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c3), st(0.55, C.c3), st(1, C.edge)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['circle', { cx: 10.15, cy: 16.85, r: 4.6, fill: 'none', stroke: C.shadow, 'stroke-opacity': 0.3, 'stroke-width': 3, class: 'wm-shadow' }],
    ['path', { d: CHAIR, ...R, stroke: C.ink, 'stroke-width': 2.6, class: 'wm-a' }],
    ['path', { d: CHAIR, ...R, stroke: url(3), 'stroke-width': 1.2, class: 'wm-a' }],
    ['circle', { cx: 10, cy: 16, r: 4.6, fill: 'none', stroke: C.ink, 'stroke-width': 3.1, class: 'wm-a' }],
    ['circle', { cx: 10, cy: 16, r: 4.6, fill: 'none', stroke: url(3), 'stroke-width': 1.7, class: 'wm-a' }],
    ['circle', { cx: 10, cy: 16, r: 1, fill: C.ink, class: 'wm-a' }],
    ['circle', { cx: 18.4, cy: 19.6, r: 1.3, fill: url(3), ...INK, class: 'wm-a' }],
    ['path', { d: BODY, ...R, stroke: C.ink, 'stroke-width': 3.6, class: 'wm-k' }],
    ['path', { d: ARM, ...R, stroke: C.ink, 'stroke-width': 3, class: 'wm-k' }],
    ['path', { d: BODY, ...R, stroke: url(0), 'stroke-width': 2.2, class: 'wm-k' }],
    ['path', { d: ARM, ...R, stroke: url(0), 'stroke-width': 1.6, class: 'wm-k' }],
    ['path', { d: 'M15.4 18.6H17.6', ...R, stroke: C.ink, 'stroke-width': 1.2, class: 'wm-k' }],
    ['circle', { cx: 10.15, cy: 5, r: 2.5, ...SH }],
    ['circle', { cx: 10, cy: 4.2, r: 2.5, fill: url(0), ...INK, class: 'wm-k' }],
    ['path', { d: 'M8.6 3.8A1.5 1.5 0 0 1 9.7 2.7', ...R, stroke: C.shine, 'stroke-opacity': 0.6, 'stroke-width': 0.5, class: 'wm-shine' }],
  ]
}
