// forge/hand/soft3d/santa-hat.mjs: a red cone swooping to the right, a wide fluffy white brim band under it and a
// white pompom at the tip.
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const N = 'santa-hat'

export default function render() {
  const C1 = v('c1', '#E5483F'), C2 = v('c2', '#EEF1F5')
  const g = `url(#wg-soft3d-${N}-0)`, g2 = `url(#wg-soft3d-${N}-1)`
  const CONE = 'M5.4 17.4C5.4 10.8 8.1 4.5 12.8 4.1C16 3.8 18.5 5.8 19.4 9C17.3 10.8 17.6 14.2 18.6 17.4Z'
  const BRIM = 'M5.6 16.2H18.4A2.4 2.4 0 0 1 18.4 20.6H5.6A2.4 2.4 0 0 1 5.6 16.2Z'
  const ln = (d, stroke, w, cls, op) => ['path', { d, stroke, 'stroke-width': w, ...(op ? { 'stroke-opacity': op } : {}), 'stroke-linecap': 'round', fill: 'none', class: cls }]
  const shade = [stop(0, SN, 0.6), stop(0.4, SN, 0.05), stop(0.7, SH, 0), stop(1, SH, 0.28)]
  return [
    ['defs', {}, [
      ['radialGradient', { id: `wg-soft3d-${N}-0`, cx: 0.3, cy: 0.2, r: 0.95 }, shade],
      ['linearGradient', { id: `wg-soft3d-${N}-1`, x1: 0, y1: 0, x2: 0, y2: 1 }, [stop(0, SN, 0.45), stop(0.3, SN, 0), stop(0.65, SH, 0), stop(1, SH, 0.22)]],
    ]],
    ['ellipse', { cx: 12, cy: 21.4, rx: 9.2, ry: 1.3, fill: SH, 'fill-opacity': 0.06, class: 'wm-shadow' }],
    ['ellipse', { cx: 12, cy: 21.4, rx: 7.4, ry: 1, fill: SH, 'fill-opacity': 0.08, class: 'wm-shadow' }],
    ['ellipse', { cx: 12, cy: 21.4, rx: 5.2, ry: 0.7, fill: SH, 'fill-opacity': 0.11, class: 'wm-shadow' }],
    ['path', { d: CONE, fill: C1, class: 'wm-k' }],
    ['path', { d: CONE, fill: g, class: 'wm-k' }],
    ln('M19 9.4C17.6 11.2 17.8 14.2 18.5 16.8', SH, 0.6, 'wm-k', 0.28),
    ln('M7.2 14.6C7.5 10.8 9 7 11.6 5.6', SN, 0.9, 'wm-shine', 0.6),
    ['path', { d: 'M5.5 16.8H18.5V18H5.5Z', fill: SH, 'fill-opacity': 0.2, class: 'wm-k' }],
    ['path', { d: BRIM, fill: C2, class: 'wm-s' }],
    ['path', { d: BRIM, fill: g2, class: 'wm-s' }],
    ln('M6.2 19.3H17.8', SH, 0.5, 'wm-s', 0.12),
    ln('M6 17.3H12', SN, 0.7, 'wm-shine', 0.8),
    ['circle', { cx: 19.6, cy: 9.7, r: 2.6, fill: C2, class: 'wm-a' }],
    ['circle', { cx: 19.6, cy: 9.7, r: 2.6, fill: g, class: 'wm-a' }],
    ['circle', { cx: 18.7, cy: 8.8, r: 0.8, fill: SN, 'fill-opacity': 0.8, class: 'wm-shine' }],
  ]
}
