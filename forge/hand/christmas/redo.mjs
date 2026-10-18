// forge/hand/christmas/redo.mjs — a bold cranberry hook arrow (thick rounded shaft, broad rounded head) with one slim
// snow cap on the upper shaft: the generated drawing painted the hook pale snow cream and piled snow, holly and a
// sparkle on it, so the arrow washed out on white and the hook lost to the decoration.
import { C, U } from '../../styles/_christmas-core.mjs'

const r2 = v => Math.round(v * 100) / 100
const P = p => `${r2(p[0])} ${r2(p[1])}`
// Catmull-Rom through points -> cubic path (closed)
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
// a polygon with rounded corners (radius r, quadratic through each vertex)
function roundPoly(pts, r) {
  const n = pts.length
  let d = ''
  for (let i = 0; i < n; i++) {
    const a = pts[(i - 1 + n) % n], b = pts[i], c = pts[(i + 1) % n]
    const la = Math.hypot(a[0] - b[0], a[1] - b[1]), lc = Math.hypot(c[0] - b[0], c[1] - b[1])
    const p = [b[0] + (a[0] - b[0]) * r / la, b[1] + (a[1] - b[1]) * r / la]
    const q = [b[0] + (c[0] - b[0]) * r / lc, b[1] + (c[1] - b[1]) * r / lc]
    d += (i ? 'L' : 'M') + P(p) + 'Q' + P(b) + ' ' + P(q)
  }
  return d + 'Z'
}

// shaft: centreline M20.5 9.5 H9 A5.5 5.5 0 0 0 9 20.5 H14.5, 3.2 thick, round tail
const SHAFT = 'M15.6 7.9H9A7.1 7.1 0 0 0 1.9 15A7.1 7.1 0 0 0 9 22.1H14.5A1.6 1.6 0 0 0 14.5 18.9H9A3.9 3.9 0 0 1 5.1 15A3.9 3.9 0 0 1 9 11.1H15.6Z'
const HEAD = roundPoly([[14.4, 3.6], [21.6, 9.5], [14.4, 15.4]], 1.1)

// a slim snow cap resting on the upper shaft (y 7.9), thinning out where the shaft starts to curve
// generic cap: surface samples [x, y, nx, ny] (n points out of the object); thick in the middle, nothing at the ends
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
function snow() {
  const pts = []
  for (let k = 0; k <= 12; k++) {
    const x = 6.4 + (14.2 - 6.4) * k / 12
    if (x >= 9) pts.push([x, 7.9, 0, -1])
    else { const a = Math.asin((9 - x) / 7.1); pts.push([x, 15 - 7.1 * Math.cos(a), -Math.sin(a), -Math.cos(a)]) }
  }
  return cap(pts, 1.4, 0.85, x => 0.55 * Math.max(0, 1 - Math.abs(x - 11.7) / 0.85))
}

export default function render() {
  const id = n => `wg-christmas-redo-${n}`, url = n => `url(#${id(n)})`
  const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
  const ink = { stroke: C.ink, 'stroke-width': U.INK, 'stroke-linejoin': 'round' }
  const s = snow()
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 1.9, y1: 3.6, x2: 12.6, y2: 22.1, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 6.6, x2: 0, y2: 9.4, gradientUnits: 'userSpaceOnUse' },
        [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    ['path', { d: SHAFT, fill: C.c1, ...ink, class: 'wm-k' }],
    ['path', { d: SHAFT, fill: url(0), class: 'wm-shine' }],
    ['path', { d: s.shadow, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: s.cap, fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: HEAD, fill: C.c1, ...ink, class: 'wm-a' }],
    ['path', { d: HEAD, fill: url(0), class: 'wm-a' }],
  ]
}
