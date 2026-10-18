// forge/hand/soft3d/circle-play.mjs — a glossy teal sphere carrying a crisp, clearly pointed white play triangle
// (soft rounded corners, a small drop shadow under it), replacing the generated red blob that did not read as a triangle.
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C1 = v('c1', '#25A99B'), SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const id = n => `wg-soft3d-circle-play-${n}`
const stop = (o, c, op) => ['stop', op == null ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const S = (d, stroke, w, extra, cls) => P(d, { fill: 'none', stroke, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }, cls)

export default function render() {
  const defs = ['defs', {}, [
    ['radialGradient', { id: id(0), cx: 0.3, cy: 0.22, r: 1 }, [stop(0, SN, 0.5), stop(0.3, SN, 0.12), stop(0.6, SH, 0), stop(1, SH, 0.34)]],
    ['linearGradient', { id: id(1), x1: 0, y1: 0, x2: 0, y2: 1 }, [stop(0, SN, 1), stop(1, SN, 0.82)]],
  ]]
  const disc = 'M21.4 11.6 A9.4 9.4 0 1 1 2.6 11.6 A9.4 9.4 0 1 1 21.4 11.6 Z'
  const tri = 'M10.3 8.7 L15.9 11.6 L10.3 14.5 Z'
  return [
    defs,
    P('M4.6 21.2 A7.6 1.5 0 1 0 19.8 21.2 A7.6 1.5 0 1 0 4.6 21.2 Z', { fill: SH, 'fill-opacity': 0.06 }, 'wm-shadow'),
    P('M6.2 21.2 A6 1.2 0 1 0 18.2 21.2 A6 1.2 0 1 0 6.2 21.2 Z', { fill: SH, 'fill-opacity': 0.08 }, 'wm-shadow'),
    P('M7.8 21.2 A4.4 0.9 0 1 0 16.6 21.2 A4.4 0.9 0 1 0 7.8 21.2 Z', { fill: SH, 'fill-opacity': 0.11 }, 'wm-shadow'),
    P(disc, { fill: C1 }, 'wm-k'),
    P(disc, { fill: `url(#${id(0)})` }, 'wm-k'),
    S('M18.9 16.3 A8.4 8.4 0 0 1 8.6 19.4', SH, 0.6, { 'stroke-opacity': 0.25 }, 'wm-k'),
    S('M4.9 9.6 C5.6 6.8 8 4.7 10.8 4.2', SN, 0.7, { 'stroke-opacity': 0.8 }, 'wm-shine'),
    // the triangle: drop shadow, then a rounded white face
    P('M10.5 9.4 L16.1 12.3 L10.5 15.2 Z', { fill: SH, 'fill-opacity': 0.28, stroke: SH, 'stroke-opacity': 0.28, 'stroke-width': 1.7, 'stroke-linejoin': 'round' }, 'wm-a'),
    P(tri, { fill: `url(#${id(1)})`, stroke: SN, 'stroke-width': 1.7, 'stroke-linejoin': 'round' }, 'wm-a'),
  ]
}
