// forge/hand/soft3d/refrigerator.mjs — a front-on two-door fridge (freezer on top, fridge below, two vertical handles, little feet)
// in a pale cool white with a darker edge, replacing the generated tilted 3/4 view with a side handle.
const N = 'refrigerator'
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const BODY = v('c1', '#E6EEF6'), HANDLE = v('c2', '#8C9AAD'), EDGE = v('c4', '#9FB0C4')
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const id = n => `wg-soft3d-${N}-${n}`
const stop = (o, c, op) => ['stop', op == null ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const S = (d, stroke, w, extra, cls) => P(d, { fill: 'none', stroke, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }, cls)

export default function render() {
  const defs = ['defs', {}, [
    ['radialGradient', { id: id(0), cx: 0.3, cy: 0.2, r: 1 }, [stop(0, SN, 0.6), stop(0.4, SN, 0.06), stop(0.72, SH, 0), stop(1, SH, 0.24)]],
    ['linearGradient', { id: id(1), x1: 0, y1: 0, x2: 1, y2: 0 }, [stop(0, SN, 0.45), stop(0.2, SN, 0.1), stop(0.6, SH, 0), stop(1, SH, 0.2)]],
  ]]
  const g0 = `url(#${id(0)})`, g1 = `url(#${id(1)})`
  const body = 'M7 2.2 H17 A2 2 0 0 1 19 4.2 V19.8 A2 2 0 0 1 17 21.8 H7 A2 2 0 0 1 5 19.8 V4.2 A2 2 0 0 1 7 2.2 Z'
  return [
    defs,
    P('M4 22.9 A8 1.2 0 1 0 20 22.9 A8 1.2 0 1 0 4 22.9 Z', { fill: SH, 'fill-opacity': 0.07 }, 'wm-shadow'),
    P('M5.6 22.9 A6.4 0.95 0 1 0 18.4 22.9 A6.4 0.95 0 1 0 5.6 22.9 Z', { fill: SH, 'fill-opacity': 0.1 }, 'wm-shadow'),
    // feet
    P('M6.6 21.5 H9 V22.6 H7.2 A0.6 0.6 0 0 1 6.6 22 Z M15 21.5 H17.4 V22 A0.6 0.6 0 0 1 16.8 22.6 H15 Z', { fill: HANDLE }, 'wm-k'),
    // body
    P(body, { fill: BODY }, 'wm-k'),
    P(body, { fill: g1 }, 'wm-k'),
    P(body, { fill: g0 }, 'wm-k'),
    P(body, { fill: 'none', stroke: EDGE, 'stroke-width': 0.9, 'stroke-linejoin': 'round' }, 'wm-k'),
    // door split: dark seam with a lit lip beneath it
    S('M5.4 9.6 H18.6', SH, 0.9, { 'stroke-opacity': 0.32 }, 'wm-k'),
    S('M5.6 10.4 H18.4', SN, 0.5, { 'stroke-opacity': 0.85 }, 'wm-shine'),
    // handles
    S('M8.6 5 V7.2', HANDLE, 1.7, {}, 'wm-a'),
    S('M8.6 12.6 V16.8', HANDLE, 1.7, {}, 'wm-a'),
    S('M8.1 5.1 V7', SN, 0.4, { 'stroke-opacity': 0.7 }, 'wm-shine'),
    S('M8.1 12.7 V16.6', SN, 0.4, { 'stroke-opacity': 0.7 }, 'wm-shine'),
    // lit left edge
    S('M6.2 4.6 V8.6', SN, 0.6, { 'stroke-opacity': 0.9 }, 'wm-shine'),
  ]
}
