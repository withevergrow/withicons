// forge/hand/halloween/folder-open.mjs — an open folder: a witch-purple back with its tab, and a candle-lit pumpkin
// front flap swung open over it (its top edge well below the back's, its right edge overhanging), in the style's halo,
// drop shadow, midnight outline and top-left shine. The generated drawing painted back and flap the same orange,
// split only by a thin glowing seam, so at 16px the open flap merged into a closed folder.
// Roles: back c3 -> edge, flap c1 -> c2, outline ink, halo accent, shine shine, shadow shadow.
// Motion: back wm-a (the spec sways parts.A about [5, 20]), flap wm-k.
import { C } from '../../styles/_halloween-palettes.mjs'

const NAME = 'folder-open'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
const r = v => Math.round(v * 100) / 100

// the skeleton's fills grown 0.85u
const back = (dx, dy) => {
  const p = (x, y) => `${r(x + dx)} ${r(y + dy)}`
  return `M${p(5, 20.85)}A2.85 2.85 0 0 1 ${p(2.15, 18)}V${r(7 + dy)}A2.85 2.85 0 0 1 ${p(5, 4.15)}H${r(8.75 + dx)}` +
    `A1 1 0 0 1 ${p(9.46, 4.44)}L${p(11.17, 6.15)}H${r(17 + dx)}A2.85 2.85 0 0 1 ${p(19.85, 9)}V${r(18 + dy)}` +
    `A2.85 2.85 0 0 1 ${p(17, 20.85)}Z`
}
const flap = (dx, dy) => {
  const p = (x, y) => `${r(x + dx)} ${r(y + dy)}`
  return `M${p(8.62, 10.65)}H${r(19.5 + dx)}A2.35 2.35 0 0 1 ${p(21.75, 13.66)}L${p(20.23, 18.8)}A2.85 2.85 0 0 1 ${p(17.5, 20.85)}` +
    `H${r(4.94 + dx)}A.8 .8 0 0 1 ${p(4.17, 19.82)}L${p(6.37, 12.34)}A2.35 2.35 0 0 1 ${p(8.62, 10.65)}Z`
}

export default function render() {
  return [
    ['defs', {}, [
      // back: witch purple
      ['radialGradient', { id: id(0), cx: 11, cy: 13.84, r: 11.1, fx: 8.17, fy: 9.47, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.c3), st(0.45, C.c3), st(1, C.edge)]],
      // flap: pumpkin, lit from inside and from the upper left
      ['radialGradient', { id: id(1), cx: 12.96, cy: 16.53, r: 11.8, fx: 10.07, fy: 13.89, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['radialGradient', { id: id(2), cx: 11.95, cy: 13.05, r: 12, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: back(0.15, 0.85) + flap(0.15, 0.85), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: back(0, 0), fill: url(0), ...INK, class: 'wm-a' }],
    ['path', { d: 'M3.05 15.5V7A1.95 1.95 0 0 1 5 5.05H8.4', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.45, 'stroke-width': 0.8, class: 'wm-shine' }],
    ['path', { d: flap(0, 0), fill: url(1), ...INK, class: 'wm-k' }],
    ['path', { d: 'M6.67 14.5L7.23 12.59A1.45 1.45 0 0 1 8.62 11.55H14', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.8, class: 'wm-shine' }],
  ]
}
