// forge/hand/soft3d/bath.mjs — a side-on clawfoot bathtub: round-bellied white bowl, rim lip, two claw feet and a hooked faucet with a red tap knob at the left end.
// Redrawn front-on instead of the generated tilted solid; same studio recipe as the other soft3d objects (lit upper left, depth to the lower right, soft contact shadow).
const N = 'bath'
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
const C1 = v('c1', '#F4F6FA'), C2 = v('c2', '#6FAEDB'), C3 = v('c3', '#E8584A'), C4 = v('c4', '#566176')
const BOWL = 'M3.8 11.4L20.2 11.4L20.2 13.6A5.8 5.8 0 0 1 14.4 19.4L9.6 19.4A5.8 5.8 0 0 1 3.8 13.6Z'
const RIM = rr(2.6, 9.9, 18.8, 2.4, 1.2)
const ARCH = 'M5.8 10.2L5.8 6.8A2.4 2.4 0 0 1 10.6 6.8L10.6 8.3'

export default function render() {
  const n = [DEFS]
  n.push(...shadow(12, 21.5, 9, 0.8))
  // two claw feet
  for (const x of [5.2, 15.6]) n.push(...solid(rr(x, 17.2, 3.2, 3.8, 1.4), C4, 'wm-k', 0, 0.5, 0.4))
  // the bowl: round-bellied, lit upper left, with an edge so the white reads
  n.push(...solid(BOWL, C2, 'wm-k', 1, 0.7, 0.55))
  n.push(P(BOWL, { fill: 'none', stroke: SH, 'stroke-width': 0.8, 'stroke-opacity': 0.5, 'stroke-linejoin': 'round' }, 'wm-k'))
  n.push(S('M5.2 13.4C5.5 15.5 7 17.2 8.8 17.9', SN, 0.7, { 'stroke-opacity': 0.8 }, 'wm-shine'))
  // the rim lip on top
  n.push(...solid(RIM, C1, 'wm-k', 0, 0.7, 0.55))
  n.push(P(RIM, { fill: 'none', stroke: SH, 'stroke-width': 0.8, 'stroke-opacity': 0.5, 'stroke-linejoin': 'round' }, 'wm-k'))
  n.push(S('M4 10.7L19 10.7', SN, 0.5, { 'stroke-opacity': 0.9 }, 'wm-shine'))
  // the hooked faucet at the left end: collar, arched pipe, nozzle, red tap knob
  n.push(S(ARCH, SH, 2.8, { 'stroke-opacity': 0.55 }, 'wm-a'), S(ARCH, C4, 2.2, {}, 'wm-a'))
  n.push(P(rr(4.3, 9.1, 3.0, 1.5, 0.7), { fill: C4 }, 'wm-a'), P(rr(4.3, 9.1, 3.0, 1.5, 0.7), { fill: url(0) }, 'wm-a'))
  n.push(P(rr(9.5, 7.9, 2.2, 1.3, 0.55), { fill: C4 }, 'wm-a'), P(rr(9.5, 7.9, 2.2, 1.3, 0.55), { fill: SH, 'fill-opacity': 0.2 }, 'wm-a'))
  n.push(S('M6.5 6.6C6.7 5.7 7.4 5.2 8.2 5.1', SN, 0.5, { 'stroke-opacity': 0.85 }, 'wm-shine'))
  n.push(S('M8.2 4.6L8.2 3.4', C4, 1.2, {}, 'wm-a'), P(ell(8.2, 2.9, 1.25, 1.1), { fill: C3 }, 'wm-a'), P(ell(7.8, 2.5, 0.4, 0.35), { fill: SN, 'fill-opacity': 0.8 }, 'wm-shine'))
  return n
}
