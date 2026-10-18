// forge/hand/christmas/shield-x.mjs — a deep cranberry shield with a snow cap on its peaked top and holly, holding a
// bold snow-cream X with an ink outline: the generated shield was pale cream with a thin ink X that washed out on
// white and was too weak to read as "blocked" at 16px beside its red, pine and gold siblings.
import { C, U } from '../../styles/_christmas-core.mjs'

const r2 = v => Math.round(v * 100) / 100
const P = p => `${r2(p[0])} ${r2(p[1])}`
function smooth(pts) {
  const n = pts.length, g = i => pts[(i + n) % n]
  let d = 'M' + P(pts[0])
  for (let i = 0; i < n; i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2), t = 1 / 6
    d += 'C' + P([p1[0] + (p2[0] - p0[0]) * t, p1[1] + (p2[1] - p0[1]) * t]) + ' ' +
      P([p2[0] - (p3[0] - p1[0]) * t, p2[1] - (p3[1] - p1[1]) * t]) + ' ' + P(p2)
  }
  return d + 'Z'
}
// the style's snow drift along a run of edge samples [x, y, nx, ny] (normal points out of the object)
function cap(samples, up, dn, drip = () => 0) {
  const m = samples.length - 1, U1 = [], L1 = [], L2 = []
  samples.forEach(([x, y, nx, ny], k) => {
    const s = Math.pow(Math.sin(Math.PI * k / m), 0.55), lo = dn * s + drip(x, y) * s
    U1.push([x + nx * up * s, y + ny * up * s])
    L1.push([x - nx * lo, y - ny * lo])
    L2.push([x - nx * (lo + 0.42 * s), y - ny * (lo + 0.42 * s)])
  })
  const inner = a => a.slice(1, m)
  return { cap: smooth([...U1, ...inner(L1).reverse()]), shadow: smooth([...inner(L1), ...inner(L2).reverse()]) }
}
const disc = (cx, cy, r) => `M${r2(cx - r)} ${r2(cy)}a${r2(r)} ${r2(r)} 0 1 0 ${r2(2 * r)} 0a${r2(r)} ${r2(r)} 0 1 0 ${r2(-2 * r)} 0z`
function holly(x, y, s) {
  const leaf = dir => {
    const a = dir > 0 ? -0.32 : Math.PI + 0.32, ca = Math.cos(a), sa = Math.sin(a), L = 2.05 * s, W = 0.62 * s
    const p0 = [x + ca * 0.25 * s, y + sa * 0.25 * s], tip = [x + ca * L, y + sa * L], nx = -sa, ny = ca
    const pt = (t, side) => { const w = W * Math.sin(Math.PI * t) * (1 + 0.28 * Math.cos(t * Math.PI * 4)); return [p0[0] + (tip[0] - p0[0]) * t + nx * w * side, p0[1] + (tip[1] - p0[1]) * t + ny * w * side] }
    const pts = []
    for (let k = 0; k <= 8; k++) pts.push(pt(k / 8, 1))
    for (let k = 7; k >= 1; k--) pts.push(pt(k / 8, -1))
    return 'M' + pts.map(P).join('L') + 'Z'
  }
  const b = 0.46 * s
  return [
    ['path', { d: leaf(1) + leaf(-1), fill: C.c2, stroke: C.ink, 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: disc(x - 0.42 * s, y + 0.18 * s, b) + disc(x + 0.42 * s, y + 0.18 * s, b) + disc(x, y - 0.42 * s, b), fill: C.c1, stroke: C.ink, 'stroke-width': 0.28, class: 'wm-deco' }],
    ['path', { d: disc(x - 0.12 * s, y - 0.58 * s, 0.13 * s), fill: C.shine, class: 'wm-deco' }],
  ]
}
// the X: two crossed bars with round ends, as one outline
function cross(cx, cy, L, w) {
  const u = a => [Math.cos(a), Math.sin(a)], add = (...v) => v.reduce((s, p) => [s[0] + p[0], s[1] + p[1]], [0, 0]), k = (p, f) => [p[0] * f, p[1] * f]
  let d = ''
  for (let i = 0; i < 4; i++) {
    const t = Math.PI / 4 + i * Math.PI / 2, ut = u(t), un = u(t + Math.PI / 2), up = u(t - Math.PI / 2)
    const corner = add([cx, cy], k(up, w), k(ut, w))
    const a = add([cx, cy], k(ut, L), k(un, -w)), b = add([cx, cy], k(ut, L), k(un, w))
    d += (i ? 'L' : 'M') + P(corner) + 'L' + P(a) + `A${w} ${w} 0 0 1 ` + P(b)
  }
  return d + 'Z'
}

// the shield: peaked top with softened corners, straight flanks, a full curved point at the bottom
const SHIELD = 'M12 21.6C7.3 19.9 4.2 16.6 4.2 12V6.15Q4.2 5.42 4.88 5.16L11.32 2.62Q12 2.35 12.68 2.62L19.12 5.16Q19.8 5.42 19.8 6.15V12C19.8 16.6 16.7 19.9 12 21.6Z'

export default function render() {
  const id = n => `wg-christmas-shield-x-${n}`, url = n => `url(#${id(n)})`
  const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
  const ink = { stroke: C.ink, 'stroke-width': U.INK, 'stroke-linejoin': 'round' }
  // snow samples along the peaked top, from the left shoulder over the apex to the right shoulder
  const S0 = [4.25, 5.95], A = [12, 2.5], S1 = [19.75, 5.95]
  const len = Math.hypot(A[0] - S0[0], A[1] - S0[1]), nL = [(A[1] - S0[1]) / len, -(A[0] - S0[0]) / len]
  const pts = []
  for (let k = 0; k <= 20; k++) {
    const t = k / 20, left = t <= 0.5, f = left ? t * 2 : (t - 0.5) * 2
    const x = left ? S0[0] + (A[0] - S0[0]) * f : A[0] + (S1[0] - A[0]) * f
    const y = left ? S0[1] + (A[1] - S0[1]) * f : A[1] + (S1[1] - A[1]) * f
    // blend the two flank normals near the apex so the drift rounds over the peak
    const b = Math.max(-1, Math.min(1, (x - 12) / 0.7))
    const nx = nL[0] * (1 - b) / 2 - nL[0] * (1 + b) / 2, ny = nL[1]
    const nn = Math.hypot(nx, ny)
    pts.push([x, y, nx / nn, ny / nn])
  }
  const sn = cap(pts, 1.3, 1.45, x => 1.25 * Math.max(0, 1 - Math.abs(x - 7.3) / 1.05) + 1.0 * Math.max(0, 1 - Math.abs(x - 16.4) / 0.95))
  const X = cross(12, 12, 3.05, 1.45)
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 4.2, y1: 2.35, x2: 13, y2: 21.6, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 1.2, x2: 0, y2: 7.2, gradientUnits: 'userSpaceOnUse' },
        [st(0.25, C.shine), st(1, C.tint)]],
      ['linearGradient', { id: id(2), x1: 8.5, y1: 8.5, x2: 15.5, y2: 15.5, gradientUnits: 'userSpaceOnUse' },
        [st(0.3, C.tint, 0), st(1, C.tint, 0.75)]],
    ]],
    ['path', { d: SHIELD, fill: C.c1, ...ink, class: 'wm-k' }],
    ['path', { d: SHIELD, fill: url(0), class: 'wm-shine' }],
    ['path', { d: sn.shadow, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: sn.cap, fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ...holly(14.1, 2.55, 1.15),
    ['path', { d: X, fill: C.c4, ...ink, class: 'wm-a' }],
    ['path', { d: X, fill: url(2), class: 'wm-a' }],
  ]
}
