// forge/hand/christmas/alpana.mjs — an alpana floor design as a clean mandala: a cranberry disc (the floor) painted
// with eight cream lotus petals around a gold seed, gold dots between the petal tips and a pine ring; a small holly
// sprig and snow on the rim. The generated drawing was a busy red blob of curls with candy-corn bits.
import { C } from '../../styles/_christmas-core.mjs'

const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const n = v => Math.round(v * 100) / 100
const disc = (cx, cy, r) => `M${n(cx - r)} ${n(cy)}a${n(r)} ${n(r)} 0 1 0 ${n(2 * r)} 0a${n(r)} ${n(r)} 0 1 0 ${n(-2 * r)} 0z`
const CX = 12, CY = 12.4
const pol = (r, a) => [n(CX + r * Math.sin(a)), n(CY - r * Math.cos(a))]

// one pointed lotus petal at angle a: base radius r0, tip radius r1, half-width w
function petal(a, r0, r1, w) {
  const B = pol(r0, a), T = pol(r1, a)
  const m = (r, s) => { const p = pol(r, a), q = [Math.cos(a), Math.sin(a)]; return [n(p[0] + q[0] * w * s), n(p[1] + q[1] * w * s)] }
  const c1 = m(r0 + (r1 - r0) * 0.28, 1), c2 = m(r0 + (r1 - r0) * 0.78, 0.8)
  const d1 = m(r0 + (r1 - r0) * 0.78, -0.8), d2 = m(r0 + (r1 - r0) * 0.28, -1)
  return `M${B[0]} ${B[1]}C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${T[0]} ${T[1]}C${d1[0]} ${d1[1]} ${d2[0]} ${d2[1]} ${B[0]} ${B[1]}Z`
}

export default function render(icon) {
  const name = icon.name || 'alpana'
  const id = k => `wg-christmas-${name}-${k}`, url = k => `url(#${id(k)})`
  const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
  const K = 8, A = i => (i * 2 * Math.PI) / K
  const PETALS = Array.from({ length: K }, (_, i) => petal(A(i), 2.3, 7.7, 1.9)).join('')
  const DOTS = Array.from({ length: K }, (_, i) => { const [x, y] = pol(8.0, A(i) + Math.PI / K); return disc(x, y, 0.62) }).join('')
  const DISC = disc(CX, CY, 10.2)
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 2, y1: 2, x2: 13, y2: 22.6, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 0.8, x2: 0, y2: 4.4, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    // the floor
    ['path', { d: DISC, fill: C.c1, ...INK, class: 'wm-k' }],
    // the painted rice-paste design: petals, dots, seed
    ['path', { d: PETALS, fill: C.c4, stroke: C.ink, 'stroke-width': 0.45, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: DOTS, fill: C.c3, stroke: C.ink, 'stroke-width': 0.3, class: 'wm-a' }],
    ['path', { d: disc(CX, CY, 2.5), fill: C.c3, ...INK, 'stroke-width': 0.5, class: 'wm-a' }],
    ['path', { d: disc(CX, CY, 1.05), fill: C.c1, stroke: C.ink, 'stroke-width': 0.35, class: 'wm-a' }],
    ['path', { d: DISC, fill: url(0), class: 'wm-shine' }],
    // snow on the crown and a holly sprig
    ['path', { d: 'M7.3 4.2C8.2 1.8 10.2 1 12 1.1C13.8 1 15.8 1.8 16.7 4.2Q16 5.1 15.2 4.4Q14.5 5.4 13.6 4.6Q12.8 5.4 12 4.7Q11.2 5.4 10.4 4.6Q9.5 5.4 8.8 4.4Q8 5.1 7.3 4.2Z', fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: 'M17.9 3.9q-1.2-1-2.4-.1q1.1 1 2.4 .1zM17.9 3.9q1.2-1 2.4-.1q-1.1 1-2.4 .1z', fill: C.c2, stroke: C.ink, 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: disc(17.4, 3.7, 0.5) + disc(18.4, 3.7, 0.5) + disc(17.9, 3.05, 0.5), fill: C.c1, stroke: C.ink, 'stroke-width': 0.28, class: 'wm-deco' }],
  ]
}
