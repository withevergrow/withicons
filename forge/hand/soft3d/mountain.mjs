// forge/hand/soft3d/mountain.mjs — two clearly separate rounded peaks (a tall one on the left in front of a shorter one on
// the right), each with a lit left face, a shaded right face and a snow cap, replacing the generated angular slab.
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const ROCK = v('c1', '#8F99A8'), SNOW = v('c2', '#EEF1F5')
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const S = (d, stroke, w, extra, cls) => P(d, { fill: 'none', stroke, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }, cls)
// a filled shape whose corners are rounded by a same-colour stroke
const R = (d, fill, w, extra, cls) => P(d, { fill, stroke: fill, 'stroke-width': w, 'stroke-linejoin': 'round', ...extra }, cls)

export default function render() {
  const back = 'M12 19.4 L17 9.4 L21.2 19.4 Z'
  const front = 'M3.2 19.4 L9.3 5.8 L15.4 19.4 Z'
  const frontLit = 'M9.3 5.8 L3.2 19.4 L9.6 19.4 Z'
  const frontDark = 'M9.3 5.8 L9.6 19.4 L15.4 19.4 Z'
  const backDark = 'M17 9.4 L17.4 19.4 L21.2 19.4 Z'
  return [
    P('M2.6 20.6 A9.4 1.6 0 1 0 21.4 20.6 A9.4 1.6 0 1 0 2.6 20.6 Z', { fill: SH, 'fill-opacity': 0.06 }, 'wm-shadow'),
    P('M4.2 20.6 A7.8 1.25 0 1 0 19.8 20.6 A7.8 1.25 0 1 0 4.2 20.6 Z', { fill: SH, 'fill-opacity': 0.08 }, 'wm-shadow'),
    P('M5.8 20.6 A6.2 0.9 0 1 0 18.2 20.6 A6.2 0.9 0 1 0 5.8 20.6 Z', { fill: SH, 'fill-opacity': 0.11 }, 'wm-shadow'),
    // the back peak, a little paler to sit further away
    R(back, ROCK, 1.6, {}, 'wm-k'),
    R(back, SN, 1.6, { 'fill-opacity': 0.2, 'stroke-opacity': 0.2 }, 'wm-k'),
    R(backDark, SH, 1.6, { 'fill-opacity': 0.22, 'stroke-opacity': 0.22 }, 'wm-k'),
    R('M17 9.4 L15.2 13.2 L16.4 12.6 L17.2 13.8 L18.2 12.4 L19 12.8 Z', SNOW, 0.9, {}, 'wm-k'),
    // the front peak
    R(front, ROCK, 1.6, {}, 'wm-k'),
    R(frontLit, SN, 1.6, { 'fill-opacity': 0.24, 'stroke-opacity': 0.24 }, 'wm-k'),
    R(frontDark, SH, 1.6, { 'fill-opacity': 0.3, 'stroke-opacity': 0.3 }, 'wm-k'),
    // snow cap with a ragged lower edge
    R('M9.3 5.8 L6.5 12 L7.9 11.2 L8.9 12.8 L10 11.4 L11.2 12.6 L12 11.2 Z', SNOW, 1.1, {}, 'wm-k'),
    P('M9.35 6.9 L11 10.6 L12 11.2 L9.7 6.4 Z', { fill: SH, 'fill-opacity': 0.12 }, 'wm-k'),
    // lit ridge down the left slope, soft base shade
    S('M8.7 7.6 L4.6 17.2', SN, 0.6, { 'stroke-opacity': 0.55 }, 'wm-shine'),
    S('M3.8 19.5 H20.6', SH, 0.7, { 'stroke-opacity': 0.2 }, 'wm-k'),
  ]
}
