// forge/hand/christmas/webcam.mjs — a cranberry webcam ball with a thick gold lens bezel around dark glinting glass, a
// tiny gold status light, a snow cap with holly, and a pine neck and foot, replacing the generated cream ball with thin
// rings that read as a target or a speaker.
import { C, loopsD, num } from '../../styles/_christmas-core.mjs'

const N = 'webcam'
const id = n => `wg-christmas-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const disc = (cx, cy, r) => `M${num(cx - r)} ${num(cy)}a${num(r)} ${num(r)} 0 1 0 ${num(2 * r)} 0a${num(r)} ${num(r)} 0 1 0 ${num(-2 * r)} 0z`
const rr = (x0, y0, x1, y1, r) => `M${num(x0 + r)} ${num(y0)}H${num(x1 - r)}A${num(r)} ${num(r)} 0 0 1 ${num(x1)} ${num(y0 + r)}` +
  `V${num(y1 - r)}A${num(r)} ${num(r)} 0 0 1 ${num(x1 - r)} ${num(y1)}H${num(x0 + r)}A${num(r)} ${num(r)} 0 0 1 ${num(x0)} ${num(y1 - r)}` +
  `V${num(y0 + r)}A${num(r)} ${num(r)} 0 0 1 ${num(x0 + r)} ${num(y0)}Z`

// a snow cap on the ball's crown: a polar band on the rim, thickest at the top, thinning down the sides, soft drips
function crownSnow(cx, cy, R, a0, a1, up, dn, drips) {
  const U = [], D = []
  const n = 30
  for (let k = 0; k <= n; k++) {
    const t = k / n, a = a0 + (a1 - a0) * t
    const e = Math.min(1, t / 0.25, (1 - t) / 0.25), q = Math.sqrt(e * e * (3 - 2 * e))
    let d = dn * q * (1 + 0.2 * Math.sin(t * 17 + 0.6))
    for (const p of drips) { const u = (t - p.t) / p.w; if (Math.abs(u) < 1) d = Math.max(d, dn * q + p.l * q * Math.sqrt(1 - u * u)) }
    const ca = Math.cos(a), sa = Math.sin(a), ru = R + up * q * (1 + 0.08 * Math.sin(t * 7)), rd = R - d
    U.push([cx + ca * ru, cy + sa * ru]); D.push([cx + ca * rd, cy + sa * rd])
  }
  return {
    cap: loopsD([[...U, ...D.slice().reverse()]]),
    shadow: loopsD([[...U.map(([x, y]) => [x, y + 0.05]), ...D.map(([x, y]) => [x, y + 0.42]).reverse()]]),
  }
}

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

const BALL = disc(12, 9.75, 7)
const NECK = 'M10.9 15.5H13.1V19.6H10.9Z'
const FOOT = rr(7.25, 19.25, 16.75, 21.6, 1.15)

export default function render() {
  const snow = crownSnow(12, 9.75, 7, Math.PI * 1.2, Math.PI * 1.8, 1.25, 0.9, [{ t: 0.3, w: 0.07, l: 0.4 }, { t: 0.72, w: 0.06, l: 0.35 }])
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 5, y1: 2.75, x2: 13, y2: 21.6, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 1.6, x2: 0, y2: 4.4, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
      ['linearGradient', { id: id(2), x1: 8.25, y1: 6, x2: 15.75, y2: 13.5, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.45), st(0.45, C.shine, 0), st(0.6, C.shadow, 0), st(1, C.shadow, 0.45)]],
      ['radialGradient', { id: id(3), cx: 11.2, cy: 8.9, r: 3.2, fx: 11.2, fy: 8.9, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.tint, 0.55), st(0.55, C.tint, 0.08), st(1, C.tint, 0)]],
    ]],
    // the stand: a pine neck behind the ball and a wide foot
    ['path', { d: NECK + FOOT, fill: C.c2, ...INK, class: 'wm-k' }],
    // the cranberry ball
    ['path', { d: BALL, fill: C.c1, ...INK, class: 'wm-k' }],
    ['path', { d: BALL + NECK + FOOT, fill: url(0), class: 'wm-shine' }],
    // the lens: a thick gold bezel around dark glass with a cool glint
    ['path', { d: disc(12, 9.75, 3.75), fill: C.c3, ...INK, class: 'wm-k' }],
    ['path', { d: disc(12, 9.75, 3.75), fill: url(2), class: 'wm-shine' }],
    ['path', { d: disc(12, 9.75, 2.2), fill: C.shadow, stroke: C.ink, 'stroke-width': 0.5, class: 'wm-k' }],
    ['path', { d: disc(12, 9.75, 2.2), fill: url(3), class: 'wm-shine' }],
    ['path', { d: disc(11.2, 8.95, 0.62) + disc(12.85, 10.6, 0.26), fill: C.shine, class: 'wm-shine' }],
    // status light
    ['path', { d: disc(12, 15.05, 0.62), fill: C.c3, stroke: C.ink, 'stroke-width': 0.35, class: 'wm-k' }],
    // snow cap and holly on the crown
    ['path', { d: snow.shadow, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: snow.cap, fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ...holly(13.4, 3.05, 1.1),
  ]
}
