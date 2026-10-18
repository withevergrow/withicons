// forge/hand/soft3d/car-front.mjs — a small red car seen dead-on and symmetrical, like the line design: a rounded cabin
// with one big glass windscreen, a rounded body with two light headlights and a dark grille, two black wheels poking out
// below. Replaces the generated 3/4-angled extrusion. Same studio recipe as the hand-drawn monitor (tonal face, soft light).
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const N = 'car-front'
const f = x => +x.toFixed(2)
const RR = (x, y, w, h, r) => `M${f(x + r)} ${f(y)}H${f(x + w - r)}A${r} ${r} 0 0 1 ${f(x + w)} ${f(y + r)}V${f(y + h - r)}A${r} ${r} 0 0 1 ${f(x + w - r)} ${f(y + h)}H${f(x + r)}A${r} ${r} 0 0 1 ${f(x)} ${f(y + h - r)}V${f(y + r)}A${r} ${r} 0 0 1 ${f(x + r)} ${f(y)}Z`
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const S = (d, stroke, w, op, cls) => P(d, { fill: 'none', stroke, 'stroke-width': w, 'stroke-opacity': op, 'stroke-linecap': 'round' }, cls)

export default function render() {
  const BODY = v('c1', '#E5483F'), WHEEL = v('c2', '#3A404C'), LAMP = v('c3', '#BFC7D2'), GRILL = v('ink', '#232733'), GLASS = v('tint', '#A9D8F2')
  const g = `url(#wg-soft3d-${N}-0)`
  // cabin: trapezoid with rounded roof corners; body: rounded slab overlapping its base
  const CABIN = 'M5.2 11.5L7.4 6.2Q7.9 4.8 9.3 4.8H14.7Q16.1 4.8 16.6 6.2L18.8 11.5Z'
  const GLASSD = 'M7.2 11L8.9 7.1Q9.1 6.5 9.8 6.5H14.2Q14.9 6.5 15.1 7.1L16.8 11Z'
  const BODYD = RR(2.5, 10.6, 19, 8.2, 2.6)
  const WL = RR(4.6, 17, 3.6, 4.4, 1.2), WR = RR(15.8, 17, 3.6, 4.4, 1.2)
  return [
    ['defs', {}, [['radialGradient', { id: `wg-soft3d-${N}-0`, cx: 0.3, cy: 0.18, r: 1 }, [stop(0, SN, 0.55), stop(0.4, SN, 0.06), stop(0.7, SH, 0), stop(1, SH, 0.3)]]]],
    ['ellipse', { cx: 12, cy: 21.6, rx: 10.2, ry: 1.2, fill: SH, 'fill-opacity': 0.06, class: 'wm-shadow' }],
    ['ellipse', { cx: 12, cy: 21.6, rx: 8.2, ry: 0.95, fill: SH, 'fill-opacity': 0.08, class: 'wm-shadow' }],
    ['ellipse', { cx: 12, cy: 21.6, rx: 6, ry: 0.7, fill: SH, 'fill-opacity': 0.11, class: 'wm-shadow' }],
    // wheels, behind the body
    P(WL, { fill: WHEEL }, 'wm-k'), P(WR, { fill: WHEEL }, 'wm-k'),
    P(WL, { fill: SH, 'fill-opacity': 0.35 }, 'wm-k'), P(WR, { fill: SH, 'fill-opacity': 0.35 }, 'wm-k'),
    S('M5.5 19.2V20.6', SN, 0.5, 0.4, 'wm-shine'), S('M16.7 19.2V20.6', SN, 0.5, 0.4, 'wm-shine'),
    // cabin + windscreen
    P(CABIN, { fill: BODY }, 'wm-k'), P(CABIN, { fill: g }, 'wm-k'),
    P(GLASSD, { fill: SH, 'fill-opacity': 0.5 }, 'wm-k'),
    P(GLASSD, { fill: GLASS, 'fill-opacity': 0.9 }, 'wm-k'),
    P(GLASSD, { fill: g }, 'wm-k'),
    P('M8.3 10.6L9.9 7.1H11.6L9.7 10.6Z', { fill: SN, 'fill-opacity': 0.55 }, 'wm-shine'),
    P('M10.6 10.6L12.4 7.1H13.1L11.4 10.6Z', { fill: SN, 'fill-opacity': 0.35 }, 'wm-shine'),
    S('M8.3 5.5H13.5', SN, 0.5, 0.6, 'wm-shine'),
    // side mirrors
    P(RR(1.8, 10.2, 2.4, 1.7, 0.8), { fill: BODY }, 'wm-k'), P(RR(19.8, 10.2, 2.4, 1.7, 0.8), { fill: BODY }, 'wm-k'),
    P(RR(1.8, 10.2, 2.4, 1.7, 0.8), { fill: SH, 'fill-opacity': 0.2 }, 'wm-k'), P(RR(19.8, 10.2, 2.4, 1.7, 0.8), { fill: SH, 'fill-opacity': 0.2 }, 'wm-k'),
    // body
    P(RR(2.5, 11.3, 19, 8.2, 2.6), { fill: SH, 'fill-opacity': 0.3 }, 'wm-k'),
    P(BODYD, { fill: BODY }, 'wm-k'), P(BODYD, { fill: g }, 'wm-k'),
    S('M5.2 11.5H18.8', SN, 0.6, 0.55, 'wm-shine'),
    P(RR(3.2, 17.3, 17.6, 1.3, 0.65), { fill: SH, 'fill-opacity': 0.22 }, 'wm-k'),
    // grille + headlights
    P(RR(8.6, 14.7, 6.8, 2.3, 1.15), { fill: GRILL }, 'wm-k'),
    S('M9.9 15.85H14.1', SN, 0.4, 0.3, 'wm-shine'),
    P(RR(4.3, 13, 3.8, 2.4, 1.2), { fill: SH, 'fill-opacity': 0.4 }, 'wm-k'), P(RR(15.9, 13, 3.8, 2.4, 1.2), { fill: SH, 'fill-opacity': 0.4 }, 'wm-k'),
    P(RR(4.4, 12.9, 3.6, 2.2, 1.1), { fill: LAMP }, 'wm-k'), P(RR(16, 12.9, 3.6, 2.2, 1.1), { fill: LAMP }, 'wm-k'),
    P(RR(4.4, 12.9, 3.6, 2.2, 1.1), { fill: g }, 'wm-k'), P(RR(16, 12.9, 3.6, 2.2, 1.1), { fill: g }, 'wm-k'),
    S('M5.1 13.5H6.5', SN, 0.5, 0.9, 'wm-shine'), S('M16.7 13.5H18.1', SN, 0.5, 0.9, 'wm-shine'),
  ]
}
