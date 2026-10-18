// forge/hand/christmas/broom.mjs - a diagonal broom: green handle to the upper right, red binding band, gold bristle fan to the lower left with bristle lines, a holly sprig and a sparkle
import { C, U, num } from '../../styles/_christmas-core.mjs'
import { parsePath, resample } from '../../kernel/geom.mjs'

const N = 'broom'
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

const HEAD = 'M13.25 8.25L15.75 10.75C14.25 12.25 12 18.5 9.75 21.75Q4 20 2.25 14.25C5.5 12 11.75 9.75 13.25 8.25Z'
const k = 0.7071
// rounded rectangle along the broom axis (direction down-left): centre, half length along the axis, half width across it
function band(cx, cy, hl, hw, r) {
  const a = [-k, k], p = [k, k]
  const at = (u, v) => P(cx + a[0] * u + p[0] * v, cy + a[1] * u + p[1] * v)
  return `M${at(-hl + r, -hw)}L${at(hl - r, -hw)}Q${at(hl, -hw)} ${at(hl, -hw + r)}L${at(hl, hw - r)}Q${at(hl, hw)} ${at(hl - r, hw)}L${at(-hl + r, hw)}Q${at(-hl, hw)} ${at(-hl, hw - r)}L${at(-hl, -hw + r)}Q${at(-hl, -hw)} ${at(-hl + r, -hw)}Z`
}
export default function render() {
  const BAND = band(13.55, 10.45, 1.4, 2.7, 0.55)
  const HANDLE = 'M20.5 3.5L14.6 9.4'
  return [
    defs(2, 8, 16, 22, 0, 1),
    ['path', { d: HANDLE, stroke: C.ink, 'stroke-width': 2.7, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: HANDLE, stroke: C.c2, 'stroke-width': 1.5, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: HEAD, fill: C.c3, ...INK, class: 'wm-k' }],
    ['path', { d: HEAD, fill: url(0), class: 'wm-shine' }],
    ['path', { d: 'M12.3 12.1L8.6 19.9M10.6 11.2L5.4 18.4M9.2 10.7L3.9 15.9M13.5 13.1L10.9 20.1', stroke: C.ink, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: BAND, fill: C.c1, ...INK, class: 'wm-k' }],
    ['path', { d: 'M12.2 9.1L14.7 11.6', stroke: C.c4, 'stroke-width': 0.5, 'stroke-linecap': 'round', 'stroke-opacity': 0.8, class: 'wm-deco' }],
    ...holly(11.6, 8.6, 1),
    spark(5.2, 5.8, 1.3),
  ]
}
