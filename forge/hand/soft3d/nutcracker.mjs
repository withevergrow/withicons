// forge/hand/soft3d/nutcracker.mjs — the toy soldier as puffy rounded forms: a tall gold-banded red shako with a gold
// ball on top, a peach face between two dark ear muffs with bright eyes, rosy cheeks and a white handlebar moustache,
// and the block jaw underneath. The generated drawing was a red stacked cube that read as a toy block; this one keeps
// the line design (hat with loop, face, moustache, jaw) and gives each piece the same studio recipe as the generated
// soft3d set: contact shadow, shaded wall to the lower right, shared diagonal light, lit rims on the upper left.
// Roles: hat c1, muffs + eyes c2, gold c3, skin c4, moustache edge. Motion: body wm-k, ball wm-a, shadow, speculars.
const N = 'nutcracker'
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
Object.assign(C, { c1: v('c1', '#C8102E'), c2: v('c2', '#1C1C28'), c3: v('c3', '#E2B13C'), c4: v('c4', '#F2D2B6'), edge: v('edge', '#FFFFFF'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#1D2130') })

const HAT = 'M8.6 4.2L15.4 4.2Q16.2 4.2 16.3 5L17.2 9.5Q17.4 10.5 16.5 10.5L7.5 10.5Q6.6 10.5 6.8 9.5L7.7 5Q7.8 4.2 8.6 4.2Z'
const FACE = rr(7, 10.2, 10, 8, 3)
const BAND = rr(5.9, 8.9, 12.2, 2.3, 1.15)
const JAW = rr(9.1, 16.6, 5.8, 3.9, 1.1)
const MOUS_L = 'M12 14.9Q11 14 9.6 14.3Q8.2 14.6 8.3 15.7Q8.5 16.6 9.5 16.3Q10.4 16 10.9 15.9Q11.7 15.9 12 15.5Z'
const MOUS_R = 'M12 14.9Q13 14 14.4 14.3Q15.8 14.6 15.7 15.7Q15.5 16.6 14.5 16.3Q13.6 16 13.1 15.9Q12.3 15.9 12 15.5Z'

export default function render() {
  out.length = 0
  shadowEll(12.4, 21.3, 8.6, 1.3)
  // gold ball on the top
  blk(circ(12, 3.3, 1.6), C.c3, { dx: 0.6, dy: 0.6, g: 1, cls: 'wm-a' })
  // ear muffs
  blk(circ(7, 14, 2), C.c2, { dx: 0.6, dy: 0.6, g: 1 })
  blk(circ(17, 14, 2), C.c2, { dx: 0.6, dy: 0.6, g: 1 })
  // jaw block
  blk(JAW, C.c4, { dx: 0.7, dy: 0.7 })
  out.push(P(JAW, { fill: C.shadow, 'fill-opacity': 0.1 }, 'wm-k'))
  // hat
  blk(HAT, C.c1, { dx: 0.8, dy: 0.8 })
  // face
  blk(FACE, C.c4, { dx: 0.8, dy: 0.8 })
  // hat band
  blk(BAND, C.c3, { dx: 0.7, dy: 0.7, g: 1 })
  // cheeks, eyes
  out.push(P(circ(8.7, 15, 1.15), { fill: C.c1, 'fill-opacity': 0.32 }, 'wm-k'), P(circ(15.3, 15, 1.15), { fill: C.c1, 'fill-opacity': 0.32 }, 'wm-k'))
  out.push(P(circ(9.6, 12.8, 1), { fill: C.c2 }, 'wm-k'), P(circ(14.4, 12.8, 1), { fill: C.c2 }, 'wm-k'))
  // moustache
  soft(MOUS_L + MOUS_R, 0.22)
  blk(MOUS_L + MOUS_R, C.edge, { dx: 0, dy: 0, g: 1 })
  // mouth line on the jaw
  dark('M12 17.6L12 19.6', 0.5, 0.45)
  dark('M9.9 17.9L14.1 17.9', 0.4, 0.2)
  light('M9.2 12.4L9.5 12.1M14 12.4L14.3 12.1', 0.4, 0.85)
  // lights
  light('M8.6 5.6L7.9 9', 0.55, 0.55)
  light('M10.9 2.7Q11.4 2.1 12.1 2.1', 0.5, 0.8, 'wm-a')
  light('M7.6 11.2Q7.9 10.6 9 10.6', 0.5, 0.5)
  light('M9.9 17.1Q10.4 16.9 11.2 16.9', 0.45, 0.5)
  dark('M16.9 11.6L16.9 15', 0.5, 0.14)
  return [defs(), ...out]
}
