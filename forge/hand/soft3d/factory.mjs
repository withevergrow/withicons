// forge/hand/soft3d/factory.mjs — the factory as one soft slab in strong brick orange (a thin shaded lower wall under a
// lit face): two dark slate sawtooth roof bands following the teeth, a tall chimney with a slate cap lip and two raised
// glowing windows. The generated drawing was a pale cream blob that lost the teeth and the chimney. Drawn by hand in the
// house soft3d front-slab recipe (curvature gradient, lit upper-left rim, shaded lower wall, contact shadow).
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const BRICK = v('c1', '#D8643B'), SLATE = v('c2', '#4A5568'), GLOW = v('c4', '#FFD76B')
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const id = n => `wg-soft3d-factory-${n}`
const stop = (o, c, op) => ['stop', op == null ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const S = (d, stroke, w, extra, cls) => P(d, { fill: 'none', stroke, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }, cls)
const J = (d, fill, w, extra, cls) => P(d, { fill, stroke: fill, 'stroke-width': w, 'stroke-linejoin': 'round', ...extra }, cls)

export default function render() {
  const defs = ['defs', {}, [
    // the slab's soft curvature: lit from the upper left, shade toward the lower right
    ['radialGradient', { id: id(0), cx: 0.34, cy: 0.26, r: 0.92 }, [stop(0, SN, 0.5), stop(0.38, SN, 0.05), stop(0.7, SH, 0), stop(1, SH, 0.26)]],
    // a window's glow: bright at the top left
    ['radialGradient', { id: id(1), cx: 0.35, cy: 0.3, r: 0.9 }, [stop(0, SN, 0.7), stop(0.5, SN, 0), stop(1, SH, 0.18)]],
  ]]
  const g0 = `url(#${id(0)})`, g1 = `url(#${id(1)})`
  const face = 'M4.5 20 A1.5 1.5 0 0 1 3 18.5 V11.3 L8 8.4 V11.3 L13 8.4 V11.3 H16.5 V4.3 A1 1 0 0 1 17.5 3.3 H19.5 A1 1 0 0 1 20.5 4.3 V18.5 A1.5 1.5 0 0 1 19 20 Z'
  const wall = 'M4.5 20.9 A1.5 1.5 0 0 1 3 19.4 V12.2 L8 9.3 V12.2 L13 9.3 V12.2 H16.5 V5.2 A1 1 0 0 1 17.5 4.2 H19.5 A1 1 0 0 1 20.5 5.2 V19.4 A1.5 1.5 0 0 1 19 20.9 Z'
  const t1 = 'M3.4 11.55 L7.7 9.05 V10.9 L3.4 13.4 Z', t2 = 'M8.4 11.55 L12.7 9.05 V10.9 L8.4 13.4 Z'
  const cap = 'M16.3 3.5 H20.7 V5.3 H16.3 Z'
  const w1 = 'M5.6 14.6 H8.6 V17.6 H5.6 Z', w2 = 'M10.4 14.6 H13.4 V17.6 H10.4 Z'
  return [
    defs,
    // contact shadow
    P('M3.6 21.6 A8.6 1.4 0 1 0 20.8 21.6 A8.6 1.4 0 1 0 3.6 21.6 Z', { fill: SH, 'fill-opacity': 0.06 }, 'wm-shadow'),
    P('M5.2 21.6 A7 1.1 0 1 0 19.2 21.6 A7 1.1 0 1 0 5.2 21.6 Z', { fill: SH, 'fill-opacity': 0.08 }, 'wm-shadow'),
    P('M7.2 21.6 A5 0.8 0 1 0 17.2 21.6 A5 0.8 0 1 0 7.2 21.6 Z', { fill: SH, 'fill-opacity': 0.11 }, 'wm-shadow'),
    // the lower wall: the face copied a little lower, in shade
    J(wall, BRICK, 0.7, {}, 'wm-k'),
    J(wall, SH, 0.7, { 'fill-opacity': 0.34, 'stroke-opacity': 0.34 }, 'wm-k'),
    // the face
    J(face, BRICK, 0.7, {}, 'wm-k'),
    P(face, { fill: g0 }, 'wm-k'),
    // the sawtooth roof bands and the chimney's cap lip, each with a lit top edge and a dark underside
    J(t1, SLATE, 0.6, {}, 'wm-k'), J(t2, SLATE, 0.6, {}, 'wm-k'), J(cap, SLATE, 0.6, {}, 'wm-k'),
    P(t1 + t2 + cap, { fill: g0 }, 'wm-k'),
    S('M3.75 11.75 L7.7 9.45 M8.75 11.75 L12.7 9.45 M16.6 3.75 H20.4', SN, 0.45, { 'stroke-opacity': 0.55 }, 'wm-shine'),
    S('M3.6 13.45 L7.6 11.15 M8.6 13.45 L12.6 11.15 M16.6 5.4 H20.4', SH, 0.4, { 'stroke-opacity': 0.4 }, 'wm-k'),
    // the lit rim down the left and along the teeth, a dark heel along the right and the bottom
    S('M3.4 18.2 V11.7 L8 9.05', SN, 0.5, { 'stroke-opacity': 0.5 }, 'wm-shine'),
    S('M8.4 9.1 V11 M13.4 9.1 V11', SH, 0.4, { 'stroke-opacity': 0.25 }, 'wm-k'),
    S('M20.1 4.8 V18.3 C20.1 19.1 19.7 19.6 19 19.6 H5', SH, 0.5, { 'stroke-opacity': 0.3 }, 'wm-k'),
    // two raised glowing windows: a dark frame offset down, the pane, a spark
    P('M5.4 14.9 H8.8 V17.9 H5.4 Z M10.2 14.9 H13.6 V17.9 H10.2 Z', { fill: SH, 'fill-opacity': 0.4 }, 'wm-a'),
    J(w1, GLOW, 0.7, {}, 'wm-a'), J(w2, GLOW, 0.7, {}, 'wm-a'),
    P(w1 + w2, { fill: g1 }, 'wm-a'),
    S('M5.9 15.1 H7.2 M10.7 15.1 H12', SN, 0.4, { 'stroke-opacity': 0.9 }, 'wm-shine'),
  ]
}
