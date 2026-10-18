// forge/hand/soft3d/images.mjs: two clay photo frames, as in line: an upright front frame (sky window, green mountain, sun)
// with the offset back frame peeking out at the top right; thick rounded slabs with a darker underside.
const N = 'images'
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = { c1: v('c1', '#B8763E'), c3: v('c3', '#4FB463'), tint: v('tint', '#A9D8F2'), accent: v('accent', '#F5A524'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#1D2130') }
const g = `url(#wg-soft3d-${N}-0)`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const rr = (x, y, w, h, r) => `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`
const BACK = rr(6.5, 2.6, 15.5, 13.6, 2.6)
const BACK_LOW = rr(6.5, 3.5, 15.5, 13.6, 2.6)
const FRONT = rr(2, 6.8, 16, 13.4, 2.6)
const FRONT_LOW = rr(2, 7.7, 16, 13.4, 2.6)
const WIN = rr(3.9, 8.7, 12.2, 8.7, 1.3)
const MOUNT = 'M3.9 16.1V15.2L7.3 11.8Q8.3 10.9 9.3 11.8L11.9 14.4L12.9 13.5Q13.7 12.9 14.5 13.5L16.1 15V16.1A1.3 1.3 0 0 1 14.8 17.4H5.2A1.3 1.3 0 0 1 3.9 16.1Z'
export default function render() {
  return [
    ['defs', {}, [['linearGradient', { id: `wg-soft3d-${N}-0`, x1: 0, y1: 0, x2: 1, y2: 1 }, [
      stop(0, C.shine, 0.34), stop(0.42, C.shine, 0), stop(0.62, C.shadow, 0), stop(1, C.shadow, 0.22)]]]],
    ['ellipse', { cx: 11.5, cy: 21.7, rx: 9.6, ry: 1.4, fill: C.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }],
    ['ellipse', { cx: 11.5, cy: 21.7, rx: 6.8, ry: 0.95, fill: C.shadow, 'fill-opacity': 0.1, class: 'wm-shadow' }],
    ['path', { d: BACK_LOW, fill: C.c1, class: 'wm-k' }],
    ['path', { d: BACK_LOW, fill: C.shadow, 'fill-opacity': 0.4, class: 'wm-k' }],
    ['path', { d: BACK, fill: C.c1, class: 'wm-k' }],
    ['path', { d: BACK, fill: C.shadow, 'fill-opacity': 0.14, class: 'wm-k' }],
    ['path', { d: BACK, fill: g, class: 'wm-k' }],
    ['path', { d: 'M9.4 3.7H19', stroke: C.shine, 'stroke-width': 0.6, 'stroke-opacity': 0.45, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
    ['path', { d: FRONT_LOW, fill: C.c1, class: 'wm-k' }],
    ['path', { d: FRONT_LOW, fill: C.shadow, 'fill-opacity': 0.4, class: 'wm-k' }],
    ['path', { d: FRONT, fill: C.c1, class: 'wm-k' }],
    ['path', { d: FRONT, fill: g, class: 'wm-k' }],
    ['path', { d: 'M4.6 7.9H15.4', stroke: C.shine, 'stroke-width': 0.6, 'stroke-opacity': 0.5, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
    ['path', { d: WIN, fill: C.shadow, 'fill-opacity': 0.4, class: 'wm-k' }],
    ['path', { d: rr(4.2, 9.1, 11.6, 8, 1.1), fill: C.tint, class: 'wm-k' }],
    ['path', { d: rr(4.2, 9.1, 11.6, 8, 1.1), fill: g, class: 'wm-k' }],
    ['circle', { cx: 13.3, cy: 11.4, r: 1.5, fill: C.accent, class: 'wm-a' }],
    ['circle', { cx: 13.3, cy: 11.4, r: 1.5, fill: g, class: 'wm-a' }],
    ['path', { d: MOUNT, fill: C.c3, class: 'wm-a' }],
    ['path', { d: MOUNT, fill: g, class: 'wm-a' }],
    ['path', { d: 'M5.6 9.6H9', stroke: C.shine, 'stroke-width': 0.6, 'stroke-opacity': 0.6, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
  ]
}
