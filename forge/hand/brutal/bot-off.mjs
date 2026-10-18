// forge/hand/brutal/bot-off.mjs — the line design in brutal: a square robot head (blue ears, orange antenna ball, two ink
// eyes set either side of the slash) ringed in ink with one hard ink shadow, struck through by a paper-gapped ink slash.
// Replaces the generated drawing, where the shadow and slash fused into a heavy black mass with a scribbled antenna.
// Roles: head c1, ears c3, ball accent, outline + shadow ink. Motion: head wm-k, slash wm-s (pulse), shadow wm-shadow.
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
  { d: 'M3.3 11.6 L3.3 15', w: 2.2 },
  { d: 'M20.7 11.6 L20.7 15', w: 2.2 },
  { d: 'M12 8.2 L12 5.2', w: 2.2 },
  { c: [12, 4, 1.8], fill: ACC },
  { d: 'M8 8.2 L16 8.2 Q19.4 8.2 19.4 11.6 L19.4 17.2 Q19.4 20.6 16 20.6 L8 20.6 Q4.6 20.6 4.6 17.2 L4.6 11.6 Q4.6 8.2 8 8.2 Z', fill: C1 },
]
const slash = (stroke, w, cls) => ['path', { d: mv('M3.6 3.6 L20.4 20.4', S, S), fill: 'none', stroke, 'stroke-width': w, ...LJ, class: cls }]

export default function render() {
  return [
    ...build(SHAPES),
    ...[[7.7, 13.8], [16.4, 10.9]].map(([x, y]) => ['circle', { cx: f(x + S), cy: f(y + S), r: 1.3, fill: INK, class: 'wm-k' }]),
    slash(PAPER, 4.8, 'wm-s'),
    slash(INK, 2.4, 'wm-s'),
  ]
}
