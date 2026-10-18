// forge/hand/soft3d/monitor.mjs: a soft 3D silver monitor with inset dark glass on a centred tapered neck and a wide
// oval foot, so it reads as a desktop monitor on a stand (the earlier stand was off-centre and broken).
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const N = 'monitor'

export default function render() {
  const C1 = v('c1', '#C9CFD8'), C2 = v('c2', '#9AA3B0'), INK = v('ink', '#262A36'), C3 = v('c3', '#5BB8E8')
  const g = `url(#wg-soft3d-${N}-0)`
  const FRAME = 'M4.5 3h15A2.5 2.5 0 0 1 22 5.5V14a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 14V5.5A2.5 2.5 0 0 1 4.5 3z'
  const NECK = 'M10.6 16h2.8l.5 3.6h-3.8z'
  return [
    ['defs', {}, [['radialGradient', { id: `wg-soft3d-${N}-0`, cx: 0.32, cy: 0.22, r: 0.95 }, [stop(0, SN, 0.6), stop(0.4, SN, 0.06), stop(0.7, SH, 0), stop(1, SH, 0.28)]]]],
    ['ellipse', { cx: 12, cy: 21.6, rx: 6.5, ry: 0.9, fill: SH, 'fill-opacity': 0.14, class: 'wm-shadow' }],
    ['path', { d: NECK, fill: C2, class: 'wm-k' }],
    ['path', { d: NECK, fill: SH, 'fill-opacity': 0.18, class: 'wm-k' }],
    ['ellipse', { cx: 12, cy: 20.2, rx: 5, ry: 1.2, fill: C1, class: 'wm-k' }],
    ['ellipse', { cx: 12, cy: 20.2, rx: 5, ry: 1.2, fill: g, class: 'wm-k' }],
    ['path', { d: 'M8.4 19.7h7.2', stroke: SN, 'stroke-width': 0.5, 'stroke-opacity': 0.6, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
    ['path', { d: FRAME, fill: C1, class: 'wm-k' }],
    ['path', { d: FRAME, fill: g, class: 'wm-k' }],
    ['rect', { x: 3.9, y: 4.9, width: 16.2, height: 9.7, rx: 1, fill: INK, class: 'wm-k' }],
    ['path', { d: 'M5.2 13.3L11 5.9h3.2l-5.8 7.4z', fill: C3, 'fill-opacity': 0.35, class: 'wm-shine' }],
    ['path', { d: 'M4.6 3.9h14.8', stroke: SN, 'stroke-width': 0.6, 'stroke-opacity': 0.7, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
  ]
}
