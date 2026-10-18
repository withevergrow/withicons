// forge/hand/brutal/poinsettia.mjs — the line poinsettia in brutal: five pointed pink bracts fanned round a yellow
// centre dot, each ringed in ink and layered over the last, with one hard ink shadow. Replaces the generated drawing, a
// spiky black blob with yellow flecks. Roles: bracts c2, centre c1, outline + shadow ink. Motion: bracts wm-k, centre
// wm-s (the spec pulses parts.S about 12 12), shadow wm-shadow.
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

// a lance-shaped bract from the centre outward at angle t (degrees, 0 = up)
function bract(t, r0 = 1, r1 = 9.6, hw = 5.2) {
  const a = t * Math.PI / 180, u = [Math.sin(a), -Math.cos(a)], n = [-u[1], u[0]]
  const P = (r, v) => `${f(12 + u[0] * r + n[0] * v)} ${f(12 + u[1] * r + n[1] * v)}`
  return `M${P(r0, 0)}C${P(r0 + 3.5, hw)} ${P(r1 - 2.5, hw * 0.8)} ${P(r1, 0)}C${P(r1 - 2.5, -hw * 0.8)} ${P(r0 + 3.5, -hw)} ${P(r0, 0)}Z`
}
const SHAPES = [0, 72, 144, 216, 288].map(t => ({ d: bract(t), fill: C2 }))
SHAPES.push({ c: [12, 12, 2.3], fill: C1, cls: 'wm-s' })

export default function render() {
  return build(SHAPES)
}
