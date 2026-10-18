// forge/hand/soft3d/siren.mjs: an upright emergency beacon: a glossy red dome with a glowing core on a silver base, and three
// amber rays (top and two diagonals) above it, as in line.
const N = 'siren'
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = { c1: v('c1', '#E5483F'), c2: v('c2', '#BFC7D2'), accent: v('accent', '#F5A524'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#1D2130') }
const g = `url(#wg-soft3d-${N}-0)`
const gc = `url(#wg-soft3d-${N}-1)`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const DOME = 'M6.6 16.8V13A5.4 5.4 0 0 1 17.4 13V16.8Z'
const CORE = 'M9.7 16.8V13.2A2.3 2.3 0 0 1 14.3 13.2V16.8Z'
const BASE = 'M5.6 16.6H18.4A1.6 1.6 0 0 1 20 18.2V19.6A1.6 1.6 0 0 1 18.4 21.2H5.6A1.6 1.6 0 0 1 4 19.6V18.2A1.6 1.6 0 0 1 5.6 16.6Z'
const BASE_LOW = 'M5.6 17.4H18.4A1.6 1.6 0 0 1 20 19V20.4A1.6 1.6 0 0 1 18.4 22H5.6A1.6 1.6 0 0 1 4 20.4V19A1.6 1.6 0 0 1 5.6 17.4Z'
const ray = d => ['path', { d, stroke: C.accent, 'stroke-width': 1.7, 'stroke-linecap': 'round', fill: 'none', class: 'wm-s' }]
export default function render() {
  return [
    ['defs', {}, [
      ['linearGradient', { id: `wg-soft3d-${N}-0`, x1: 0, y1: 0, x2: 1, y2: 0 }, [
        stop(0, C.shine, 0.2), stop(0.2, C.shine, 0.5), stop(0.44, C.shine, 0), stop(0.62, C.shadow, 0), stop(1, C.shadow, 0.34)]],
      ['radialGradient', { id: `wg-soft3d-${N}-1`, cx: 0.4, cy: 0.35, r: 0.8 }, [
        stop(0, C.shine, 0.55), stop(0.5, C.shine, 0.05), stop(1, C.shadow, 0.12)]],
    ]],
    ['ellipse', { cx: 12, cy: 21.7, rx: 9.6, ry: 1.3, fill: C.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }],
    ['ellipse', { cx: 12, cy: 21.7, rx: 6.8, ry: 0.9, fill: C.shadow, 'fill-opacity': 0.1, class: 'wm-shadow' }],
    ['path', { d: BASE_LOW, fill: C.c2, class: 'wm-k' }],
    ['path', { d: BASE_LOW, fill: C.shadow, 'fill-opacity': 0.4, class: 'wm-k' }],
    ['path', { d: BASE, fill: C.c2, class: 'wm-k' }],
    ['path', { d: BASE, fill: g, class: 'wm-k' }],
    ['path', { d: 'M5.8 17.5H18.2', stroke: C.shine, 'stroke-width': 0.6, 'stroke-opacity': 0.6, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
    ['path', { d: DOME, fill: C.c1, class: 'wm-k' }],
    ['path', { d: DOME, fill: g, class: 'wm-k' }],
    ['path', { d: 'M6.6 16.1H17.4V16.8H6.6Z', fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-k' }],
    ['path', { d: CORE, fill: C.accent, 'fill-opacity': 0.85, class: 'wm-a' }],
    ['path', { d: CORE, fill: gc, class: 'wm-a' }],
    ['path', { d: 'M8.4 12.6A3.9 3.9 0 0 1 11 9.5', stroke: C.shine, 'stroke-width': 0.8, 'stroke-opacity': 0.8, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
    ray('M12 2.6V4.9'),
    ray('M4.9 5.8L6.5 7.4'),
    ray('M19.1 5.8L17.5 7.4'),
  ]
}
