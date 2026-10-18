// forge/hand/halloween/paisley.mjs - a chunky orange boteh with a curled, hooked tail, a witch-purple inner teardrop that follows the curl,
// a candle-light heart and two little pattern dots. Replaces the generated flame-like blob where the inner teardrop and tail were lost.
// Roles: outer c1 -> c2, inner teardrop c3 -> edge, heart tint, dots accent, outline ink, halo accent, shine shine, drop shadow shadow.
// Motion: boteh wm-k (sways about 10,21.5), inner teardrop wm-a (breathes), heart wm-s.
import { C } from '../../styles/_halloween-palettes.mjs'

const NAME = 'paisley'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

const BODY = 'M9.5 21.5C15 21.5 19.5 17.5 19.5 12.5C19.5 9 20 6.5 17.5 4.2C16 2.8 13.5 2.6 11.9 4.3C11.5 4.8 11.7 5.6 12.5 5.7C13.4 5.8 14 6.4 13.7 7.3C13.1 9.2 10.8 9.5 8.5 10.1C5 11 2.8 13 2.8 15.7C2.8 19.2 5.8 21.5 9.5 21.5Z'
const BODY_SH = 'M9.65 22.35C15.15 22.35 19.65 18.35 19.65 13.35C19.65 9.85 20.15 7.35 17.65 5.05C16.15 3.65 13.65 3.45 12.05 5.15C11.65 5.65 11.85 6.45 12.65 6.55C13.55 6.65 14.15 7.25 13.85 8.15C13.25 10.05 10.95 10.35 8.65 10.95C5.15 11.85 2.95 13.85 2.95 16.55C2.95 20.05 5.95 22.35 9.65 22.35Z'
const INNER = 'M9.8 18.7C13.4 18.7 16.3 16 16.3 12.6C16.3 10.6 16.6 9.1 15.5 7.9C15.1 7.5 14.9 7.5 14.9 7.9C14.7 9.3 12.7 10.6 10.4 11.2C8.1 11.8 6.3 13 6.3 14.9C6.3 17.2 7.8 18.7 9.8 18.7Z'

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 11, cy: 13, r: 12, fx: 7.2, fy: 8.6, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['radialGradient', { id: id(1), cx: 11.4, cy: 14.2, r: 7.5, fx: 9, fy: 11.4, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c3), st(0.5, C.c3), st(1, C.edge)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.5, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
      ['radialGradient', { id: id(3), cx: 9.2, cy: 14.6, r: 1.9, gradientUnits: 'userSpaceOnUse' }, [st(0, C.tint), st(1, C.accent)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: BODY_SH, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: BODY, fill: url(0), ...INK, class: 'wm-k' }],
    ['path', { d: INNER, fill: url(1), ...INK, 'stroke-width': 0.6, class: 'wm-a' }],
    ['circle', { cx: 9.2, cy: 14.6, r: 1.9, fill: url(3), ...INK, 'stroke-width': 0.6, class: 'wm-s' }],
    ['circle', { cx: 13.4, cy: 11.4, r: 0.8, fill: C.tint, class: 'wm-a' }],
    ['circle', { cx: 15.4, cy: 15.2, r: 0.8, fill: C.tint, class: 'wm-a' }],
    ['path', { d: 'M5.4 13.4C6.2 11.9 7.4 11 9 10.7', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.5, 'stroke-width': 0.6, class: 'wm-shine' }],
    ['path', { d: 'M18.2 9.6C18.3 8.2 18.1 7 17.3 5.8', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.5, 'stroke-width': 0.6, class: 'wm-shine' }],
  ]
}
