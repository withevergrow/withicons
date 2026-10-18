// forge/hand/retro/dices.mjs — two dice, the front one (diagonal pair of pips) over the back one (single pip), each in
// two sunset tone bands whose gap sits clear of every pip so the bands read as shading only; replaces the generated
// pair where stripes replaced the pips and the dice read as striped boxes.
import * as F from '../../styles/_retro-field.mjs'
import { loopsD, K } from '../../styles/_retro-core.mjs'
import { parsePath } from '../../kernel/geom.mjs'

const HEX = { 1: '#F4B53F', 2: '#EF7D2D', 3: '#DE4B3A', 4: '#178A86', shadow: '#6B3323' }
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
const sq = (x0, y0, x1, y1, r) => `M${x0 + r} ${y0} H${x1 - r} A${r} ${r} 0 0 1 ${x1} ${y0 + r} V${y1 - r} A${r} ${r} 0 0 1 ${x1 - r} ${y1} H${x0 + r} A${r} ${r} 0 0 1 ${x0} ${y1 - r} V${y0 + r} A${r} ${r} 0 0 1 ${x0 + r} ${y0} Z`

const BACK = sq(10.5, 3, 21, 13.5, 2.2)
const FRONT = sq(3, 10.5, 13.5, 21, 2.2)

export default function render() {
  F.setClip(null)
  const frontR = F.region(rings(FRONT), 2.5)
  // the back die is hidden behind the front one, with a clear gap between their outlines
  const moat = F.offset(F.copy(frontR), -(K.W / 2 + 0.55))
  const inkB = F.strokes(lines(BACK), K.W, 1.2)
  F.subtract(inkB, moat)
  const inkF = F.strokes(lines(FRONT), K.W, 1.2)
  const pipsB = F.strokes(lines('M17.6 6.6 V6.7'), 2.3, 1.2)
  const pipsF = F.strokes(lines('M6.9 13.9 V14 M10.1 17.1 V17.2'), 2.3, 1.2)
  const ink = F.union(F.union(inkB, inkF), F.union(pipsB, pipsF))
  const sil = F.union(F.union(F.subtract(F.region(rings(BACK), 1.2), moat), frontR), F.copy(ink))
  const under = F.offset(F.copy(ink), K.TUCK)
  const shadow = F.subtract(F.shift(sil, K.OFF, K.OFF, 1.2), F.offset(F.copy(sil), 0.25))
  const out = [node(shadow, paint('shadow'), 'wm-shadow')]
  const back = F.subtract(F.subtract(F.region(rings(BACK), 1.2), moat), under)
  const front = F.subtract(F.copy(frontR), under)
  out.push(node(F.clipBand(F.copy(back), 0, 8.6), paint(1)))
  out.push(node(F.clipBand(F.copy(back), 9.2, 24), paint(2)))
  out.push(node(F.clipBand(F.copy(front), 0, 14.7), paint(1)))
  out.push(node(F.clipBand(F.copy(front), 15.3, 24), paint(2)))
  out.push(node(ink, null, null, true))
  return out.filter(Boolean)
}
