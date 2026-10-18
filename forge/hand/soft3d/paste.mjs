// forge/hand/soft3d/paste.mjs: a wooden clipboard with a white sheet and a silver clip, and a blue page landing on it
// from the lower right through the board's notch (the paste).
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const N = 'paste'

export default function render() {
  const WOOD = v('c1', '#B8763E'), PAPER = v('c2', '#EEF1F5'), CLIP = v('c3', '#AEB6C2'), DOC = v('c4', '#5B8FE8'), INK = v('ink', '#2A3140')
  const g = `url(#wg-soft3d-${N}-0)`
  const ln = (d, stroke, w, op, cls) => ['path', { d, stroke, 'stroke-width': w, 'stroke-opacity': op, 'stroke-linecap': 'round', fill: 'none', class: cls }]
  const BOARD = 'M6 4h10a2.5 2.5 0 0 1 2.5 2.5V10h-5a2.5 2.5 0 0 0-2.5 2.5V21H6a2.5 2.5 0 0 1-2.5-2.5v-12A2.5 2.5 0 0 1 6 4z'
  const CLIPD = 'M9.5 2.4h3a1 1 0 0 1 1 1V4h1a.8.8 0 0 1 .8.8v1.4a.8.8 0 0 1-.8.8H7.5a.8.8 0 0 1-.8-.8V4.8a.8.8 0 0 1 .8-.8h1v-.6a1 1 0 0 1 1-1z'
  const PAGE = 'M13.8 11.2h5.4l2.6 2.6v6.4a1.6 1.6 0 0 1-1.6 1.6h-6.4a1.6 1.6 0 0 1-1.6-1.6v-7.4a1.6 1.6 0 0 1 1.6-1.6z'
  return [
    ['defs', {}, [['radialGradient', { id: `wg-soft3d-${N}-0`, cx: 0.32, cy: 0.22, r: 0.95 }, [stop(0, SN, 0.55), stop(0.4, SN, 0.05), stop(0.7, SH, 0), stop(1, SH, 0.28)]]]],
    ['ellipse', { cx: 12.5, cy: 22, rx: 9, ry: 1.1, fill: SH, 'fill-opacity': 0.13, class: 'wm-shadow' }],
    ['path', { d: BOARD, fill: WOOD, class: 'wm-k' }],
    ['path', { d: BOARD, fill: g, class: 'wm-k' }],
    ['path', { d: 'M5.5 6.5h11V10h-3a2.5 2.5 0 0 0-2.5 2.5V19H5.5z', fill: PAPER, class: 'wm-k' }],
    ln('M7.2 9.8h3.6M7.2 12.4h2.6M7.2 15h2.6', INK, 0.7, 0.35, 'wm-deco'),
    ['path', { d: CLIPD, fill: CLIP, class: 'wm-k' }],
    ['path', { d: CLIPD, fill: g, class: 'wm-k' }],
    ln('M4.6 5.6c-.3.3-.4.7-.4 1.2v4', SN, 0.6, 0.5, 'wm-shine'),
    ['path', { d: 'M13.2 12.3h6l2.6 2.6v6.6H11.7v-7.6z', fill: SH, 'fill-opacity': 0.16, class: 'wm-shadow' }],
    ['path', { d: PAGE, fill: DOC, class: 'wm-a' }],
    ['path', { d: PAGE, fill: g, class: 'wm-a' }],
    ['path', { d: 'M19.2 11.2v1.6a1 1 0 0 0 1 1h1.6z', fill: SN, 'fill-opacity': 0.6, class: 'wm-a' }],
    ln('M14.4 15.6h4.6M14.4 18h3.4', SN, 0.8, 0.85, 'wm-a'),
  ]
}
