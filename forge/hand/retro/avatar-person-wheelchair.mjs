// forge/hand/retro/avatar-person-wheelchair.mjs — the line wheelchair user at retro weight: a skin-coloured head, one
// ink line for torso, thigh and footrest, a big ochre-filled wheel with a hub, the caster, and a single offset shadow;
// replaces the generated figure whose stacked shadows and thick outlines turned it into a dark mass at 16-24px.
import * as F from '../../styles/_retro-field.mjs'
import { loopsD, K } from '../../styles/_retro-core.mjs'

const HEX = { 1: '#F9BB89', 2: '#6E4428', 3: '#AA7732', shadow: '#6B3323', cream: '#FFF3D9' }
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
  const head = mv(ell(11, 4.1, 2.5, 2.5)), wheel = mv(ell(9, 16.4, 4.8, 4.8, 96)), caster = mv(ell(19.8, 19.6, 1.8, 1.8, 40))
  const frame = [{ pts: mv([[11, 7.3], [11, 12.6], [14.6, 12.6], [18.4, 17.2]]) }, { pts: mv([[13.6, 19.6], [18.4, 19.6]]) }]
  const ink = F.strokes([{ pts: head, closed: true }, { pts: wheel, closed: true }, ...frame], K.W, 1.2)
  F.region([caster], 1.2, ink)
  const hub = F.strokes([{ pts: mv([[9, 16.4]]) }], 1.7, 1.2)
  F.union(ink, hub)
  const sil = F.copy(ink)
  F.region([head], 1.2, sil)
  F.region([wheel], 1.2, sil)
  const under = F.offset(F.copy(ink), K.TUCK)
  const face = r => F.subtract(F.region([r], 1.2), under)
  const shadow = F.subtract(F.shift(sil, K.OFF, K.OFF, 1.2), F.offset(F.copy(sil), 0.25))
  return [
    node(shadow, paint('shadow'), 'wm-shadow'),
    node(face(wheel), paint(3)),
    node(face(head), paint(1)),
    node(ink, null, null, true),
  ].filter(Boolean)
}
