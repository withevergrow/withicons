// forge/hand/lunar/scan-face.mjs — face unlock in red lacquer: four gold-edged lacquer scan corners round a red
// lacquer face disc with a gold-foil rim, two cream eyes and a cream smile; replaces the generated dragon-mask look.
import { C } from '../../styles/_lunar-core.mjs'

const r2 = v => Math.round(v * 100) / 100
const disc = (cx, cy, r) => `M${r2(cx - r)} ${r2(cy)}a${r2(r)} ${r2(r)} 0 1 0 ${r2(2 * r)} 0a${r2(r)} ${r2(r)} 0 1 0 ${r2(-2 * r)} 0z`
const ell = (cx, cy, rx, ry) => `M${r2(cx - rx)} ${r2(cy)}a${r2(rx)} ${r2(ry)} 0 1 0 ${r2(2 * rx)} 0a${r2(rx)} ${r2(ry)} 0 1 0 ${r2(-2 * rx)} 0z`
const glint = (x, y, r) => {
  const w = r * 0.09
  return `M${r2(x)} ${r2(y - r)}Q${r2(x + w)} ${r2(y - w)} ${r2(x + r)} ${r2(y)}Q${r2(x + w)} ${r2(y + w)} ${r2(x)} ${r2(y + r)}` +
    `Q${r2(x - w)} ${r2(y + w)} ${r2(x - r)} ${r2(y)}Q${r2(x - w)} ${r2(y - w)} ${r2(x)} ${r2(y - r)}z`
}

export default function render(icon) {
  const id = n => `wg-lunar-${icon.name}-${n}`, url = n => `url(#${id(n)})`
  const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]
  const corners = 'M3 7.5V5A2 2 0 0 1 5 3H7.5M16.5 3H19A2 2 0 0 1 21 5V7.5M21 16.5V19A2 2 0 0 1 19 21H16.5M7.5 21H5A2 2 0 0 1 3 19V16.5'
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 0, y1: 5.9, x2: 0, y2: 18.1, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['linearGradient', { id: id(1), x1: 3, y1: 3, x2: 21, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent), st(0.28, C.shine), st(0.5, C.accent), st(0.78, C.edge), st(1, C.accent)]],
    ]],
    // scan corners: a gold edge under a red lacquer core
    ['path', { d: corners, fill: 'none', stroke: url(1), 'stroke-width': 3.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: corners, fill: 'none', stroke: C.c1, 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-k' }],
    // the face
    ['path', { d: disc(12, 12, 6.1), fill: url(0), stroke: url(1), 'stroke-width': 0.6, class: 'wm-k' }],
    ['path', { d: ell(9, 10.2, 0.95, 1.4) + ell(15, 10.2, 0.95, 1.4), fill: C.tint, class: 'wm-a' }],
    ['path', { d: 'M9 14.2A3.4 3.4 0 0 0 15 14.2', fill: 'none', stroke: C.tint, 'stroke-width': 1.3, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: glint(6.9, 8.2, 0.8), fill: C.shine, class: 'wm-shine' }],
  ]
}
