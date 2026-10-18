// forge/hand/halloween/hard-hat.mjs — a pumpkin-orange safety helmet: a tall domed crown with a raised witch-purple centre ridge
// and a chunky orange brim that sits tight against the dome, in the midnight outline with halo, drop shadow and shine.
// Replaces the first hand drawing (a thin purple brim with a goo drip that read as a cap); the brim is now part of the helmet.
// Roles: dome and brim c1 -> c2, ridge c3 -> edge, outline ink, halo accent, shine shine, shadow shadow.
// Motion: dome and brim wm-k (rocks), ridge wm-a.
import { C } from '../../styles/_halloween-palettes.mjs'

const NAME = 'hard-hat'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

const DOME = (dx = 0, dy = 0) => `M${4.4 + dx} ${15.4 + dy}C${4.4 + dx} ${9.6 + dy} ${7.6 + dx} ${5.8 + dy} ${12 + dx} ${5.8 + dy}C${16.4 + dx} ${5.8 + dy} ${19.6 + dx} ${9.6 + dy} ${19.6 + dx} ${15.4 + dy}Z`
const BRIM = (dx = 0, dy = 0) => `M${4.2 + dx} ${14.6 + dy}H${19.8 + dx}A2.2 2.2 0 0 1 ${22 + dx} ${16.8 + dy}A2.2 2.2 0 0 1 ${19.8 + dx} ${19 + dy}H${4.2 + dx}A2.2 2.2 0 0 1 ${2 + dx} ${16.8 + dy}A2.2 2.2 0 0 1 ${4.2 + dx} ${14.6 + dy}Z`
const RIDGE = (dx = 0, dy = 0) => `M${10 + dx} ${14.8 + dy}V${6.8 + dy}C${10 + dx} ${5.4 + dy} ${10.8 + dx} ${4.6 + dy} ${12 + dx} ${4.6 + dy}C${13.2 + dx} ${4.6 + dy} ${14 + dx} ${5.4 + dy} ${14 + dx} ${6.8 + dy}V${14.8 + dy}Z`

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 12.6, r: 10, fx: 8.6, fy: 8.4, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 4.6, x2: 0, y2: 15, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c3), st(0.5, C.c3), st(1, C.edge)]],
      ['linearGradient', { id: id(2), x1: 0, y1: 14.6, x2: 0, y2: 19, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(1, C.c2)]],
      ['radialGradient', { id: id(3), cx: 12, cy: 12.5, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(3), class: 'wm-deco' }],
    ['path', { d: DOME(0.15, 0.85) + BRIM(0.15, 0.85), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: DOME(), fill: url(0), ...INK, class: 'wm-k' }],
    ['path', { d: RIDGE(), fill: url(1), ...INK, class: 'wm-a' }],
    ['path', { d: BRIM(), fill: url(2), ...INK, class: 'wm-k' }],
    // lit upper-left shoulder of the dome, of the ridge and of the brim
    ['path', { d: 'M5.9 12.8C6.2 10.4 7.4 8.6 9 7.6', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.6, 'stroke-width': 0.8, class: 'wm-shine' }],
    ['path', { d: 'M10.9 13.4V7', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.5, 'stroke-width': 0.5, class: 'wm-shine' }],
    ['path', { d: 'M4.2 15.9H8.4', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.5, 'stroke-width': 0.5, class: 'wm-shine' }],
  ]
}
