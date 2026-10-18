// minimize: two clean red inward arrows with one small snow cap.
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
export default function render() {
  const a = 'M14 4V10H20M14 10L20.2 3.8', b = 'M10 20V14H4M10 14L3.8 20.2'
  const draw = d => [
    ['path', { d, fill: 'none', stroke: INK, 'stroke-width': 3.7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d, fill: 'none', stroke: C1, 'stroke-width': 2.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-k' }],
  ]
  return [
    ...draw(a), ...draw(b),
    ['path', { d: 'M12.85 4.1Q12.9 2.55 14 2.5Q15.1 2.55 15.15 4.1Q14.6 4.9 14 4.3Q13.4 4.9 12.85 4.1Z', fill: C4, stroke: INK, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    star(5, 5),
  ]
}
