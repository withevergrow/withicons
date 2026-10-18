// forge/hand/christmas/chart-bar.mjs — three plain bars (pine, cranberry, gold) standing apart on a clear ink baseline,
// each with a little snow cap and holly on the tallest. The generated drawing painted the bars pale cream with heavy
// snow, so on a cream page they read as candles or milk cartons and the comparison of heights got lost.
import { C, loopsD, num } from '../../styles/_christmas-core.mjs'

const N = 'chart-bar'
const id = n => `wg-christmas-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const discD = (cx, cy, r) => `M${num(cx - r)} ${num(cy)}a${num(r)} ${num(r)} 0 1 0 ${num(2 * r)} 0a${num(r)} ${num(r)} 0 1 0 ${num(-2 * r)} 0z`
const sparkle = (x, y, r) => { const q = r * 0.22, P = (a, b) => `${num(a)} ${num(b)}`; return `M${P(x, y - r)}Q${P(x + q, y - q)} ${P(x + r, y)}Q${P(x + q, y + q)} ${P(x, y + r)}Q${P(x - q, y + q)} ${P(x - r, y)}Q${P(x - q, y - q)} ${P(x, y - r)}z` }

function snowCap(top, xa, xb, { up = 1.3, dn = 0.85, drips = [], ph = 0.7, ph2 = 2.1, taper = 1.2 } = {}) {
  const U = [], D = []
  for (let x = xa; x <= xb + 1e-6; x += 0.25) {
    const s = Math.abs(top(x + 0.4) - top(x - 0.4)) / 0.8
    const e = Math.max(0, Math.min(1, (x - xa) / taper, (xb - x) / taper))
    const q = Math.sqrt(Math.max(0, Math.min(1, 1 - (s - 0.5) / 1.1)) * e * e * (3 - 2 * e))
    let d = dn * q * (1 + 0.18 * Math.sin(x * 2.1 + ph2))
    for (const p of drips) { const u = (x - p.x) / p.w; if (Math.abs(u) < 1) d = Math.max(d, dn * q + p.l * q * Math.sqrt(1 - u * u)) }
    U.push([x, top(x) - up * q * (1 + 0.1 * Math.sin(x * 1.4 + ph))]); D.push([x, top(x) + d])
  }
  return {
    cap: loopsD([[...U, ...D.slice().reverse()]]),
    shadow: loopsD([[...U.map(([x]) => [x, top(x) + 0.05]), ...D.map(([x, y]) => [x, y + 0.42]).reverse()]]),
  }
}
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
// top edge of a rounded-top bar
const rrTop = (x0, x1, y, r) => x => {
  const dx = x < x0 + r ? x0 + r - x : x > x1 - r ? x - (x1 - r) : 0
  return y + r - Math.sqrt(Math.max(0, r * r - Math.min(dx, r) ** 2))
}
const bar = (x0, x1, y, r = 1.25, b = 20) => `M${num(x0)} ${num(b)}V${num(y + r)}A${r} ${r} 0 0 1 ${num(x0 + r)} ${num(y)}H${num(x1 - r)}A${r} ${r} 0 0 1 ${num(x1)} ${num(y + r)}V${num(b)}Z`

const BARS = [[3.5, 8, 12, 'c2'], [9.75, 14.25, 4.5, 'c1'], [16, 20.5, 8.5, 'c3']]
const BASE = 'M3.25 19.5H20.75A1 1 0 0 1 20.75 21.5H3.25A1 1 0 0 1 3.25 19.5Z'

export default function render() {
  const out = []
  const all = BARS.map(([a, b, y]) => bar(a, b, y)).join('')
  for (const [a, b, y, c] of BARS) out.push(['path', { d: bar(a, b, y), fill: C[c], ...INK, class: 'wm-k' }])
  out.push(['path', { d: all, fill: url(0), class: 'wm-shine' }])
  // a soft edge light down the left side of each bar
  out.push(['path', { d: BARS.map(([a, , y]) => `M${num(a + 1)} ${num(y + 2.4)}V${num(Math.min(18.5, y + 6))}`).join(''), stroke: C.shine, 'stroke-width': 0.6, 'stroke-linecap': 'round', 'stroke-opacity': 0.45, class: 'wm-shine' }])
  // the baseline
  out.push(['path', { d: BASE, fill: C.c1, ...INK, class: 'wm-a' }])
  out.push(['path', { d: BASE, fill: url(0), class: 'wm-a' }])
  // snow on each bar
  const drips = [[{ x: 6.4, w: 0.6, l: 0.4 }], [{ x: 11.2, w: 0.7, l: 0.5 }], [{ x: 18.9, w: 0.6, l: 0.4 }]]
  BARS.forEach(([a, b, y], k) => {
    const s = snowCap(rrTop(a, b, y, 1.25), a + 0.2, b - 0.2, { up: 1.15, dn: 0.75, drips: drips[k], taper: 0.9, ph: k * 1.3 })
    out.push(['path', { d: s.shadow, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }])
    out.push(['path', { d: s.cap, fill: url(1 + k), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }])
  })
  out.push(...holly(12.4, 3.55, 1.05))
  out.push(['path', { d: sparkle(5.75, 6.75, 1.4), fill: C.accent, stroke: C.ink, 'stroke-width': 0.28, 'stroke-linejoin': 'round', class: 'wm-deco' }])
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 3.5, y1: 4.5, x2: 13, y2: 20, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ...BARS.map(([, , y], k) => ['linearGradient', { id: id(1 + k), x1: 0, y1: y - 1.3, x2: 0, y2: y + 1.1, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]]),
    ]],
    ...out,
  ]
}
