// forge/hand/soft3d/clapperboard.mjs: a soft slate: a dark flat-fronted body with a striped sill and two text lines, and the
// striped clapper arm hinged at the left and tilted open above it, as in line.
const N = 'clapperboard'
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = { c1: v('c1', '#2A2E36'), c2: v('c2', '#EEF1F5'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#1D2130') }
const g = `url(#wg-soft3d-${N}-0)`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const f = n => (Math.round(n * 100) / 100).toString()
const rr = (x, y, w, h, r) => `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`
// the arm: local (x along it, y across), turned 14 degrees open about the hinge (3.6, 9.4)
const A = -14 * Math.PI / 180, CA = Math.cos(A), SA = Math.sin(A), HX = 3.6, HY = 9.4
const R = (x, y) => `${f(HX + (x - HX) * CA - (y - HY) * SA)} ${f(HY + (x - HX) * SA + (y - HY) * CA)}`
const poly = pts => 'M' + pts.map(p => R(p[0], p[1])).join('L') + 'Z'
const ARM = poly([[3.2, 6.6], [20.8, 6.6], [20.8, 9.4], [3.2, 9.4]])
let armStripes = '', sillStripes = ''
for (let i = 0; i < 4; i++) {
  const x = 5.6 + i * 4.2
  armStripes += poly([[x, 6.9], [x + 2, 6.9], [x + 0.9, 9.1], [x - 1.1, 9.1]])
}
for (let i = 0; i < 4; i++) {
  const x = 7.7 + i * 4.2
  sillStripes += `M${x - 1.1} 10.2H${x + 0.9}L${x - 0.2} 12.2H${x - 2.2}Z`
}
const BODY = rr(3, 9.8, 18, 10.6, 1.8)
const BODY_LOW = rr(3, 10.7, 18, 10.6, 1.8)
export default function render() {
  return [
    ['defs', {}, [['linearGradient', { id: `wg-soft3d-${N}-0`, x1: 0, y1: 0, x2: 1, y2: 1 }, [
      stop(0, C.shine, 0.34), stop(0.42, C.shine, 0), stop(0.62, C.shadow, 0), stop(1, C.shadow, 0.22)]]]],
    ['ellipse', { cx: 12, cy: 21.9, rx: 10, ry: 1.3, fill: C.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }],
    ['ellipse', { cx: 12, cy: 21.9, rx: 7, ry: 0.9, fill: C.shadow, 'fill-opacity': 0.1, class: 'wm-shadow' }],
    ['path', { d: BODY_LOW, fill: C.c1, class: 'wm-k' }],
    ['path', { d: BODY_LOW, fill: C.shadow, 'fill-opacity': 0.4, class: 'wm-k' }],
    ['path', { d: BODY, fill: C.c1, class: 'wm-k' }],
    ['path', { d: BODY, fill: g, class: 'wm-k' }],
    ['path', { d: rr(3.4, 10.1, 17.2, 2.1, 0.8), fill: C.c2, class: 'wm-k' }],
    ['path', { d: sillStripes, fill: C.c1, class: 'wm-k' }],
    ['path', { d: rr(3.4, 10.1, 17.2, 2.1, 0.8), fill: g, class: 'wm-k' }],
    ['path', { d: 'M5.8 15.3H14M5.8 18H10.6', stroke: C.c2, 'stroke-width': 1.2, 'stroke-opacity': 0.9, 'stroke-linecap': 'round', fill: 'none', class: 'wm-k' }],
    ['path', { d: ARM, fill: C.c2, stroke: C.shadow, 'stroke-opacity': 0.4, 'stroke-width': 0.8, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: armStripes, fill: C.c1, class: 'wm-a' }],
    ['path', { d: ARM, fill: g, class: 'wm-a' }],
    ['circle', { cx: 4.1, cy: 9.9, r: 0.9, fill: C.shadow, 'fill-opacity': 0.55, class: 'wm-a' }],
    ['path', { d: `M${R(5.2, 6.95)}L${R(19, 6.95)}`, stroke: C.shine, 'stroke-width': 0.5, 'stroke-opacity': 0.7, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
  ]
}
