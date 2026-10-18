// forge/hand/soft3d/captions.mjs — chunky soft3d captions: rounded screen tile with contact shadow, gradient face light and shine.
const N = 'captions'
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = { c1: v('c1', '#8A66DE'), c2: v('c2', '#5BB8E8'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#1D2130') }
const g = `url(#wg-soft3d-${N}-0)`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
export default function render() {
  return [
    ['defs', {}, [['radialGradient', { id: `wg-soft3d-${N}-0`, cx: 0.34, cy: 0.26, r: 0.92 }, [
      stop(0, C.shine, 0.58), stop(0.38, C.shine, 0.06), stop(0.7, C.shadow, 0), stop(1, C.shadow, 0.26)]]]],
    ['ellipse', { cx: 12, cy: 21, rx: 9.5, ry: 1.4, fill: C.shadow, 'fill-opacity': 0.12, class: 'wm-shadow' }],
    ['path', { d: 'M5 4.5h14A3 3 0 0 1 22 7.5v9a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3z', fill: C.c1, class: 'wm-k' }],
    ['path', { d: 'M5 4.5h14A3 3 0 0 1 22 7.5v9a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3z', fill: g, class: 'wm-k' }],
    ['path', { d: 'M5 5.7h14', stroke: C.shine, 'stroke-width': 0.7, 'stroke-opacity': 0.6, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
    ['path', { d: 'M10.4 10.2A2.2 2.2 0 1 0 10.4 13.8M17.4 10.2A2.2 2.2 0 1 0 17.4 13.8', stroke: C.shine, 'stroke-width': 1.9, 'stroke-linecap': 'round', fill: 'none', class: 'wm-a' }],
  ]
}
