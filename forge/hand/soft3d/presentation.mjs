// forge/hand/soft3d/presentation.mjs — a front-facing landscape whiteboard on an easel: a framed white face with a blue trend line, two splayed legs and a centre support.
// Redrawn front-on instead of the generated tilted solid; same studio recipe as the other soft3d objects (lit upper left, depth to the lower right, soft contact shadow).
const N = 'presentation'
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
const C1 = v('c1', '#F2F5F9'), C2 = v('c2', '#3D7EE0'), C3 = v('c3', '#8F99A8'), C4 = v('c4', '#C9CFD8')
const FRAME = rr(3, 3.5, 18, 12, 2)
const FACE = rr(4.2, 4.7, 15.6, 9.6, 1.2)
const LINE = 'M7.4 11.4L10.6 8.5L13.5 10.4L16.6 7.6'

export default function render() {
  const n = [DEFS]
  n.push(...shadow(12, 21.4, 7.6, 0.8))
  // legs: two splayed, one short centre support
  for (const d of ['M8.8 15L7 20.3', 'M15.2 15L17 20.3', 'M12 15L12 18.4']) {
    n.push(S(d, C3, 1.9, {}, 'wm-a'), S(d, SH, 1.9, { 'stroke-opacity': 0.18 }, 'wm-a'))
  }
  n.push(S('M8.3 16.2L7.4 18.8M15.5 16.2L16.4 18.8', SN, 0.45, { 'stroke-opacity': 0.55 }, 'wm-shine'))
  // the board: a firm frame with depth, a bright white face
  n.push(...solid(FRAME, C4, 'wm-k', 0, 0.7, 0.6))
  n.push(P(FACE, { fill: C1 }, 'wm-k'), P(FACE, { fill: url(1) }, 'wm-k'))
  n.push(S('M4.5 6.2L4.5 11M6 5L10 5', SN, 0.55, { 'stroke-opacity': 0.8 }, 'wm-shine'))
  // the trend line, with a soft underside and end dots
  n.push(S(LINE, SH, 1.9, { 'stroke-opacity': 0.16 }, 'wm-a'))
  n.push(S(LINE, C2, 1.9, {}, 'wm-a'))
  n.push(S('M7.7 10.9L10.6 8.2L13.5 10.1', SN, 0.4, { 'stroke-opacity': 0.5 }, 'wm-shine'))
  n.push(P(ell(7.4, 11.4, 1.3, 1.3), { fill: C2 }, 'wm-a'), P(ell(16.6, 7.6, 1.3, 1.3), { fill: C2 }, 'wm-a'))
  n.push(P(ell(7.1, 11.1, 0.45, 0.45), { fill: SN, 'fill-opacity': 0.7 }, 'wm-shine'), P(ell(16.3, 7.3, 0.45, 0.45), { fill: SN, 'fill-opacity': 0.7 }, 'wm-shine'))
  return n
}
