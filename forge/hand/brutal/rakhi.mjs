// forge/hand/brutal/rakhi.mjs — the line rakhi in brutal: a yellow thread band running lower left to upper right, a blue
// end-cap at each end, and a pink round medallion on the middle with an orange jewel. Everything is ringed in
// ink with one hard ink shadow; the band is light so the flower and caps read on dark. Replaces the generated drawing.
// Roles: band c1, caps c3, flower c2, jewel accent, outline + shadow ink. Motion: band, caps, flower wm-k, jewel wm-s
// (the spec twinkles parts.S), shadow wm-shadow.
import { K } from '../../styles/_brutal-core.mjs'

const INK = 'var(--with-brutal-ink, #16130F)', PAPER = 'var(--with-brutal-shine, #FFFDF5)'
const pal = (k, hex) => `var(--with-brutal-${k}, ${hex})`
const C1 = pal('c1', '#FFD23F'), C2 = pal('c2', '#FF6BA8'), C3 = pal('c3', '#4D7CFE'), ACC = pal('accent', '#FF8A3D')
const W = K.W, S = K.SHIFT, SO = K.SHIFT + K.OFF
const f = n => +n.toFixed(2)
const LJ = { 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }

// diagonal frame: r runs along the band (lower left to upper right), v across it
const P = (r, v) => `${f(12 + 0.7071 * r + 0.7071 * v)} ${f(12 - 0.7071 * r + 0.7071 * v)}`
const rect = (a, b, h) => `M${P(a, -h)}L${P(b, -h)}L${P(b, h)}L${P(a, h)}Z`
const mv = (d, dx, dy) => d.replace(/([MLCQ])([^MLCQZ]*)/g, (m, c, a) => c + a.trim().split(/[\s,]+/).map((v, i) => f(+v + (i % 2 ? dy : dx))).join(' '))
function put(s, dx, dy, o) {
  const a = { ...o, ...LJ }
  if (s.c) return ['circle', { cx: f(s.c[0] + dx), cy: f(s.c[1] + dy), r: s.c[2], ...a }]
  return ['path', { d: mv(s.d, dx, dy), ...a }]
}

const BAND = { d: rect(-10.2, 10.2, 3.8), fill: C1 }
const FLOWER = { c: [12, 12, 4.2], fill: C2 }
const SIL = [BAND, FLOWER]
// blue end-caps sit inside the band's ink rim (no ring of their own), parted from the thread by one ink line
const CAP = (a, b) => ({ d: rect(a, b, 2.7), fill: C3 })
const DIV = r => ({ d: `M${P(r, -3.8)}L${P(r, 3.8)}`, w: 1.3 })

export default function render() {
  const halo = SIL.flatMap(s => [S, SO].map(o => put(s, o, o, { fill: PAPER, stroke: PAPER, 'stroke-width': f(W + 1.8), class: 'wm-shadow' })))
  const shadow = SIL.map(s => put(s, SO, SO, { fill: INK, stroke: INK, 'stroke-width': W, class: 'wm-shadow' }))
  return [
    ...halo,
    ...shadow,
    put(BAND, S, S, { fill: C1, stroke: INK, 'stroke-width': W, class: 'wm-k' }),
    put(CAP(7.9, 9.1), S, S, { fill: C3, stroke: 'none', class: 'wm-k' }),
    put(CAP(-9.1, -7.9), S, S, { fill: C3, stroke: 'none', class: 'wm-k' }),
    put(DIV(7.5), S, S, { fill: 'none', stroke: INK, 'stroke-width': 1.3, class: 'wm-k' }),
    put(DIV(-7.5), S, S, { fill: 'none', stroke: INK, 'stroke-width': 1.3, class: 'wm-k' }),
    put(FLOWER, S, S, { fill: C2, stroke: INK, 'stroke-width': W, class: 'wm-k' }),
    put({ c: [12, 12, 1.2] }, S, S, { fill: ACC, stroke: INK, 'stroke-width': 1, class: 'wm-s' }),
  ]
}
