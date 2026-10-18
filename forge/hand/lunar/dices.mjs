// forge/hand/lunar/dices.mjs: two lacquer dice: a gold foil die behind at upper right with one red pip, and a red die in
// front at lower left carrying three clear diagonal pips; the generated drawing had a swirl instead of pips.
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
  const rim = { stroke: url(1), 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
  const line = { stroke: C.c2, 'stroke-width': 0.42, 'stroke-linejoin': 'round' }
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 0, y1: 10, x2: 0, y2: 21, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['linearGradient', { id: id(1), x1: 3, y1: 3, x2: 21, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent), st(0.28, C.shine), st(0.5, C.accent), st(0.78, C.edge), st(1, C.accent)]],
    ]],
    // back die, gold foil
    ['rect', { x: 10, y: 3, width: 11, height: 11, rx: 2.4, fill: url(1), ...line, class: 'wm-a' }],
    ['path', { d: disc(16.5, 7.5, 1.2), fill: C.c2, class: 'wm-a' }],
    // front die, red lacquer with a gold rim
    ['rect', { x: 3, y: 10, width: 11, height: 11, rx: 2.4, fill: url(0), ...rim, class: 'wm-k' }],
    ['rect', { x: 4.4, y: 11.4, width: 8.2, height: 8.2, rx: 1.4, fill: 'none', stroke: C.accent, 'stroke-width': 0.3, class: 'wm-shine' }],
    ['path', { d: disc(6.2, 13.2, 1.15) + disc(8.5, 15.5, 1.15) + disc(10.8, 17.8, 1.15), fill: C.shine, class: 'wm-shine' }],
    ['path', { d: glint(2.6, 9.6, 0.9), fill: C.shine, class: 'wm-shine' }],
  ]
}
