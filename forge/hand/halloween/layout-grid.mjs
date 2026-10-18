// forge/hand/halloween/layout-grid.mjs — a plain 2x2 grid of witch-purple tiles, each with the style's ink outline and
// top-left shine over one shared halo and drop shadow; the generated grid hung a spider on a thread down the gutter,
// which cluttered the cross of negative space that makes the grid read.
import { C } from '../../styles/_halloween-palettes.mjs'

const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const r2 = v => Math.round(v * 100) / 100
const rr = (x0, y0, x1, y1, r) => {
  ;[x0, y0, x1, y1] = [x0, y0, x1, y1].map(r2)
  return `M${r2(x0 + r)} ${y0}H${r2(x1 - r)}A${r} ${r} 0 0 1 ${x1} ${r2(y0 + r)}V${r2(y1 - r)}A${r} ${r} 0 0 1 ${r2(x1 - r)} ${y1}` +
    `H${r2(x0 + r)}A${r} ${r} 0 0 1 ${x0} ${r2(y1 - r)}V${r2(y0 + r)}A${r} ${r} 0 0 1 ${r2(x0 + r)} ${y0}Z`
}
// a crescent of light just inside a rounded square's top-left corner (inset 0.62, like the generated shine)
const shine = (x0, y0) => {
  const a = r2(x0 + 0.62), b = r2(y0 + 0.62)
  return `M${a} ${r2(b + 4.3)}V${r2(b + 0.88)}A.88 .88 0 0 1 ${r2(a + 0.88)} ${b}H${r2(a + 4.3)}` +
    `Q${r2(a + 3.4)} ${r2(b + 0.52)} ${r2(a + 2.5)} ${r2(b + 0.52)}H${r2(a + 1.2)}A.68 .68 0 0 0 ${r2(a + 0.52)} ${r2(b + 1.2)}` +
    `V${r2(b + 2.5)}Q${r2(a + 0.52)} ${r2(b + 3.4)} ${a} ${r2(b + 4.3)}Z`
}

const TILES = [[3, 3], [14, 3], [3, 14], [14, 14]]

export default function render(icon) {
  const id = n => `wg-halloween-${icon.name}-${n}`, url = n => `url(#${id(n)})`
  return [
    ['defs', {}, [
      // body: witch purple, lit from the upper left, deep at the edges
      ['radialGradient', { id: id(0), cx: 12, cy: 13.44, r: 11.88, fx: 9.12, fy: 8.76, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.c3), st(0.45, C.c3), st(1, C.edge)]],
      // halo
      ['radialGradient', { id: id(1), cx: 12, cy: 12.9, r: 12, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(1), class: 'wm-deco' }],
    ['path', { d: TILES.map(([x, y]) => rr(x + 0.15, y + 0.85, x + 7.15, y + 7.85, 1.5)).join(''), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: TILES.map(([x, y]) => rr(x, y, x + 7, y + 7, 1.5)).join(''), fill: url(0), stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: TILES.map(([x, y]) => shine(x, y)).join(''), fill: C.shine, 'fill-opacity': 0.45, class: 'wm-shine' }],
  ]
}
