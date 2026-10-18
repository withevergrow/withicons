// forge/hand/soft3d/flask-conical.mjs — an upright conical flask: clear glass tinted blue-grey with a visible teal liquid fill,
// a rounded lip, bubbles and a lit left edge; front-on like the line design, replacing the tilted white-on-white generated blob.
const N = 'flask-conical'
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const GLASS = v('c1', '#DCEBF7'), LIQ = v('c2', '#25A99B'), EDGE = v('c4', '#7FA3C2')
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const id = n => `wg-soft3d-${N}-${n}`
const stop = (o, c, op) => ['stop', op == null ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const S = (d, stroke, w, extra, cls) => P(d, { fill: 'none', stroke, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }, cls)

export default function render() {
  const defs = ['defs', {}, [
    ['radialGradient', { id: id(0), cx: 0.3, cy: 0.22, r: 0.95 }, [stop(0, SN, 0.6), stop(0.4, SN, 0.06), stop(0.72, SH, 0), stop(1, SH, 0.26)]],
    ['linearGradient', { id: id(1), x1: 0, y1: 0, x2: 1, y2: 0 }, [stop(0, SN, 0.4), stop(0.25, SN, 0.08), stop(0.6, SH, 0), stop(1, SH, 0.22)]],
  ]]
  const g0 = `url(#${id(0)})`, g1 = `url(#${id(1)})`
  const body = 'M9.5 3.4 H14.5 V9 L19.75 18.25 A1.75 1.75 0 0 1 18.25 21 H5.75 A1.75 1.75 0 0 1 4.25 18.25 L9.5 9 Z'
  const liquid = 'M6.38 14.5 C8.6 13.7 10.4 15.3 12 14.6 C13.6 13.9 15.4 15.3 17.62 14.5 L19.75 18.25 A1.75 1.75 0 0 1 18.25 21 H5.75 A1.75 1.75 0 0 1 4.25 18.25 Z'
  const lip = 'M8.2 2.2 H15.8 A0.9 0.9 0 0 1 16.7 3.1 V3.4 A0.9 0.9 0 0 1 15.8 4.3 H8.2 A0.9 0.9 0 0 1 7.3 3.4 V3.1 A0.9 0.9 0 0 1 8.2 2.2 Z'
  return [
    defs,
    P('M4.2 21.6 A7.8 1.5 0 1 0 19.8 21.6 A7.8 1.5 0 1 0 4.2 21.6 Z', { fill: SH, 'fill-opacity': 0.06 }, 'wm-shadow'),
    P('M5.6 21.6 A6.4 1.2 0 1 0 18.4 21.6 A6.4 1.2 0 1 0 5.6 21.6 Z', { fill: SH, 'fill-opacity': 0.08 }, 'wm-shadow'),
    P('M7.4 21.6 A4.6 0.88 0 1 0 16.6 21.6 A4.6 0.88 0 1 0 7.4 21.6 Z', { fill: SH, 'fill-opacity': 0.11 }, 'wm-shadow'),
    // glass
    P(body, { fill: GLASS }, 'wm-k'),
    P(body, { fill: g1 }, 'wm-k'),
    // liquid
    P(liquid, { fill: LIQ }, 'wm-a'),
    P(liquid, { fill: g0 }, 'wm-a'),
    S('M6.9 14.4 C8.9 13.7 10.4 15.1 12 14.5 C13.6 13.9 15.3 15.2 17.1 14.4', SN, 0.55, { 'stroke-opacity': 0.7 }, 'wm-shine'),
    ['circle', { cx: 9.4, cy: 18.2, r: 0.8, fill: SN, 'fill-opacity': 0.7, class: 'wm-deco' }],
    ['circle', { cx: 13.6, cy: 17.3, r: 0.55, fill: SN, 'fill-opacity': 0.65, class: 'wm-deco' }],
    ['circle', { cx: 15.2, cy: 19.1, r: 0.9, fill: SN, 'fill-opacity': 0.55, class: 'wm-deco' }],
    // glass outline and lit edge
    P(body, { fill: 'none', stroke: EDGE, 'stroke-width': 0.9, 'stroke-linejoin': 'round' }, 'wm-k'),
    S('M10.6 4.6 V9.2 L6.2 17.2', SN, 0.6, { 'stroke-opacity': 0.85 }, 'wm-shine'),
    // lip
    P(lip, { fill: GLASS }, 'wm-k'),
    P(lip, { fill: g0 }, 'wm-k'),
    P(lip, { fill: 'none', stroke: EDGE, 'stroke-width': 0.9, 'stroke-linejoin': 'round' }, 'wm-k'),
  ]
}
