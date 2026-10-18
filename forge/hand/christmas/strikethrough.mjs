// forge/hand/christmas/strikethrough.mjs — a chunky cranberry letter S with a gold bar struck clean through it:
// the generated drawing was one gold ribbon curl with a tail, so neither the letter nor the strike read. The S is one
// round-jointed stroke (ink under cranberry), the bar is a gold pill with an ink outline running past both sides of the
// glyph (wm-a, so it nudges), a small snow cap rests on the S's top bowl and a gold sparkle sits in the free corner.
import { C } from '../../styles/_christmas-core.mjs'

const n = v => Math.round(v * 100) / 100
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const rr = (x0, y0, x1, y1, r) => `M${n(x0 + r)} ${n(y0)}H${n(x1 - r)}A${r} ${r} 0 0 1 ${n(x1)} ${n(y0 + r)}V${n(y1 - r)}A${r} ${r} 0 0 1 ${n(x1 - r)} ${n(y1)}H${n(x0 + r)}A${r} ${r} 0 0 1 ${n(x0)} ${n(y1 - r)}V${n(y0 + r)}A${r} ${r} 0 0 1 ${n(x0 + r)} ${n(y0)}Z`
function sparkleD(x, y, r) {
  const q = r * 0.22
  return `M${n(x)} ${n(y - r)}Q${n(x + q)} ${n(y - q)} ${n(x + r)} ${n(y)}Q${n(x + q)} ${n(y + q)} ${n(x)} ${n(y + r)}` +
    `Q${n(x - q)} ${n(y + q)} ${n(x - r)} ${n(y)}Q${n(x - q)} ${n(y - q)} ${n(x)} ${n(y - r)}Z`
}
const S = 'M17.4 7.6C16.5 6 14.6 5.2 12.2 5.2C9 5.2 6.9 6.6 6.9 8.6C6.9 10.4 8.7 11.4 12 12C15.3 12.6 17.2 13.6 17.2 15.5C17.2 17.5 15 18.9 11.9 18.9C9.6 18.9 7.7 18.2 6.6 16.6'
// snow resting on the top bowl of the S: a soft dome with two drips
const SNOW = 'M8.9 4.3C9.5 2.3 11 1.6 12.4 1.6C14 1.6 15.4 2.4 16 4.2Q15.4 4.8 14.8 4.5C14.8 5.5 13.8 5.5 13.7 4.6Q13 4.9 12.3 4.6C12.2 5.5 11.2 5.5 11.1 4.6Q10 4.9 8.9 4.3Z'
const SNOWSH = 'M10.3 4.7Q11 4.9 11.1 4.6C11.2 5.5 12.2 5.5 12.3 4.6Q13 4.9 13.7 4.6C13.8 5.5 14.8 5.5 14.8 4.5Q15.4 4.8 16 4.2L15.8 3.6Q14.9 4.1 14 3.8Q12 4.4 10.3 4.7Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'strikethrough'
  const id = k => `wg-christmas-${name}-${k}`, url = k => `url(#${id(k)})`
  const R = { 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  const BAR = rr(2.4, 10.8, 21.6, 13.2, 1.2)
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 4, y1: 3, x2: 14, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 1.4, x2: 0, y2: 5.4, gradientUnits: 'userSpaceOnUse' },
        [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    ['path', { d: S, stroke: C.ink, 'stroke-width': 3.9, ...R, class: 'wm-k' }],
    ['path', { d: S, stroke: C.c1, 'stroke-width': 2.7, ...R, class: 'wm-k' }],
    ['path', { d: S, stroke: url(0), 'stroke-width': 2.7, ...R, class: 'wm-shine' }],
    ['path', { d: BAR, fill: C.c3, stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: BAR, fill: url(0), class: 'wm-a wm-shine' }],
    ['path', { d: SNOWSH, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: SNOW, fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: sparkleD(20, 4.6, 1.45), fill: C.accent, stroke: C.ink, 'stroke-width': 0.28, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
