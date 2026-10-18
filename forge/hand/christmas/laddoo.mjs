// forge/hand/christmas/laddoo.mjs — a pyramid of three saffron-gold laddoo (boondi dot texture, a glint each) on a deep
// cranberry dish with a cream rim line, a thin snow cap on the top ball only and one gold sparkle. The generated
// drawing made the sweets white and snowy, so they melted into the plate; gold balls with ink outlines and a dark
// dish keep every ball and the plate separate.
import { C, num } from '../../styles/_christmas-core.mjs'

const n = v => Math.round(v * 100) / 100
const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const disc = (cx, cy, r) => `M${num(cx - r)} ${num(cy)}a${num(r)} ${num(r)} 0 1 0 ${num(2 * r)} 0a${num(r)} ${num(r)} 0 1 0 ${num(-2 * r)} 0z`

const BALLS = [[12, 7.3, 4], [7.9, 12.7, 4.2], [16.1, 12.7, 4.2]] // top ball first (it sits behind the two front ones)
// boondi dots per ball (offset from the centre, as fractions of the radius)
const DOTS = [[-0.45, -0.1], [0.15, -0.5], [0.5, 0.05], [-0.1, 0.38], [-0.58, 0.45], [0.55, 0.6], [0.05, -0.05]]
const dots = (cx, cy, r) => DOTS.map(([a, b]) => disc(cx + a * r, cy + b * r, 0.3)).join('')
const DISH = 'M2.6 15.3Q2.6 14.6 3.5 14.6H20.5Q21.4 14.6 21.4 15.3Q21.1 19.3 17.6 20.8Q17.1 21.3 16.4 21.3H7.6Q6.9 21.3 6.4 20.8Q2.9 19.3 2.6 15.3Z'
const SNOW = 'M8.6 5.6Q8.8 4 10 3.4Q12 2.4 14 3.4Q15.2 4 15.4 5.6Q15 6.5 14.4 5.9Q13.7 5.2 13.2 6.2Q12.6 7 12 6.1Q11.4 5.2 10.7 6Q10 6.7 9.5 6.1Q8.9 6.4 8.6 5.6Z'
const SNOWSH = SNOW.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (m, x, y) => `${n(+x + 0.1)} ${n(+y + 0.4)}`)
const SPARK = (x, y, r) => `M${num(x)} ${num(y - r)}Q${num(x + 0.12 * r)} ${num(y - 0.12 * r)} ${num(x + r)} ${num(y)}Q${num(x + 0.12 * r)} ${num(y + 0.12 * r)} ${num(x)} ${num(y + r)}Q${num(x - 0.12 * r)} ${num(y + 0.12 * r)} ${num(x - r)} ${num(y)}Q${num(x - 0.12 * r)} ${num(y - 0.12 * r)} ${num(x)} ${num(y - r)}Z`

export default function render(icon) {
  const name = icon.name || 'laddoo'
  const id = k => `wg-christmas-${name}-${k}`, url = k => `url(#${id(k)})`
  const out = [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 0, y1: 0, x2: 0.55, y2: 1 },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 2.8, x2: 0, y2: 7, gradientUnits: 'userSpaceOnUse' },
        [st(0.25, C.shine), st(1, C.tint)]],
    ]],
  ]
  BALLS.forEach(([cx, cy, r], i) => {
    out.push(['circle', { cx, cy, r, fill: C.c3, ...INK, class: i ? 'wm-a' : 'wm-k' }])
    out.push(['circle', { cx, cy, r, fill: url(0), class: 'wm-shine' }])
    out.push(['path', { d: dots(cx, cy, r), fill: C.shadow, 'fill-opacity': 0.4, class: i ? 'wm-a' : 'wm-k' }])
    out.push(['path', { d: `M${num(cx - 0.62 * r)} ${num(cy - 0.12 * r)}A${num(0.66 * r)} ${num(0.66 * r)} 0 0 1 ${num(cx - 0.12 * r)} ${num(cy - 0.64 * r)}`, stroke: C.shine, 'stroke-width': 0.6, 'stroke-linecap': 'round', 'stroke-opacity': 0.8, fill: 'none', class: 'wm-shine' }])
  })
  out.push(['path', { d: DISH, fill: C.c1, ...INK, 'stroke-width': 0.7, class: 'wm-k' }])
  out.push(['path', { d: DISH, fill: url(0), class: 'wm-shine' }])
  out.push(['path', { d: 'M4.3 16.4H19.7', stroke: C.c4, 'stroke-width': 0.7, 'stroke-linecap': 'round', fill: 'none', class: 'wm-k' }])
  out.push(['path', { d: SNOWSH, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }])
  out.push(['path', { d: SNOW, fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }])
  out.push(['path', { d: SPARK(19.8, 5.2, 1.7), fill: C.accent, stroke: C.ink, 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-deco' }])
  return out
}
