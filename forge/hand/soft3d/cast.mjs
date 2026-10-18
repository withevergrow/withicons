// forge/hand/soft3d/cast.mjs — chunky soft3d cast: rounded screen tile with contact shadow, gradient face light and shine.
const N = 'cast'
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = { c1: v('c1', '#8A66DE'), c2: v('c2', '#5BB8E8'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#1D2130') }
const g = `url(#wg-soft3d-${N}-0)`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
export default function render() {
  return [
    ['defs', {}, [['radialGradient', { id: `wg-soft3d-${N}-0`, cx: 0.34, cy: 0.26, r: 0.92 }, [
      stop(0, C.shine, 0.58), stop(0.38, C.shine, 0.06), stop(0.7, C.shadow, 0), stop(1, C.shadow, 0.26)]]]],
    ['ellipse', { cx: 12, cy: 21, rx: 9.5, ry: 1.4, fill: C.shadow, 'fill-opacity': 0.12, class: 'wm-shadow' }],
    ['path', { d: 'M2 9V6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11a2.5 2.5 0 0 1-2.5 2.5H14v-3h5V7H5v2z', fill: C.c1, class: 'wm-k' }],
    ['path', { d: 'M2 9V6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11a2.5 2.5 0 0 1-2.5 2.5H14v-3h5V7H5v2z', fill: g, class: 'wm-k' }],
    ['path', { d: 'M4.5 5.2h15', stroke: C.shine, 'stroke-width': 0.7, 'stroke-opacity': 0.6, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
    ['path', { d: 'M2.6 12.2A7.2 7.2 0 0 1 9.8 19.4', stroke: C.c2, 'stroke-width': 1.9, 'stroke-linecap': 'round', fill: 'none', class: 'wm-a' }],
    ['path', { d: 'M2.6 15.8A3.6 3.6 0 0 1 6.2 19.4', stroke: C.c2, 'stroke-width': 1.9, 'stroke-linecap': 'round', fill: 'none', class: 'wm-a' }],
    ['circle', { cx: 2.6, cy: 19.4, r: 1.5, fill: C.c2, class: 'wm-a' }],
    ['circle', { cx: 2.6, cy: 19.4, r: 1.5, fill: g, class: 'wm-a' }],
  ]
}
