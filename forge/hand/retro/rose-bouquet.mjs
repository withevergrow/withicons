// forge/hand/retro/rose-bouquet.mjs — three red roses with cream swirls over a mustard and orange paper cone, teal
// leaves and every part separated by its own ink instead of one black silhouette; replaces the generated
// bouquet whose heavy ink swallowed the swirls and the wrap.
import * as F from '../../styles/_retro-field.mjs'
import { loopsD, K } from '../../styles/_retro-core.mjs'
import { parsePath } from '../../kernel/geom.mjs'

const HEX = { 1: '#F4B53F', 2: '#EF7D2D', 3: '#DE4B3A', 4: '#178A86', cream: '#FFF3D9', shadow: '#6B3323' }
const paint = k => `var(--with-retro-${k}, ${HEX[k]})`
const mv = pts => pts.map(([x, y]) => [x + K.SHIFT, y + K.SHIFT])
const lines = d => parsePath(d).map(s => ({ pts: mv(s.pts), closed: s.closed }))
const rings = d => parsePath(d).map(s => mv(s.pts))
const node = (Fd, fill, cls, ink = false) => {
  const d = loopsD(F.trace(Fd, ink ? K.TOL : K.TOL_C, ink ? 0.15 : 0.3), ink ? 2 : 1)
  if (!d) return null
  const a = { d, 'fill-rule': 'evenodd' }
  if (fill) a.fill = fill
  if (cls) a.class = cls
  return ['path', a]
}
const circ = (x, y, r) => `M${x + r} ${y} A${r} ${r} 0 1 1 ${x - r} ${y} A${r} ${r} 0 1 1 ${x + r} ${y} Z`
// a cream swirl: 1.3 turns from the middle outwards
const swirl = (cx, cy) => {
  const pts = []
  for (let i = 0; i <= 26; i++) {
    const t = i / 26, a = t * 1.25 * 2 * Math.PI + 0.6, r = 0.2 + t * 1.5
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`)
  }
  return 'M' + pts.join(' L')
}

const RW = 1.7 // rose / leaf ink
const R = 3.3
const TOP = [12, 5.6], LEFT = [7.4, 10.1], RIGHT = [16.6, 10.1]
const CONE = 'M6.4 9 H17.6 L13.6 21.7 H10.4 Z'
const L_LEAF = 'M8.2 15.2 C5.6 13.6 2.4 15 2.2 19 C5.6 19.8 8.8 18.4 8.2 15.2 Z'
const R_LEAF = 'M15.8 15.2 C18.4 13.6 21.6 15 21.8 19 C18.4 19.8 15.2 18.4 15.8 15.2 Z'

export default function render() {
  F.setClip(null)
  const M = 2.6
  const reg = d => F.region(rings(d), M)
  const roseD = c => circ(c[0], c[1], R)
  const roseRegs = [reg(roseD(TOP)), reg(roseD(LEFT)), reg(roseD(RIGHT))]
  const coneR = reg(CONE)
  const leafR = [reg(L_LEAF), reg(R_LEAF)]
  // back to front: leaves, cone, top rose, side roses
  const layers = [
    { d: L_LEAF, r: leafR[0], w: RW * 0.85 }, { d: R_LEAF, r: leafR[1], w: RW * 0.85 },
    { d: CONE, r: coneR, w: RW * 1.1 },
    { d: roseD(TOP), r: roseRegs[0], w: RW }, { d: roseD(LEFT), r: roseRegs[1], w: RW }, { d: roseD(RIGHT), r: roseRegs[2], w: RW },
  ]
  const cut = F.field(2.6)
  const inks = layers.map(l => F.strokes(lines(l.d), l.w, 1.2))
  // each layer loses what the layers in front of it cover
  const colour = layers.map(l => F.copy(l.r))
  for (let i = layers.length - 1; i >= 0; i--) {
    for (let j = 0; j < i; j++) { F.subtract(inks[j], layers[i].r); F.subtract(colour[j], layers[i].r) }
  }
  void cut
  const ink = inks.reduce((a, b) => F.union(a, b))
  const sil = F.copy(ink)
  for (const l of layers) F.union(sil, l.r)
  const under = F.offset(F.copy(ink), K.TUCK)
  const shadow = F.subtract(F.shift(sil, K.OFF, K.OFF, 1.2), F.offset(F.copy(sil), 0.25))
  const out = [node(shadow, paint('shadow'), 'wm-shadow')]
  const col = i => F.subtract(colour[i], under)
  out.push(node(F.union(col(0), col(1)), paint(4)))
  const cone = col(2)
  out.push(node(F.clipBand(F.copy(cone), 0, 16.8), paint(1)))
  out.push(node(F.clipBand(F.copy(cone), 17.4, 24), paint(2)))
  const roses = F.union(F.union(col(3), col(4)), col(5))
  out.push(node(roses, paint(3)))
  const sw = F.strokes([TOP, LEFT, RIGHT].flatMap(c => lines(swirl(c[0], c[1]))), 0.8, 1.2)
  out.push(node(sw, paint('cream'), 'wm-deco'))
  out.push(node(ink, null, null, true))
  return out.filter(Boolean)
}
