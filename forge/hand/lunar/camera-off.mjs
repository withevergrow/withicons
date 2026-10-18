// forge/hand/lunar/camera-off.mjs: a lacquer-red camera (body, viewfinder bump) with a gold lens ring round a deep red
// lens and a gold flash dot, crossed by one slim jade slash; the generated drawing read as a folder.
import { C } from '../../styles/_lunar-core.mjs'

const r2 = v => Math.round(v * 100) / 100
const disc = (cx, cy, r) => `M${r2(cx - r)} ${r2(cy)}a${r2(r)} ${r2(r)} 0 1 0 ${r2(2 * r)} 0a${r2(r)} ${r2(r)} 0 1 0 ${r2(-2 * r)} 0z`
const glint = (x, y, r) => {
  const w = r * 0.09
  return `M${r2(x)} ${r2(y - r)}Q${r2(x + w)} ${r2(y - w)} ${r2(x + r)} ${r2(y)}Q${r2(x + w)} ${r2(y + w)} ${r2(x)} ${r2(y + r)}` +
    `Q${r2(x - w)} ${r2(y + w)} ${r2(x - r)} ${r2(y)}Q${r2(x - w)} ${r2(y - w)} ${r2(x)} ${r2(y - r)}z`
}
// a capsule (rounded bar) from (x1,y1) to (x2,y2) with half-width h
const capsule = (x1, y1, x2, y2, h) => {
  const L = Math.hypot(x2 - x1, y2 - y1), nx = (y2 - y1) / L * h, ny = -(x2 - x1) / L * h
  return `M${r2(x1 + nx)} ${r2(y1 + ny)}L${r2(x2 + nx)} ${r2(y2 + ny)}A${h} ${h} 0 0 1 ${r2(x2 - nx)} ${r2(y2 - ny)}` +
    `L${r2(x1 - nx)} ${r2(y1 - ny)}A${h} ${h} 0 0 1 ${r2(x1 + nx)} ${r2(y1 + ny)}z`
}

export default function render(icon) {
  const id = n => `wg-lunar-${icon.name}-${n}`, url = n => `url(#${id(n)})`
  const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]
  const rim = { stroke: url(1), 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
  const body = 'M4 6.5H7.5L9 4H15L16.5 6.5H20A2 2 0 0 1 22 8.5V18.5A2 2 0 0 1 20 20.5H4A2 2 0 0 1 2 18.5V8.5A2 2 0 0 1 4 6.5Z'
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 0, y1: 4, x2: 0, y2: 20.5, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['linearGradient', { id: id(1), x1: 2, y1: 3, x2: 22, y2: 21.5, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent), st(0.28, C.shine), st(0.5, C.accent), st(0.78, C.edge), st(1, C.accent)]],
    ]],
    ['path', { d: body, fill: url(0), ...rim, class: 'wm-k' }],
    ['path', { d: disc(12, 13.5, 3.3), fill: C.c2, stroke: url(1), 'stroke-width': 1.1, class: 'wm-a' }],
    ['path', { d: disc(18.4, 9.4, 0.75), fill: C.accent, class: 'wm-shine' }],
    ['path', { d: capsule(3.6, 4.1, 20.4, 20.9, 0.9), fill: C.c3, ...rim, class: 'wm-s' }],
    ['path', { d: glint(5.4, 8.9, 0.9), fill: C.shine, class: 'wm-shine' }],
  ]
}
