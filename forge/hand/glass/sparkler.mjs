// forge/hand/glass/sparkler.mjs — a frosted glass sparkler: a pale thin wire handle, a darker grained coated end that
// burns into a bright accent core, and a spray of ten thin tapered spark streaks of varied length flying off the core
// (a clear gap around it, the stick's sector left open), with a few loose spark dots and two small twinkles. The earlier
// drawing used seven wide rays that closed up into one star polygon and read as a magic wand; streaks fix that.
// Same Glass layers: soft shadow, colour body down-right, frosted pane up-left with a hairline edge.
// Motion: stick wm-k, streaks and core plate A (wm-a, flicker about 15 9), twinkles plate S (wm-s), dots wm-deco.
import { V } from '../../styles/_glass-soft.mjs'

const S = 0.94
const f = v => +v.toFixed(2)
const X = v => f(12 + (v - 12) * S - 0.5), Y = X
const lin = (id, x1, y1, x2, y2, stops) => ['linearGradient', { id, x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const rad = (id, cx, cy, r, stops) => ['radialGradient', { id, cx, cy, r, gradientUnits: 'userSpaceOnUse' }, stops]
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const EDGE = { stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.5, 'stroke-linejoin': 'round' }

// skeleton coords: the burst centre, streaks [angle deg, outer radius, half-width at the root]
const CX = 15, CY = 9
const RI = 3.2
const STREAKS = [
  [176, 7.2, 0.55], [206, 5.6, 0.5], [237, 7.0, 0.6], [267, 5.8, 0.55], [297, 7.5, 0.6],
  [327, 5.8, 0.55], [358, 7.3, 0.6], [28, 5.6, 0.5], [58, 7.0, 0.6], [88, 5.2, 0.5],
]
// a thin spark streak: a small round root at RI, tapering straight to a point at ro (front-pane frame, shifted by dx dy)
function streak(a, ro, w, dx = 0, dy = 0) {
  const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180)
  const p = (r, t) => f(X(CX + r * c - t * s) + dx) + ' ' + f(Y(CY + r * s + t * c) + dy)
  return `M${p(RI, -w)}L${p(ro, 0)}L${p(RI, w)}Q${p(RI - w, w)} ${p(RI - w, 0)}Q${p(RI - w, -w)} ${p(RI, -w)}Z`
}
// a four-point twinkle centred at (x, y) with arm length r, in the front-pane frame
function twinkle(x, y, r) {
  const cx = X(x), cy = Y(y), R = r * S, k = R * 0.3
  const p = (u, v) => f(cx + u) + ' ' + f(cy + v)
  return `M${p(0, -R)}C${p(k * 0.4, -k)} ${p(k, -k * 0.4)} ${p(R, 0)}C${p(k, k * 0.4)} ${p(k * 0.4, k)} ${p(0, R)}` +
    `C${p(-k * 0.4, k)} ${p(-k, k * 0.4)} ${p(-R, 0)}C${p(-k, -k * 0.4)} ${p(-k * 0.4, -k)} ${p(0, -R)}Z`
}
// the stick runs from the handle end (3.5 20.5) up the diagonal; u along it, t across it
const K = Math.SQRT1_2, L = 13.4, S0 = 6.2, WW = 0.6, WC = 1.45
const sp = (u, t, dx = 0, dy = 0) => f(X(3.5 + u * K + t * K) + dx) + ' ' + f(Y(20.5 - u * K + t * K) + dy)
// the pale wire handle, tucked under the coating's lower end
function wire(dx = 0, dy = 0) {
  const p = (u, t) => sp(u, t, dx, dy)
  return `M${p(0, -WW)}L${p(S0 + 0.6, -WW)}L${p(S0 + 0.6, WW)}L${p(0, WW)}A${f(WW * S)} ${f(WW * S)} 0 0 1 ${p(0, -WW)}Z`
}
// the coated end: a thick rod with a rounded shoulder at its foot and a round burning tip
function coat(dx = 0, dy = 0) {
  const p = (u, t) => sp(u, t, dx, dy), r = f(WC * S)
  return `M${p(S0 + 0.5, -WC)}L${p(L, -WC)}A${r} ${r} 0 0 1 ${p(L, WC)}L${p(S0 + 0.5, WC)}Q${p(S0 - 0.15, WC)} ${p(S0 - 0.15, 0)}Q${p(S0 - 0.15, -WC)} ${p(S0 + 0.5, -WC)}Z`
}

export default function render(icon) {
  const name = (icon && icon.name) || 'sparkler'
  const id = n => `wg-glass-${name}-${n}`, url = n => `url(#${id(n)})`
  const defs = [
    lin(id(0), 3, 2, 22, 22, [stop(0, V.c1), stop(1, V.shadow)]),
    lin(id(1), 3, 2, 21, 21, [stop(0, V.frost, 0.6), stop(0.4, V.tint, 0.55), stop(1, V.tint, 0.42)]),
    rad(id(2), X(CX) - 0.5, Y(CY) - 0.5, 2.9, [stop(0, V.shine, 0.95), stop(0.45, V.accent, 1), stop(1, V.accent, 0.9)]),
    rad(id(3), X(CX), Y(CY), 6.4, [stop(0, V.accent, 0.4), stop(0.55, V.accent, 0.12), stop(1, V.accent, 0)]),
    // streak body: hot accent at the root cooling to the glass colour at the tips
    rad(id(4), X(CX), Y(CY), 7.2, [stop(0.4, V.accent), stop(0.75, V.c1), stop(1, V.shadow)]),
    // coated end: its own deeper tone, a thin frost over the colour body
    lin(id(5), 6, 11, 14, 19, [stop(0, V.frost, 0.32), stop(1, V.tint, 0.12)]),
  ]
  const front = STREAKS.map(([a, ro, w]) => streak(a, ro, w)).join('')
  const back = STREAKS.map(([a, ro, w]) => streak(a, ro, w * 1.1, 0.25, 0.25)).join('')
  const out = [['defs', {}, defs],
    ['path', { d: wire(0.3, 1.1) + coat(0.3, 1.1), fill: V.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }],
    // a soft accent glow behind the burst
    ['circle', { cx: X(CX), cy: Y(CY), r: 6.4, fill: url(3), class: 'wm-a' }],
    // the wire handle: pale and thin
    ['path', { d: wire(0.35, 0.35), fill: url(0), 'fill-opacity': 0.55, class: 'wm-k' }],
    ['path', { d: wire(), fill: url(1), ...EDGE, 'stroke-width': 0.4, class: 'wm-k' }],
    // the coated end: deeper colour body, thin frost, and a grain of shine ticks across it
    ['path', { d: coat(0.5, 0.5), fill: url(0), class: 'wm-k' }],
    ['path', { d: coat(), fill: url(5), ...EDGE, class: 'wm-k' }],
    ...[[7.4, -0.55], [8.6, 0.5], [9.7, -0.35], [10.9, 0.6], [11.9, -0.6]].map(([u, t]) => { const [cx, cy] = sp(u, t).split(' ').map(Number); return ['circle', { cx, cy, r: 0.28, fill: V.shine, 'fill-opacity': 0.75, class: 'wm-shine' }] }),
    ['path', { d: `M${sp(S0 + 0.6, -0.95)}L${sp(L - 0.3, -0.95)}`, fill: 'none', stroke: V.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.35, 'stroke-linecap': 'round', class: 'wm-shine' }],
    // spark streaks: colour body behind a light frosted pane, light edge so the spray stays airy
    ['path', { d: back, fill: url(4), class: 'wm-a' }],
    ['path', { d: front, fill: url(1), 'fill-opacity': 0.38, stroke: 'currentColor', 'stroke-opacity': 0.16, 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-a' }],
    // the burning core
    ['circle', { cx: X(CX), cy: Y(CY), r: 2, fill: url(2), stroke: 'currentColor', 'stroke-opacity': 0.16, 'stroke-width': 0.4, class: 'wm-a' }],
    // loose sparks in the open space around the burst
    ...[[21, 11.6, 0.5], [9.6, 4.6, 0.45], [19.6, 3.4, 0.45]].map(([x, y, r]) =>
      ['circle', { cx: X(x), cy: Y(y), r, fill: V.accent, 'fill-opacity': 0.9, class: 'wm-deco' }]),
  ]
  // twinkles: small accent glass stars with a lit centre, away from the spray
  for (const [x, y, r] of [[5, 5, 1.9], [20, 17.5, 1.7]]) {
    out.push(['path', { d: twinkle(x, y, r), fill: V.accent, stroke: 'currentColor', 'stroke-opacity': 0.16, 'stroke-width': 0.35, 'stroke-linejoin': 'round', class: 'wm-s' }])
    out.push(['circle', { cx: f(X(x) - 0.1), cy: f(Y(y) - 0.1), r: f(r * 0.17), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-s wm-shine' }])
  }
  return out
}
