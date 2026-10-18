// forge/hand/soft3d/battery-charging.mjs: an upright-horizontal soft3d battery: a light slate body with a bright rim and a chunky right nub,
// a dark well holding green charge cells, and a bold accent lightning bolt with a light halo so it stays crisp over the cells.
const N = 'battery-charging'
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = { c1: v('c1', '#9AA6BC'), c2: v('c2', '#4FB463'), accent: v('accent', '#FF6A4D'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#1D2130') }
const g = `url(#wg-soft3d-${N}-0)`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const BODY = 'M5 6.5H17A3 3 0 0 1 20 9.5V14.5A3 3 0 0 1 17 17.5H5A3 3 0 0 1 2 14.5V9.5A3 3 0 0 1 5 6.5Z'
const SIDE = 'M5 7.4H17A3 3 0 0 1 20 10.4V15.4A3 3 0 0 1 17 18.4H5A3 3 0 0 1 2 15.4V10.4A3 3 0 0 1 5 7.4Z'
const NUB = 'M19.4 9.6H21.4A1.3 1.3 0 0 1 22.7 10.9V13.1A1.3 1.3 0 0 1 21.4 14.4H19.4Z'
const BOLT = 'M14.4 3.2L6.6 13.2H11.2L9.6 20.8L17.6 10.4H12.8Z'
export default function render() {
  return [
    ['defs', {}, [['linearGradient', { id: `wg-soft3d-${N}-0`, x1: 0, y1: 0, x2: 1, y2: 1 }, [
      stop(0, C.shine, 0.4), stop(0.45, C.shine, 0), stop(0.65, C.shadow, 0), stop(1, C.shadow, 0.2)]]]],
    ['ellipse', { cx: 12, cy: 21.2, rx: 10.2, ry: 1.6, fill: C.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }],
    ['ellipse', { cx: 12, cy: 21.2, rx: 7.4, ry: 1.1, fill: C.shadow, 'fill-opacity': 0.1, class: 'wm-shadow' }],
    ['path', { d: NUB, fill: C.c1, stroke: C.shine, 'stroke-opacity': 0.75, 'stroke-width': 0.8, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: SIDE, fill: C.c1, class: 'wm-k' }],
    ['path', { d: SIDE, fill: C.shadow, 'fill-opacity': 0.4, class: 'wm-k' }],
    ['path', { d: BODY, fill: C.c1, class: 'wm-k' }],
    ['path', { d: BODY, fill: g, class: 'wm-k' }],
    ['path', { d: BODY, fill: 'none', stroke: C.shine, 'stroke-opacity': 0.7, 'stroke-width': 0.8, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: 'M4.8 7.7H17.2', stroke: C.shine, 'stroke-width': 0.7, 'stroke-opacity': 0.6, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
    ['path', { d: 'M4.3 9.2H17.7A1.6 1.6 0 0 1 19.3 10.8V13.2A1.6 1.6 0 0 1 17.7 14.8H4.3A1.6 1.6 0 0 1 2.7 13.2V10.8A1.6 1.6 0 0 1 4.3 9.2Z', fill: C.shadow, 'fill-opacity': 0.82, class: 'wm-k' }],
    ['path', { d: 'M4 10H5.9V14H4ZM6.3 10H7.4V14H6.3Z', fill: C.c2, class: 'wm-a' }],
    ['path', { d: 'M4 10H5.9V14H4Z', fill: g, class: 'wm-a' }],
    ['path', { d: 'M15.6 10H17.5V14H15.6Z', fill: C.c2, 'fill-opacity': 0.4, class: 'wm-a' }],
    ['path', { d: BOLT, fill: C.shine, stroke: C.shine, 'stroke-opacity': 0.95, 'stroke-width': 2.2, 'stroke-linejoin': 'round', class: 'wm-s' }],
    ['path', { d: BOLT, fill: C.accent, stroke: C.shadow, 'stroke-opacity': 0.5, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-s' }],
    ['path', { d: BOLT, fill: g, class: 'wm-s' }],
    ['path', { d: 'M13.6 5.4L9.2 11.2', stroke: C.shine, 'stroke-width': 0.7, 'stroke-opacity': 0.7, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
  ]
}
