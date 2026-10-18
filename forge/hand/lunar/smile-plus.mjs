// forge/hand/lunar/smile-plus.mjs: a red lacquer face disc with a gold rim, two cream eyes and a plain cream smile arc,
// and a jade plus badge at the upper right; the generated drawing turned the face into a clown-nosed blob.
import { C } from '../../styles/_lunar-core.mjs'

const r2 = v => Math.round(v * 100) / 100
const disc = (cx, cy, r) => `M${r2(cx - r)} ${r2(cy)}a${r2(r)} ${r2(r)} 0 1 0 ${r2(2 * r)} 0a${r2(r)} ${r2(r)} 0 1 0 ${r2(-2 * r)} 0z`
const glint = (x, y, r) => {
  const w = r * 0.09
  return `M${r2(x)} ${r2(y - r)}Q${r2(x + w)} ${r2(y - w)} ${r2(x + r)} ${r2(y)}Q${r2(x + w)} ${r2(y + w)} ${r2(x)} ${r2(y + r)}` +
    `Q${r2(x - w)} ${r2(y + w)} ${r2(x - r)} ${r2(y)}Q${r2(x - w)} ${r2(y - w)} ${r2(x)} ${r2(y - r)}z`
}
const ell = (cx, cy, rx, ry) => `M${r2(cx - rx)} ${r2(cy)}a${rx} ${ry} 0 1 0 ${r2(2 * rx)} 0a${rx} ${ry} 0 1 0 ${r2(-2 * rx)} 0z`

export default function render(icon) {
  const id = n => `wg-lunar-${icon.name}-${n}`, url = n => `url(#${id(n)})`
  const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]
  const rim = { stroke: url(1), 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
  const plus = 'M18.55 2.1H20.45V3.55H21.9V5.45H20.45V6.9H18.55V5.45H17.1V3.55H18.55Z'
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 0, y1: 5.1, x2: 0, y2: 21.9, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['linearGradient', { id: id(1), x1: 2.1, y1: 2.1, x2: 21.9, y2: 21.9, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent), st(0.28, C.shine), st(0.5, C.accent), st(0.78, C.edge), st(1, C.accent)]],
    ]],
    ['path', { d: disc(10.5, 13.5, 8.4), fill: url(0), ...rim, class: 'wm-k' }],
    ['path', { d: disc(10.5, 13.5, 7.3), fill: 'none', stroke: C.accent, 'stroke-width': 0.3, class: 'wm-shine' }],
    ['path', { d: ell(7.6, 11.4, 1.05, 1.3) + ell(13.4, 11.4, 1.05, 1.3), fill: C.tint, class: 'wm-a' }],
    ['path', { d: 'M6.6 15.2A4.6 4.6 0 0 0 14.4 15.2', fill: 'none', stroke: C.tint, 'stroke-width': 1.3, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: plus, fill: C.c3, ...rim, class: 'wm-s' }],
    ['path', { d: glint(5.9, 8, 0.95), fill: C.shine, class: 'wm-shine' }],
  ]
}
