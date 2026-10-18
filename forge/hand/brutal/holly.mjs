// forge/hand/brutal/holly.mjs — the line holly in brutal: two separate green leaves splayed down and out, each with a
// few blunt spikes, under a cluster of three pink berries, every shape ringed in ink with one hard ink shadow. Replaces
// the generated drawing, where the leaves and berries merged into one black triangle. Roles: leaves c4, berries c2,
// outline + shadow ink. Motion: leaves wm-k, berries wm-a (the spec pulses parts.A about 12 7), shadow wm-shadow.
import { K } from '../../styles/_brutal-core.mjs'

const INK = 'var(--with-brutal-ink, #16130F)', PAPER = 'var(--with-brutal-shine, #FFFDF5)'
const pal = (k, hex) => `var(--with-brutal-${k}, ${hex})`
const C1 = pal('c1', '#FFD23F'), C2 = pal('c2', '#FF6BA8'), C3 = pal('c3', '#4D7CFE'), C4 = pal('c4', '#3DDC97'), ACC = pal('accent', '#FF8A3D')
const W = K.W, S = K.SHIFT, SO = K.SHIFT + K.OFF
const f = n => +n.toFixed(2)
const LJ = { 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }
// shift an absolute M/L/C/Q path by (dx, dy)
const mv = (d, dx, dy) => d.replace(/([MLCQ])([^MLCQZ]*)/g, (m, c, a) => c + a.trim().split(/[\s,]+/).map((v, i) => f(+v + (i % 2 ? dy : dx))).join(' '))
// one shape {d | c:[cx,cy,r], fill, cls, w (line weight, fill none)} drawn at offset (dx, dy)
function put(s, dx, dy, o) {
  const a = { ...o, ...LJ }
  if (s.c) return ['circle', { cx: f(s.c[0] + dx), cy: f(s.c[1] + dy), r: s.c[2], ...a }]
  return ['path', { d: mv(s.d, dx, dy), ...a }]
}
// halo (paper) + hard shadow (ink) + the shapes themselves, each ringed in ink
function build(shapes) {
  const halo = shapes.flatMap(s => [S, SO].map(o => put(s, o, o, { fill: s.w ? 'none' : PAPER, stroke: PAPER, 'stroke-width': f((s.w || W) + 1.8), class: 'wm-shadow' })))
  const shadow = shapes.map(s => put(s, SO, SO, { fill: s.w ? 'none' : INK, stroke: INK, 'stroke-width': s.w || W, class: 'wm-shadow' }))
  const body = shapes.map(s => put(s, S, S, { fill: s.w ? 'none' : s.fill, stroke: INK, 'stroke-width': s.w || W, class: s.cls || 'wm-k' }))
  return [...halo, ...shadow, ...body]
}

// a leaf from base B to tip T; profile = [share of length, half-width] up one side, mirrored down the other
const PROFILE = [[0.2, 3.3], [0.34, 4.1], [0.5, 2.6], [0.68, 3.5], [0.84, 1.7]]
function leaf(B, T) {
  const L = Math.hypot(T[0] - B[0], T[1] - B[1]), u = [(T[0] - B[0]) / L, (T[1] - B[1]) / L], n = [-u[1], u[0]]
  const P = (a, v) => `${f(B[0] + u[0] * a * L + n[0] * v)} ${f(B[1] + u[1] * a * L + n[1] * v)}`
  const side = [...PROFILE].map(([a, v]) => `L${P(a, v)}`)
  const back = [...PROFILE].reverse().map(([a, v]) => `L${P(a, -v)}`)
  return `M${P(0, 0)}${side.join('')}L${P(1, 0)}${back.join('')}Z`
}
const SHAPES = [
  { d: leaf([11, 12.6], [2.4, 17.6]), fill: C4 },
  { d: leaf([13, 12.6], [21.6, 17.6]), fill: C4 },
  { c: [12, 5.4, 2.4], fill: C2, cls: 'wm-a' },
  { c: [9.2, 9.6, 2.4], fill: C2, cls: 'wm-a' },
  { c: [14.8, 9.6, 2.4], fill: C2, cls: 'wm-a' },
]

export default function render() {
  return build(SHAPES)
}
