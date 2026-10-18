// forge/hand/glass/share.mjs — three frosted glass nodes joined by sturdy glass links, one continuous pane. The
// generated links were 1.5u slivers with almost no colour behind them, so on white the graph washed out to three
// pale dots; here the links are thick enough for the violet body to glow through, the joints are filleted into one
// smooth outline, the edge is firmer and each node has its own light rim. Same recipe as the generator.
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

// the share graph as one smooth outline: three nodes, two links, filleted concave joints (skeleton coords)
const R = 3.7, W = 1.15, E = 0.7
const C0 = [6.5, 12], C1 = [17.5, 5.5], C2 = [17.5, 18.5]
const q = p => f(p[0]) + ' ' + f(p[1])
function hits(a, b, side) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [-u[1], u[0]], k = Math.sqrt(R * R - W * W)
  return [[a[0] + side * W * n[0] + k * u[0], a[1] + side * W * n[1] + k * u[1]], [b[0] + side * W * n[0] - k * u[0], b[1] + side * W * n[1] - k * u[1]]]
}
const rot = (p, c, phi) => { const a = Math.atan2(p[1] - c[1], p[0] - c[0]) + phi; return [c[0] + R * Math.cos(a), c[1] + R * Math.sin(a)] }
const toward = (p, t) => { const L = Math.hypot(t[0] - p[0], t[1] - p[1]); return [p[0] + (t[0] - p[0]) / L * E, p[1] + (t[1] - p[1]) / L * E] }
function graph() {
  const [A, B] = hits(C0, C1, -1), [D, Cc] = hits(C0, C1, 1), [Ee, F] = hits(C0, C2, -1), [H, G] = hits(C0, C2, 1)
  const ph = E / R, arc = (lg, p) => `A${R} ${R} 0 ${lg} 1 ${q(p)}`
  return `M${q(toward(A, B))}L${q(toward(B, A))}Q${q(B)} ${q(rot(B, C1, ph))}${arc(1, rot(Cc, C1, -ph))}Q${q(Cc)} ${q(toward(Cc, D))}` +
    `L${q(toward(D, Cc))}Q${q(D)} ${q(rot(D, C0, ph))}${arc(0, rot(Ee, C0, -ph))}Q${q(Ee)} ${q(toward(Ee, F))}` +
    `L${q(toward(F, Ee))}Q${q(F)} ${q(rot(F, C2, ph))}${arc(1, rot(G, C2, -ph))}Q${q(G)} ${q(toward(G, H))}` +
    `L${q(toward(H, G))}Q${q(H)} ${q(rot(H, C0, ph))}${arc(1, rot(A, C0, -ph))}Q${q(A)} ${q(toward(A, B))}Z`
}
// light rim on each node's lit (top-left) shoulder
const rim = c => { const r = R - 0.5, p = a => q([c[0] + r * Math.cos(a * Math.PI / 180), c[1] + r * Math.sin(a * Math.PI / 180)]); return `M${p(192)}A${f(r)} ${f(r)} 0 0 1 ${p(268)}` }

export default function render(icon) {
  const name = (icon && icon.name) || 'share'
  const { defs, out } = glass(name, [{ d: graph(), cls: 'wm-k' }], [2.8, 1.8, 21.2, 22.2], [15, 15, 7])
  return [['defs', {}, defs], ...out, shine(rim(C0) + rim(C1) + rim(C2), 'wm-shine')]
}
