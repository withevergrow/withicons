// forge/hand/retro/battery-full.mjs — the battery from line: a cream cell with its cap on the right and three
// distinct vertical charge bars (mustard / orange / red) inside; replaces the generated drawing whose horizontal
// sunset bands buried the charge bars.
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
  const BODY = 'M4 7 H17 A2 2 0 0 1 19 9 V15 A2 2 0 0 1 17 17 H4 A2 2 0 0 1 2 15 V9 A2 2 0 0 1 4 7 Z'
  const ink = F.strokes(lines(BODY), K.W, 1.2)
  F.strokes(lines('M22 10.6 V13.4'), K.W, 1.2, ink)
  const sil = F.union(F.region(rings(BODY), 1.2), F.copy(ink))
  const under = F.offset(F.copy(ink), K.TUCK)
  const cell = F.subtract(F.region(rings(BODY), 1.2), under)
  const bar = x => F.subtract(F.region(rings('M' + x + ' 9.2 h3.2 v5.6 h-3.2 Z'), 1.2), F.copy(under))
  const shadow = F.subtract(F.shift(sil, K.OFF, K.OFF, 1.2), F.offset(F.copy(sil), 0.25))
  const out = [node(shadow, paint('shadow'), 'wm-shadow'), node(cell, paint('cream'))]
  out.push(node(bar(4.3), paint(1)), node(bar(8.4), paint(2)), node(bar(12.5), paint(3)))
  out.push(node(ink, null, null, true))
  return out.filter(Boolean)
}
