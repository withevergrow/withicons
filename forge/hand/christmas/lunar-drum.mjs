// lunar-drum: clean red barrel drum, taut cream head, gold rims with a rope zigzag, one gold stick.
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
  const body = 'M4 9.5C3.2 12.5 3.2 16 4 19C6 21.6 18 21.6 20 19C20.8 16 20.8 12.5 20 9.5Z'
  let zig = 'M4.4 11.6'
  for (let i = 1; i <= 8; i++) { const x = r2(4.4 + i * 1.9), y = i % 2 ? 17.2 : 11.6; zig += `L${x} ${y}` }
  return [
    ['defs', {}, [light(id(0), 4, 7, 16, 22)]],
    ['path', { d: body, fill: C1, stroke: INK, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: body, fill: `url(#${id(0)})`, class: 'wm-shine' }],
    ['path', { d: zig, fill: 'none', stroke: C3, 'stroke-width': 0.9, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: 'M3.7 18.4C6 20.6 18 20.6 20.3 18.4L20 19.6C18 21.9 6 21.9 4 19.6Z', fill: C3, stroke: INK, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['ellipse', { cx: 12, cy: 9.5, rx: 8.2, ry: 2.6, fill: C3, stroke: INK, 'stroke-width': 0.6, class: 'wm-k' }],
    ['ellipse', { cx: 12, cy: 9.3, rx: 6.9, ry: 1.85, fill: C4, stroke: INK, 'stroke-width': 0.4, class: 'wm-k' }],
    ['line', { x1: 13.4, y1: 8.6, x2: 20.2, y2: 2.6, stroke: INK, 'stroke-width': 1.9, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['line', { x1: 13.4, y1: 8.6, x2: 20.2, y2: 2.6, stroke: C3, 'stroke-width': 0.9, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['circle', { cx: 13.3, cy: 8.7, r: 1.15, fill: C1, stroke: INK, 'stroke-width': 0.5, class: 'wm-a' }],
    star(5, 3.5),
  ]
}
