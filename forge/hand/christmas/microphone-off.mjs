// microphone-off: clear red capsule mic on a gold cradle and stand, crossed by a thin ink slash.
const V = (r, h) => `var(--with-christmas-${r}, ${h})`
const INK = V('ink', '#3A0F17'), C1 = V('c1', '#C8203A'), C2 = V('c2', '#1F6E46'), C4 = V('c4', '#FFF5E6'), C3 = V('c3', '#E2A93B')
const ACC = V('accent', '#F4C24D'), SHINE = V('shine', '#FFFFFF'), TINT = V('tint', '#C9DAEC'), SHADOW = V('shadow', '#4A0716')
const light = (id, x1, y1, x2, y2) => ['linearGradient', { id, x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, [
  ['stop', { offset: 0, 'stop-color': SHINE, 'stop-opacity': 0.34 }],
  ['stop', { offset: 0.42, 'stop-color': SHINE, 'stop-opacity': 0 }],
  ['stop', { offset: 0.58, 'stop-color': SHADOW, 'stop-opacity': 0 }],
  ['stop', { offset: 1, 'stop-color': SHADOW, 'stop-opacity': 0.42 }],
]]
const star = (x, y) => ['path', { d: `M${x} ${y - 1.55}Q${x + 0.34} ${y - 0.34} ${x + 1.55} ${y}Q${x + 0.34} ${y + 0.34} ${x} ${y + 1.55}Q${x - 0.34} ${y + 0.34} ${x - 1.55} ${y}Q${x - 0.34} ${y - 0.34} ${x} ${y - 1.55}Z`, fill: ACC, stroke: INK, 'stroke-width': 0.28, 'stroke-linejoin': 'round', class: 'wm-deco' }]
const r2 = v => Math.round(v * 100) / 100
export default function render(icon) {
  const id = n => `wg-christmas-${icon.name}-${n}`
  const cradle = 'M6 11.2A6 6 0 0 0 18 11.2M12 17.2V20.6M8.8 21H15.2'
  return [
    ['defs', {}, [light(id(0), 9, 2, 15, 15)]],
    ['path', { d: cradle, fill: 'none', stroke: INK, 'stroke-width': 2.7, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: cradle, fill: 'none', stroke: C3, 'stroke-width': 1.5, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['rect', { x: 8.8, y: 2.4, width: 6.4, height: 11.6, rx: 3.2, fill: C1, stroke: INK, 'stroke-width': 0.6, class: 'wm-k' }],
    ['rect', { x: 8.8, y: 2.4, width: 6.4, height: 11.6, rx: 3.2, fill: `url(#${id(0)})`, class: 'wm-shine' }],
    ['path', { d: 'M9.1 6.8H14.9M9.1 9.6H14.9', stroke: C3, 'stroke-width': 0.7, class: 'wm-k' }],
    ['line', { x1: 3.8, y1: 3.4, x2: 20.2, y2: 20.6, stroke: C4, 'stroke-width': 2.2, 'stroke-linecap': 'round', class: 'wm-s' }],
    ['line', { x1: 3.8, y1: 3.4, x2: 20.2, y2: 20.6, stroke: INK, 'stroke-width': 1.1, 'stroke-linecap': 'round', class: 'wm-s' }],
    star(20, 4),
  ]
}
