// forge/hand/christmas/telescope.mjs — a cranberry telescope tube with a gold objective and gold eyepiece band, a snow
// cap along its top with holly, resting on a gold pivot over a pine tripod. The generated drawing made the whole tube
// gold and the tripod candy-cane striped, so it read as a candy cane or a crossed axe rather than a telescope.
import { C, U, num } from '../../styles/_christmas-core.mjs'
import { parsePath, resample } from '../../kernel/geom.mjs'

const N = 'telescope'
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
function smooth(pts) {
  const n = pts.length, g = i => pts[(i + n) % n], t = 1 / 6
  let d = 'M' + P(...pts[0])
  for (let i = 0; i < n; i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2)
    d += 'C' + P(p1[0] + (p2[0] - p0[0]) * t, p1[1] + (p2[1] - p0[1]) * t) + ' ' + P(p2[0] - (p3[0] - p1[0]) * t, p2[1] - (p3[1] - p1[1]) * t) + ' ' + P(...p2)
  }
  return d + 'Z'
}
// the style's snow cap along an open top edge traversed left to right
function snowCap(edgeD, up, dn, drip = () => 0) {
  const pts = resample(parsePath(edgeD, 0.05)[0].pts, 0.4).map(o => o.p)
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

// the tube's own frame: u along the tube (up and to the right), v across it (down and to the right)
const AX = [2 / Math.sqrt(5), -1 / Math.sqrt(5)], AV = [1 / Math.sqrt(5), 2 / Math.sqrt(5)]
const W = (u, v) => [u * AX[0] + v * AV[0], u * AX[1] + v * AV[1]]
const Wp = (u, v) => P(...W(u, v))
// a rounded box in the tube frame (rotation keeps the arc sweep)
function box(u0, v0, u1, v1, r) {
  return `M${Wp(u0 + r, v0)}L${Wp(u1 - r, v0)}A${r} ${r} 0 0 1 ${Wp(u1, v0 + r)}L${Wp(u1, v1 - r)}A${r} ${r} 0 0 1 ${Wp(u1 - r, v1)}` +
    `L${Wp(u0 + r, v1)}A${r} ${r} 0 0 1 ${Wp(u0, v1 - r)}L${Wp(u0, v0 + r)}A${r} ${r} 0 0 1 ${Wp(u0 + r, v0)}Z`
}
function capsule(x1, y1, x2, y2, h) {
  const L = Math.hypot(x2 - x1, y2 - y1), nx = -(y2 - y1) / L * h, ny = (x2 - x1) / L * h
  return `M${P(x1 + nx, y1 + ny)}L${P(x2 + nx, y2 + ny)}A${num(h)} ${num(h)} 0 0 0 ${P(x2 - nx, y2 - ny)}L${P(x1 - nx, y1 - ny)}A${num(h)} ${num(h)} 0 0 0 ${P(x1 + nx, y1 + ny)}Z`
}

const TUBE = box(-0.2, 10.62, 9.8, 14.62, 1)        // the long body, its right end tucked under the objective
const BAND = box(1.3, 10.32, 2.6, 14.92, 0.45)      // the gold eyepiece band
const OBJ = box(9.31, 9.62, 13.81, 15.62, 1)        // the wide gold objective
const LENS = box(13.81 - 0.95, 10.42, 13.81 - 0.35, 14.82, 0.3) // the glass rim at the front
const LEGS = capsule(11.6, 13.2, 6.7, 21.1, 0.95) + capsule(12.4, 13.2, 17.3, 21.1, 0.95)
const PIVOT = discD(12, 12.2, 1.6), PIN = discD(12, 12.2, 0.55)

export default function render() {
  const top = (u0, u1, v) => `M${Wp(u0, v)}L${Wp(u1, v)}`
  const s1 = snowCap(top(0.7, 9.31, 10.62), 1.05, 0.65, x => 0.55 * Math.max(0, 1 - Math.abs(x - 6.3) / 0.8))
  const s2 = snowCap(top(9.75, 13.4, 9.62), 1.25, 0.8, x => 0.5 * Math.max(0, 1 - Math.abs(x - 16.6) / 0.6))
  const [hx, hy] = W(11.4, 8.75)
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 3, y1: 3, x2: 13, y2: 21.5, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 1.4, x2: 0, y2: 9.6, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    // tripod, pivot behind the tube
    ['path', { d: LEGS, fill: C.c2, ...INK, class: 'wm-a' }],
    ['path', { d: LEGS, fill: url(0), class: 'wm-a' }],
    ['path', { d: PIVOT, fill: C.c3, ...INK, class: 'wm-k' }],
    ['path', { d: PIVOT, fill: url(0), class: 'wm-shine' }],
    ['path', { d: PIN, fill: C.ink, class: 'wm-k' }],
    // tube
    ['path', { d: TUBE, fill: C.c1, ...INK, class: 'wm-k' }],
    ['path', { d: TUBE, fill: url(0), class: 'wm-shine' }],
    ['path', { d: BAND, fill: C.c3, ...INK, class: 'wm-k' }],
    ['path', { d: OBJ, fill: C.c3, ...INK, class: 'wm-k' }],
    ['path', { d: BAND + OBJ, fill: url(0), class: 'wm-shine' }],
    ['path', { d: LENS, fill: C.tint, stroke: C.ink, 'stroke-width': 0.4, class: 'wm-k' }],
    // a highlight along the tube
    ['path', { d: `M${Wp(3.6, 11.7)}L${Wp(7.8, 11.7)}`, stroke: C.shine, 'stroke-width': 0.6, 'stroke-linecap': 'round', 'stroke-opacity': 0.8, class: 'wm-shine' }],
    // snow
    ['path', { d: s1.shadow + s2.shadow, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: s1.cap, fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: s2.cap, fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ...holly(hx, hy, 1.05),
    ['path', { d: sparkle(4, 3.8, 1.5), fill: C.accent, stroke: C.ink, 'stroke-width': 0.28, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
