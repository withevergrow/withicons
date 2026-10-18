// christmas/rewind: two crisp, evenly sized left-pointing triangles (gold behind, cranberry in front) with rounded corners and a single small snow dab; the generated version buried both under big snow caps.
import { C } from '../../styles/_christmas-core.mjs'

const N = 'rewind'
const id = k => `wg-christmas-${N}-${k}`, url = k => `url(#${id(k)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const K = { stroke: C.ink, 'stroke-linejoin': 'round' }
// left-pointing triangle with rounded corners: tip (x0,12), back edge x1, y 5.2..18.8
const tri = (x0, x1) => {
  const dx = x1 - x0, r = 0.12
  const a = [x0 + dx * r * 0.7, 12 + 0.0], t1 = [x0 + dx * 0.16, 12 - 0.16 * 13.6 * 0.5 * (1 / 0.5) * 0.5]
  void a; void t1
  return null
}
void tri
const f = v => Math.round(v * 100) / 100
// hand-rounded: corners via quadratic curves
const T = (x0, x1) => {
  const w = x1 - x0, top = 4.4, bot = 19.6
  const tipU = [f(x0 + w * 0.17), f(12 - 1.1)], tipD = [f(x0 + w * 0.17), f(12 + 1.1)]
  return `M${tipU[0]} ${tipU[1]}L${f(x1 - w * 0.13)} ${f(top + 0.5)}Q${x1} ${top - 0.2} ${x1} ${f(top + 1.6)}V${f(bot - 1.6)}Q${x1} ${bot + 0.2} ${f(x1 - w * 0.13)} ${f(bot - 0.5)}L${tipD[0]} ${tipD[1]}Q${x0} 12 ${tipU[0]} ${tipU[1]}Z`
}
const GOLD = T(1.6, 11.8), RED = T(11.8, 22.2)
// snow dab on the red triangle's upper edge near the back corner
const SNOW = 'M17 8.4L21 5.2Q22.3 4.3 22.3 5.9V8Q21.6 8.8 20.9 8.1Q20.1 9 19.3 8.2Q18.4 8.9 17.7 8.5Q17.4 8.7 17 8.4Z'
const star = (x, y) => ['path', { d: `M${x} ${y - 1.55}Q${x + 0.34} ${y - 0.34} ${x + 1.55} ${y}Q${x + 0.34} ${y + 0.34} ${x} ${y + 1.55}Q${x - 0.34} ${y + 0.34} ${x - 1.55} ${y}Q${x - 0.34} ${y - 0.34} ${x} ${y - 1.55}z`, fill: C.accent, ...K, 'stroke-width': 0.28, class: 'wm-deco' }]

export default function render() {
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 2, y1: 5, x2: 20, y2: 19, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 4.4, x2: 0, y2: 9.2, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    ['path', { d: GOLD, fill: C.c3, ...K, 'stroke-width': 0.6, class: 'wm-k' }],
    ['path', { d: RED, fill: C.c1, ...K, 'stroke-width': 0.6, class: 'wm-a' }],
    ['path', { d: GOLD + RED, fill: url(0), class: 'wm-shine' }],
    ['path', { d: SNOW, fill: url(1), ...K, 'stroke-width': 0.42, class: 'wm-deco' }],
    star(4.6, 4.6),
  ]
}
