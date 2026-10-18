// forge/hand/christmas/flask-conical.mjs - an Erlenmeyer flask: pale glass with a visible neck and rim, red liquid under a level line, bubbles, snow on the rim and holly
import { C, U, num } from '../../styles/_christmas-core.mjs'
import { parsePath, resample } from '../../kernel/geom.mjs'

const N = 'flask-conical'
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

const FLASK = 'M9.5 3.4V9L4.25 18.25A1.75 1.75 0 0 0 5.75 21H18.25A1.75 1.75 0 0 0 19.75 18.25L14.5 9V3.4Z'
const LIQ = 'M6.38 14.2H17.62L19.75 18.25A1.75 1.75 0 0 1 18.25 21H5.75A1.75 1.75 0 0 1 4.25 18.25Z'
const RIM = 'M8.2 2.5H15.8A.8 .8 0 0 1 16.6 3.3V3.5A.8 .8 0 0 1 15.8 4.3H8.2A.8 .8 0 0 1 7.4 3.5V3.3A.8 .8 0 0 1 8.2 2.5Z'
export default function render() {
  const s = snowCap('M7.6 2.6C9.5 2.3 14 2.3 16.4 2.6', 1.3, 0.5, () => 0.2)
  return [
    defs(3, 2.5, 14, 21, 0.5, 2.5),
    ['path', { d: FLASK, fill: C.tint, ...INK, class: 'wm-k' }],
    ['path', { d: LIQ, fill: C.c1, class: 'wm-a' }],
    ['path', { d: 'M6.38 14.2H17.62', stroke: C.ink, 'stroke-width': 0.5, class: 'wm-k' }],
    ['path', { d: discD(9.6, 18, 0.7) + discD(13.3, 16.4, 0.5) + discD(14.6, 18.7, 0.65), fill: C.c4, 'fill-opacity': 0.85, class: 'wm-a' }],
    ['path', { d: FLASK, fill: 'none', ...INK, class: 'wm-k' }],
    ['path', { d: FLASK, fill: url(0), class: 'wm-shine' }],
    ['path', { d: 'M10.5 4.6V8.4', stroke: C.shine, 'stroke-opacity': 0.8, 'stroke-width': 0.7, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: RIM, fill: C.c3, ...INK, class: 'wm-k' }],
    ['path', { d: s.shadow, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: s.cap, fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ...holly(14.6, 2.2, 0.8),
    spark(20.6, 6, 1.3),
  ]
}
