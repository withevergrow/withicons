// forge/hand/lunar/avatar-ghost.mjs: a cream rice-paper ghost with a lacquer-red rim and the scalloped hem, two round
// lacquer eyes and a small open mouth; the generated drawing put a three-circle swirl on its face.
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
  const body = 'M5 20V11A7 7 0 0 1 19 11V20C19 20.75 18.5 21 17.75 20.5L16.75 19.75C16 19.25 15.5 19.25 14.75 19.75L13.25 20.75C12.5 21.25 11.5 21.25 10.75 20.75L9.25 19.75C8.5 19.25 8 19.25 7.25 19.75L6.25 20.5C5.5 21 5 20.75 5 20Z'
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 0, y1: 4, x2: 0, y2: 21.2, gradientUnits: 'userSpaceOnUse' }, [st(0, C.tint), st(0.6, C.tint), st(1, C.shine)]],
      ['linearGradient', { id: id(1), x1: 5, y1: 4, x2: 19, y2: 21.2, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent), st(0.28, C.shine), st(0.5, C.accent), st(0.78, C.edge), st(1, C.accent)]],
    ]],
    ['path', { d: body, fill: url(0), stroke: C.c1, 'stroke-width': 0.9, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: 'M7.1 9.6A5 5 0 0 1 12 6', fill: 'none', stroke: url(1), 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: disc(9.5, 11.2, 1.15) + disc(14.5, 11.2, 1.15), fill: C.c2, class: 'wm-a' }],
    ['path', { d: 'M11 14.1a1 1.35 0 1 0 2 0a1 1.35 0 1 0 -2 0z', fill: C.c1, class: 'wm-a' }],
    ['path', { d: glint(7.2, 6.8, 0.8), fill: C.shine, class: 'wm-shine' }],
  ]
}
