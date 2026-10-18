// marigold: layered orange/gold petal rings around a deep red centre, no snow.
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
const ORANGE = V('c3', '#E2A93B')
export default function render(icon) {
  const id = n => `wg-christmas-${icon.name}-${n}`
  const ring = (n, rad, r, fill, off, cls = 'wm-k') => {
    const out = []
    for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 + off; out.push(['circle', { cx: r2(12 + Math.cos(a) * rad), cy: r2(12.5 + Math.sin(a) * rad), r, fill, stroke: INK, 'stroke-width': 0.5, class: cls }]) }
    return out
  }
  return [
    ['defs', {}, [light(id(0), 3, 3, 18, 22)]],
    ...ring(12, 6.6, 2.75, ORANGE, 0),
    ['circle', { cx: 12, cy: 12.5, r: 8.2, fill: `url(#${id(0)})`, class: 'wm-shine' }],
    ...ring(9, 4, 2.3, ACC, 0.35, 'wm-a'),
    ['circle', { cx: 12, cy: 12.5, r: 2.7, fill: C1, stroke: INK, 'stroke-width': 0.6, class: 'wm-s' }],
    ['circle', { cx: 11.3, cy: 11.8, r: 0.7, fill: SHINE, 'fill-opacity': 0.5, class: 'wm-shine' }],
    star(21, 3),
  ]
}
