// forge/hand/soft3d/beer.mjs — an upright beer mug: amber glass with two light slots, a puffy foam cloud over the rim and a chunky glass handle on the right.
// Redrawn front-on instead of the generated tilted solid; same studio recipe as the other soft3d objects (lit upper left, depth to the lower right, soft contact shadow).
const N = 'beer'
const f = n => +(+n).toFixed(2)
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const id = n => `wg-soft3d-${N}-${n}`, url = n => `url(#${id(n)})`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const S = (d, stroke, w, extra, cls) => P(d, { fill: 'none', stroke, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }, cls)
const ell = (x, y, rx, ry) => `M${f(x - rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 1 0 ${f(x + rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 1 0 ${f(x - rx)} ${f(y)}Z`
const mv = (d, dx, dy) => d.replace(/([MLCQA])([^MLCQAZ]*)/g, (m, c, s) => c + s.trim().split(/[\s,]+/).filter(Boolean).map(Number)
  .map((x, i) => c === 'A' ? (i % 7 === 5 ? x + dx : i % 7 === 6 ? x + dy : x) : x + (i % 2 ? dy : dx)).map(f).join(' '))
const wall = (d, dx, dy, n = 4) => Array.from({ length: n }, (_, i) => mv(d, dx * (i + 1) / n, dy * (i + 1) / n)).join('')
const DEFS = ['defs', {}, [
  ['linearGradient', { id: id(0), x1: 0, y1: 0, x2: 1, y2: 1 }, [stop(0, SN, 0.34), stop(0.42, SN, 0), stop(0.62, SH, 0), stop(1, SH, 0.2)]],
  ['radialGradient', { id: id(1), cx: 0.36, cy: 0.3, r: 0.78 }, [stop(0, SN, 0.7), stop(0.5, SN, 0), stop(0.8, SH, 0.05), stop(1, SH, 0.22)]],
]]
// a solid piece: its wall (depth to the lower right) in shade, then the lit face
const solid = (d, fill, cls, g = 0, dx = 0.7, dy = 0.6) => {
  const W = wall(d, dx, dy)
  return [P(W, { fill }, cls), P(W, { fill: SH, 'fill-opacity': 0.26 }, cls), P(d, { fill }, cls), P(d, { fill: url(g) }, cls)]
}
const shadow = (cx, cy, rx, ry) => [[1, 0.06], [0.8, 0.08], [0.58, 0.11]].map(([k, o]) => P(ell(cx, cy, rx * k, ry * k), { fill: SH, 'fill-opacity': o }, 'wm-shadow'))
const rr = (x, y, w, h, r) => `M${f(x + r)} ${f(y)}L${f(x + w - r)} ${f(y)}A${r} ${r} 0 0 1 ${f(x + w)} ${f(y + r)}L${f(x + w)} ${f(y + h - r)}A${r} ${r} 0 0 1 ${f(x + w - r)} ${f(y + h)}L${f(x + r)} ${f(y + h)}A${r} ${r} 0 0 1 ${f(x)} ${f(y + h - r)}L${f(x)} ${f(y + r)}A${r} ${r} 0 0 1 ${f(x + r)} ${f(y)}Z`
const C1 = v('c1', '#F5A524'), C2 = v('c2', '#F6F8FB'), C3 = v('c3', '#EEF1F5')
const BODY = 'M4 8.5L15.5 8.5L15.5 19.5A2 2 0 0 1 13.5 21.5L6 21.5A2 2 0 0 1 4 19.5Z'
// foam: a cloud of overlapping puffs (all counter-clockwise so they union), two drips over the rim
const FOAM = 'M3.8 7.4L3.8 9.6L15.7 9.6L15.7 7.4Z' + ell(5.8, 7.2, 2.7, 2.5) + ell(9.7, 5.8, 3.1, 2.9) + ell(13.3, 7.1, 2.7, 2.5) + ell(7.4, 9.7, 1.15, 1.2) + ell(12.2, 9.8, 1.05, 1.1)
const HANDLE = 'M15.3 11.6C21.2 10.6 21.6 18.4 15.3 17.9'

export default function render() {
  const n = [['defs', {}, [...DEFS[2], ['linearGradient', { id: id(2), x1: 0, y1: 0, x2: 1, y2: 0 }, [stop(0, SN, 0.28), stop(0.2, SN, 0.4), stop(0.42, SN, 0), stop(0.62, SH, 0), stop(1, SH, 0.28)]]]]]
  n.push(...shadow(11.8, 21.7, 9.2, 0.8))
  // the handle: a thick glass loop, a darker underside, a lit upper edge
  n.push(S(HANDLE, C3, 2.5, {}, 'wm-a'), S(HANDLE, SH, 2.5, { 'stroke-opacity': 0.2 }, 'wm-a'))
  n.push(S('M15.7 12.5C19.4 12 19.9 16.8 15.7 16.9', SH, 0.55, { 'stroke-opacity': 0.3 }, 'wm-a'))
  n.push(S('M16.4 10.6C18.6 10.6 19.9 11.8 20.2 13.4', SN, 0.5, { 'stroke-opacity': 0.8 }, 'wm-shine'))
  // the mug
  n.push(P(BODY, { fill: C1 }, 'wm-k'), P(BODY, { fill: url(2) }, 'wm-k'))
  n.push(S('M5 11.4L5 19', SN, 0.6, { 'stroke-opacity': 0.65 }, 'wm-shine'))
  n.push(S('M14.6 11.4L14.6 19.2C14.6 20.2 13.8 20.7 12.8 20.7L7 20.7', SH, 0.5, { 'stroke-opacity': 0.3 }, 'wm-k'))
  // two glass slots catching light
  n.push(P(rr(7.3, 12.8, 1.5, 5.4, 0.75), { fill: SN, 'fill-opacity': 0.5 }, 'wm-k'), P(rr(11.2, 12.8, 1.5, 5.4, 0.75), { fill: SN, 'fill-opacity': 0.5 }, 'wm-k'))
  // the foam
  n.push(P(FOAM, { fill: SH, 'fill-opacity': 0.1 }, 'wm-a'))
  const FW = wall(FOAM, 0.6, 0.5, 3)
  n.push(P(FW, { fill: C2 }, 'wm-a'), P(FW, { fill: SH, 'fill-opacity': 0.24 }, 'wm-a'))
  n.push(P(FOAM, { fill: C2 }, 'wm-a'), P(FOAM, { fill: url(1) }, 'wm-a'))
  n.push(S('M7.6 5.2C8.1 4.3 8.9 3.9 10 3.9M4.4 6.6C4.7 6 5.1 5.7 5.6 5.6', SN, 0.7, { 'stroke-opacity': 0.95 }, 'wm-shine'))
  return n
}
