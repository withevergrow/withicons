// forge/hand/soft3d/newspaper.mjs — a folded newspaper: a cream sheet with a rolled-over fold on the left, a blue headline
// block and two lines of text, replacing the generated blue blob in a speech-bubble outline that read as a chat icon.
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const PAPER = v('c1', '#F3E7D3'), HEAD = v('c2', '#3D7EE0'), INK = v('c3', '#3A404C')
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const id = n => `wg-soft3d-newspaper-${n}`
const stop = (o, c, op) => ['stop', op == null ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const S = (d, stroke, w, extra, cls) => P(d, { fill: 'none', stroke, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }, cls)

export default function render() {
  const defs = ['defs', {}, [
    ['linearGradient', { id: id(0), x1: 0, y1: 0, x2: 1, y2: 1 }, [stop(0, SN, 0.5), stop(0.4, SN, 0), stop(0.7, SH, 0), stop(1, SH, 0.16)]],
    ['linearGradient', { id: id(1), x1: 0, y1: 0, x2: 1, y2: 0 }, [stop(0, SH, 0.04), stop(0.25, SN, 0.45), stop(0.5, SH, 0), stop(1, SH, 0.3)]],
    ['linearGradient', { id: id(2), x1: 0, y1: 0, x2: 0, y2: 1 }, [stop(0, SN, 0.4), stop(1, SH, 0.2)]],
  ]]
  const g0 = `url(#${id(0)})`, g1 = `url(#${id(1)})`, g2 = `url(#${id(2)})`
  const sheet = 'M9 3.6 H19 A2.2 2.2 0 0 1 21.2 5.8 V17.8 A2.2 2.2 0 0 1 19 20 H5 A2.4 2.4 0 0 0 7.4 17.6 V5.2 A1.6 1.6 0 0 1 9 3.6 Z'
  const roll = 'M5.1 8.8 H7.6 V17.7 A2.3 2.3 0 0 1 5.3 20 A2.3 2.3 0 0 1 2.8 17.7 V11.1 A2.3 2.3 0 0 1 5.1 8.8 Z'
  const head = 'M11.4 7 H17.6 A1.2 1.2 0 0 1 18.8 8.2 V10.6 A1.2 1.2 0 0 1 17.6 11.8 H11.4 A1.2 1.2 0 0 1 10.2 10.6 V8.2 A1.2 1.2 0 0 1 11.4 7 Z'
  return [
    defs,
    P('M3 21.2 A9.2 1.4 0 1 0 21.4 21.2 A9.2 1.4 0 1 0 3 21.2 Z', { fill: SH, 'fill-opacity': 0.06 }, 'wm-shadow'),
    P('M4.6 21.2 A7.6 1.1 0 1 0 19.8 21.2 A7.6 1.1 0 1 0 4.6 21.2 Z', { fill: SH, 'fill-opacity': 0.08 }, 'wm-shadow'),
    P('M6.2 21.2 A6 0.8 0 1 0 18.2 21.2 A6 0.8 0 1 0 6.2 21.2 Z', { fill: SH, 'fill-opacity': 0.11 }, 'wm-shadow'),
    // the sheet with a darker page edge along its right and bottom
    P(sheet, { fill: PAPER }, 'wm-k'),
    P(sheet, { fill: g0 }, 'wm-k'),
    S('M21.2 6.5 V17.8 A2.2 2.2 0 0 1 19 20 H8.4', SH, 0.6, { 'stroke-opacity': 0.25 }, 'wm-k'),
    // the headline block: a blue plate with a lit top edge
    P(head, { fill: HEAD }, 'wm-a'),
    P(head, { fill: g2 }, 'wm-a'),
    S('M11.6 7.7 H17.4', SN, 0.5, { 'stroke-opacity': 0.55 }, 'wm-shine'),
    // text lines
    S('M10.6 14.6 H17.6', INK, 1.3, {}, 'wm-a'),
    S('M10.6 17.4 H15.4', INK, 1.3, { 'stroke-opacity': 0.8 }, 'wm-a'),
    // the rolled fold: a small cylinder standing out on the left
    P(roll, { fill: PAPER }, 'wm-k'),
    P(roll, { fill: g1 }, 'wm-k'),
    P('M5.1 8.8 H7.6 V11 H3.4 A2.3 2.3 0 0 1 5.1 8.8 Z', { fill: SH, 'fill-opacity': 0.1 }, 'wm-k'),
    S('M4.2 12.2 V17.2', SN, 0.6, { 'stroke-opacity': 0.75 }, 'wm-shine'),
    S('M7.55 11.2 V17.6', SH, 0.5, { 'stroke-opacity': 0.25 }, 'wm-k'),
  ]
}
