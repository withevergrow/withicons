// forge/hand/christmas/puzzle-piece.mjs — a true jigsaw piece in Christmas red: a knob on the top and on the right, a matching
// socket cut into the bottom and the left, so it reads as a puzzle piece at 16-24px (the generated drawing had one tab and
// no socket and looked like a mug). Same 0.6 ink outline, upper-left light and single gold sparkle as the cloud siblings;
// the snow cap and holly are gone so the silhouette is no heavier than they are.
import { C, num } from '../../styles/_christmas-core.mjs'

const N = 'puzzle-piece'
const id = n => `wg-christmas-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const P = (a, b) => `${num(a)} ${num(b)}`
const sparkle = (x, y, r) => { const q = r * 0.22; return `M${P(x, y - r)}Q${P(x + q, y - q)} ${P(x + r, y)}Q${P(x + q, y + q)} ${P(x, y + r)}Q${P(x - q, y + q)} ${P(x - r, y)}Q${P(x - q, y - q)} ${P(x, y - r)}z` }

const L = 2.5, R = 17.5, T = 6.5, B = 21.5, RC = 1.6, K = 2.3
const x0 = 8.4, x1 = 11.6, y0 = 11.4, y1 = 14.6
const BODY = 'M' + P(L + RC, T) + 'H' + num(x0) + `A${K} ${K} 0 1 1 ${P(x1, T)}` + 'H' + num(R - RC) + `A${RC} ${RC} 0 0 1 ${P(R, T + RC)}` +
  'V' + num(y0) + `A${K} ${K} 0 1 1 ${P(R, y1)}` + 'V' + num(B - RC) + `A${RC} ${RC} 0 0 1 ${P(R - RC, B)}` +
  'H' + num(x1) + `A${K} ${K} 0 1 0 ${P(x0, B)}` + 'H' + num(L + RC) + `A${RC} ${RC} 0 0 1 ${P(L, B - RC)}` +
  'V' + num(y1) + `A${K} ${K} 0 1 0 ${P(L, y0)}` + 'V' + num(T + RC) + `A${RC} ${RC} 0 0 1 ${P(L + RC, T)}Z`

export default function render() {
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 3, y1: 3, x2: 15, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
    ]],
    ['path', { d: BODY, fill: C.c1, stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: BODY, fill: url(0), class: 'wm-shine' }],
    ['path', { d: 'M4.1 10V8.6A1 1 0 0 1 5.1 7.6H6.8', stroke: C.shine, 'stroke-opacity': 0.6, 'stroke-width': 0.8, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: sparkle(20.2, 4.6, 1.4), fill: C.accent, stroke: C.ink, 'stroke-width': 0.28, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
