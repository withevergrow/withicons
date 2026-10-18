// mehndi-hand: cream raised hand with a clear red henna mandala on the palm and dotted fingertips.
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
  const fingers = [[7.6, 5.4], [10.4, 3.6], [13.2, 4.4], [15.9, 6.6]]
  const thumb = 'M7.4 16.2L3.9 12.3'
  const parts = (stroke, w, palm) => [
    ...fingers.map(([x, t]) => ['line', { x1: x, y1: 13, x2: x, y2: t, stroke, 'stroke-width': w, 'stroke-linecap': 'round', class: 'wm-k' }]),
    ['path', { d: thumb, stroke, 'stroke-width': w, 'stroke-linecap': 'round', fill: 'none', class: 'wm-k' }],
    ['rect', { x: 6.2, y: 10.5, width: 11.1, height: 10.8, rx: 3.6, ...palm, class: 'wm-k' }],
  ]
  const dots = []
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; dots.push(['circle', { cx: r2(11.75 + Math.cos(a) * 3), cy: r2(15.9 + Math.sin(a) * 3), r: 0.5, fill: C1, class: 'wm-a' }]) }
  return [
    ['defs', {}, [light(id(0), 4, 3, 17, 22)]],
    ...parts(INK, 3.6, { fill: INK, stroke: INK, 'stroke-width': 1.2 }),
    ...parts(C4, 2.4, { fill: C4 }),
    ['rect', { x: 6.2, y: 10.5, width: 11.1, height: 10.8, rx: 3.6, fill: `url(#${id(0)})`, class: 'wm-shine' }],
    ['circle', { cx: 11.75, cy: 15.9, r: 1.9, fill: 'none', stroke: C1, 'stroke-width': 0.75, class: 'wm-a' }],
    ['circle', { cx: 11.75, cy: 15.9, r: 0.7, fill: C1, class: 'wm-a' }],
    ...dots,
    ...fingers.map(([x, t]) => ['circle', { cx: x, cy: r2(t + 0.3), r: 0.6, fill: C1, class: 'wm-s' }]),
    ...fingers.map(([x, t]) => ['line', { x1: r2(x - 0.55), y1: r2(t + 2.4), x2: r2(x + 0.55), y2: r2(t + 2.4), stroke: C1, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-s' }]),
    star(20, 3.5),
  ]
}
