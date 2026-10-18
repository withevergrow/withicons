// forge/hand/christmas/user-round.mjs — a gingerbread-gold head with a snow cap and holly over a clearly separate
// rounded bust in a cranberry knit jumper with a snow-cream rolled collar, replacing the generated gold dome with
// little round feet that sat right under the chin and read as a loaf of bread.
import { C, num } from '../../styles/_christmas-core.mjs'

const N = 'user-round'
const id = n => `wg-christmas-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const sh = (d, dx, dy) => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (m, x, y) => `${num(+x + dx)} ${num(+y + dy)}`)
const disc = (cx, cy, r) => `M${num(cx - r)} ${num(cy)}a${num(r)} ${num(r)} 0 1 0 ${num(2 * r)} 0a${num(r)} ${num(r)} 0 1 0 ${num(-2 * r)} 0z`
const sparkle = (x, y, r) => { const q = r * 0.22; return `M${num(x)} ${num(y - r)}Q${num(x + q)} ${num(y - q)} ${num(x + r)} ${num(y)}Q${num(x + q)} ${num(y + q)} ${num(x)} ${num(y + r)}Q${num(x - q)} ${num(y + q)} ${num(x - r)} ${num(y)}Q${num(x - q)} ${num(y - q)} ${num(x)} ${num(y - r)}z` }

// head: r 4.5 at (12, 7); bust starts 2.3u below the chin so the two never merge at 16px
const HEAD = disc(12, 7, 4.5)
// a round-shouldered bust with a flat, softly cornered hem (no dome-and-feet)
const BODY = 'M4 20.6V19.6C4 16.2 7.4 13.8 12 13.8C16.6 13.8 20 16.2 20 19.6V20.6Q20 21.9 18.7 21.9H5.3Q4 21.9 4 20.6Z'
// the rolled collar: a snow-cream crescent hugging the neckline
const COLLAR = 'M8.1 14.75C9.2 14.15 10.55 13.8 12 13.8C13.45 13.8 14.8 14.15 15.9 14.75C15.3 16.15 13.8 17 12 17C10.2 17 8.7 16.15 8.1 14.75Z'
// the head's snow cap (the style's drift: thick on top, three soft drips)
const SNOW = sh('M4 5.8C4.2 3.25 6.2 1.55 8.5 1.55C10.8 1.55 12.8 3.25 13 5.8C12.6 6.2 12.15 6.05 11.95 5.55C11.7 5.05 11.1 5.05 10.85 5.55' +
  'C10.35 6.75 9.05 6.75 8.7 5.75C8.45 5.15 7.85 5.05 7.45 5.55C7.05 6.05 6.3 6.05 6.05 5.45C5.85 5 5.2 5 4.9 5.5C4.65 5.85 4.2 6.1 4 5.8Z', 3.5, -0.5)

function holly(x, y, s = 1) {
  const leaf = dir => {
    const a = dir > 0 ? -0.32 : Math.PI + 0.32, ca = Math.cos(a), sa = Math.sin(a)
    const L = 2.05 * s, W = 0.62 * s
    const p0 = [x + ca * 0.25 * s, y + sa * 0.25 * s], tip = [x + ca * L, y + sa * L], nx = -sa, ny = ca
    const pt = (t, side) => {
      const w = W * Math.sin(Math.PI * t) * (1 + 0.28 * Math.cos(t * Math.PI * 4))
      return [p0[0] + (tip[0] - p0[0]) * t + nx * w * side, p0[1] + (tip[1] - p0[1]) * t + ny * w * side]
    }
    const P = []
    for (let k = 0; k <= 8; k++) P.push(pt(k / 8, 1))
    for (let k = 7; k >= 1; k--) P.push(pt(k / 8, -1))
    return 'M' + P.map(p => num(p[0]) + ' ' + num(p[1])).join('L') + 'Z'
  }
  const b = 0.46 * s
  return [
    ['path', { d: leaf(1) + leaf(-1), fill: C.c2, stroke: C.ink, 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: disc(x - 0.42 * s, y + 0.18 * s, b) + disc(x + 0.42 * s, y + 0.18 * s, b) + disc(x, y - 0.42 * s, b), fill: C.c1, stroke: C.ink, 'stroke-width': 0.28, class: 'wm-deco' }],
    ['path', { d: disc(x - 0.12 * s, y - 0.58 * s, 0.13 * s), fill: C.shine, class: 'wm-deco' }],
  ]
}

export default function render() {
  const out = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
  const lit = [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 6.5, y1: 2.5, x2: 14.5, y2: 11.5, gradientUnits: 'userSpaceOnUse' }, lit],
      ['linearGradient', { id: id(1), x1: 0, y1: 1.05, x2: 0, y2: 6.1, gradientUnits: 'userSpaceOnUse' },
        [st(0.25, C.shine), st(1, C.tint)]],
      ['linearGradient', { id: id(2), x1: 4, y1: 13.8, x2: 13.5, y2: 23.5, gradientUnits: 'userSpaceOnUse' }, lit],
      ['linearGradient', { id: id(3), x1: 0, y1: 13.8, x2: 0, y2: 17, gradientUnits: 'userSpaceOnUse' },
        [st(0.2, C.shine, 0), st(1, C.tint, 0.8)]],
    ]],
    ['path', { d: BODY, fill: C.c1, ...out, class: 'wm-k' }],
    ['path', { d: BODY, fill: url(2), class: 'wm-shine' }],
    ['path', { d: COLLAR, fill: C.c4, ...out, class: 'wm-k' }],
    ['path', { d: COLLAR, fill: url(3), class: 'wm-shine' }],
    ['path', { d: HEAD, fill: C.c3, ...out, class: 'wm-k' }],
    ['path', { d: HEAD, fill: url(0), class: 'wm-shine' }],
    ['path', { d: sh(SNOW, 0, 0.45), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: SNOW, fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ...holly(12.9, 1.5, 1.15),
    ['path', { d: sparkle(3.2, 3.2, 1.5), fill: C.accent, stroke: C.ink, 'stroke-width': 0.28, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
