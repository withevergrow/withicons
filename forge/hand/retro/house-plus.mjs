// forge/hand/retro/house-plus.mjs — the house from line (roof chevron, walls) with the sunset bands confined to
// the body fill and a bold ink plus drawn on top, so no stripe gap cuts across it; replaces the generated drawing
// whose stripes hid the plus.
import * as F from '../../styles/_retro-field.mjs'
import { loopsD, K } from '../../styles/_retro-core.mjs'
import { parsePath } from '../../kernel/geom.mjs'

const HEX = { 1: '#F4B53F', 2: '#EF7D2D', 3: '#DE4B3A', 4: '#178A86', shadow: '#6B3323', cream: '#FBEFD5' }
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
  const FILL = 'M5 9.6 L12 4.1 L19 9.6 V19 A2 2 0 0 1 17 21 H7 A2 2 0 0 1 5 19 Z'
  const ink = F.strokes(lines('M2.5 11 L12 3.5 L21.5 11'), K.W, 1.2)
  F.strokes(lines('M5 9.5 V19 A2 2 0 0 0 7 21 H17 A2 2 0 0 0 19 19 V9.5'), K.W, 1.2, ink)
  F.strokes(lines('M12 11.9 V18.1 M8.9 15 H15.1'), K.W, 1.2, ink)
  const sil = F.union(F.region(rings(FILL), 1.2), F.copy(ink))
  const under = F.offset(F.copy(ink), K.TUCK)
  const body = F.subtract(F.region(rings(FILL), 1.2), under)
  const B = [[0, 9.4, 1], [10.0, 13.6, 2], [14.2, 17.0, 3], [17.6, 24, 4]]
  const shadow = F.subtract(F.shift(sil, K.OFF, K.OFF, 1.2), F.offset(F.copy(sil), 0.25))
  const out = [node(shadow, paint('shadow'), 'wm-shadow')]
  for (const [y0, y1, c] of B) out.push(node(F.clipBand(F.copy(body), y0, y1), paint(c)))
  out.push(node(ink, null, null, true))
  return out.filter(Boolean)
}
