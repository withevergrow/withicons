// forge/hand/glass/pause.mjs — two upright frosted glass bars, each its own pane over its own colour body, straight and
// square-shouldered. The generated drawing frosted the colour almost to white and set the colour bodies so far off that
// each bar read as a doubled outline; here the bodies sit the Glass distance down-right and glow a clearer violet, so
// the two bars read as one solid "pause" at 24/16px. Layers the Glass way: soft shadow, colour bodies with an accent
// orb, frosted panes up-left with a currentColor hairline, a lit rim on each top-left edge.
// Motion: both bars are the body (wm-k); the whole icon pulses.
import { V } from '../../styles/_glass-soft.mjs'

const f = v => +v.toFixed(2)
const rr = (x, y, w, h, r) => `M${f(x + r)} ${f(y)}H${f(x + w - r)}A${f(r)} ${f(r)} 0 0 1 ${f(x + w)} ${f(y + r)}V${f(y + h - r)}A${f(r)} ${f(r)} 0 0 1 ${f(x + w - r)} ${f(y + h)}H${f(x + r)}A${f(r)} ${f(r)} 0 0 1 ${f(x)} ${f(y + h - r)}V${f(y + r)}A${f(r)} ${f(r)} 0 0 1 ${f(x + r)} ${f(y)}Z`
// grow (d > 0) or shrink a rounded rect about its centre, then move it
const grow = ([x, y, w, h, r], d, dx = 0, dy = 0) => rr(x - d + dx, y - d + dy, w + 2 * d, h + 2 * d, Math.max(0.3, r + d))
const lin = (id, x1, y1, x2, y2, stops) => ['linearGradient', { id, x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const rad = (id, cx, cy, r, stops) => ['radialGradient', { id, cx, cy, r, gradientUnits: 'userSpaceOnUse' }, stops]
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
// the lit rim: up the left side, round the top-left corner, along the top
const rim = ([x, y, w, h, r]) => {
  const i = 0.5, X = x + i, Y = y + i, R = r - i
  return `M${f(X)} ${f(Y + h * 0.55)}V${f(Y + R)}A${f(R)} ${f(R)} 0 0 1 ${f(X + R)} ${f(Y)}H${f(x + w * 0.62)}`
}

export default function render(icon) {
  const name = icon.name || 'pause'
  let n = 0
  const id = () => `wg-glass-${name}-${n++}`
  const defs = [], out = []
  const add = g => { defs.push(g); return `url(#${g[1].id})` }
  const L = [3.9, 3.3, 6, 16.4, 2], R = [13.1, 3.3, 6, 16.4, 2]
  // soft diffuse shadow under both colour bodies
  out.push(['path', { d: grow(L, 0.55, 1, 1.5) + grow(R, 0.55, 1, 1.5), fill: V.shadow, 'fill-opacity': 0.06, class: 'wm-shadow' }])
  out.push(['path', { d: grow(L, 0, 1, 1.5) + grow(R, 0, 1, 1.5), fill: V.shadow, 'fill-opacity': 0.09, class: 'wm-shadow' }])
  // colour bodies behind, down-right, with one accent orb
  const back = add(lin(id(), 5, 4, 21, 22, [stop(0, V.c1), stop(1, V.shadow)]))
  const orb = add(rad(id(), 16.6, 16.8, 7.5, [stop(0, V.accent, 0.62), stop(0.5, V.accent, 0.24), stop(1, V.accent, 0)]))
  const backs = grow(L, -0.35, 0.9, 0.9) + grow(R, -0.35, 0.9, 0.9)
  out.push(['path', { d: backs, fill: back, class: 'wm-k' }], ['path', { d: backs, fill: orb, class: 'wm-k' }])
  // frosted panes, a little clearer than the default so the colour reads
  const pane = add(lin(id(), 3.9, 3.3, 19.1, 19.7, [stop(0, V.frost, 0.55), stop(0.4, V.tint, 0.46), stop(1, V.tint, 0.32)]))
  const edge = { stroke: 'currentColor', 'stroke-opacity': 0.24, 'stroke-width': 0.5 }
  out.push(['path', { d: rr(...L), fill: pane, ...edge, class: 'wm-k' }])
  out.push(['path', { d: rr(...R), fill: pane, ...edge, class: 'wm-k' }])
  // lit rims
  out.push(['path', { d: rim(L) + rim(R), fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-shine' }])
  return [['defs', {}, defs], ...out]
}
