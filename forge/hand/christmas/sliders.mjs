// forge/hand/christmas/sliders.mjs — three slim pine tracks, each lit gold up to a chunky cranberry knob that wears a
// little snow cap: the generated drawing made fat cream tracks crossed by pale candy-cane knobs, all near-white, so on
// white it blurred into a hash at 16px. House recipe: 0.6 ink outline, shared warm light, snow (shine to tint), one
// gold sparkle. Knobs (and their snow) carry wm-a so they still glide along their tracks.
import { C } from '../../styles/_christmas-core.mjs'

const n = v => Math.round(v * 100) / 100
const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]

const rr = (x0, y0, x1, y1, r) => `M${n(x0 + r)} ${n(y0)}H${n(x1 - r)}A${r} ${r} 0 0 1 ${n(x1)} ${n(y0 + r)}V${n(y1 - r)}A${r} ${r} 0 0 1 ${n(x1 - r)} ${n(y1)}H${n(x0 + r)}A${r} ${r} 0 0 1 ${n(x0)} ${n(y1 - r)}V${n(y0 + r)}A${r} ${r} 0 0 1 ${n(x0 + r)} ${n(y0)}Z`
// a small snow cap on a knob's round top (cx, top y): a soft dome with one drip
const cap = (cx, y) => `M${n(cx - 1.95)} ${n(y + 0.95)}C${n(cx - 2.1)} ${n(y - 0.55)} ${n(cx - 1)} ${n(y - 0.95)} ${n(cx)} ${n(y - 0.95)}` +
  `C${n(cx + 1)} ${n(y - 0.95)} ${n(cx + 2.1)} ${n(y - 0.55)} ${n(cx + 1.95)} ${n(y + 0.95)}` +
  `Q${n(cx + 1.4)} ${n(y + 1.25)} ${n(cx + 0.95)} ${n(y + 1.15)}C${n(cx + 0.95)} ${n(y + 2)} ${n(cx + 0.05)} ${n(y + 2)} ${n(cx + 0.05)} ${n(y + 1.2)}` +
  `Q${n(cx - 0.9)} ${n(y + 1.35)} ${n(cx - 1.95)} ${n(y + 0.95)}Z`
function sparkleD(x, y, r) {
  const q = r * 0.22
  return `M${n(x)} ${n(y - r)}Q${n(x + q)} ${n(y - q)} ${n(x + r)} ${n(y)}Q${n(x + q)} ${n(y + q)} ${n(x)} ${n(y + r)}` +
    `Q${n(x - q)} ${n(y + q)} ${n(x - r)} ${n(y)}Q${n(x - q)} ${n(y - q)} ${n(x)} ${n(y - r)}Z`
}

// the skeleton's three rows: track at y, knob at x
const ROWS = [[6, 16], [12, 8], [18, 13]]
const TW = 2.2, KW = 3.6, KH = 6.3

export default function render(icon) {
  const name = icon.name || 'sliders'
  const id = k => `wg-christmas-${name}-${k}`, url = k => `url(#${id(k)})`
  let tracks = '', lit = '', knobs = ''
  const caps = []
  for (const [y, x] of ROWS) {
    tracks += rr(3, y - TW / 2, 21, y + TW / 2, TW / 2)
    lit += rr(3, y - TW / 2, x, y + TW / 2, TW / 2)
    knobs += rr(x - KW / 2, y - KH / 2, x + KW / 2, y + KH / 2, KW / 2)
    caps.push(cap(x, y - KH / 2 + 0.55))
  }
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 3, y1: 2.5, x2: 12.9, y2: 21.5, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 0, x2: 0, y2: 1 },
        [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    ['path', { d: tracks, fill: C.c2, ...INK, class: 'wm-k' }],
    ['path', { d: lit, fill: C.c3, ...INK, class: 'wm-k' }],
    ['path', { d: tracks, fill: url(0), class: 'wm-shine' }],
    ['path', { d: knobs, fill: C.c1, ...INK, class: 'wm-a' }],
    ['path', { d: knobs, fill: url(0), class: 'wm-a' }],
    ...caps.map(d => ['path', { d, fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-a' }]),
    ['path', { d: sparkleD(20.4, 2.7, 1.3), fill: C.accent, stroke: C.ink, 'stroke-width': 0.28, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
