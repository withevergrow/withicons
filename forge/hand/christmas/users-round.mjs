// forge/hand/christmas/users-round.mjs: two matching round-bust people in the style of user-round (gold head, snow cap,
// knit jumper with a cream collar): a large front person in cranberry with holly, and a smaller back person in pine
// that sits higher and to the right with its own full head and shoulder arc, replacing the generated cropped sliver.
import { C, num } from '../../styles/_christmas-core.mjs'

const N = 'users-round'
const id = n => `wg-christmas-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const sh = (d, dy) => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (m, x, y) => `${x} ${Math.round((+y + dy) * 100) / 100}`)
const disc = (cx, cy, r) => `M${num(cx - r)} ${num(cy)}a${num(r)} ${num(r)} 0 1 0 ${num(2 * r)} 0a${num(r)} ${num(r)} 0 1 0 ${num(-2 * r)} 0z`
// scale a drawing built around (8.5, 7.5) to a head centred at (cx, cy)
const fit = (d, cx, cy, s) => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (m, x, y) => `${num(cx + (+x - 8.5) * s)} ${num(cy + (+y - 7.5) * s)}`)
// round-shouldered bust with a flat softly cornered hem: centre, half width, top, hem
const bust = (cx, w, t, b) => {
  const l = cx - w, r = cx + w, d = Math.min(5.8, (b - t) * 0.72), k = w * 0.575
  return `M${num(l)} ${num(b - 1.3)}V${num(t + d)}C${num(l)} ${num(t + d * 0.41)} ${num(cx - k)} ${num(t)} ${num(cx)} ${num(t)}C${num(cx + k)} ${num(t)} ${num(r)} ${num(t + d * 0.41)} ${num(r)} ${num(t + d)}V${num(b - 1.3)}Q${num(r)} ${num(b)} ${num(r - 1.3)} ${num(b)}H${num(l + 1.3)}Q${num(l)} ${num(b)} ${num(l)} ${num(b - 1.3)}Z`
}
// rolled collar crescent hugging the neckline (scaled by k around its top centre)
const collar = (cx, t, k) => {
  const p = (x, y) => `${num(cx + (x - 12) * k)} ${num(t + (y - 13.8) * k)}`
  return `M${p(8.1, 14.75)}C${p(9.2, 14.15)} ${p(10.55, 13.8)} ${p(12, 13.8)}C${p(13.45, 13.8)} ${p(14.8, 14.15)} ${p(15.9, 14.75)}C${p(15.3, 16.15)} ${p(13.8, 17)} ${p(12, 17)}C${p(10.2, 17)} ${p(8.7, 16.15)} ${p(8.1, 14.75)}Z`
}

const SNOW = 'M4 5.8C4.2 3.25 6.2 1.55 8.5 1.55C10.8 1.55 12.8 3.25 13 5.8C12.6 6.2 12.15 6.05 11.95 5.55C11.7 5.05 11.1 5.05 10.85 5.55' +
  'C10.35 6.75 9.05 6.75 8.7 5.75C8.45 5.15 7.85 5.05 7.45 5.55C7.05 6.05 6.3 6.05 6.05 5.45C5.85 5 5.2 5 4.9 5.5C4.65 5.85 4.2 6.1 4 5.8Z'

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

// front person: head r 4.2 at (8.2, 7.8), bust 14 wide
const F_CX = 8.2, F_CY = 7.8, F_S = 0.92
const F_HEAD = disc(F_CX, F_CY, 4.55 * F_S)
const F_BODY = bust(8.2, 7.1, 14.1, 21.9)
const F_COLLAR = collar(8.2, 14.1, 0.92)
const F_SNOW = fit(SNOW, F_CX, F_CY, F_S)
// back person: smaller, higher, to the right
const B_CX = 17.8, B_CY = 6.9, B_S = 0.72
const B_HEAD = disc(B_CX, B_CY, 4.55 * B_S)
const B_BODY = bust(17.8, 5.1, 11.6, 21.9)
const B_COLLAR = collar(17.8, 11.6, 0.62)
const B_SNOW = fit(SNOW, B_CX, B_CY, B_S)

export default function render() {
  const ink = C.ink
  const out = { stroke: ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
  const lit = [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]
  const snow = [st(0.25, C.shine), st(1, C.tint)]
  const collarG = [st(0.2, C.shine, 0), st(1, C.tint, 0.8)]
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 3, y1: 2.8, x2: 12, y2: 12, gradientUnits: 'userSpaceOnUse' }, lit],
      ['linearGradient', { id: id(1), x1: 0, y1: F_CY - 5.95 * F_S, x2: 0, y2: F_CY - 1.7 * F_S, gradientUnits: 'userSpaceOnUse' }, snow],
      ['linearGradient', { id: id(2), x1: 1.1, y1: 14.1, x2: 10, y2: 23.5, gradientUnits: 'userSpaceOnUse' }, lit],
      ['linearGradient', { id: id(3), x1: 0, y1: 14.1, x2: 0, y2: 17, gradientUnits: 'userSpaceOnUse' }, collarG],
      ['linearGradient', { id: id(4), x1: 13.5, y1: 3, x2: 21.5, y2: 11, gradientUnits: 'userSpaceOnUse' }, lit],
      ['linearGradient', { id: id(5), x1: 0, y1: B_CY - 5.95 * B_S, x2: 0, y2: B_CY - 1.7 * B_S, gradientUnits: 'userSpaceOnUse' }, snow],
      ['linearGradient', { id: id(6), x1: 12.7, y1: 11.6, x2: 21, y2: 23, gradientUnits: 'userSpaceOnUse' }, lit],
      ['linearGradient', { id: id(7), x1: 0, y1: 11.6, x2: 0, y2: 14, gradientUnits: 'userSpaceOnUse' }, collarG],
    ]],
    // back person (part A)
    ['path', { d: B_BODY, fill: C.c2, ...out, class: 'wm-a' }],
    ['path', { d: B_BODY, fill: url(6), class: 'wm-a wm-shine' }],
    ['path', { d: B_COLLAR, fill: C.c4, ...out, 'stroke-width': 0.5, class: 'wm-a' }],
    ['path', { d: B_COLLAR, fill: url(7), class: 'wm-a wm-shine' }],
    ['path', { d: B_HEAD, fill: C.c3, ...out, class: 'wm-a' }],
    ['path', { d: B_HEAD, fill: url(4), class: 'wm-a wm-shine' }],
    ['path', { d: sh(B_SNOW, 0.35), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-a wm-deco' }],
    ['path', { d: B_SNOW, fill: url(5), stroke: ink, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-a wm-deco' }],
    // front person
    ['path', { d: F_BODY, fill: C.c1, ...out, class: 'wm-k' }],
    ['path', { d: F_BODY, fill: url(2), class: 'wm-shine' }],
    ['path', { d: F_COLLAR, fill: C.c4, ...out, class: 'wm-k' }],
    ['path', { d: F_COLLAR, fill: url(3), class: 'wm-shine' }],
    ['path', { d: F_HEAD, fill: C.c3, ...out, class: 'wm-k' }],
    ['path', { d: F_HEAD, fill: url(0), class: 'wm-shine' }],
    ['path', { d: sh(F_SNOW, 0.45), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: F_SNOW, fill: url(1), stroke: ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ...holly(F_CX, F_CY - 5.6 * F_S + 0.0, 1.05),
  ]
}
