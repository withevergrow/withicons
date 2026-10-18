// forge/hand/retro/frown.mjs — a round face with a mustard crown band, one broad plain orange band that carries the
// two dot eyes and the frown arc, and a teal chin stripe; replaces the generated drawing whose stripe gaps cut
// through the eyes and the mouth.
import * as F from '../../styles/_retro-field.mjs'
import { loopsD, K } from '../../styles/_retro-core.mjs'
import { parsePath } from '../../kernel/geom.mjs'

const HEX = { 1: '#F4B53F', 2: '#EF7D2D', 3: '#DE4B3A', 4: '#178A86', shadow: '#6B3323', cream: '#FBEFD5' }
const paint = k => `var(--with-retro-${k}, ${HEX[k]})`
const mv = pts => pts.map(([x, y]) => [x + K.SHIFT, y + K.SHIFT])
const lines = d => parsePath(d).map(s => ({ pts: mv(s.pts), closed: s.closed }))
const dot = (x, y) => ({ pts: mv([[x, y], [x, y + 0.01]]), closed: false })
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
  const FACE = 'M21.5 12 A9.5 9.5 0 1 1 2.5 12 A9.5 9.5 0 1 1 21.5 12 Z'
  const ink = F.strokes(lines(FACE), K.W, 1.2)
  F.strokes([dot(8.7, 9.4), dot(15.3, 9.4)], K.W, 1.2, ink)
  F.strokes(lines('M8.2 16.6 Q12 12.4 15.8 16.6'), K.W, 1.2, ink)
  const sil = F.union(F.region(rings(FACE), 1.2), F.copy(ink))
  const under = F.offset(F.copy(ink), K.TUCK)
  const body = F.subtract(F.region(rings(FACE), 1.2), under)
  const B = [[0, 6.3, 1], [6.9, 17.5, 2], [18.1, 24, 4]]
  const shadow = F.subtract(F.shift(sil, K.OFF, K.OFF, 1.2), F.offset(F.copy(sil), 0.25))
  const out = [node(shadow, paint('shadow'), 'wm-shadow')]
  for (const [y0, y1, c] of B) out.push(node(F.clipBand(F.copy(body), y0, y1), paint(c)))
  out.push(node(ink, null, null, true))
  return out.filter(Boolean)
}
