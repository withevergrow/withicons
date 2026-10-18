// forge/hand/soft3d/thermometer.mjs: a glass thermometer with a clear tube-and-bulb silhouette, a red liquid column rising
// from a round red bulb, a dark soft edge so the pale glass holds up on white, and three tick marks on the right.
const N = 'thermometer'
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = { c1: v('c1', '#E2EBF4'), c2: v('c2', '#E5483F'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#1D2130') }
const g = `url(#wg-soft3d-${N}-0)`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const BODY = 'M6.5 13.8V5.5A2.5 2.5 0 0 1 11.5 5.5V13.8A3.9 3.9 0 1 1 6.5 13.8Z'
const BULB = 'M11.5 16.8A2.5 2.5 0 1 1 6.5 16.8A2.5 2.5 0 1 1 11.5 16.8Z'
const tick = (y, x2, cls) => ['path', { d: `M14.8 ${y}H${x2}`, stroke: C.c2, 'stroke-width': 1.3, 'stroke-opacity': 0.9, 'stroke-linecap': 'round', fill: 'none', class: cls }]
export default function render() {
  return [
    ['defs', {}, [['radialGradient', { id: `wg-soft3d-${N}-0`, cx: 0.3, cy: 0.28, r: 0.95 }, [
      stop(0, C.shine, 0.6), stop(0.4, C.shine, 0.05), stop(0.7, C.shadow, 0), stop(1, C.shadow, 0.28)]]]],
    ['ellipse', { cx: 11, cy: 21.9, rx: 6, ry: 1, fill: C.shadow, 'fill-opacity': 0.12, class: 'wm-shadow' }],
    ['path', { d: BODY, fill: C.c1, class: 'wm-k' }],
    ['path', { d: 'M9 6.2V16.8', stroke: C.shadow, 'stroke-width': 2.8, 'stroke-opacity': 0.14, 'stroke-linecap': 'round', fill: 'none', class: 'wm-k' }],
    ['path', { d: BODY, fill: g, class: 'wm-k' }],
    ['path', { d: BODY, stroke: v('ink', '#2B2F3A'), 'stroke-width': 0.8, 'stroke-opacity': 0.42, 'stroke-linejoin': 'round', fill: 'none', class: 'wm-k' }],
    ['path', { d: 'M9 9.2V16.8', stroke: C.c2, 'stroke-width': 1.8, 'stroke-linecap': 'round', fill: 'none', class: 'wm-a' }],
    ['path', { d: BULB, fill: C.c2, class: 'wm-a' }],
    ['path', { d: BULB, fill: g, class: 'wm-a' }],
    ['path', { d: 'M8.1 15.7A1.6 1.6 0 0 0 7.6 17', stroke: C.shine, 'stroke-width': 0.8, 'stroke-opacity': 0.8, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
    ['path', { d: 'M7.6 5.4V12.5', stroke: C.shine, 'stroke-width': 0.8, 'stroke-opacity': 0.85, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
    tick(5, 18.8, 'wm-s'), tick(9, 17.4, 'wm-s'), tick(13, 18.8, 'wm-s'),
  ]
}
