// forge/hand/glass/list-ordered.mjs — a numbered list: a bold 1 and 2 beside three colour-glass bars. The generated
// numerals were puffed into pale frosted tubes (the 2 swelled into a blob) and the bars were near-white rods, so the
// numbers lost their contrast on white at 16px. Here the numerals are slim solid colour-glass glyphs (back -> shadow,
// 1.9u, a soft shadow echo and a fine rim) and the bars full colour-glass rods behind a thinner frosted face, a deeper
// tint like the style's tiles, so the 1 and 2 keep their counters and contrast on white and on dark.
// Motion: bars wm-k, numerals wm-a (parts.A types them out).
import { V } from '../../styles/_glass-soft.mjs'

const f = v => +v.toFixed(2)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const lin = (id, x1, y1, x2, y2, stops) => ['linearGradient', { id, x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const rad = (id, cx, cy, r, stops) => ['radialGradient', { id, cx, cy, r, gradientUnits: 'userSpaceOnUse' }, stops]
// horizontal capsule centred on y from x1 to x2, half-height h, moved by (dx, dy)
const cap = (x1, x2, y, h, dx = 0, dy = 0) => {
  const a = f(x1 + dx), b = f(x2 + dx), t = f(y + dy - h), u = f(y + dy + h)
  return `M${a} ${t}H${b}A${h} ${h} 0 0 1 ${b} ${u}H${a}A${h} ${h} 0 0 1 ${a} ${t}Z`
}

const H = 1.3
const BARS = [[12.6, 20.3, 6], [12.6, 20.3, 12], [12.6, 20.3, 18]]
const ONE = 'M3.6 4.6L5.6 3.1V9.1M3.6 9.1H7.6'
const TWO = 'M3.5 16.5C3.75 15.5 4.5 15 5.5 15C6.75 15 7.5 15.75 7.5 17C7.5 17.75 7.1 18.1 6.5 18.6L3.5 21H7.6'
const shift = (d, dx, dy) => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (_, x, y) => `${f(+x + dx)} ${f(+y + dy)}`)
  .replace(/V(-?\d*\.?\d+)/g, (_, y) => `V${f(+y + dy)}`).replace(/H(-?\d*\.?\d+)/g, (_, x) => `H${f(+x + dx)}`)

export default function render(icon) {
  const name = (icon && icon.name) || 'list-ordered'
  let n = 0
  const defs = [], add = g => { defs.push(g); return `url(#${g[1].id})` }
  const id = () => `wg-glass-${name}-${n++}`
  const bars = (dx, dy, h) => BARS.map(([a, b, y]) => cap(a, b, y, h, dx, dy)).join('')
  const back = add(lin(id(), 11, 4, 22, 20, [stop(0, V.c1), stop(1, V.shadow)]))
  const glow = add(rad(id(), 18.5, 16, 6.5, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]))
  const pane = add(lin(id(), 11, 4, 21, 20, [stop(0, V.frost, 0.6), stop(0.4, V.tint, 0.42), stop(1, V.tint, 0.28)]))
  const num = add(lin(id(), 3, 3, 8, 27, [stop(0, V.c1), stop(1, V.shadow)]))
  const round = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  return [['defs', {}, defs],
    ['path', { d: bars(0.3, 1, H + 0.15), fill: V.shadow, 'fill-opacity': 0.09, class: 'wm-shadow' }],
    ['path', { d: bars(0.4, 0.4, H - 0.1), fill: back, class: 'wm-k' }],
    ['path', { d: bars(0.4, 0.4, H - 0.1), fill: glow, class: 'wm-k' }],
    ['path', { d: bars(-0.25, -0.25, H), fill: pane, stroke: 'currentColor', 'stroke-opacity': 0.22, 'stroke-width': 0.5, class: 'wm-k' }],
    ['path', { d: BARS.map(([a, b, y]) => `M${f(a - 1.05)} ${f(y - 0.25)}A0.8 0.8 0 0 1 ${f(a - 0.25)} ${f(y - 1.05)}H${f(a + (b - a) * 0.55)}`).join(''), fill: 'none', stroke: V.shine, 'stroke-opacity': 0.88, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-shine' }],
    // numerals: solid colour glass glyphs (back -> shadow) over a soft shadow echo, with a fine light rim on the 1's stem
    ['path', { d: shift(ONE, 0.35, 0.5) + shift(TWO, 0.35, 0.5), stroke: V.shadow, 'stroke-opacity': 0.28, 'stroke-width': 2, ...round, class: 'wm-a' }],
    ['path', { d: ONE + TWO, stroke: num, 'stroke-width': 1.9, ...round, class: 'wm-a' }],
    ['path', { d: 'M5.35 4.4V8.2M4.1 16.2C4.4 15.75 4.9 15.55 5.5 15.55', stroke: V.shine, 'stroke-opacity': 0.75, 'stroke-width': 0.4, ...round, class: 'wm-a' }],
  ]
}
