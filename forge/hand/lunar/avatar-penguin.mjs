// forge/hand/lunar/avatar-penguin.mjs: a lacquer-red penguin: deep crimson flippers behind a red body, a cream belly,
// cream eyes with lacquer pupils, a gold beak and gold feet, one foil glint. The generated drawing was a cream blob
// buried under red ornament; here silhouette, belly, face and beak each read on their own at 16px.
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
  const body = 'M12 2.5C16 2.5 18 5.75 18 10V15.5C18 17.75 15.5 19 12 19C8.5 19 6 17.75 6 15.5V10C6 5.75 8 2.5 12 2.5Z'
  const flipL = 'M6.2 10.6C4.3 11.7 3.2 14.1 3.5 16.9C4.6 16.6 5.6 15.9 6.2 15Z'
  const flipR = 'M17.8 10.6C19.7 11.7 20.8 14.1 20.5 16.9C19.4 16.6 18.4 15.9 17.8 15Z'
  const belly = 'M12 12.2C15 12.2 16.1 14.6 15.7 17C14.9 17.7 13.5 18 12 18C10.5 18 9.1 17.7 8.3 17C7.9 14.6 9 12.2 12 12.2Z'
  const beak = 'M10.4 8.9Q10.2 8.6 10.6 8.6H13.4Q13.8 8.6 13.6 8.9L12.3 11Q12 11.4 11.7 11L10.4 8.9Z'
  const feet = 'M8.6 20.4H10.4Q11.2 20.4 11.2 21.2Q11.2 22 10.4 22H8.6Q7.8 22 7.8 21.2Q7.8 20.4 8.6 20.4Z' +
    'M13.6 20.4H15.4Q16.2 20.4 16.2 21.2Q16.2 22 15.4 22H13.6Q12.8 22 12.8 21.2Q12.8 20.4 13.6 20.4Z'
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 0, y1: 2.5, x2: 0, y2: 22, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['linearGradient', { id: id(1), x1: 3.5, y1: 2.5, x2: 20.5, y2: 22, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent), st(0.28, C.shine), st(0.5, C.accent), st(0.78, C.edge), st(1, C.accent)]],
    ]],
    // feet peek out below the body
    ['path', { d: feet, fill: url(1), ...line, class: 'wm-k' }],
    // flippers in deep lacquer, tucked behind the body (they rock)
    ['path', { d: flipL + flipR, fill: C.c2, ...rim, class: 'wm-a' }],
    // body
    ['path', { d: body, fill: url(0), ...rim, class: 'wm-k' }],
    // cream belly
    ['path', { d: belly, fill: C.tint, ...line, class: 'wm-k' }],
    // eyes
    ['path', { d: disc(9.25, 6, 1) + disc(14.75, 6, 1), fill: C.tint, class: 'wm-k' }],
    ['path', { d: disc(9.4, 6.15, 0.5) + disc(14.6, 6.15, 0.5), fill: C.c2, class: 'wm-k' }],
    // gold beak
    ['path', { d: beak, fill: url(1), ...line, class: 'wm-k' }],
    // foil glint, upper left of the head
    ['path', { d: glint(7.9, 3.9, 0.9), fill: C.shine, class: 'wm-shine' }],
  ]
}
