// forge/hand/soft3d/globe.mjs: a soft3d sphere that reads as the line globe: full outer edge, a green meridian ellipse with a
// vertical axis, and the equator, all lit from the upper left on a blue ball with a contact shadow.
const N = 'globe'
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = { c1: v('c1', '#5BB8E8'), c2: v('c2', '#4FB463'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#1D2130') }
const g = `url(#wg-soft3d-${N}-0)`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const BALL = 'M21.5 11.5A9.5 9.5 0 1 1 2.5 11.5A9.5 9.5 0 1 1 21.5 11.5Z'
const ELL = 'M16.2 11.5A4.2 9.5 0 1 1 7.8 11.5A4.2 9.5 0 1 1 16.2 11.5Z'
export default function render() {
  return [
    ['defs', {}, [['radialGradient', { id: `wg-soft3d-${N}-0`, cx: 0.34, cy: 0.26, r: 0.92 }, [
      stop(0, C.shine, 0.58), stop(0.38, C.shine, 0.06), stop(0.7, C.shadow, 0), stop(1, C.shadow, 0.3)]]]],
    ['ellipse', { cx: 12, cy: 21.6, rx: 8.4, ry: 1.3, fill: C.shadow, 'fill-opacity': 0.1, class: 'wm-shadow' }],
    ['ellipse', { cx: 12, cy: 21.6, rx: 5.6, ry: 0.8, fill: C.shadow, 'fill-opacity': 0.12, class: 'wm-shadow' }],
    ['path', { d: BALL, fill: C.c1, class: 'wm-k' }],
    ['path', { d: ELL, fill: C.c2, class: 'wm-a' }],
    ['path', { d: ELL, fill: C.shadow, 'fill-opacity': 0.12, class: 'wm-a' }],
    ['path', { d: 'M2.9 11.5H21.1M12 2V21', stroke: C.shine, 'stroke-width': 1.2, 'stroke-opacity': 0.9, 'stroke-linecap': 'round', fill: 'none', class: 'wm-a' }],
    ['path', { d: ELL, stroke: C.shine, 'stroke-width': 1.2, 'stroke-opacity': 0.9, fill: 'none', class: 'wm-a' }],
    ['path', { d: BALL, fill: g, class: 'wm-k' }],
    ['path', { d: BALL, stroke: C.shadow, 'stroke-width': 0.9, 'stroke-opacity': 0.35, fill: 'none', class: 'wm-k' }],
    ['path', { d: 'M4.7 7.4A8.2 8.2 0 0 1 10 3.6', stroke: C.shine, 'stroke-width': 0.9, 'stroke-opacity': 0.7, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
  ]
}
