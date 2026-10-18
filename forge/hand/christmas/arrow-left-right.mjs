// forge/hand/christmas/arrow-left-right.mjs — a cranberry double arrow drawn like the hand-drawn arrow-down: one round
// bar with two open round-jointed heads (A, so they pulse), a slim snow cap on the bar and a gold sparkle in the free
// corner; the generated drawing painted it snow cream with filled snow-capped heads, so it washed out to a pale H/bone.
import { C } from '../../styles/_christmas-core.mjs'

const N = 'arrow-left-right'
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
  const TL = [3.25, 12], TR = [20.75, 12], L = 5.5
  const BAR = `M${P(TL)}H${TR[0]}`
  const HEADS = head(TL, [-1, 0], L) + head(TR, [1, 0], L)
  // snow on the bar's flat top (y 10.75), between the two heads
  const pts = []
  for (let k = 0; k <= 20; k++) pts.push([8.1 + (15.9 - 8.1) * k / 20, 10.75, 0, -1])
  const d1 = bump(0.32, 0.085, 0.55), d2 = bump(0.69, 0.07, 0.38)
  const s = cap(pts, 1.2, 0.5, t => d1(t) + d2(t))
  const ink = (d, cls) => ['path', { d, stroke: C.ink, 'stroke-width': 3.1, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: cls }]
  const body = (d, cls) => ['path', { d, stroke: C.c1, 'stroke-width': 1.9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: cls }]
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 4, y1: 5, x2: 11, y2: 20.5, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 9.4, x2: 0, y2: 11.6, gradientUnits: 'userSpaceOnUse' },
        [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    ink(BAR, 'wm-k'),
    ink(HEADS, 'wm-a'),
    body(BAR, 'wm-k'),
    body(HEADS, 'wm-a'),
    ['path', { d: BAR + HEADS, stroke: url(0), 'stroke-width': 1.9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-shine' }],
    ['path', { d: s.shadow, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: s.cap, fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: sparkle(19.9, 4.4, 1.45), fill: C.accent, stroke: C.ink, 'stroke-width': 0.28, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
