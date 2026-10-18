// forge/hand/soft3d/code.mjs: two thin puffy teal chevrons and a separate amber slash, with clear gaps between the three
// strokes so it reads as </> instead of one merged teal blob. Each stroke is a round-capped tube: contact shade
// below-right, base colour, soft dark core, lit ridge on the upper left.
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = { c1: v('c1', '#25A99B'), c2: v('c2', '#F5A524'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#1D2130') }
const r2 = n => +n.toFixed(2)
// a polyline as an M/L path, optionally shifted
const pl = (pts, dx = 0, dy = 0) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${r2(x + dx)} ${r2(y + dy)}`).join('')
const st = (d, stroke, w, op, cls) => ['path', { d, stroke, 'stroke-width': w, ...(op < 1 ? { 'stroke-opacity': op } : {}), 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none', class: cls }]
const tube = (pts, col, w, cls) => [
  st(pl(pts, 0.3, 0.5), C.shadow, w, 0.2, 'wm-shadow'),
  st(pl(pts), col, w, 1, cls),
  st(pl(pts, 0.25, 0.3), C.shadow, w * 0.4, 0.16, cls),
  st(pl(pts, -0.4, -0.45), C.shine, 0.7, 0.55, 'wm-shine'),
]
export default function render() {
  return [
    ['ellipse', { cx: 12, cy: 21.4, rx: 8.2, ry: 1.2, fill: C.shadow, 'fill-opacity': 0.1, class: 'wm-shadow' }],
    ...tube([[6.8, 7.8], [2.8, 12], [6.8, 16.2]], C.c1, 2.7, 'wm-k'),
    ...tube([[17.2, 7.8], [21.2, 12], [17.2, 16.2]], C.c1, 2.7, 'wm-k'),
    ...tube([[13.4, 4.8], [10.6, 19.2]], C.c2, 2.4, 'wm-a'),
  ]
}
