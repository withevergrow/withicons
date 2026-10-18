// forge/hand/christmas/cloud-snow.mjs — a snow cloud that cools from cream at the top to frost blue underneath, with a
// firm ink outline, a holly sprig on its crown and five frost-blue snow dots outlined in ink. The generated drawing used
// cream for the cloud and the dots, so both dissolved into a cream page; the cloud and the snow now separate clearly.
import { C, loopsD, num } from '../../styles/_christmas-core.mjs'

const N = 'cloud-snow'
const id = n => `wg-christmas-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const discD = (cx, cy, r) => `M${num(cx - r)} ${num(cy)}a${num(r)} ${num(r)} 0 1 0 ${num(2 * r)} 0a${num(r)} ${num(r)} 0 1 0 ${num(-2 * r)} 0z`
const sparkle = (x, y, r) => { const q = r * 0.22, P = (a, b) => `${num(a)} ${num(b)}`; return `M${P(x, y - r)}Q${P(x + q, y - q)} ${P(x + r, y)}Q${P(x + q, y + q)} ${P(x, y + r)}Q${P(x - q, y + q)} ${P(x - r, y)}Q${P(x - q, y - q)} ${P(x, y - r)}z` }
// the style's holly sprig: two wavy pointed leaves and three berries
function holly(x, y, s = 1.2) {
  const leaf = dir => {
    const a = dir > 0 ? -0.32 : Math.PI + 0.32, ca = Math.cos(a), sa = Math.sin(a), L = 2.05 * s, W = 0.62 * s
    const p0 = [x + ca * 0.25 * s, y + sa * 0.25 * s], tip = [x + ca * L, y + sa * L]
    const pt = (t, side) => { const w = W * Math.sin(Math.PI * t) * (1 + 0.28 * Math.cos(t * Math.PI * 4)); return [p0[0] + (tip[0] - p0[0]) * t - sa * w * side, p0[1] + (tip[1] - p0[1]) * t + ca * w * side] }
    const P = []
    for (let k = 0; k <= 8; k++) P.push(pt(k / 8, 1))
    for (let k = 7; k >= 1; k--) P.push(pt(k / 8, -1))
    return P
  }
  const b = 0.46 * s
  return [
    ['path', { d: loopsD([leaf(1), leaf(-1)]), fill: C.c2, stroke: C.ink, 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: discD(x - 0.42 * s, y + 0.18 * s, b) + discD(x + 0.42 * s, y + 0.18 * s, b) + discD(x, y - 0.42 * s, b), fill: C.c1, stroke: C.ink, 'stroke-width': 0.28, class: 'wm-deco' }],
    ['path', { d: discD(x - 0.12 * s, y - 0.58 * s, 0.13 * s), fill: C.shine, class: 'wm-deco' }],
  ]
}

const CLOUD = 'M7.5 14A4.05 4.05 0 0 1 6.78 5.99A5.58 5.58 0 0 1 17.49 6.44A3.83 3.83 0 0 1 16.73 14Z'
const DOTS = [[8, 17.5], [12, 17.5], [16, 17.5], [10, 21], [14, 21]]
const R = 1.15

export default function render() {
  return [
    ['defs', {}, [
      // frost pooling in the underside of the cloud
      ['linearGradient', { id: id(0), x1: 0, y1: 4, x2: 0, y2: 14, gradientUnits: 'userSpaceOnUse' }, [st(0.2, C.tint, 0), st(1, C.tint, 1)]],
      ['linearGradient', { id: id(1), x1: 3, y1: 2.2, x2: 12, y2: 14, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.22)]],
    ]],
    ['path', { d: CLOUD, fill: C.c4, ...INK, class: 'wm-k' }],
    ['path', { d: CLOUD, fill: url(0), class: 'wm-shine' }],
    ['path', { d: CLOUD, fill: url(1), class: 'wm-shine' }],
    // a highlight on the crown
    ['path', { d: 'M8.6 5.4A4.4 4.4 0 0 1 10.9 3.7', stroke: C.shine, 'stroke-width': 0.7, 'stroke-linecap': 'round', class: 'wm-shine' }],
    // the falling snow
    ['path', { d: DOTS.map(([x, y]) => discD(x, y, R)).join(''), fill: C.tint, stroke: C.ink, 'stroke-width': 0.5, class: 'wm-a' }],
    ['path', { d: DOTS.map(([x, y]) => discD(x - 0.35, y - 0.35, 0.32)).join(''), fill: C.shine, class: 'wm-a' }],
    ...holly(14.4, 2.9, 1.0),
    ['path', { d: sparkle(3.4, 3.4, 1.35), fill: C.accent, stroke: C.ink, 'stroke-width': 0.28, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
