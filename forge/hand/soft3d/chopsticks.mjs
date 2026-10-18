// forge/hand/soft3d/chopsticks.mjs: a plain glossy porcelain bowl with a red band and gold dots, and two long
// lacquer-red chopsticks with gold tips angled up and to the right out of it.
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const N = 'chopsticks'

export default function render() {
  const C1 = v('c1', '#F4EFE6'), C2 = v('c2', '#D9343A'), C3 = v('c3', '#E8B04A')
  const g = `url(#wg-soft3d-${N}-0)`
  const ln = (d, stroke, w, cls, op) => ['path', { d, stroke, 'stroke-width': w, ...(op ? { 'stroke-opacity': op } : {}), 'stroke-linecap': 'round', fill: 'none', class: cls }]
  // x1,y1 = the lower end inside the bowl, x2,y2 = the tip
  const stick = (x1, y1, x2, y2) => [
    ln(`M${x1} ${y1}L${x2} ${y2}`, C2, 2.1, 'wm-a'),
    ln(`M${x2} ${y2}L${(x2 - (x2 - x1) * 0.2).toFixed(2)} ${(y2 + (y1 - y2) * 0.2).toFixed(2)}`, C3, 2.1, 'wm-a'),
    ln(`M${(x1 - 0.4).toFixed(2)} ${(y1 - 0.4).toFixed(2)}L${(x2 - 0.4).toFixed(2)} ${(y2 - 0.4).toFixed(2)}`, SN, 0.5, 'wm-shine', 0.5),
  ]
  const BOWL = 'M3 11.5h18c0 5.5-4 9-9 9s-9-3.5-9-9z'
  return [
    ['defs', {}, [['radialGradient', { id: `wg-soft3d-${N}-0`, cx: 0.34, cy: 0.2, r: 0.95 }, [stop(0, SN, 0.6), stop(0.4, SN, 0.05), stop(0.7, SH, 0), stop(1, SH, 0.28)]]]],
    ['ellipse', { cx: 12, cy: 21.3, rx: 8.6, ry: 1.3, fill: SH, 'fill-opacity': 0.06, class: 'wm-shadow' }],
    ['ellipse', { cx: 12, cy: 21.3, rx: 6.6, ry: 1, fill: SH, 'fill-opacity': 0.08, class: 'wm-shadow' }],
    ['ellipse', { cx: 12, cy: 21.3, rx: 4.4, ry: 0.7, fill: SH, 'fill-opacity': 0.11, class: 'wm-shadow' }],
    ['path', { d: BOWL, fill: C1, class: 'wm-k' }],
    ['path', { d: BOWL, fill: g, class: 'wm-k' }],
    ['path', { d: 'M3.15 13.1H20.85L20.55 14.6H3.45Z', fill: C2, class: 'wm-s' }],
    ['circle', { cx: 8, cy: 16.8, r: 0.6, fill: C3, class: 'wm-deco' }],
    ['circle', { cx: 12, cy: 18.2, r: 0.6, fill: C3, class: 'wm-deco' }],
    ['circle', { cx: 16, cy: 16.8, r: 0.6, fill: C3, class: 'wm-deco' }],
    ['ellipse', { cx: 12, cy: 11.5, rx: 9, ry: 1.4, fill: C1, class: 'wm-k' }],
    ['ellipse', { cx: 12, cy: 11.6, rx: 8.1, ry: 0.95, fill: SH, 'fill-opacity': 0.55, class: 'wm-k' }],
    ...stick(8, 11.4, 17.2, 2.6),
    ...stick(13, 11.4, 21.4, 3.4),
    ln('M5 15.8c.4 1.1 1.1 2 2 2.7', SN, 0.6, 'wm-shine', 0.55),
  ]
}
