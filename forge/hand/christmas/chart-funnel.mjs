// forge/hand/christmas/chart-funnel.mjs — red funnel with cream divider bands (stages), clear green stem, a small snow dab on the rim.
const V = (r, h) => `var(--with-christmas-${r}, ${h})`
const INK = V('ink', '#3A0F17'), C1 = V('c1', '#C8203A'), C2 = V('c2', '#1F6E46'), C3 = V('c3', '#E2A93B'), C4 = V('c4', '#FFF5E6')
const SHINE = V('shine', '#FFFFFF'), SHADOW = V('shadow', '#4A0716')
const K = { stroke: INK, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const f = n => +n.toFixed(2)
const grad = (id, y1, y2) => ['defs', {}, [
  ['linearGradient', { id, x1: 0, y1, x2: 0, y2, gradientUnits: 'userSpaceOnUse' }, [
    ['stop', { offset: 0, 'stop-color': SHINE, 'stop-opacity': 0.3 }],
    ['stop', { offset: 0.45, 'stop-color': SHINE, 'stop-opacity': 0 }],
    ['stop', { offset: 0.6, 'stop-color': SHADOW, 'stop-opacity': 0 }],
    ['stop', { offset: 1, 'stop-color': SHADOW, 'stop-opacity': 0.38 }],
  ]],
]]
const spark = (x, y, r) => ['path', { d: `M${x} ${f(y - r)}Q${x} ${y} ${f(x + r)} ${y}Q${x} ${y} ${x} ${f(y + r)}Q${x} ${y} ${f(x - r)} ${y}Q${x} ${y} ${x} ${f(y - r)}Z`, fill: C3, stroke: INK, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-deco' }]

export default function render(icon) {
  const id = n => `wg-christmas-${icon.name}-${n}`
  const body = 'M4 4.4L20 4.4Q21.3 4.4 20.7 5.5L14.6 13.4L9.4 13.4L3.3 5.5Q2.7 4.4 4 4.4Z'
  const stem = 'M9.4 13L14.6 13L14.6 20.2Q14.6 21.5 13.3 21.5L10.7 21.5Q9.4 21.5 9.4 20.2Z'
  return [
    grad(id(0), 4, 21.5),
    ['path', { d: stem, fill: C2, ...K, class: 'wm-k' }],
    ['path', { d: stem, fill: `url(#${id(0)})`, class: 'wm-shine' }],
    ['path', { d: body, fill: C1, ...K, class: 'wm-k' }],
    ['path', { d: body, fill: `url(#${id(0)})`, class: 'wm-shine' }],
    ['path', { d: 'M5.2 8L18.8 8M7.1 10.8L16.9 10.8', stroke: C4, 'stroke-width': 0.9, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: 'M5 4.4Q5 3 6.4 3Q7.1 1.9 8.4 2.5Q9.6 2.2 10.2 3.4Q10.8 3.8 10.6 4.4Z', fill: C4, ...K, class: 'wm-s' }],
    ['path', { d: 'M6.3 6.4L6.9 7.1', stroke: SHINE, 'stroke-opacity': 0.6, 'stroke-width': 0.7, 'stroke-linecap': 'round', class: 'wm-shine' }],
    spark(19.4, 15.4, 1.8),
  ]
}
