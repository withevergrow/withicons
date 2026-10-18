// forge/hand/soft3d/address-book.mjs: an upright address book like the line drawing: a bound cover carrying the person
// bust (head over shoulders) in cream, a pressed spine and three gold ring tabs sticking out of the right edge
// (the generated one had a gold ring/knob emblem and read as a safe).
// Roles (as forge/palettes/address-book.json): cover c1, bust c2, tabs c3.
// Motion: cover wm-k, bust and tabs wm-a, shadow wm-shadow, highlights wm-shine.
const N = 'address-book'
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = { c1: v('c1', '#3D7EE0'), c2: v('c2', '#F3E7D3'), c3: v('c3', '#E9B43A'), shadow: v('shadow', '#1D2130'), shine: v('shine', '#FFFFFF') }
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


const F = [3.5, 3.8, 17.4, 21.3, 1.9], O = [1.2, -1.0]
export default function render() {
  const n = [defs()]
  ground(n, 11.6, 21.9, 8.2, 1.2)
  // ring tabs poking out of the right edge (behind the cover)
  for (const y of [7.8, 12.5, 17.2]) {
    const t = rr(15.6, y - 1.1, 20.6, y + 1.1, 1.1)
    n.push(P(rr(15.7, y - 0.9, 20.8, y + 1.3, 1.1), { fill: C.shadow, 'fill-opacity': 0.28 }, 'wm-a'))
    solid(n, t, C.c3, 'wm-a'); n.push(P(t, EDGE, 'wm-a'))
    n.push(P(`M17.2 ${f(y - 0.6)}H19.6`, { fill: 'none', stroke: C.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.35, 'stroke-linecap': 'round' }, 'wm-shine'))
  }
  extrude(n, rrPts(...F), O, C.c1)
  solid(n, rr(...F), C.c1, 'wm-k', true)
  rim(n, ...F)
  // pressed spine
  n.push(P('M5.9 4.5V20.6', { fill: 'none', stroke: C.shadow, 'stroke-opacity': 0.34, 'stroke-width': 0.45, 'stroke-linecap': 'round' }))
  n.push(P('M6.35 4.8V20.3', { fill: 'none', stroke: C.shine, 'stroke-opacity': 0.3, 'stroke-width': 0.3, 'stroke-linecap': 'round' }, 'wm-shine'))
  // person bust: head over shoulders, cream, with a soft shadow under it
  const hx = 11.5, hy = 9.1
  n.push(P(ell(hx + 0.22, hy + 0.3, 2.35, 2.35), { fill: C.shadow, 'fill-opacity': 0.3 }, 'wm-a'))
  n.push(P('M7.92 18.2V17.2A3 3 0 0 1 10.92 14.2H12.52A3 3 0 0 1 15.52 17.2V18.2Z', { fill: C.shadow, 'fill-opacity': 0.3 }, 'wm-a'))
  solid(n, ell(hx, hy, 2.35, 2.35), C.c2, 'wm-a')
  solid(n, 'M7.7 17.9V16.9A3 3 0 0 1 10.7 13.9H12.3A3 3 0 0 1 15.3 16.9V17.9Z', C.c2, 'wm-a')
  n.push(P('M9.6 8.2A2.2 2.2 0 0 1 11.3 6.9', { fill: 'none', stroke: C.shine, 'stroke-opacity': 0.75, 'stroke-width': 0.4, 'stroke-linecap': 'round' }, 'wm-shine'))
  return n
}
