// forge/hand/pastel/video-off.mjs — the pastel camera-off: a whole sky camcorder body and lavender horn (A), no lens to
// get chopped, crossed by a bold lit blush slash (w 3, S) with a deeper 0.8 rim in its own moat, so the slash keeps
// its contrast against the body on white at 16px where the thin flat slash and split body faded out.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()

export default function render(icon) {
  const { rr, poly, seg2 } = Prim
  const E = entriesOf([
    ['sky@K', rr(1.75, 5.25, 16, 18.75, 3.25)],
    ['lavender@A', poly([[15, 10], [22.25, 6.25], [22.25, 17.75], [15, 14]], [1, 1.5, 1.5, 1])],
    ['cut', seg2(2.75, 2.75, 21.25, 21.25, 5.4)],
    ['blush@S', seg2(3.25, 3.25, 20.75, 20.75, 3)],
  ], icon)
  for (const e of E) if (e.hue === 'blush' && e.mode !== 'ink') e.rim = 0.8
  const blush = { ...HUES.blush, rim: mix(HUES.blush.base, HUES.blush.deep, 0.85) }
  return paintEntries(E, { hues: { blush }, glint: true })
}
