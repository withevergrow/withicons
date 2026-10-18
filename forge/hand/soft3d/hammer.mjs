// forge/hand/soft3d/hammer.mjs: a soft3d claw hammer: silver block head at the upper left with the claw curving down to the right,
// and a straight brown diagonal handle running to the lower left, with a darker underside on the head for depth.
const N = 'hammer'
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = { c1: v('c1', '#BFC7D2'), c2: v('c2', '#B8763E'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#1D2130') }
const g = `url(#wg-soft3d-${N}-0)`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const HEAD = 'M12.68 2.82L18.34 8.47C20.82 10.95 21.35 14.31 19.22 17.49C19.75 15.19 18.87 13.25 17.28 11.66L16.57 10.95L14.81 12.72L8.79 6.71A1 1 0 0 1 8.79 5.29L11.27 2.82A1 1 0 0 1 12.68 2.82Z'
const HEAD_LOW = 'M13.18 3.62L18.84 9.27C21.32 11.75 21.85 15.11 19.72 18.29C20.25 15.99 19.37 14.05 17.78 12.46L17.07 11.75L15.31 13.52L9.29 7.51A1 1 0 0 1 9.29 6.09L11.77 3.62A1 1 0 0 1 13.18 3.62Z'
const HANDLE = 'M11.98 9.89L4.02 17.84A2 2 0 0 0 6.85 20.67L14.81 12.72Z'
export default function render() {
  return [
    ['defs', {}, [['linearGradient', { id: `wg-soft3d-${N}-0`, x1: 0, y1: 0, x2: 1, y2: 1 }, [
      stop(0, C.shine, 0.36), stop(0.42, C.shine, 0), stop(0.62, C.shadow, 0), stop(1, C.shadow, 0.24)]]]],
    ['ellipse', { cx: 12, cy: 21.6, rx: 9.6, ry: 1.3, fill: C.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }],
    ['ellipse', { cx: 11, cy: 21.6, rx: 6.4, ry: 0.9, fill: C.shadow, 'fill-opacity': 0.1, class: 'wm-shadow' }],
    ['path', { d: HANDLE, fill: C.c2, class: 'wm-a' }],
    ['path', { d: HANDLE, fill: g, class: 'wm-a' }],
    ['path', { d: 'M8.1 13.6L10.6 16.1M6.2 15.5L8.7 18', stroke: C.shadow, 'stroke-width': 0.8, 'stroke-opacity': 0.3, 'stroke-linecap': 'round', fill: 'none', class: 'wm-a' }],
    ['path', { d: 'M11.4 10.9L4.9 17.4', stroke: C.shine, 'stroke-width': 0.7, 'stroke-opacity': 0.45, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
    ['path', { d: HEAD_LOW, fill: C.c1, class: 'wm-k' }],
    ['path', { d: HEAD_LOW, fill: C.shadow, 'fill-opacity': 0.45, class: 'wm-k' }],
    ['path', { d: HEAD, fill: C.c1, class: 'wm-k' }],
    ['path', { d: HEAD, fill: g, class: 'wm-k' }],
    ['path', { d: 'M9.6 5.6L11.9 3.3M13.2 3.9L17.7 8.4', stroke: C.shine, 'stroke-width': 0.9, 'stroke-opacity': 0.7, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
    ['path', { d: 'M11.2 6.7L14.9 10.4', stroke: C.shadow, 'stroke-width': 0.8, 'stroke-opacity': 0.25, 'stroke-linecap': 'round', fill: 'none', class: 'wm-k' }],
  ]
}
