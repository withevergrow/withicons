// forge/hand/christmas/heading.mjs — a bold cranberry H with snow caps on both posts and snow lying on the crossbar,
// a small holly sprig on it. Replaces the generated drawing, whose pale cream and ice-blue bars nearly vanished on white.
// Roles: letter c1 with the shared light, outline ink, snow shine->tint, holly c2/c1. Motion: letter wm-k, snow + holly wm-deco.
import { C, num, loopsD } from '../../styles/_christmas-core.mjs'

const NAME = 'heading'
const id = n => `wg-christmas-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const poly = P => 'M' + P.map(([x, y]) => `${num(x)} ${num(y)}`).join('L') + 'Z'
const disc = (cx, cy, r) => `M${num(cx - r)} ${num(cy)}a${num(r)} ${num(r)} 0 1 0 ${num(2 * r)} 0a${num(r)} ${num(r)} 0 1 0 ${num(-2 * r)} 0z`
// a snow cap on the edge y = top(x) between xa and xb; `walls` keeps it full height at both ends (snow banked against walls)
function snow(xa, xb, top, { up = 1.3, dn = 0.85, drips = [], ph = 0, maxDn = 9, walls = false } = {}) {
  const n = 32, U = [], L = []
  for (let i = 0; i <= n; i++) {
    const t = i / n, x = xa + (xb - xa) * t
    const e = walls ? 0.8 + 0.2 * Math.sin(Math.PI * t) : Math.pow(Math.sin(Math.PI * t), 0.45)
    let d = dn * e * (1 + 0.16 * Math.sin(x * 2.1 + ph))
    for (const [cx, w, l] of drips) { const u = (x - cx) / w; if (Math.abs(u) < 1) d = Math.max(d, (dn + l * Math.sqrt(1 - u * u)) * e) }
    U.push([x, top(x) - up * e * (1 + 0.08 * Math.sin(x * 1.4 + ph))]); L.push([x, top(x) + Math.min(d, maxDn)])
  }
  return walls ? [...U, ...L.reverse()] : [...U, ...L.reverse().slice(1, -1)]
}
// the style's holly sprig: two wavy pointed leaves, three berries, one glint
function holly(x, y, s = 1) {
  const leaf = dir => {
    const a = dir > 0 ? -0.32 : Math.PI + 0.32, ca = Math.cos(a), sa = Math.sin(a), L = 2.05 * s, W = 0.62 * s
    const p0 = [x + ca * 0.25 * s, y + sa * 0.25 * s], tip = [x + ca * L, y + sa * L], nx = -sa, ny = ca
    const pt = (t, side) => { const w = W * Math.sin(Math.PI * t) * (1 + 0.28 * Math.cos(t * Math.PI * 4)); return [p0[0] + (tip[0] - p0[0]) * t + nx * w * side, p0[1] + (tip[1] - p0[1]) * t + ny * w * side] }
    const P = []
    for (let k = 0; k <= 8; k++) P.push(pt(k / 8, 1))
    for (let k = 7; k >= 1; k--) P.push(pt(k / 8, -1))
    return P
  }
  const b = 0.46 * s
  return [
    ['path', { d: loopsD([leaf(1), leaf(-1)]), fill: C.c2, stroke: C.ink, 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: disc(x - 0.42 * s, y + 0.18 * s, b) + disc(x + 0.42 * s, y + 0.18 * s, b) + disc(x, y - 0.42 * s, b), fill: C.c1, stroke: C.ink, 'stroke-width': 0.28, class: 'wm-deco' }],
    ['path', { d: disc(x - 0.12 * s, y - 0.58 * s, 0.13 * s), fill: C.shine, class: 'wm-deco' }],
  ]
}

const T = 4, B = 20.25, XL = 4.4, XR = 19.6, W = 3.3, Y0 = 10.4, Y1 = 13.6, R = 1.1
const H = `M${XL + R} ${T}H${XL + W - R}A${R} ${R} 0 0 1 ${XL + W} ${T + R}V${Y0}H${XR - W}V${T + R}A${R} ${R} 0 0 1 ${XR - W + R} ${T}` +
  `H${XR - R}A${R} ${R} 0 0 1 ${XR} ${T + R}V${B - R}A${R} ${R} 0 0 1 ${XR - R} ${B}H${XR - W + R}A${R} ${R} 0 0 1 ${XR - W} ${B - R}` +
  `V${Y1}H${XL + W}V${B - R}A${R} ${R} 0 0 1 ${XL + W - R} ${B}H${XL + R}A${R} ${R} 0 0 1 ${XL} ${B - R}V${T + R}A${R} ${R} 0 0 1 ${XL + R} ${T}Z`
// the top of a post whose left edge is at x0
const post = x0 => x => {
  const a = x0 + R, b = x0 + W - R
  return x < a ? T + R - Math.sqrt(Math.max(0, R * R - (x - a) ** 2)) : x > b ? T + R - Math.sqrt(Math.max(0, R * R - (x - b) ** 2)) : T
}

export default function render() {
  const caps = [
    snow(XL + 0.1, XL + W - 0.1, post(XL), { up: 1.3, dn: 0.8, drips: [[5.5, 0.6, 0.55]], ph: 0.4 }),
    snow(XR - W + 0.1, XR - 0.1, post(XR - W), { up: 1.3, dn: 0.8, drips: [[18.6, 0.6, 0.45]], ph: 2.2 }),
    snow(XL + W, XR - W, () => Y0, { up: 1.1, dn: 0.75, drips: [[9.6, 0.75, 0.5]], ph: 1.1, maxDn: 1.6, walls: true }),
  ]
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: XL, y1: T, x2: 12.76, y2: B, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 2.7, x2: 0, y2: 5.4, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
      ['linearGradient', { id: id(2), x1: 0, y1: 9.3, x2: 0, y2: 12, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    ['path', { d: H, fill: C.c1, ...INK, class: 'wm-k' }],
    ['path', { d: H, fill: url(0), class: 'wm-shine' }],
    ['path', { d: caps.map(c => poly(c.map(([x, y]) => [x, y + 0.42]))).join(''), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: poly(caps[0]) + poly(caps[1]), fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: poly(caps[2]), fill: url(2), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ...holly(13.7, 9.95, 1),
  ]
}
