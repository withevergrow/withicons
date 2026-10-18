// forge/hand/christmas/mouse.mjs — a bright cranberry mouse with two buttons split by ink seams, a gold scroll wheel in
// the seam and a snow cap with holly on its dome; the generated drawing was a dark pine bean cut in half by a gap, which
// sank on dark grounds and read as an ornament or an acorn rather than a mouse.
import { C, loopsD, num } from '../../styles/_christmas-core.mjs'

const N = 'mouse'
const id = n => `wg-christmas-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const discD = (cx, cy, r) => `M${num(cx - r)} ${num(cy)}a${num(r)} ${num(r)} 0 1 0 ${num(2 * r)} 0a${num(r)} ${num(r)} 0 1 0 ${num(-2 * r)} 0z`

// a snow cap resting on the surface y = top(x): thick on flats, thinning on steep sides and at the ends
function snowCap(top, xa, xb, { up = 1.3, dn = 0.85, ph = 0.7, ph2 = 2.1, taper = 1.2 } = {}) {
  const U = [], D = []
  for (let x = xa; x <= xb + 1e-6; x += 0.25) {
    const s = Math.abs(top(x + 0.4) - top(x - 0.4)) / 0.8
    const e = Math.max(0, Math.min(1, (x - xa) / taper, (xb - x) / taper))
    const q = Math.sqrt(Math.max(0, Math.min(1, 1 - (s - 0.5) / 1.1)) * e * e * (3 - 2 * e))
    U.push([x, top(x) - up * q * (1 + 0.1 * Math.sin(x * 1.4 + ph))]); D.push([x, top(x) + dn * q * (1 + 0.18 * Math.sin(x * 2.1 + ph2))])
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

const BODY = 'M12 3A6.5 6.5 0 0 1 18.5 9.5V15A6.5 6.5 0 0 1 5.5 15V9.5A6.5 6.5 0 0 1 12 3Z'
const SEAMS = 'M5.5 11.5H18.5M12 3V6M12 9.75V11.5'
const WHEEL = 'M12 6A1 1 0 0 1 13 7V8.75A1 1 0 0 1 11 8.75V7A1 1 0 0 1 12 6Z'

export default function render() {
  const snow = snowCap(x => 9.5 - Math.sqrt(Math.max(0, 42.25 - (x - 12) ** 2)), 6, 18, { up: 1.2, dn: 0.7, taper: 1.4 })
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 5.5, y1: 3, x2: 12.65, y2: 21.5, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 1.8, x2: 0, y2: 5, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    ['path', { d: BODY, fill: C.c1, ...INK, class: 'wm-k' }],
    ['path', { d: BODY, fill: url(0), class: 'wm-shine' }],
    // the button split and the scroll wheel
    ['path', { d: SEAMS, stroke: C.ink, 'stroke-width': 0.85, class: 'wm-a' }],
    ['path', { d: WHEEL, fill: C.c3, stroke: C.ink, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-a' }],
    // snow on the dome
    ['path', { d: snow.shadow, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: snow.cap, fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ...holly(13.7, 3.05, 1.1),
  ]
}
