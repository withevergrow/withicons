// forge/hand/glass/test-tube.mjs — a wide frosted glass test tube on the diagonal: a round-bottomed tube with a flared lip
// collar at its mouth and a bright accent liquid filling it past halfway, with a meniscus and two bubbles. The generated
// tube was a slim pale rod with a thin cap line and a hairline liquid etch, so it read as a syringe or a marker; here
// the body is wider, the lip is its own glass collar and the liquid is a bold accent column you can see at 16px.
// Same Glass layers: soft shadow, colour body down-right with an accent orb, frosted pane up-left with a hairline edge.
// Motion: the whole tube sways about its mouth (18 6); the liquid is plate A (wm-a) and floats.
import { V } from '../../styles/_glass-soft.mjs'

const S = 0.94, OFF = 1.1
const f = v => +v.toFixed(2)
// skeleton coords -> glass frame (scaled about the centre, front pane 0.5u up-left) + offset; absolute M L C A Z
function tf(d, dx = 0, dy = 0) {
  const t = d.match(/[MLHVCQAZ]|-?\d*\.?\d+/g), X = v => f(12 + (v - 12) * S - 0.5 + dx), Y = v => f(12 + (v - 12) * S - 0.5 + dy)
  let o = '', i = 0, c = ''
  const n = () => +t[i++]
  while (i < t.length) {
    if (/[A-Z]/.test(t[i])) { c = t[i++]; o += c; if (c === 'Z') continue }
    if (c === 'H') o += X(n()) + ' '
    else if (c === 'V') o += Y(n()) + ' '
    else if (c === 'A') { o += f(n() * S) + ' ' + f(n() * S) + ' ' + n() + ' ' + n() + ' ' + n() + ' '; o += X(n()) + ' ' + Y(n()) + ' ' }
    else { const k = c === 'C' ? 3 : c === 'Q' ? 2 : 1; for (let j = 0; j < k; j++) o += X(n()) + ' ' + Y(n()) + ' ' }
  }
  return o.trim()
}
const lin = (id, x1, y1, x2, y2, stops) => ['linearGradient', { id, x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const rad = (id, cx, cy, r, stops) => ['radialGradient', { id, cx, cy, r, gradientUnits: 'userSpaceOnUse' }, stops]
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const EDGE = { stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.55, 'stroke-linejoin': 'round' }

// tube frame: s runs along the axis from the centre of the round bottom up to the mouth, t across it
const C0 = [7.6, 16.4], U = [Math.SQRT1_2, -Math.SQRT1_2], N = [Math.SQRT1_2, Math.SQRT1_2]
const P = (s, t) => f(C0[0] + s * U[0] + t * N[0]) + ' ' + f(C0[1] + s * U[1] + t * N[1])
// a round-ended column of half-width w from the bottom to s = top
const column = (w, top) => `M${P(top, -w)} L${P(0, -w)} A${w} ${w} 0 0 0 ${P(0, w)} L${P(top, w)} Z`
// a rounded slab across the axis between s0 and s1, half-width w, corner radius r
const slab = (s0, s1, w, r) => `M${P(s1, -w + r)} L${P(s1, w - r)} A${r} ${r} 0 0 1 ${P(s1 - r, w)} L${P(s0 + r, w)} A${r} ${r} 0 0 1 ${P(s0, w - r)} ` +
  `L${P(s0, -w + r)} A${r} ${r} 0 0 1 ${P(s0 + r, -w)} L${P(s1 - r, -w)} A${r} ${r} 0 0 1 ${P(s1, -w + r)} Z`

const W = 3.55, LIQ = 7.4
const TUBE = column(W, 12.9)
const LIP = slab(12.2, 14.8, W + 1.05, 1.15)
// the liquid sits inside the glass wall, its surface a shallow meniscus
const LIQUID = `M${P(LIQ, -W + 0.85)} L${P(0, -W + 0.85)} A${W - 0.85} ${W - 0.85} 0 0 0 ${P(0, W - 0.85)} L${P(LIQ, W - 0.85)} ` +
  `C${P(LIQ - 0.7, W - 1.6)} ${P(LIQ - 0.7, -W + 1.6)} ${P(LIQ, -W + 0.85)} Z`

export default function render(icon) {
  const name = (icon && icon.name) || 'test-tube'
  const id = n => `wg-glass-${name}-${n}`, url = n => `url(#${id(n)})`
  const defs = [
    lin(id(0), 4, 3, 22, 22, [stop(0, V.c1), stop(1, V.shadow)]),
    rad(id(1), 9.6, 16.4, 6.5, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]),
    lin(id(2), 4, 2, 21, 20, [stop(0, V.frost, 0.6), stop(0.4, V.tint, 0.55), stop(1, V.tint, 0.42)]),
    lin(id(3), 6, 12, 11, 17, [stop(0, V.shine, 0.5), stop(0.45, V.shine, 0), stop(1, V.shadow, 0.3)]),
  ]
  const back = (d, cls) => [['path', { d: tf(d, OFF, OFF), fill: url(0), class: cls }], ['path', { d: tf(d, OFF, OFF), fill: url(1), class: cls }]]
  const pane = (d, cls) => ['path', { d: tf(d), fill: url(2), ...EDGE, class: cls }]
  const line = (d, cls, w, op = 0.9, color = V.shine) => ['path', { d: tf(d), fill: 'none', stroke: color, 'stroke-opacity': op, 'stroke-width': w, 'stroke-linecap': 'round', class: cls }]
  // a bubble in the liquid at (s, t), placed in the front-pane frame
  const bubble = (s0, t0, r, op) => ['circle', { cx: f(12 + (C0[0] + s0 * U[0] + t0 * N[0] - 12) * S - 0.5), cy: f(12 + (C0[1] + s0 * U[1] + t0 * N[1] - 12) * S - 0.5), r, fill: V.shine, 'fill-opacity': op, class: 'wm-a' }]
  return [['defs', {}, defs],
    // soft diffuse shadow
    ['path', { d: tf(TUBE + LIP, 0.4, 1.7), fill: V.shadow, 'fill-opacity': 0.05, stroke: V.shadow, 'stroke-opacity': 0.05, 'stroke-width': 1.6, 'stroke-linejoin': 'round', class: 'wm-shadow' }],
    // tube: colour body and frosted pane
    ...back(TUBE, 'wm-k'), pane(TUBE, 'wm-k'),
    // liquid: luminous accent glass inside the wall, a sheen across it and a lit surface line
    ['path', { d: tf(LIQUID), fill: V.accent, 'fill-opacity': 0.92, stroke: 'currentColor', 'stroke-opacity': 0.18, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: tf(LIQUID), fill: url(3), class: 'wm-a' }],
    line(`M${P(LIQ - 0.3, -W + 1.3)} C${P(LIQ - 0.75, -0.8)} ${P(LIQ - 0.75, 0.8)} ${P(LIQ - 0.3, W - 1.3)}`, 'wm-a wm-shine', 0.5, 0.8),
    bubble(3.4, 0.6, 0.62, 0.75), bubble(1.5, -1, 0.42, 0.65),
    // the long lit edge of the tube on its upper-left wall
    line(`M${P(11.4, -W + 0.75)} L${P(1.2, -W + 0.75)}`, 'wm-shine', 0.7),
    // lip collar: its own glass at the mouth
    ...back(LIP, 'wm-k'), pane(LIP, 'wm-k'),
    line(`M${P(13.5, -W - 0.35)} L${P(13.5, W - 0.6)}`, 'wm-shine', 0.6, 0.85),
  ]
}
