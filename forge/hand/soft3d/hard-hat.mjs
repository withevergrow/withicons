// forge/hand/soft3d/hard-hat.mjs — an upright safety helmet seen from the front: a bright yellow dome with a raised
// ridge down the crown, on a wide flat orange brim band. The generated drawing was a dark tilted lump; here the dome
// is light material shaped by one round light, the ridge is a clear raised rib and the brim a separate firm base.
// Same studio recipe as the other soft3d objects: contact shadow, shaded wall to the lower right, lit rim upper left.
// Roles: dome + ridge c1, brim c2. Motion: dome wm-k (rocks), brim wm-a, shadow wm-shadow, speculars wm-shine.
const N = 'hard-hat'
const f = n => +(+n).toFixed(2)
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = { c1: v('c1', '#FFC20E'), c2: v('c2', '#F28A12'), shine: v('shine', '#FFF8DC'), shadow: v('shadow', '#1D2130') }
const id = n => `wg-soft3d-${N}-${n}`, url = n => `url(#${id(n)})`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const ell = (x, y, rx, ry) => `M${f(x - rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 1 0 ${f(x + rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 1 0 ${f(x - rx)} ${f(y)}Z`
const mv = (d, dx, dy) => d.replace(/([MLCQA])([^MLCQAZ]*)/g, (m, c, s) => c + s.trim().split(/[\s,]+/).filter(Boolean).map(Number)
  .map((x, i) => c === 'A' ? (i % 7 === 5 ? x + dx : i % 7 === 6 ? x + dy : x) : x + (i % 2 ? dy : dx)).map(f).join(' '))
const wall = (d, dx, dy, n = 4) => Array.from({ length: n }, (_, i) => mv(d, dx * (i + 1) / n, dy * (i + 1) / n)).join('')
const S = (d, stroke, w, extra, cls) => P(d, { fill: 'none', stroke, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }, cls)
// a raised piece: the wall in shade, then the lit face
const slab = (d, col, g, cls, dx = 0.8, dy = 0.65) => {
  const W = wall(d, dx, dy)
  return [P(W, { fill: col }, cls), P(W, { fill: C.shadow, 'fill-opacity': 0.3 }, cls), P(d, { fill: col }, cls), P(d, { fill: url(g) }, cls)]
}

const DOME = 'M4.4 15.6C4.4 9.7 7.6 5.5 12 5.5C16.4 5.5 19.6 9.7 19.6 15.6Z'
const RIDGE = 'M10.3 15.6L10.3 5.7A1.7 1.7 0 0 1 12 4A1.7 1.7 0 0 1 13.7 5.7L13.7 15.6Z'
const BRIM = 'M4.4 15.4L19.4 15.4A2 2 0 0 1 21.4 17.4A2 2 0 0 1 19.4 19.4L4.4 19.4A2 2 0 0 1 2.4 17.4A2 2 0 0 1 4.4 15.4Z'

export default function render() {
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 0, y1: 0, x2: 1, y2: 1 }, [stop(0, C.shine, 0.34), stop(0.42, C.shine, 0), stop(0.62, C.shadow, 0), stop(1, C.shadow, 0.2)]],
      ['radialGradient', { id: id(1), cx: 0.36, cy: 0.3, r: 0.78 }, [stop(0, C.shine, 0.7), stop(0.5, C.shine, 0), stop(0.8, C.shadow, 0.05), stop(1, C.shadow, 0.22)]],
    ]],
    P(ell(12.4, 21.3, 9.2, 1.4), { fill: C.shadow, 'fill-opacity': 0.06 }, 'wm-shadow'),
    P(ell(12.4, 21.3, 7.4, 1.1), { fill: C.shadow, 'fill-opacity': 0.08 }, 'wm-shadow'),
    P(ell(12.4, 21.3, 5.4, 0.8), { fill: C.shadow, 'fill-opacity': 0.11 }, 'wm-shadow'),
    // the dome and the ridge rib standing on it
    ...slab(DOME, C.c1, 1, 'wm-k'),
    ...slab(RIDGE, C.c1, 0, 'wm-k', 0.55, 0.45),
    P(RIDGE, { fill: C.shine, 'fill-opacity': 0.22 }, 'wm-k'),
    S('M10.3 6.2L10.3 15.2M13.7 6.2L13.7 15.2', C.shadow, 0.5, { 'stroke-opacity': 0.2 }, 'wm-k'),
    S('M11.1 5.2L11.1 13.6', C.shine, 0.6, { 'stroke-opacity': 0.85 }, 'wm-shine'),
    S('M6.1 13.3C6.3 10.4 7.7 8 9.6 6.9', C.shine, 0.75, { 'stroke-opacity': 0.9 }, 'wm-shine'),
    // the brim band, firm and flat, with the dome's shadow along its top edge
    ...slab(BRIM, C.c2, 0, 'wm-a'),
    P('M5.2 15.4L18.6 15.4L18.6 16.3L5.2 16.3Z', { fill: C.shadow, 'fill-opacity': 0.13 }, 'wm-a'),
    S('M4.6 18.6L13 18.6', C.shine, 0.5, { 'stroke-opacity': 0.5 }, 'wm-shine'),
  ]
}
