// forge/hand/glass/drag-handle.mjs — a 2 x 3 grip of six equal glass beads. The generated dots were small pale
// frosted pebbles whose colour sat in a thin crescent behind them, so the grip dissolved into grey at 16px. Here each
// bead is a fixed 2.1u disc of colour glass (back -> shadow, a soft accent orb) seen through a thin frosted face with
// the style's hairline and a light rim on the lit top-left, so all six read as one even, deeper-toned grip.
// Every bead shares objectBoundingBox gradients, so the six are identical (no top-to-bottom drift).
import { V } from '../../styles/_glass-soft.mjs'

const f = v => +v.toFixed(2)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
// arc on a circle from angle a0 to a1 (degrees, screen coordinates: 0 = right, 90 = down)
const arc = (cx, cy, r, a0, a1) => {
  const p = a => [f(cx + r * Math.cos(a * Math.PI / 180)), f(cy + r * Math.sin(a * Math.PI / 180))]
  const [x0, y0] = p(a0), [x1, y1] = p(a1)
  return `M${x0} ${y0}A${r} ${r} 0 0 1 ${x1} ${y1}`
}

const XS = [8.5, 15.5], YS = [5, 12, 19], R = 2.1
const AT = YS.flatMap(y => XS.map(x => [x, y]))

export default function render(icon) {
  const name = (icon && icon.name) || 'drag-handle'
  const id = n => `wg-glass-${name}-${n}`
  const defs = [
    ['linearGradient', { id: id(0), x1: 0, y1: 0, x2: 1, y2: 1 }, [stop(0, V.c1), stop(1, V.shadow)]],
    ['radialGradient', { id: id(1), cx: 0.68, cy: 0.7, r: 0.6 }, [stop(0, V.accent, 0.55), stop(0.55, V.accent, 0.18), stop(1, V.accent, 0)]],
    ['linearGradient', { id: id(2), x1: 0.1, y1: 0, x2: 0.8, y2: 1 }, [stop(0, V.frost, 0.72), stop(0.45, V.tint, 0.4), stop(1, V.tint, 0.24)]],
  ]
  const out = []
  // soft diffuse shadow under each bead
  for (const [x, y] of AT) out.push(['circle', { cx: f(x + 0.3), cy: f(y + 0.95), r: 2.25, fill: V.shadow, 'fill-opacity': 0.1, class: 'wm-shadow' }])
  // colour glass behind, offset down-right, with the accent orb
  for (const [x, y] of AT) out.push(['circle', { cx: f(x + 0.3), cy: f(y + 0.3), r: 2.05, fill: `url(#${id(0)})`, class: 'wm-k' }])
  for (const [x, y] of AT) out.push(['circle', { cx: f(x + 0.3), cy: f(y + 0.3), r: 2.05, fill: `url(#${id(1)})`, class: 'wm-k' }])
  // thin frosted face in front, up-left, with the currentColor hairline
  for (const [x, y] of AT) out.push(['circle', { cx: f(x - 0.2), cy: f(y - 0.2), r: R, fill: `url(#${id(2)})`, stroke: 'currentColor', 'stroke-opacity': 0.22, 'stroke-width': 0.5, class: 'wm-k' }])
  // light rim along the lit top-left of every bead
  out.push(['path', { d: AT.map(([x, y]) => arc(x - 0.2, y - 0.2, R - 0.5, 165, 285)).join(''), fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.55, 'stroke-linecap': 'round', class: 'wm-shine' }])
  return [['defs', {}, defs], ...out]
}
