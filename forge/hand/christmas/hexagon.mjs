// forge/hand/christmas/hexagon.mjs — a honey-gold honeycomb cell (a hex nut with a hexagonal hole), firm ink outline,
// a snow cap draped over its two roof edges and holly at the apex. The generated drawing painted the hexagon pale
// cream, so on white it was a faint grey polygon with no subject; gold gives it the honeycomb / nut metaphor and weight.
import { C, U, num } from '../../styles/_christmas-core.mjs'
import { parsePath, resample } from '../../kernel/geom.mjs'

const N = 'hexagon'
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

const OUTER = 'M12.98 3.05L19.48 6.68A2 2 0 0 1 20.5 8.42V15.58A2 2 0 0 1 19.48 17.32L12.98 20.95A2 2 0 0 1 11.02 20.95L4.52 17.32A2 2 0 0 1 3.5 15.58V8.42A2 2 0 0 1 4.52 6.68L11.02 3.05A2 2 0 0 1 12.98 3.05Z'
const INNER = 'M12.49 7.77L15.49 9.43A1 1 0 0 1 16 10.31V13.69A1 1 0 0 1 15.49 14.57L12.49 16.23A1 1 0 0 1 11.51 16.23L8.51 14.57A1 1 0 0 1 8 13.69V10.31A1 1 0 0 1 8.51 9.43L11.51 7.77A1 1 0 0 1 12.49 7.77Z'
const ROOF = 'M4.1 7.08L4.52 6.68L11.02 3.05A2 2 0 0 1 12.98 3.05L19.48 6.68L19.9 7.08'

export default function render() {
  const sn = snowCap(ROOF, U.SNOW_UP, U.SNOW_DN, (x) => 0.8 * Math.max(0, 1 - Math.abs(x - 6.6) / 0.9) + 0.55 * Math.max(0, 1 - Math.abs(x - 17.2) / 0.8))
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 3.5, y1: 3, x2: 13.5, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 1.4, x2: 0, y2: 5.4, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
      // the cell wall's inner bevel: dark at the top inside edge, light at the bottom
      ['linearGradient', { id: id(2), x1: 0, y1: 7.6, x2: 0, y2: 16.4, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shadow, 0.55), st(0.5, C.shadow, 0), st(1, C.shine, 0.35)]],
    ]],
    ['path', { d: OUTER + INNER, fill: C.c3, 'fill-rule': 'evenodd', ...INK, class: 'wm-k' }],
    ['path', { d: OUTER + INNER, fill: url(0), 'fill-rule': 'evenodd', class: 'wm-shine' }],
    // a bevel ring just outside the hole so the cell reads as a moulded wall
    ['path', { d: 'M12.74 6.18L17.01 8.56A1.5 1.5 0 0 1 17.78 9.87V14.13A1.5 1.5 0 0 1 17.01 15.44L12.74 17.82A1.5 1.5 0 0 1 11.26 17.82L6.99 15.44A1.5 1.5 0 0 1 6.22 14.13V9.87A1.5 1.5 0 0 1 6.99 8.56L11.26 6.18A1.5 1.5 0 0 1 12.74 6.18Z' + INNER, fill: url(2), 'fill-rule': 'evenodd', class: 'wm-shine' }],
    ['path', { d: sn.shadow, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: sn.cap, fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ...holly(12, 2.55, 1.2),
    ['path', { d: sparkle(20.6, 3, 1.4), fill: C.accent, stroke: C.ink, 'stroke-width': 0.28, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
