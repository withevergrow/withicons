// forge/hand/soft3d/kite.mjs — an upright diamond kite: red sail folded along the vertical spar (left half lit, right half
// in shade), gold frame, a gold vertical and horizontal cross spar and a small gold bow-tie tail below. Replaces the
// generated tilted kite with a green arc and a stick. Same studio recipe as the other hand-drawn soft3d icons.
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const N = 'kite'
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const S = (d, stroke, w, op, cls, extra) => P(d, { fill: 'none', stroke, 'stroke-width': w, 'stroke-opacity': op, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }, cls)

export default function render() {
  const SAIL = v('c1', '#E5483F'), GOLD = v('c2', '#E9B43A')
  const g = `url(#wg-soft3d-${N}-0)`
  const DIA = 'M12 2.6L19.4 10L12 17.4L4.6 10Z'
  const LEFT = 'M12 2.6V17.4L4.6 10Z', RIGHT = 'M12 2.6L19.4 10L12 17.4Z'
    return [
    ['defs', {}, [['linearGradient', { id: `wg-soft3d-${N}-0`, x1: 0, y1: 0, x2: 1, y2: 1 }, [stop(0, SN, 0.5), stop(0.4, SN, 0.05), stop(0.65, SH, 0), stop(1, SH, 0.3)]]]],
    ['ellipse', { cx: 12, cy: 22, rx: 7, ry: 0.9, fill: SH, 'fill-opacity': 0.06, class: 'wm-shadow' }],
    ['ellipse', { cx: 12, cy: 22, rx: 5, ry: 0.65, fill: SH, 'fill-opacity': 0.08, class: 'wm-shadow' }],
    // the tail: a string and a small bow-tie of two triangles, hanging from the sail's lower tip
    S('M12 17.4C12.6 18.2 12.6 18.9 12 19.7', GOLD, 0.7, 1, 'wm-s'),
    P('M12 20.6L8.6 18.9V22.3Z', { fill: SH, 'fill-opacity': 0.3 }, 'wm-s'),
    P('M12 20.6L15.4 18.9V22.3Z', { fill: SH, 'fill-opacity': 0.3 }, 'wm-s'),
    P('M12 20.1L8.6 18.4V21.8Z', { fill: GOLD, stroke: GOLD, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }, 'wm-s'),
    P('M12 20.1L15.4 18.4V21.8Z', { fill: GOLD, stroke: GOLD, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }, 'wm-s'),
    P('M12 20.1L15.4 18.4V21.8Z', { fill: SH, 'fill-opacity': 0.18 }, 'wm-s'),
    ['circle', { cx: 12, cy: 20.1, r: 0.75, fill: GOLD, class: 'wm-s' }],
    S('M9.2 19.2L10.9 19.9', SN, 0.5, 0.7, 'wm-shine'),
    // the sail: depth underside, red facets, shaded right half
    P('M12 3.4L19.4 10.8L12 18.2L4.6 10.8Z', { fill: SH, 'fill-opacity': 0.22, stroke: SH, 'stroke-opacity': 0.22, 'stroke-width': 1, 'stroke-linejoin': 'round' }, 'wm-k'),
    P(DIA, { fill: SAIL, stroke: GOLD, 'stroke-width': 1, 'stroke-linejoin': 'round' }, 'wm-k'),
    P(RIGHT, { fill: SH, 'fill-opacity': 0.2 }, 'wm-k'),
    P(DIA, { fill: g }, 'wm-k'),
    S('M12 3.4V16.6M5.8 10H18.2', GOLD, 0.9, 1, 'wm-k'),
    S('M12 3.4V16.6', SN, 0.3, 0.45, 'wm-shine'),
    S('M5.6 9.4L11 3.9', SN, 0.6, 0.75, 'wm-shine'),
  ]
}
