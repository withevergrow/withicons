// forge/hand/rangoli/user-circle.mjs: a thick festive-glow ring (same c1 -> c2 glow as the body, not a pale rim)
// around a person bust kept clear of the ring; small shine dots on the ring stand in for the corner flower.
import { col } from '../../styles/_rangoli-core.mjs'
import { disc } from '../../styles/_rangoli-motifs.mjs'

const NAME = 'user-circle'
const id = n => `wg-rangoli-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]
const r2 = v => Math.round(v * 100) / 100

const ring = (dy = 0) => {
  const y = r2(12 + dy)
  return `M1.75 ${y}a10.25 10.25 0 1 0 20.5 0a10.25 10.25 0 1 0 -20.5 0zM4.75 ${y}a7.25 7.25 0 1 1 14.5 0a7.25 7.25 0 1 1 -14.5 0z`
}
const person = (dy = 0) => {
  const y = v => r2(v + dy)
  return disc(12, y(9.5), 3.1) +
    `M7.9 ${y(16.9)}C8.5 ${y(15)} 10 ${y(14.1)} 12 ${y(14.1)}C14 ${y(14.1)} 15.5 ${y(15)} 16.1 ${y(16.9)}` +
    `A6.2 6.2 0 0 1 7.9 ${y(16.9)}Z`
}

export default function render() {
  const dots = [[45], [135], [315]].map(([a]) => {
    const t = a * Math.PI / 180
    return disc(r2(12 + 8.75 * Math.cos(t)), r2(12 + 8.75 * Math.sin(t)), 0.55)
  }).join('')
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 8, cy: 6.5, r: 19, gradientUnits: 'userSpaceOnUse' },
        [st(0, col('c1')), st(0.3, col('c1')), st(1, col('c2'))]],
    ]],
    ['path', { d: ring(0.5) + person(0.5), fill: col('shadow'), 'fill-opacity': 0.5, 'fill-rule': 'evenodd', class: 'wm-shadow' }],
    ['path', { d: ring(), fill: url(0), 'fill-rule': 'evenodd', class: 'wm-k' }],
    ['path', { d: person(), fill: url(0), class: 'wm-k' }],
    ['path', { d: 'M3.5 10.3A8.75 8.75 0 0 1 10.3 3.5', stroke: col('shine'), 'stroke-opacity': 0.75, 'stroke-width': 0.8, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
    ['path', { d: dots, fill: col('shine'), 'fill-opacity': 0.9, class: 'wm-deco' }],
  ]
}
