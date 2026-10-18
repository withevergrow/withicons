// forge/hand/retro/avatar-older-man.mjs — a bald head in skin tone with two grey side tufts, ink eyes and a bold ink
// mustache over blue shoulders; replaces the generated avatar whose full black hair and beard hid the face.
import * as F from '../../styles/_retro-field.mjs'
import { loopsD, K } from '../../styles/_retro-core.mjs'
import { parsePath } from '../../kernel/geom.mjs'

const HEX = { 1: '#F9BB89', 2: '#C4C9D1', 3: '#DAC08F', 4: '#3F6E9E', shadow: '#6B3323' }
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

const HEAD = 'M17.8 9.8 A5.8 6.2 0 1 1 6.2 9.8 A5.8 6.2 0 1 1 17.8 9.8 Z'
const L_TUFT = 'M6.9 6.4 C4.1 5.8 2.2 8.2 2.6 11 C2.8 12.5 4.2 13.3 6.5 12.9'
const R_TUFT = 'M17.1 6.4 C19.9 5.8 21.8 8.2 21.4 11 C21.2 12.5 19.8 13.3 17.5 12.9'
const L_FILL = 'M6.9 6.4 C4.1 5.8 2.2 8.2 2.6 11 C2.8 12.5 4.2 13.3 6.5 12.9 L8.5 9.8 Z'
const R_FILL = 'M17.1 6.4 C19.9 5.8 21.8 8.2 21.4 11 C21.2 12.5 19.8 13.3 17.5 12.9 L15.5 9.8 Z'
const SHOULDERS = 'M3.6 21.7 C3.6 19.2 5.8 17.6 8.4 17.6 C9.8 17.6 10.7 18.4 12 18.4 C13.3 18.4 14.2 17.6 15.6 17.6 C18.2 17.6 20.4 19.2 20.4 21.7 Z'
const STACHE = 'M9.3 12.9 C10.1 11.9 11.4 11.9 12 12.6 C12.6 11.9 13.9 11.9 14.7 12.9'

export default function render() {
  F.setClip(null)
  const M = 1.2
  const headR = F.region(rings(HEAD), M)
  const inkS = F.strokes(lines(SHOULDERS), K.W, M)
  const inkT = F.strokes(lines(L_TUFT + ' ' + R_TUFT), K.W * 0.75, M)
  const tuftR = F.union(F.region(rings(L_FILL), M), F.region(rings(R_FILL), M))
  const shR = F.region(rings(SHOULDERS), M)
  // head is in front of the shoulders and the tufts
  F.subtract(inkS, headR); F.subtract(inkT, headR); F.subtract(tuftR, headR); F.subtract(shR, headR)
  const inkH = F.strokes(lines(HEAD), K.W, M)
  F.strokes(lines('M9.6 8.8 V9.3 M14.4 8.8 V9.3'), 1.6, M, inkH)
  F.strokes(lines(STACHE), 1.7, M, inkH)
  const ink = F.union(F.union(inkS, inkT), inkH)
  const sil = F.copy(ink)
  F.union(sil, headR); F.union(sil, tuftR); F.union(sil, shR)
  const under = F.offset(F.copy(ink), K.TUCK)
  const shadow = F.subtract(F.shift(sil, K.OFF, K.OFF, 1.2), F.offset(F.copy(sil), 0.25))
  const out = [node(shadow, paint('shadow'), 'wm-shadow')]
  out.push(node(F.subtract(tuftR, under), paint(2)))
  out.push(node(F.subtract(headR, under), paint(1)))
  out.push(node(F.subtract(shR, under), paint(4)))
  const shine = F.strokes(lines('M9.2 6.4 C9.8 5.8 10.6 5.5 11.4 5.4'), 0.8, M)
  out.push(node(shine, `var(--with-retro-cream, #FFF3D9)`, 'wm-shine'))
  out.push(node(ink, null, null, true))
  return out.filter(Boolean)
}
