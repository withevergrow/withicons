// forge/hand/soft3d/cake.mjs — a whole single-tier birthday cake, upright: cream sponge on a plate, pink wavy icing with drips and sprinkles, a centred candle with a flame.
// Redrawn front-on instead of the generated tilted solid; same studio recipe as the other soft3d objects (lit upper left, depth to the lower right, soft contact shadow).
const N = 'cake'
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
const C1 = v('c1', '#F27BA5'), C2 = v('c2', '#F3E7D3'), C3 = v('c3', '#5BB8E8'), C4 = v('c4', '#C9CFD8'), AC = v('accent', '#FFB02E')
const SPONGE = rr(4, 11, 16, 9.2, 1.2)
const PLATE = rr(2.5, 19.4, 19, 2, 1)
// icing: a flat top with four soft drips (alternating long and short)
const ICING = 'M3.6 10.8A2 2 0 0 1 5.6 8.8L18.4 8.8A2 2 0 0 1 20.4 10.8L20.4 12.2A2.1 2.3 0 0 1 16.2 12.2A2.1 3 0 0 1 12 12.2A2.1 2.3 0 0 1 7.8 12.2A2.1 3 0 0 1 3.6 12.2Z'
const CANDLE = rr(11.05, 4.7, 1.9, 5.4, 0.7)
const FLAME = 'M12 1.2C13.2 2.5 13.85 3.35 13.85 4.1A1.85 1.85 0 0 1 10.15 4.1C10.15 3.35 10.8 2.5 12 1.2Z'

export default function render() {
  const n = [DEFS]
  n.push(...shadow(12.4, 21.6, 9.4, 0.85))
  // the candle (behind the icing), its flame
  n.push(P(rr(11.9, 4.7, 1.05, 5.4, 0.5), { fill: SH, 'fill-opacity': 0.22 }, 'wm-a'))
  n.push(P(CANDLE, { fill: C3 }, 'wm-a'), P(CANDLE, { fill: url(0) }, 'wm-a'))
  n.push(S('M11.9 5.8L12.6 6.5M11.9 8L12.6 8.7', SN, 0.5, { 'stroke-opacity': 0.8 }, 'wm-a'))
  n.push(P(FLAME, { fill: AC }, 'wm-a'), P(FLAME, { fill: url(1) }, 'wm-a'))
  n.push(P('M12 2.9C12.5 3.5 12.75 3.9 12.75 4.2A0.75 0.75 0 0 1 11.25 4.2C11.25 3.9 11.5 3.5 12 2.9Z', { fill: SN, 'fill-opacity': 0.85 }, 'wm-shine'))
  // the sponge and a thin jam line, then the plate rim in front
  n.push(...solid(SPONGE, C2, 'wm-k', 0, 0.7, 0.6))
  n.push(S('M4.9 16.2L19.4 16.2', C1, 0.7, { 'stroke-opacity': 0.55 }, 'wm-k'))
  n.push(S('M4.9 13.2L4.9 17.6', SN, 0.6, { 'stroke-opacity': 0.6 }, 'wm-shine'))
  // the icing, pillowy
  n.push(...solid(ICING, C1, 'wm-a', 1, 0.7, 0.6))
  n.push(S('M5.4 10.1C7 9.7 9 9.6 11 9.6M4.7 11.7L4.7 12.4', SN, 0.6, { 'stroke-opacity': 0.85 }, 'wm-shine'))
  // sprinkles
  n.push(S('M6.6 10.5L7.5 10.9', C3, 0.7, {}, 'wm-deco'), S('M9.6 10.2L10.2 9.7', AC, 0.7, {}, 'wm-deco'), S('M14 10.6L14.9 10.2', AC, 0.7, {}, 'wm-deco'), S('M17 10.1L17.8 10.6', C3, 0.7, {}, 'wm-deco'))
  // the plate
  n.push(...solid(PLATE, C4, 'wm-k', 0, 0.5, 0.4))
  n.push(S('M3.6 20.1L20 20.1', SN, 0.5, { 'stroke-opacity': 0.7 }, 'wm-shine'))
  return n
}
