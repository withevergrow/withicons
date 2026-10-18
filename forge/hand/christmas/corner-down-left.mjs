// forge/hand/christmas/corner-down-left.mjs — a bold cranberry Enter arrow drawn like the hand-drawn arrow-down: a round
// stem bending into a bar, an open round-jointed head (A, so it nudges left), snow settled along the bar's top and into
// the bend, and a gold sparkle high in the open top-left field; the generated drawing hid the head under drifts of snow.
import { C } from '../../styles/_christmas-core.mjs'

const N = 'corner-down-left'
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
const bump = (c, w, l) => t => { const q = (t - c) / w; return Math.abs(q) < 1 ? l * Math.pow(1 - q * q, 1.5) : 0 }
const sparkle = (x, y, r) => { const q = r * 0.22; return `M${P([x, y - r])}Q${P([x + q, y - q])} ${P([x + r, y])}Q${P([x + q, y + q])} ${P([x, y + r])}Q${P([x - q, y + q])} ${P([x - r, y])}Q${P([x - q, y - q])} ${P([x, y - r])}Z` }

export default function render() {
  const T = [4.25, 15], L = 5.25, h = 1.25, R = 4, O = [15.5, 11]
  const STEM = `M19.5 4V${O[1]}A${R} ${R} 0 0 1 ${O[0]} 15H${T[0]}`
  const HEAD = head(T, [-1, 0], L)
  // snow surface: the bar's top (y 13.75) from past the head, then up into the inside of the bend
  const pts = [], y = T[1] - h, ri = R - h
  for (let k = 0; k < 17; k++) pts.push([9.6 + (O[0] - 9.6) * k / 17, y, 0, -1])
  for (let k = 0; k <= 5; k++) { const g = Math.PI / 2 - (Math.PI / 2 - 0.62) * k / 5; pts.push([O[0] + ri * Math.cos(g), O[1] + ri * Math.sin(g), -Math.cos(g), -Math.sin(g)]) }
  const d1 = bump(0.3, 0.07, 0.45), d2 = bump(0.62, 0.07, 0.36)
  const s = cap(pts, 1.2, 0.5, t => d1(t) + d2(t))
  const ink = (d, cls) => ['path', { d, stroke: C.ink, 'stroke-width': 3.1, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: cls }]
  const body = (d, cls) => ['path', { d, stroke: C.c1, 'stroke-width': 1.9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: cls }]
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 4, y1: 3, x2: 12.5, y2: 21.5, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 10.6, x2: 0, y2: 14.4, gradientUnits: 'userSpaceOnUse' },
        [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    ink(STEM, 'wm-k'),
    ink(HEAD, 'wm-a'),
    body(STEM, 'wm-k'),
    body(HEAD, 'wm-a'),
    ['path', { d: STEM + HEAD, stroke: url(0), 'stroke-width': 1.9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-shine' }],
    ['path', { d: s.shadow, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: s.cap, fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: sparkle(12, 4.75, 1.45), fill: C.accent, stroke: C.ink, 'stroke-width': 0.28, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
