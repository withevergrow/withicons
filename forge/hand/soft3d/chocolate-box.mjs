// forge/hand/soft3d/chocolate-box.mjs — a heart-shaped box seen straight on: a red satin heart with a pink tray
// inside and five round chocolates in the line layout (three across the top, two below), the top middle one in gold
// foil. The generated drawing was an angled open box with a few gems that lost the dot pattern; this one is the line
// design (heart with five round pieces) in the studio recipe of the soft3d set: contact shadow, shaded wall to the
// lower right, shared diagonal light, lit rims on the upper left.
// Roles: box c1, chocolate c2, gold foil c3, tray c4. Motion: box wm-k, chocolates wm-a, shadow, speculars.
const N = 'chocolate-box'
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
Object.assign(C, { c1: v('c1', '#C8102E'), c2: v('c2', '#5A3220'), c3: v('c3', '#E8B53A'), c4: v('c4', '#F7B2BD'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#1D2130') })

const HEART = 'M12 20.4C5.2 15.8 3 12.4 3 8.4C3 5.6 5 3.6 7.6 3.6C9.6 3.6 11.2 4.6 12 6.2C12.8 4.6 14.4 3.6 16.4 3.6C19 3.6 21 5.6 21 8.4C21 12.4 18.8 15.8 12 20.4Z'
const TRAY = about(HEART, 0.76, 12, 11.4)
const PIECES = [[8.4, 8.6, 'c2'], [12, 9.6, 'c3'], [15.6, 8.6, 'c2'], [9.9, 13.2, 'c2'], [14.1, 13.2, 'c2']]

export default function render() {
  out.length = 0
  shadowEll(12.4, 21.4, 9, 1.2)
  blk(HEART, C.c1, { dx: 0.9, dy: 0.9, n: 4 })
  // satin sheen on the box rim
  light('M3.8 9.2C3.8 6.4 5.3 4.6 7.6 4.5', 0.6, 0.65)
  dark('M20.4 9.4C20.2 12.6 17.8 15.8 12.4 19.6', 0.55, 0.16)
  // tray: recessed, lit from the upper left
  out.push(P(mv(TRAY, 0, 0.35), { fill: C.shine, 'fill-opacity': 0.3 }, 'wm-k'))
  out.push(P(TRAY, { fill: C.c4 }, 'wm-k'), P(TRAY, { fill: C.shadow, 'fill-opacity': 0.1 }, 'wm-k'))
  out.push(P(TRAY, { fill: url(0) }, 'wm-k'))
  dark('M5.5 8.2C5.5 6.8 6.4 5.9 7.6 5.9', 0.5, 0.2)
  // chocolates: shade, round body, bright light
  for (const [x, y, r] of PIECES) {
    out.push(P(circ(x + 0.25, y + 0.4, 1.65), { fill: C.shadow, 'fill-opacity': 0.3 }, 'wm-a'))
    out.push(P(circ(x, y, 1.65), { fill: C[r] }, 'wm-a'), P(circ(x, y, 1.65), { fill: url(1) }, 'wm-a'))
  }
  out.push(P('M7.5 8.2Q7.8 7.6 8.6 7.6M14.7 8.2Q15 7.6 15.8 7.6M9.1 12.8Q9.4 12.2 10.2 12.2M13.3 12.8Q13.6 12.2 14.4 12.2', { stroke: C.shine, 'stroke-width': 0.45, 'stroke-opacity': 0.8, 'stroke-linecap': 'round' }, 'wm-shine'))
  out.push(P('M11.2 9Q11.5 8.4 12.3 8.4', { stroke: C.shine, 'stroke-width': 0.45, 'stroke-opacity': 0.95, 'stroke-linecap': 'round' }, 'wm-shine'))
  return [defs(), ...out]
}
