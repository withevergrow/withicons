// forge/hand/lunar/bell-ring.mjs — a red lacquer bell with a narrow domed top, a wide flared rim and a gold
// clapper and crown knob, rimmed in gold foil; two jade ring arcs with gold edges swing either side. The generated
// body was a squarish arch.
import { C } from '../../styles/_lunar-core.mjs'

const r2 = v => Math.round(v * 100) / 100
const disc = (cx, cy, r) => `M${r2(cx - r)} ${r2(cy)}a${r2(r)} ${r2(r)} 0 1 0 ${r2(2 * r)} 0a${r2(r)} ${r2(r)} 0 1 0 ${r2(-2 * r)} 0z`
const glint = (x, y, r) => {
  const w = r * 0.09
  return `M${r2(x)} ${r2(y - r)}Q${r2(x + w)} ${r2(y - w)} ${r2(x + r)} ${r2(y)}Q${r2(x + w)} ${r2(y + w)} ${r2(x)} ${r2(y + r)}` +
    `Q${r2(x - w)} ${r2(y + w)} ${r2(x - r)} ${r2(y)}Q${r2(x - w)} ${r2(y - w)} ${r2(x)} ${r2(y - r)}z`
}

export default function render(icon) {
  const id = n => `wg-lunar-${icon.name}-${n}`, url = n => `url(#${id(n)})`
  const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]
  const body = 'M12 4.3C8.8 4.3 7.2 6.7 7.2 9.7V12.8C7.2 14.6 6.2 15.8 4.8 17.1Q4.3 17.6 4.9 18.1L5.4 18.3H18.6L19.1 18.1Q19.7 17.6 19.2 17.1C17.8 15.8 16.8 14.6 16.8 12.8V9.7C16.8 6.7 15.2 4.3 12 4.3Z'
  const arcs = 'M2.5 9.5A10 10 0 0 1 5.5 3.5M21.5 9.5A10 10 0 0 0 18.5 3.5'
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 0, y1: 4.3, x2: 0, y2: 18.3, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['linearGradient', { id: id(1), x1: 2.5, y1: 2.2, x2: 21.5, y2: 21.8, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent), st(0.28, C.shine), st(0.5, C.accent), st(0.78, C.edge), st(1, C.accent)]],
    ]],
    ['path', { d: arcs, fill: 'none', stroke: url(1), 'stroke-width': 3, 'stroke-linecap': 'round', class: 'wm-s' }],
    ['path', { d: arcs, fill: 'none', stroke: C.c3, 'stroke-width': 1.7, 'stroke-linecap': 'round', class: 'wm-s' }],
    ['path', { d: disc(12, 3.3, 1.2), fill: url(1), stroke: C.c2, 'stroke-width': 0.4, class: 'wm-k' }],
    ['path', { d: body, fill: url(0), stroke: url(1), 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: 'M6.1 15.6H17.9', fill: 'none', stroke: C.accent, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: disc(12, 20, 1.7), fill: url(1), stroke: C.c2, 'stroke-width': 0.45, class: 'wm-a' }],
    ['path', { d: glint(9.6, 8.4, 0.9), fill: C.shine, class: 'wm-shine' }],
  ]
}
