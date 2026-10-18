// forge/hand/retro/package.mjs — one chunky isometric parcel: a plain mustard lid split by a single tape flap, and
// sunset-banded side faces under a clear Y seam; replaces the generated box whose tape and stripe gaps chopped every
// face into chips that turned to noise at 16-24px.
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
  // outline, seam (lid edges + the vertical front edge) and the tape flap over the lid and down the right face
  const ink = F.strokes(lines('M12 2.5 L21 7 V17 L12 21.5 L3 17 V7 Z'), K.W, 1.2)
  F.strokes(lines('M3 7 L12 11.5 L21 7 M12 11.5 V21.5'), K.W, 1.2, ink)
  F.strokes(lines('M7.5 4.75 L16.5 9.25 V12.75'), 2.0, 1.2, ink)
  const sil = F.union(F.region(rings('M12 2.5 L21 7 V17 L12 21.5 L3 17 V7 Z')), F.copy(ink))
  const under = F.offset(F.copy(ink), K.TUCK)
  const face = (d, y0, y1) => {
    const f = F.region(rings(d), 1.2)
    if (y0 != null) F.clipBand(f, y0, y1)
    return F.subtract(f, under)
  }
  const LID = 'M12 2.5 L21 7 L12 11.5 L3 7 Z'
  const LEFT = 'M3 7 L12 11.5 V21.5 L3 17 Z'
  const RIGHT = 'M21 7 L12 11.5 V21.5 L21 17 Z'
  // sunset bands on the side faces, gaps widening toward the bottom (K.GAPS)
  const B = [[0, 12.8, 2], [13.4, 16.1, 3], [16.8, 24, 4]] // final (shifted) coordinates on the 0.1 grid
  const shadow = F.subtract(F.shift(sil, K.OFF, K.OFF, 1.2), F.offset(F.copy(sil), 0.25))
  const out = [node(shadow, paint('shadow'), 'wm-shadow'), node(face(LID), paint(1))]
  for (const [y0, y1, c] of B) {
    const f = F.union(face(LEFT, y0, y1), face(RIGHT, y0, y1))
    out.push(node(f, paint(c)))
  }
  out.push(node(ink, null, null, true))
  return out.filter(Boolean)
}
