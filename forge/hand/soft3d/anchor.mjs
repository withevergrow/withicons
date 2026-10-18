// forge/hand/soft3d/anchor.mjs: a steel-blue ship's anchor built from round tubes (open ring, shank, stock, curved arms with
// pointed flukes), each with a contact shade, a dark core and a lit ridge, so the shape stands out with contrast
// instead of the pale blob with a dark ball.
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = { c1: v('c1', '#3F6FB8'), c2: v('c2', '#F2B63C'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#1D2130') }
const stk = (d, stroke, w, op, cls, fill = 'none') => ['path', { d, stroke, 'stroke-width': w, ...(op < 1 ? { 'stroke-opacity': op } : {}), 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill, class: cls }]
const RING = (dx = 0, dy = 0) => `M${14.2 + dx} ${5 + dy}A2.2 2.2 0 1 1 ${9.8 + dx} ${5 + dy}A2.2 2.2 0 1 1 ${14.2 + dx} ${5 + dy}Z`
const SHANK = (dx = 0, dy = 0) => `M${12 + dx} ${7.4 + dy}V${19.6 + dy}`
const STOCK = (dx = 0, dy = 0) => `M${8.2 + dx} ${10.4 + dy}H${15.8 + dx}`
const ARMS = (dx = 0, dy = 0) => `M${4.9 + dx} ${13.6 + dy}C${5.5 + dx} ${18 + dy} ${8.5 + dx} ${20.2 + dy} ${12 + dx} ${20.2 + dy}C${15.5 + dx} ${20.2 + dy} ${18.5 + dx} ${18 + dy} ${19.1 + dx} ${13.6 + dy}`
const FL = (dx = 0, dy = 0) => `M${2.9 + dx} ${15.4 + dy}L${4.9 + dx} ${11.8 + dy}L${7 + dx} ${15.2 + dy}ZM${17 + dx} ${15.2 + dy}L${19.1 + dx} ${11.8 + dy}L${21.1 + dx} ${15.4 + dy}Z`
export default function render() {
  const all = (dx, dy) => [RING(dx, dy), SHANK(dx, dy), STOCK(dx, dy), ARMS(dx, dy)]
  const w = [1.9, 2.5, 2.1, 2.5]
  return [
    ['ellipse', { cx: 12, cy: 21.9, rx: 7.2, ry: 1, fill: C.shadow, 'fill-opacity': 0.12, class: 'wm-shadow' }],
    ...all(0.3, 0.5).map((d, i) => stk(d, C.shadow, w[i] + 0.3, 0.22, 'wm-shadow')),
    stk(FL(0.3, 0.5), C.shadow, 0.8, 0.22, 'wm-shadow', C.shadow),
    stk(ARMS(), C.c1, 2.5, 1, 'wm-k'),
    stk(SHANK(), C.c1, 2.5, 1, 'wm-k'),
    stk(STOCK(), C.c1, 2.1, 1, 'wm-k'),
    stk(FL(), C.c1, 0.8, 1, 'wm-k', C.c1),
    stk(RING(), C.c2, 1.9, 1, 'wm-a'),
    stk(RING(0.2, 0.25), C.shadow, 0.8, 0.18, 'wm-a'),
    stk(ARMS(0.25, 0.3), C.shadow, 1, 0.16, 'wm-k'),
    stk(SHANK(0.25, 0), C.shadow, 1, 0.16, 'wm-k'),
    stk('M11.4 8.4V17.8', C.shine, 0.7, 0.5, 'wm-shine'),
    stk('M9.2 9.7H14', C.shine, 0.6, 0.45, 'wm-shine'),
    stk('M5.8 15C6.3 17 7.6 18.4 9.2 19', C.shine, 0.7, 0.5, 'wm-shine'),
    stk('M4.6 14.2L4.9 13.1L5.9 14.6', C.shine, 0.5, 0.5, 'wm-shine'),
    stk('M10.3 3.4A2.2 2.2 0 0 0 9.9 4.4', C.shine, 0.7, 0.7, 'wm-shine'),
  ]
}
