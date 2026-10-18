// forge/hand/retro/oven.mjs — a chunky range: mustard control strip with two knob dots, a big dark oven window with
// orange heat waves, sunset bands on the body around it and two feet; replaces the generated drawing whose faint
// window outline and heat lines turned to noise against the ink at 16-24px.
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
  const BODY = 'M6 2.5 H18 A2 2 0 0 1 20 4.5 V17.5 A2 2 0 0 1 18 19.5 H6 A2 2 0 0 1 4 17.5 V4.5 A2 2 0 0 1 6 2.5 Z'
  const ink = F.strokes(lines(BODY), K.W, 1.2)
  F.strokes(lines('M7 19.5 V21.6 M17 19.5 V21.6'), K.W, 1.2, ink)
  F.strokes(lines('M4 7.4 H20'), 1.9, 1.2, ink)
  // the oven window: a solid dark pane (ink) with the heat waves in orange on top (they read on the dark pane and on the pale one in dark mode)
  const win = F.region(rings('M7.5 9.6 H16.5 V15.9 H7.5 Z'), 1.2)
  F.offset(win, -0.35)
  F.union(ink, win)
  F.union(ink, F.strokes([dot(8.4, 4.9), dot(11.2, 4.9)], 2.1, 1.2))
  const sil = F.union(F.region(rings(BODY), 1.2), F.copy(ink))
  const under = F.offset(F.copy(ink), K.TUCK)
  const body = F.subtract(F.region(rings(BODY), 1.2), under)
  const waves = F.strokes(lines('M10 11.1 C9.3 11.8 9.3 12.4 10 13 C10.7 13.6 10.7 14.2 10 14.7 M12 11.1 C11.3 11.8 11.3 12.4 12 13 C12.7 13.6 12.7 14.2 12 14.7 M14 11.1 C13.3 11.8 13.3 12.4 14 13 C14.7 13.6 14.7 14.2 14 14.7'), 1.1, 1.2)
  // control strip (mustard) over three sunset bands, gaps hidden where they pass behind the window
  const B = [[0, 6.9, 1], [6.9, 12.6, 2], [13.2, 17.4, 3], [18.0, 24, 4]]
  const shadow = F.subtract(F.shift(sil, K.OFF, K.OFF, 1.2), F.offset(F.copy(sil), 0.25))
  const out = [node(shadow, paint('shadow'), 'wm-shadow')]
  for (const [y0, y1, c] of B) out.push(node(F.clipBand(F.copy(body), y0, y1), paint(c)))
  out.push(node(ink, null, null, true))
  out.push(node(waves, paint(2)))
  return out.filter(Boolean)
}
