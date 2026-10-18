// forge/hand/soft3d/router.mjs — a wide flat-topped rounded charcoal box (a lit top band, a soft dark heel), two upright
// silver antennas on hinge nubs and the front panel of the line drawing: two glowing status lights and a silver bar.
// The generated extruded solid read as a curved headset-like shape; this one is face-on with just a hint of top, so
// the box, the antennas and the lights read at 16px. Same studio recipe as the hand-drawn coffee and cup-soda.
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const BODY = v('c1', '#3A404C'), SILVER = v('c2', '#BFC7D2'), LED_B = v('c3', '#3D7EE0'), LED_G = v('accent', '#4FD27A')
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const id = n => `wg-soft3d-router-${n}`
const stop = (o, c, op) => ['stop', op == null ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const S = (d, stroke, w, extra, cls) => P(d, { fill: 'none', stroke, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }, cls)
const dot = (cx, cy, r) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0z`

export default function render() {
  const defs = ['defs', {}, [
    // the box: lit along the top, turning into shadow toward the heel
    ['linearGradient', { id: id(0), x1: 0, y1: 0, x2: 0.15, y2: 1 }, [stop(0, SN, 0.3), stop(0.3, SN, 0.04), stop(0.55, SH, 0), stop(1, SH, 0.34)]],
    // the antennas: a round rod, lit on the left, shaded on the right
    ['linearGradient', { id: id(1), x1: 0, y1: 0, x2: 1, y2: 0 }, [stop(0, SN, 0.55), stop(0.35, SN, 0), stop(0.65, SH, 0), stop(1, SH, 0.3)]],
  ]]
  const g0 = `url(#${id(0)})`, g1 = `url(#${id(1)})`
  // box: x 2..22, y 12.5..20.75 (front 20 wide, 8.25 tall), corners 2.6
  const body = 'M4.6 12.5 H19.4 A2.6 2.6 0 0 1 22 15.1 V18.15 A2.6 2.6 0 0 1 19.4 20.75 H4.6 A2.6 2.6 0 0 1 2 18.15 V15.1 A2.6 2.6 0 0 1 4.6 12.5 Z'
  const top = 'M4.6 12.5 H19.4 A2.6 2.6 0 0 1 22 15.1 V15.3 H2 V15.1 A2.6 2.6 0 0 1 4.6 12.5 Z'
  const antL = 'M6.6 13.2 L5.6 4.6', antR = 'M17.4 13.2 L18.4 4.6'
  return [
    defs,
    // contact shadow
    P('M2.4 21.4 A9.6 1.5 0 1 0 21.6 21.4 A9.6 1.5 0 1 0 2.4 21.4 Z', { fill: SH, 'fill-opacity': 0.06 }, 'wm-shadow'),
    P('M3.9 21.4 A8.1 1.2 0 1 0 20.1 21.4 A8.1 1.2 0 1 0 3.9 21.4 Z', { fill: SH, 'fill-opacity': 0.08 }, 'wm-shadow'),
    P('M5.7 21.4 A6.3 0.9 0 1 0 18.3 21.4 A6.3 0.9 0 1 0 5.7 21.4 Z', { fill: SH, 'fill-opacity': 0.11 }, 'wm-shadow'),
    // the antennas: a silver rod with a shaded underside and a lit edge, a ball-less rounded tip
    S(antL, SILVER, 2, {}, 'wm-a'), S(antL, g1, 2, {}, 'wm-a'),
    S('M5.15 6.4 L5.85 11.6', SN, 0.4, { 'stroke-opacity': 0.7 }, 'wm-shine'),
    S(antR, SILVER, 2, {}, 'wm-a'), S(antR, g1, 2, {}, 'wm-a'),
    S('M17.95 6.4 L18.65 11.6', SN, 0.4, { 'stroke-opacity': 0.7 }, 'wm-shine'),
    // the box
    P(body, { fill: BODY }, 'wm-k'),
    P(body, { fill: g0 }, 'wm-k'),
    // the hinge nubs where the antennas meet the top
    P('M5.2 12.5 H8 V13.3 H5.2 Z', { fill: SH, 'fill-opacity': 0.5 }, 'wm-k'),
    P('M16 12.5 H18.8 V13.3 H16 Z', { fill: SH, 'fill-opacity': 0.5 }, 'wm-k'),
    // the top band catches the light, a thin seam under it
    P(top, { fill: SN, 'fill-opacity': 0.16 }, 'wm-shine'),
    S('M2.6 15.45 H21.4', SH, 0.45, { 'stroke-opacity': 0.35 }, 'wm-k'),
    // a lit rim up the left, a dark heel along the lower right
    S('M2.5 15.6 V18', SN, 0.5, { 'stroke-opacity': 0.55 }, 'wm-shine'),
    S('M21.5 15.8 V18 C21.5 19.5 20.6 20.25 19.2 20.25 H11', SH, 0.55, { 'stroke-opacity': 0.4 }, 'wm-k'),
    S('M4.8 12.95 H19.2', SN, 0.5, { 'stroke-opacity': 0.55 }, 'wm-shine'),
    // the status lights: a halo, the lens, a spark
    P(dot(6.2, 17.9, 1.9), { fill: LED_G, 'fill-opacity': 0.25 }, 'wm-a'),
    P(dot(6.2, 17.9, 1.15), { fill: LED_G }, 'wm-a'),
    P(dot(5.85, 17.55, 0.35), { fill: SN, 'fill-opacity': 0.85 }, 'wm-shine'),
    P(dot(9.7, 17.9, 1.9), { fill: LED_B, 'fill-opacity': 0.25 }, 'wm-a'),
    P(dot(9.7, 17.9, 1.15), { fill: LED_B }, 'wm-a'),
    P(dot(9.35, 17.55, 0.35), { fill: SN, 'fill-opacity': 0.85 }, 'wm-shine'),
    // the bar: a recessed slot holding a silver strip
    P('M13 16.9 H19 A1 1 0 0 1 19 18.9 H13 A1 1 0 0 1 13 16.9 Z', { fill: SH, 'fill-opacity': 0.5 }, 'wm-k'),
    P('M13.4 17.2 H18.6 A0.7 0.7 0 0 1 18.6 18.6 H13.4 A0.7 0.7 0 0 1 13.4 17.2 Z', { fill: SILVER }, 'wm-a'),
    P('M13.4 17.2 H18.6 A0.7 0.7 0 0 1 18.6 18.6 H13.4 A0.7 0.7 0 0 1 13.4 17.2 Z', { fill: g1 }, 'wm-a'),
  ]
}
