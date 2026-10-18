// forge/hand/retro/smile-plus.mjs — a face in two clean tone bands (one gap, above the mouth, so no stripe crosses an eye
// or the smile) with ink eyes and grin on top, and a teal plus badge with a cream cross; replaces the generated face
// whose stripe gaps sliced through the features and whose plus read as a stray mark.
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

const FACE = circ(10, 14, 7.3)
const BADGE = circ(19.4, 4.6, 3.1)

export default function render() {
  F.setClip(null)
  const ink = F.strokes(lines(FACE), K.W, 1.2)
  F.strokes(lines('M7.7 10.4 V11.3 M12.3 10.4 V11.3'), 1.8, 1.2, ink)
  F.strokes(lines('M6.9 15.7 A3.9 3.9 0 0 0 13.1 15.7'), 1.9, 1.2, ink)
  const badgeInk = F.strokes(lines(BADGE), 1.7, 1.2)
  const sil = F.union(F.union(F.region(rings(FACE), 1.2), F.copy(ink)), F.union(F.region(rings(BADGE), 1.2), F.copy(badgeInk)))
  const under = F.offset(F.copy(ink), K.TUCK)
  const bUnder = F.offset(F.copy(badgeInk), K.TUCK)
  const shadow = F.subtract(F.shift(sil, K.OFF, K.OFF, 1.2), F.offset(F.copy(sil), 0.25))
  const out = [node(shadow, paint('shadow'), 'wm-shadow')]
  const face = F.subtract(F.region(rings(FACE), 1.2), under)
  out.push(node(F.clipBand(F.copy(face), 0, 12.7), paint(1)))
  out.push(node(F.clipBand(F.copy(face), 13.3, 24), paint(2)))
  out.push(node(ink, null, null, true))
  const disc = F.subtract(F.region(rings(BADGE), 1.2), bUnder)
  out.push(node(disc, paint(4), 'wm-s'))
  const plus = F.strokes(lines('M19.4 3.1 V6.1 M17.9 4.6 H20.9'), 1.2, 1.2)
  out.push(node(plus, paint('cream'), 'wm-s'))
  out.push(node(badgeInk, null, 'wm-s', true))
  return out.filter(Boolean)
}
