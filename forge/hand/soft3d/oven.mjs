// forge/hand/soft3d/oven.mjs: a front-facing oven in soft 3D like the line drawing: control strip with display and two
// knobs, a big centred window with wavy heat, a drawer line and two feet (the generated one was a 3/4 box with a tiny window).
// Roles (as forge/palettes/oven.json): body c1, glass and display c2, knobs c3, heat accent.
// Motion: body wm-k, shadow wm-shadow, highlights wm-shine, heat wm-a, display light wm-s.
const N = 'oven'
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = { c1: v('c1', '#BFC7D2'), c2: v('c2', '#3A404C'), c3: v('c3', '#E5483F'), accent: v('accent', '#FF6A4D'), shadow: v('shadow', '#1D2130'), shine: v('shine', '#FFFFFF') }
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


const F = [3.6, 3.7, 19.2, 19.5, 2.2], O = [1.7, -1.3]
export default function render() {
  const n = [defs()]
  ground(n, 12.4, 21.7, 8.4, 1.3)
  // feet
  for (const x of [5.2, 14.6]) { solid(n, rr(x, 18.6, x + 3.2, 21.3, 0.9), C.c2); n.push(P(rr(x, 18.6, x + 3.2, 21.3, 0.9), { fill: C.shadow, 'fill-opacity': 0.35 })) }
  extrude(n, rrPts(...F), O, C.c1)
  solid(n, rr(...F), C.c1, 'wm-k', true)
  rim(n, ...F)
  // control strip: a groove under it
  line(n, 'M3.9 7.9H18.9', C.shadow, 0.4, 0.3)
  line(n, 'M3.9 8.35H18.9', C.shine, 0.3, 0.4, 'wm-shine')
  // display with a lit readout
  const dsp = rr(6.8, 4.7, 12.4, 6.9, 0.8)
  n.push(P(rr(6.9, 4.9, 12.5, 7.1, 0.8), { fill: C.shadow, 'fill-opacity': 0.2 }))
  solid(n, dsp, C.c2); n.push(P(dsp, EDGE))
  line(n, 'M8.2 5.8H9.8', C.accent, 0.6, 1, 'wm-s')
  n.push(P(ell(11, 5.8, 0.3, 0.3), { fill: C.accent }, 'wm-s'))
  // knobs
  knob(n, 15.0, 5.8, 1.0, C.c3)
  knob(n, 17.5, 5.8, 1.0, C.c3)
  // window: lit rim, dark glass, warm heat
  n.push(P(rr(5.7, 9.2, 17.1, 16.9, 1.9), { fill: C.shadow, 'fill-opacity': 0.26 }))
  n.push(P(rr(5.5, 9.0, 16.9, 16.7, 1.9), { fill: C.shine, 'fill-opacity': 0.55 }, 'wm-shine'))
  const glass = rr(6.1, 9.6, 16.3, 16.1, 1.4)
  n.push(P(glass, { fill: C.c2 }))
  n.push(P(rr(6.1, 12.2, 16.3, 16.1, 1.4), { fill: C.accent, 'fill-opacity': 0.28 }, 'wm-a'))
  n.push(P(glass, { fill: url(0) }))
  for (const x of [8.7, 11.2, 13.7]) line(n, `M${x} 10.9C${f(x - 0.8)} 11.8 ${f(x - 0.8)} 12.5 ${x} 13.2S${f(x + 0.8)} 14.6 ${x} 15.3`, C.accent, 0.75, 1, 'wm-a')
  n.push(P('M6.5 11.8V11a1.1 1.1 0 0 1 1.1-1.1H9.6', { fill: 'none', stroke: C.shine, 'stroke-opacity': 0.5, 'stroke-width': 0.4, 'stroke-linecap': 'round' }, 'wm-shine'))
  // drawer
  line(n, 'M3.9 17.8H18.9', C.shadow, 0.4, 0.3)
  line(n, 'M3.9 18.25H18.9', C.shine, 0.3, 0.4, 'wm-shine')
  n.push(P(rr(9.2, 18.5, 13.6, 19.1, 0.3), { fill: C.c2, 'fill-opacity': 0.75 }))
  return n
}
