// forge/hand/soft3d/battery-low.mjs: the horizontal soft3d battery (dark rounded body, right nub) with one short red charge cell at
// the left and the other cells shown as empty dark wells, so it reads as nearly flat instead of healthy.
const N = 'battery-low'
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = { c1: v('c1', '#3A404C'), c2: v('c2', '#E5483F'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#1D2130') }
const g = `url(#wg-soft3d-${N}-0)`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const BODY = 'M5 6.5H17A3 3 0 0 1 20 9.5V14.5A3 3 0 0 1 17 17.5H5A3 3 0 0 1 2 14.5V9.5A3 3 0 0 1 5 6.5Z'
const SIDE = 'M5 7.4H17A3 3 0 0 1 20 10.4V15.4A3 3 0 0 1 17 18.4H5A3 3 0 0 1 2 15.4V10.4A3 3 0 0 1 5 7.4Z'
const LOW = 'M4.8 10.1H7.4A0.6 0.6 0 0 1 8 10.7V13.3A0.6 0.6 0 0 1 7.4 13.9H4.8A0.6 0.6 0 0 1 4.2 13.3V10.7A0.6 0.6 0 0 1 4.8 10.1Z'
export default function render() {
  return [
    ['defs', {}, [['linearGradient', { id: `wg-soft3d-${N}-0`, x1: 0, y1: 0, x2: 1, y2: 1 }, [
      stop(0, C.shine, 0.34), stop(0.42, C.shine, 0), stop(0.62, C.shadow, 0), stop(1, C.shadow, 0.22)]]]],
    ['ellipse', { cx: 12, cy: 21.2, rx: 10.2, ry: 1.6, fill: C.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }],
    ['ellipse', { cx: 12, cy: 21.2, rx: 7.4, ry: 1.1, fill: C.shadow, 'fill-opacity': 0.1, class: 'wm-shadow' }],
    ['path', { d: 'M20 10.4H21.3A1.2 1.2 0 0 1 22.5 11.6V13.6A1.2 1.2 0 0 1 21.3 14.8H20Z', fill: C.c1, class: 'wm-k' }],
    ['path', { d: 'M20 9.6H21.3A1.2 1.2 0 0 1 22.5 10.8V12.8A1.2 1.2 0 0 1 21.3 14H20Z', fill: C.c1, class: 'wm-k' }],
    ['path', { d: SIDE, fill: C.c1, class: 'wm-k' }],
    ['path', { d: SIDE, fill: C.shadow, 'fill-opacity': 0.4, class: 'wm-k' }],
    ['path', { d: BODY, fill: C.c1, class: 'wm-k' }],
    ['path', { d: BODY, fill: g, class: 'wm-k' }],
    ['path', { d: 'M4.8 7.7H17.2', stroke: C.shine, 'stroke-width': 0.7, 'stroke-opacity': 0.5, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
    ['path', { d: 'M4.3 9.2H17.7A1.6 1.6 0 0 1 19.3 10.8V13.2A1.6 1.6 0 0 1 17.7 14.8H4.3A1.6 1.6 0 0 1 2.7 13.2V10.8A1.6 1.6 0 0 1 4.3 9.2Z', fill: C.shadow, 'fill-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M8.8 10.3H10.2V13.7H8.8ZM11.4 10.3H12.8V13.7H11.4ZM14 10.3H15.4V13.7H14Z', fill: C.shine, 'fill-opacity': 0.12, class: 'wm-a' }],
    ['path', { d: LOW, fill: C.c2, class: 'wm-a' }],
    ['path', { d: LOW, fill: g, class: 'wm-a' }],
    ['path', { d: 'M4.9 10.7H7.3', stroke: C.shine, 'stroke-width': 0.5, 'stroke-opacity': 0.6, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
  ]
}
