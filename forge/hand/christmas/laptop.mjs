// forge/hand/christmas/laptop.mjs — an open laptop: a short cranberry lid with a cool snow-white screen and a slim snow
// cap, hinged onto a wider gold keyboard deck with a front lip and a thumb notch; the generated drawing was a cream box
// over a floating red bar, which read as a toaster or a cake and could not be told from the monitor.
import { C, loopsD, num } from '../../styles/_christmas-core.mjs'

const N = 'laptop'
const id = n => `wg-christmas-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const discD = (cx, cy, r) => `M${num(cx - r)} ${num(cy)}a${num(r)} ${num(r)} 0 1 0 ${num(2 * r)} 0a${num(r)} ${num(r)} 0 1 0 ${num(-2 * r)} 0z`

// a snow cap resting on the surface y = top(x): thick on flats, thinning on steep sides and at the ends, soft drips
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
// top edge of a rounded rectangle
const rrTop = (x0, x1, y, r) => x => {
  const dx = x < x0 + r ? x0 + r - x : x > x1 - r ? x - (x1 - r) : 0
  return y + r - Math.sqrt(Math.max(0, r * r - Math.min(dx, r) ** 2))
}

const LID = 'M6 5H18A2 2 0 0 1 20 7V15.5H4V7A2 2 0 0 1 6 5Z'
const SCREEN = 'M7 7H17A1 1 0 0 1 18 8V12.75A1 1 0 0 1 17 13.75H7A1 1 0 0 1 6 12.75V8A1 1 0 0 1 7 7Z'
const DECK = 'M3.5 15.5H20.5L22.4 18.4A1.5 1.5 0 0 1 21.1 20.5H2.9A1.5 1.5 0 0 1 1.6 18.4Z'
const LIP = 'M1.95 18.75H22.05A1.5 1.5 0 0 1 21.1 20.5H2.9A1.5 1.5 0 0 1 1.95 18.75Z'
const NOTCH = 'M10 15.5H14V15.85A.9 .9 0 0 1 13.1 16.75H10.9A.9 .9 0 0 1 10 15.85Z'

export default function render() {
  const snow = snowCap(rrTop(4, 20, 5, 2), 4.3, 19.7, { up: 1.25, dn: 0.75, drips: [{ x: 8.4, w: 0.8, l: 0.45 }] })
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 1.6, y1: 5, x2: 12.25, y2: 20.5, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 3.6, x2: 0, y2: 6.3, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
      ['linearGradient', { id: id(2), x1: 6, y1: 7, x2: 12.6, y2: 13.75, gradientUnits: 'userSpaceOnUse' }, [st(0.3, C.tint, 0), st(1, C.tint, 0.75)]],
    ]],
    // the lid and its glowing screen
    ['path', { d: LID, fill: C.c1, ...INK, class: 'wm-k' }],
    // the keyboard deck: wider than the lid, its back edge is the hinge line
    ['path', { d: DECK, fill: C.c3, ...INK, class: 'wm-a' }],
    ['path', { d: LIP, fill: C.shadow, 'fill-opacity': 0.28, class: 'wm-a' }],
    ['path', { d: NOTCH, fill: C.shadow, 'fill-opacity': 0.5, class: 'wm-a' }],
    // the shared light over lid and deck
    ['path', { d: LID + DECK, fill: url(0), class: 'wm-shine' }],
    ['path', { d: SCREEN, fill: C.c4, stroke: C.ink, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: SCREEN, fill: url(2), class: 'wm-shine' }],
    ['path', { d: 'M8 11.5L11.25 8.25M8 9.25L9 8.25', stroke: C.shine, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-shine' }],
    // a slim snow cap on the lid
    ['path', { d: snow.shadow, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: snow.cap, fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ...holly(15.4, 4.75),
  ]
}
