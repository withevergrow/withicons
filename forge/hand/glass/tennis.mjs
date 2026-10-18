// forge/hand/glass/tennis.mjs — a tennis racket tilted 45 degrees with a bold frosted frame, a crisp white string grid on saturated violet glass, a short grip, and a pink glass ball with its seam. The generated racket had faint strings, no ball and a handle as long as the head. Motion: racket wm-k, ball wm-a.
import { V } from '../../styles/_glass-soft.mjs'

const f = v => +v.toFixed(2)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const lin = (id, x1, y1, x2, y2, stops) => ['linearGradient', { id, x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const rad = (id, cx, cy, r, stops) => ['radialGradient', { id, cx, cy, r, gradientUnits: 'userSpaceOnUse' }, stops]
const disc = (x, y, r) => `M${f(x - r)} ${f(y)}A${r} ${r} 0 1 0 ${f(x + r)} ${f(y)}A${r} ${r} 0 1 0 ${f(x - r)} ${f(y)}Z`

// racket frame: local axis u runs along the handle (down-right), v across it
const K = Math.SQRT1_2
const CX = 8.9, CY = 8.9, RU = 6.7, RV = 5.7, T = 1.7
const P = (u, v, dx = 0, dy = 0) => [CX + dx + u * K - v * K, CY + dy + u * K + v * K]
const pt = ([x, y]) => `${f(x)} ${f(y)}`
const ell = (ru, rv, dx = 0, dy = 0) => `M${pt(P(-ru, 0, dx, dy))}A${f(ru)} ${f(rv)} 45 0 1 ${pt(P(ru, 0, dx, dy))}A${f(ru)} ${f(rv)} 45 0 1 ${pt(P(-ru, 0, dx, dy))}Z`
const grip = (dx = 0, dy = 0) => `M${pt(P(5.7, -2.7, dx, dy))}L${pt(P(8.2, -1.4, dx, dy))}L${pt(P(13, -1.4, dx, dy))}A1.4 1.4 0 0 1 ${pt(P(13, 1.4, dx, dy))}L${pt(P(8.2, 1.4, dx, dy))}L${pt(P(5.7, 2.7, dx, dy))}Z`

export default function render(icon) {
  const name = (icon && icon.name) || 'tennis'
  let n = 0
  const defs = [], add = g => { defs.push(g); return `url(#${g[1].id})` }
  const id = () => `wg-glass-${name}-${n++}`
  const edge = { stroke: 'currentColor', 'stroke-opacity': 0.22, 'stroke-width': 0.5, 'stroke-linejoin': 'round' }
  const back = add(lin(id(), 3, 3, 20, 20, [stop(0, V.c1), stop(1, V.shadow)]))
  const glow = add(rad(id(), 13, 13, 7.5, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]))
  const pane = add(lin(id(), 2, 2, 16, 16, [stop(0, V.frost, 0.9), stop(0.4, V.tint, 0.8), stop(1, V.tint, 0.66)]))
  const gripP = add(lin(id(), 10, 10, 20, 20, [stop(0, V.frost, 0.4), stop(1, V.tint, 0.14)]))
  const ballG = add(lin(id(), 15, 2.5, 21.5, 8.5, [stop(0, V.frost, 0.9), stop(0.4, V.accent, 0.95), stop(1, V.accent, 1)]))
  // string grid, clipped to the inner opening
  const RUi = RU - T, RVi = RV - T
  const strings = []
  for (const v of [-2, 2]) { const h = RUi * Math.sqrt(1 - (v / RVi) ** 2) - 0.2; strings.push(`M${pt(P(-h, v))}L${pt(P(h, v))}`) }
  for (const u of [-2.2, 1.2]) { const h = RVi * Math.sqrt(1 - (u / RUi) ** 2) - 0.2; strings.push(`M${pt(P(u, -h))}L${pt(P(u, h))}`) }
  const BX = 18.3, BY = 5.7, BR = 3.2
  return [['defs', {}, defs],
    ['path', { d: ell(RU, RV, 0.9, 1), fill: V.shadow, 'fill-opacity': 0.06, class: 'wm-shadow' }],
    ['path', { d: grip(0.8, 0.9), fill: V.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }],
    ['path', { d: ell(RU, RV, 0.6, 0.7), fill: back, class: 'wm-k' }],
    ['path', { d: ell(RU, RV, 0.6, 0.7), fill: glow, class: 'wm-k' }],
    ['path', { d: grip(0.4, 0.45), fill: back, class: 'wm-k' }],
    ['path', { d: grip(), fill: gripP, ...edge, class: 'wm-k' }],
    ['path', { d: `M${pt(P(9.9, -1.3))}L${pt(P(9.9, 1.3))}M${pt(P(11.5, -1.3))}L${pt(P(11.5, 1.3))}`, fill: 'none', stroke: V.shine, 'stroke-opacity': 0.7, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: strings.join(''), fill: 'none', stroke: V.frost, 'stroke-opacity': 0.9, 'stroke-width': 0.75, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: ell(RU, RV) + ell(RUi, RVi), fill: pane, ...edge, 'fill-rule': 'evenodd', class: 'wm-k' }],
    ['path', { d: `M${pt(P(-RU + 0.5, -0.9))}A${f(RU - 0.5)} ${f(RV - 0.5)} 45 0 1 ${pt(P(-1.5, -RV + 0.5))}`, fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.55, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: disc(BX + 0.5, BY + 0.7, BR), fill: V.shadow, 'fill-opacity': 0.2, class: 'wm-shadow' }],
    ['path', { d: disc(BX, BY, BR), fill: ballG, stroke: 'currentColor', 'stroke-opacity': 0.26, 'stroke-width': 0.5, class: 'wm-a' }],
    ['path', { d: `M${f(BX - 2.2)} ${f(BY - 2.3)}Q${f(BX - 0.6)} ${f(BY)} ${f(BX - 2.2)} ${f(BY + 2.3)}M${f(BX + 2.2)} ${f(BY - 2.3)}Q${f(BX + 0.6)} ${f(BY)} ${f(BX + 2.2)} ${f(BY + 2.3)}`, fill: 'none', stroke: V.frost, 'stroke-opacity': 0.95, 'stroke-width': 0.7, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: `M${f(BX - 1.9)} ${f(BY - 1.9)}A2.8 2.8 0 0 1 ${f(BX + 0.2)} ${f(BY - 2.9)}`, fill: 'none', stroke: V.shine, 'stroke-opacity': 0.85, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-shine' }],
  ]
}
