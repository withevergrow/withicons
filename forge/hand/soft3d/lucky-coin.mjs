// forge/hand/soft3d/lucky-coin.mjs: an upright, face-on gold coin with a raised inner ring, a square hole in the
// middle (dark, lit on its edge) and four red slot marks around it.
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const N = 'lucky-coin'

export default function render() {
  const C1 = v('c1', '#E9B43A'), C2 = v('c2', '#E5483F')
  const g = `url(#wg-soft3d-${N}-0)`
  const cy = 11.5
  const ln = (d, stroke, w, cls, op) => ['path', { d, stroke, 'stroke-width': w, ...(op ? { 'stroke-opacity': op } : {}), 'stroke-linecap': 'round', fill: 'none', class: cls }]
  const HOLE = 'M10.1 8.2H13.9A1.6 1.6 0 0 1 15.5 9.8V13.2A1.6 1.6 0 0 1 13.9 14.8H10.1A1.6 1.6 0 0 1 8.5 13.2V9.8A1.6 1.6 0 0 1 10.1 8.2Z'
  return [
    ['defs', {}, [['radialGradient', { id: `wg-soft3d-${N}-0`, cx: 0.32, cy: 0.22, r: 0.95 }, [stop(0, SN, 0.6), stop(0.4, SN, 0.05), stop(0.7, SH, 0), stop(1, SH, 0.3)]]]],
    ['ellipse', { cx: 12, cy: 21.4, rx: 8.4, ry: 1.3, fill: SH, 'fill-opacity': 0.06, class: 'wm-shadow' }],
    ['ellipse', { cx: 12, cy: 21.4, rx: 6.6, ry: 1, fill: SH, 'fill-opacity': 0.08, class: 'wm-shadow' }],
    ['ellipse', { cx: 12, cy: 21.4, rx: 4.6, ry: 0.7, fill: SH, 'fill-opacity': 0.11, class: 'wm-shadow' }],
    ['circle', { cx: 12, cy, r: 9.3, fill: C1, class: 'wm-k' }],
    ['circle', { cx: 12, cy, r: 9.3, fill: SH, 'fill-opacity': 0.14, class: 'wm-k' }],
    ['circle', { cx: 12, cy, r: 8.2, fill: C1, class: 'wm-k' }],
    ['circle', { cx: 12, cy, r: 8.2, fill: g, class: 'wm-k' }],
    ['circle', { cx: 12, cy, r: 7.2, stroke: SH, 'stroke-width': 0.5, 'stroke-opacity': 0.3, fill: 'none', class: 'wm-k' }],
    ln('M5.4 9.5A6.8 6.8 0 0 1 11 4.8', SN, 0.8, 'wm-shine', 0.75),
    ['path', { d: HOLE, fill: SH, 'fill-opacity': 0.8, stroke: SN, 'stroke-width': 0.6, 'stroke-opacity': 0.55, class: 'wm-k' }],
    ln('M9.6 9.1H14.2', SN, 0.4, 'wm-k', 0.25),
    ln('M10.8 5.7H13.2', C2, 1.5, 'wm-s'),
    ln('M10.8 17.3H13.2', C2, 1.5, 'wm-s'),
    ln('M5.7 10.3V12.7', C2, 1.5, 'wm-s'),
    ln('M18.3 10.3V12.7', C2, 1.5, 'wm-s'),
    ['circle', { cx: 18.5, cy: 5, r: 0.5, fill: SN, 'fill-opacity': 0.9, class: 'wm-deco' }],
  ]
}
