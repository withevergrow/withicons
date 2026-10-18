// forge/hand/soft3d/lion-head.mjs — the lunar-new-year lion as a puffy toy: a scalloped red mane, a round golden face
// with a white leaf tuft, two big round eyes, a little red heart nose and a wide open smile with a pink tongue. The
// generated drawing was teal rings and a grey nose disc that read as a robot; this one follows the line design (round
// mane, two round eyes, heart nose, wide open smile) in the studio recipe of the soft3d set: contact shadow, shaded
// wall to the lower right, shared diagonal light, lit rims on the upper left.
// Roles: mane c1, face c2, tuft + eyes c3, pupils + mouth c4. Motion: mane/face wm-k, tuft wm-a, shadow, speculars.
const N = 'lion-head'
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
Object.assign(C, { c1: v('c1', '#D7261E'), c2: v('c2', '#FFC93C'), c3: v('c3', '#FFFFFF'), c4: v('c4', '#1F1F1F'), pink: v('accent', '#FF8FA0'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#1D2130') })

// scalloped mane: arcs between valley points, clockwise
function mane(cx, cy, Rv, nb, rb) {
  let d = ''
  for (let i = 0; i <= nb; i++) {
    const t = (i + 0.5) / nb * Math.PI * 2 - Math.PI / 2
    d += (i ? `A${rb} ${rb} 0 0 1 ` : 'M') + `${f(cx + Rv * Math.cos(t))} ${f(cy + Rv * Math.sin(t))}`
  }
  return d + 'Z'
}
const CX = 11.8, CY = 11.6
const MANE = mane(CX, CY, 7.4, 10, 2.4)
const FACE = circ(CX, CY + 0.6, 6.6)
const TUFT = 'M11.8 2.9Q14.2 4.9 13.7 6.9Q11.8 8 9.9 6.9Q9.4 4.9 11.8 2.9Z'
const NOSE = 'M11.8 14.1C10.2 13.1 10.2 11.5 11.1 11.3C11.5 11.2 11.7 11.5 11.8 11.8C11.9 11.5 12.1 11.2 12.5 11.3C13.4 11.5 13.4 13.1 11.8 14.1Z'
const MOUTH = 'M7.9 14.7L15.7 14.7Q15.7 19.3 11.8 19.3Q7.9 19.3 7.9 14.7Z'

export default function render() {
  out.length = 0
  shadowEll(12.2, 21.3, 8.6, 1.2)
  blk(MANE, C.c1, { dx: 0.8, dy: 0.8, g: 1 })
  blk(FACE, C.c2, { dx: 0.5, dy: 0.5, g: 1 })
  blk(TUFT, C.c3, { dx: 0.5, dy: 0.5, g: 0, cls: 'wm-a' })
  // eyes
  for (const x of [9.1, 14.5]) {
    out.push(P(circ(x, 9.8, 1.75), { fill: C.shadow, 'fill-opacity': 0.18 }, 'wm-k'))
    out.push(P(circ(x, 9.6, 1.75), { fill: C.c3 }, 'wm-k'), P(circ(x, 9.6, 1.75), { fill: url(1) }, 'wm-k'))
    out.push(P(circ(x + 0.1, 9.8, 0.95), { fill: C.c4 }, 'wm-k'))
  }
  light('M8.5 9.4L8.9 9M13.9 9.4L14.3 9', 0.4, 0.9)
  // heart nose
  out.push(P(mv(NOSE, 0.2, 0.3), { fill: C.shadow, 'fill-opacity': 0.25 }, 'wm-k'))
  out.push(P(NOSE, { fill: C.c1 }, 'wm-k'), P(NOSE, { fill: url(1) }, 'wm-k'))
  // open smile
  out.push(P(MOUTH, { fill: C.c4 }, 'wm-k'))
  out.push(P('M9.2 18.1Q11.8 16 14.4 18.1Q13.4 19 11.8 19Q10.2 19 9.2 18.1Z', { fill: C.pink }, 'wm-k'))
  out.push(P('M8.3 14.7L15.3 14.7', { stroke: C.c3, 'stroke-width': 0.9, 'stroke-linecap': 'round' }, 'wm-k'))
  // lights
  light('M5.3 9Q6 6 8.6 4.3', 0.7, 0.55)
  light('M6.2 12.2Q6.2 10.6 7 9.4', 0.5, 0.5)
  light('M10.6 3.9Q11.2 3.4 11.9 3.5', 0.45, 0.85, 'wm-a')
  dark('M18 14Q17.4 17 14.6 18.6', 0.6, 0.16)
  return [defs(), ...out]
}
