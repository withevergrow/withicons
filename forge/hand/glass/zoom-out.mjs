// forge/hand/glass/zoom-out.mjs — a glass magnifier with a bold etched minus. The generated lens was a near-white
// frosted disc over a slim colour body and its minus a 0.7u hairline etch, so at 16px the lens washed out and the
// minus vanished (a plain search). Here the lens is a full disc of colour glass behind a thinner frosted face (a deeper
// tint, like the style's tiles), the handle a colour-glass rod tucked under it, and the minus a 1.6u etch-ink bar.
// Motion: lens wm-k, handle and minus wm-a (parts.A pops about the lens centre 10.5 10.5).
import { V } from '../../styles/_glass-soft.mjs'

const f = v => +v.toFixed(2)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const lin = (id, x1, y1, x2, y2, stops) => ['linearGradient', { id, x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const rad = (id, cx, cy, r, stops) => ['radialGradient', { id, cx, cy, r, gradientUnits: 'userSpaceOnUse' }, stops]
const disc = (x, y, r) => `M${f(x - r)} ${f(y)}A${r} ${r} 0 1 0 ${f(x + r)} ${f(y)}A${r} ${r} 0 1 0 ${f(x - r)} ${f(y)}Z`
// capsule from p to q, half-width h, moved by (dx, dy)
const capsule = (p, q, h, dx = 0, dy = 0) => {
  const L = Math.hypot(q[0] - p[0], q[1] - p[1]), ux = (q[0] - p[0]) / L, uy = (q[1] - p[1]) / L
  const nx = uy * h, ny = -ux * h, P = (x, y) => `${f(x + dx)} ${f(y + dy)}`
  return `M${P(p[0] + nx, p[1] + ny)}L${P(q[0] + nx, q[1] + ny)}A${h} ${h} 0 0 1 ${P(q[0] - nx, q[1] - ny)}L${P(p[0] - nx, p[1] - ny)}A${h} ${h} 0 0 1 ${P(p[0] + nx, p[1] + ny)}Z`
}

export default function render(icon) {
  const name = (icon && icon.name) || 'zoom-out'
  let n = 0
  const defs = [], add = g => { defs.push(g); return `url(#${g[1].id})` }
  const id = () => `wg-glass-${name}-${n++}`
  const edge = { stroke: 'currentColor', 'stroke-opacity': 0.22, 'stroke-width': 0.5 }
  const P1 = [15.4, 15.4], P2 = [20.15, 20.15], HH = 1.55
  const back = add(lin(id(), 3, 3, 21, 21, [stop(0, V.c1), stop(1, V.shadow)]))
  const glow = add(rad(id(), 13.6, 13.8, 7, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]))
  const pane = add(lin(id(), 2.5, 2.5, 18, 18, [stop(0, V.frost, 0.62), stop(0.4, V.tint, 0.4), stop(1, V.tint, 0.24)]))
  const rod = add(lin(id(), 14.5, 14.5, 20.5, 20.5, [stop(0, V.frost, 0.55), stop(0.5, V.tint, 0.36), stop(1, V.tint, 0.22)]))
  return [['defs', {}, defs],
    // soft diffuse shadow under lens and handle
    ['path', { d: disc(10.9, 11.6, 8.1) + capsule(P1, P2, HH + 0.2, 0.35, 1), fill: V.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }],
    // handle: colour glass rod behind a frosted face, tucked under the lens
    ['path', { d: capsule(P1, P2, HH - 0.1, 0.35, 0.35), fill: back, class: 'wm-a' }],
    ['path', { d: capsule(P1, P2, HH, -0.2, -0.2), fill: rod, ...edge, class: 'wm-a' }],
    ['path', { d: 'M16.75 15.2L20.1 18.55', fill: 'none', stroke: V.shine, 'stroke-opacity': 0.85, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-a' }],
    // lens: a full disc of colour glass with the accent orb, a frosted face in front, a light rim top-left
    ['path', { d: disc(10.85, 10.85, 7.45), fill: back, class: 'wm-k' }],
    ['path', { d: disc(10.85, 10.85, 7.45), fill: glow, class: 'wm-k' }],
    ['path', { d: disc(10.25, 10.25, 7.75), fill: pane, stroke: 'currentColor', 'stroke-opacity': 0.26, 'stroke-width': 0.5, class: 'wm-k' }],
    ['path', { d: 'M3.42 9.16A6.9 6.9 0 0 1 9.16 3.42', fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-shine' }],
    // the minus: a bold etch-ink bar on the glass
    ['path', { d: 'M7.1 10.25H13.4', fill: 'none', stroke: V.etch, 'stroke-opacity': 0.92, 'stroke-width': 1.6, 'stroke-linecap': 'round', class: 'wm-a' }],
  ]
}
