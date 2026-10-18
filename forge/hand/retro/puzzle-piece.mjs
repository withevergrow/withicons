// forge/hand/retro/puzzle-piece.mjs — the jigsaw piece from line (a knob up top and on the right, a notch on the
// left) kept whole and bigger so the knobs survive the chunky ink, filled with four sunset bands; replaces the
// generated drawing whose tiny tabs made it read as a striped cake block.
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
  const PIECE = 'M3 11 A2 2 0 0 1 5 9 H7.4 A2.9 2.9 0 1 1 12.6 9 H14 A2 2 0 0 1 16 11 V12.8 A2.8 2.8 0 1 1 16 18 V19.5 A2 2 0 0 1 14 21.5 H5 A2 2 0 0 1 3 19.5 Z'
  const ink = F.strokes(lines(PIECE), K.W, 1.2)
  const sil = F.union(F.region(rings(PIECE), 1.2), F.copy(ink))
  const under = F.offset(F.copy(ink), K.TUCK)
  const body = F.subtract(F.region(rings(PIECE), 1.2), under)
  const B = [[0, 12.0, 1], [12.6, 16.9, 3], [17.5, 24, 4]]
  const shadow = F.subtract(F.shift(sil, K.OFF, K.OFF, 1.2), F.offset(F.copy(sil), 0.25))
  const out = [node(shadow, paint('shadow'), 'wm-shadow')]
  for (const [y0, y1, c] of B) out.push(node(F.clipBand(F.copy(body), y0, y1), paint(c)))
  out.push(node(ink, null, null, true))
  return out.filter(Boolean)
}
