// forge/hand/glass/popcorn.mjs — a frosted glass popcorn bucket: a tapered tub with a rim band and two bold accent
// stripes, and a heap of five round kernel puffs, each its own pane with its own edge, spilling over the rim. The
// generated drawing fused the kernel cloud into the tub as one violet lump with hairline stripes, so it read as a
// muffin; here every kernel keeps a visible outline, the rim cuts across their bases and the stripes carry colour.
// Same Glass layers: soft shadow, colour body down-right with an accent orb, frosted pane up-left with a hairline edge.
// Motion: the kernels are plate A (wm-a) and bounce out of the bucket about 12 10.
import { V } from '../../styles/_glass-soft.mjs'

const S = 0.94, OFF = 1.1
const f = v => +v.toFixed(2)
const X = v => f(12 + (v - 12) * S - 0.5), Y = X
// skeleton coords -> glass frame (scaled about the centre, front pane 0.5u up-left) + offset; absolute M L H V C A Z
function tf(d, dx = 0, dy = 0) {
  const t = d.match(/[MLHVCQAZ]|-?\d*\.?\d+/g), x = v => f(X(v) + dx), y = v => f(Y(v) + dy)
  let o = '', i = 0, c = ''
  const n = () => +t[i++]
  while (i < t.length) {
    if (/[A-Z]/.test(t[i])) { c = t[i++]; o += c; if (c === 'Z') continue }
    if (c === 'H') o += x(n()) + ' '
    else if (c === 'V') o += y(n()) + ' '
    else if (c === 'A') { o += f(n() * S) + ' ' + f(n() * S) + ' ' + n() + ' ' + n() + ' ' + n() + ' '; o += x(n()) + ' ' + y(n()) + ' ' }
    else { const k = c === 'C' ? 3 : c === 'Q' ? 2 : 1; for (let j = 0; j < k; j++) o += x(n()) + ' ' + y(n()) + ' ' }
  }
  return o.trim()
}
const lin = (id, x1, y1, x2, y2, stops) => ['linearGradient', { id, x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const rad = (id, cx, cy, r, stops) => ['radialGradient', { id, cx, cy, r, gradientUnits: 'userSpaceOnUse' }, stops]
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const EDGE = { stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.55, 'stroke-linejoin': 'round' }

// skeleton coords: kernels [cx cy r], back row first; the tub, its rim band and the two stripes
const KERNELS = [[9.4, 6.3, 2.9], [14.7, 6.5, 2.8], [6.6, 9.4, 2.6], [17.4, 9.4, 2.6], [12, 8.9, 2.9]]
const TUB = 'M5 11 H19 L17.55 20.25 A1.5 1.5 0 0 1 16.07 21.5 H7.93 A1.5 1.5 0 0 1 6.45 20.25 Z'
const RIM = 'M4.6 9.9 H19.4 A1.2 1.2 0 0 1 19.4 12.3 H4.6 A1.2 1.2 0 0 1 4.6 9.9 Z'
const STRIPES = 'M8.3 12.3 H10.7 L11.1 21.5 H9 Z M13.3 12.3 H15.7 L15 21.5 H12.9 Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'popcorn'
  const id = n => `wg-glass-${name}-${n}`, url = n => `url(#${id(n)})`
  const defs = [
    lin(id(0), 4, 3, 22, 23, [stop(0, V.c1), stop(1, V.shadow)]),
    rad(id(1), 15.6, 17.6, 7, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]),
    lin(id(2), 3, 3, 20, 21, [stop(0, V.frost, 0.6), stop(0.4, V.tint, 0.55), stop(1, V.tint, 0.42)]),
    // kernels: a whiter frost so the puffs read lighter than the tub
    lin(id(3), 4, 3, 19, 12, [stop(0, V.frost, 0.85), stop(1, V.tint, 0.62)]),
  ]
  const out = [['defs', {}, defs],
    ['path', { d: tf(TUB + RIM, 0.4, 1.7), fill: V.shadow, 'fill-opacity': 0.05, stroke: V.shadow, 'stroke-opacity': 0.05, 'stroke-width': 1.6, 'stroke-linejoin': 'round', class: 'wm-shadow' }],
  ]
  // kernels, back row then front row: each a colour body behind a light frosted puff with a lit top-left crescent
  for (const [cx, cy, r] of KERNELS) {
    out.push(['circle', { cx: f(X(cx) + 0.7), cy: f(Y(cy) + 0.7), r: f(r * S), fill: url(0), class: 'wm-a' }])
    out.push(['circle', { cx: X(cx), cy: Y(cy), r: f(r * S), fill: url(3), ...EDGE, class: 'wm-a' }])
    const a = r * S * 0.68
    out.push(['path', { d: `M${f(X(cx) - a)} ${f(Y(cy) + 0.15 * a)}A${f(a)} ${f(a)} 0 0 1 ${f(X(cx) - 0.15 * a)} ${f(Y(cy) - a)}`, fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.55, 'stroke-linecap': 'round', class: 'wm-a wm-shine' }])
  }
  // tub: colour body with an accent orb, frosted pane, two accent stripes, a lit left wall
  out.push(['path', { d: tf(TUB, OFF, OFF), fill: url(0), class: 'wm-k' }], ['path', { d: tf(TUB, OFF, OFF), fill: url(1), class: 'wm-k' }])
  out.push(['path', { d: tf(TUB), fill: url(2), ...EDGE, class: 'wm-k' }])
  out.push(['path', { d: tf(STRIPES), fill: V.accent, 'fill-opacity': 0.82, class: 'wm-k' }])
  out.push(['path', { d: tf('M6.1 13.2 L7.2 20.1'), fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.7, 'stroke-linecap': 'round', class: 'wm-shine' }])
  // rim band: its own glass across the kernels' bases
  out.push(['path', { d: tf(RIM, 0.7, 0.7), fill: url(0), class: 'wm-k' }])
  out.push(['path', { d: tf(RIM), fill: url(2), ...EDGE, class: 'wm-k' }])
  out.push(['path', { d: tf('M4.3 10.75 H12'), fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-shine' }])
  return out
}
