// forge/hand/soft3d/bus.mjs — a chunky front-facing bus like the line drawing (destination board, one wide windscreen,
// a cream stripe, two round headlights, a bumper and two wheel stubs) with soft lit volume, replacing the generated
// angled three-quarter box.
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const BODY = v('c1', '#E5483F'), GLASS = v('c2', '#3A404C'), CREAM = v('c3', '#F3E7D3'), INK = v('ink', '#232733')
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF'), TINT = v('tint', '#A9D8F2')
const id = n => `wg-soft3d-bus-${n}`
const stop = (o, c, op) => ['stop', op == null ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const S = (d, stroke, w, extra, cls) => P(d, { fill: 'none', stroke, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }, cls)
const circ = (cx, cy, r) => `M${cx - r} ${cy} A${r} ${r} 0 1 0 ${cx + r} ${cy} A${r} ${r} 0 1 0 ${cx - r} ${cy} Z`

export default function render() {
  const defs = ['defs', {}, [
    // body roundness: lit from the upper left, turning into shadow at the right and the bottom
    ['linearGradient', { id: id(0), x1: 0, y1: 0, x2: 1, y2: 1 }, [stop(0, SN, 0.4), stop(0.35, SN, 0), stop(0.6, SH, 0), stop(1, SH, 0.3)]],
    // glass: sky tint on top fading into the dark glass
    ['linearGradient', { id: id(1), x1: 0, y1: 0, x2: 0.3, y2: 1 }, [stop(0, TINT, 0.7), stop(0.5, TINT, 0.12), stop(1, SH, 0.2)]],
    // headlights: a bright dome
    ['radialGradient', { id: id(2), cx: 0.35, cy: 0.3, r: 0.8 }, [stop(0, SN, 0.9), stop(0.5, SN, 0), stop(1, SH, 0.25)]],
  ]]
  const g0 = `url(#${id(0)})`, g1 = `url(#${id(1)})`, g2 = `url(#${id(2)})`
  const body = 'M6.5 2.25 H17.5 A2.5 2.5 0 0 1 20 4.75 V18.25 A2.5 2.5 0 0 1 17.5 20.75 H6.5 A2.5 2.5 0 0 1 4 18.25 V4.75 A2.5 2.5 0 0 1 6.5 2.25 Z'
  const screen = 'M6 8 H18 A1 1 0 0 1 19 9 V11.5 A1 1 0 0 1 18 12.5 H6 A1 1 0 0 1 5 11.5 V9 A1 1 0 0 1 6 8 Z'
  const sign = 'M7.75 3.9 H16.25 A0.9 0.9 0 0 1 17.15 4.8 V5.2 A0.9 0.9 0 0 1 16.25 6.1 H7.75 A0.9 0.9 0 0 1 6.85 5.2 V4.8 A0.9 0.9 0 0 1 7.75 3.9 Z'
  const bumper = 'M5.5 18.4 H18.5 A0.75 0.75 0 0 1 19.25 19.15 V19.35 A1.4 1.4 0 0 1 17.85 20.75 H6.15 A1.4 1.4 0 0 1 4.75 19.35 V19.15 A0.75 0.75 0 0 1 5.5 18.4 Z'
  return [
    defs,
    P('M3.6 21.7 A8.4 1.6 0 1 0 20.4 21.7 A8.4 1.6 0 1 0 3.6 21.7 Z', { fill: SH, 'fill-opacity': 0.06 }, 'wm-shadow'),
    P('M5 21.7 A7 1.25 0 1 0 19 21.7 A7 1.25 0 1 0 5 21.7 Z', { fill: SH, 'fill-opacity': 0.08 }, 'wm-shadow'),
    P('M6.6 21.7 A5.4 0.9 0 1 0 17.4 21.7 A5.4 0.9 0 1 0 6.6 21.7 Z', { fill: SH, 'fill-opacity': 0.11 }, 'wm-shadow'),
    // wheel stubs poking out under the bumper
    P('M5.9 19.5 H9 V21.1 A0.9 0.9 0 0 1 8.1 22 H6.8 A0.9 0.9 0 0 1 5.9 21.1 Z', { fill: INK }, 'wm-a'),
    P('M15 19.5 H18.1 V21.1 A0.9 0.9 0 0 1 17.2 22 H15.9 A0.9 0.9 0 0 1 15 21.1 Z', { fill: INK }, 'wm-a'),
    // the body
    P(body, { fill: BODY }, 'wm-k'),
    P(body, { fill: g0 }, 'wm-k'),
    S('M4.9 6 V16', SN, 0.6, { 'stroke-opacity': 0.5 }, 'wm-shine'),
    S('M19.1 8 V17.5', SH, 0.5, { 'stroke-opacity': 0.28 }, 'wm-k'),
    // destination board
    P(sign, { fill: GLASS }, 'wm-s'),
    S('M8.6 5 H13', CREAM, 0.8, {}, 'wm-s'),
    // the windscreen
    P(screen, { fill: GLASS }, 'wm-s'),
    P(screen, { fill: g1 }, 'wm-s'),
    S('M6.2 8.9 H10.2', SN, 0.5, { 'stroke-opacity': 0.8 }, 'wm-shine'),
    S('M12 8.2 V12.3', BODY, 0.7, {}, 'wm-k'),
    // cream stripe
    S('M5.2 13.9 H18.8', CREAM, 1, {}, 'wm-k'),
    // headlights
    P(circ(7.75, 16.2, 1.45), { fill: CREAM }, 'wm-s'),
    P(circ(16.25, 16.2, 1.45), { fill: CREAM }, 'wm-s'),
    P(circ(7.75, 16.2, 1.45), { fill: g2 }, 'wm-s'),
    P(circ(16.25, 16.2, 1.45), { fill: g2 }, 'wm-s'),
    // bumper
    P(bumper, { fill: GLASS }, 'wm-k'),
    S('M6 18.9 H12', SN, 0.4, { 'stroke-opacity': 0.4 }, 'wm-shine'),
    // top-left gloss on the roof
    S('M6.1 3.2 H12', SN, 0.55, { 'stroke-opacity': 0.75 }, 'wm-shine'),
  ]
}
