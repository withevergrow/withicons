// forge/hand/christmas/square.mjs — a cranberry rounded square framed by a thin cream inner border, so it reads as an
// intentional tile or swatch rather than a blob; a scalloped snow cap on the top edge (soft shadow beneath), one holly
// sprig on the snow and a gold sparkle in the free corner. The body is a true square (17 x 17); the generated drawing
// was a plain red block with a thin wobbly cap. House recipe: 0.6 ink outline, shared warm light, snow shine-to-tint.
import { C } from '../../styles/_christmas-core.mjs'

const n = v => Math.round(v * 100) / 100
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const rr = (x0, y0, x1, y1, r) => `M${n(x0 + r)} ${n(y0)}H${n(x1 - r)}A${r} ${r} 0 0 1 ${n(x1)} ${n(y0 + r)}V${n(y1 - r)}A${r} ${r} 0 0 1 ${n(x1 - r)} ${n(y1)}H${n(x0 + r)}A${r} ${r} 0 0 1 ${n(x0)} ${n(y1 - r)}V${n(y0 + r)}A${r} ${r} 0 0 1 ${n(x0 + r)} ${n(y0)}Z`
function sparkleD(x, y, r) {
  const q = r * 0.22
  return `M${n(x)} ${n(y - r)}Q${n(x + q)} ${n(y - q)} ${n(x + r)} ${n(y)}Q${n(x + q)} ${n(y + q)} ${n(x)} ${n(y + r)}` +
    `Q${n(x - q)} ${n(y + q)} ${n(x - r)} ${n(y)}Q${n(x - q)} ${n(y - q)} ${n(x)} ${n(y - r)}Z`
}
// the snow cap as absolute commands so the shadow can be the same outline shifted down
const CAP = [
  ['M', 3.4, 7.3], ['C', 3, 4.7, 4.6, 3.4, 6.6, 3.4], ['H', 16.4], ['C', 18.4, 3.4, 20, 4.7, 19.6, 7.3],
  ['Q', 19.2, 7.9, 18.4, 7.8], ['Q', 17.6, 7.7, 17.4, 8.3], ['C', 17.3, 9.3, 15.9, 9.3, 15.8, 8.3],
  ['Q', 15.7, 7.7, 14.8, 7.7], ['Q', 13.4, 7.8, 12.4, 7.6], ['Q', 11, 7.5, 10, 7.8], ['Q', 9.2, 8, 9, 8.6],
  ['C', 8.9, 9.5, 7.5, 9.5, 7.4, 8.6], ['Q', 7.3, 7.9, 6.5, 7.9], ['Q', 5, 8, 4.3, 7.9], ['Q', 3.5, 7.9, 3.4, 7.3], ['Z'],
]
const capD = dy => CAP.map(([c, ...v]) => c + (c === 'H' ? n(v[0]) : c === 'Z' ? '' : v.map((x, i) => n(i % 2 ? x + dy : x)).join(' '))).join('')
const holly = (x, y) => [
  ['path', { d: `M${n(x)} ${n(y)}q-1.2-1-2.4-.1q1.1 1 2.4 .1zM${n(x)} ${n(y)}q1.2-1 2.4-.1q-1.1 1-2.4 .1z`, fill: C.c2, stroke: C.ink, 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ['circle', { cx: n(x - 0.5), cy: n(y - 0.15), r: 0.52, fill: C.c1, stroke: C.ink, 'stroke-width': 0.28, class: 'wm-deco' }],
  ['circle', { cx: n(x + 0.5), cy: n(y - 0.15), r: 0.52, fill: C.c1, stroke: C.ink, 'stroke-width': 0.28, class: 'wm-deco' }],
  ['circle', { cx: n(x), cy: n(y - 0.8), r: 0.52, fill: C.c1, stroke: C.ink, 'stroke-width': 0.28, class: 'wm-deco' }],
]

export default function render(icon) {
  const name = (icon && icon.name) || 'square'
  const id = k => `wg-christmas-${name}-${k}`, url = k => `url(#${id(k)})`
  const BODY = rr(3, 5, 20, 22, 3.2)
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 3, y1: 3.4, x2: 12.5, y2: 22, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 3.4, x2: 0, y2: 9.2, gradientUnits: 'userSpaceOnUse' },
        [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    ['path', { d: BODY, fill: C.c1, stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: rr(4.9, 6.9, 18.1, 20.1, 1.5), stroke: C.c4, 'stroke-width': 0.9, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: BODY, fill: url(0), class: 'wm-shine' }],
    ['path', { d: capD(0.55), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: capD(0), fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ...holly(13.2, 4.5),
    ['path', { d: sparkleD(21.6, 7.4, 1.45), fill: C.accent, stroke: C.ink, 'stroke-width': 0.28, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
