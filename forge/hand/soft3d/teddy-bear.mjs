// forge/hand/soft3d/teddy-bear.mjs: a front-facing plush bear (round head, two round ears, tan snout, chubby body)
// hugging a red heart against its tummy.
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const N = 'teddy-bear'

export default function render() {
  const C1 = v('c1', '#B8763E'), C2 = v('c2', '#E6C489'), C3 = v('c3', '#6B3F2A'), HEART = v('accent', '#E5483F')
  const g = `url(#wg-soft3d-${N}-0)`
  const ln = (d, stroke, w, cls, op) => ['path', { d, stroke, 'stroke-width': w, ...(op ? { 'stroke-opacity': op } : {}), 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none', class: cls }]
  const circ = (cx, cy, r, fill, cls, extra) => ['circle', { cx, cy, r, fill, ...(extra || {}), class: cls }]
  const BODY = 'M12 12.2C16.8 12.2 19.2 15.2 19.2 17.8C19.2 20 16.6 20.9 12 20.9C7.4 20.9 4.8 20 4.8 17.8C4.8 15.2 7.2 12.2 12 12.2Z'
  const HEARTP = 'M12 20C12 20 8.7 18 8.7 15.9C8.7 15 9.4 14.3 10.3 14.3C11 14.3 11.7 14.7 12 15.3C12.3 14.7 13 14.3 13.7 14.3C14.6 14.3 15.3 15 15.3 15.9C15.3 18 12 20 12 20Z'
  return [
    ['defs', {}, [['radialGradient', { id: `wg-soft3d-${N}-0`, cx: 0.32, cy: 0.2, r: 0.95 }, [stop(0, SN, 0.5), stop(0.4, SN, 0.05), stop(0.7, SH, 0), stop(1, SH, 0.28)]]]],
    ['ellipse', { cx: 12, cy: 21.3, rx: 8.2, ry: 1.3, fill: SH, 'fill-opacity': 0.06, class: 'wm-shadow' }],
    ['ellipse', { cx: 12, cy: 21.3, rx: 6.4, ry: 1, fill: SH, 'fill-opacity': 0.08, class: 'wm-shadow' }],
    ['ellipse', { cx: 12, cy: 21.3, rx: 4.4, ry: 0.7, fill: SH, 'fill-opacity': 0.11, class: 'wm-shadow' }],
    // ears
    circ(6.9, 4.4, 2.4, C1, 'wm-k'), circ(6.9, 4.4, 2.4, g, 'wm-k'), circ(6.9, 4.6, 1.2, C2, 'wm-k'),
    circ(17.1, 4.4, 2.4, C1, 'wm-k'), circ(17.1, 4.4, 2.4, g, 'wm-k'), circ(17.1, 4.6, 1.2, C2, 'wm-k'),
    // body
    ['path', { d: BODY, fill: C1, class: 'wm-k' }],
    ['path', { d: BODY, fill: g, class: 'wm-k' }],
    ['ellipse', { cx: 12, cy: 13.6, rx: 4.6, ry: 1.1, fill: SH, 'fill-opacity': 0.18, class: 'wm-k' }],
    // heart
    ['path', { d: HEARTP, fill: HEART, class: 'wm-a' }],
    ['path', { d: HEARTP, fill: g, class: 'wm-a' }],
    ln('M9.8 15.8C9.9 15.2 10.3 14.9 10.8 14.9', SN, 0.6, 'wm-shine', 0.85),
    // arms and paws hugging the heart
    ln('M6.5 15.2C6.3 16.8 7.2 18.1 8.9 18.3', C1, 2.6, 'wm-a'),
    ln('M17.5 15.2C17.7 16.8 16.8 18.1 15.1 18.3', C1, 2.6, 'wm-a'),
    ln('M6.5 15.2C6.3 16.8 7.2 18.1 8.9 18.3', SH, 2.6, 'wm-a', 0.1),
    ln('M17.5 15.2C17.7 16.8 16.8 18.1 15.1 18.3', SH, 2.6, 'wm-a', 0.1),
    ln('M5.9 15.1C5.8 16.2 6.1 17 6.7 17.6', SN, 0.5, 'wm-shine', 0.6),
    circ(9.1, 18.3, 1.35, C2, 'wm-a'),
    circ(14.9, 18.3, 1.35, C2, 'wm-a'),
    // head
    circ(12, 8.5, 5.5, C1, 'wm-k'), circ(12, 8.5, 5.5, g, 'wm-k'),
    ['ellipse', { cx: 12, cy: 10.7, rx: 2.8, ry: 2.2, fill: C2, class: 'wm-k' }],
    ['ellipse', { cx: 12, cy: 10.7, rx: 2.8, ry: 2.2, fill: g, class: 'wm-k' }],
    ['ellipse', { cx: 12, cy: 9.6, rx: 1.1, ry: 0.75, fill: C3, class: 'wm-k' }],
    ln('M12 10.4V11.4M10.8 11.7C11.3 12.3 12.7 12.3 13.2 11.7', C3, 0.5, 'wm-k'),
    circ(9.4, 7.5, 0.85, C3, 'wm-k'), circ(14.6, 7.5, 0.85, C3, 'wm-k'),
    circ(9.2, 7.2, 0.28, SN, 'wm-shine'), circ(14.4, 7.2, 0.28, SN, 'wm-shine'),
    ln('M7.4 7C7.7 5.9 8.5 5.1 9.6 4.8', SN, 0.7, 'wm-shine', 0.5),
  ]
}
