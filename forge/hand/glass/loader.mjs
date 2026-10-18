// forge/hand/glass/loader.mjs — eight frosted glass capsules round a centre, the colour behind them fading round the
// ring from a glowing head (top, with the accent light) to a faint tail, so it reads as a spinner turning clockwise.
// The generated drawing gave every spoke the same pale frost over a thin colour rod: low contrast, no direction, and at
// 16px a grey asterisk. Layers the Glass way: soft shadow, colour rods down-right, frosted capsule panes up-left with a
// currentColor hairline, a lit rim on each capsule's top-left side.
// Motion: the whole icon spins about 12 12, so every part is the body (wm-k).
import { V, } from '../../styles/_glass-soft.mjs'
import { LIGHT } from '../../styles/_glass-core.mjs'

const f = v => +v.toFixed(2)
const lin = (id, x1, y1, x2, y2, stops) => ['linearGradient', { id, x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const rad = (id, cx, cy, r, stops) => ['radialGradient', { id, cx, cy, r, gradientUnits: 'userSpaceOnUse' }, stops]
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]

// a spoke's centreline at angle a (degrees, 0 = right, clockwise on screen) about c, from radius r0 to r1
const ends = (c, a, r0, r1) => {
  const u = [Math.cos(a * Math.PI / 180), Math.sin(a * Math.PI / 180)]
  return [[c[0] + u[0] * r0, c[1] + u[1] * r0], [c[0] + u[0] * r1, c[1] + u[1] * r1], u]
}
function capsule(c, a, r0, r1, w) {
  const [p, q, u] = ends(c, a, r0, r1), nx = u[1], ny = -u[0]
  const P = (o, s) => `${f(o[0] + nx * w * s)} ${f(o[1] + ny * w * s)}`
  return `M${P(p, 1)}L${P(q, 1)}A${f(w)} ${f(w)} 0 0 1 ${P(q, -1)}L${P(p, -1)}A${f(w)} ${f(w)} 0 0 1 ${P(p, 1)}Z`
}
// the lit rim: the part of the capsule's outline (inset) whose outward normal faces the light
function rim(c, a, r0, r1, w) {
  const [p, q, u] = ends(c, a, r0, r1), base = Math.atan2(u[1], u[0])
  const pts = []
  for (let k = 0; k < 48; k++) {
    // 0..23 round the far cap (q), 24..47 round the near cap (p): each cap's normals sweep 180 degrees
    const far = k < 24, t = (far ? k : k - 24) / 23
    const ang = base + (far ? -Math.PI / 2 + t * Math.PI : Math.PI / 2 + t * Math.PI)
    const nrm = [Math.cos(ang), Math.sin(ang)], o = far ? q : p
    pts.push({ p: [o[0] + nrm[0] * w, o[1] + nrm[1] * w], lit: nrm[0] * LIGHT[0] + nrm[1] * LIGHT[1] > 0.45 })
  }
  let s = pts.findIndex((o, i) => !o.lit && pts[(i + 1) % pts.length].lit)
  if (s < 0) return ''
  const run = []
  for (let i = 1; i <= pts.length; i++) { const o = pts[(s + i) % pts.length]; if (!o.lit) break; run.push(o.p) }
  if (run.length < 2) return ''
  return 'M' + run.map(o => `${f(o[0])} ${f(o[1])}`).join('L')
}

export default function render(icon) {
  const name = icon.name || 'loader'
  let n = 0
  const id = () => `wg-glass-${name}-${n++}`
  const defs = [], out = []
  const add = g => { defs.push(g); return `url(#${g[1].id})` }
  const C = [11.5, 11.5], B = [12.2, 12.2], S = [12.2, 12.7]
  const R0 = 5, R1 = 8.85, W = 1.45, WB = 1.22
  // head at the top, the tail fading counter-clockwise behind it (the spinner turns clockwise)
  const SPOKES = [[-90, 1], [-135, 0.86], [180, 0.74], [135, 0.64], [90, 0.56], [45, 0.49], [0, 0.44], [-45, 0.4]]
  // soft diffuse shadow
  out.push(['path', { d: SPOKES.map(([a]) => capsule(S, a, R0, R1, WB + 0.7)).join(''), fill: V.shadow, 'fill-opacity': 0.05, class: 'wm-shadow' }])
  // colour rods behind, down-right, the accent light glowing at the head
  const back = add(lin(id(), 3, 3, 22, 22, [stop(0, V.c1), stop(1, V.shadow)]))
  const orb = add(rad(id(), 10.8, 5.2, 6.2, [stop(0, V.accent, 0.75), stop(0.55, V.accent, 0.3), stop(1, V.accent, 0)]))
  const pane = add(lin(id(), 1.5, 1.5, 21.5, 21.5, [stop(0, V.frost, 0.46), stop(0.4, V.tint, 0.34), stop(1, V.tint, 0.22)]))
  for (const [a, k] of SPOKES) out.push(['path', { d: capsule(B, a, R0, R1, WB), fill: back, 'fill-opacity': k, class: 'wm-k' }])
  out.push(['path', { d: SPOKES.slice(0, 3).map(([a]) => capsule(B, a, R0, R1, WB)).join(''), fill: orb, class: 'wm-k' }])
  // frosted capsule panes, the tail's a touch fainter too
  for (const [a, k] of SPOKES) {
    out.push(['path', { d: capsule(C, a, R0, R1, W), fill: pane, 'fill-opacity': f(0.6 + 0.4 * k), stroke: 'currentColor', 'stroke-opacity': f(0.14 + 0.12 * k), 'stroke-width': 0.5, class: 'wm-k' }])
  }
  // lit rims
  out.push(['path', { d: SPOKES.map(([a]) => rim(C, a, R0, R1, W - 0.45)).join(''), fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.55, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-shine' }])
  return [['defs', {}, defs], ...out]
}
