// forge/hand/soft3d/key.mjs — a slim golden key on the diagonal: a round bow with a clearly open hole, a long shaft and
// two distinct teeth, replacing the stubby generated cylinder-and-slab that read as another object.
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const GOLD = v('c1', '#E9B43A'), SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const id = n => `wg-soft3d-key-${n}`
const stop = (o, c, op) => ['stop', op == null ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const S = (d, stroke, w, extra, cls) => P(d, { fill: 'none', stroke, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }, cls)

export default function render() {
  const defs = ['defs', {}, [
    ['linearGradient', { id: id(0), x1: 0, y1: 0, x2: 1, y2: 1 }, [stop(0, SN, 0.5), stop(0.35, SN, 0.05), stop(0.65, SH, 0), stop(1, SH, 0.3)]],
  ]]
  const g = `url(#${id(0)})`
  // bow: ring centre (8, 16), outer r 5, hole r 2.1 (even-odd)
  const ring = 'M13 16 A5 5 0 1 1 3 16 A5 5 0 1 1 13 16 Z M10.1 16 A2.1 2.1 0 1 0 5.9 16 A2.1 2.1 0 1 0 10.1 16 Z'
  const shaft = 'M11.2 12.8 L20 4'
  const t1 = 'M17.6 6.4 L20.2 9'
  const t2 = 'M14.2 9.8 L16.8 12.4'
  return [
    defs,
    P('M3.2 21.4 A8.6 1.4 0 1 0 20.4 21.4 A8.6 1.4 0 1 0 3.2 21.4 Z', { fill: SH, 'fill-opacity': 0.06 }, 'wm-shadow'),
    P('M4.8 21.4 A7 1.1 0 1 0 18.8 21.4 A7 1.1 0 1 0 4.8 21.4 Z', { fill: SH, 'fill-opacity': 0.08 }, 'wm-shadow'),
    P('M6.4 21.4 A5.4 0.8 0 1 0 17.2 21.4 A5.4 0.8 0 1 0 6.4 21.4 Z', { fill: SH, 'fill-opacity': 0.11 }, 'wm-shadow'),
    // shaft and teeth: thick round bars with a darker underside
    S(shaft, GOLD, 2.6, {}, 'wm-k'),
    S(t1, GOLD, 2.4, {}, 'wm-k'),
    S(t2, GOLD, 2.4, {}, 'wm-k'),
    S('M11.9 13.9 L20.7 5.1', SH, 0.7, { 'stroke-opacity': 0.25 }, 'wm-k'),
    S('M18.1 7.5 L20.3 9.7', SH, 0.6, { 'stroke-opacity': 0.25 }, 'wm-k'),
    S('M14.7 10.9 L16.9 13.1', SH, 0.6, { 'stroke-opacity': 0.25 }, 'wm-k'),
    // the bow
    P(ring, { fill: GOLD, 'fill-rule': 'evenodd' }, 'wm-k'),
    P(ring, { fill: g, 'fill-rule': 'evenodd' }, 'wm-k'),
    // hole wall: dark upper-left rim, bright lower-right lip
    S('M5.9 16 A2.1 2.1 0 0 1 9.4 14.5', SH, 0.6, { 'stroke-opacity': 0.4 }, 'wm-k'),
    S('M6.6 17.6 A2.1 2.1 0 0 0 10 16.7', SN, 0.5, { 'stroke-opacity': 0.55 }, 'wm-shine'),
    S('M4.2 14.4 C4.9 12.8 6.2 11.9 7.8 11.6', SN, 0.7, { 'stroke-opacity': 0.8 }, 'wm-shine'),
    S('M11.7 11.4 L19.4 3.7', SN, 0.5, { 'stroke-opacity': 0.55 }, 'wm-shine'),
  ]
}
