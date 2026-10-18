// forge/hand/soft3d/shopping-bag.mjs: an upright, front-facing shopping bag like the line drawing: a slightly flared
// body with the arched handle clearly rising over the top, in soft 3D (the generated one was a tilted box with a tiny handle).
// Roles (as forge/palettes/shopping-bag.json): bag c1, handle c2, cuff c3.
// Motion: bag wm-k, handle wm-a, shadow wm-shadow, highlights wm-shine.
const N = 'shopping-bag'
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = { c1: v('c1', '#F28A2E'), c2: v('c2', '#8A5838'), c3: v('c3', '#FFD08A'), shadow: v('shadow', '#1D2130'), shine: v('shine', '#FFFFFF') }
const f = n => +(+n).toFixed(2)
const id = n => `wg-soft3d-${N}-${n}`, url = n => `url(#${id(n)})`
const stop = (o, c, a = 1) => ['stop', a === 1 ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': a }]
const P = (d, a, cls = 'wm-k') => ['path', { d, ...a, class: cls }]
const ell = (x, y, rx, ry) => `M${f(x - rx)} ${f(y)}a${f(rx)} ${f(ry)} 0 1 0 ${f(2 * rx)} 0a${f(rx)} ${f(ry)} 0 1 0 ${f(-2 * rx)} 0Z`
const rr = (x0, y0, x1, y1, r) => `M${f(x0 + r)} ${f(y0)}H${f(x1 - r)}a${f(r)} ${f(r)} 0 0 1 ${f(r)} ${f(r)}V${f(y1 - r)}a${f(r)} ${f(r)} 0 0 1 ${f(-r)} ${f(r)}H${f(x0 + r)}a${f(r)} ${f(r)} 0 0 1 ${f(-r)} ${f(-r)}V${f(y0 + r)}a${f(r)} ${f(r)} 0 0 1 ${f(r)} ${f(-r)}Z`
const rrPts = (x0, y0, x1, y1, r, n = 6) => {
  const out = [], cs = [[x1 - r, y0 + r, -90], [x1 - r, y1 - r, 0], [x0 + r, y1 - r, 90], [x0 + r, y0 + r, 180]]
  for (const [cx, cy, a0] of cs) for (let i = 0; i <= n; i++) { const a = (a0 + 90 * i / n) * Math.PI / 180; out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]) }
  return out
}
const hull = pts => {
  const p = pts.map(q => [f(q[0]), f(q[1])]).sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const lo = [], up = []
  for (const q of p) { while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q) }
  for (const q of p.slice().reverse()) { while (up.length > 1 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q) }
  return lo.slice(0, -1).concat(up.slice(0, -1))
}
const poly = pts => 'M' + pts.map(q => `${f(q[0])} ${f(q[1])}`).join('L') + 'Z'
const sh = (pts, o) => pts.map(q => [q[0] + o[0], q[1] + o[1]])
const EDGE = { fill: 'none', stroke: C.shadow, 'stroke-opacity': 0.24, 'stroke-width': 0.4, 'stroke-linejoin': 'round' }
const defs = () => ['defs', {}, [
  ['linearGradient', { id: id(0), x1: 0, y1: 0, x2: 1, y2: 1 }, [stop(0, C.shine, 0.34), stop(0.42, C.shine, 0), stop(0.62, C.shadow, 0), stop(1, C.shadow, 0.2)]],
]]
// three soft contact-shadow ellipses
const ground = (n, cx, cy, rx, ry) => n.push(
  P(ell(cx + 0.2, cy, rx, ry), { fill: C.shadow, 'fill-opacity': 0.06 }, 'wm-shadow'),
  P(ell(cx + 0.1, cy, rx * 0.8, ry * 0.78), { fill: C.shadow, 'fill-opacity': 0.08 }, 'wm-shadow'),
  P(ell(cx, cy, rx * 0.58, ry * 0.58), { fill: C.shadow, 'fill-opacity': 0.12 }, 'wm-shadow'))
// a lit piece: colour + the style's light gradient (+ optional edge)
const solid = (n, d, col, cls = 'wm-k', edge = false) => { n.push(P(d, { fill: col }, cls), P(d, { fill: url(0) }, cls)); if (edge) n.push(P(d, EDGE, cls)) }
const line = (n, d, col, w, o = 1, cls = 'wm-k') => n.push(P(d, { fill: 'none', stroke: col, 'stroke-width': w, ...(o < 1 ? { 'stroke-opacity': o } : {}), 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, cls))
// the extruded silhouette of a convex front face (the back goes up and to the right by O), in col and shaded
const extrude = (n, pts, O, col, cls = 'wm-k') => {
  const s = poly(hull([...pts, ...sh(pts, O)]))
  n.push(P(s, { fill: col }, cls), P(s, { fill: C.shadow, 'fill-opacity': 0.36 }, cls), P(s, EDGE, cls))
}
// lit bevel on the upper left, soft dark on the lower right of a rounded rectangle
const rim = (n, x0, y0, x1, y1, r) => {
  const q = r - 0.4
  n.push(P(`M${f(x0 + 0.4)} ${f(y1 - r)}V${f(y0 + r)}a${f(q)} ${f(q)} 0 0 1 ${f(q)} ${f(-q)}H${f(x1 - r)}`, { fill: 'none', stroke: C.shine, 'stroke-opacity': 0.5, 'stroke-width': 0.45, 'stroke-linecap': 'round' }, 'wm-shine'))
  n.push(P(`M${f(x1 - 0.4)} ${f(y0 + r)}V${f(y1 - r)}a${f(q)} ${f(q)} 0 0 1 ${f(-q)} ${f(q)}H${f(x0 + r)}`, { fill: 'none', stroke: C.shadow, 'stroke-opacity': 0.3, 'stroke-width': 0.45, 'stroke-linecap': 'round' }))
}
// a small round button / knob with a drop shadow and a glint
const knob = (n, x, y, r, col, cls = 'wm-k') => {
  n.push(P(ell(x + 0.2, y + 0.3, r, r), { fill: C.shadow, 'fill-opacity': 0.3 }, cls))
  solid(n, ell(x, y, r, r), col, cls)
  n.push(P(ell(x - r * 0.3, y - r * 0.35, r * 0.28, r * 0.22), { fill: C.shine, 'fill-opacity': 0.7 }, 'wm-shine'))
}


// flared body: top edge T, bottom edge B; the back goes up and to the right by O
const T = 7.9, B = 21.4, O = [0.9, -0.7]
const body = `M7.3 ${T}H15.9a1.5 1.5 0 0 1 1.5 1.4L18.4 19.5A2 2 0 0 1 16.4 ${B}H6.8A2 2 0 0 1 4.8 19.5L5.8 9.3A1.5 1.5 0 0 1 7.3 ${T}Z`
const bodyPts = [[5.8, 9.3], [6.3, 8.2], [7.3, T], [15.9, T], [16.9, 8.2], [17.4, 9.3], [18.4, 19.5], [18.2, 20.6], [16.4, B], [6.8, B], [5.0, 20.6], [4.8, 19.5]]
export default function render() {
  const n = [defs()]
  ground(n, 11.9, 21.7, 7.9, 1.2)
  // handle: an arch rising out of the top, a shadow copy under it, a glint on its lit side
  const arch = 'M8.7 10.4V5.9a3.5 3.5 0 0 1 7 0V10.4'
  n.push(P(arch, { fill: 'none', stroke: C.shadow, 'stroke-opacity': 0.3, 'stroke-width': 1.7, 'stroke-linecap': 'round' }, 'wm-a'))
  n.push(P(arch, { fill: 'none', stroke: C.c2, 'stroke-width': 1.6, 'stroke-linecap': 'round' }, 'wm-a'))
  n.push(P('M8.4 7.4V5.9a3.6 3.6 0 0 1 3-3.5', { fill: 'none', stroke: C.shine, 'stroke-opacity': 0.5, 'stroke-width': 0.35, 'stroke-linecap': 'round' }, 'wm-shine'))
  extrude(n, bodyPts, O, C.c1)
  solid(n, body, C.c1, 'wm-k', true)
  // folded cuff band along the top edge
  n.push(P(`M7.3 ${T}H15.9a1.5 1.5 0 0 1 1.5 1.4L17.5 10.1H5.7L5.8 9.3A1.5 1.5 0 0 1 7.3 ${T}Z`, { fill: C.c3, 'fill-opacity': 0.34 }))
  n.push(P('M5.7 10.15H17.5', { fill: 'none', stroke: C.shadow, 'stroke-opacity': 0.22, 'stroke-width': 0.4 }))
  n.push(P('M5.8 10.6H17.55', { fill: 'none', stroke: C.shine, 'stroke-opacity': 0.25, 'stroke-width': 0.3 }, 'wm-shine'))
  // bevels
  n.push(P('M6.4 18.6L5.6 9.6A1 1 0 0 1 6.6 8.7H8.4M7.9 8.7H15.4', { fill: 'none', stroke: C.shine, 'stroke-opacity': 0.5, 'stroke-width': 0.45, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, 'wm-shine'))
  n.push(P('M17.15 9.6L18.05 19.3A1.5 1.5 0 0 1 16.55 20.9H8', { fill: 'none', stroke: C.shadow, 'stroke-opacity': 0.3, 'stroke-width': 0.45, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }))
  // eyelets the handle runs through
  for (const x of [8.7, 15.7]) {
    n.push(P(ell(x + 0.15, 9.2, 0.75, 0.75), { fill: C.shadow, 'fill-opacity': 0.35 }, 'wm-a'))
    n.push(P(ell(x, 9.0, 0.75, 0.75), { fill: C.c2 }, 'wm-a'), P(ell(x, 9.0, 0.35, 0.35), { fill: C.shadow, 'fill-opacity': 0.55 }, 'wm-a'))
  }
  return n
}
