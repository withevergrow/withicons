// forge/hand/christmas/git-fork.mjs — one clear Y: two cranberry commit rings on top feeding a slim gold fork into a
// third ring below, with a single thin snow cap on the top-left ring only. The generated drawing put snow on both top
// nodes and thick pine connectors, which merged into a blob and hid the fork.
import { C, num } from '../../styles/_christmas-core.mjs'

const N = 'git-fork'
const id = n => `wg-christmas-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const R = 2.7, RH = 1.05
const disc = (cx, cy, r) => `M${num(cx - r)} ${num(cy)}a${r} ${r} 0 1 0 ${num(2 * r)} 0a${r} ${r} 0 1 0 ${num(-2 * r)} 0z`
const poly = P => 'M' + P.map(([x, y]) => `${num(x)} ${num(y)}`).join('L') + 'Z'
function snow(xa, xb, top, { up = 1.15, dn = 0.7, drips = [], ph = 0, maxDn = 1.3 } = {}) {
  const n = 28, U = [], L = []
  for (let i = 0; i <= n; i++) {
    const t = i / n, x = xa + (xb - xa) * t, e = Math.pow(Math.sin(Math.PI * t), 0.45)
    let d = dn * e * (1 + 0.16 * Math.sin(x * 2.1 + ph))
    for (const [cx, w, l] of drips) { const u = (x - cx) / w; if (Math.abs(u) < 1) d = Math.max(d, (dn + l * Math.sqrt(1 - u * u)) * e) }
    U.push([x, top(x) - up * e * (1 + 0.08 * Math.sin(x * 1.4 + ph))]); L.push([x, top(x) + Math.min(d, maxDn)])
  }
  return [...U, ...L.reverse().slice(1, -1)]
}

const A = [5.5, 5.75], B = [18.5, 5.75], D = [12, 18.25]
const LINES = 'M5.5 7V10A2 2 0 0 0 7.5 12H16.5A2 2 0 0 0 18.5 10V7M12 12V17'

export default function render() {
  const top = x => A[1] - Math.sqrt(Math.max(0, R * R - (x - A[0]) ** 2))
  const cap = snow(A[0] - 2, A[0] + 2, top, { drips: [[A[0] - 0.8, 0.5, 0.35]], ph: 0.7 })
  const line = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  const ring = c => disc(c[0], c[1], R) + disc(c[0], c[1], RH)
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 0, y1: 0, x2: 0.6, y2: 1 }, [st(0, C.shine, 0.4), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 2.6, x2: 0, y2: 5.9, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    ['path', { d: LINES, ...line, stroke: C.ink, 'stroke-width': 3, class: 'wm-a' }],
    ['path', { d: LINES, ...line, stroke: C.c3, 'stroke-width': 1.8, class: 'wm-a' }],
    ['path', { d: 'M7.9 11.1H16.1M11.1 12.6V16.3', ...line, stroke: C.shine, 'stroke-width': 0.45, 'stroke-opacity': 0.55, class: 'wm-shine' }],
    ['path', { d: disc(A[0], A[1], RH) + disc(B[0], B[1], RH) + disc(D[0], D[1], RH), fill: C.c4, class: 'wm-k' }],
    ['path', { d: ring(A) + ring(B) + ring(D), fill: C.c1, 'fill-rule': 'evenodd', ...INK, class: 'wm-k' }],
    ...[A, B, D].map(c => ['path', { d: ring(c), fill: url(0), 'fill-rule': 'evenodd', class: 'wm-shine' }]),
    ['path', { d: poly(cap.map(([x, y]) => [x, y + 0.38])), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: poly(cap), fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
