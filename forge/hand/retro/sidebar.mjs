// forge/hand/retro/sidebar.mjs — a window frame with a wider left rail banded in three sunset stripes (they read as
// nav rows) and a clean, shadow-free main pane; replaces the generated drawing whose four thin rail stripes and
// shadow leaking into the pane made the divider look doubled and the panel shape weak at 16-24px.
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
  const FRAME = 'M5.5 3 H18.5 A2.5 2.5 0 0 1 21 5.5 V18.5 A2.5 2.5 0 0 1 18.5 21 H5.5 A2.5 2.5 0 0 1 3 18.5 V5.5 A2.5 2.5 0 0 1 5.5 3 Z'
  const ink = F.strokes(lines(FRAME), K.W, 1.2)
  F.strokes(lines('M9.75 3 V21'), K.W, 1.2, ink)
  F.strokes(lines('M13 8 H18 M13 11.5 H16.5 M13 15 H17.5'), K.W * 0.75, 1.2, ink)
  const sil = F.union(F.region(rings(FRAME), 1.2), F.copy(ink))
  const under = F.offset(F.copy(ink), K.TUCK)
  const rail = F.subtract(F.region(rings('M5.5 3 H9.75 V21 H5.5 A2.5 2.5 0 0 1 3 18.5 V5.5 A2.5 2.5 0 0 1 5.5 3 Z'), 1.2), under)
  // three rail stripes, top to bottom mustard / orange / teal, gaps widening downward
  const B = [[0, 8.2, 1], [8.8, 13.2, 2], [13.9, 24, 4]] // final (shifted) coordinates on the 0.1 grid
  const shadow = F.subtract(F.shift(sil, K.OFF, K.OFF, 1.2), F.offset(F.copy(sil), 0.25))
  const pane = F.subtract(F.region(rings('M9.75 3 H18.5 A2.5 2.5 0 0 1 21 5.5 V18.5 A2.5 2.5 0 0 1 18.5 21 H9.75 Z'), 1.2), F.offset(F.copy(ink), K.TUCK))
  const out = [node(shadow, paint('shadow'), 'wm-shadow'), node(pane, paint('cream'))]
  for (const [y0, y1, c] of B) out.push(node(F.clipBand(F.copy(rail), y0, y1), paint(c)))
  out.push(node(ink, null, null, true))
  return out.filter(Boolean)
}
