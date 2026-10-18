// forge/hand/glass/undo.mjs — a thick frosted glass hook with a chevron arrowhead of the same weight. The generated
// tail was a pale thin tube whose colour body barely peeked out (rod offset), so the arrow faded on white and looked
// lighter than the head; here tail and head share one 2.6u weight, the violet body glows behind both, the edge is
// firmer and a light rim runs along the top. The arrowhead is its own pane (wm-a) so its nudge still leads the way.
import { V } from '../../styles/_glass-soft.mjs'

const S = 0.94, OFF = 1.1
const f = v => +v.toFixed(2)
// skeleton coords -> glass frame (scaled about the centre, front pane 0.5u up-left) + offset; absolute M L H V C Q A Z
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
const lin = (id, x1, y1, x2, y2, stops) => ['linearGradient', { id, x1: f(x1), y1: f(y1), x2: f(x2), y2: f(y2), gradientUnits: 'userSpaceOnUse' }, stops]
const rad = (id, cx, cy, r, stops) => ['radialGradient', { id, cx: f(cx), cy: f(cy), r: f(r), gradientUnits: 'userSpaceOnUse' }, stops]
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const EDGE = { stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.55, 'stroke-linejoin': 'round' }
const P = v => f(12 + (v - 12) * S - 0.5)

// layers [{ d, cls }] in skeleton coords; box [x0 y0 x1 y1] and glow [cx cy r] in skeleton coords
function glass(name, layers, box, glow, frost = 1) {
  const id = n => `wg-glass-${name}-${n}`, ev = 'evenodd'
  const [x0, y0, x1, y1] = box.map(P)
  const defs = [
    lin(id(0), x0 + OFF, y0 + OFF, x1 + OFF + 2, y1 + OFF + 2, [stop(0, V.c1), stop(1, V.shadow)]),
    rad(id(1), P(glow[0]) + OFF, P(glow[1]) + OFF, glow[2], [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]),
    lin(id(2), x0, y0, x1, y1, [stop(0, V.frost, f(0.6 * frost)), stop(0.4, V.tint, f(0.55 * frost)), stop(1, V.tint, f(0.42 * frost))]),
  ]
  const all = layers.map(l => l.d).join('')
  const out = [
    ['path', { d: tf(all, 0.4, 1.7), fill: V.shadow, 'fill-opacity': 0.05, stroke: V.shadow, 'stroke-opacity': 0.05, 'stroke-width': 1.6, 'stroke-linejoin': 'round', 'fill-rule': ev, class: 'wm-shadow' }],
  ]
  for (const l of layers) out.push(['path', { d: tf(l.d, OFF, OFF), fill: `url(#${id(0)})`, 'fill-rule': ev, class: l.cls }], ['path', { d: tf(l.d, OFF, OFF), fill: `url(#${id(1)})`, 'fill-rule': ev, class: l.cls }])
  for (const l of layers) out.push(['path', { d: tf(l.d), fill: `url(#${id(2)})`, ...EDGE, 'fill-rule': ev, class: l.cls }])
  return { defs, out }
}
const shine = (d, cls, w = 0.7) => ['path', { d: tf(d), fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': w, 'stroke-linecap': 'round', class: cls }]

// skeleton coords: the hook tail (butting into the chevron's inner notch) and the round-capped chevron head
const TAIL = 'M6.64 8.2 H15 A6.8 6.8 0 0 1 15 21.8 H9.5 A1.3 1.3 0 0 1 9.5 19.2 H15 A4.2 4.2 0 0 0 15 10.8 H6.64 L5.34 9.5 Z'
const HEAD = 'M2.58 8.58 L7.58 3.58 A1.3 1.3 0 0 1 9.42 5.42 L5.34 9.5 L9.42 13.58 A1.3 1.3 0 0 1 7.58 15.42 L2.58 10.42 A1.3 1.3 0 0 1 2.58 8.58 Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'undo'
  const { defs, out } = glass(name, [{ d: TAIL, cls: 'wm-k' }, { d: HEAD, cls: 'wm-a' }], [2.2, 3.2, 21.8, 21.8], [16, 16, 7])
  return [['defs', {}, defs], ...out,
    shine('M8.2 8.68 H15 A6.32 6.32 0 0 1 20.6 11.9', 'wm-shine'),
    shine('M3.4 8.45 L7.3 4.55', 'wm-a'),
  ]
}
