// forge/hand/soft3d/lunar-drum.mjs — an upright festival barrel drum seen from the front and slightly above: a red
// barrel with a cream skin inside a gold rim, a smile of gold studs, a gold zigzag band and gold foot ring, and a
// wooden stick with a ball tip at the upper right. The generated drawing was a tilted orange blob with no stick;
// this one follows the line design (drum, face dots, zigzag band, stick) with cylindrical shading across the barrel
// (lit left, turned away right) instead of an extruded wall, as the soft3d set does for round vessels.
// Roles: barrel c1, skin c2, gold c3, wood c4. Motion: barrel wm-k, stick wm-a, shadow, speculars.
const N = 'lunar-drum'
const f = n => +(+n).toFixed(2)
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const id = n => `wg-soft3d-${N}-${n}`, url = n => `url(#${id(n)})`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const P = (d, a, cls = 'wm-k') => ['path', { d, ...a, class: cls }]
const ell = (x, y, rx, ry) => `M${f(x - rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 1 0 ${f(x + rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 1 0 ${f(x - rx)} ${f(y)}Z`
// circle, clockwise
const circ = (x, y, r) => `M${f(x - r)} ${f(y)}A${f(r)} ${f(r)} 0 1 1 ${f(x + r)} ${f(y)}A${f(r)} ${f(r)} 0 1 1 ${f(x - r)} ${f(y)}Z`
// rounded rect, clockwise
const rr = (x, y, w, h, r) => `M${f(x + r)} ${f(y)}L${f(x + w - r)} ${f(y)}A${r} ${r} 0 0 1 ${f(x + w)} ${f(y + r)}L${f(x + w)} ${f(y + h - r)}A${r} ${r} 0 0 1 ${f(x + w - r)} ${f(y + h)}L${f(x + r)} ${f(y + h)}A${r} ${r} 0 0 1 ${f(x)} ${f(y + h - r)}L${f(x)} ${f(y + r)}A${r} ${r} 0 0 1 ${f(x + r)} ${f(y)}Z`
// scale by k then move by dx, dy (absolute M L C Q A Z paths only)
const tf = (d, k, dx, dy) => d.replace(/([MLCQA])([^MLCQAZ]*)/g, (m, c, s) => c + s.trim().split(/[\s,]+/).filter(Boolean).map(Number)
  .map((x, i) => c === 'A' ? (i % 7 < 2 ? x * k : i % 7 === 5 ? x * k + dx : i % 7 === 6 ? x * k + dy : x) : x * k + (i % 2 ? dy : dx)).map(f).join(' '))
const mv = (d, dx, dy) => tf(d, 1, dx, dy)
const about = (d, k, cx, cy) => tf(d, k, cx * (1 - k), cy * (1 - k))
const wall = (d, dx, dy, n = 3) => Array.from({ length: n }, (_, i) => mv(d, dx * (i + 1) / n, dy * (i + 1) / n)).join('')
const C = {}
const out = []
// an extruded block: its wall (colour + shade), then the lit face
function blk(d, col, o = {}) {
  const { dx = 0.8, dy = 0.8, n = 3, g = 0, cls = 'wm-k', rule } = o
  const ex = rule ? { 'fill-rule': rule } : {}
  if (dx || dy) { const W = wall(d, dx, dy, n); out.push(P(W, { fill: col, ...ex }, cls), P(W, { fill: C.shadow, 'fill-opacity': o.ws ?? 0.34, ...ex }, cls)) }
  out.push(P(d, { fill: col, ...ex }, cls))
  if (g >= 0) out.push(P(d, { fill: url(g), ...ex }, cls))
}
const light = (d, w = 0.55, op = 0.6, cls = 'wm-shine') => out.push(P(d, { stroke: C.shine, 'stroke-width': w, 'stroke-opacity': op, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, cls))
const dark = (d, w = 0.55, op = 0.25, cls = 'wm-k') => out.push(P(d, { stroke: C.shadow, 'stroke-width': w, 'stroke-opacity': op, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, cls))
const soft = (d, op = 0.22, cls = 'wm-k', dx = 0.3, dy = 0.4) => out.push(P(mv(d, dx, dy), { fill: C.shadow, 'fill-opacity': op }, cls))
const GRADS = [
  ['linearGradient', { id: id(0), x1: 0, y1: 0, x2: 1, y2: 1 }, [stop(0, 'S', 0.34), stop(0.42, 'S', 0), stop(0.62, 'D', 0), stop(1, 'D', 0.22)]],
  ['radialGradient', { id: id(1), cx: 0.35, cy: 0.3, r: 0.75 }, [stop(0, 'S', 0.5), stop(0.45, 'S', 0), stop(1, 'D', 0.3)]],
  ['linearGradient', { id: id(2), x1: 0, y1: 0, x2: 1, y2: 0 }, [stop(0, 'S', 0.3), stop(0.35, 'S', 0), stop(0.6, 'D', 0), stop(1, 'D', 0.32)]],
]
const defs = () => ['defs', {}, GRADS.map(([t, a, ss]) => [t, a, ss.map(s => stop(s[1].offset, s[1]['stop-color'] === 'S' ? C.shine : C.shadow, s[1]['stop-opacity']))])]
const shadowEll = (x, y, rx, ry) => [[1, 1], [0.8, 0.8], [0.58, 0.58]].forEach(([a, b], i) =>
  out.push(P(ell(x, y, rx * a, ry * b), { fill: C.shadow, 'fill-opacity': [0.06, 0.08, 0.11][i] }, 'wm-shadow')))
Object.assign(C, { c1: v('c1', '#D7261E'), c2: v('c2', '#F4E3C3'), c3: v('c3', '#F4C542'), c4: v('c4', '#8A5A2B'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#1D2130') })

const CX = 11.6, TY = 10.2
const BODY = `M3.6 ${TY}L19.6 ${TY}Q20.9 14.6 19.3 18.4A7.7 2.5 0 0 1 3.9 18.4Q2.3 14.6 3.6 ${TY}Z`
const zig = () => {
  let d = ''
  for (let i = 0; i <= 10; i++) {
    const x = 3.9 + i * 1.58, k = (x - CX) / 8, y = 15.9 + 0.55 * (1 - k * k) + (i % 2 ? 0.55 : -0.55)
    d += (i ? 'L' : 'M') + `${f(x)} ${f(y)}`
  }
  return d
}
const studs = [5.3, 8.4, 11.6, 14.8, 17.9].map(x => { const k = (x - CX) / 8; return [x, 13.1 + 0.7 * (1 - k * k)] })

export default function render() {
  out.length = 0
  shadowEll(11.9, 21.4, 9.4, 1.3)
  // stick: its shade, the wood, the ball tip
  out.push(P('M10.3 5.6L19.8 2.5', { stroke: C.shadow, 'stroke-opacity': 0.25, 'stroke-width': 1.4, 'stroke-linecap': 'round' }, 'wm-a'))
  out.push(P('M9.9 5.1L19.4 2', { stroke: C.c4, 'stroke-width': 1.4, 'stroke-linecap': 'round' }, 'wm-a'))
  out.push(P('M10.4 4.6L19 1.8', { stroke: C.shine, 'stroke-opacity': 0.35, 'stroke-width': 0.4, 'stroke-linecap': 'round' }, 'wm-shine'))
  blk(circ(9.2, 5.6, 1.75), C.c3, { dx: 0.5, dy: 0.5, g: 1, cls: 'wm-a' })
  light('M8.2 5Q8.5 4.3 9.3 4.1', 0.45, 0.85, 'wm-shine')
  // barrel
  out.push(P(BODY, { fill: C.c1 }, 'wm-k'), P(BODY, { fill: url(2) }, 'wm-k'))
  out.push(P(`M3.6 ${TY}L19.6 ${TY}Q20.9 14.6 19.3 18.4L16.6 18.9Q18 14.6 17 ${TY}Z`, { fill: C.shadow, 'fill-opacity': 0.12 }, 'wm-k'))
  // foot ring and zigzag band, studs
  out.push(P('M3.9 18.4A7.7 2.5 0 0 0 19.3 18.4', { stroke: C.c3, 'stroke-width': 1.3, 'stroke-linecap': 'round' }, 'wm-k'))
  out.push(P(zig(), { stroke: C.shadow, 'stroke-opacity': 0.22, 'stroke-width': 1.1, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, 'wm-k'))
  out.push(P(mv(zig(), 0, -0.2), { stroke: C.c3, 'stroke-width': 1, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, 'wm-k'))
  out.push(P(studs.map(([x, y]) => circ(x + 0.15, y + 0.25, 0.8)).join(''), { fill: C.shadow, 'fill-opacity': 0.25 }, 'wm-k'))
  out.push(P(studs.map(([x, y]) => circ(x, y, 0.8)).join(''), { fill: C.c3 }, 'wm-k'))
  out.push(P(studs.map(([x, y]) => circ(x, y, 0.8)).join(''), { fill: url(1) }, 'wm-k'))
  // top: gold rim, then the skin
  out.push(P(ell(CX, TY + 0.5, 8.4, 3), { fill: C.c3 }, 'wm-k'), P(ell(CX, TY + 0.5, 8.4, 3), { fill: C.shadow, 'fill-opacity': 0.3 }, 'wm-k'))
  out.push(P(ell(CX, TY, 8.4, 3), { fill: C.c3 }, 'wm-k'), P(ell(CX, TY, 8.4, 3), { fill: url(0) }, 'wm-k'))
  out.push(P(ell(CX, TY + 0.1, 7, 2.2), { fill: C.c2 }, 'wm-k'), P(ell(CX, TY + 0.1, 7, 2.2), { fill: url(1) }, 'wm-k'))
  out.push(P(`M5.1 ${TY - 0.2}Q7 8.6 ${CX} 8.5`, { stroke: C.shadow, 'stroke-opacity': 0.12, 'stroke-width': 0.6, 'stroke-linecap': 'round' }, 'wm-k'))
  light('M4.2 9.4Q5.8 7.6 8.6 7.4', 0.55, 0.75)
  light('M4.6 12.6Q4.4 14.2 4.8 15.6', 0.55, 0.5)
  return [defs(), ...out]
}
