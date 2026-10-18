// forge/hand/soft3d/soup.mjs — a glossy red half-round bowl seen a little from above (lit lip, golden broth with a few
// noodle curls and green flecks, a small foot ring) under three soft steam wisps, the same subject as the line drawing.
// The generated extruded wedge with a flat top face read as a block or tray, not soup. Same studio recipe as the
// hand-drawn coffee and cup-soda.
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const BOWL = v('c1', '#E5483F'), BROTH = v('c2', '#F2A93B'), CREAM = v('c3', '#F3E7D3'), STEAM = v('c4', '#C3CAD4'), LEAF = v('accent', '#4FB463')
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const id = n => `wg-soft3d-soup-${n}`
const stop = (o, c, op) => ['stop', op == null ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const S = (d, stroke, w, extra, cls) => P(d, { fill: 'none', stroke, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }, cls)
const dot = (cx, cy, r) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0z`

export default function render() {
  const defs = ['defs', {}, [
    // the bowl's roundness: lit on the left, turning into shadow on the right and underneath
    ['linearGradient', { id: id(0), x1: 0, y1: 0, x2: 1, y2: 0.7 }, [stop(0, SN, 0.45), stop(0.25, SN, 0.08), stop(0.5, SH, 0), stop(1, SH, 0.34)]],
    // the broth and the lip: light from the upper left
    ['radialGradient', { id: id(1), cx: 0.3, cy: 0.25, r: 0.95 }, [stop(0, SN, 0.5), stop(0.4, SN, 0.05), stop(0.75, SH, 0), stop(1, SH, 0.22)]],
  ]]
  const g0 = `url(#${id(0)})`, g1 = `url(#${id(1)})`
  // bowl: x 3..21, rim ellipse centred (12, 10.2) rx 9 ry 2.7, a deep round belly down to y 20.25
  const body = 'M3 10.2 C3 16.4 7 20.25 12 20.25 C17 20.25 21 16.4 21 10.2 Z'
  const rim = 'M3 10.2 A9 2.7 0 1 0 21 10.2 A9 2.7 0 1 0 3 10.2 Z'
  const mouth = 'M4.1 10.2 A7.9 2.15 0 1 0 19.9 10.2 A7.9 2.15 0 1 0 4.1 10.2 Z'
  const broth = 'M4.6 10.35 A7.4 1.85 0 1 0 19.4 10.35 A7.4 1.85 0 1 0 4.6 10.35 Z'
  return [
    defs,
    // contact shadow
    P('M4.2 21.7 A7.8 1.4 0 1 0 19.8 21.7 A7.8 1.4 0 1 0 4.2 21.7 Z', { fill: SH, 'fill-opacity': 0.06 }, 'wm-shadow'),
    P('M5.6 21.7 A6.4 1.1 0 1 0 18.4 21.7 A6.4 1.1 0 1 0 5.6 21.7 Z', { fill: SH, 'fill-opacity': 0.08 }, 'wm-shadow'),
    P('M7.3 21.7 A4.7 0.8 0 1 0 16.7 21.7 A4.7 0.8 0 1 0 7.3 21.7 Z', { fill: SH, 'fill-opacity': 0.11 }, 'wm-shadow'),
    // the foot ring
    P('M8.4 19.4 H15.6 L15.1 21.5 C13.8 21.9 10.2 21.9 8.9 21.5 Z', { fill: BOWL }, 'wm-k'),
    P('M8.4 19.4 H15.6 L15.1 21.5 C13.8 21.9 10.2 21.9 8.9 21.5 Z', { fill: SH, 'fill-opacity': 0.3 }, 'wm-k'),
    // the bowl
    P(body, { fill: BOWL }, 'wm-k'),
    P(body, { fill: g0 }, 'wm-k'),
    // a lit streak down the left of the belly, a dark heel on the lower right
    S('M4.2 12.4 C4.7 15.6 6.6 18 9 19', SN, 0.7, { 'stroke-opacity': 0.55 }, 'wm-shine'),
    S('M19.6 12.4 C19 16 16.6 19.3 13 19.8', SH, 0.6, { 'stroke-opacity': 0.28 }, 'wm-k'),
    // a cream band round the belly: the glaze line
    S('M3.6 13.1 C6.5 14.7 17.5 14.7 20.4 13.1', CREAM, 0.7, { 'stroke-opacity': 0.9 }, 'wm-k'),
    // the lip, the dark inner wall, the broth
    P(rim, { fill: BOWL }, 'wm-k'),
    P(rim, { fill: g1 }, 'wm-k'),
    P(mouth, { fill: SH, 'fill-opacity': 0.38 }, 'wm-k'),
    P(broth, { fill: BROTH }, 'wm-k'),
    P(broth, { fill: g1 }, 'wm-k'),
    // noodle curls, green flecks, a lit gloss
    S('M7.6 10.5 C8.8 9.5 10 11.2 11.3 10.2', CREAM, 0.55, { 'stroke-opacity': 0.95 }, 'wm-k'),
    S('M12.6 10.9 C13.8 9.9 15.1 11.4 16.3 10.4', CREAM, 0.55, { 'stroke-opacity': 0.95 }, 'wm-k'),
    P(dot(14.2, 9.5, 0.45), { fill: LEAF }, 'wm-k'),
    P(dot(9.2, 11.4, 0.4), { fill: LEAF }, 'wm-k'),
    S('M6 9.6 C6.9 9 8.2 8.8 9.6 8.85', SN, 0.5, { 'stroke-opacity': 0.8 }, 'wm-shine'),
    S('M4.9 9.6 C5.8 8.1 8 7.6 10 7.6', SN, 0.5, { 'stroke-opacity': 0.75 }, 'wm-shine'),
    // steam: three soft wisps rising from the broth
    S('M8 7 C6.8 6 9.2 5 8 3.5', STEAM, 1.3, {}, 'wm-a'),
    S('M12 6.6 C10.8 5.6 13.2 4.6 12 3.1', STEAM, 1.3, {}, 'wm-a'),
    S('M16 7 C14.8 6 17.2 5 16 3.5', STEAM, 1.3, {}, 'wm-a'),
  ]
}
