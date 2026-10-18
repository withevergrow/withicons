// forge/hand/glass/trash.mjs — a frosted glass bin with a separate glass lid and handle and two etched slats. The
// generated bin fused a thin lid rod and handle onto a pale body with hairline slats, so the silhouette dissolved
// into the white at 16px; here the lid is a solid 2.6u slab with a sturdy handle sitting just above the body (its
// violet casts a band on the bin), the edge is firmer and the slats are bold etch strokes with a colour echo.
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

// skeleton coords: the tapered body, the lid slab with its handle (hole for the grip) and the two slats
const BODY = 'M4.3 9 H19.7 L18.88 19 A2.9 2.9 0 0 1 16 21.9 H8 A2.9 2.9 0 0 1 5.12 19 Z'
const LID = 'M3.7 5.6 H8.4 V4 A1.8 1.8 0 0 1 10.2 2.2 H13.8 A1.8 1.8 0 0 1 15.6 4 V5.6 H20.3 A1.3 1.3 0 0 1 21.6 6.9 A1.3 1.3 0 0 1 20.3 8.2 H3.7 A1.3 1.3 0 0 1 2.4 6.9 A1.3 1.3 0 0 1 3.7 5.6 Z' +
  'M10.6 5.6 H13.4 V4.9 A0.5 0.5 0 0 0 12.9 4.4 H11.1 A0.5 0.5 0 0 0 10.6 4.9 Z'
const SLATS = 'M10 12 V18.5 M14 12 V18.5'

export default function render(icon) {
  const name = (icon && icon.name) || 'trash'
  const { defs, out } = glass(name, [{ d: BODY, cls: 'wm-k' }, { d: LID, cls: 'wm-a' }], [2.4, 2.2, 21.6, 21.9], [14.5, 16.5, 7])
  const round = { fill: 'none', 'stroke-linecap': 'round', class: 'wm-k' }
  return [['defs', {}, defs], ...out,
    shine('M5.6 9.5 H12 M5.25 11 L5.85 18.2', 'wm-shine'),
    shine('M3.6 6.08 H8 M8.9 4.4 V4 A1.3 1.3 0 0 1 10.2 2.7 H13.6', 'wm-a'),
    ['path', { d: tf(SLATS, 0.35, 0.4), stroke: V.c1, 'stroke-opacity': 0.55, 'stroke-width': 1.5, ...round }],
    ['path', { d: tf(SLATS), stroke: V.etch, 'stroke-opacity': 0.9, 'stroke-width': 1.5, ...round }],
  ]
}
