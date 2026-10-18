// christmas/paintbrush: a long diagonal artist brush: pine handle, gold ferrule with a crimp band, a plump cranberry bristle tuft ending in a fine point; the generated version was a green blob on a stick.
import { C } from '../../styles/_christmas-core.mjs'

const N = 'paintbrush'
const id = k => `wg-christmas-${N}-${k}`, url = k => `url(#${id(k)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const K = { stroke: C.ink, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }
const f = v => Math.round(v * 100) / 100
// brush frame: a = distance along the brush from the handle end (top right) toward the tip, b = across
const S = 0.7071, X0 = 21.2, Y0 = 2.8
const p = (a, b) => `${f(X0 - S * a + S * b)} ${f(Y0 + S * a + S * b)}`
const HANDLE = `M${p(1, -1.3)}L${p(12.6, -2)}L${p(12.6, 2)}L${p(1, 1.3)}Q${p(-0.7, 0)} ${p(1, -1.3)}Z`
const FERRULE = `M${p(12.2, -2.6)}L${p(17, -2.6)}L${p(17, 2.6)}L${p(12.2, 2.6)}Z`
const BAND = `M${p(14.1, -2.6)}L${p(14.1, 2.6)}`
const BRISTLE = `M${p(16.8, -2.6)}C${p(17.6, -3.9)} ${p(20.4, -3.9)} ${p(21.8, -2.5)}C${p(23.2, -1.2)} ${p(24.6, -0.4)} ${p(26, 0.4)}C${p(24.4, 1.4)} ${p(23, 3)} ${p(21.2, 3.5)}C${p(19.4, 4.1)} ${p(17.6, 3.8)} ${p(16.8, 2.6)}Z`
const star = (x, y) => ['path', { d: `M${x} ${y - 1.55}Q${x + 0.34} ${y - 0.34} ${x + 1.55} ${y}Q${x + 0.34} ${y + 0.34} ${x} ${y + 1.55}Q${x - 0.34} ${y + 0.34} ${x - 1.55} ${y}Q${x - 0.34} ${y - 0.34} ${x} ${y - 1.55}z`, fill: C.accent, ...K, 'stroke-width': 0.28, class: 'wm-deco' }]

export default function render() {
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 4, y1: 3, x2: 20, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
    ]],
    ['path', { d: HANDLE, fill: C.c2, ...K, 'stroke-width': 0.6, class: 'wm-k' }],
    ['path', { d: BRISTLE, fill: C.c1, ...K, 'stroke-width': 0.6, class: 'wm-a' }],
    ['path', { d: FERRULE, fill: C.c3, ...K, 'stroke-width': 0.6, class: 'wm-k' }],
    ['path', { d: BAND, fill: 'none', stroke: C.ink, 'stroke-width': 0.5, 'stroke-opacity': 0.7, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: HANDLE + BRISTLE + FERRULE, fill: url(0), 'fill-rule': 'nonzero', class: 'wm-shine' }],
    star(6.2, 5.4),
  ]
}
