// forge/hand/halloween/barcode.mjs — a pumpkin label with a carved window glowing with candle light, printed with
// six midnight bars of varied widths (the end guard bars running longer, as on a real code), sized to separate at
// 16px, and two slime drips hanging off the label's bottom edge; in the style's halo, drop shadow, ink outline and
// top-left shine. The generated drawing was four separate orange bars that read as pillars or candles.
// Roles: label c1 -> c2, window tint -> accent -> c1, bars and outline ink, goo c4, halo accent, shine shine, shadow shadow.
// Motion: one body (wm-k); the drips are wm-deco like the style's own.
import { C } from '../../styles/_halloween-palettes.mjs'

const NAME = 'barcode'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
const r = v => Math.round(v * 100) / 100
const rr = (x0, y0, x1, y1, q) =>
  `M${r(x0 + q)} ${r(y0)}H${r(x1 - q)}A${q} ${q} 0 0 1 ${r(x1)} ${r(y0 + q)}V${r(y1 - q)}A${q} ${q} 0 0 1 ${r(x1 - q)} ${r(y1)}` +
  `H${r(x0 + q)}A${q} ${q} 0 0 1 ${r(x0)} ${r(y1 - q)}V${r(y0 + q)}A${q} ${q} 0 0 1 ${r(x0 + q)} ${r(y0)}Z`
const disc = (x, y, q) => `M${r(x - q)} ${r(y)}a${q} ${q} 0 1 0 ${r(2 * q)} 0a${q} ${q} 0 1 0 ${r(-2 * q)} 0Z`

const LABEL = rr(2.25, 4.75, 21.75, 19.25, 2.25)
// the window, drawn counter-clockwise so it cuts a hole in the label; a 1.75u frame on every side, the bottom included
const WINDOW = 'M5 6.5A1 1 0 0 0 4 7.5V16.5A1 1 0 0 0 5 17.5H19A1 1 0 0 0 20 16.5V7.5A1 1 0 0 0 19 6.5Z'
// six bars, widths 1 / 2 / 1 / 1.5 / 1 / 1.25 with gaps of 1 to 1.25u: [x, width, guard]; the end guards run 1u longer
const BARS = [[5.25, 1, 1], [7.5, 2], [10.5, 1], [12.75, 1.5], [15.5, 1], [17.5, 1.25, 1]]
const barsD = BARS.map(([x, w, g]) => `M${x} 8.25H${r(x + w)}V${g ? 16 : 15}H${x}Z`).join('')
// goo hangs straight from the label's bottom edge (no coat, so no sliver against the window)
const drip = (x, len) => {
  const cy = 19.25 + len, y = r(cy - 0.75)
  return `L${r(x + 1.5)} 19.25Q${r(x + 0.6)} 19.25 ${r(x + 0.6)} 20.25V${y}A1 1 0 1 1 ${r(x - 0.6)} ${y}V20.25Q${r(x - 0.6)} 19.25 ${r(x - 1.5)} 19.25`
}
// one long off-centre drip and a short rounded bead of goo, unequal so they never read as wheels or feet
const GOO = `M${r(15.5 - 1.5)} 19.25` + drip(15.5, 2.2) + 'Z' + 'M7 19.25Q7.75 19.25 8 20.1Q8.25 20.75 8.75 20.75Q9.25 20.75 9.5 20.1Q9.75 19.25 10.5 19.25Z'

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13.16, r: 12.87, fx: 8.88, fy: 9.39, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      // candle light glowing through the carved window
      ['radialGradient', { id: id(1), cx: 12, cy: 11.9, r: 8.6, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.tint), st(0.5, C.accent), st(1, C.c1)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.6, r: 12, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: rr(2.4, 5.6, 21.9, 20.1, 2.25), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: LABEL, fill: url(1), class: 'wm-shine' }],
    ['path', { d: LABEL + WINDOW, fill: url(0), ...INK, class: 'wm-k' }],
    ['path', { d: barsD, fill: C.ink, class: 'wm-k' }],
    ['path', { d: 'M3.12 15V6.95A1.3 1.3 0 0 1 4.42 5.62H12', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.7, class: 'wm-shine' }],
    ['path', { d: GOO, fill: C.c4, stroke: C.ink, 'stroke-width': 0.61, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: disc(15.2, 21.6, 0.28), fill: C.shine, 'fill-opacity': 0.85, class: 'wm-deco' }],
  ]
}
