// forge/hand/soft3d/signpost.mjs — a front-on signpost: a vertical pole on a base with two stacked boards, the top one pointing right and the bottom one left.
// Redrawn front-on instead of the generated tilted solid; same studio recipe as the other soft3d objects (lit upper left, depth to the lower right, soft contact shadow).
const N = 'signpost'
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
const C1 = v('c1', '#B8763E'), C2 = v('c2', '#E6C489'), C3 = v('c3', '#8A5838')
const TOP = 'M6.4 3.8L17.2 3.8L20.6 6.3L17.2 8.8L6.4 8.8A1.4 1.4 0 0 1 5 7.4L5 5.2A1.4 1.4 0 0 1 6.4 3.8Z'
const BOT = 'M17.6 11L6.8 11L3.4 13.5L6.8 16L17.6 16A1.4 1.4 0 0 0 19 14.6L19 12.4A1.4 1.4 0 0 0 17.6 11Z'

export default function render() {
  const n = [['defs', {}, [...DEFS[2], ['linearGradient', { id: id(2), x1: 0, y1: 0, x2: 1, y2: 0 }, [stop(0, SN, 0.3), stop(0.25, SN, 0.4), stop(0.5, SN, 0), stop(0.7, SH, 0), stop(1, SH, 0.3)]]]]]
  n.push(...shadow(12.3, 21.6, 6.6, 0.75))
  // pole and base
  const POLE = rr(10.8, 2.2, 2.4, 18.4, 1.1)
  n.push(P(wall(POLE, 0.6, 0.5, 3), { fill: C3 }, 'wm-k'), P(wall(POLE, 0.6, 0.5, 3), { fill: SH, 'fill-opacity': 0.26 }, 'wm-k'))
  n.push(P(POLE, { fill: C3 }, 'wm-k'), P(POLE, { fill: url(2) }, 'wm-k'))
  n.push(...solid(rr(7.2, 19.2, 9.6, 2, 1), C3, 'wm-k', 0, 0.6, 0.5))
  n.push(S('M8.4 19.8L15 19.8', SN, 0.4, { 'stroke-opacity': 0.5 }, 'wm-shine'))
  // the two boards: top points right, bottom points left, each with lettering and a lit upper edge
  n.push(...solid(TOP, C1, 'wm-a', 0, 0.7, 0.6))
  n.push(S('M7.6 5.9L15 5.9M7.6 7.3L12.4 7.3', SH, 0.9, { 'stroke-opacity': 0.3 }, 'wm-a'))
  n.push(S('M6.2 4.5L16.6 4.5', SN, 0.5, { 'stroke-opacity': 0.7 }, 'wm-shine'))
  n.push(...solid(BOT, C2, 'wm-a', 0, 0.7, 0.6))
  n.push(S('M9 13.2L16.6 13.2M11.8 14.6L16.6 14.6', SH, 0.9, { 'stroke-opacity': 0.28 }, 'wm-a'))
  n.push(S('M7.6 11.7L17.2 11.7', SN, 0.5, { 'stroke-opacity': 0.8 }, 'wm-shine'))
  return n
}
