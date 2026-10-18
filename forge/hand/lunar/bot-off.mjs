// forge/hand/lunar/bot-off.mjs — a robot in red lacquer: full rounded-square head with a gold-foil rim, an antenna
// with a gold bulb, gold ear pads, two cream eyes and a cream mouth, struck through by a jade slash with gold edges;
// the generated drawing was a faceless wedge.
import { C } from '../../styles/_lunar-core.mjs'

const r2 = v => Math.round(v * 100) / 100
const disc = (cx, cy, r) => `M${r2(cx - r)} ${r2(cy)}a${r2(r)} ${r2(r)} 0 1 0 ${r2(2 * r)} 0a${r2(r)} ${r2(r)} 0 1 0 ${r2(-2 * r)} 0z`
const rr = (x0, y0, x1, y1, r) => `M${r2(x0 + r)} ${r2(y0)}H${r2(x1 - r)}A${r} ${r} 0 0 1 ${r2(x1)} ${r2(y0 + r)}V${r2(y1 - r)}` +
  `A${r} ${r} 0 0 1 ${r2(x1 - r)} ${r2(y1)}H${r2(x0 + r)}A${r} ${r} 0 0 1 ${r2(x0)} ${r2(y1 - r)}V${r2(y0 + r)}A${r} ${r} 0 0 1 ${r2(x0 + r)} ${r2(y0)}Z`
const glint = (x, y, r) => {
  const w = r * 0.09
  return `M${r2(x)} ${r2(y - r)}Q${r2(x + w)} ${r2(y - w)} ${r2(x + r)} ${r2(y)}Q${r2(x + w)} ${r2(y + w)} ${r2(x)} ${r2(y + r)}` +
    `Q${r2(x - w)} ${r2(y + w)} ${r2(x - r)} ${r2(y)}Q${r2(x - w)} ${r2(y - w)} ${r2(x)} ${r2(y - r)}z`
}

export default function render(icon) {
  const id = n => `wg-lunar-${icon.name}-${n}`, url = n => `url(#${id(n)})`
  const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]
  const slash = 'M3.5 3.5L20.5 20.5'
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 0, y1: 8, x2: 0, y2: 20.5, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['linearGradient', { id: id(1), x1: 2, y1: 2.3, x2: 22, y2: 21.5, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent), st(0.28, C.shine), st(0.5, C.accent), st(0.78, C.edge), st(1, C.accent)]],
    ]],
    // antenna and ear pads behind the head
    ['path', { d: 'M12 8V5', fill: 'none', stroke: url(1), 'stroke-width': 1.5, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: disc(12, 3.6, 1.45), fill: url(1), stroke: C.c2, 'stroke-width': 0.42, class: 'wm-a' }],
    ['path', { d: rr(2.2, 11.8, 5.2, 16.8, 1.1) + rr(18.8, 11.8, 21.8, 16.8, 1.1), fill: url(1), stroke: C.c2, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-a' }],
    // the head
    ['path', { d: rr(5, 8, 19, 20.5, 3), fill: url(0), stroke: url(1), 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: disc(8.7, 13, 1.2) + disc(15.3, 13, 1.2), fill: C.tint, class: 'wm-a' }],
    ['path', { d: 'M9.5 17H14.5', fill: 'none', stroke: C.tint, 'stroke-width': 1.3, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: glint(7.1, 9.9, 0.8), fill: C.shine, class: 'wm-shine' }],
    // the slash
    ['path', { d: slash, fill: 'none', stroke: url(1), 'stroke-width': 3.4, 'stroke-linecap': 'round', class: 'wm-s' }],
    ['path', { d: slash, fill: 'none', stroke: C.c3, 'stroke-width': 2, 'stroke-linecap': 'round', class: 'wm-s' }],
  ]
}
