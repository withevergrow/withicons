// forge/hand/christmas/chevrons-up.mjs — two bold round-jointed chevrons drawn like the hand-drawn arrow-down: the leading
// upper one (K) in cranberry with a snow cap draped over its peak like a roof, the trailing one (A) in pine, set 7.5 apart
// so the paper gap holds at 16px; the generated pair was snow cream and read as a pale grey smudge on white.
import { C } from '../../styles/_christmas-core.mjs'

const N = 'chevrons-up'
const r2 = v => Math.round(v * 100) / 100
const P = p => `${r2(p[0])} ${r2(p[1])}`
const S2 = Math.SQRT1_2
const id = n => `wg-christmas-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
// local frame of a head: a runs along the axis towards the tip T, b across it
const frame = (T, u) => (a, b) => [T[0] + a * u[0] + b * u[1], T[1] + a * u[1] - b * u[0]]
const head = (T, u, L) => { const f = frame(T, u); return `M${P(f(-L, L))}L${P(T)}L${P(f(-L, -L))}` }

// Catmull-Rom through points -> closed cubic path
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
// a snow cap on surface samples [x, y, nx, ny] (n points out of the body): full in the middle, nothing at the ends
function cap(samples, up, dn, drip = () => 0) {
  const m = samples.length - 1, U1 = [], L1 = [], L2 = []
  samples.forEach(([x, y, nx, ny], k) => {
    const t = k / m, s = Math.pow(Math.sin(Math.PI * t), 0.55), lo = (dn + drip(t)) * s, w = 1 + 0.07 * Math.sin(t * 9)
    U1.push([x + nx * up * s * w, y + ny * up * s * w])
    L1.push([x - nx * lo, y - ny * lo])
    L2.push([x - nx * (lo + 0.42 * s), y - ny * (lo + 0.42 * s)])
  })
  const inner = a => a.slice(1, m)
  return { cap: smooth([...U1, ...inner(L1).reverse()]), shadow: smooth([...inner(L1), ...inner(L2).reverse()]) }
}
// the outside surface of a round-jointed head (edge 1.25 off the centreline): down one arm, round the tip, up the other
function roof(T, u, L, s0, h = 1.25) {
  const f = frame(T, u), dir = (a, b) => { const p = f(a, b); return [p[0] - T[0], p[1] - T[1]] }, out = []
  const run = (A, B, n, t0, t1, end) => {
    const m = Math.max(2, Math.round(Math.hypot(B[0] - A[0], B[1] - A[1]) * Math.abs(t1 - t0) / 0.4))
    for (let i = 0; i < m + (end ? 1 : 0); i++) { const t = t0 + (t1 - t0) * i / m; out.push([A[0] + (B[0] - A[0]) * t + n[0] * h, A[1] + (B[1] - A[1]) * t + n[1] * h, n[0], n[1]]) }
  }
  run(f(-L, L), T, dir(S2, S2), s0, 1)
  for (let i = 1; i < 6; i++) { const g = Math.PI / 4 - Math.PI / 2 * i / 6, n = dir(Math.cos(g), Math.sin(g)); out.push([T[0] + n[0] * h, T[1] + n[1] * h, n[0], n[1]]) }
  run(T, f(-L, -L), dir(S2, -S2), 0, 1 - s0, true)
  return out
}
const bump = (c, w, l) => t => { const q = (t - c) / w; return Math.abs(q) < 1 ? l * Math.pow(1 - q * q, 1.5) : 0 }

export default function render() {
  const TK = [12, 5.25], TA = [12, 12.75], U = [0, -1], L = 6
  const K = head(TK, U, L), A = head(TA, U, L)
  const d1 = bump(0.22, 0.07, 0.42), d2 = bump(0.72, 0.08, 0.5)
  const s = cap(roof(TK, U, L, 0.34), 1.15, 0.5, t => d1(t) + d2(t))
  const ink = (d, cls) => ['path', { d, stroke: C.ink, 'stroke-width': 3.1, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: cls }]
  const body = (d, c, cls) => ['path', { d, stroke: c, 'stroke-width': 1.9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: cls }]
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 5, y1: 3.5, x2: 12.5, y2: 20.5, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 2.8, x2: 0, y2: 9.6, gradientUnits: 'userSpaceOnUse' },
        [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    ink(A, 'wm-a'),
    body(A, C.c2, 'wm-a'),
    ['path', { d: A, stroke: url(0), 'stroke-width': 1.9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a wm-shine' }],
    ink(K, 'wm-k'),
    body(K, C.c1, 'wm-k'),
    ['path', { d: K, stroke: url(0), 'stroke-width': 1.9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-shine' }],
    ['path', { d: s.shadow, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: s.cap, fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
