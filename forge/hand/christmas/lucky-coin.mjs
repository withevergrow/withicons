// forge/hand/christmas/lucky-coin.mjs — a round gold cash coin: bright face, raised rim ring, a bold square hole
// (dark, so it reads at 16px) with a lighter raised border and four small glyph ticks, a gold sparkle and a holly
// sprig tucked on the rim. No snow cap: it made the coin read as a bun.
import { C } from '../../styles/_christmas-core.mjs'

const n = v => Math.round(v * 100) / 100
const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const disc = (x, y, r) => `M${n(x - r)} ${n(y)}a${n(r)} ${n(r)} 0 1 0 ${n(2 * r)} 0a${n(r)} ${n(r)} 0 1 0 ${n(-2 * r)} 0Z`
const rr = (x0, y0, x1, y1, r) => `M${n(x0 + r)} ${n(y0)}H${n(x1 - r)}A${r} ${r} 0 0 1 ${n(x1)} ${n(y0 + r)}V${n(y1 - r)}A${r} ${r} 0 0 1 ${n(x1 - r)} ${n(y1)}H${n(x0 + r)}A${r} ${r} 0 0 1 ${n(x0)} ${n(y1 - r)}V${n(y0 + r)}A${r} ${r} 0 0 1 ${n(x0 + r)} ${n(y0)}Z`

function holly(x, y, s) {
  const leaf = dir => {
    const a = dir > 0 ? -0.5 : Math.PI + 0.5, ca = Math.cos(a), sa = Math.sin(a)
    const L = 2.2 * s, W = 0.66 * s, p0 = [x + ca * 0.25 * s, y + sa * 0.25 * s], tip = [x + ca * L, y + sa * L]
    const pt = (t, side) => {
      const w = W * Math.sin(Math.PI * t) * (1 + 0.28 * Math.cos(t * Math.PI * 4))
      return [p0[0] + (tip[0] - p0[0]) * t - sa * w * side, p0[1] + (tip[1] - p0[1]) * t + ca * w * side]
    }
    const P = []
    for (let k = 0; k <= 8; k++) P.push(pt(k / 8, 1))
    for (let k = 7; k >= 1; k--) P.push(pt(k / 8, -1))
    return 'M' + P.map(p => `${n(p[0])} ${n(p[1])}`).join('L') + 'Z'
  }
  const b = 0.52 * s
  return [
    ['path', { d: leaf(1) + leaf(-1), fill: C.c2, stroke: C.ink, 'stroke-width': 0.34, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: disc(x - 0.46 * s, y + 0.2 * s, b) + disc(x + 0.46 * s, y + 0.2 * s, b) + disc(x, y - 0.46 * s, b), fill: C.c1, stroke: C.ink, 'stroke-width': 0.3, class: 'wm-deco' }],
    ['path', { d: disc(x - 0.14 * s, y - 0.64 * s, 0.14 * s), fill: C.shine, class: 'wm-deco' }],
  ]
}

export default function render(icon) {
  const name = icon.name || 'lucky-coin'
  const id = k => `wg-christmas-${name}-${k}`, url = k => `url(#${id(k)})`
  const FACE = disc(12, 12, 9.6)
  const RIM = disc(12, 12, 7.9)
  const BOX = rr(7.9, 7.9, 16.1, 16.1, 1.2)
  const HOLE = rr(9.4, 9.4, 14.6, 14.6, 0.5)
  const ticks = 'M12 4.9V6.3M12 17.7V19.1M4.9 12H6.3M17.7 12H19.1'
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 3, y1: 2.4, x2: 13, y2: 21.6, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
    ]],
    ['path', { d: FACE, fill: C.c3, ...INK, class: 'wm-k' }],
    ['path', { d: RIM, fill: C.accent, stroke: C.ink, 'stroke-width': 0.42, 'stroke-opacity': 0.8, class: 'wm-k' }],
    ['path', { d: ticks, stroke: C.shadow, 'stroke-width': 0.8, 'stroke-linecap': 'round', 'stroke-opacity': 0.7, class: 'wm-k' }],
    ['path', { d: BOX, fill: C.c3, stroke: C.ink, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: HOLE, fill: C.ink, stroke: C.ink, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: FACE, fill: url(0), class: 'wm-shine' }],
    ['path', { d: 'M6.2 9.2Q7.2 6.8 9.6 5.9', stroke: C.shine, 'stroke-width': 0.8, 'stroke-linecap': 'round', 'stroke-opacity': 0.85, fill: 'none', class: 'wm-shine' }],
    ['path', { d: 'M20.6 1.6Q20.8 3 22.2 3.2Q20.8 3.4 20.6 4.8Q20.4 3.4 19 3.2Q20.4 3 20.6 1.6Z', fill: C.accent, stroke: C.ink, 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ...holly(5.2, 19.6, 0.95),
  ]
}
