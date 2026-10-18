// forge/hand/christmas/settings-2.mjs — two chunky pine tracks lit gold up to big round cranberry knobs with a cream
// centre; one generous snow cap sits on the top knob only, the tracks stay bare so the pair reads as two bold sliders
// at 16px (the earlier drawing had thin tracks, small knobs and a cap on each knob). House recipe as sliders: 0.6 ink
// outline, shared warm light, snow shine-to-tint, one gold sparkle. Knobs carry wm-a so they still glide along tracks.
import { C } from '../../styles/_christmas-core.mjs'

const n = v => Math.round(v * 100) / 100
const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const rr = (x0, y0, x1, y1, r) => `M${n(x0 + r)} ${n(y0)}H${n(x1 - r)}A${r} ${r} 0 0 1 ${n(x1)} ${n(y0 + r)}V${n(y1 - r)}A${r} ${r} 0 0 1 ${n(x1 - r)} ${n(y1)}H${n(x0 + r)}A${r} ${r} 0 0 1 ${n(x0)} ${n(y1 - r)}V${n(y0 + r)}A${r} ${r} 0 0 1 ${n(x0 + r)} ${n(y0)}Z`
const disc = (x, y, r) => `M${n(x - r)} ${n(y)}a${r} ${r} 0 1 0 ${n(2 * r)} 0a${r} ${r} 0 1 0 ${n(-2 * r)} 0Z`
// a small snow cap on a knob's round top (cx, top y): a soft dome with one drip
const cap = (cx, y, k = 1) => {
  const X = v => n(cx + v * k), Y = v => n(y + v * k)
  return `M${X(-2.2)} ${Y(1.05)}C${X(-2.35)} ${Y(-0.6)} ${X(-1.1)} ${Y(-1.05)} ${X(0)} ${Y(-1.05)}` +
    `C${X(1.1)} ${Y(-1.05)} ${X(2.35)} ${Y(-0.6)} ${X(2.2)} ${Y(1.05)}` +
    `Q${X(1.6)} ${Y(1.4)} ${X(1.05)} ${Y(1.25)}C${X(1.05)} ${Y(2.2)} ${X(0.05)} ${Y(2.2)} ${X(0.05)} ${Y(1.3)}` +
    `Q${X(-1)} ${Y(1.5)} ${X(-2.2)} ${Y(1.05)}Z`
}
function sparkleD(x, y, r) {
  const q = r * 0.22
  return `M${n(x)} ${n(y - r)}Q${n(x + q)} ${n(y - q)} ${n(x + r)} ${n(y)}Q${n(x + q)} ${n(y + q)} ${n(x)} ${n(y + r)}` +
    `Q${n(x - q)} ${n(y + q)} ${n(x - r)} ${n(y)}Q${n(x - q)} ${n(y - q)} ${n(x)} ${n(y - r)}Z`
}

const ROWS = [[7, 8.5], [17, 15.5]]
const TW = 3, KR = 4

export default function render(icon) {
  const name = (icon && icon.name) || 'settings-2'
  const id = k => `wg-christmas-${name}-${k}`, url = k => `url(#${id(k)})`
  let tracks = '', lit = '', knobs = '', dots = ''
  for (const [y, x] of ROWS) {
    tracks += rr(2, y - TW / 2, 22, y + TW / 2, TW / 2)
    lit += rr(2, y - TW / 2, x, y + TW / 2, TW / 2)
    knobs += disc(x, y, KR)
    dots += disc(x, y + 0.5, 1.5)
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
    ['path', { d: dots, fill: C.c4, stroke: C.ink, 'stroke-width': 0.4, class: 'wm-a' }],
    ['path', { d: knobs, fill: url(0), class: 'wm-a' }],
    ['path', { d: cap(ROWS[0][1], ROWS[0][0] - KR + 0.35, 1.05), fill: url(1), stroke: C.ink, 'stroke-width': 0.45, 'stroke-linejoin': 'round', class: 'wm-a wm-deco' }],
    ['path', { d: sparkleD(20.3, 2.9, 1.4), fill: C.accent, stroke: C.ink, 'stroke-width': 0.28, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
