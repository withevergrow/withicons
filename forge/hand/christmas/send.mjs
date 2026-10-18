// forge/hand/christmas/send.mjs — a paper plane with two clear faces: cranberry upper wing, cream lower wing, split by a
// strong dark ink fold from the nose to the notch; the snow is only a small cap resting on the upper wing's leading edge
// (the generated drawing's cap swallowed the whole wing and the fold vanished). Fold carries wm-a, gold sparkle on the
// tail side. House recipe: 0.6 ink outline, shared warm light, snow shine-to-tint.
import { C } from '../../styles/_christmas-core.mjs'

const n = v => Math.round(v * 100) / 100
const P2 = p => `${n(p[0])} ${n(p[1])}`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
function sparkleD(x, y, r) {
  const q = r * 0.22
  return `M${n(x)} ${n(y - r)}Q${n(x + q)} ${n(y - q)} ${n(x + r)} ${n(y)}Q${n(x + q)} ${n(y + q)} ${n(x)} ${n(y + r)}` +
    `Q${n(x - q)} ${n(y + q)} ${n(x - r)} ${n(y)}Q${n(x - q)} ${n(y - q)} ${n(x)} ${n(y - r)}Z`
}
function smooth(pts) {
  const m = pts.length, g = i => pts[(i + m) % m]
  let d = 'M' + P2(pts[0])
  for (let i = 0; i < m; i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2), t = 1 / 6
    d += 'C' + P2([p1[0] + (p2[0] - p0[0]) * t, p1[1] + (p2[1] - p0[1]) * t]) + ' ' +
      P2([p2[0] - (p3[0] - p1[0]) * t, p2[1] - (p3[1] - p1[1]) * t]) + ' ' + P2(p2)
  }
  return d + 'Z'
}

const A = [21, 3], B = [3, 10], Cn = [10.5, 13.5], D = [14, 21]
const TOP = `M${P2(A)}L${P2(B)}L${P2(Cn)}Z`
const LOW = `M${P2(A)}L${P2(Cn)}L${P2(D)}Z`
const BOTH = `M${P2(A)}L${P2(B)}L${P2(Cn)}L${P2(D)}Z`
const FOLD = `M${P2(Cn)}L20.4 3.6`

// a small cap on the leading edge B -> A (outward normal points up and left)
function cap() {
  const t0 = 0.24, t1 = 0.58, m = 9, nx = -7 / 19.31, ny = -18 / 19.31, up = 1, dn = 0.8
  const U = [], L = [], L2 = []
  for (let k = 0; k <= m; k++) {
    const u = k / m, t = t0 + (t1 - t0) * u, x = B[0] + (A[0] - B[0]) * t, y = B[1] + (A[1] - B[1]) * t
    const s = Math.pow(Math.sin(Math.PI * u), 0.55), drip = 0.55 * Math.exp(-Math.pow((u - 0.64) * 6, 2))
    const lo = (dn + drip) * s
    U.push([x + nx * up * s, y + ny * up * s])
    L.push([x - nx * lo, y - ny * lo])
    L2.push([x - nx * (lo + 0.4 * s), y - ny * (lo + 0.4 * s)])
  }
  const mid = a => a.slice(1, m)
  return { cap: smooth([...U, ...mid(L).reverse()]), shadow: smooth([...mid(L), ...mid(L2).reverse()]) }
}

export default function render(icon) {
  const name = (icon && icon.name) || 'send'
  const id = k => `wg-christmas-${name}-${k}`, url = k => `url(#${id(k)})`
  const J = { 'stroke-linejoin': 'round' }
  const s = cap()
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 3, y1: 3, x2: 13, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 4.6, x2: 0, y2: 7.6, gradientUnits: 'userSpaceOnUse' },
        [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    ['path', { d: LOW, fill: C.c4, stroke: C.ink, 'stroke-width': 0.6, ...J, class: 'wm-k' }],
    ['path', { d: TOP, fill: C.c1, stroke: C.ink, 'stroke-width': 0.6, ...J, class: 'wm-k' }],
    ['path', { d: BOTH, fill: url(0), class: 'wm-shine' }],
    ['path', { d: FOLD, stroke: C.ink, 'stroke-width': 1.1, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: s.shadow, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: s.cap, fill: url(1), stroke: C.ink, 'stroke-width': 0.42, ...J, class: 'wm-deco' }],
    ['path', { d: sparkleD(5.2, 4.3, 1.4), fill: C.accent, stroke: C.ink, 'stroke-width': 0.28, ...J, class: 'wm-deco' }],
  ]
}
