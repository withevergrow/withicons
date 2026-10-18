// forge/hand/glass/flag.mjs — a frosted glass pennant on a sturdy glass pole. The generated pole was a 1.5u sliver
// with no colour behind it and the cloth a pale pane, so at 16px only a faint smudge was left; here the pole is a
// 2.4u rod with the violet body glowing through like every other part, the cloth abuts it with a firmer edge and
// light rims trace the cloth's wave and the pole. Cloth wm-k (sways), pole wm-a (parts.A).
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

// skeleton coords: the waving cloth (its outer edge, abutting the pole) and the round-ended pole
const CLOTH = 'M6.2 2.62 C8.4 1.45 10.4 1.45 12.6 2.55 C15 3.75 17.3 3.8 19.6 2.7 A1 1 0 0 1 21 3.6 V13.3 A1 1 0 0 1 20.45 14.2 C17.6 15.6 15 15.6 12.4 14.4 C10.3 13.45 8.3 13.4 6.2 14.4 Z'
const POLE = 'M3.8 3.4 A1.2 1.2 0 0 1 6.2 3.4 V20.6 A1.2 1.2 0 0 1 3.8 20.6 Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'flag'
  const { defs, out } = glass(name, [{ d: CLOTH, cls: 'wm-k' }, { d: POLE, cls: 'wm-a' }], [2.6, 1.5, 21, 21.8], [15, 11, 6.5])
  return [['defs', {}, defs], ...out,
    shine('M7.2 2.6 C9 1.85 10.7 1.95 12.3 2.75', 'wm-shine'),
    shine('M4.25 4.2 V12', 'wm-a'),
  ]
}
