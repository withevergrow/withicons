// forge/hand/brutal/rose.mjs — the line rose in brutal: a pink cup-shaped bud with a scalloped crown and an ink spiral
// heart, on a stem with a green leaf either side, every shape ringed in ink with one hard ink shadow. Replaces the
// generated drawing, where bud, spiral and leaves ran together into one black blob. Roles: bud c2, leaves c4, outline +
// spiral + shadow ink. Motion: bud and stem wm-k, leaves wm-a (the spec sways parts.A about 12 21.5), shadow wm-shadow.
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

const SHAPES = [
  { d: 'M12 13 L12 20.8', w: 2.2 },
  { d: 'M12 19.4 C8 19.8 4.6 17.8 3.8 14.2 C8 13.8 11.4 15.6 12 19.4 Z', fill: C4, cls: 'wm-a' },
  { d: 'M12 17.2 C16 17.6 19.4 16 20.2 12.9 C16 12.5 12.6 14.2 12 17.2 Z', fill: C4, cls: 'wm-a' },
  { d: 'M12 13.4 C8.5 13.4 6.4 11 6.4 7.8 C6.4 6.2 6.9 4.9 7.8 3.9 C9 4.6 10.2 4.3 11.2 3.1 C12.7 2.9 14 3.4 14.8 4.3 C15.5 4.1 16.3 3.8 17.1 3.6 C17.6 4.8 17.6 6.3 17.6 7.8 C17.6 11 15.5 13.4 12 13.4 Z', fill: C2 },
]
const SPIRAL = 'M9.4 7.2 C10 5.2 13.6 5 14.5 7.3 C15.2 9.6 12.4 11.2 10.8 9.6 C9.6 8.4 10.9 6.9 12.3 7.7'

export default function render() {
  return [
    ...build(SHAPES),
    ['path', { d: mv(SPIRAL, S, S), fill: 'none', stroke: INK, 'stroke-width': 1.5, ...LJ, class: 'wm-k' }],
  ]
}
