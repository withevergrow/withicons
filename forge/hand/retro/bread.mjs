// forge/hand/retro/bread.mjs — the domed loaf with its three scored slashes: a mustard crust with a single orange band
// at the base (no stripes, so it no longer reads as a burger), ink outline, ink slashes and one offset shadow.
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

export default function render() {
  F.setClip(null)
  const LOAF = 'M4.5 20 H19.5 A2 2 0 0 0 21.5 18 V13.5 C21.5 8 17.5 4.5 12 4.5 C6.5 4.5 2.5 8 2.5 13.5 V18 A2 2 0 0 0 4.5 20 Z'
  const ink = F.strokes(lines(LOAF), K.W, 1.2)
  const slashes = F.strokes(lines('M6.7 13.6 L8.7 10 M11 13.2 L13 9.6 M15.3 13.6 L17.3 10'), 1.9, 1.2)
  const sil = F.union(F.region(rings(LOAF), 1.2), F.copy(ink))
  const under = F.offset(F.copy(ink), K.TUCK)
  const crust = F.subtract(F.region(rings(LOAF), 1.2), under)
  const base = F.copy(crust)
  F.clipBand(base, 16.6, 24)
  const shadow = F.subtract(F.shift(sil, K.OFF, K.OFF, 1.2), F.offset(F.copy(sil), 0.25))
  return [
    node(shadow, paint('shadow'), 'wm-shadow'),
    node(crust, paint(1)),
    node(base, paint(2)),
    node(F.union(ink, slashes), null, null, true),
  ].filter(Boolean)
}
