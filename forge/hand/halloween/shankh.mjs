// forge/hand/halloween/shankh.mjs - the line conch in Halloween colours: a rounded pumpkin-orange shell body that comes to a point on the
// left, a spiral ridge across its shoulder, and a witch-purple ruffled flange at the mouth with two ridge lines. Replaces the upright
// spiral cone.
// Roles: shell c1 -> c2, flange c3 -> edge, ridges ink, halo accent, shine shine, shadow shadow.
// Motion: shell wm-k, flange wm-a, halo wm-deco.
import { C } from '../../styles/_halloween-palettes.mjs'

const NAME = 'shankh'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const R = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

const BODY = 'M2 10.2C4.2 9.4 6.4 6.8 8.4 5C10.6 3 13.6 3.2 16 5.2C18.6 8.2 19.2 12.8 18 15.8C16.6 19.2 13.4 20.6 10.2 20C6.2 19.2 3 16 1.5 10.2Z'
const FLANGE = 'M16 5.2C16.6 4.2 18 4 18.8 4.9C19.5 4.2 20.8 4.4 21.2 5.6C22.2 5.8 22.5 7.8 21.7 9C22.2 10.2 21.9 11.8 21 12.3C20.6 13.7 19.4 14.4 18.3 14Z'
const BODY_SH = 'M2.15 11.05C4.35 10.25 6.55 7.65 8.55 5.85C10.75 3.85 13.75 4.05 16.15 6.05C18.75 9.05 19.35 13.65 18.15 16.65C16.75 20.05 13.55 21.45 10.35 20.85C6.35 20.05 3.15 16.85 1.65 11.05Z'

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 11, cy: 12.5, r: 11.5, fx: 7.5, fy: 8.5, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['radialGradient', { id: id(1), cx: 20, cy: 9, r: 7, fx: 18.5, fy: 6, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c3), st(0.5, C.c3), st(1, C.edge)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.6, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: BODY_SH, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: BODY, fill: url(0), ...INK, class: 'wm-k' }],
    // spiral ridge across the shoulder
    ['path', { d: 'M2 10.2C5.5 10.8 7.8 9.8 8.6 7.6C9.4 5.6 12.4 4.8 16 6.2', ...R, stroke: C.ink, 'stroke-width': 0.8, class: 'wm-k' }],
    ['path', { d: 'M3.6 13C7.4 13.6 11.6 12.4 13.2 8.4', ...R, stroke: C.ink, 'stroke-opacity': 0.6, 'stroke-width': 0.6, class: 'wm-k' }],
    ['path', { d: 'M6.4 16.6C10.4 16.8 14.6 14.4 16 9.6', ...R, stroke: C.ink, 'stroke-opacity': 0.6, 'stroke-width': 0.6, class: 'wm-k' }],
    ['path', { d: 'M5 9.2C7.4 7.4 9.6 4.9 12 4.4', ...R, stroke: C.shine, 'stroke-opacity': 0.5, 'stroke-width': 0.7, class: 'wm-shine' }],
    // ruffled flange at the mouth
    ['path', { d: FLANGE, fill: url(1), ...INK, class: 'wm-a' }],
    ['path', { d: 'M18.6 5.6L19.6 13', ...R, stroke: C.ink, 'stroke-width': 0.7, class: 'wm-a' }],
    ['path', { d: 'M20.6 6L21.2 11.4', ...R, stroke: C.ink, 'stroke-width': 0.7, class: 'wm-a' }],
    ['path', { d: 'M19.4 4.9C19.7 4.6 20.2 4.6 20.5 4.8', ...R, stroke: C.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.5, class: 'wm-shine' }],
  ]
}
