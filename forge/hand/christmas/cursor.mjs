// forge/hand/christmas/cursor.mjs — the pointer arrow in pine with a candy-cane tail stub (cream, two cranberry bands)
// poking out of its notch, a lighter left facet and a snow cap along the upper slope: arrow + tail = a pointer, not a
// plain green wedge. House recipe: 0.6 ink outline, warm light upper left, snow (shine to tint) with a cool shadow.
import { C } from '../../styles/_christmas-core.mjs'

const n = v => Math.round(v * 100) / 100
const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]

// polygon with a corner radius per vertex
function rpoly(pts) {
  const m = pts.length
  let d = ''
  for (let i = 0; i < m; i++) {
    const [x, y, r] = pts[i], [px, py] = pts[(i + m - 1) % m], [nx, ny] = pts[(i + 1) % m]
    const a = Math.hypot(px - x, py - y), b = Math.hypot(nx - x, ny - y)
    const p1 = [x + (px - x) / a * r, y + (py - y) / a * r], p2 = [x + (nx - x) / b * r, y + (ny - y) / b * r]
    d += (i ? 'L' : 'M') + `${n(p1[0])} ${n(p1[1])}Q${n(x)} ${n(y)} ${n(p2[0])} ${n(p2[1])}`
  }
  return d + 'Z'
}
// closed smooth curve through points (Catmull-Rom to cubic)
function smooth(P) {
  const m = P.length
  let d = `M${n(P[0][0])} ${n(P[0][1])}`
  for (let i = 0; i < m; i++) {
    const p0 = P[(i + m - 1) % m], p1 = P[i], p2 = P[(i + 1) % m], p3 = P[(i + 2) % m]
    d += `C${n(p1[0] + (p2[0] - p0[0]) / 6)} ${n(p1[1] + (p2[1] - p0[1]) / 6)} ${n(p2[0] - (p3[0] - p1[0]) / 6)} ${n(p2[1] - (p3[1] - p1[1]) / 6)} ${n(p2[0])} ${n(p2[1])}`
  }
  return d + 'Z'
}

const T = [5.5, 2.6], L = [5.5, 18.6], N = [9.4, 15.3], R = [17.7, 14.5]
const HEAD = rpoly([[...T, 1.0], [...L, 1.0], [...N, 0.9], [...R, 1.1]])
const FACET = rpoly([[6.15, 5.6, 0.4], [6.15, 16.4, 0.4], [8.4, 14.5, 0.4]])

// candy tail: a capsule leaving the notch, down and to the right
const S = [10.6, 14.4], E = [13.9, 20.2], W = 1.35
const len = Math.hypot(E[0] - S[0], E[1] - S[1]), u = [(E[0] - S[0]) / len, (E[1] - S[1]) / len], nv = [u[1], -u[0]]
const at = (t, w) => [S[0] + u[0] * t + nv[0] * w, S[1] + u[1] * t + nv[1] * w]
const pt = (t, w) => { const p = at(t, w); return `${n(p[0])} ${n(p[1])}` }
const TAIL = `M${pt(0, W)}L${pt(len, W)}A${W} ${W} 0 0 1 ${pt(len, -W)}L${pt(0, -W)}Z`
const band = (a, b) => `M${pt(a, 1.15)}L${pt(b, 1.15)}L${pt(b, -1.15)}L${pt(a, -1.15)}Z`
const BANDS = band(2.0, 3.0) + band(4.0, 5.0) + `M${pt(6.0, 1.1)}L${pt(len, 1.15)}A1.15 1.15 0 0 1 ${pt(len, -1.15)}L${pt(6.0, -1.1)}Z`

// snow along the upper slope T -> R
const dx = R[0] - T[0], dy = R[1] - T[1], dl = Math.hypot(dx, dy), ed = [dx / dl, dy / dl], on = [ed[1], -ed[0]]
const along = (s, w) => [T[0] + ed[0] * dl * s + on[0] * w, T[1] + ed[1] * dl * s + on[1] * w]
const SS = [0.12, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.88]
const thick = [0.7, 1.4, 1.65, 1.3, 1.6, 1.25, 1.5, 1.2, 0.65]
const SNOWP = [...SS.map(s => along(s, 0.28)), ...SS.map((s, i) => along(s, 0.28 - thick[i])).reverse()]
const SNOW = smooth(SNOWP)
const SNOWSH = smooth(SNOWP.map(p => [p[0] + 0.12, p[1] + 0.42]))

export default function render(icon) {
  const name = icon.name || 'cursor'
  const id = k => `wg-christmas-${name}-${k}`, url = k => `url(#${id(k)})`
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 5, y1: 2.6, x2: 13.2, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 2, x2: 0, y2: 12, gradientUnits: 'userSpaceOnUse' },
        [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    ['path', { d: TAIL, fill: C.c4, ...INK, class: 'wm-a' }],
    ['path', { d: BANDS, fill: C.c1, class: 'wm-a' }],
    ['path', { d: HEAD, fill: C.c2, ...INK, class: 'wm-k' }],
    ['path', { d: FACET, fill: C.shine, 'fill-opacity': 0.2, class: 'wm-shine' }],
    ['path', { d: HEAD, fill: url(0), class: 'wm-shine' }],
    ['path', { d: SNOWSH, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: SNOW, fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
