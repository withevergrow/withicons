// forge/hand/lunar/bell-off.mjs: a full lacquer-red bell (dome, flared rim, gold clapper) crossed by a jade slash with
// the gold-foil rim; the generated drawing cut the bell into a red half-dome.
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
  const line = { stroke: C.c2, 'stroke-width': 0.42, 'stroke-linejoin': 'round' }
  const bell = 'M12 3.6A6 6 0 0 1 18 9.6V14.2L19.6 16.7Q20.2 18.2 18.7 18.2H5.3Q3.8 18.2 4.4 16.7L6 14.2V9.6A6 6 0 0 1 12 3.6Z'
  const clapper = 'M9.5 19.4H14.5A2.5 2.5 0 0 1 9.5 19.4Z'
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 0, y1: 3.6, x2: 0, y2: 18.2, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['linearGradient', { id: id(1), x1: 3, y1: 2.5, x2: 21, y2: 21.5, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent), st(0.28, C.shine), st(0.5, C.accent), st(0.78, C.edge), st(1, C.accent)]],
    ]],
    ['path', { d: disc(12, 3, 0.95), fill: url(1), ...line, class: 'wm-a' }],
    ['path', { d: bell, fill: url(0), ...rim, class: 'wm-k' }],
    ['path', { d: 'M5.2 15.7H18.8', fill: 'none', stroke: C.accent, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: clapper, fill: url(1), ...line, class: 'wm-a' }],
    ['path', { d: capsule(3.9, 3.9, 20.1, 20.1, 0.95), fill: C.c3, ...rim, class: 'wm-s' }],
    ['path', { d: glint(8.2, 7.4, 0.95), fill: C.shine, class: 'wm-shine' }],
  ]
}
