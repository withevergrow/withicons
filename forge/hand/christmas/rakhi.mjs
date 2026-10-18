// forge/hand/christmas/rakhi.mjs - a diagonal rakhi: gold scalloped medallion with a red heart-disc and cream pearl, red thread straps ending in gold beads and tassels, snow cap and a holly sprig
import { C, U, num } from '../../styles/_christmas-core.mjs'
import { parsePath, resample } from '../../kernel/geom.mjs'

const N = 'rakhi'
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

const MED0 = 'M10.47 15.7C9.51 15.93 8.77 15.91 8.11 15.89C8.09 15.23 8.07 14.49 8.3 13.53C7.46 13.01 6.95 12.48 6.5 12C6.95 11.52 7.46 10.99 8.3 10.47C8.07 9.51 8.09 8.77 8.11 8.11C8.77 8.09 9.51 8.07 10.47 8.3C10.99 7.46 11.52 6.95 12 6.5C12.48 6.95 13.01 7.46 13.53 8.3C14.49 8.07 15.23 8.09 15.89 8.11C15.91 8.77 15.93 9.51 15.7 10.47C16.54 10.99 17.05 11.52 17.5 12C17.05 12.48 16.54 13.01 15.7 13.53C15.93 14.49 15.91 15.23 15.89 15.89C15.23 15.91 14.49 15.93 13.53 15.7C13.01 16.54 12.48 17.05 12 17.5C11.52 17.05 10.99 16.54 10.47 15.7Z'
const MED = MED0.replace(/(-?[\d.]+) (-?[\d.]+)/g, (_, x, y) => `${num(12 + (x - 12) * 1.14)} ${num(12 + (y - 12) * 1.14)}`)
const STRAP1 = 'M8.3 13.53L5.09 16.75L7.25 18.91L10.47 15.7Z'
const STRAP2 = 'M15.7 10.47L18.91 7.25L16.75 5.09L13.53 8.3Z'
// one gold bead and a single teardrop tassel per strap end
const tassel = (x, y, dx, dy) => {
  const k = Math.SQRT1_2, ux = dx * k, uy = dy * k, bx = x + ux * 1, by = y + uy * 1, tx = x + ux * 4.3, ty = y + uy * 4.3, nx = -uy * 1.1, ny = ux * 1.1
  return [
    ['path', { d: `M${P(bx, by)}C${P(bx + nx, by + ny)} ${P(tx + nx * 0.8, ty + ny * 0.8)} ${P(tx, ty)}C${P(tx - nx * 0.8, ty - ny * 0.8)} ${P(bx - nx, by - ny)} ${P(bx, by)}Z`, fill: C.c3, ...INK, 'stroke-width': 0.55, class: 'wm-a' }],
    ['path', { d: discD(bx, by, 1), fill: C.c3, ...INK, 'stroke-width': 0.55, class: 'wm-a' }],
  ]
}
export default function render() {
  const snow = snowCap('M7.8 7.8C9 6.5 10.4 5.9 12 5.9C13.6 5.9 15 6.5 16.2 7.8', 0.5, 1.3, () => 0.25)
  return [
    defs(5, 4, 19, 20, 5, 8),
    ...tassel(6.17, 17.83, -1, 1),
    ...tassel(17.83, 6.17, 1, -1),
    ['path', { d: STRAP1, fill: C.c1, ...INK, class: 'wm-k' }],
    ['path', { d: STRAP2, fill: C.c1, ...INK, class: 'wm-k' }],
    ['path', { d: MED, fill: C.c3, ...INK, class: 'wm-k' }],
    ['path', { d: MED, fill: url(0), class: 'wm-shine' }],
    ['path', { d: discD(12, 12, 3.7), fill: C.c1, ...INK, 'stroke-width': 0.5, class: 'wm-k' }],
    ['path', { d: discD(12, 12, 1.65), fill: C.c4, ...INK, 'stroke-width': 0.45, class: 'wm-s' }],
    ['path', { d: snow.shadow, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: snow.cap, fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
