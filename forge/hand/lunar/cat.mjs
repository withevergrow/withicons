// forge/hand/lunar/cat.mjs — a red lacquer cat head with two sharp pointed ears (gold-foil inner ears), a plain
// outline, cream oval eyes and a gold nose, rimmed in gold foil; the generated drawing had rounded owl-like ears.
import { C } from '../../styles/_lunar-core.mjs'

const r2 = v => Math.round(v * 100) / 100
const ell = (cx, cy, rx, ry) => `M${r2(cx - rx)} ${r2(cy)}a${r2(rx)} ${r2(ry)} 0 1 0 ${r2(2 * rx)} 0a${r2(rx)} ${r2(ry)} 0 1 0 ${r2(-2 * rx)} 0z`
const glint = (x, y, r) => {
  const w = r * 0.09
  return `M${r2(x)} ${r2(y - r)}Q${r2(x + w)} ${r2(y - w)} ${r2(x + r)} ${r2(y)}Q${r2(x + w)} ${r2(y + w)} ${r2(x)} ${r2(y + r)}` +
    `Q${r2(x - w)} ${r2(y + w)} ${r2(x - r)} ${r2(y)}Q${r2(x - w)} ${r2(y - w)} ${r2(x)} ${r2(y - r)}z`
}

export default function render(icon) {
  const id = n => `wg-lunar-${icon.name}-${n}`, url = n => `url(#${id(n)})`
  const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]
  const head = 'M12 20.6C7 20.6 3.5 18 3.5 13.75C3.5 11.75 3.9 10.25 4.5 9V4L9.5 6.5C10.25 6.25 11.25 6 12 6C12.75 6 13.75 6.25 14.5 6.5L19.5 4V9C20.1 10.25 20.5 11.75 20.5 13.75C20.5 18 17 20.6 12 20.6Z'
  const inner = 'M6.2 8V6.6L8.2 7.6ZM17.8 8V6.6L15.8 7.6Z'
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 0, y1: 4, x2: 0, y2: 20.6, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['linearGradient', { id: id(1), x1: 3.5, y1: 4, x2: 20.5, y2: 20.6, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent), st(0.28, C.shine), st(0.5, C.accent), st(0.78, C.edge), st(1, C.accent)]],
    ]],
    ['path', { d: head, fill: url(0), stroke: url(1), 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: inner, fill: C.accent, stroke: C.accent, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-shine' }],
    ['path', { d: ell(8.5, 12.6, 1.05, 1.6) + ell(15.5, 12.6, 1.05, 1.6), fill: C.tint, class: 'wm-a' }],
    ['path', { d: 'M10.6 15.9H13.4L12 17.4Z', fill: C.accent, stroke: C.c2, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: glint(8.2, 9.6, 0.85), fill: C.shine, class: 'wm-shine' }],
  ]
}
