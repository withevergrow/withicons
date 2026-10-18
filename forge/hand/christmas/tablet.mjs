// forge/hand/christmas/tablet.mjs - a red upright tablet with a plain cream screen and a home pill, a small snow cap and holly on the top-left corner
import { C, U, num } from '../../styles/_christmas-core.mjs'
import { parsePath, resample } from '../../kernel/geom.mjs'

const N = 'tablet'
const id = n => `wg-christmas-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': U.INK, 'stroke-linejoin': 'round' }
const P = (a, b) => `${num(a)} ${num(b)}`
const discD = (cx, cy, r) => `M${num(cx - r)} ${num(cy)}a${num(r)} ${num(r)} 0 1 0 ${num(2 * r)} 0a${num(r)} ${num(r)} 0 1 0 ${num(-2 * r)} 0z`
const sparkle = (x, y, r) => { const q = r * 0.22; return `M${P(x, y - r)}Q${P(x + q, y - q)} ${P(x + r, y)}Q${P(x + q, y + q)} ${P(x, y + r)}Q${P(x - q, y + q)} ${P(x - r, y)}Q${P(x - q, y - q)} ${P(x, y - r)}z` }
function holly(x, y, s) {
  const leaf = dir => {
    const a = dir > 0 ? -0.32 : Math.PI + 0.32, ca = Math.cos(a), sa = Math.sin(a), L = 2.05 * s, W = 0.62 * s
    const p0 = [x + ca * 0.25 * s, y + sa * 0.25 * s], tip = [x + ca * L, y + sa * L]
    const pt = (t, side) => { const w = W * Math.sin(Math.PI * t) * (1 + 0.28 * Math.cos(t * Math.PI * 4)); return [p0[0] + (tip[0] - p0[0]) * t - sa * w * side, p0[1] + (tip[1] - p0[1]) * t + ca * w * side] }
    const pts = []
    for (let k = 0; k <= 8; k++) pts.push(pt(k / 8, 1))
    for (let k = 7; k >= 1; k--) pts.push(pt(k / 8, -1))
    return 'M' + pts.map(p => P(p[0], p[1])).join('L') + 'Z'
  }
  const b = 0.46 * s
  return [
    ['path', { d: leaf(1) + leaf(-1), fill: C.c2, stroke: C.ink, 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: discD(x - 0.42 * s, y + 0.18 * s, b) + discD(x + 0.42 * s, y + 0.18 * s, b) + discD(x, y - 0.42 * s, b), fill: C.c1, stroke: C.ink, 'stroke-width': 0.28, class: 'wm-deco' }],
    ['path', { d: discD(x - 0.12 * s, y - 0.58 * s, 0.13 * s), fill: C.shine, class: 'wm-deco' }],
  ]
}
// smooth closed curve through points (Catmull-Rom as cubics)
function smooth(pts) {
  const n = pts.length, g = i => pts[(i + n) % n], t = 1 / 6
  let d = 'M' + P(...pts[0])
  for (let i = 0; i < n; i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2)
    d += 'C' + P(p1[0] + (p2[0] - p0[0]) * t, p1[1] + (p2[1] - p0[1]) * t) + ' ' + P(p2[0] - (p3[0] - p1[0]) * t, p2[1] - (p3[1] - p1[1]) * t) + ' ' + P(...p2)
  }
  return d + 'Z'
}
// the style's snow cap along an open top edge (traversed left to right): thick in the middle, thinning to nothing at
// both ends, with soft drips; returns the cap and the faint cool shadow under it
function snowCap(edgeD, up, dn, drip = () => 0) {
  const pts = resample(parsePath(edgeD, 0.05)[0].pts, 0.45).map(o => o.p)
  const m = pts.length - 1, U1 = [], L1 = [], L2 = []
  pts.forEach((p, k) => {
    const a = pts[Math.max(0, k - 2)], b = pts[Math.min(m, k + 2)], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const nx = (b[1] - a[1]) / L, ny = -(b[0] - a[0]) / L
    const s = Math.pow(Math.max(0, Math.sin(Math.PI * k / m)), 0.55), lo = (dn + drip(p[0], p[1])) * s
    U1.push([p[0] + nx * up * s, p[1] + ny * up * s])
    L1.push([p[0] - nx * lo, p[1] - ny * lo])
    L2.push([p[0] - nx * (lo + 0.42 * s), p[1] - ny * (lo + 0.42 * s)])
  })
  const inner = a => a.slice(1, m)
  return { cap: smooth([...U1, ...inner(L1).reverse()]), shadow: smooth([...inner(L1), ...inner(L2).reverse()]) }
}


const defs = (x1, y1, x2, y2, sy0, sy1) => ['defs', {}, [
  ['linearGradient', { id: id(0), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
  ['linearGradient', { id: id(1), x1: 0, y1: sy0, x2: 0, y2: sy1, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]]]]
const snow = (edge, up, dn, drip) => { const s = snowCap(edge, up, dn, drip); return [
  ['path', { d: s.shadow, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
  ['path', { d: s.cap, fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }]] }
const spark = (x, y, r) => ['path', { d: sparkle(x, y, r), fill: C.accent, stroke: C.ink, 'stroke-width': 0.28, 'stroke-linejoin': 'round', class: 'wm-deco' }]

const BODY = 'M6.5 2.4h11A2.5 2.5 0 0 1 20 4.9v14.2a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 19.1V4.9A2.5 2.5 0 0 1 6.5 2.4z'
const SCREEN = 'M7.4 5.2h9.2a.9 .9 0 0 1 .9 .9v9.8a.9 .9 0 0 1-.9 .9H7.4a.9 .9 0 0 1-.9-.9V6.1a.9 .9 0 0 1 .9-.9z'
export default function render() {
  const s = snowCap('M4.2 5.4C4.1 3.2 5.1 2.2 7 2.2H13.2', 0.9, 1.5, (x) => (x > 7 ? 0.5 * Math.sin((x - 7) * 1.9) ** 2 : 0))
  return [
    defs(4, 2.4, 14, 21.6, 1.2, 4),
    ['path', { d: BODY, fill: C.c1, ...INK, class: 'wm-k' }],
    ['path', { d: SCREEN, fill: C.c4, ...INK, 'stroke-width': 0.5, class: 'wm-k' }],
    ['path', { d: 'M7.9 15.4L13.4 5.6h2.3L10.3 15.4z', fill: C.tint, 'fill-opacity': 0.55, class: 'wm-shine' }],
    ['path', { d: BODY, fill: url(0), class: 'wm-shine' }],
    ['path', { d: 'M10.3 19.2h3.4', stroke: C.c4, 'stroke-width': 1.3, 'stroke-linecap': 'round', class: 'wm-s' }],
    ['path', { d: s.shadow, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: s.cap, fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ...holly(15.8, 2.5, 0.85),
    spark(21, 4.2, 1.2),
  ]
}
