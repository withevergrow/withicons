// forge/hand/soft3d/taxi.mjs — a straight side-profile cab like the line drawing (low body, cabin with one window,
// roof sign, two wheels), soft lit volume, replacing the generated three-quarter isometric block.
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const BODY = v('c1', '#F7C531'), GLASS = v('c2', '#3A404C'), SIGN = v('c4', '#F6F4EC'), INK = v('ink', '#2B2F3A')
const ACC = v('accent', '#E8452E')
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF'), TINT = v('tint', '#A9D8F2')
const id = n => `wg-soft3d-taxi-${n}`
const stop = (o, c, op) => ['stop', op == null ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const S = (d, stroke, w, extra, cls) => P(d, { fill: 'none', stroke, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }, cls)
const circ = (cx, cy, r) => `M${+(cx - r).toFixed(2)} ${cy} A${r} ${r} 0 1 0 ${+(cx + r).toFixed(2)} ${cy} A${r} ${r} 0 1 0 ${+(cx - r).toFixed(2)} ${cy} Z`

export default function render() {
  const defs = ['defs', {}, [
    // body: light from above, shadow along the sill
    ['linearGradient', { id: id(0), x1: 0, y1: 0, x2: 0.25, y2: 1 }, [stop(0, SN, 0.45), stop(0.3, SN, 0.05), stop(0.62, SH, 0), stop(1, SH, 0.32)]],
    ['linearGradient', { id: id(1), x1: 0, y1: 0, x2: 0.3, y2: 1 }, [stop(0, TINT, 0.75), stop(0.55, TINT, 0.1), stop(1, SH, 0.2)]],
    ['radialGradient', { id: id(2), cx: 0.35, cy: 0.3, r: 0.9 }, [stop(0, SN, 0.6), stop(0.5, SN, 0), stop(1, SH, 0.3)]],
  ]]
  const g0 = `url(#${id(0)})`, g1 = `url(#${id(1)})`, g2 = `url(#${id(2)})`
  const body = 'M4.2 18.4 H19.8 A1.8 1.8 0 0 0 21.6 16.6 V14.6 A2.3 2.3 0 0 0 19.3 12.3 H17.7 L14.6 8.3 Q14.1 7.6 13.3 7.6 H8.6 Q7.8 7.6 7.5 8.3 L5.5 12.3 H4.7 A2.3 2.3 0 0 0 2.4 14.6 V16.6 A1.8 1.8 0 0 0 4.2 18.4 Z'
  const win = 'M8.9 8.9 H13.2 Q13.6 8.9 13.85 9.25 L15.5 11.5 H7.4 L8.4 9.4 Q8.55 8.9 8.9 8.9 Z'
  const sign = 'M10.1 3.4 H12.9 A1.1 1.1 0 0 1 14 4.5 V7.8 H9 V4.5 A1.1 1.1 0 0 1 10.1 3.4 Z'
  const W1 = [7.1, 18.4], W2 = [16.9, 18.4]
  return [
    defs,
    P('M3.4 21.6 A8.8 1.5 0 1 0 21 21.6 A8.8 1.5 0 1 0 3.4 21.6 Z', { fill: SH, 'fill-opacity': 0.06 }, 'wm-shadow'),
    P('M4.8 21.6 A7.4 1.2 0 1 0 19.6 21.6 A7.4 1.2 0 1 0 4.8 21.6 Z', { fill: SH, 'fill-opacity': 0.08 }, 'wm-shadow'),
    P('M6.6 21.6 A5.6 0.9 0 1 0 17.8 21.6 A5.6 0.9 0 1 0 6.6 21.6 Z', { fill: SH, 'fill-opacity': 0.11 }, 'wm-shadow'),
    // roof sign, standing on the roof
    P(sign, { fill: SIGN }, 'wm-s'),
    P(sign, { fill: g2 }, 'wm-s'),
    S('M10.4 5.7 H12.6', ACC, 0.9, {}, 'wm-s'),
    S('M10.2 4.3 H11.4', SN, 0.5, { 'stroke-opacity': 0.9 }, 'wm-shine'),
    // the body
    P(body, { fill: BODY }, 'wm-k'),
    P(body, { fill: g0 }, 'wm-k'),
    // window
    P(win, { fill: GLASS }, 'wm-s'),
    P(win, { fill: g1 }, 'wm-s'),
    S('M9.3 9.9 H12', SN, 0.45, { 'stroke-opacity': 0.8 }, 'wm-shine'),
    // door shut line and belt highlight
    S('M11.3 12.6 V16.6', SH, 0.4, { 'stroke-opacity': 0.3 }, 'wm-k'),
    S('M3.6 13.9 H20.3', SN, 0.5, { 'stroke-opacity': 0.55 }, 'wm-shine'),
    // lamps
    P(circ(21.2, 14.5, 0.75), { fill: SN }, 'wm-s'),
    P(circ(2.8, 14.9, 0.65), { fill: ACC }, 'wm-s'),
    // wheel arches and wheels
    P(circ(W1[0], W1[1], 2.95), { fill: SH, 'fill-opacity': 0.5 }, 'wm-k'),
    P(circ(W2[0], W2[1], 2.95), { fill: SH, 'fill-opacity': 0.5 }, 'wm-k'),
    P(circ(W1[0], 18.5, 2.25), { fill: INK }, 'wm-a'),
    P(circ(W2[0], 18.5, 2.25), { fill: INK }, 'wm-a'),
    P(circ(W1[0], 18.5, 1.05), { fill: SIGN }, 'wm-a'),
    P(circ(W2[0], 18.5, 1.05), { fill: SIGN }, 'wm-a'),
    S('M5.3 17.2 A2 2 0 0 1 7.6 16.3', SN, 0.4, { 'stroke-opacity': 0.55 }, 'wm-shine'),
    S('M15.1 17.2 A2 2 0 0 1 17.4 16.3', SN, 0.4, { 'stroke-opacity': 0.55 }, 'wm-shine'),
  ]
}
