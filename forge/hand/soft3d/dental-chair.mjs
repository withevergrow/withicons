// forge/hand/soft3d/dental-chair.mjs: a dentist's chair seen side-on like the line drawing: a diagonal backrest with its
// headrest, a rounded seat, the leg rest, a pedestal on a round base and the lamp dome hanging from its arm
// (the generated one was a boxy isometric armchair where the lamp was lost).
// Roles (as forge/palettes/dental-chair.json): upholstery c1, lamp, pedestal and headrest c2, bulb glow accent.
// Motion: chair wm-k, lamp wm-a, bulb wm-s, shadow wm-shadow, highlights wm-shine.
const N = 'dental-chair'
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = { c1: v('c1', '#25A99B'), c2: v('c2', '#E6EBF1'), accent: v('accent', '#FFD36A'), shadow: v('shadow', '#1D2130'), shine: v('shine', '#FFFFFF') }
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


// the upholstery runs along one bent centreline: backrest, seat, leg rest
const spine = (dx = 0, dy = 0) => `M${f(5.6 + dx)} ${f(6 + dy)}L${f(8.7 + dx)} ${f(11.9 + dy)}H${f(14.4 + dx)}L${f(18.2 + dx)} ${f(16.1 + dy)}`
export default function render() {
  const n = [defs()]
  ground(n, 11.6, 22, 8.6, 1.1)
  // base and pedestal
  n.push(P(rr(5.8, 19.9, 17.4, 22.3, 1.2), { fill: C.shadow, 'fill-opacity': 0.3 }))
  solid(n, rr(5.6, 19.6, 17.2, 22, 1.2), C.c2, 'wm-k', true)
  n.push(P(rr(9.75, 13.5, 13.35, 20.1, 1.2), { fill: C.shadow, 'fill-opacity': 0.26 }))
  solid(n, rr(9.6, 13.3, 13.2, 20, 1.2), C.c2, 'wm-k', true)
  line(n, 'M10.5 15V19', C.shine, 0.5, 0.7, 'wm-shine')
  line(n, 'M12.3 15V19', C.shadow, 0.5, 0.2)
  // upholstery: a dark copy below it gives the thickness, then the body, the light, and a lit crown
  line(n, spine(0.35, 0.65), C.c1, 5.4)
  line(n, spine(0.35, 0.65), C.shadow, 5.4, 0.42)
  line(n, spine(), C.c1, 5.2)
  n.push(P(spine(), { fill: 'none', stroke: url(0), 'stroke-width': 5.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }))
  line(n, spine(-0.8, -0.9), C.shine, 1.1, 0.38, 'wm-shine')
  // headrest: a pillow on top of the backrest, in the light colour
  line(n, 'M4.6 4.1L5.6 6', C.shadow, 5.2, 0.28)
  line(n, 'M4.55 3.95L5.55 5.85', C.c2, 5.2)
  n.push(P('M4.55 3.95L5.55 5.85', { fill: 'none', stroke: url(0), 'stroke-width': 5.2, 'stroke-linecap': 'round' }))
  line(n, 'M3.3 3L3.7 3.9', C.shine, 0.6, 0.7, 'wm-shine')
  // lamp: arm, joint, dome and a warm bulb under it
  line(n, 'M16.4 2.1V5', C.shadow, 1.9, 0.28, 'wm-a')
  line(n, 'M16.35 2V5', C.c2, 1.8, 1, 'wm-a')
  n.push(P(ell(16.4, 2.2, 1.2, 1.2), { fill: C.c2 }, 'wm-a'), P(ell(16.4, 2.2, 1.2, 1.2), EDGE, 'wm-a'))
  const dome = 'M12.6 7.4A3.8 3.2 0 0 1 20.2 7.4Z'
  n.push(P(ell(16.4, 7.7, 2.9, 0.75), { fill: C.accent }, 'wm-s'))
  n.push(P(ell(16.1, 7.65, 1.5, 0.35), { fill: C.shine, 'fill-opacity': 0.7 }, 'wm-shine'))
  n.push(P('M12.75 7.7A3.8 3.2 0 0 1 20.05 7.7Z', { fill: C.shadow, 'fill-opacity': 0.3 }, 'wm-a'))
  solid(n, dome, C.c2, 'wm-a', true)
  n.push(P('M13.4 6.4A3.2 2.7 0 0 1 15.6 4.7', { fill: 'none', stroke: C.shine, 'stroke-opacity': 0.8, 'stroke-width': 0.55, 'stroke-linecap': 'round' }, 'wm-shine'))
  n.push(P('M12.6 7.4H20.2', { fill: 'none', stroke: C.shadow, 'stroke-opacity': 0.3, 'stroke-width': 0.45, 'stroke-linecap': 'round' }, 'wm-a'))
  return n
}
