// forge/hand/retro/spider.mjs — the line spider with retro colour: a coral abdomen under a mustard head, four plain ink
// legs a side, the thread, and one offset shadow; replaces the generated spider whose striped belly, tucked legs and
// stacked shadows chopped the silhouette into chips.
import * as F from '../../styles/_retro-field.mjs'
import { loopsD, K } from '../../styles/_retro-core.mjs'

const HEX = { 1: '#F4B53F', 2: '#EF7D2D', 3: '#DE4B3A', 4: '#178A86', shadow: '#6B3323', cream: '#FFF3D9' }
const paint = k => `var(--with-retro-${k}, ${HEX[k]})`
const mv = pts => pts.map(([x, y]) => [x + K.SHIFT, y + K.SHIFT])
const ell = (cx, cy, rx, ry, n = 64) => Array.from({ length: n }, (_, i) => {
  const a = 2 * Math.PI * i / n
  return [+(cx + rx * Math.cos(a)).toFixed(3), +(cy + ry * Math.sin(a)).toFixed(3)]
})
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
  const body = mv(ell(12, 15.2, 3.6, 4)), head = mv(ell(12, 9.1, 3, 2.9))
  const side = [[[9.9, 7.9], [6.8, 7], [4.5, 8.6]], [[9, 13], [5, 11.5], [3, 13.6]],
    [[8.6, 16], [5, 16.6], [3.4, 19.2]], [[10.1, 18.3], [7.6, 20], [7, 21.6]]]
  const legs = []
  for (const l of side) { legs.push({ pts: mv(l) }); legs.push({ pts: mv(l.map(([x, y]) => [24 - x, y])) }) }
  const thread = [{ pts: mv([[12, 1.8], [12, 7]]) }]

  // the abdomen ring stops at the head so the head stays one clean disc
  const inkBody = F.subtract(F.strokes([{ pts: body, closed: true }], K.W, 1.2), F.region([head], 1.2))
  F.strokes([{ pts: head, closed: true }], K.W, 1.2, inkBody)
  const inkLegs = F.strokes(legs, 2.1, 1.2)
  const inkThread = F.strokes(thread, 1.6, 1.2)
  const sil = F.union(F.union(F.copy(inkBody), F.copy(inkLegs)), F.copy(inkThread))
  F.region([body], 1.2, sil)
  F.region([head], 1.2, sil)
  const under = F.offset(F.copy(inkBody), K.TUCK)
  const face = r => F.subtract(F.region([r], 1.2), under)
  const shadow = F.subtract(F.shift(sil, K.OFF, K.OFF, 1.2), F.offset(F.copy(sil), 0.25))
  const shine = F.strokes([{ pts: mv([[10.6, 13.4], [10.3, 15.4]]) }], 0.9, 1.2)
  return [
    node(shadow, paint('shadow'), 'wm-shadow'),
    node(face(body), paint(3)),
    node(face(head), paint(1)),
    node(F.subtract(shine, F.offset(F.copy(inkBody), 0.15)), paint(1), 'wm-shine'),
    node(inkLegs, null, 'wm-a', true),
    node(inkBody, null, null, true),
    node(inkThread, null, 'wm-s', true),
  ].filter(Boolean)
}
