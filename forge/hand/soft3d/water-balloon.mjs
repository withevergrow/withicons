// forge/hand/soft3d/water-balloon.mjs: a round pink balloon sack tied off with a flared knot, filled with blue water
// whose wavy surface is clearly visible; glossy highlight on the upper left.
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const N = 'water-balloon'

export default function render() {
  const C1 = v('c1', '#F27BA5'), WATER = v('tint', '#A9D8F2'), C2 = v('c2', '#4FB463')
  const g = `url(#wg-soft3d-${N}-0)`
  const BODY = 'M12 7.4C8 8.4 4.5 11 4.5 14.6C4.5 18.2 7.8 20.8 12 20.8C16.2 20.8 19.5 18.2 19.5 14.6C19.5 11 16 8.4 12 7.4Z'
  const KNOT = 'M12 7.9C11.3 7 10.3 5.6 9.8 3.4C11.3 4 12.7 4 14.2 3.4C13.7 5.6 12.7 7 12 7.9Z'
  const WATER_P = 'M4.8 15.8C6.5 14.6 8.3 17 10.1 15.8C11.9 14.6 13.7 17 15.5 15.8C16.9 14.9 18.2 15 19.2 15.8C19.2 18.5 16.1 20.55 12 20.55C7.9 20.55 4.8 18.5 4.8 15.8Z'
  const ln = (d, stroke, w, cls, op) => ['path', { d, stroke, 'stroke-width': w, ...(op ? { 'stroke-opacity': op } : {}), 'stroke-linecap': 'round', fill: 'none', class: cls }]
  return [
    ['defs', {}, [['radialGradient', { id: `wg-soft3d-${N}-0`, cx: 0.34, cy: 0.3, r: 0.85 }, [stop(0, SN, 0.6), stop(0.4, SN, 0.05), stop(0.7, SH, 0), stop(1, SH, 0.28)]]]],
    ['ellipse', { cx: 12, cy: 21.3, rx: 8, ry: 1.3, fill: SH, 'fill-opacity': 0.06, class: 'wm-shadow' }],
    ['ellipse', { cx: 12, cy: 21.3, rx: 6.2, ry: 1, fill: SH, 'fill-opacity': 0.08, class: 'wm-shadow' }],
    ['ellipse', { cx: 12, cy: 21.3, rx: 4.2, ry: 0.7, fill: SH, 'fill-opacity': 0.11, class: 'wm-shadow' }],
    ['path', { d: BODY, fill: C1, class: 'wm-k' }],
    ['path', { d: WATER_P, fill: WATER, class: 'wm-a' }],
    ['path', { d: WATER_P, fill: C1, 'fill-opacity': 0.22, class: 'wm-a' }],
    ln('M5.2 15.8C6.8 14.8 8.4 17.1 10.1 15.9C11.9 14.7 13.6 17 15.5 15.8C16.8 15 18 15.1 18.9 15.7', SN, 0.7, 'wm-shine', 0.85),
    ['path', { d: BODY, fill: g, class: 'wm-k' }],
    ['path', { d: KNOT, fill: C1, class: 'wm-s' }],
    ['path', { d: KNOT, fill: SH, 'fill-opacity': 0.22, class: 'wm-s' }],
    ln('M10.4 5.4C11.5 5.9 12.5 5.9 13.6 5.4', SH, 0.5, 'wm-s', 0.3),
    ['circle', { cx: 18.3, cy: 6.4, r: 0.6, fill: C2, class: 'wm-deco' }],
    ln('M6.8 14C7.3 12.4 8.5 11.2 10 10.5', SN, 1.3, 'wm-shine', 0.8),
    ['circle', { cx: 6.6, cy: 16.8, r: 0.5, fill: SN, 'fill-opacity': 0.7, class: 'wm-shine' }],
  ]
}
