// forge/hand/glass/check-square.mjs — a frosted glass tile with a bold deep-ink tick etched on it. The generated tile
// was a pale pane whose tick was a 0.7u hairline at 62% (gone at 16px) with a faint edge; here the pane is a touch
// clearer so the violet glows through, the edge is firmer and the tick is a solid etch stroke with a colour echo.
// Same recipe as the generator: violet body offset down-right, accent orb, frosted pane, light rim, soft shadow.
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

const TILE = 'M5 2 H19 A3 3 0 0 1 22 5 V19 A3 3 0 0 1 19 22 H5 A3 3 0 0 1 2 19 V5 A3 3 0 0 1 5 2 Z'
const TICK = 'M7.75 12.25 L10.75 15.25 L16.25 9.25'

export default function render(icon) {
  const name = (icon && icon.name) || 'check-square'
  const { defs, out } = glass(name, [{ d: TILE, cls: 'wm-k' }], [2, 2, 22, 22], [16.5, 16.5, 8], 0.85)
  const round = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }
  return [['defs', {}, defs], ...out,
    shine('M2.45 14 V5 A2.55 2.55 0 0 1 5 2.45 H14', 'wm-shine'),
    ['path', { d: tf(TICK, 0.4, 0.45), stroke: V.c1, 'stroke-opacity': 0.55, 'stroke-width': 2.2, ...round }],
    ['path', { d: tf(TICK), stroke: V.etch, 'stroke-width': 2.2, ...round }],
  ]
}
