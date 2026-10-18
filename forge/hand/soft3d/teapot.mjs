// forge/hand/soft3d/teapot.mjs — an upright, front-facing teapot: a round teal body on a flat foot, a domed lid with a
// gold knob, a curved spout on the left and a chunky looped handle on the right, with a thin gold band round the belly,
// as in line. The generated teapot was a tilted blob that read as a bag; here it stands square with one round light.
// Same studio recipe as the other soft3d objects: contact shadow, shaded wall to the lower right, lit rim upper left.
// Roles: pot c1, lid c2, knob + band c3. Motion: pot wm-k, knob wm-s, shadow wm-shadow, speculars wm-shine.
const N = 'teapot'
const f = n => +(+n).toFixed(2)
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = { c1: v('c1', '#25A99B'), c2: v('c2', '#3CC0B0'), c3: v('c3', '#F2B93B'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#1D2130') }
const id = n => `wg-soft3d-${N}-${n}`, url = n => `url(#${id(n)})`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const ell = (x, y, rx, ry) => `M${f(x - rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 1 0 ${f(x + rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 1 0 ${f(x - rx)} ${f(y)}Z`
const mv = (d, dx, dy) => d.replace(/([MLCQA])([^MLCQAZ]*)/g, (m, c, s) => c + s.trim().split(/[\s,]+/).filter(Boolean).map(Number)
  .map((x, i) => c === 'A' ? (i % 7 === 5 ? x + dx : i % 7 === 6 ? x + dy : x) : x + (i % 2 ? dy : dx)).map(f).join(' '))
const wall = (d, dx, dy, n = 4) => Array.from({ length: n }, (_, i) => mv(d, dx * (i + 1) / n, dy * (i + 1) / n)).join('')
const S = (d, stroke, w, extra, cls) => P(d, { fill: 'none', stroke, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }, cls)
const slab = (d, col, g, cls, dx = 0.7, dy = 0.55) => {
  const W = wall(d, dx, dy)
  return [P(W, { fill: col }, cls), P(W, { fill: C.shadow, 'fill-opacity': 0.3 }, cls), P(d, { fill: col }, cls), P(d, { fill: url(g) }, cls)]
}

const BODY = 'M7 20.4L17 20.4C18.5 19 19 17.2 19 14.7C19 11.2 16 8.9 12 8.9C8 8.9 5 11.2 5 14.7C5 17.2 5.5 19 7 20.4Z'
const LID = 'M8.3 9.3C8.6 7.6 10 6.7 12 6.7C14 6.7 15.4 7.6 15.7 9.3Z'
const SPOUT = 'M5.6 17.3C3.8 16.5 2.8 14.2 2.5 10.9L2.2 9.9L4.5 9.6C4.7 11.5 5.5 12.9 6.8 13.8Z'
const HANDLE = 'M18.4 11.2C21.1 10.7 22 12.6 21.8 14.4C21.6 16.4 20.4 17.6 18.9 17.6'

export default function render() {
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 0, y1: 0, x2: 1, y2: 1 }, [stop(0, C.shine, 0.34), stop(0.42, C.shine, 0), stop(0.62, C.shadow, 0), stop(1, C.shadow, 0.2)]],
      ['radialGradient', { id: id(1), cx: 0.36, cy: 0.3, r: 0.78 }, [stop(0, C.shine, 0.62), stop(0.5, C.shine, 0), stop(0.8, C.shadow, 0.05), stop(1, C.shadow, 0.24)]],
    ]],
    P(ell(12.3, 21.4, 9.4, 1.4), { fill: C.shadow, 'fill-opacity': 0.06 }, 'wm-shadow'),
    P(ell(12.3, 21.4, 7.5, 1.1), { fill: C.shadow, 'fill-opacity': 0.08 }, 'wm-shadow'),
    P(ell(12.3, 21.4, 5.4, 0.8), { fill: C.shadow, 'fill-opacity': 0.11 }, 'wm-shadow'),
    // the handle loop behind the belly: underside in shade, then the lit loop
    S(mv(HANDLE, 0.55, 0.45), C.c1, 2.3, {}, 'wm-k'),
    S(mv(HANDLE, 0.55, 0.45), C.shadow, 2.3, { 'stroke-opacity': 0.34 }, 'wm-k'),
    S(HANDLE, C.c1, 2.3, {}, 'wm-k'),
    S(HANDLE, C.shadow, 2.3, { 'stroke-opacity': 0.1 }, 'wm-k'),
    S('M18.9 11.6C20.4 11.5 21 12.4 21 13.4', C.shine, 0.5, { 'stroke-opacity': 0.7 }, 'wm-shine'),
    // the spout on the left
    ...slab(SPOUT, C.c1, 0, 'wm-k', 0.55, 0.45),
    S('M2.9 10.1L4.2 9.9', C.shadow, 0.5, { 'stroke-opacity': 0.4 }, 'wm-k'),
    // the round belly, then the gold band round it
    ...slab(BODY, C.c1, 1, 'wm-k'),
    S('M5.15 15.6C9 16.9 15 16.9 18.85 15.6', C.c3, 1, {}, 'wm-k'),
    S('M5.1 15.2C9 16.5 15 16.5 18.9 15.2', C.shine, 0.35, { 'stroke-opacity': 0.5 }, 'wm-shine'),
    S('M6.6 17.6C6.4 15.6 6.5 13.2 8.3 11.6C9 11 9.8 10.7 10.6 10.5', C.shine, 0.8, { 'stroke-opacity': 0.85 }, 'wm-shine'),
    // the lid and its knob
    ...slab(LID, C.c2, 1, 'wm-k', 0.5, 0.4),
    P('M7.8 9.3L16.2 9.3L16.2 10.1L7.8 10.1Z', { fill: C.shadow, 'fill-opacity': 0.12 }, 'wm-k'),
    S('M9.4 8.4C9.7 7.7 10.4 7.3 11.2 7.2', C.shine, 0.55, { 'stroke-opacity': 0.85 }, 'wm-shine'),
    P(ell(12.2, 5.3, 1.25, 1.25), { fill: C.shadow, 'fill-opacity': 0.3 }, 'wm-s'),
    P(ell(11.9, 5.1, 1.25, 1.25), { fill: C.c3 }, 'wm-s'),
    P(ell(11.9, 5.1, 1.25, 1.25), { fill: url(1) }, 'wm-s'),
    S('M11.2 4.6C11.4 4.3 11.7 4.2 12 4.2', C.shine, 0.4, { 'stroke-opacity': 0.9 }, 'wm-shine'),
  ]
}
